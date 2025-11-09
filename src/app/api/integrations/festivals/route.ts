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