import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, ne } from 'drizzle-orm';

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer le profil de l'utilisateur actuel
    const currentUserProfile = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (currentUserProfile.length === 0) {
      return NextResponse.json([]);
    }

    const user = currentUserProfile[0];

    // Trouver des utilisateurs avec un rôle opposé
    const oppositeRole = user.role === 'mentor' ? 'mentee' : 'mentor';
    const potentialMatches = await db
      .select()
      .from(users)
      .where(ne(users.clerkId, clerkUser.id));

    // Calculer la compatibilité simple (basée sur les intérêts communs)
    const matches = potentialMatches.map((match) => {
      let compatibility = 0;

      if (match.role === oppositeRole) {
        compatibility += 50; // Bonus pour le rôle opposé
      }

      // Compatibilité basée sur les intérêts communs
      if (user.interests && match.interests) {
        const commonInterests = user.interests.filter(interest =>
          match.interests?.includes(interest)
        );
        compatibility += commonInterests.length * 10;
      }

      // Compatibilité basée sur les compétences complémentaires
      if (user.skills && match.skills) {
        const complementarySkills = user.skills.filter(skill =>
          !match.skills?.includes(skill)
        );
        compatibility += complementarySkills.length * 5;
      }

      return {
        id: match.id,
        name: match.name,
        email: match.email,
        bio: match.bio,
        role: match.role,
        skills: match.skills,
        interests: match.interests,
        experience: match.experience,
        compatibility: Math.min(compatibility, 100),
      };
    });

    // Trier par compatibilité décroissante et limiter à 10 résultats
    const sortedMatches = matches
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, 10);

    return NextResponse.json(sortedMatches);
  } catch (error) {
    console.error('Erreur GET matching:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}