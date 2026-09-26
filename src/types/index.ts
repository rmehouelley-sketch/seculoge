import { UserRole, PropertyType, PropertyStatus, VisitStatus, RentalStatus, PaymentType, PaymentStatus, PaymentMethod, DepositStatus, NotificationType } from '@prisma/client';

export type { UserRole, PropertyType, PropertyStatus, VisitStatus, RentalStatus, PaymentType, PaymentStatus, PaymentMethod, DepositStatus, NotificationType };

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string | null;
}

export interface PropertyFilter {
  city?: string;
  district?: string;
  type?: PropertyType;
  minRooms?: number;
  maxRooms?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minRent?: number;
  maxRent?: number;
  isAvailable?: boolean;
  isVerified?: boolean;
}

export interface PropertySummary {
  id: string;
  title: string;
  type: PropertyType;
  district: string;
  city: string;
  roomCount: number;
  bedroomCount: number;
  monthlyRent: number;
  isAvailable: boolean;
  isVerified: boolean;
  status: PropertyStatus;
  images: string[];
  hasWater: boolean;
  hasElectricity: boolean;
}

export interface PropertyDetail extends PropertySummary {
  description: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  bathroomCount?: number | null;
  area?: number | null;
  floor?: number | null;
  securityDeposit?: number | null;
  hasWaterMeter: boolean;
  hasElectricMeter: boolean;
  hasInternet: boolean;
  hasFurniture: boolean;
  hasAirConditioning: boolean;
  hasParking: boolean;
  hasGarden: boolean;
  hasSecurity: boolean;
  verificationDate?: Date | null;
  verificationNotes?: string | null;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

export interface VisitData {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    address: string;
    images: string[];
  };
  tenantId?: string | null;
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
  ownerId?: string | null;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
  agentId?: string | null;
  agent?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
  scheduledAt: Date;
  duration?: number | null;
  completedAt?: Date | null;
  status: VisitStatus;
  tenantNotes?: string | null;
  ownerNotes?: string | null;
  agentNotes?: string | null;
}

export interface RentalData {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    address: string;
    monthlyRent: number;
    images: string[];
  };
  tenantId: string;
  tenant: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  ownerId: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  startDate: Date;
  endDate?: Date | null;
  monthlyRent: number;
  securityDeposit: number;
  status: RentalStatus;
  contractUrl?: string | null;
  notes?: string | null;
}

export interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  pendingProperties: number;
  totalOwners: number;
  activeOwners: number;
  totalTenants: number;
  activeTenants: number;
  todayVisits: number;
  thisWeekVisits: number;
  monthlyRevenue: number;
  totalRevenue: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface FeeCalculation {
  monthlyRent: number;
  feePercentage: number;
  feeAmount: number;
  totalWithFee: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: FormError[];
}
