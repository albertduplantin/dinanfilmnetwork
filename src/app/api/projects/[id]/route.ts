import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { projects, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const resolvedParams = await params;
    const projectId = parseInt(resolvedParams.id);
    const body = await request.json();
    const {
      title,
      description,
      genre,
      duration,
      productionYear,
      status,
      videoUrl,
      thumbnailUrl
    } = body;

    // Vérifier que le projet appartient à l'utilisateur
    const currentUserProfile = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (currentUserProfile.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const userId = currentUserProfile[0].id;

    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    if (project[0].userId !== userId) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Mettre à jour le projet
    const updatedProject = await db
      .update(projects)
      .set({
        title,
        description,
        genre,
        duration: duration ? parseInt(duration) : null,
        productionYear: productionYear ? parseInt(productionYear) : null,
        status,
        videoUrl,
        thumbnailUrl,
      })
      .where(eq(projects.id, projectId))
      .returning();

    return NextResponse.json(updatedProject[0]);
  } catch (error) {
    console.error('Erreur PUT project:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const resolvedParams = await params;
    const projectId = parseInt(resolvedParams.id);

    // Vérifier que le projet appartient à l'utilisateur
    const currentUserProfile = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (currentUserProfile.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const userId = currentUserProfile[0].id;

    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    if (project[0].userId !== userId) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Supprimer le projet (les médias seront supprimés automatiquement grâce aux contraintes FK)
    await db.delete(projects).where(eq(projects.id, projectId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE project:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}