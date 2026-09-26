import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Gestion - SécuLoge',
  description: 'Espace de gestion administrative de SécuLoge',
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user || !['AGENT', 'ADMIN'].includes(user.role)) {
    redirect('/connexion');
  }

  return <>{children}</>;
}
