import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { marketplaceListings, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const listings = await db
      .select({
        id: marketplaceListings.id,
        sellerId: marketplaceListings.sellerId,
        title: marketplaceListings.title,
        description: marketplaceListings.description,
        category: marketplaceListings.category,
        subcategory: marketplaceListings.subcategory,
        price: marketplaceListings.price,
        priceType: marketplaceListings.priceType,
        location: marketplaceListings.location,
        availability: marketplaceListings.availability,
        condition: marketplaceListings.condition,
        images: marketplaceListings.images,
        contactMethod: marketplaceListings.contactMethod,
        isActive: marketplaceListings.isActive,
        featured: marketplaceListings.featured,
        createdAt: marketplaceListings.createdAt,
        sellerName: users.name,
        sellerEmail: users.email,
      })
      .from(marketplaceListings)
      .leftJoin(users, eq(marketplaceListings.sellerId, users.id))
      .where(eq(marketplaceListings.isActive, true))
      .orderBy(marketplaceListings.createdAt);

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Erreur GET marketplace:', error);
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
    const {
      title,
      description,
      category,
      subcategory,
      price,
      priceType,
      location,
      availability,
      condition,
      images,
      contactMethod,
    } = body;

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

    // Créer l'annonce
    const newListing = await db.insert(marketplaceListings).values({
      sellerId: userId,
      title,
      description,
      category,
      subcategory,
      price: price ? price * 100 : null, // Convert to cents
      priceType,
      location,
      availability,
      condition,
      images,
      contactMethod,
      isActive: true,
      featured: false,
    }).returning();

    return NextResponse.json(newListing[0]);
  } catch (error) {
    console.error('Erreur POST marketplace:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}