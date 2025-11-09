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
      // France
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
      {
        externalId: 'cnc-distribution-2024',
        title: 'Aide à la distribution CNC',
        description: 'Soutien pour la distribution de films français à l\'international.',
        organization: 'Centre National du Cinéma',
        amount: 25000,
        deadline: new Date('2024-11-15'),
        eligibility: 'Distributeurs français, films français',
        applicationUrl: 'https://www.cnc.fr/professionnels/aides-et-financements/aide-a-la-distribution',
        category: 'film',
        region: 'france',
        isActive: true,
      },
      {
        externalId: 'bfc-festival-support-2024',
        title: 'Bourse Brouillon d\'un rêve - Festivals',
        description: 'Aide aux courts métrages pour participer à des festivals internationaux.',
        organization: 'Brouillon d\'un rêve',
        amount: 2000,
        deadline: new Date('2024-12-01'),
        eligibility: 'Courts métrages français, sélectionnés pour festivals',
        applicationUrl: 'https://www.brouillondunreve.fr/',
        category: 'short_film',
        region: 'france',
        isActive: true,
      },

      // Belgique
      {
        externalId: 'tax-shelter-belgium-2024',
        title: 'Tax Shelter Cinéma Belgique',
        description: 'Réduction d\'impôt pour les investisseurs dans le cinéma belge.',
        organization: 'Gouvernement fédéral belge',
        amount: null, // Variable selon l'investissement
        deadline: new Date('2024-12-31'),
        eligibility: 'Investisseurs belges, projets cinématographiques belges',
        applicationUrl: 'https://www.taxshelter.be/',
        category: 'film',
        region: 'belgium',
        isActive: true,
      },
      {
        externalId: 'vlaams-audiovisueel-fonds-2024',
        title: 'Vlaams Audiovisueel Fonds',
        description: 'Fonds flamand pour le cinéma et l\'audiovisuel.',
        organization: 'Vlaamse overheid',
        amount: 100000,
        deadline: new Date('2024-11-01'),
        eligibility: 'Projets flamands, courts et longs métrages',
        applicationUrl: 'https://www.vaf.be/',
        category: 'film',
        region: 'belgium',
        isActive: true,
      },

      // Suisse
      {
        externalId: 'fonds-suissimages-2024',
        title: 'Fonds Suissimages',
        description: 'Soutien au cinéma suisse et à la diversité culturelle.',
        organization: 'Office fédéral de la culture',
        amount: 50000,
        deadline: new Date('2024-10-31'),
        eligibility: 'Projets suisses, priorité à la diversité culturelle',
        applicationUrl: 'https://www.suissimages.ch/',
        category: 'film',
        region: 'switzerland',
        isActive: true,
      },
      {
        externalId: 'zurich-film-foundation-2024',
        title: 'Fonds de production cinéma Zurich',
        description: 'Aide à la production cinématographique dans le canton de Zurich.',
        organization: 'Ville de Zurich',
        amount: 30000,
        deadline: new Date('2024-12-15'),
        eligibility: 'Projets tournés à Zurich, réalisateurs suisses',
        applicationUrl: 'https://www.stadt-zuerich.ch/kultur/de/index.html',
        category: 'film',
        region: 'switzerland',
        isActive: true,
      },

      // Canada (Québec)
      {
        externalId: 'sodec-quebec-2024',
        title: 'SODEC - Aide à la production',
        description: 'Soutien à la production cinématographique québécoise.',
        organization: 'Société de développement des entreprises culturelles',
        amount: 75000,
        deadline: new Date('2024-11-30'),
        eligibility: 'Producteurs québécois, projets de cinéma',
        applicationUrl: 'https://www.sodec.gouv.qc.ca/',
        category: 'film',
        region: 'canada',
        isActive: true,
      },
      {
        externalId: 'telefilm-canada-2024',
        title: 'Téléfilm Canada - Développement',
        description: 'Aide au développement de projets cinématographiques canadiens.',
        organization: 'Téléfilm Canada',
        amount: 150000,
        deadline: new Date('2024-12-01'),
        eligibility: 'Producteurs canadiens, projets en développement',
        applicationUrl: 'https://www.telefilm.ca/',
        category: 'film',
        region: 'canada',
        isActive: true,
      },

      // Europe
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
        externalId: 'eurimages-coproduction-2024',
        title: 'Eurimages - Coproduction',
        description: 'Soutien aux coproductions cinématographiques européennes.',
        organization: 'Conseil de l\'Europe',
        amount: 100000,
        deadline: new Date('2024-10-31'),
        eligibility: 'Coproductions européennes, minimum 3 pays',
        applicationUrl: 'https://www.coe.int/en/web/eurimages',
        category: 'film',
        region: 'europe',
        isActive: true,
      },

      // International
      {
        externalId: 'world-cinema-fund-2024',
        title: 'World Cinema Fund',
        description: 'Fonds pour le cinéma mondial, soutien aux cinémas du Sud.',
        organization: 'Berlinale',
        amount: 25000,
        deadline: new Date('2024-11-15'),
        eligibility: 'Cinémas émergents, projets du Sud global',
        applicationUrl: 'https://www.berlinale.de/en/world_cinema_fund/',
        category: 'film',
        region: 'international',
        isActive: true,
      },
      {
        externalId: 'robert-bosch-stiftung-2024',
        title: 'Bourse Robert Bosch Stiftung',
        description: 'Soutien aux projets documentaires européens.',
        organization: 'Robert Bosch Stiftung',
        amount: 20000,
        deadline: new Date('2024-12-01'),
        eligibility: 'Documentaires européens, thématiques sociales',
        applicationUrl: 'https://www.bosch-stiftung.de/',
        category: 'documentary',
        region: 'europe',
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