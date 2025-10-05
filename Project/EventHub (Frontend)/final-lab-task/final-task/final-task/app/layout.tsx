import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Script from 'next/script';
import NotificationClient from './components/NotificationClient';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EventHub',
  description: 'Customer Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        {/* Pusher Beams SDK + client */}
        <Script
          src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js"
          strategy="afterInteractive"
        />
        <NotificationClient />

        <Navbar />
        <main className="flex-1 pb-20">{children}</main>
        <Footer />
      </body>
  </html>
);
}
