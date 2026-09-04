import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Project Consultation | Retro Lab Mentoring',
  description:
    'Book a free 30-minute technical consultation session with experienced engineering mentors for advice on circuit design, component selection, microcontrollers, and hardware debugging.',
  openGraph: {
    title: 'Free Project Consultation | Retro Lab Mentoring',
    description:
      'Book a free 30-minute technical consultation session with experienced engineering mentors for advice on circuit design, component selection, microcontrollers, and hardware debugging.',
    url: 'https://retrolab.com/consultation',
    images: ['/logo.png'],
  },
};

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
