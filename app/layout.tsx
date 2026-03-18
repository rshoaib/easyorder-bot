import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { CartProvider } from "@/context/CartContext";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://orderviachat.com'),
  verification: {
    google: 'WcuXQJqslc4P5QSu6dxMcHrXZUK0R-qudDlIKZFYrL8',
  },
  title: "OrderViaChat — WhatsApp Ordering for Small Businesses",
  description: "Create a beautiful digital menu and accept orders on WhatsApp. 14-day free trial, then $10/month. No commissions, setup in 2 minutes.",
  keywords: ["WhatsApp Ordering", "Digital Menu", "Online Store Builder", "No Commission Food Delivery", "Instagram Menu", "WhatsApp Store Builder"],
  alternates: {
    canonical: 'https://orderviachat.com',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    siteName: 'OrderViaChat',
    title: 'OrderViaChat — WhatsApp Ordering for Small Businesses',
    description: 'Create a digital menu, share a link, get orders on WhatsApp. 14-day free trial, then $10/month. No commissions.',
    images: [
      {
        url: '/images/showcase-store.png',
        width: 1200,
        height: 630,
        alt: 'OrderViaChat — Digital menu and WhatsApp ordering',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OrderViaChat — WhatsApp Ordering',
    description: 'Create a digital menu, share a link, get orders on WhatsApp. 14-day free trial!',
    images: ['/images/showcase-store.png'],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevent zooming on inputs for mobile feeling
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <CartProvider>
          {children}
        </CartProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
        <Toaster position="top-center" richColors />
        <script src="https://gumroad.com/js/gumroad.js" async />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "OrderViaChat",
              url: "https://orderviachat.com",
              description: "Create a beautiful digital menu and accept orders on WhatsApp. 14-day free trial, then $10/month. No commissions.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://orderviachat.com/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "OrderViaChat",
              url: "https://orderviachat.com",
              logo: "https://orderviachat.com/images/showcase-store.png",
              description: "WhatsApp ordering platform for small businesses — digital menus, no commissions, setup in 2 minutes. 14-day free trial.",
            }),
          }}
        />
      </body>
    </html>
  );
}
