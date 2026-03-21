import '@/components/ui/global.css';
import { inter } from '@/components/ui/font';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Luxe Fashion Wear',
    default: 'Luxe Fashion Wear',
  },
  description: 'Your destination for premium fashion. Curating the world\'s best brands since 2026.',
  openGraph: {
    title: 'Luxe Fashion Wear',
    description: 'Your destination for premium fashion. Curating the world\'s best brands since 2026.',
    siteName: 'Luxe Fashion Wear',
  },
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

import Providers from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
