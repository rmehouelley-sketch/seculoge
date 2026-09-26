import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getCurrentUser } from '@/lib/auth';
import { ToastProvider } from '@/components/ui/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'SécuLoge - Votre logement. En toute confiance.',
    template: '%s | SécuLoge',
  },
  description: 'SécuLoge simplifie la recherche et la location de logements au Bénin. Trouvez votre logement en toute confiance.',
  keywords: ['logement', 'location', 'immobilier', 'Bénin', 'Cotonou', 'SécuLoge', 'confiance'],
  authors: [{ name: 'SécuLoge' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://seculoge.bj',
    siteName: 'SécuLoge',
    title: 'SécuLoge - Votre logement. En toute confiance.',
    description: 'SécuLoge simplifie la recherche et la location de logements au Bénin.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SécuLoge - Votre logement. En toute confiance.',
    description: 'SécuLoge simplifie la recherche et la location de logements au Bénin.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="fr">
      <body className={inter.className}>
        <ToastProvider />
        <Navbar user={user} />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
