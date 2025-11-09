import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { projects, projectMedia, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const currentUserProfile = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (currentUserProfile.length === 0) {
      return NextResponse.json([]);
    }

    const userId = currentUserProfile[0].id;

    // Récupérer les projets de l'utilisateur avec leurs médias
    const userProjects = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        genre: projects.genre,
        duration: projects.duration,
        productionYear: projects.productionYear,
        status: projects.status,
        videoUrl: projects.videoUrl,
        thumbnailUrl: projects.thumbnailUrl,
        views: projects.views,
        likes: projects.likes,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(projects.createdAt);

    // Pour chaque projet, récupérer les médias
    const projectsWithMedia = await Promise.all(
      userProjects.map(async (project) => {
        const media = await db
          .select()
          .from(projectMedia)
          .where(eq(projectMedia.projectId, project.id))
          .orderBy(projectMedia.order);

        return {
          ...project,
          media,
          liked: false, // TODO: Implémenter la logique de like
        };
      })
    );

    return NextResponse.json(projectsWithMedia);
  } catch (error) {
    console.error('Erreur GET projects:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const currentUserProfile = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (currentUserProfile.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const userId = currentUserProfile[0].id;
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

    const newProject = await db.insert(projects).values({
      userId,
      title,
      description,
      genre,
      duration: duration ? parseInt(duration) : null,
      productionYear: productionYear ? parseInt(productionYear) : null,
      status,
      videoUrl,
      thumbnailUrl,
    }).returning();

    return NextResponse.json(newProject[0]);
  } catch (error) {
    console.error('Erreur POST projects:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}