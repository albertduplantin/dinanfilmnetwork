import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { mentorshipSessions } from '@/lib/db/schema';
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
    const sessionId = parseInt(resolvedParams.id);
    const body = await request.json();
    const { status } = body;

    // Vérifier que l'utilisateur participe à cette session
    const session = await db
      .select()
      .from(mentorshipSessions)
      .where(eq(mentorshipSessions.id, sessionId))
      .limit(1);

    if (session.length === 0) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 });
    }

    // TODO: Ajouter vérification que l'utilisateur est bien mentor ou mentee de cette session

    await db
      .update(mentorshipSessions)
      .set({ status })
      .where(eq(mentorshipSessions.id, sessionId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur PUT mentorship session:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}