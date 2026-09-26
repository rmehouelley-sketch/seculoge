'use client';

import Link from 'next/link';
import { Building2, Calendar, Users, DollarSign, TrendingUp, Home, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sidebar } from '@/components/layout/Sidebar';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getOwnerStats(userId: string) {
  const [totalProperties, publishedCount, rentedCount, totalRevenue] = await Promise.all([
    prisma.property.count({
      where: { ownerId: userId },
    }),
    prisma.property.count({
      where: { ownerId: userId, status: 'PUBLISHED' },
    }),
    prisma.property.count({
      where: { ownerId: userId, status: 'RENTED' },
    }),
    prisma.payment.aggregate({
      where: {
        userId,
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    totalProperties,
    publishedCount,
    rentedCount,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
}

async function getRecentProperties(userId: string) {
  const properties = await prisma.property.findMany({
    where: { ownerId: userId },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      images: true,
    },
  });

  return properties;
}

export default async function OwnerDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'OWNER') {
    return null;
  }

  const [stats, recentProperties] = await Promise.all([
    getOwnerStats(user.id),
    getRecentProperties(user.id),
  ]);

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar user={user} />

        {/* Main Content */}
        <main className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                Mon espace propriétaire
              </h1>
              <p className="text-secondary-500">
                Bienvenue, {user.firstName} {user.lastName}
              </p>
            </div>
            <Link href="/proprietaire/proposer-un-bien">
              <Button size="lg" leftIcon={<Plus className="h-5 w-5" />}>
                Proposer un bien
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stats.totalProperties}
                    </p>
                    <p className="text-secondary-500">Biens totaux</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-success-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stats.publishedCount}
                    </p>
                    <p className="text-secondary-500">Publiés</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-warning-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stats.rentedCount}
                    </p>
                    <p className="text-secondary-500">Loués</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-secondary-900">
                      {(stats.totalRevenue).toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="text-secondary-500">Revenus générés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/proprietaire/proposer-un-bien">
                <Card variant="bordered" hoverable clickable>
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Plus className="h-6 w-6 text-primary-600" />
                    </div>
                    <p className="font-medium text-secondary-900">
                      Proposer un bien
                    </p>
                    <p className="text-sm text-secondary-500">
                      Ajoutez un nouveau logement
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/proprietaire/mes-biens">
                <Card variant="bordered" hoverable clickable>
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Building2 className="h-6 w-6 text-success-600" />
                    </div>
                    <p className="font-medium text-secondary-900">
                      Mes biens
                    </p>
                    <p className="text-sm text-secondary-500">
                      {stats.totalProperties} biens gérés
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/proprietaire/revenus">
                <Card variant="bordered" hoverable clickable>
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-warning-600" />
                    </div>
                    <p className="font-medium text-secondary-900">
                      Mes revenus
                    </p>
                    <p className="text-sm text-secondary-500">
                      Suivi des paiements
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Recent Properties */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-secondary-900">
                Mes biens récents
              </h2>
              <Link href="/proprietaire/mes-biens">
                <Button variant="outline" size="sm" rightIcon={<span>→</span>}>
                  Voir tous mes biens
                </Button>
              </Link>
            </div>

            {recentProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProperties.map((property) => (
                  <Card
                    key={property.id}
                    variant="bordered"
                    hoverable
                    clickable
                  >
                    <CardContent className="p-0">
                      <div className="relative w-full h-40 rounded-t-xl overflow-hidden">
                        <img
                          src={property.images[0]?.url || '/placeholder-property.jpg'}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        {property.isVerified && (
                          <div className="absolute top-2 left-2">
                            <Badge variant="verified" dot className="text-white">
                              ✓ Vérifié
                            </Badge>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={property.status === 'PUBLISHED' ? 'success' : property.status === 'RENTED' ? 'primary' : 'secondary'}
                          >
                            {property.status === 'PUBLISHED' ? 'Publié' : property.status === 'RENTED' ? 'Loué' : 'En attente'}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-secondary-900 mb-1">
                          {property.title}
                        </h3>
                        <p className="text-sm text-secondary-500 mb-2">
                          {property.district}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-secondary-600">
                            <span>🛏️ {property.bedroomCount} ch.</span>
                            <span>📦 {property.roomCount} p.</span>
                          </div>
                          <p className="font-bold text-primary-600">
                            {(property.monthlyRent).toLocaleString('fr-FR')} FCFA
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card variant="bordered" className="text-center p-12">
                <CardContent>
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-secondary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    Aucun bien
                  </h3>
                  <p className="text-secondary-500 mb-4">
                    Vous n'avez pas encore ajouté de biens.
                  </p>
                  <Link href="/proprietaire/proposer-un-bien">
                    <Button>
                      Proposer mon premier bien
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tips Section */}
          <Card variant="bordered" className="bg-primary-50 border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">
                    Optimisez vos locations
                  </h3>
                  <p className="text-primary-700 text-sm mb-3">
                    Les logements vérifiés par SécuLoge sont loués 30% plus vite et inspirent confiance aux locataires.
                  </p>
                  <Link href="/proprietaire/proposer-un-bien">
                    <Button variant="outline" size="sm">
                      Proposer un bien maintenant
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
