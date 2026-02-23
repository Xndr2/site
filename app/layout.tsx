import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Xndr | Developer Portfolio',
    template: 'Xndr | %s',
  },
  description:
    'Self-taught developer from Belgium. Project Lead at HeadshotInteractive.com, Founder & Project Lead at FrontierNetwork.be',
  metadataBase: new URL('https://xndr.site'),
  icons: {
    icon: '/icons/XndrPFP_cat.png',
    shortcut: '/icons/XndrPFP_cat.png',
    apple: '/icons/XndrPFP_cat.png',
  },
  keywords: [
    'developer',
    'portfolio',
    'game development',
    'Unreal Engine',
    'web development',
    'Belgium',
  ],
  authors: [{ name: 'Xander', url: 'https://xndr.site' }],
  creator: 'Xander',
  openGraph: {
    title: 'Xndr | Developer Portfolio',
    description: 'Self-taught developer from Belgium',
    type: 'website',
    locale: 'en_US',
    url: 'https://xndr.site',
    siteName: 'Xndr',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xndr | Developer Portfolio',
    description:
      'Self-taught developer from Belgium specializing in game development and web applications.',
    creator: '@Xndr___',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
