import '@/app/ui/global.css';
import { inter } from 'app/ui/font';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Luke Fashion Wear',
    default: 'Luke Fashion Wear',
  },
  description: 'Your destination for premium fashion. Curating the world\'s best brands since 2026.',
  openGraph: {
    title: 'Luke Fashion Wear',
    description: 'Your destination for premium fashion. Curating the world\'s best brands since 2026.',
    siteName: 'Luke Fashion Wear',
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
