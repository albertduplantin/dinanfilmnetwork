'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

interface MentorshipSession {
  id: number;
  mentorId: number;
  menteeId: number;
  scheduledAt: string;
  status: string;
  notes: string | null;
  mentorName: string;
  menteeName: string;
  isMentor: boolean;
}

export default function Mentorship() {
  const { user } = useUser();
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    connectedUserId: '',
    scheduledAt: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/mentorship');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowForm(false);
        setFormData({ connectedUserId: '', scheduledAt: '', notes: '' });
        fetchSessions();
      }
    } catch (error) {
      console.error('Erreur lors de la création de session:', error);
    }
  };

  const updateSessionStatus = async (sessionId: number, status: string) => {
    try {
      const response = await fetch(`/api/mentorship/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchSessions();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  if (loading) return <div className="container mx-auto p-8">Chargement...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sessions de mentorat</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Planifier une session
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Nouvelle session</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Personne connectée</label>
              <select
                value={formData.connectedUserId}
                onChange={(e) => setFormData({ ...formData, connectedUserId: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionner...</option>
                {/* TODO: Charger les connexions acceptées */}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Date et heure</label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Objectifs de la session..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Créer
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Session avec {session.isMentor ? session.menteeName : session.mentorName}
                </h3>
                <p className="text-gray-600">
                  {new Date(session.scheduledAt).toLocaleString('fr-FR')}
                </p>
                <p className="text-sm text-gray-500">Statut: {session.status}</p>
              </div>
              <div className="flex gap-2">
                {session.status === 'pending' && session.isMentor && (
                  <>
                    <button
                      onClick={() => updateSessionStatus(session.id, 'confirmed')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Accepter
                    </button>
                    <button
                      onClick={() => updateSessionStatus(session.id, 'cancelled')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Refuser
                    </button>
                  </>
                )}
                {session.status === 'confirmed' && (
                  <button
                    onClick={() => updateSessionStatus(session.id, 'completed')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Marquer comme terminée
                  </button>
                )}
              </div>
            </div>
            {session.notes && (
              <p className="text-sm text-gray-700">{session.notes}</p>
            )}
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          Aucune session planifiée. Connectez-vous avec des mentors ou mentees pour commencer !
        </p>
      )}
    </div>
  );
}