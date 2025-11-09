'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

interface UserProfile {
  id: number;
  clerkId: string;
  name: string;
  email: string;
  bio: string | null;
  role: string;
  skills: string[] | null;
  interests: string[] | null;
  experience: string | null;
}

export default function Profile() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    role: 'mentee',
    skills: '',
    interests: '',
    experience: '',
  });

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          bio: data.bio || '',
          role: data.role || 'mentee',
          skills: data.skills ? data.skills.join(', ') : '',
          interests: data.interests ? data.interests.join(', ') : '',
          experience: data.experience || '',
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
          interests: formData.interests.split(',').map(s => s.trim()).filter(s => s),
        }),
      });
      if (response.ok) {
        setIsEditing(false);
        fetchProfile();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <img
            src={user.imageUrl}
            alt="Avatar"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        {!isEditing ? (
          <div>
            <div className="mb-4">
              <strong>Rôle :</strong> {profile?.role}
            </div>
            {profile?.bio && (
              <div className="mb-4">
                <strong>Bio :</strong> {profile.bio}
              </div>
            )}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="mb-4">
                <strong>Compétences :</strong> {profile.skills.join(', ')}
              </div>
            )}
            {profile?.interests && profile.interests.length > 0 && (
              <div className="mb-4">
                <strong>Centre d'intérêt :</strong> {profile.interests.join(', ')}
              </div>
            )}
            {profile?.experience && (
              <div className="mb-4">
                <strong>Expérience :</strong> {profile.experience}
              </div>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Modifier le profil
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rôle</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="mentee">Mentee (chercheur de conseils)</option>
                <option value="mentor">Mentor (donneur de conseils)</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Parlez de vous..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Compétences (séparées par des virgules)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Ex: montage vidéo, scénario, production"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Centre d'intérêt (séparées par des virgules)</label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Ex: cinéma indépendant, documentaire, animation"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Expérience</label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Votre expérience dans le cinéma..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Sauvegarder
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}