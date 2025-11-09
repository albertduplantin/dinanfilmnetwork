'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, UsersIcon, MapPinIcon, CalendarIcon, CurrencyEuroIcon } from '@heroicons/react/24/outline';

interface TeamProject {
  id: number;
  creatorId: number;
  title: string;
  description: string | null;
  genre: string | null;
  projectType: string;
  status: string;
  budget: number | null;
  deadline: string | null;
  location: string | null;
  requiredRoles: string[] | null;
  creatorName: string;
  applicationsCount: number;
}

export default function Teams() {
  const { user } = useUser();
  const [projects, setProjects] = useState<TeamProject[]>([]);
  const [myProjects, setMyProjects] = useState<TeamProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<TeamProject | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-projects'>('browse');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    projectType: 'court_metrage',
    budget: '',
    deadline: '',
    location: '',
    requiredRoles: '',
  });

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchMyProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/team-projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    }
  };

  const fetchMyProjects = async () => {
    try {
      const response = await fetch('/api/team-projects/my-projects');
      if (response.ok) {
        const data = await response.json();
        setMyProjects(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de mes projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProject ? 'PUT' : 'POST';
      const url = editingProject ? `/api/team-projects/${editingProject.id}` : '/api/team-projects';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budget: formData.budget ? parseInt(formData.budget) : null,
          requiredRoles: formData.requiredRoles.split(',').map(r => r.trim()).filter(r => r),
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingProject(null);
        resetForm();
        fetchProjects();
        fetchMyProjects();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      genre: '',
      projectType: 'court_metrage',
      budget: '',
      deadline: '',
      location: '',
      requiredRoles: '',
    });
  };

  const startEdit = (project: TeamProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      genre: project.genre || '',
      projectType: project.projectType,
      budget: project.budget?.toString() || '',
      deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
      location: project.location || '',
      requiredRoles: project.requiredRoles ? project.requiredRoles.join(', ') : '',
    });
    setShowForm(true);
  };

  const deleteProject = async (projectId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      const response = await fetch(`/api/team-projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProjects();
        fetchMyProjects();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const applyToProject = async (projectId: number, role: string) => {
    try {
      const response = await fetch('/api/team-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, appliedRole: role }),
      });

      if (response.ok) {
        alert('Candidature envoyée avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la candidature:', error);
    }
  };

  if (loading) return <div className="container mx-auto p-8">Chargement des projets d'équipe...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projets d'équipe</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Créer un projet
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'browse'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Parcourir les projets
            </button>
            <button
              onClick={() => setActiveTab('my-projects')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes projets ({myProjects.length})
            </button>
          </nav>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingProject ? 'Modifier le projet' : 'Nouveau projet d\'équipe'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type de projet</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="court_metrage">Court métrage</option>
                  <option value="long_metrage">Long métrage</option>
                  <option value="serie">Série</option>
                  <option value="documentaire">Documentaire</option>
                  <option value="clip">Clip musical</option>
                  <option value="publicite">Publicité</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Décrivez votre projet..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Tous genres</option>
                  <option value="drame">Drame</option>
                  <option value="comedie">Comédie</option>
                  <option value="thriller">Thriller</option>
                  <option value="documentaire">Documentaire</option>
                  <option value="animation">Animation</option>
                  <option value="experimental">Expérimental</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Budget estimé (€)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Lieu de tournage</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Paris, France"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date limite</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rôles recherchés</label>
                <input
                  type="text"
                  value={formData.requiredRoles}
                  onChange={(e) => setFormData({ ...formData, requiredRoles: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Réalisateur, Chef opérateur, Monteur..."
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editingProject ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                  resetForm();
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'browse' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    project.status === 'recruiting' ? 'bg-green-100 text-green-800' :
                    project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status === 'recruiting' ? 'Recrute' :
                     project.status === 'in_progress' ? 'En cours' : 'Terminé'}
                  </span>
                </div>

                <p className="text-gray-600 mb-3">{project.creatorName}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="capitalize">{project.projectType.replace('_', ' ')}</span>
                  {project.genre && <span>• {project.genre}</span>}
                </div>

                {project.description && (
                  <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  {project.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      {project.location}
                    </div>
                  )}
                  {project.deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(project.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                  {project.budget && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CurrencyEuroIcon className="w-4 h-4" />
                      {project.budget.toLocaleString()}€
                    </div>
                  )}
                </div>

                {project.requiredRoles && project.requiredRoles.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Rôles recherchés :</p>
                    <div className="flex flex-wrap gap-1">
                      {project.requiredRoles.slice(0, 3).map((role, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {role}
                        </span>
                      ))}
                      {project.requiredRoles.length > 3 && (
                        <span className="text-xs text-gray-500">+{project.requiredRoles.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <UsersIcon className="w-4 h-4" />
                    {project.applicationsCount} candidat(s)
                  </div>
                  <button
                    onClick={() => {
                      const role = prompt('Pour quel rôle postulez-vous ?');
                      if (role) applyToProject(project.id, role);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    Postuler
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(project)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="capitalize">{project.projectType.replace('_', ' ')}</span>
                  {project.genre && <span>• {project.genre}</span>}
                </div>

                <div className="space-y-2 mb-4">
                  {project.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      {project.location}
                    </div>
                  )}
                  {project.deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(project.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <UsersIcon className="w-4 h-4" />
                    {project.applicationsCount} candidat(s)
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    project.status === 'recruiting' ? 'bg-green-100 text-green-800' :
                    project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status === 'recruiting' ? 'Recrute' :
                     project.status === 'in_progress' ? 'En cours' : 'Terminé'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'browse' ? projects : myProjects).length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <UsersIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {activeTab === 'browse' ? 'Aucun projet disponible' : 'Vous n\'avez pas de projet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {activeTab === 'browse'
              ? 'Soyez le premier à créer un projet d\'équipe !'
              : 'Créez votre premier projet pour trouver des collaborateurs.'}
          </p>
          {activeTab === 'my-projects' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Créer un projet
            </button>
          )}
        </div>
      )}
    </div>
  );
}