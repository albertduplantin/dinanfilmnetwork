import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { discussionGroups, users, groupMembers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const clerkUser = await currentUser();

    let whereCondition = undefined;
    if (category !== 'all') {
      whereCondition = eq(discussionGroups.category, category);
    }

    const groups = await db
      .select({
        id: discussionGroups.id,
        name: discussionGroups.name,
        description: discussionGroups.description,
        category: discussionGroups.category,
        createdBy: discussionGroups.createdBy,
        isPrivate: discussionGroups.isPrivate,
        memberCount: discussionGroups.memberCount,
        createdAt: discussionGroups.createdAt,
        creatorName: users.name,
      })
      .from(discussionGroups)
      .leftJoin(users, eq(discussionGroups.createdBy, users.id))
      .where(whereCondition);

    // Enrichir avec l'information de membre si utilisateur connecté
    if (clerkUser) {
      const userProfile = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkUser.id))
        .limit(1);

      if (userProfile.length > 0) {
        const userId = userProfile[0].id;
        const memberGroups = await db
          .select({ groupId: groupMembers.groupId })
          .from(groupMembers)
          .where(eq(groupMembers.userId, userId));

        const memberGroupIds = new Set(memberGroups.map(mg => mg.groupId));

        const enrichedGroups = groups.map(group => ({
          ...group,
          isMember: memberGroupIds.has(group.id),
        }));

        return NextResponse.json(enrichedGroups);
      }
    }

    // Si pas d'utilisateur connecté, tous les groupes sont marqués comme non-membre
    const enrichedGroups = groups.map(group => ({
      ...group,
      isMember: false,
    }));

    return NextResponse.json(enrichedGroups);
  } catch (error) {
    console.error('Erreur GET groups:', error);
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
    const { name, description, category, isPrivate } = body;

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

    // Créer le groupe
    const newGroup = await db.insert(discussionGroups).values({
      name,
      description,
      category,
      createdBy: userId,
      isPrivate: isPrivate || false,
      memberCount: 1, // Le créateur est automatiquement membre
    }).returning();

    // Ajouter le créateur comme membre et admin
    await db.insert(groupMembers).values({
      groupId: newGroup[0].id,
      userId,
      role: 'admin',
    });

    return NextResponse.json(newGroup[0]);
  } catch (error) {
    console.error('Erreur POST groups:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}