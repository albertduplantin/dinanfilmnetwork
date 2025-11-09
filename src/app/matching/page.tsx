'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

interface Match {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  role: string;
  skills: string[] | null;
  interests: string[] | null;
  experience: string | null;
  compatibility: number;
}

export default function Matching() {
  const { user } = useUser();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matching');
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (userId: number) => {
    try {
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectedUserId: userId }),
      });
      if (response.ok) {
        // Mettre à jour l'état local
        setMatches(matches.map(match =>
          match.id === userId ? { ...match, status: 'pending' } : match
        ));
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
    }
  };

  if (loading) return <div className="container mx-auto p-8">Chargement des matches...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Trouver des mentors/mentees</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div key={match.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{match.name}</h3>
            <p className="text-gray-600 mb-2">{match.role === 'mentor' ? 'Mentor' : 'Mentee'}</p>
            <p className="text-sm mb-2">Compatibilité: {match.compatibility}%</p>
            {match.bio && <p className="text-sm mb-2">{match.bio}</p>}
            {match.skills && match.skills.length > 0 && (
              <div className="mb-2">
                <strong className="text-sm">Compétences:</strong>
                <p className="text-sm">{match.skills.join(', ')}</p>
              </div>
            )}
            {match.interests && match.interests.length > 0 && (
              <div className="mb-4">
                <strong className="text-sm">Intérêts:</strong>
                <p className="text-sm">{match.interests.join(', ')}</p>
              </div>
            )}
            <button
              onClick={() => sendConnectionRequest(match.id)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Envoyer une demande de connexion
            </button>
          </div>
        ))}
      </div>
      {matches.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          Aucun match trouvé. Complétez votre profil pour de meilleurs résultats !
        </p>
      )}
    </div>
  );
}