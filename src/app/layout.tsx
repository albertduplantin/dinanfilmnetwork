import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dinan Film Network',
  description: 'Réseau de mentorat pour les créateurs de courts métrages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={`${inter.className} bg-gray-50 min-h-screen`}>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <div className="text-center text-gray-500 text-sm">
                <p>&copy; 2024 Dinan Film Network. Association du Festival du Film Court de Dinan.</p>
                <p className="mt-2">Connectez les talents du cinéma, partagez les connaissances, créez ensemble.</p>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
