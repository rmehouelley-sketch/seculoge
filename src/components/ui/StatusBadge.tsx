'use client';

import { Badge } from './Badge';
import { PROPERTY_STATUSES, VISIT_STATUSES } from '@/lib/utils';

export interface StatusBadgeProps {
  status: string;
  type?: 'property' | 'visit' | 'rental' | 'payment' | 'verification';
  showLabel?: boolean;
}

const StatusBadge = ({ status, type = 'property', showLabel = true }: StatusBadgeProps) => {
  const getVariant = () => {
    switch (type) {
      case 'property':
        switch (status) {
          case 'VERIFIED':
          case 'PUBLISHED':
            return 'success';
          case 'RENTED':
            return 'primary';
          case 'PENDING_REVIEW':
          case 'VISIT_SCHEDULED':
            return 'warning';
          case 'REFUSED':
          case 'ARCHIVED':
            return 'danger';
          default:
            return 'secondary';
        }
      case 'visit':
        switch (status) {
          case 'COMPLETED':
            return 'success';
          case 'CONFIRMED':
            return 'primary';
          case 'REQUESTED':
            return 'secondary';
          case 'CANCELLED':
          case 'RESCHEDULED':
            return 'danger';
          default:
            return 'secondary';
        }
      case 'rental':
        switch (status) {
          case 'ACTIVE':
            return 'success';
          case 'PENDING':
            return 'warning';
          case 'COMPLETED':
            return 'primary';
          case 'CANCELLED':
          case 'TERMINATED':
            return 'danger';
          default:
            return 'secondary';
        }
      case 'payment':
        switch (status) {
          case 'COMPLETED':
            return 'success';
          case 'PENDING':
            return 'warning';
          case 'FAILED':
            return 'danger';
          case 'REFUNDED':
            return 'secondary';
          default:
            return 'secondary';
        }
      case 'verification':
        switch (status) {
          case 'VERIFIED':
            return 'success';
          case 'PENDING':
            return 'warning';
          case 'FAILED':
            return 'danger';
          default:
            return 'secondary';
        }
      default:
        return 'secondary';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'property':
        return PROPERTY_STATUSES[status as keyof typeof PROPERTY_STATUSES] || status;
      case 'visit':
        return VISIT_STATUSES[status as keyof typeof VISIT_STATUSES] || status;
      default:
        return status;
    }
  };

  const variant = getVariant();
  const label = showLabel ? getLabel() : '';

  // Special case for verified properties
  if (type === 'property' && status === 'VERIFIED') {
    return (
      <Badge variant="verified" dot>
        ✓ Vérifié SécuLoge
      </Badge>
    );
  }

  return (
    <Badge variant={variant} dot={variant !== 'verified'}>
      {label}
    </Badge>
  );
};

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };
