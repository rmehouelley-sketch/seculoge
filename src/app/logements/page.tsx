import { Suspense } from 'react';
import Link from 'next/link';
import { Search, Filter, LayoutGrid, LayoutList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { PropertyCard } from '@/components/property/PropertyCard';
import { FilterPanel } from '@/components/ui/FilterPanel';
import { SearchBar } from '@/components/ui/SearchBar';
import { PropertyFilter, PropertySummary } from '@/types';
import { prisma } from '@/lib/prisma';
import { PROPERTY_TYPES, COTONOU_DISTRICTS, formatPrice } from '@/lib/utils';

interface SearchParams {
  q?: string;
  city?: string;
  district?: string;
  type?: string;
  minRooms?: string;
  maxRooms?: string;
  minRent?: string;
  maxRent?: string;
  isVerified?: string;
  page?: string;
}

async function getProperties(
  searchParams: SearchParams
): Promise<{ properties: PropertySummary[]; total: number }> {
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  // Build filter object
  const where: any = {
    status: 'PUBLISHED',
  };

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: 'insensitive' } },
      { description: { contains: searchParams.q, mode: 'insensitive' } },
      { district: { contains: searchParams.q, mode: 'insensitive' } },
    ];
  }

  if (searchParams.city) {
    where.city = { contains: searchParams.city, mode: 'insensitive' };
  }

  if (searchParams.district) {
    where.district = { contains: searchParams.district, mode: 'insensitive' };
  }

  if (searchParams.type) {
    where.type = searchParams.type as any;
  }

  if (searchParams.minRooms) {
    where.roomCount = { gte: parseInt(searchParams.minRooms) };
  }

  if (searchParams.maxRooms) {
    where.roomCount = { ...where.roomCount, lte: parseInt(searchParams.maxRooms) };
  }

  if (searchParams.minRent) {
    where.monthlyRent = { gte: parseInt(searchParams.minRent) };
  }

  if (searchParams.maxRent) {
    where.monthlyRent = { ...where.monthlyRent, lte: parseInt(searchParams.maxRent) };
  }

  if (searchParams.isVerified === 'true') {
    where.isVerified = true;
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
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
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties: properties.map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type,
      district: p.district,
      city: p.city,
      roomCount: p.roomCount,
      bedroomCount: p.bedroomCount,
      monthlyRent: p.monthlyRent,
      isAvailable: p.isAvailable,
      isVerified: p.isVerified,
      status: p.status,
      images: p.images.map((img) => img.url),
      hasWater: p.hasWater,
      hasElectricity: p.hasElectricity,
    })),
    total,
  };
}

function PropertiesGrid({
  properties,
  view,
}: {
  properties: PropertySummary[];
  view: 'grid' | 'list';
}) {
  if (properties.length === 0) {
    return (
      <Card variant="bordered" className="text-center p-12">
        <CardContent>
          <p className="text-secondary-500 mb-4">
            Aucun logement trouvé.
          </p>
          <p className="text-sm text-secondary-400">
            Essayez de modifier vos critères de recherche.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={`grid gap-6 ${
        view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
      }`}
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          variant={view}
          showFavorite={false}
        />
      ))}
    </div>
  );
}

function PropertiesList({ properties }: { properties: PropertySummary[] }) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PropertiesGrid properties={properties} view="list" />
    </Suspense>
  );
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { properties, total } = await getProperties(resolvedSearchParams);
  const page = parseInt(resolvedSearchParams.page || '1');
  const totalPages = Math.ceil(total / 12);

  const cityOptions = [
    { value: '', label: 'Toutes les villes' },
    { value: 'Cotonou', label: 'Cotonou' },
    { value: 'Abomey-Calavi', label: 'Abomey-Calavi' },
    { value: 'Porto-Novo', label: 'Porto-Novo' },
    { value: 'Parakou', label: 'Parakou' },
  ];

  const districtOptions = [
    { value: '', label: 'Tous les quartiers' },
    ...COTONOU_DISTRICTS.map((d) => ({ value: d, label: d })),
  ];

  const typeOptions = [
    { value: '', label: 'Tous les types' },
    ...Object.entries(PROPERTY_TYPES).map(([value, label]) => ({ value, label })),
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Tous nos logements
            </h1>
            <p className="text-lg text-secondary-600">
              Trouvez le logement parfait pour vous
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <SearchBar
              placeholder="Rechercher un logement, quartier, ville..."
              onSearch={(query) => {
                // This will trigger a page reload with the new query
              }}
              showButton
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2">
            <Select
              options={cityOptions}
              placeholder="Ville"
              className="w-full lg:w-48"
            />
            <Select
              options={typeOptions}
              placeholder="Type"
              className="w-full lg:w-48"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="p-2"
              aria-label="Vue grille"
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="p-2"
              aria-label="Vue liste"
            >
              <LayoutList className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mb-8">
          <FilterPanel
            onFilter={(filters: PropertyFilter) => {
              // Apply filters
            }}
          />
        </div>

        {/* Results */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-secondary-600">
              {total} logements trouvés
            </p>
            <div className="flex gap-2">
              <Select
                options={[
                  { value: 'newest', label: 'Nouveautés' },
                  { value: 'price-asc', label: 'Prix croissant' },
                  { value: 'price-desc', label: 'Prix décroissant' },
                ]}
                placeholder="Trier par"
                className="w-48"
              />
            </div>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} variant="bordered" className="animate-pulse">
                    <CardContent className="h-64" />
                  </Card>
                ))}
              </div>
            }
          >
            <PropertiesGrid properties={properties} view="grid" />
          </Suspense>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`?page=${page - 1}`}
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-colors"
              >
                Précédent
              </Link>
            )}
            <span className="px-4 py-2 text-secondary-600">
              Page {page} sur {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}`}
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-colors"
              >
                Suivant
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
