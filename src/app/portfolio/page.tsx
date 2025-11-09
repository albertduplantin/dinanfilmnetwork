'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, EyeIcon, HeartIcon } from '@heroicons/react/24/outline';

interface Project {
  id: number;
  title: string;
  description: string | null;
  genre: string | null;
  duration: number | null;
  productionYear: number | null;
  status: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  views: number;
  likes: number;
  media: ProjectMedia[];
  liked: boolean;
}

interface ProjectMedia {
  id: number;
  type: string;
  url: string;
  title: string | null;
  description: string | null;
}

export default function Portfolio() {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    productionYear: '',
    status: 'completed',
    videoUrl: '',
    thumbnailUrl: '',
  });

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProject ? 'PUT' : 'POST';
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingProject(null);
        resetForm();
        fetchProjects();
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
      duration: '',
      productionYear: '',
      status: 'completed',
      videoUrl: '',
      thumbnailUrl: '',
    });
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      genre: project.genre || '',
      duration: project.duration?.toString() || '',
      productionYear: project.productionYear?.toString() || '',
      status: project.status,
      videoUrl: project.videoUrl || '',
      thumbnailUrl: project.thumbnailUrl || '',
    });
    setShowForm(true);
  };

  const deleteProject = async (projectId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (loading) return <div className="container mx-auto p-8">Chargement du portfolio...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mon Portfolio</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Ajouter un projet
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
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
                <label className="block text-sm font-medium mb-2">Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Sélectionner un genre</option>
                  <option value="drame">Drame</option>
                  <option value="comedie">Comédie</option>
                  <option value="thriller">Thriller</option>
                  <option value="documentaire">Documentaire</option>
                  <option value="animation">Animation</option>
                  <option value="experimental">Expérimental</option>
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
                placeholder="Synopsis, concept du film..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Durée (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full p-2 border rounded"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Année de production</label>
                <input
                  type="number"
                  value={formData.productionYear}
                  onChange={(e) => setFormData({ ...formData, productionYear: e.target.value })}
                  className="w-full p-2 border rounded"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="completed">Terminé</option>
                  <option value="in_progress">En cours</option>
                  <option value="planned">Planifié</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">URL Vidéo (Vimeo/YouTube)</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL Miniature</label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="https://..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {project.thumbnailUrl && (
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => startEdit(project)}
                    className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                {project.genre && <span>{project.genre}</span>}
                {project.duration && <span>{project.duration}min</span>}
                {project.productionYear && <span>{project.productionYear}</span>}
              </div>

              {project.description && (
                <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    {project.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <HeartIcon className="w-4 h-4" />
                    {project.likes}
                  </span>
                </div>

                <span className={`px-2 py-1 rounded text-xs ${
                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {project.status === 'completed' ? 'Terminé' :
                   project.status === 'in_progress' ? 'En cours' : 'Planifié'}
                </span>
              </div>

              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Voir le film
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <PlusIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun projet dans votre portfolio</h3>
          <p className="text-gray-500 mb-4">Commencez par ajouter votre premier projet !</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Ajouter un projet
          </button>
        </div>
      )}
    </div>
  );
}