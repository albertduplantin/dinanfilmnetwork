'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { ChartBarIcon, UserGroupIcon, EyeIcon, TrophyIcon, CalendarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface AnalyticsData {
  profileViews: number;
  projectViews: number;
  connections: number;
  applications: number;
  mentorshipSessions: number;
  achievements: Achievement[];
  monthlyStats: MonthlyStat[];
}

interface Achievement {
  id: number;
  achievementType: string;
  achievementName: string;
  achievementDescription: string;
  unlockedAt: string;
}

interface MonthlyStat {
  month: string;
  profileViews: number;
  projectViews: number;
  connections: number;
}

export default function Analytics() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?period=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mx-auto p-8">Chargement des statistiques...</div>;
  if (!analytics) return <div className="container mx-auto p-8">Erreur de chargement</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tableau de bord Analytics</h1>
        <p className="text-gray-600">Suivez votre progression et impact sur la plateforme</p>
      </div>

      {/* Période selector */}
      <div className="mb-8">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="weekly">Cette semaine</option>
          <option value="monthly">Ce mois</option>
          <option value="yearly">Cette année</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <EyeIcon className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Vues du profil</p>
              <p className="text-2xl font-bold">{analytics.profileViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Vues des projets</p>
              <p className="text-2xl font-bold">{analytics.projectViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Connexions</p>
              <p className="text-2xl font-bold">{analytics.connections}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <CalendarIcon className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Sessions mentorat</p>
              <p className="text-2xl font-bold">{analytics.mentorshipSessions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ArrowTrendingUpIcon className="w-6 h-6 mr-2" />
          Tendances mensuelles
        </h2>
        <div className="space-y-4">
          {analytics.monthlyStats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <span className="font-medium">{stat.month}</span>
              <div className="flex gap-6 text-sm">
                <span>Vues profil: {stat.profileViews}</span>
                <span>Vues projets: {stat.projectViews}</span>
                <span>Connexions: {stat.connections}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <TrophyIcon className="w-6 h-6 mr-2" />
          Réalisations débloquées
        </h2>
        {analytics.achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.achievements.map((achievement) => (
              <div key={achievement.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">{achievement.achievementName}</h3>
                <p className="text-gray-600 mb-2">{achievement.achievementDescription}</p>
                <p className="text-sm text-gray-500">
                  Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucune réalisation débloquée pour le moment</p>
        )}
      </div>

      {/* Career Insights */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-xl font-semibold mb-4">Conseils de carrière</h2>
        <div className="space-y-4">
          {analytics.profileViews < 10 && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
              <p className="text-blue-800">
                💡 <strong>Conseil :</strong> Complétez votre profil avec plus de détails pour attirer plus de vues.
              </p>
            </div>
          )}
          {analytics.connections < 5 && (
            <div className="p-4 bg-green-50 border-l-4 border-green-400">
              <p className="text-green-800">
                💡 <strong>Conseil :</strong> Utilisez le système de matching pour trouver des mentors et collaborateurs.
              </p>
            </div>
          )}
          {analytics.projectViews < 20 && (
            <div className="p-4 bg-purple-50 border-l-4 border-purple-400">
              <p className="text-purple-800">
                💡 <strong>Conseil :</strong> Partagez plus de projets dans votre portfolio pour gagner en visibilité.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}