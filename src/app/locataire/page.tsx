'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Heart, Calendar, FileText, User, BarChart3, ChevronRight, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sidebar } from '@/components/layout/Sidebar';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getTenantStats(userId: string) {
  const [favoritesCount, visitsCount, rentalsCount] = await Promise.all([
    prisma.favorite.count({
      where: { tenantId: userId },
    }),
    prisma.visit.count({
      where: { tenantId: userId, status: 'COMPLETED' },
    }),
    prisma.rental.count({
      where: { tenantId: userId },
    }),
  ]);

  return { favoritesCount, visitsCount, rentalsCount };
}

async function getRecentActivity(userId: string) {
  const [recentFavorites, recentVisits] = await Promise.all([
    prisma.favorite.findMany({
      where: { tenantId: userId },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          include: {
            images: true,
          },
        },
      },
    }),
    prisma.visit.findMany({
      where: { tenantId: userId },
      take: 3,
      orderBy: { scheduledAt: 'desc' },
      include: {
        property: {
          include: {
            images: true,
          },
        },
      },
    }),
  ]);

  return { recentFavorites, recentVisits };
}

export default async function TenantDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'TENANT') {
    return null;
  }

  const [stats, activity] = await Promise.all([
    getTenantStats(user.id),
    getRecentActivity(user.id),
  ]);

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar user={user} />

        {/* Main Content */}
        <main className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Mon espace locataire
            </h1>
            <p className="text-secondary-500">
              Bienvenue, {user.firstName} {user.lastName}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stats.favoritesCount}
                    </p>
                    <p className="text-secondary-500">Favoris</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-success-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stats.visitsCount}
                    </p>
                    <p className="text-secondary-500">Visites</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-warning-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stats.rentalsCount}
                    </p>
                    <p className="text-secondary-500">Locations</p>
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
              <Link href="/logements">
                <Card variant="bordered" hoverable clickable>
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Home className="h-6 w-6 text-primary-600" />
                    </div>
                    <p className="font-medium text-secondary-900">
                      Explorer les logements
                    </p>
                    <p className="text-sm text-secondary-500">
                      Trouvez votre futur logement
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/locataire/favoris">
                <Card variant="bordered" hoverable clickable>
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-6 w-6 text-success-600" />
                    </div>
                    <p className="font-medium text-secondary-900">
                      Mes favoris
                    </p>
                    <p className="text-sm text-secondary-500">
                      {stats.favoritesCount} logements sauvegardés
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/locataire/visites">
                <Card variant="bordered" hoverable clickable>
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-6 w-6 text-warning-600" />
                    </div>
                    <p className="font-medium text-secondary-900">
                      Mes visites
                    </p>
                    <p className="text-sm text-secondary-500">
                      {stats.visitsCount} visites planifiées
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                Mes favoris récents
              </h2>
              {activity.recentFavorites.length > 0 ? (
                <div className="space-y-4">
                  {activity.recentFavorites.map((favorite) => (
                    <Card key={favorite.id} variant="bordered">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={favorite.property.images[0]?.url || '/placeholder-property.jpg'}
                              alt={favorite.property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-secondary-900 truncate">
                              {favorite.property.title}
                            </p>
                            <p className="text-sm text-secondary-500">
                              {favorite.property.district}
                            </p>
                          </div>
                          <Link
                            href={`/logements/${favorite.propertyId}`}
                            className="flex-shrink-0"
                          >
                            <Button variant="outline" size="sm">
                              Voir
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card variant="bordered">
                  <CardContent className="p-6 text-center">
                    <p className="text-secondary-500 mb-4">
                      Aucun favoris récent
                    </p>
                    <Link href="/logements">
                      <Button variant="outline">
                        Explorer les logements
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                Mes visites récentes
              </h2>
              {activity.recentVisits.length > 0 ? (
                <div className="space-y-4">
                  {activity.recentVisits.map((visit) => (
                    <Card key={visit.id} variant="bordered">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={visit.property.images[0]?.url || '/placeholder-property.jpg'}
                              alt={visit.property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-secondary-900 truncate">
                              {visit.property.title}
                            </p>
                            <p className="text-sm text-secondary-500">
                              Visite {new Date(visit.scheduledAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <Badge variant={visit.status === 'COMPLETED' ? 'success' : 'secondary'}>
                            {visit.status === 'COMPLETED' ? 'Terminée' : 'À venir'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card variant="bordered">
                  <CardContent className="p-6 text-center">
                    <p className="text-secondary-500 mb-4">
                      Aucune visite récente
                    </p>
                    <Link href="/logements">
                      <Button variant="outline">
                        Trouver des logements
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Timeline */}
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-semibold text-secondary-900">
                Mon parcours locataire
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Home className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">
                      Recherche de logement
                    </p>
                    <p className="text-sm text-secondary-500">
                      Explorez notre catalogue et trouvez le logement idéal
                    </p>
                  </div>
                  <Link href="/logements">
                    <Button variant="outline" size="sm">
                      Explorer
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">
                      Demander une visite
                    </p>
                    <p className="text-sm text-secondary-500">
                      Contactez-nous pour organiser une visite
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Bientôt
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">
                      Constitution du dossier
                    </p>
                    <p className="text-sm text-secondary-500">
                      Préparez vos documents pour la location
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Bientôt
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-success-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">
                      Signature du contrat
                    </p>
                    <p className="text-sm text-secondary-500">
                      Finalisez votre location en toute confiance
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Bientôt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
