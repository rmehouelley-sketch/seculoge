import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Bed, Square, Bath, DollarSign, Calendar, CheckCircle, Clock, Users, Phone, Mail, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatPrice, formatDate, PROPERTY_TYPES, calculateTenantFee } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

async function getProperty(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          avatarUrl: true,
        },
      },
      verification: true,
    },
  });

  if (!property) {
    return null;
  }

  return property;
}

async function getSimilarProperties(propertyId: string, city: string, type: string) {
  const properties = await prisma.property.findMany({
    where: {
      id: { not: propertyId },
      city,
      type,
      status: 'PUBLISHED',
      isAvailable: true,
    },
    take: 4,
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
  });

  return properties;
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  const [property, similarProperties] = await Promise.all([
    getProperty(id),
    getProperty(id).then((p) => {
      if (p) {
        return getSimilarProperties(p.id, p.city, p.type);
      }
      return [];
    }),
  ]);

  if (!property) {
    notFound();
  }

  const isFavorite = false; // Would check user favorites in real implementation
  const feeAmount = calculateTenantFee(property.monthlyRent);

  const amenities = [
    { label: 'Eau', value: property.hasWater, icon: '💧' },
    { label: 'Compteur eau', value: property.hasWaterMeter, icon: '💧' },
    { label: 'Électricité', value: property.hasElectricity, icon: '⚡' },
    { label: 'Compteur électrique', value: property.hasElectricMeter, icon: '⚡' },
    { label: 'Internet', value: property.hasInternet, icon: '📶' },
    { label: 'Meublé', value: property.hasFurniture, icon: '🛋️' },
    { label: 'Climatisation', value: property.hasAirConditioning, icon: '❄️' },
    { label: 'Parking', value: property.hasParking, icon: '🚗' },
    { label: 'Jardin', value: property.hasGarden, icon: '🌳' },
    { label: 'Sécurité', value: property.hasSecurity, icon: '🔒' },
  ].filter((a) => a.value);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-secondary-500 mb-4">
            <Link href="/" className="hover:text-primary-600">
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <Link href="/logements" className="hover:text-primary-600">
              Logements
            </Link>
            <span className="mx-2">/</span>
            <span className="text-secondary-900">{property.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery */}
          <div className="lg:col-span-2">
            <PropertyGallery images={property.images.map((img) => img.url)} />

            {/* Property Details */}
            <div className="mt-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-4 text-secondary-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {property.district}, {property.city}
                      </span>
                    </div>
                    <StatusBadge status={property.status} type="property" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" leftIcon={<Heart className="h-4 w-4" />}>
                    {isFavorite ? 'Favoris' : 'Ajouter aux favoris'}
                  </Button>
                  <Button size="sm">
                    Demander une visite
                  </Button>
                </div>
              </div>

              {/* Price Section */}
              <Card variant="elevated" className="bg-primary-50 border-primary-200 mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-primary-600 mb-1">Loyer mensuel</p>
                      <p className="text-3xl font-bold text-primary-700">
                        {formatPrice(property.monthlyRent)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-primary-600 mb-1">Frais SécuLoge</p>
                      <p className="text-2xl font-bold text-primary-700">
                        {formatPrice(feeAmount)}
                      </p>
                      <p className="text-xs text-primary-500">25% du loyer</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-primary-600 mb-1">Caution</p>
                      <p className="text-2xl font-bold text-primary-700">
                        {property.securityDeposit
                          ? formatPrice(property.securityDeposit)
                          : 'À discuter'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card variant="bordered" className="mb-8">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Description
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-600 whitespace-pre-line">
                    {property.description}
                  </p>
                </CardContent>
              </Card>

              {/* Characteristics */}
              <Card variant="bordered" className="mb-8">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Caractéristiques
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-secondary-400" />
                      <span className="text-secondary-600">
                        {property.bedroomCount} chambre(s)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="h-5 w-5 text-secondary-400" />
                      <span className="text-secondary-600">
                        {property.roomCount} pièce(s)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-secondary-400" />
                      <span className="text-secondary-600">
                        {property.bathroomCount || '1'} salle(s) de bain
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="h-5 w-5 text-secondary-400" />
                      <span className="text-secondary-600">
                        {property.area ? `${property.area} m²` : 'Non spécifié'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-secondary-400" />
                      <span className="text-secondary-600">
                        {property.availableFrom
                          ? `Disponible à partir du ${formatDate(property.availableFrom)}`
                          : 'Disponible maintenant'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-secondary-400" />
                      <span className="text-secondary-600">
                        {formatPrice(property.monthlyRent)}/mois
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              {amenities.length > 0 && (
                <Card variant="bordered" className="mb-8">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-secondary-900">
                      Équipements
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary">
                          <span className="mr-1">{amenity.icon}</span>
                          {amenity.label}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Verification */}
              {property.isVerified && (
                <Card variant="bordered" className="mb-8 border-success-200 bg-success-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-6 w-6 text-success-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-success-800 mb-2">
                          ✓ Vérifié SécuLoge
                        </h3>
                        <p className="text-success-700 text-sm mb-2">
                          Ce logement a été visité et vérifié par SécuLoge.
                        </p>
                        {property.verification && (
                          <>
                            <p className="text-xs text-success-600">
                              Vérifié le {formatDate(property.verification.completedAt || property.verification.scheduledAt)}
                            </p>
                            {property.verification.notes && (
                              <p className="text-sm text-success-700 mt-2">
                                {property.verification.notes}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location */}
              <Card variant="bordered" className="mb-8">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Localisation
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary-100 rounded-xl h-64 flex items-center justify-center mb-4">
                    <p className="text-secondary-500">
                      Carte interactive - {property.district}, {property.city}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-secondary-400" />
                      <span className="text-secondary-600">
                        {property.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-secondary-400" />
                      <span className="text-secondary-600">
                        {property.district}, {property.city}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Properties */}
              {similarProperties.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
                    Logements similaires
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {similarProperties.map((p) => (
                      <Card
                        key={p.id}
                        variant="bordered"
                        hoverable
                        clickable
                        className="cursor-pointer"
                      >
                        <CardContent className="p-0">
                          <div className="relative w-full h-40 rounded-t-xl overflow-hidden">
                            <img
                              src={p.images[0]?.url || '/placeholder-property.jpg'}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                            {p.isVerified && (
                              <div className="absolute top-2 left-2">
                                <Badge variant="verified" dot className="text-white">
                                  ✓ Vérifié
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-secondary-900 mb-1">
                              {p.title}
                            </h3>
                            <p className="text-sm text-secondary-500 mb-2">
                              {p.district}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-secondary-600">
                                <span>🛏️ {p.bedroomCount} ch.</span>
                                <span>📦 {p.roomCount} p.</span>
                              </div>
                              <p className="font-bold text-primary-600">
                                {formatPrice(p.monthlyRent)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* Owner Info */}
            <Card variant="bordered" className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Propriétaire
                </h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">
                      {property.owner.firstName.charAt(0)}
                      {property.owner.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">
                      {property.owner.firstName} {property.owner.lastName}
                    </p>
                    <p className="text-sm text-secondary-500">Propriétaire</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary-100 rounded-lg">
                      <Phone className="h-4 w-4 text-secondary-600" />
                    </div>
                    <span className="text-sm text-secondary-600">
                      {property.owner.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary-100 rounded-lg">
                      <Mail className="h-4 w-4 text-secondary-600" />
                    </div>
                    <span className="text-sm text-secondary-600 truncate">
                      {property.owner.email}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  fullWidth
                  className="mt-4"
                  leftIcon={<Phone className="h-4 w-4" />}
                >
                  Contacter le propriétaire
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card variant="bordered" className="mb-8">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    fullWidth
                    size="lg"
                    leftIcon={<Calendar className="h-5 w-5" />}
                  >
                    Demander une visite
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    size="lg"
                    leftIcon={<Heart className="h-5 w-5" />}
                  >
                    {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Summary */}
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Résumé
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Type</span>
                    <span className="font-medium text-secondary-900">
                      {PROPERTY_TYPES[property.type]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Statut</span>
                    <StatusBadge status={property.status} type="property" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Disponibilité</span>
                    <span className="font-medium text-secondary-900">
                      {property.isAvailable ? 'Disponible' : 'Non disponible'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Publié le</span>
                    <span className="font-medium text-secondary-900">
                      {formatDate(property.createdAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
