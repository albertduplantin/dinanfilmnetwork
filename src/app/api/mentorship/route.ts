import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { mentorshipSessions, users } from '@/lib/db/schema';
import { eq, or, and } from 'drizzle-orm';

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

    // Récupérer les sessions où l'utilisateur est mentor ou mentee
    const sessions = await db
      .select({
        id: mentorshipSessions.id,
        mentorId: mentorshipSessions.mentorId,
        menteeId: mentorshipSessions.menteeId,
        scheduledAt: mentorshipSessions.scheduledAt,
        status: mentorshipSessions.status,
        notes: mentorshipSessions.notes,
        mentorName: users.name,
        menteeName: users.name,
      })
      .from(mentorshipSessions)
      .leftJoin(users, or(
        eq(mentorshipSessions.mentorId, users.id),
        eq(mentorshipSessions.menteeId, users.id)
      ))
      .where(or(
        eq(mentorshipSessions.mentorId, userId),
        eq(mentorshipSessions.menteeId, userId)
      ));

    // Enrichir avec les informations de rôle
    const enrichedSessions = sessions.map(session => ({
      ...session,
      isMentor: session.mentorId === userId,
    }));

    return NextResponse.json(enrichedSessions);
  } catch (error) {
    console.error('Erreur GET mentorship:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { connectedUserId, scheduledAt, notes } = body;

    const currentUserProfile = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (currentUserProfile.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const userId = currentUserProfile[0].id;
    const userRole = currentUserProfile[0].role;

    // Déterminer qui est mentor et qui est mentee
    const mentorId = userRole === 'mentor' ? userId : parseInt(connectedUserId);
    const menteeId = userRole === 'mentee' ? userId : parseInt(connectedUserId);

    await db.insert(mentorshipSessions).values({
      mentorId,
      menteeId,
      scheduledAt: new Date(scheduledAt),
      status: 'pending',
      notes,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur POST mentorship:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}