import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { connections, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { connectedUserId } = body;

    // Récupérer l'ID de l'utilisateur actuel
    const currentUserProfile = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (currentUserProfile.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const userId = currentUserProfile[0].id;

    // Vérifier si une connexion existe déjà
    const existingConnection = await db
      .select()
      .from(connections)
      .where(
        and(
          eq(connections.userId, userId),
          eq(connections.connectedUserId, connectedUserId)
        )
      )
      .limit(1);

    if (existingConnection.length > 0) {
      return NextResponse.json({ error: 'Connexion déjà existante' }, { status: 400 });
    }

    // Créer la connexion
    await db.insert(connections).values({
      userId,
      connectedUserId,
      status: 'pending',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur POST connections:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}