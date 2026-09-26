'use client';

import { Fragment, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  footer?: ReactNode;
}

const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
}: DrawerProps) => {
  if (!isOpen) return null;

  const sideClasses = {
    left: 'left-0 top-0 bottom-0 right-auto',
    right: 'right-0 top-0 bottom-0 left-auto',
    top: 'top-0 left-0 right-0 bottom-auto',
    bottom: 'bottom-0 left-0 right-0 top-auto',
  };

  const sizeClasses = {
    sm: side === 'top' || side === 'bottom' ? 'h-1/4' : 'w-80',
    md: side === 'top' || side === 'bottom' ? 'h-1/3' : 'w-96',
    lg: side === 'top' || side === 'bottom' ? 'h-1/2' : 'w-[400px]',
    xl: side === 'top' || side === 'bottom' ? 'h-2/3' : 'w-[500px]',
    full: side === 'top' || side === 'bottom' ? 'h-full' : 'w-full',
  };

  const slideClasses = {
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right',
    top: 'animate-slide-in-down',
    bottom: 'animate-slide-in-up',
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleOverlayClick}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed z-50 bg-white shadow-xl rounded-lg',
          sideClasses[side],
          sizeClasses[size],
          slideClasses[side],
          side === 'top' && 'rounded-b-lg',
          side === 'bottom' && 'rounded-t-lg',
          (side === 'left' || side === 'right') && 'rounded-r-lg'
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-start justify-between p-4 border-b border-secondary-200">
            <h2
              id="drawer-title"
              className="text-lg font-semibold text-secondary-900"
            >
              {title}
            </h2>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-secondary-200">
            {footer}
          </div>
        )}
      </div>
    </Fragment>
  );
};

Drawer.displayName = 'Drawer';

export { Drawer };
