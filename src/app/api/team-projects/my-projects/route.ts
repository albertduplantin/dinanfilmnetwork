import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { teamProjects, users, teamApplications } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';

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

    // Récupérer les projets créés par l'utilisateur avec le nombre de candidatures
    const myProjects = await db
      .select({
        id: teamProjects.id,
        creatorId: teamProjects.creatorId,
        title: teamProjects.title,
        description: teamProjects.description,
        genre: teamProjects.genre,
        projectType: teamProjects.projectType,
        status: teamProjects.status,
        budget: teamProjects.budget,
        deadline: teamProjects.deadline,
        location: teamProjects.location,
        requiredRoles: teamProjects.requiredRoles,
        createdAt: teamProjects.createdAt,
        creatorName: users.name,
        applicationsCount: count(teamApplications.id),
      })
      .from(teamProjects)
      .leftJoin(users, eq(teamProjects.creatorId, users.id))
      .leftJoin(teamApplications, eq(teamProjects.id, teamApplications.projectId))
      .where(eq(teamProjects.creatorId, userId))
      .groupBy(teamProjects.id, users.name)
      .orderBy(teamProjects.createdAt);

    return NextResponse.json(myProjects);
  } catch (error) {
    console.error('Erreur GET my-projects:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}