import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    currencyDisplay: 'narrowSymbol',
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function calculateTenantFee(monthlyRent: number, percentage: number = 25): number {
  return Math.round(monthlyRent * (percentage / 100));
}

export const PROPERTY_TYPES = {
  STUDIO: 'Studio',
  APARTMENT: 'Appartement',
  HOUSE: 'Maison',
  VILLA: 'Villa',
  DUPLEX: 'Duplex',
  ROOM: 'Chambre',
  COMMERCIAL: 'Commercial',
} as const;

export const PROPERTY_STATUSES = {
  DRAFT: 'Brouillon',
  PENDING_REVIEW: 'En attente de vérification',
  VISIT_SCHEDULED: 'Visite programmée',
  VERIFIED: 'Vérifié',
  PUBLISHED: 'Publié',
  RENTED: 'Loué',
  REFUSED: 'Refusé',
  ARCHIVED: 'Archivé',
} as const;

export const VISIT_STATUSES = {
  REQUESTED: 'Demandée',
  CONFIRMED: 'Confirmée',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
  RESCHEDULED: 'Reportée',
} as const;

export const COTONOU_DISTRICTS = [
  '1er Arrondissement',
  '2ème Arrondissement',
  '3ème Arrondissement',
  '4ème Arrondissement',
  '5ème Arrondissement',
  '6ème Arrondissement',
  '7ème Arrondissement',
  '8ème Arrondissement',
  '9ème Arrondissement',
  '10ème Arrondissement',
  '11ème Arrondissement',
  '12ème Arrondissement',
  '13ème Arrondissement',
  'Abomey-Calavi',
  'Godomey',
  'Akpakpa',
  'Cocotomey',
  'Dantokpa',
  'Gbegamey',
  'Houeyiho',
  'Ménontin',
  'Missérété',
  'Ouidah',
  'Sèmè-Kpodji',
  'Tokpa',
  'Zogbo',
] as const;

export const BENIN_CITIES = [
  'Cotonou',
  'Abomey-Calavi',
  'Porto-Novo',
  'Parakou',
  'Djougou',
  'Bohicon',
  'Kétou',
  'Save',
  'Allada',
  'Ouidah',
  'Cové',
  'Abomey',
  'Natitingou',
  'Bassila',
  'Kandi',
  'Malanville',
  'Gaya',
  'Nikki',
  'Papané',
  'Ségbana',
] as const;
