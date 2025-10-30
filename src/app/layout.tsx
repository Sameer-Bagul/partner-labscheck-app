import { fontMono, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import '../styles/globals.css';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { Toaster } from 'sonner';
import Providers from './providers';
import { StrictMode } from 'react';
import { BaseClientUrl } from '@/configs/settings';
import Script from 'next/script';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authconfig';

export const metadata = {
  metadataBase: new URL(`${BaseClientUrl}`),
  title: 'LabsCheck - Find Nearby Labs & Affordable Medical Tests',
  description:
    'Discover the best nearby medical labs with affordable test prices and trusted ratings. Book your labs tests easily with LabsCheck and compare costs, reviews, and locations.',
  keywords: [
    ' diagnostic labs in India',
    'book pathology test online',
    'affordable blood tests',
    'verified pathology labs',
    'medical labs',
    'labs tests',
    'affordable labs tests',
    'nearby labs',
    'labs ratings',
    'book labs tests',
    'diagnostic labs',
    'health checkups',
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.webp',
  },
  openGraph: {
    title: 'LabsCheck - Affordable Labs Tests & Nearby Labs',
    description:
      'Find and book affordable medical labs tests at top-rated labs near you. Compare prices, read reviews, and schedule with LabsCheck.',
    url: 'https://www.labscheck.com',
    siteName: 'LabsCheck',
    images: [
      {
        url: '/logo.webp', // Replace with your actual Open Graph image
        width: 1200,
        height: 630,
        alt: 'LabsCheck - Find Nearby Labs and Affordable Tests',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LabsCheck - Find Nearby Labs & Affordable Tests',
    description:
      'Discover top-rated medical labs near you with affordable test prices. Compare costs and book easily with LabsCheck.',
    images: ['/logo.webp'], // Replace with your actual Twitter image
  },
};

export default async function RootLayout({
  children,

}: {
  children: React.ReactNode;

}) {
    const session = await getServerSession(authOptions);
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=G-D890BTZSKJ`}
              strategy='afterInteractive'
            />
            <Script id='google-analytics' strategy='afterInteractive'>
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-D890BTZSKJ');`}
            </Script>

          </>
        )}
      </head>
      <body
        className={cn(
          'min-h-screen bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-white font-sans antialiased m-0',
          fontSans.variable,
          fontMono.variable,
        )}
        suppressHydrationWarning={true}
      >
        <StrictMode>
          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem>  */}
          <Providers session={session}>
            {children}
          </Providers>
          {/* </ThemeProvider>  */}
          <Toaster />
        </StrictMode>
      </body>
    </html>
  );
}
