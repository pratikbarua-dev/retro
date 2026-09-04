import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Bookings Dashboard | Retro Lab',
  description:
    'Manage your reserved workbench sessions, view active booking pass codes, and check lab schedule details.',
  openGraph: {
    title: 'My Bookings Dashboard | Retro Lab',
    description:
      'Manage your reserved workbench sessions, view active booking pass codes, and check lab schedule details.',
    url: 'https://retrolab.com/dashboard',
    images: ['/logo.png'],
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
