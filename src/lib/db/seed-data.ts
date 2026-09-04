import { User, TimeSlot, Package, CustomPricingRule, Booking, Facility, LabSettings } from '@/types';

// Pure empty database defaults — No seed data
export const initialUsers: User[] = [];
export const initialTimeSlots: TimeSlot[] = [];
export const initialPackages: Package[] = [];
export const initialCustomPricingRules: CustomPricingRule[] = [];
export const initialBookings: Booking[] = [];
export const initialFacilities: Facility[] = [];

export const initialLabSettings: LabSettings = {
  labName: 'Retro Lab',
  contactEmail: 'mail.retrolab@gmail.com',
  contactPhone: '+880 1865-326474',
  location: 'Changaw, Near Civil Department, Daffodil International University',
  openingHour: '09:00',
  closingHour: '20:00',
  maxSlotsPerUser: 3,
  maintenanceMode: false,
};
