import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspace Facilities & Tools Inventory | Retro Lab',
  description:
    'Explore professional hardware facilities at Retro Lab: ESD-safe benches, digital storage oscilloscopes, function generators, soldering stations, 3D printers, and component inventory.',
  openGraph: {
    title: 'Workspace Facilities & Tools Inventory | Retro Lab',
    description:
      'Explore professional hardware facilities at Retro Lab: ESD-safe benches, digital storage oscilloscopes, function generators, soldering stations, 3D printers, and component inventory.',
    url: 'https://retrolab.com/facilities',
    images: ['/logo.png'],
  },
};

export default function FacilitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
