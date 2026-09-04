import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maker Portal Login | Retro Lab',
  description:
    'Sign in to your Retro Lab maker account to manage bench reservations, track prototyping sessions, or log into the lab control panel.',
  openGraph: {
    title: 'Maker Portal Login | Retro Lab',
    description:
      'Sign in to your Retro Lab maker account to manage bench reservations, track prototyping sessions, or log into the lab control panel.',
    url: 'https://retrolab.com/login',
    images: ['/logo.png'],
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
