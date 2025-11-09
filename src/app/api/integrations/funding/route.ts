import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { fundingOpportunities } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const opportunities = await db
      .select()
      .from(fundingOpportunities)
      .where(eq(fundingOpportunities.isActive, true))
      .orderBy(fundingOpportunities.deadline);

    return NextResponse.json(opportunities);
  } catch (error) {
    console.error('Erreur GET funding opportunities:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Endpoint pour initialiser des données de test (sera appelé une fois)
export async function POST() {
  try {
    const testOpportunities = [
      {
        externalId: 'cnc-creation-2024',
        title: 'Aide à la création CNC',
        description: 'Soutien financier pour les courts métrages de création. Ouvert aux jeunes réalisateurs.',
        organization: 'Centre National du Cinéma',
        amount: 30000,
        deadline: new Date('2024-12-31'),
        eligibility: 'Réalisateurs français ou européens, courts métrages de fiction',
        applicationUrl: 'https://www.cnc.fr/professionnels/aides-et-financements/aide-a-la-creation',
        category: 'short_film',
        region: 'france',
        isActive: true,
      },
      {
        externalId: 'bretagne-cinema-2024',
        title: 'Fonds régional cinéma Bretagne',
        description: 'Aides financières pour les projets cinématographiques en Bretagne.',
        organization: 'Région Bretagne',
        amount: 15000,
        deadline: new Date('2024-11-30'),
        eligibility: 'Projets tournés en Bretagne, priorité aux courts métrages',
        applicationUrl: 'https://www.bretagne-cinema.fr/aides-regionales',
        category: 'film',
        region: 'bretagne',
        isActive: true,
      },
      {
        externalId: 'sacem-jeunes-talents-2024',
        title: 'Bourse SACEM Jeunes Talents',
        description: 'Bourse pour les jeunes compositeurs de musique de film.',
        organization: 'SACEM',
        amount: 8000,
        deadline: new Date('2024-10-15'),
        eligibility: 'Compositeurs de moins de 30 ans',
        applicationUrl: 'https://www.sacem.fr/partenaires/bourses-et-aides',
        category: 'film',
        region: 'france',
        isActive: true,
      },
      {
        externalId: 'media-program-europe-2024',
        title: 'Programme MEDIA Europe Créative',
        description: 'Soutien européen pour le développement de projets audiovisuels.',
        organization: 'Commission Européenne',
        amount: 50000,
        deadline: new Date('2024-12-15'),
        eligibility: 'Projets européens, priorité aux coproductions',
        applicationUrl: 'https://www.creative-europe.eu/funding/media',
        category: 'film',
        region: 'europe',
        isActive: true,
      },
      {
        externalId: 'cnc-animation-2024',
        title: 'Aide à l\'animation CNC',
        description: 'Soutien spécifique pour les projets d\'animation française.',
        organization: 'Centre National du Cinéma',
        amount: 45000,
        deadline: new Date('2024-11-20'),
        eligibility: 'Projets d\'animation français, courts et longs métrages',
        applicationUrl: 'https://www.cnc.fr/professionnels/aides-et-financements/aide-a-l-animation',
        category: 'animation',
        region: 'france',
        isActive: true,
      },
    ];

    for (const opportunity of testOpportunities) {
      await db.insert(fundingOpportunities).values(opportunity);
    }

    return NextResponse.json({ success: true, message: 'Opportunités ajoutées' });
  } catch (error) {
    console.error('Erreur POST funding opportunities:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}