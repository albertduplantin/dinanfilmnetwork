'use client';

import { useState, useEffect } from 'react';
import { BuildingOfficeIcon, CalendarIcon, CurrencyEuroIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface FundingOpportunity {
  id: number;
  title: string;
  description: string | null;
  organization: string | null;
  amount: number | null;
  deadline: string | null;
  eligibility: string | null;
  applicationUrl: string | null;
  category: string | null;
  region: string | null;
}

interface FestivalEvent {
  id: number;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  submissionDeadline: string | null;
  submissionUrl: string | null;
  categories: string[] | null;
  entryFee: number | null;
  prizes: string | null;
}

export default function Integrations() {
  const [fundingOpportunities, setFundingOpportunities] = useState<FundingOpportunity[]>([]);
  const [festivalEvents, setFestivalEvents] = useState<FestivalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'funding' | 'festivals'>('funding');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const [fundingResponse, festivalsResponse] = await Promise.all([
        fetch('/api/integrations/funding'),
        fetch('/api/integrations/festivals')
      ]);

      if (fundingResponse.ok) {
        const fundingData = await fundingResponse.json();
        setFundingOpportunities(fundingData);
      }

      if (festivalsResponse.ok) {
        const festivalsData = await festivalsResponse.json();
        setFestivalEvents(festivalsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des intégrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFunding = fundingOpportunities.filter(opp => {
    const categoryMatch = selectedCategory === 'all' || opp.category === selectedCategory;
    const regionMatch = selectedRegion === 'all' || opp.region === selectedRegion;
    return categoryMatch && regionMatch;
  });

  const filteredFestivals = festivalEvents.filter(event => {
    const regionMatch = selectedRegion === 'all' || event.location?.toLowerCase().includes(selectedRegion.toLowerCase());
    return regionMatch;
  });

  if (loading) return <div className="container mx-auto p-8">Chargement des intégrations...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Intégrations Externes</h1>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('funding')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'funding'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Aides Financières
            </button>
            <button
              onClick={() => setActiveTab('festivals')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'festivals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Festivals & Événements
            </button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Région</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">Toutes les régions</option>
            <option value="france">France</option>
            <option value="bretagne">Bretagne</option>
            <option value="belgium">Belgique</option>
            <option value="switzerland">Suisse</option>
            <option value="canada">Canada</option>
            <option value="europe">Europe</option>
            <option value="international">International</option>
          </select>
        </div>

        {activeTab === 'funding' && (
          <div>
            <label className="block text-sm font-medium mb-2">Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">Toutes catégories</option>
              <option value="film">Film</option>
              <option value="short_film">Court métrage</option>
              <option value="documentary">Documentaire</option>
              <option value="animation">Animation</option>
            </select>
          </div>
        )}
      </div>

      {activeTab === 'funding' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFunding.map((opportunity) => (
            <div key={opportunity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold">{opportunity.title}</h3>
                  <BuildingOfficeIcon className="w-6 h-6 text-blue-600 flex-shrink-0 ml-2" />
                </div>

                {opportunity.organization && (
                  <p className="text-gray-600 mb-3">{opportunity.organization}</p>
                )}

                <div className="space-y-2 mb-4">
                  {opportunity.amount && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CurrencyEuroIcon className="w-4 h-4" />
                      {opportunity.amount.toLocaleString()}€
                    </div>
                  )}

                  {opportunity.deadline && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <CalendarIcon className="w-4 h-4" />
                      Deadline: {new Date(opportunity.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  )}

                  {opportunity.region && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GlobeAltIcon className="w-4 h-4" />
                      {opportunity.region}
                    </div>
                  )}
                </div>

                {opportunity.description && (
                  <p className="text-gray-700 mb-4 line-clamp-3">{opportunity.description}</p>
                )}

                {opportunity.eligibility && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Éligibilité:</p>
                    <p className="text-sm text-gray-600">{opportunity.eligibility}</p>
                  </div>
                )}

                {opportunity.applicationUrl && (
                  <a
                    href={opportunity.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    Candidater
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFestivals.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold">{event.name}</h3>
                  <CalendarIcon className="w-6 h-6 text-purple-600 flex-shrink-0 ml-2" />
                </div>

                <div className="space-y-2 mb-4">
                  {event.startDate && event.endDate && (
                    <div className="text-sm text-gray-600">
                      {new Date(event.startDate).toLocaleDateString('fr-FR')} - {new Date(event.endDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GlobeAltIcon className="w-4 h-4" />
                      {event.location}
                    </div>
                  )}

                  {event.submissionDeadline && (
                    <div className="text-sm text-red-600">
                      Soumission: {new Date(event.submissionDeadline).toLocaleDateString('fr-FR')}
                    </div>
                  )}

                  {event.entryFee && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CurrencyEuroIcon className="w-4 h-4" />
                      Frais: {event.entryFee}€
                    </div>
                  )}
                </div>

                {event.description && (
                  <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
                )}

                {event.categories && event.categories.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Catégories:</p>
                    <div className="flex flex-wrap gap-1">
                      {event.categories.map((category, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {category.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {event.prizes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Prix:</p>
                    <p className="text-sm text-gray-600">{event.prizes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {event.submissionUrl && (
                    <a
                      href={event.submissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm"
                    >
                      Soumettre
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'funding' ? filteredFunding : filteredFestivals).length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {activeTab === 'funding' ? (
              <CurrencyEuroIcon className="w-16 h-16 mx-auto" />
            ) : (
              <CalendarIcon className="w-16 h-16 mx-auto" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Aucune {activeTab === 'funding' ? 'aide financière' : 'événement'} trouvé{activeTab === 'funding' ? '' : 'e'}
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos filtres ou vérifiez plus tard pour de nouvelles opportunités.
          </p>
        </div>
      )}
    </div>
  );
}