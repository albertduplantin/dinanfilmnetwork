'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  CalendarIcon,
  BookOpenIcon,
  ChartBarIcon,
  PhotoIcon,
  GlobeAltIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Accueil', href: '/', icon: HomeIcon },
  { name: 'Tableau de bord', href: '/dashboard', icon: ChartBarIcon, protected: true },
  { name: 'Portfolio', href: '/portfolio', icon: PhotoIcon, protected: true },
  { name: 'Équipes', href: '/teams', icon: UserGroupIcon, protected: true },
  { name: 'Matching', href: '/matching', icon: UserGroupIcon, protected: true },
  { name: 'Mentorat', href: '/mentorship', icon: CalendarIcon, protected: true },
  { name: 'Marketplace', href: '/marketplace', icon: TruckIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, protected: true },
  { name: 'Intégrations', href: '/integrations', icon: GlobeAltIcon },
  { name: 'Ressources', href: '/resources', icon: BookOpenIcon },
  { name: 'Profil', href: '/profile', icon: UserIcon, protected: true },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Dinan Film Network
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                if (item.protected) {
                  return (
                    <SignedIn key={item.name}>
                      <Link
                        href={item.href}
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          isActive
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Link>
                    </SignedIn>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Se connecter
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.protected) {
              return (
                <SignedIn key={item.name}>
                  <Link
                    href={item.href}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 inline mr-2" />
                    {item.name}
                  </Link>
                </SignedIn>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 inline mr-2" />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Se connecter
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="ml-3">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}