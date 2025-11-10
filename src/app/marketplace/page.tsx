'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { TruckIcon, WrenchScrewdriverIcon, MapPinIcon, CurrencyEuroIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface MarketplaceListing {
  id: number;
  sellerId: number;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  price: number | null;
  priceType: string;
  location: string | null;
  availability: string;
  condition: string | null;
  images: string[] | null;
  contactMethod: string;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  sellerName: string;
  sellerEmail: string;
}

const categories = [
  { value: 'all', label: 'Toutes catégories', icon: null },
  { value: 'equipment', label: 'Matériel', icon: TruckIcon },
  { value: 'service', label: 'Services', icon: WrenchScrewdriverIcon },
  { value: 'location', label: 'Lieux', icon: MapPinIcon },
  { value: 'other', label: 'Autre', icon: null },
];

export default function Marketplace() {
  const { user } = useUser();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/marketplace');
      if (response.ok) {
        const data = await response.json();
        setListings(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    const categoryMatch = selectedCategory === 'all' || listing.category === selectedCategory;
    const searchMatch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch && listing.isActive;
  });

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.icon;
  };

  const getPriceDisplay = (listing: MarketplaceListing) => {
    if (!listing.price) return 'Prix à négocier';

    const price = listing.price / 100; // Convert from cents
    switch (listing.priceType) {
      case 'hourly':
        return `${price}€/heure`;
      case 'daily':
        return `${price}€/jour`;
      case 'fixed':
        return `${price}€`;
      default:
        return `${price}€`;
    }
  };

  const sendInquiry = async (listingId: number, message: string) => {
    try {
      const response = await fetch('/api/marketplace/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, message }),
      });
      if (response.ok) {
        alert('Demande envoyée avec succès !');
        setSelectedListing(null);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      alert('Erreur lors de l\'envoi de la demande');
    }
  };

  if (loading) return <div className="container mx-auto p-8">Chargement du marketplace...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        {user && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Publier une annonce
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => {
          const IconComponent = getCategoryIcon(listing.category);
          return (
            <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Images */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PhotoIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold">{listing.title}</h3>
                  {IconComponent && <IconComponent className="w-6 h-6 text-blue-600 flex-shrink-0 ml-2" />}
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">{listing.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CurrencyEuroIcon className="w-4 h-4" />
                    <span className="font-medium">{getPriceDisplay(listing)}</span>
                  </div>

                  {listing.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      {listing.location}
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Par {listing.sellerName}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedListing(listing)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm"
                >
                  Contacter le vendeur
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <TruckIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Aucune annonce trouvée
          </h3>
          <p className="text-gray-500">
            Soyez le premier à publier une annonce dans cette catégorie !
          </p>
        </div>
      )}

      {/* Inquiry Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Contacter {selectedListing.sellerName}</h3>
            <p className="text-gray-600 mb-4">
              À propos de : <strong>{selectedListing.title}</strong>
            </p>
            <textarea
              id="inquiry-message"
              placeholder="Votre message..."
              className="w-full p-3 border rounded mb-4"
              rows={4}
              defaultValue={`Bonjour, je suis intéressé par votre annonce "${selectedListing.title}". Pouvez-vous me donner plus d'informations ?`}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const message = (document.getElementById('inquiry-message') as HTMLTextAreaElement).value;
                  sendInquiry(selectedListing.id, message);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Envoyer
              </button>
              <button
                onClick={() => setSelectedListing(null)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Listing Form - Placeholder for now */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Publier une annonce</h3>
            <p className="text-gray-600 mb-4">
              Fonctionnalité en développement. Bientôt disponible !
            </p>
            <button
              onClick={() => setShowCreateForm(false)}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}