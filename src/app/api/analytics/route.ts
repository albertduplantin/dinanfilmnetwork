import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users, userAnalytics, userAchievements, projects, connections, mentorshipSessions, teamApplications } from '@/lib/db/schema';
import { eq, sql, and, gte, lte, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'monthly';

    // Récupérer l'ID utilisateur
    const currentUserProfile = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (currentUserProfile.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const userId = currentUserProfile[0].id;

    // Calculer la période
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'yearly':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Récupérer les métriques de base
    const profileViews = await db
      .select({ count: sql<number>`count(*)` })
      .from(userAnalytics)
      .where(and(
        eq(userAnalytics.userId, userId),
        eq(userAnalytics.metricType, 'profile_views'),
        gte(userAnalytics.date, startDate)
      ));

    const projectViews = await db
      .select({ count: sql<number>`count(*)` })
      .from(userAnalytics)
      .where(and(
        eq(userAnalytics.userId, userId),
        eq(userAnalytics.metricType, 'project_views'),
        gte(userAnalytics.date, startDate)
      ));

    const connectionsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(connections)
      .where(and(
        eq(connections.userId, userId),
        gte(connections.createdAt, startDate)
      ));

    // Pour l'instant, on met 0 pour les applications (fonctionnalité à implémenter)
    const applicationsCount = [{ count: 0 }];

    const mentorshipCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(mentorshipSessions)
      .where(and(
        or(eq(mentorshipSessions.mentorId, userId), eq(mentorshipSessions.menteeId, userId)),
        gte(mentorshipSessions.createdAt, startDate)
      ));

    // Récupérer les achievements
    const achievements = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(userAchievements.unlockedAt);

    // Générer des statistiques mensuelles simulées (pour la démo)
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyStats.push({
        month: monthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        profileViews: Math.floor(Math.random() * 50) + 10,
        projectViews: Math.floor(Math.random() * 100) + 20,
        connections: Math.floor(Math.random() * 10) + 1,
      });
    }

    // Vérifier et attribuer des achievements automatiquement
    await checkAndAwardAchievements(userId, {
      profileViews: profileViews[0]?.count || 0,
      projectViews: projectViews[0]?.count || 0,
      connections: connectionsCount[0]?.count || 0,
      mentorshipSessions: mentorshipCount[0]?.count || 0,
    });

    const analytics = {
      profileViews: profileViews[0]?.count || 0,
      projectViews: projectViews[0]?.count || 0,
      connections: connectionsCount[0]?.count || 0,
      applications: applicationsCount[0]?.count || 0,
      mentorshipSessions: mentorshipCount[0]?.count || 0,
      achievements,
      monthlyStats,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Erreur GET analytics:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

async function checkAndAwardAchievements(userId: number, stats: any) {
  const existingAchievements = await db
    .select()
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId));

  const achievementTypes = existingAchievements.map(a => a.achievementType);

  // Achievement: Premier projet
  if (stats.projectViews > 0 && !achievementTypes.includes('first_project')) {
    await db.insert(userAchievements).values({
      userId,
      achievementType: 'first_project',
      achievementName: 'Premier projet',
      achievementDescription: 'Vous avez partagé votre premier projet !',
    });
  }

  // Achievement: Mentor actif
  if (stats.mentorshipSessions >= 5 && !achievementTypes.includes('mentor_sessions')) {
    await db.insert(userAchievements).values({
      userId,
      achievementType: 'mentor_sessions',
      achievementName: 'Mentor expérimenté',
      achievementDescription: 'Vous avez participé à 5 sessions de mentorat !',
    });
  }

  // Achievement: Réseau étendu
  if (stats.connections >= 10 && !achievementTypes.includes('network_growth')) {
    await db.insert(userAchievements).values({
      userId,
      achievementType: 'network_growth',
      achievementName: 'Réseau étendu',
      achievementDescription: 'Vous avez établi 10 connexions sur la plateforme !',
    });
  }

  // Achievement: Profil populaire
  if (stats.profileViews >= 50 && !achievementTypes.includes('popular_profile')) {
    await db.insert(userAchievements).values({
      userId,
      achievementType: 'popular_profile',
      achievementName: 'Profil populaire',
      achievementDescription: 'Votre profil a été consulté 50 fois !',
    });
  }
}