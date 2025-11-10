'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { UserGroupIcon, PlusIcon, ChatBubbleLeftIcon, UsersIcon } from '@heroicons/react/24/outline';

interface DiscussionGroup {
  id: number;
  name: string;
  description: string;
  category: string;
  createdBy: number;
  isPrivate: boolean;
  memberCount: number;
  createdAt: string;
  creatorName: string;
  isMember: boolean;
}

export default function Groups() {
  const { user } = useUser();
  const [groups, setGroups] = useState<DiscussionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    isPrivate: false,
  });

  useEffect(() => {
    fetchGroups();
  }, [selectedCategory]);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`/api/groups?category=${selectedCategory}`);
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowCreateForm(false);
        setFormData({ name: '', description: '', category: 'general', isPrivate: false });
        fetchGroups();
      }
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
    }
  };

  const joinGroup = async (groupId: number) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchGroups();
      }
    } catch (error) {
      console.error('Erreur lors de l\'adhésion au groupe:', error);
    }
  };

  const leaveGroup = async (groupId: number) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/leave`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchGroups();
      }
    } catch (error) {
      console.error('Erreur lors du départ du groupe:', error);
    }
  };

  const categories = [
    { value: 'all', label: 'Tous les groupes' },
    { value: 'general', label: 'Discussion générale' },
    { value: 'technique', label: 'Technique & Production' },
    { value: 'projets', label: 'Collaboration projets' },
    { value: 'evenements', label: 'Événements & Festivals' },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technique': return 'bg-blue-100 text-blue-800';
      case 'projets': return 'bg-green-100 text-green-800';
      case 'evenements': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="container mx-auto p-8">Chargement des groupes...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Groupes de discussion</h1>
        {user && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Créer un groupe
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Groups grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(group.category)}`}>
                      {categories.find(c => c.value === group.category)?.label}
                    </span>
                    {group.isPrivate && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        Privé
                      </span>
                    )}
                  </div>
                </div>
                <UserGroupIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{group.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Par {group.creatorName}</span>
                <div className="flex items-center gap-1">
                  <UsersIcon className="w-4 h-4" />
                  {group.memberCount} membres
                </div>
              </div>

              {group.isMember ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.href = `/groups/${group.id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    Voir le groupe
                  </button>
                  <button
                    onClick={() => leaveGroup(group.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50"
                  >
                    Quitter
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => joinGroup(group.id)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Rejoindre le groupe
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <UserGroupIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Aucun groupe trouvé
          </h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory === 'all'
              ? 'Soyez le premier à créer un groupe de discussion !'
              : `Aucun groupe dans la catégorie "${categories.find(c => c.value === selectedCategory)?.label}".`
            }
          </p>
          {user && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Créer le premier groupe
            </button>
          )}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Créer un nouveau groupe</h3>
            <form onSubmit={handleCreateGroup}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nom du groupe</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {categories.slice(1).map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                    className="mr-2"
                  />
                  Groupe privé (sur invitation uniquement)
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Créer le groupe
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}