'use client';

import Link from 'next/link';
import { Building2, Users, Calendar, DollarSign, BarChart3, TrendingUp, LayoutDashboard } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/layout/Sidebar';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getDashboardStats() {
  const [
    totalProperties,
    availableProperties,
    rentedProperties,
    pendingProperties,
    totalOwners,
    activeOwners,
    totalTenants,
    activeTenants,
    todayVisits,
    thisWeekVisits,
    monthlyRevenue,
    totalRevenue,
  ] = await Promise.all([
    prisma.property.count({ where: { status: 'PUBLISHED' } }),
    prisma.property.count({ where: { status: 'PUBLISHED', isAvailable: true } }),
    prisma.property.count({ where: { status: 'RENTED' } }),
    prisma.property.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.user.count({ where: { role: 'OWNER' } }),
    prisma.user.count({ where: { role: 'OWNER', ownerProfile: { isNot: null } } }),
    prisma.user.count({ where: { role: 'TENANT' } }),
    prisma.user.count({ where: { role: 'TENANT', tenantProfile: { isNot: null } } }),
    prisma.visit.count({
      where: {
        scheduledAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.visit.count({
      where: {
        scheduledAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
      },
    }),
    prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        paidAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
      },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalProperties,
    availableProperties,
    rentedProperties,
    pendingProperties,
    totalOwners,
    activeOwners,
    totalTenants,
    activeTenants,
    todayVisits,
    thisWeekVisits,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
}

async function getRecentActivity() {
  const [recentProperties, recentUsers, recentVisits] = await Promise.all([
    prisma.property.findMany({
      where: { status: 'PUBLISHED' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    }),
    prisma.user.findMany({
      where: { OR: [{ role: 'TENANT' }, { role: 'OWNER' }] },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.visit.findMany({
      take: 5,
      orderBy: { scheduledAt: 'desc' },
      include: { property: true, tenant: true },
    }),
  ]);

  return { recentProperties, recentUsers, recentVisits };
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || !['AGENT', 'ADMIN'].includes(user.role)) {
    return null;
  }

  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
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
              Tableau de bord SécuLoge
            </h1>
            <p className="text-secondary-500">
              Bienvenue, {user.firstName} {user.lastName}
            </p>
          </div>

          {/* Stats Grid */}
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
                    <p className="text-secondary-500">Logements totaux</p>
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
                      {stats.availableProperties}
                    </p>
                    <p className="text-secondary-500">Disponibles</p>
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
                      {stats.rentedProperties}
                    </p>
                    <p className="text-secondary-500">Loués</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stats.pendingProperties}
                    </p>
                    <p className="text-secondary-500">En attente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stats.totalOwners}
                    </p>
                    <p className="text-secondary-500">Propriétaires</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-success-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stats.totalTenants}
                    </p>
                    <p className="text-secondary-500">Locataires</p>
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
                      {stats.todayVisits}
                    </p>
                    <p className="text-secondary-500">Visites aujourd'hui</p>
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
                      {(stats.monthlyRevenue).toLocaleString('fr-FR')}
                    </p>
                    <p className="text-secondary-500">Revenus mensuels (FCFA)</p>
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
              <Link href="/gestion/logements">
                <Card variant="bordered" hoverable clickable>
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Building2 className="h-6 w-6 text-primary-600" />
                    </div>
                    <p className="font-medium text-secondary-900">
                      Gérer les logements
                    </p>
                    <p className="text-sm text-secondary-500">
                      {stats.totalProperties} logements
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/gestion/proprietaires">
                <Card variant="bordered" hoverable clickable>
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-success-600" />
                    </div>
                    <p className="font-medium text-secondary-900">
                      Gérer les propriétaires
                    </p>
                    <p className="text-sm text-secondary-500">
                      {stats.totalOwners} propriétaires
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/gestion/statistiques">
                <Card variant="bordered" hoverable clickable>
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="h-6 w-6 text-warning-600" />
                    </div>
                    <p className="font-medium text-secondary-900">
                      Statistiques
                    </p>
                    <p className="text-sm text-secondary-500">
                      Analyse des performances
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <Card variant="bordered">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Logements récents
                  </h2>
                </CardHeader>
                <CardContent>
                  {activity.recentProperties.length > 0 ? (
                    <div className="space-y-4">
                      {activity.recentProperties.map((property) => (
                        <div
                          key={property.id}
                          className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg"
                        >
                          <div className="w-16 h-16 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={property.images[0]?.url || '/placeholder-property.jpg'}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-secondary-900 truncate">
                              {property.title}
                            </p>
                            <p className="text-sm text-secondary-500">
                              {property.district}, {property.city}
                            </p>
                          </div>
                          <Link href={`/gestion/logements/${property.id}`}>
                            <Button variant="outline" size="sm">
                              Voir
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary-500 text-center py-4">
                      Aucun logement récent
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card variant="bordered">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Activité récente
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-secondary-900 text-sm">
                          {stats.pendingProperties} nouveaux logements en attente
                        </p>
                        <p className="text-xs text-secondary-500">de vérification</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-success-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-secondary-900 text-sm">
                          {stats.todayVisits} visites aujourd'hui
                        </p>
                        <p className="text-xs text-secondary-500">
                          {stats.thisWeekVisits} cette semaine
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-warning-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-secondary-900 text-sm">
                          {(stats.monthlyRevenue).toLocaleString('fr-FR')} FCFA
                        </p>
                        <p className="text-xs text-secondary-500">
                          Revenus ce mois
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts Placeholder */}
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-semibold text-secondary-900">
                Évolution des logements
              </h2>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary-100 rounded-xl h-64 flex items-center justify-center">
                <p className="text-secondary-500">
                  Graphique d'évolution - À implémenter
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
