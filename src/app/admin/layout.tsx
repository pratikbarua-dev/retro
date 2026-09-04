import type { Metadata } from 'next';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export const metadata: Metadata = {
  title: 'Admin Control System | Retro Lab',
  description:
    'Administrative dashboard for managing lab bench bookings, capacity quotas, time slots, user roles, pricing rules, and financial analytics.',
  openGraph: {
    title: 'Admin Control System | Retro Lab',
    description:
      'Administrative dashboard for managing lab bench bookings, capacity quotas, time slots, user roles, pricing rules, and financial analytics.',
    url: 'https://retrolab.com/admin',
    images: ['/logo.png'],
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
