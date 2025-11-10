import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users, groupMembers, discussionGroups } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const groupId = parseInt(params.id);

    // Récupérer l'ID utilisateur
    const userProfile = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (userProfile.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const userId = userProfile[0].id;

    // Vérifier si l'utilisateur est membre du groupe
    const membership = await db
      .select()
      .from(groupMembers)
      .where(and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userId, userId)
      ))
      .limit(1);

    if (membership.length === 0) {
      return NextResponse.json({ error: 'Vous n\'êtes pas membre de ce groupe' }, { status: 400 });
    }

    // Vérifier si c'est le dernier admin (empêcher de quitter si c'est le cas)
    if (membership[0].role === 'admin') {
      const adminCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(groupMembers)
        .where(and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.role, 'admin')
        ));

      if (adminCount[0].count <= 1) {
        return NextResponse.json({ error: 'Vous ne pouvez pas quitter le groupe en tant que dernier administrateur' }, { status: 400 });
      }
    }

    // Supprimer l'utilisateur du groupe
    await db
      .delete(groupMembers)
      .where(and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userId, userId)
      ));

    // Décrémenter le compteur de membres
    await db
      .update(discussionGroups)
      .set({
        memberCount: sql`${discussionGroups.memberCount} - 1`
      })
      .where(eq(discussionGroups.id, groupId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur POST leave group:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}