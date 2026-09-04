import {
  User,
  TimeSlot,
  Package,
  CustomPricingRule,
  Booking,
  Facility,
  LabSettings,
  AnalyticsSummary,
} from '@/types';
import {
  initialUsers,
  initialTimeSlots,
  initialPackages,
  initialCustomPricingRules,
  initialBookings,
  initialFacilities,
  initialLabSettings,
} from './seed-data';

// Global mock database state (in memory singleton for Next.js runtime)
class DatabaseStore {
  private users: User[] = [...initialUsers];
  private timeSlots: TimeSlot[] = [...initialTimeSlots];
  private packages: Package[] = [...initialPackages];
  private customPricing: CustomPricingRule[] = [...initialCustomPricingRules];
  private bookings: Booking[] = [...initialBookings];
  private facilities: Facility[] = [...initialFacilities];
  private settings: LabSettings = { ...initialLabSettings };

  // --- USERS ---
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData: Partial<User> & { email: string; name: string }): User {
    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.email)}`,
      phone: userData.phone || '',
      institution: userData.institution || 'Daffodil International University',
      department: userData.department || 'Computer Science',
      batch: userData.batch || '2025',
      role: userData.role || 'USER',
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.users[idx] = { ...this.users[idx], ...updates };
    return this.users[idx];
  }

  deleteUser(id: string): boolean {
    const initialLen = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length < initialLen;
  }


  // --- TIME SLOTS & AVAILABILITY ---
  getTimeSlots(): TimeSlot[] {
    return this.timeSlots;
  }

  getTimeSlotById(id: string): TimeSlot | undefined {
    return this.timeSlots.find((s) => s.id === id);
  }

  getSlotsWithAvailability(dateStr: string): TimeSlot[] {
    // Calculate how many seats are booked on this date per slot
    return this.timeSlots.map((slot) => {
      const activeBookingsForSlot = this.bookings.filter(
        (b) =>
          b.bookingDate === dateStr &&
          b.startTime === slot.startTime &&
          b.status !== 'CANCELLED'
      );
      const bookedSeats = activeBookingsForSlot.reduce((sum, b) => sum + b.members, 0);
      return {
        ...slot,
        bookedSeats,
      };
    });
  }

  createTimeSlot(slot: Omit<TimeSlot, 'id'>): TimeSlot {
    const newSlot: TimeSlot = {
      ...slot,
      id: `slot_${Date.now()}`,
    };
    this.timeSlots.push(newSlot);
    return newSlot;
  }

  updateTimeSlot(id: string, updates: Partial<TimeSlot>): TimeSlot | undefined {
    const idx = this.timeSlots.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    this.timeSlots[idx] = { ...this.timeSlots[idx], ...updates };
    return this.timeSlots[idx];
  }

  deleteTimeSlot(id: string): boolean {
    const initialLen = this.timeSlots.length;
    this.timeSlots = this.timeSlots.filter((s) => s.id !== id);
    return this.timeSlots.length < initialLen;
  }

  // --- PACKAGES ---
  getPackages(): Package[] {
    return this.packages;
  }

  getPackageById(id: string): Package | undefined {
    return this.packages.find((p) => p.id === id);
  }

  updatePackage(id: string, updates: Partial<Package>): Package | undefined {
    const idx = this.packages.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.packages[idx] = { ...this.packages[idx], ...updates };
    return this.packages[idx];
  }

  // --- CUSTOM PRICING ---
  getCustomPricingRules(): CustomPricingRule[] {
    return this.customPricing;
  }

  calculatePrice(packageId: string, members: number, duration: number): number {
    const pkg = this.getPackageById(packageId);
    if (!pkg) return 140;

    if (!pkg.isCustom) {
      return pkg.price;
    }

    // Lookup custom pricing matrix
    const rule = this.customPricing.find(
      (r) => r.members === members && r.duration === duration && r.isActive
    );

    if (rule) {
      return rule.price;
    }

    // Fallback formula if exact rule missing: 120 per member per 2hr slot
    const slots = Math.ceil(duration / 2);
    return members * slots * 120;
  }

  updateCustomPricingRule(members: number, duration: number, newPrice: number): CustomPricingRule {
    const idx = this.customPricing.findIndex(
      (r) => r.members === members && r.duration === duration
    );
    if (idx !== -1) {
      this.customPricing[idx].price = newPrice;
      return this.customPricing[idx];
    } else {
      const newRule: CustomPricingRule = {
        id: `cp_${members}_${duration}`,
        members,
        duration,
        price: newPrice,
        isActive: true,
      };
      this.customPricing.push(newRule);
      return newRule;
    }
  }

  // --- BOOKINGS ---
  getBookings(): Booking[] {
    return this.bookings;
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.find((b) => b.id === id || b.bookingCode === id);
  }

  getUserBookings(userId: string): Booking[] {
    return this.bookings.filter((b) => b.userId === userId);
  }

  /**
   * Concurrency-safe atomic booking creation.
   * Checks remaining capacity for requested date & time slot before inserting.
   */
  createBooking(
    bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'status' | 'paymentStatus' | 'totalPrice'> & {
      totalPrice?: number;
    }
  ): { success: boolean; booking?: Booking; error?: string } {
    const slot = this.timeSlots.find((s) => s.startTime === bookingData.startTime);
    const capacity = slot ? slot.capacity : 10;

    // Check existing seats for this date and time
    const existingBookings = this.bookings.filter(
      (b) =>
        b.bookingDate === bookingData.bookingDate &&
        b.startTime === bookingData.startTime &&
        b.status !== 'CANCELLED'
    );

    const alreadyBooked = existingBookings.reduce((sum, b) => sum + b.members, 0);
    const remainingSeats = capacity - alreadyBooked;

    if (bookingData.members > remainingSeats) {
      return {
        success: false,
        error: `Only ${remainingSeats} seat${remainingSeats === 1 ? '' : 's'} remaining in this time slot (${alreadyBooked}/${capacity} booked).`,
      };
    }

    // Recalculate price server side for security
    const verifiedPrice = this.calculatePrice(
      bookingData.packageId,
      bookingData.members,
      bookingData.duration
    );

    const dateCode = bookingData.bookingDate.replace(/-/g, '');
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `RL${dateCode}-${randCode}`;

    const newBooking: Booking = {
      ...bookingData,
      id: `bk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      bookingCode,
      totalPrice: verifiedPrice,
      status: 'CONFIRMED',
      paymentStatus: 'UNPAID',
      createdAt: new Date().toISOString(),
    };

    this.bookings.unshift(newBooking);
    return { success: true, booking: newBooking };
  }

  updateBookingStatus(id: string, status: Booking['status']): Booking | undefined {
    const idx = this.bookings.findIndex((b) => b.id === id || b.bookingCode === id);
    if (idx === -1) return undefined;
    this.bookings[idx].status = status;
    return this.bookings[idx];
  }

  deleteBooking(id: string): boolean {
    const initialLen = this.bookings.length;
    this.bookings = this.bookings.filter((b) => b.id !== id && b.bookingCode !== id);
    return this.bookings.length < initialLen;
  }

  // --- FACILITIES ---
  getFacilities(): Facility[] {
    return this.facilities;
  }

  // --- SETTINGS ---
  getSettings(): LabSettings {
    return this.settings;
  }

  updateSettings(newSettings: Partial<LabSettings>): LabSettings {
    this.settings = { ...this.settings, ...newSettings };
    return this.settings;
  }

  // --- ANALYTICS SUMMARY ---
  getAnalyticsSummary(): AnalyticsSummary {
    const totalBookings = this.bookings.length;
    const totalUsers = this.users.length;
    const totalRevenue = this.bookings.reduce(
      (sum, b) => (b.status !== 'CANCELLED' ? sum + b.totalPrice : sum),
      0
    );

    const totalSeatsAvailableToday = this.timeSlots.length * 10;
    const todayStr = '2025-08-30';
    const todayBookings = this.bookings.filter(
      (b) => b.bookingDate === todayStr && b.status !== 'CANCELLED'
    );
    const seatsBookedToday = todayBookings.reduce((sum, b) => sum + b.members, 0);

    const occupancyRate = Math.round(
      (seatsBookedToday / (totalSeatsAvailableToday || 1)) * 100
    );

    return {
      totalBookings,
      totalBookingsGrowth: 12,
      totalUsers,
      totalUsersGrowth: 6,
      totalRevenue,
      totalRevenueGrowth: 18,
      occupancyRate: occupancyRate || 60,
      seatsBookedToday,
      totalSeatsToday: totalSeatsAvailableToday,
      mostPopularSlot: '10:00 AM – 12:00 PM',
      mostPopularPackage: 'CUSTOM PACK',
      averageMembersPerBooking: 3.5,
    };
  }

  // Reset database back to original seed data state
  resetToSeedData(): void {
    this.users = [...initialUsers];
    this.timeSlots = [...initialTimeSlots];
    this.packages = [...initialPackages];
    this.customPricing = [...initialCustomPricingRules];
    this.bookings = [...initialBookings];
    this.facilities = [...initialFacilities];
    this.settings = { ...initialLabSettings };
  }
}


// Global Singleton to survive Hot Reloading in Next.js Dev Mode
const globalForDb = global as unknown as { dbStore?: DatabaseStore };
export const db = globalForDb.dbStore || new DatabaseStore();
if (process.env.NODE_ENV !== 'production') globalForDb.dbStore = db;
