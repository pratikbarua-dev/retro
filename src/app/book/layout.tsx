import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Bench Slot | Retro Lab Workspace',
  description:
    'Reserve ESD-safe workbenches, select time slots, and pick from Solo, Pair, Squad, Team, Crew, or Custom Packs at Retro Lab.',
  openGraph: {
    title: 'Book a Bench Slot | Retro Lab Workspace',
    description:
      'Reserve ESD-safe workbenches, select time slots, and pick from Solo, Pair, Squad, Team, Crew, or Custom Packs at Retro Lab.',
    url: 'https://retrolab.com/book',
    images: ['/logo.png'],
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
