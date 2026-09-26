'use client';

import { useState } from 'react';
import { cn, formatPrice, PROPERTY_TYPES } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PropertySummary } from '@/types';
import Image from 'next/image';

export interface PropertyCardProps {
  property: PropertySummary;
  onClick?: () => void;
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorite?: boolean;
  showFavorite?: boolean;
  variant?: 'grid' | 'list';
  className?: string;
}

const PropertyCard = ({
  property,
  onClick,
  onFavoriteToggle,
  isFavorite = false,
  showFavorite = true,
  variant = 'grid',
  className,
}: PropertyCardProps) => {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    onFavoriteToggle?.(property.id);
  };

  const handleClick = () => {
    onClick?.();
  };

  const primaryImage = property.images[0] || '/placeholder-property.jpg';

  if (variant === 'list') {
    return (
      <Card
        variant="bordered"
        hoverable
        clickable
        onClick={handleClick}
        className={cn('flex gap-4', className)}
      >
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={primaryImage}
            alt={property.title}
            fill
            className="object-cover"
            sizes="128px"
          />
          {property.isVerified && (
            <div className="absolute top-2 left-2">
              <Badge variant="verified" dot>
                ✓ Vérifié
              </Badge>
            </div>
          )}
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart
                className={cn(
                  'h-5 w-5',
                  favorite ? 'text-danger-500 fill-danger-500' : 'text-secondary-400'
                )}
              />
            </button>
          )}
        </div>

        <CardContent className="flex-1 py-2">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-secondary-900 line-clamp-1">
              {property.title}
            </h3>
            <StatusBadge status={property.status} type="property" />
          </div>

          <div className="flex items-center gap-2 text-sm text-secondary-500 mb-2">
            <span>{PROPERTY_TYPES[property.type]}</span>
            <span>•</span>
            <span>{property.district}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-secondary-600">
            <div className="flex items-center gap-1">
              <span className="text-secondary-400">🛏️</span>
              <span>{property.bedroomCount} ch.</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-secondary-400">📦</span>
              <span>{property.roomCount} p.</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-secondary-400">💰</span>
              <span className="font-semibold text-primary-600">
                {formatPrice(property.monthlyRent)}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="py-2">
          <Button variant="outline" size="sm" onClick={handleClick}>
            Voir le logement
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <Card
      variant="bordered"
      hoverable
      clickable
      onClick={handleClick}
      className={cn('property-card group', className)}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
          <Image
            src={primaryImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, 300px"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {property.isVerified && (
              <Badge variant="verified" dot className="text-white">
                ✓ Vérifié SécuLoge
              </Badge>
            )}
            {!property.isAvailable && (
              <Badge variant="danger" className="text-white">
                Non disponible
              </Badge>
            )}
          </div>

          {/* Favorite */}
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
              aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart
                className={cn(
                  'h-5 w-5',
                  favorite ? 'text-danger-500 fill-danger-500' : 'text-secondary-400'
                )}
              />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-1 pb-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-secondary-900 line-clamp-1 text-lg">
              {property.title}
            </h3>
            <StatusBadge status={property.status} type="property" />
          </div>

          <div className="flex items-center gap-2 text-sm text-secondary-500 mb-3">
            <span>{PROPERTY_TYPES[property.type]}</span>
            <span>•</span>
            <span className="truncate">{property.district}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-secondary-600">
              <div className="flex items-center gap-1">
                <span className="text-secondary-400">🛏️</span>
                <span>{property.bedroomCount} ch.</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-secondary-400">📦</span>
                <span>{property.roomCount} p.</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary-600 text-lg">
                {formatPrice(property.monthlyRent)}
              </p>
              <p className="text-xs text-secondary-400">/mois</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            {property.hasWater && (
              <span className="text-xs text-success-600 flex items-center gap-1">
                💧 Eau
              </span>
            )}
            {property.hasElectricity && (
              <span className="text-xs text-success-600 flex items-center gap-1">
                ⚡ Électricité
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <CardFooter className="pt-3">
          <Button variant="primary" fullWidth onClick={handleClick}>
            Voir le logement
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

PropertyCard.displayName = 'PropertyCard';

export { PropertyCard };
