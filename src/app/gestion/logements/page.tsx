'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Building2, Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PROPERTY_TYPES, PROPERTY_STATUSES, formatDate, formatPrice } from '@/lib/utils';

async function getProperties(searchParams: any) {
  const page = parseInt(searchParams.page || '1');
  const limit = 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: 'insensitive' } },
      { district: { contains: searchParams.q, mode: 'insensitive' } },
      { owner: { firstName: { contains: searchParams.q, mode: 'insensitive' } } },
      { owner: { lastName: { contains: searchParams.q, mode: 'insensitive' } } },
    ];
  }

  if (searchParams.status) {
    where.status = searchParams.status;
  }

  if (searchParams.type) {
    where.type = searchParams.type;
  }

  if (searchParams.city) {
    where.city = { contains: searchParams.city, mode: 'insensitive' };
  }

  if (searchParams.isVerified) {
    where.isVerified = searchParams.isVerified === 'true';
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      take: limit,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        owner: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return { properties, total };
}

const statusOptions = Object.entries(PROPERTY_STATUSES).map(([value, label]) => ({
  value,
  label,
}));

const typeOptions = Object.entries(PROPERTY_TYPES).map(([value, label]) => ({
  value,
  label,
}));

const cityOptions = [
  { value: '', label: 'Toutes les villes' },
  { value: 'Cotonou', label: 'Cotonou' },
  { value: 'Abomey-Calavi', label: 'Abomey-Calavi' },
  { value: 'Porto-Novo', label: 'Porto-Novo' },
  { value: 'Parakou', label: 'Parakou' },
];

export default async function ManagePropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const user = await getCurrentUser();
  const { properties, total } = await getProperties(resolvedSearchParams);
  const page = parseInt(resolvedSearchParams.page || '1');
  const totalPages = Math.ceil(total / 10);

  if (!user || !['AGENT', 'ADMIN'].includes(user.role)) {
    return null;
  }

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
                Gestion des logements
              </h1>
              <p className="text-secondary-500">
                {total} logements au total
              </p>
            </div>
            <Link href="/gestion/logements/ajouter">
              <Button size="lg" leftIcon={<Plus className="h-5 w-5" />}>
                Ajouter un logement
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card variant="bordered" className="mb-8">
            <CardHeader>
              <h2 className="text-lg font-semibold text-secondary-900">
                Filtres
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="Rechercher"
                  placeholder="Titre, propriétaire, quartier..."
                  name="q"
                  fullWidth
                />
                <Select
                  label="Statut"
                  name="status"
                  options={statusOptions}
                  placeholder="Tous les statuts"
                  fullWidth
                />
                <Select
                  label="Type"
                  name="type"
                  options={typeOptions}
                  placeholder="Tous les types"
                  fullWidth
                />
                <Select
                  label="Ville"
                  name="city"
                  options={cityOptions}
                  placeholder="Toutes les villes"
                  fullWidth
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  Réinitialiser
                </Button>
                <Button size="sm">
                  Appliquer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Properties Table */}
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-lg font-semibold text-secondary-900">
                Liste des logements
              </h2>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Logement
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Propriétaire
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Localisation
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Détails
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-secondary-200">
                    {properties.length > 0 ? (
                      properties.map((property) => (
                        <tr key={property.id} className="hover:bg-secondary-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={property.images[0]?.url || '/placeholder-property.jpg'}
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-secondary-900 truncate max-w-40">
                                  {property.title}
                                </p>
                                <p className="text-xs text-secondary-500">
                                  {formatDate(property.createdAt)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-secondary-900">
                              {property.owner.firstName} {property.owner.lastName}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {property.owner.phone}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-secondary-600">
                              {property.district}, {property.city}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {property.roomCount} p. | {property.bedroomCount} ch.
                              </span>
                            </div>
                            <p className="font-medium text-primary-600">
                              {formatPrice(property.monthlyRent)}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={property.status} type="property" />
                              {property.isVerified && (
                                <Badge variant="verified" dot className="text-white">
                                  ✓ Vérifié
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/logements/${property.id}`}>
                                <Button variant="ghost" size="sm" className="p-1.5">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/gestion/logements/${property.id}/modifier`}>
                                <Button variant="ghost" size="sm" className="p-1.5">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1.5 text-danger-600 hover:text-danger-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center">
                              <Building2 className="h-8 w-8 text-secondary-400" />
                            </div>
                            <p className="text-secondary-500">
                              Aucun logement trouvé
                            </p>
                            <Button onClick={() => window.location.reload()}>
                              Réessayer
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-secondary-200">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                    >
                      Précédent
                    </Button>
                    <span className="text-secondary-600">
                      Page {page} sur {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
