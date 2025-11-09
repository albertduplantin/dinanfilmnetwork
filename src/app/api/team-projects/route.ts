import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { teamProjects, users, teamApplications } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';

export async function GET() {
  try {
    const currentUserData = await currentUser();
    if (!currentUserData) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer tous les projets avec le nom du créateur et le nombre de candidatures
    const projects = await db
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
      .where(eq(teamProjects.status, 'recruiting'))
      .groupBy(teamProjects.id, users.name)
      .orderBy(teamProjects.createdAt);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Erreur GET team-projects:', error);
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
      projectType,
      budget,
      deadline,
      location,
      requiredRoles
    } = body;

    const newProject = await db.insert(teamProjects).values({
      creatorId: userId,
      title,
      description,
      genre,
      projectType,
      status: 'recruiting',
      budget: budget ? parseInt(budget) : null,
      deadline: deadline ? new Date(deadline) : null,
      location,
      requiredRoles,
    }).returning();

    return NextResponse.json(newProject[0]);
  } catch (error) {
    console.error('Erreur POST team-projects:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}