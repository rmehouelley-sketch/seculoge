import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Mon espace locataire - SécuLoge',
  description: 'Gérez vos favoris, demandes et visites sur SécuLoge',
};

export default async function TenantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'TENANT') {
    redirect('/connexion');
  }

  return <>{children}</>;
}
