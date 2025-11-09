import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Dinan Film Network
        </h1>
        <p className="text-xl mb-8 text-gray-600 leading-relaxed">
          Connectez-vous avec des mentors et des créateurs de courts métrages.
          Développez vos projets grâce à notre réseau de professionnels issus du Festival du Film Court de Dinan.
        </p>

        <SignedOut>
          <div className="space-y-4">
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 text-lg font-semibold transition-colors">
                Se connecter / S'inscrire
              </button>
            </SignInButton>
            <p className="text-sm text-gray-500">
              Rejoignez une communauté de passionnés du cinéma
            </p>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <p className="text-lg">Bienvenue !</p>
              <UserButton />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
              <Link href="/dashboard" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 text-center transition-colors">
                Tableau de bord
              </Link>
              <Link href="/matching" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 text-center transition-colors">
                Trouver des matches
              </Link>
              <Link href="/profile" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 text-center transition-colors">
                Mon profil
              </Link>
            </div>
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
