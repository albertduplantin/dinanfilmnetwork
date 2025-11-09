import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';

export async function GET() {
  try {
    const allResources = await db.select().from(resources);
    return NextResponse.json(allResources);
  } catch (error) {
    console.error('Erreur GET resources:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Fonction pour initialiser des ressources par défaut (à exécuter une fois)
export async function POST() {
  try {
    const defaultResources = [
      {
        title: 'Aide à la création CNC',
        description: 'Soutien financier pour les courts métrages de création. Ouvert aux jeunes réalisateurs.',
        category: 'Financement',
        link: 'https://www.cnc.fr/professionnels/aides-et-financements/aide-a-la-creation',
      },
      {
        title: 'Fonds régional cinéma Bretagne',
        description: 'Aides financières pour les projets cinématographiques en Bretagne.',
        category: 'Financement',
        link: 'https://www.region-bretagne.fr/fonds-regional-cinema',
      },
      {
        title: 'Formation réalisation CNC',
        description: 'Formations professionnelles pour les réalisateurs de courts métrages.',
        category: 'Formation',
        link: 'https://www.cnc.fr/professionnels/formation',
      },
      {
        title: 'Atelier scénario La Fémis',
        description: 'Ateliers d\'écriture de scénario pour courts métrages.',
        category: 'Formation',
        link: 'https://www.femis.fr/formation/atelier-scenario',
      },
      {
        title: 'Plateforme de distribution Short Film Depot',
        description: 'Plateforme internationale pour la distribution de courts métrages.',
        category: 'Distribution',
        link: 'https://www.shortfilmdepot.com/',
      },
      {
        title: 'Festival de Cannes - Courts métrages',
        description: 'Le plus prestigieux festival de courts métrages au monde.',
        category: 'Festivals',
        link: 'https://www.festival-cannes.com/fr/festival/short-film',
      },
      {
        title: 'Festival du Film Court de Dinan',
        description: 'Festival local dédié aux courts métrages, plateforme de networking idéale.',
        category: 'Festivals',
        link: 'https://www.festival-film-court-dinan.com/',
      },
      {
        title: 'Droits d\'auteur SACD',
        description: 'Protection et gestion des droits d\'auteur pour les œuvres cinématographiques.',
        category: 'Droits',
        link: 'https://www.sacd.fr/',
      },
      {
        title: 'Aide à la production régionale',
        description: 'Soutien aux productions locales en Bretagne.',
        category: 'Production',
        link: 'https://www.bretagne-cinema.fr/aides-regionales',
      },
    ];

    for (const resource of defaultResources) {
      await db.insert(resources).values(resource);
    }

    return NextResponse.json({ success: true, message: 'Ressources ajoutées' });
  } catch (error) {
    console.error('Erreur POST resources:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}