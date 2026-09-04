import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Lab Location | Retro Lab',
  description:
    'Contact Retro Lab workspace administrators, find lab opening hours, and get location directions to Innovation Hub, Daffodil Smart City, Ashulia, Dhaka.',
  openGraph: {
    title: 'Contact & Lab Location | Retro Lab',
    description:
      'Contact Retro Lab workspace administrators, find lab opening hours, and get location directions to Innovation Hub, Daffodil Smart City, Ashulia, Dhaka.',
    url: 'https://retrolab.com/contact',
    images: ['/logo.png'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
