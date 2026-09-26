'use client';

import Link from 'next/link';
import { Heart, Home, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/layout/Sidebar';
import { PropertyCard } from '@/components/property/PropertyCard';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PropertySummary } from '@/types';

async function getFavorites(userId: string): Promise<PropertySummary[]> {
  const favorites = await prisma.favorite.findMany({
    where: { tenantId: userId },
    include: {
      property: {
        include: {
          images: true,
          owner: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return favorites.map((f) => ({
    id: f.property.id,
    title: f.property.title,
    type: f.property.type,
    district: f.property.district,
    city: f.property.city,
    roomCount: f.property.roomCount,
    bedroomCount: f.property.bedroomCount,
    monthlyRent: f.property.monthlyRent,
    isAvailable: f.property.isAvailable,
    isVerified: f.property.isVerified,
    status: f.property.status,
    images: f.property.images.map((img) => img.url),
    hasWater: f.property.hasWater,
    hasElectricity: f.property.hasElectricity,
  }));
}

export default async function TenantFavoritesPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'TENANT') {
    return null;
  }

  const favorites = await getFavorites(user.id);

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
                Mes favoris
              </h1>
              <p className="text-secondary-500">
                {favorites.length} logements sauvegardés
              </p>
            </div>
            <Link href="/logements">
              <Button variant="outline" rightIcon={<Home className="h-4 w-4" />}>
                Explorer plus
              </Button>
            </Link>
          </div>

          {/* Favorites Grid */}
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  showFavorite={false}
                />
              ))}
            </div>
          ) : (
            <Card variant="bordered" className="text-center p-12">
              <CardContent>
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-secondary-400" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Aucun favoris
                </h3>
                <p className="text-secondary-500 mb-4">
                  Vous n'avez pas encore de logements en favoris.
                </p>
                <Link href="/logements">
                  <Button>
                    Explorer les logements
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
