import Link from 'next/link';
import { Building2, Home, BarChart3, ShieldCheck, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PropertyCard } from '@/components/property/PropertyCard';
import { formatPrice, calculateTenantFee } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { PropertySummary } from '@/types';

async function getFeaturedProperties(): Promise<PropertySummary[]> {
  const properties = await prisma.property.findMany({
    where: {
      status: 'PUBLISHED',
      isAvailable: true,
    },
    take: 6,
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

  return properties.map((p) => ({
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
  }));
}

async function getStats() {
  const [totalProperties, totalOwners, totalTenants, totalVisits] = await Promise.all([
    prisma.property.count({
      where: { status: 'PUBLISHED' },
    }),
    prisma.user.count({
      where: { role: 'OWNER' },
    }),
    prisma.user.count({
      where: { role: 'TENANT' },
    }),
    prisma.visit.count({
      where: { status: 'COMPLETED' },
    }),
  ]);

  return { totalProperties, totalOwners, totalTenants, totalVisits };
}

export default async function HomePage() {
  const [featuredProperties, stats] = await Promise.all([
    getFeaturedProperties(),
    getStats(),
  ]);

  // Demo fee calculation
  const demoRent = 100000;
  const feePercentage = 25;
  const feeAmount = calculateTenantFee(demoRent, feePercentage);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <Badge
              variant="verified"
              className="mb-6 text-white text-lg px-4 py-2"
            >
              ✓ Vérifié SécuLoge
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Trouvez votre logement.
              <br />
              <span className="text-primary-200">En toute confiance.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-200 mb-10 max-w-3xl mx-auto">
              SécuLoge simplifie la recherche et la location de logements au Bénin.
            </p>

            {/* Hero Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Locataire */}
              <Card
                variant="elevated"
                className="bg-white/10 backdrop-blur-sm border-0 shadow-xl hover:scale-105 transition-transform"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Home className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    LOCATAIRE
                  </h3>
                  <p className="text-primary-200 mb-4 text-sm">
                    Je cherche un logement
                  </p>
                  <Link href="/logements">
                    <Button variant="primary" fullWidth>
                      Trouver un logement
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Propriétaire */}
              <Card
                variant="elevated"
                className="bg-white/10 backdrop-blur-sm border-0 shadow-xl hover:scale-105 transition-transform"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    PROPRIÉTAIRE
                  </h3>
                  <p className="text-primary-200 mb-4 text-sm">
                    Je propose mon bien
                  </p>
                  <Link href="/proprietaire/proposer-un-bien">
                    <Button variant="primary" fullWidth>
                      Proposer mon bien
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Gestion */}
              <Card
                variant="elevated"
                className="bg-white/10 backdrop-blur-sm border-0 shadow-xl hover:scale-105 transition-transform"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    GESTION
                  </h3>
                  <p className="text-primary-200 mb-4 text-sm">
                    Espace SécuLoge
                  </p>
                  <Link href="/gestion">
                    <Button variant="primary" fullWidth>
                      Accéder à la gestion
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-20"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 60C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Pourquoi choisir SécuLoge ?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Nous mettons la confiance au cœur de chaque transaction immobilière.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="bordered" className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Logements vérifiés
                </h3>
                <p className="text-secondary-600 text-sm">
                  Chaque logement est visité et vérifié par notre équipe avant publication.
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered" className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-success-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Propriétaires certifiés
                </h3>
                <p className="text-secondary-600 text-sm">
                  Nous vérifions l'identité et la légitimité de chaque propriétaire.
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered" className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-warning-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-warning-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Prix transparents
                </h3>
                <p className="text-secondary-600 text-sm">
                  Pas de frais cachés. Vous savez exactement ce que vous payez.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fee Calculator Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" className="bg-primary-600 text-white">
            <CardHeader>
              <h2 className="text-2xl font-bold">Calculateur de frais SécuLoge</h2>
              <p className="text-primary-200">
                Frais de recherche : 25 % du loyer
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="text-center">
                  <p className="text-primary-200 mb-2">Loyer</p>
                  <p className="text-3xl font-bold">{formatPrice(demoRent)}</p>
                </div>
                <div className="text-center">
                  <p className="text-primary-200 mb-2">Frais SécuLoge (25%)</p>
                  <p className="text-3xl font-bold">{formatPrice(feeAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-primary-200 mb-2">Total</p>
                  <p className="text-3xl font-bold">{formatPrice(demoRent + feeAmount)}</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Badge variant="verified" className="text-white">
                  ✓ Transparent et sans surprise
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-2">
                Logements en vedette
              </h2>
              <p className="text-lg text-secondary-600">
                Découvrez nos meilleurs logements vérifiés
              </p>
            </div>
            <Link href="/logements">
              <Button variant="outline" rightIcon={<span>→</span>}>
                Voir tous les logements
              </Button>
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
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
                <p className="text-secondary-500">
                  Aucun logement disponible pour le moment.
                </p>
                <p className="text-sm text-secondary-400 mt-2">
                  Revenez plus tard pour découvrir nos offres.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            SécuLoge en chiffres
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card variant="bordered" className="text-center">
              <CardContent className="p-6">
                <p className="text-4xl font-bold text-primary-600 mb-2">
                  {stats.totalProperties}+{/* + for demo effect */}
                </p>
                <p className="text-secondary-600">Logements vérifiés</p>
              </CardContent>
            </Card>
            <Card variant="bordered" className="text-center">
              <CardContent className="p-6">
                <p className="text-4xl font-bold text-success-600 mb-2">
                  {stats.totalOwners}+{/* + for demo effect */}
                </p>
                <p className="text-secondary-600">Propriétaires partenaires</p>
              </CardContent>
            </Card>
            <Card variant="bordered" className="text-center">
              <CardContent className="p-6">
                <p className="text-4xl font-bold text-warning-600 mb-2">
                  {stats.totalTenants}+{/* + for demo effect */}
                </p>
                <p className="text-secondary-600">Locataires satisfaits</p>
              </CardContent>
            </Card>
            <Card variant="bordered" className="text-center">
              <CardContent className="p-6">
                <p className="text-4xl font-bold text-secondary-600 mb-2">
                  {stats.totalVisits}+{/* + for demo effect */}
                </p>
                <p className="text-secondary-600">Visites organisées</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à trouver votre logement ?
          </h2>
          <p className="text-xl text-primary-200 mb-8">
            Commencez dès maintenant votre recherche avec SécuLoge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/logements">
              <Button variant="secondary" size="lg">
                Explorer les logements
              </Button>
            </Link>
            <Link href="/comment-ca-marche">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                Comment ça marche ?
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
