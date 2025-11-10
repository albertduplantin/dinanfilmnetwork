import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { marketplaceInquiries, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, message } = body;

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

    // Créer la demande
    const newInquiry = await db.insert(marketplaceInquiries).values({
      listingId: parseInt(listingId),
      buyerId: userId,
      message,
      status: 'pending',
    }).returning();

    return NextResponse.json(newInquiry[0]);
  } catch (error) {
    console.error('Erreur POST marketplace inquiry:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}