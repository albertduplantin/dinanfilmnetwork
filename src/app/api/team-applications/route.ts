import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { teamApplications, users, teamProjects } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

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
    const { projectId, appliedRole, message } = body;

    // Vérifier que le projet existe et recrute
    const project = await db
      .select()
      .from(teamProjects)
      .where(eq(teamProjects.id, parseInt(projectId)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    if (project[0].status !== 'recruiting') {
      return NextResponse.json({ error: 'Ce projet n\'accepte plus de candidatures' }, { status: 400 });
    }

    // Vérifier que l'utilisateur n'a pas déjà postulé
    const existingApplication = await db
      .select()
      .from(teamApplications)
      .where(
        and(
          eq(teamApplications.projectId, parseInt(projectId)),
          eq(teamApplications.applicantId, userId)
        )
      )
      .limit(1);

    if (existingApplication.length > 0) {
      return NextResponse.json({ error: 'Vous avez déjà postulé à ce projet' }, { status: 400 });
    }

    // Créer la candidature
    await db.insert(teamApplications).values({
      projectId: parseInt(projectId),
      applicantId: userId,
      appliedRole,
      message: message || null,
      status: 'pending',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur POST team-applications:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}