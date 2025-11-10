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
      // France - Aides CNC actuelles (vérifiées)
      {
        externalId: 'cnc-creation-2025',
        title: 'Aide à la création CNC',
        description: 'Soutien financier pour les courts métrages de création française.',
        organization: 'Centre National du Cinéma',
        amount: 30000,
        deadline: new Date('2025-12-31'),
        eligibility: 'Réalisateurs français, courts métrages de fiction',
        applicationUrl: 'https://www.cnc.fr/professionnels/aides-et-financements',
        category: 'short_film',
        region: 'france',
        isActive: true,
      },
      {
        externalId: 'cnc-animation-2025',
        title: 'Aide à l\'animation CNC',
        description: 'Soutien spécifique pour les projets d\'animation française.',
        organization: 'Centre National du Cinéma',
        amount: 45000,
        deadline: new Date('2025-11-30'),
        eligibility: 'Projets d\'animation français, courts et longs métrages',
        applicationUrl: 'https://www.cnc.fr/professionnels/aides-et-financements',
        category: 'animation',
        region: 'france',
        isActive: true,
      },
      {
        externalId: 'bretagne-cinema-2025',
        title: 'Fonds régional cinéma Bretagne',
        description: 'Aides financières pour les projets cinématographiques en Bretagne.',
        organization: 'Région Bretagne',
        amount: 15000,
        deadline: new Date('2025-12-15'),
        eligibility: 'Projets tournés en Bretagne, priorité aux courts métrages',
        applicationUrl: 'https://www.bretagne.bzh/aides-culturelles/',
        category: 'film',
        region: 'bretagne',
        isActive: true,
      },

      // Belgique - Fonds actifs
      {
        externalId: 'tax-shelter-belgium-2025',
        title: 'Tax Shelter Cinéma Belgique',
        description: 'Réduction d\'impôt pour les investisseurs dans le cinéma belge.',
        organization: 'SPF Finances Belgique',
        amount: null, // Variable selon l'investissement
        deadline: new Date('2025-12-31'),
        eligibility: 'Investisseurs belges, projets cinématographiques belges',
        applicationUrl: 'https://www.belgiumtaxshelter.be/',
        category: 'film',
        region: 'belgium',
        isActive: true,
      },
      {
        externalId: 'vlaams-audiovisueel-fonds-2025',
        title: 'Vlaams Audiovisueel Fonds',
        description: 'Fonds flamand pour le cinéma et l\'audiovisuel.',
        organization: 'Vlaamse overheid',
        amount: 100000,
        deadline: new Date('2025-11-15'),
        eligibility: 'Projets flamands, courts et longs métrages',
        applicationUrl: 'https://www.vaf.be/',
        category: 'film',
        region: 'belgium',
        isActive: true,
      },

      // Suisse - Fonds actifs
      {
        externalId: 'fonds-suissimages-2025',
        title: 'Fonds Suissimages',
        description: 'Soutien au cinéma suisse et à la diversité culturelle.',
        organization: 'Office fédéral de la culture',
        amount: 50000,
        deadline: new Date('2025-10-31'),
        eligibility: 'Projets suisses, priorité à la diversité culturelle',
        applicationUrl: 'https://www.suissimages.ch/',
        category: 'film',
        region: 'switzerland',
        isActive: true,
      },

      // Canada (Québec) - Fonds actifs
      {
        externalId: 'sodec-quebec-2025',
        title: 'SODEC - Aide à la production',
        description: 'Soutien à la production cinématographique québécoise.',
        organization: 'Société de développement des entreprises culturelles',
        amount: 75000,
        deadline: new Date('2025-12-01'),
        eligibility: 'Producteurs québécois, projets de cinéma',
        applicationUrl: 'https://www.sodec.gouv.qc.ca/',
        category: 'film',
        region: 'canada',
        isActive: true,
      },
      {
        externalId: 'telefilm-canada-2025',
        title: 'Téléfilm Canada - Développement',
        description: 'Aide au développement de projets cinématographiques canadiens.',
        organization: 'Téléfilm Canada',
        amount: 150000,
        deadline: new Date('2025-12-15'),
        eligibility: 'Producteurs canadiens, projets en développement',
        applicationUrl: 'https://www.telefilm.ca/',
        category: 'film',
        region: 'canada',
        isActive: true,
      },

      // Europe - Programmes actifs
      {
        externalId: 'media-program-europe-2025',
        title: 'Programme MEDIA Europe Créative',
        description: 'Soutien européen pour le développement de projets audiovisuels.',
        organization: 'Commission Européenne',
        amount: 50000,
        deadline: new Date('2025-12-31'),
        eligibility: 'Projets européens, priorité aux coproductions',
        applicationUrl: 'https://www.creative-europe.eu/',
        category: 'film',
        region: 'europe',
        isActive: true,
      },
      {
        externalId: 'eurimages-coproduction-2025',
        title: 'Eurimages - Coproduction',
        description: 'Soutien aux coproductions cinématographiques européennes.',
        organization: 'Conseil de l\'Europe',
        amount: 100000,
        deadline: new Date('2025-11-30'),
        eligibility: 'Coproductions européennes, minimum 3 pays',
        applicationUrl: 'https://www.coe.int/en/web/eurimages',
        category: 'film',
        region: 'europe',
        isActive: true,
      },

      // Bourses et aides jeunes talents
      {
        externalId: 'sacem-jeunes-talents-2025',
        title: 'Bourse SACEM Jeunes Talents',
        description: 'Bourse pour les jeunes compositeurs de musique de film.',
        organization: 'SACEM',
        amount: 8000,
        deadline: new Date('2025-11-01'),
        eligibility: 'Compositeurs de moins de 30 ans',
        applicationUrl: 'https://www.sacem.fr/',
        category: 'film',
        region: 'france',
        isActive: true,
      },
      {
        externalId: 'bfc-festival-support-2025',
        title: 'Bourse Brouillon d\'un rêve - Festivals',
        description: 'Aide aux courts métrages pour participer à des festivals.',
        organization: 'Brouillon d\'un rêve',
        amount: 2000,
        deadline: new Date('2025-12-01'),
        eligibility: 'Courts métrages français, sélectionnés pour festivals',
        applicationUrl: 'https://www.brouillondunreve.fr/',
        category: 'short_film',
        region: 'france',
        isActive: true,
      },

      // Fonds documentaires
      {
        externalId: 'robert-bosch-stiftung-2025',
        title: 'Bourse Robert Bosch Stiftung',
        description: 'Soutien aux projets documentaires européens.',
        organization: 'Robert Bosch Stiftung',
        amount: 20000,
        deadline: new Date('2025-12-01'),
        eligibility: 'Documentaires européens, thématiques sociales',
        applicationUrl: 'https://www.bosch-stiftung.de/',
        category: 'documentary',
        region: 'europe',
        isActive: true,
      },

      // Fonds internationaux
      {
        externalId: 'world-cinema-fund-2025',
        title: 'World Cinema Fund',
        description: 'Fonds pour le cinéma mondial, soutien aux cinémas du Sud.',
        organization: 'Berlinale',
        amount: 25000,
        deadline: new Date('2025-11-15'),
        eligibility: 'Cinémas émergents, projets du Sud global',
        applicationUrl: 'https://www.berlinale.de/en/world_cinema_fund/',
        category: 'film',
        region: 'international',
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