export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  institution?: string;
  department?: string;
  batch?: string;
  role: UserRole;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  startTime: string; // e.g. "10:00 AM" or "10:00"
  endTime: string;   // e.g. "12:00 PM" or "12:00"
  capacity: number;  // default 10
  bookedSeats?: number; // Calculated dynamically
  isActive: boolean;
}

export interface Package {
  id: string;
  name: string;
  minMembers: number;
  maxMembers: number;
  defaultDuration: number; // hours
  price: number; // ৳
  isCustom: boolean;
  isActive: boolean;
  description?: string;
}

export interface CustomPricingRule {
  id: string;
  members: number; // 1 to 10
  duration: number; // 2, 4, 6, 8 hours
  price: number; // ৳
  isActive: boolean;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'UNPAID' | 'PENDING' | 'PAID' | 'FAILED';

export interface Booking {
  id: string;
  bookingCode: string; // e.g., RL20250830-1042
  userId: string;
  slotId?: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // "10:00 AM"
  endTime: string;   // "02:00 PM"
  duration: number;  // hours (e.g. 4)
  packageId: string;
  packageName: string;
  members: number;
  purpose: string;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerPhone: string;
  institution: string;
  departmentBatch: string;
  createdAt: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export interface LabSettings {
  labName: string;
  tagline: string;
  maxMembers: number;
  defaultSlotDuration: number;
  openingTime: string;
  closingTime: string;
  advanceBookingDays: number;
  cancellationPolicy: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface AnalyticsSummary {
  totalBookings: number;
  totalBookingsGrowth: number;
  totalUsers: number;
  totalUsersGrowth: number;
  totalRevenue: number;
  totalRevenueGrowth: number;
  occupancyRate: number;
  seatsBookedToday: number;
  totalSeatsToday: number;
  mostPopularSlot: string;
  mostPopularPackage: string;
  averageMembersPerBooking: number;
}
