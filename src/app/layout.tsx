import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://retrolab.com'),
  title: {
    default: 'Retro Lab | Hands-on Electronics & Robotics Workspace',
    template: '%s | Retro Lab',
  },
  description:
    'Retro Lab is a physical hands-on electronics and robotics workspace at Daffodil Smart City. Rent ESD-safe workstations by slot, access tools, oscilloscopes, components, and mentor support.',
  keywords: [
    'Retro Lab',
    'Electronics Workspace',
    'Robotics Prototyping',
    'Hardware Makerspace',
    'Bench Booking',
    'Daffodil International University',
    'Daffodil Smart City',
    'PCB Assembly',
    'Soldering Station',
    'Oscilloscope Rental',
  ],
  authors: [{ name: 'Retro Lab Team' }],
  creator: 'Retro Lab',
  publisher: 'Retro Lab Innovation Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Retro Lab | Hands-on Electronics & Robotics Workspace',
    description:
      'Physical hands-on hardware lab equipped with ESD-safe benches, oscilloscopes, prototyping components, and expert engineering mentorship.',
    url: 'https://retrolab.com',
    siteName: 'Retro Lab',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Retro Lab Official Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retro Lab | Hands-on Electronics & Robotics Workspace',
    description:
      'Physical hands-on hardware lab equipped with ESD-safe benches, oscilloscopes, prototyping components, and expert engineering mentorship.',
    images: ['/logo.png'],
  },
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
