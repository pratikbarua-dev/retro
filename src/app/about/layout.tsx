import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Retro Lab | Hardware Prototyping Innovation Hub',
  description:
    'Discover Retro Lab mission to solve hardware access barriers for student developers, researchers, and robotics teams through shared bench infrastructure and mentorship.',
  openGraph: {
    title: 'About Retro Lab | Hardware Prototyping Innovation Hub',
    description:
      'Discover Retro Lab mission to solve hardware access barriers for student developers, researchers, and robotics teams through shared bench infrastructure and mentorship.',
    url: 'https://retrolab.com/about',
    images: ['/logo.png'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
