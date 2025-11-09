import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import {
  UserGroupIcon,
  CalendarIcon,
  BookOpenIcon,
  SparklesIcon,
  HeartIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: UserGroupIcon,
    title: 'Matching Intelligent',
    description: 'Trouvez des mentors et mentees compatibles grâce à notre algorithme basé sur vos compétences et intérêts.'
  },
  {
    icon: CalendarIcon,
    title: 'Sessions de Mentorat',
    description: 'Planifiez et gérez vos sessions de mentorat avec un système de calendrier intégré.'
  },
  {
    icon: BookOpenIcon,
    title: 'Ressources Exclusives',
    description: 'Accédez à une base de données d\'aides financières, formations et opportunités du cinéma.'
  },
  {
    icon: SparklesIcon,
    title: 'Communauté Active',
    description: 'Rejoignez une communauté de professionnels et passionnés du cinéma court.'
  }
];

const testimonials = [
  {
    name: 'Marie Dubois',
    role: 'Réalisatrice débutante',
    content: 'Grâce à Dinan Film Network, j\'ai trouvé un mentor qui m\'a aidée à finaliser mon premier court métrage.',
    avatar: 'M'
  },
  {
    name: 'Pierre Martin',
    role: 'Producteur expérimenté',
    content: 'J\'ai pu transmettre mon savoir-faire à de jeunes talents. Une expérience enrichissante pour tous.',
    avatar: 'P'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Dinan Film Network
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Connectez-vous avec des mentors et des créateurs de courts métrages.
              Développez vos projets grâce à notre réseau de professionnels issus du Festival du Film Court de Dinan.
            </p>

            <SignedOut>
              <div className="space-y-4">
                <SignInButton mode="modal">
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                    Commencer l'aventure
                  </button>
                </SignInButton>
                <p className="text-blue-100">
                  Rejoignez une communauté de plus de 500 cinéastes
                </p>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="space-y-6">
                <p className="text-xl">Prêt à explorer votre réseau ?</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard" className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 text-center transition-colors font-semibold">
                    Accéder au tableau de bord
                  </Link>
                  <Link href="/matching" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-400 text-center transition-colors font-semibold">
                    Trouver des connexions
                  </Link>
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Puissantes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour développer votre carrière dans le cinéma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HeartIcon className="w-16 h-16 mx-auto mb-6 text-blue-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à rejoindre la communauté ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Connectez-vous dès maintenant et commencez à développer votre réseau dans le cinéma
          </p>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                Créer mon compte
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard" className="bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-400 transition-colors shadow-lg inline-block">
              Accéder à mon espace
            </Link>
          </SignedIn>
        </div>
      </section>
    </div>
  );
}
