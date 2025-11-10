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

    // Vérifier que le groupe existe
    const group = await db
      .select()
      .from(discussionGroups)
      .where(eq(discussionGroups.id, groupId))
      .limit(1);

    if (group.length === 0) {
      return NextResponse.json({ error: 'Groupe non trouvé' }, { status: 404 });
    }

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

    // Vérifier si l'utilisateur est déjà membre
    const existingMembership = await db
      .select()
      .from(groupMembers)
      .where(and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userId, userId)
      ))
      .limit(1);

    if (existingMembership.length > 0) {
      return NextResponse.json({ error: 'Déjà membre de ce groupe' }, { status: 400 });
    }

    // Si le groupe est privé, vérifier les permissions (simplifié pour l'instant)
    if (group[0].isPrivate) {
      // TODO: Implémenter la logique d'invitation
      return NextResponse.json({ error: 'Ce groupe est privé' }, { status: 403 });
    }

    // Ajouter l'utilisateur au groupe
    await db.insert(groupMembers).values({
      groupId,
      userId,
      role: 'member',
    });

    // Incrémenter le compteur de membres
    await db
      .update(discussionGroups)
      .set({
        memberCount: sql`${discussionGroups.memberCount} + 1`
      })
      .where(eq(discussionGroups.id, groupId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur POST join group:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}