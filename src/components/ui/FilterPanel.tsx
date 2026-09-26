'use client';

import { useState } from 'react';
import { cn, COTONOU_DISTRICTS, PROPERTY_TYPES } from '@/lib/utils';
import { Slider, Filter, X } from 'lucide-react';
import { Button } from './Button';
import { Select, SelectOption } from './Select';
import { Input } from './Input';
import { Badge } from './Badge';

export interface FilterValue {
  city?: string;
  district?: string;
  type?: string;
  minRooms?: number;
  maxRooms?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minRent?: number;
  maxRent?: number;
  isAvailable?: boolean;
  isVerified?: boolean;
}

export interface FilterPanelProps {
  onFilter: (filters: FilterValue) => void;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

const FilterPanel = ({
  onFilter,
  className,
  isOpen = true,
  onToggle,
}: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterValue>({});
  const [activeFilters, setActiveFilters] = useState<FilterValue>({});

  const cityOptions: SelectOption[] = [
    { value: 'Cotonou', label: 'Cotonou' },
    { value: 'Abomey-Calavi', label: 'Abomey-Calavi' },
    { value: 'Porto-Novo', label: 'Porto-Novo' },
    { value: 'Parakou', label: 'Parakou' },
  ];

  const districtOptions = COTONOU_DISTRICTS.map((d) => ({
    value: d,
    label: d,
  }));

  const typeOptions = Object.entries(PROPERTY_TYPES).map(([value, label]) => ({
    value,
    label,
  }));

  const handleFilterChange = (key: keyof FilterValue, value: string | number | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setActiveFilters(filters);
    onFilter(filters);
    onToggle?.();
  };

  const handleClearFilters = () => {
    setFilters({});
    setActiveFilters({});
    onFilter({});
  };

  const handleRemoveFilter = (key: keyof FilterValue) => {
    const newFilters = { ...filters, [key]: undefined };
    setFilters(newFilters);
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        leftIcon={<Filter className="h-4 w-4" />}
        onClick={onToggle}
        className={className}
      >
        Filtres
        {hasActiveFilters && (
          <Badge variant="primary" className="ml-2">
            {Object.keys(activeFilters).length}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <div
      className={cn(
        'bg-white border border-secondary-200 rounded-xl p-4 shadow-soft',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-secondary-900 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-secondary-500 hover:text-secondary-700"
          >
            Effacer tout
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Ville */}
        <Select
          label="Ville"
          options={cityOptions}
          placeholder="Toutes les villes"
          value={filters.city || ''}
          onChange={(e) => handleFilterChange('city', e.target.value)}
        />

        {/* Quartier */}
        <Select
          label="Quartier"
          options={districtOptions}
          placeholder="Tous les quartiers"
          value={filters.district || ''}
          onChange={(e) => handleFilterChange('district', e.target.value)}
        />

        {/* Type */}
        <Select
          label="Type de logement"
          options={typeOptions}
          placeholder="Tous les types"
          value={filters.type || ''}
          onChange={(e) => handleFilterChange('type', e.target.value)}
        />

        {/* Nombre de pièces */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Pièces min"
            type="number"
            min={0}
            value={filters.minRooms || ''}
            onChange={(e) =>
              handleFilterChange('minRooms', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="0"
          />
          <Input
            label="Pièces max"
            type="number"
            min={0}
            value={filters.maxRooms || ''}
            onChange={(e) =>
              handleFilterChange('maxRooms', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="10+"
          />
        </div>

        {/* Nombre de chambres */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Chambres min"
            type="number"
            min={0}
            value={filters.minBedrooms || ''}
            onChange={(e) =>
              handleFilterChange('minBedrooms', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="0"
          />
          <Input
            label="Chambres max"
            type="number"
            min={0}
            value={filters.maxBedrooms || ''}
            onChange={(e) =>
              handleFilterChange('maxBedrooms', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="10+"
          />
        </div>

        {/* Loyer */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Loyer min (FCFA)"
            type="number"
            min={0}
            value={filters.minRent || ''}
            onChange={(e) =>
              handleFilterChange('minRent', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="0"
          />
          <Input
            label="Loyer max (FCFA)"
            type="number"
            min={0}
            value={filters.maxRent || ''}
            onChange={(e) =>
              handleFilterChange('maxRent', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="500,000+"
          />
        </div>

        {/* Disponibilité */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isAvailable || false}
              onChange={(e) => handleFilterChange('isAvailable', e.target.checked)}
              className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-secondary-600">Disponible</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isVerified || false}
              onChange={(e) => handleFilterChange('isVerified', e.target.checked)}
              className="h-4 w-4 rounded border-secondary-300 text-success-600 focus:ring-success-500"
            />
            <span className="text-sm text-secondary-600">Vérifié SécuLoge</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2 mt-6 pt-4 border-t border-secondary-200">
        <Button variant="outline" onClick={handleClearFilters} fullWidth>
          Réinitialiser
        </Button>
        <Button onClick={handleApplyFilters} fullWidth>
          Appliquer les filtres
        </Button>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activeFilters.city && (
            <Badge variant="primary">
              {activeFilters.city}
              <button
                onClick={() => handleRemoveFilter('city')}
                className="ml-1 hover:text-white"
              >
                ×
              </button>
            </Badge>
          )}
          {activeFilters.district && (
            <Badge variant="primary">
              {activeFilters.district}
              <button
                onClick={() => handleRemoveFilter('district')}
                className="ml-1 hover:text-white"
              >
                ×
              </button>
            </Badge>
          )}
          {activeFilters.type && (
            <Badge variant="primary">
              {PROPERTY_TYPES[activeFilters.type as keyof typeof PROPERTY_TYPES]}
              <button
                onClick={() => handleRemoveFilter('type')}
                className="ml-1 hover:text-white"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

FilterPanel.displayName = 'FilterPanel';

export { FilterPanel };
