import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Mon espace propriétaire - SécuLoge',
  description: 'Gérez vos biens, visites et revenus sur SécuLoge',
};

export default async function OwnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'OWNER') {
    redirect('/connexion');
  }

  return <>{children}</>;
}
