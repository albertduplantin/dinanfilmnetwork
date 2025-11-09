import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { festivalEvents } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const events = await db
      .select()
      .from(festivalEvents)
      .where(eq(festivalEvents.isActive, true))
      .orderBy(festivalEvents.submissionDeadline);

    return NextResponse.json(events);
  } catch (error) {
    console.error('Erreur GET festival events:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Endpoint pour initialiser des données de test (sera appelé une fois)
export async function POST() {
  try {
    const testEvents = [
      // France
      {
        externalId: 'festival-cannes-2025',
        name: 'Festival de Cannes',
        description: 'Le plus prestigieux festival de cinéma au monde, section courts métrages.',
        startDate: new Date('2025-05-14'),
        endDate: new Date('2025-05-25'),
        location: 'Cannes, France',
        submissionDeadline: new Date('2025-01-15'),
        submissionUrl: 'https://www.festival-cannes.com/en/submit-your-film/short-film/',
        categories: ['court_metrage'],
        entryFee: 80,
        prizes: 'Palme d\'Or du court métrage, Prix du Jury, Prix de la Jeunesse',
        isActive: true,
      },
      {
        externalId: 'festival-dinan-court-2025',
        name: 'Festival du Film Court de Dinan',
        description: 'Festival local dédié aux courts métrages, plateforme idéale pour les jeunes talents.',
        startDate: new Date('2025-04-10'),
        endDate: new Date('2025-04-13'),
        location: 'Dinan, France',
        submissionDeadline: new Date('2025-02-28'),
        submissionUrl: 'https://www.festival-film-court-dinan.com/soumission',
        categories: ['court_metrage', 'documentaire', 'animation'],
        entryFee: 15,
        prizes: 'Prix du Public, Prix du Jury, Prix Jeune Talent',
        isActive: true,
      },
      {
        externalId: 'clermont-ferrand-2025',
        name: 'Festival du Court Métrage de Clermont-Ferrand',
        description: 'Plus grand festival de courts métrages au monde.',
        startDate: new Date('2025-01-31'),
        endDate: new Date('2025-02-08'),
        location: 'Clermont-Ferrand, France',
        submissionDeadline: new Date('2024-10-15'),
        submissionUrl: 'https://www.clermont-filmfest.org/soumission',
        categories: ['court_metrage', 'animation'],
        entryFee: 25,
        prizes: 'Prix International, Prix National, Prix Jeune Public',
        isActive: true,
      },
      {
        externalId: 'annecy-animation-2025',
        name: 'Festival International du Film d\'Animation d\'Annecy',
        description: 'Festival majeur dédié au cinéma d\'animation.',
        startDate: new Date('2025-06-09'),
        endDate: new Date('2025-06-14'),
        location: 'Annecy, France',
        submissionDeadline: new Date('2025-02-15'),
        submissionUrl: 'https://www.annecy.org/submission',
        categories: ['animation'],
        entryFee: 35,
        prizes: 'Cristal du court métrage, Prix du Jury, Prix du Public',
        isActive: true,
      },
      {
        externalId: 'festival-lokkeberg-2025',
        name: 'Festival International du Court Métrage de Lokkeberg',
        description: 'Festival belge dédié aux courts métrages européens.',
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-03-22'),
        location: 'Lokeren, Belgique',
        submissionDeadline: new Date('2024-12-15'),
        submissionUrl: 'https://www.lokkebergfestival.be/',
        categories: ['court_metrage'],
        entryFee: 20,
        prizes: 'Prix du Public, Prix du Jury International',
        isActive: true,
      },

      // Belgique
      {
        externalId: 'festival-namur-2025',
        name: 'Festival International du Film Francophone de Namur',
        description: 'Festival majeur du cinéma francophone en Belgique.',
        startDate: new Date('2025-09-26'),
        endDate: new Date('2025-10-03'),
        location: 'Namur, Belgique',
        submissionDeadline: new Date('2025-06-30'),
        submissionUrl: 'https://www.fiff.be/',
        categories: ['court_metrage', 'long_metrage'],
        entryFee: 40,
        prizes: 'Bayard d\'Or, Prix du Public, Prix de la Critique',
        isActive: true,
      },
      {
        externalId: 'brussels-short-film-festival-2025',
        name: 'Brussels Short Film Festival',
        description: 'Festival bruxellois dédié aux courts métrages européens.',
        startDate: new Date('2025-04-08'),
        endDate: new Date('2025-04-13'),
        location: 'Bruxelles, Belgique',
        submissionDeadline: new Date('2025-01-31'),
        submissionUrl: 'https://www.bsff.be/',
        categories: ['court_metrage', 'animation', 'documentaire'],
        entryFee: 25,
        prizes: 'Prix du Public, Prix du Jury, Prix Spécial',
        isActive: true,
      },

      // Suisse
      {
        externalId: 'festival-fribourg-2025',
        name: 'Festival International du Film de Fribourg',
        description: 'Festival suisse dédié au cinéma international.',
        startDate: new Date('2025-03-20'),
        endDate: new Date('2025-03-27'),
        location: 'Fribourg, Suisse',
        submissionDeadline: new Date('2024-12-31'),
        submissionUrl: 'https://www.fiff.ch/',
        categories: ['court_metrage', 'documentaire'],
        entryFee: 30,
        prizes: 'Grand Prix, Prix du Public, Prix de la Jeunesse',
        isActive: true,
      },
      {
        externalId: 'zurich-film-festival-2025',
        name: 'Zurich Film Festival',
        description: 'Festival suisse avec compétition de courts métrages.',
        startDate: new Date('2025-09-25'),
        endDate: new Date('2025-10-05'),
        location: 'Zurich, Suisse',
        submissionDeadline: new Date('2025-07-15'),
        submissionUrl: 'https://www.zff.com/',
        categories: ['court_metrage', 'documentaire'],
        entryFee: 45,
        prizes: 'Prix du Public, Prix de la Critique',
        isActive: true,
      },

      // Canada (Québec)
      {
        externalId: 'festival-regard-2025',
        name: 'Festival Regard - Saguenay',
        description: 'Festival québécois dédié aux courts métrages.',
        startDate: new Date('2025-03-05'),
        endDate: new Date('2025-03-09'),
        location: 'Saguenay, Québec, Canada',
        submissionDeadline: new Date('2024-12-01'),
        submissionUrl: 'https://www.regard.qc.ca/',
        categories: ['court_metrage', 'animation'],
        entryFee: 15,
        prizes: 'Prix du Public, Prix du Jury, Prix Innovation',
        isActive: true,
      },
      {
        externalId: 'rencontres-internationales-2025',
        name: 'Rencontres Internationales du Documentaire de Montréal',
        description: 'Festival canadien spécialisé dans le documentaire.',
        startDate: new Date('2025-11-12'),
        endDate: new Date('2025-11-23'),
        location: 'Montréal, Québec, Canada',
        submissionDeadline: new Date('2025-08-31'),
        submissionUrl: 'https://www.rencontres-internationales.com/',
        categories: ['documentaire'],
        entryFee: 35,
        prizes: 'Prix du Jury, Prix du Public, Prix Innovation',
        isActive: true,
      },

      // Europe
      {
        externalId: 'berlin-international-2025',
        name: 'Berlinale - Forum Expanded',
        description: 'Section dédiée aux formats expérimentaux et courts métrages.',
        startDate: new Date('2025-02-13'),
        endDate: new Date('2025-02-23'),
        location: 'Berlin, Allemagne',
        submissionDeadline: new Date('2024-11-30'),
        submissionUrl: 'https://www.berlinale.de/en/submission/forum-expanded.html',
        categories: ['court_metrage', 'experimental'],
        entryFee: 50,
        prizes: 'Prix du Forum Expanded, Prix du Jury',
        isActive: true,
      },
      {
        externalId: 'rotterdam-film-festival-2025',
        name: 'International Film Festival Rotterdam',
        description: 'Festival néerlandais avec forte programmation de courts métrages.',
        startDate: new Date('2025-01-22'),
        endDate: new Date('2025-02-02'),
        location: 'Rotterdam, Pays-Bas',
        submissionDeadline: new Date('2024-10-15'),
        submissionUrl: 'https://www.iffr.com/',
        categories: ['court_metrage', 'documentaire', 'experimental'],
        entryFee: 40,
        prizes: 'Prix Tiger, Prix du Public',
        isActive: true,
      },

      // Afrique francophone
      {
        externalId: 'fescao-2025',
        name: 'Festival du Film Africain d\'Ouagadougou - FESPACO',
        description: 'Plus grand festival de cinéma africain.',
        startDate: new Date('2025-02-22'),
        endDate: new Date('2025-03-01'),
        location: 'Ouagadougou, Burkina Faso',
        submissionDeadline: new Date('2024-11-30'),
        submissionUrl: 'https://www.fespaco.bf/',
        categories: ['court_metrage', 'long_metrage', 'documentaire'],
        entryFee: 50,
        prizes: 'Étalon d\'Or, Prix du Public',
        isActive: true,
      },
      {
        externalId: 'cartier-festival-2025',
        name: 'Festival International du Film de Carthage',
        description: 'Festival tunisien majeur pour le cinéma africain et arabe.',
        startDate: new Date('2025-10-25'),
        endDate: new Date('2025-11-01'),
        location: 'Tunis, Tunisie',
        submissionDeadline: new Date('2025-08-15'),
        submissionUrl: 'https://www.jccarthage.tn/',
        categories: ['court_metrage', 'long_metrage'],
        entryFee: 30,
        prizes: 'Tanit d\'Or, Prix du Public',
        isActive: true,
      },
    ];

    for (const event of testEvents) {
      await db.insert(festivalEvents).values(event);
    }

    return NextResponse.json({ success: true, message: 'Événements ajoutés' });
  } catch (error) {
    console.error('Erreur POST festival events:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}