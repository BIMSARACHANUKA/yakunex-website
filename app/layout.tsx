import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActionMenu from '@/components/ui/FloatingActionMenu';
import { site } from '@/lib/config/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Software, AI & Cloud`, template: `%s | ${site.short}` },
  description: site.description,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  openGraph: {
    title: `${site.name} | Technology. Without Limits.`,
    description: site.description,
    url: site.url,
    siteName: site.short,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 800,
        alt: `${site.name} Logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | Software, AI & Cloud`,
    description: site.description,
    images: ['/images/logo.png'],
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
  alternates: { canonical: '/' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.name,
      alternateName: site.short,
      url: site.url,
      logo: `${site.url}/images/logo.png`,
      email: site.email,
      telephone: site.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.address,
        addressCountry: 'LK',
      },
      description: site.description,
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { '@id': `${site.url}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-[#050505] font-sans text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingActionMenu />
      </body>
    </html>
  );
}
