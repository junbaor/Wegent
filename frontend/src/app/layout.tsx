// SPDX-FileCopyrightText: 2025 Weibo, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from 'next';
import './globals.css';
import './pwa.css';
import '@/features/common/scrollbar.css';
import MockInit from '@/features/mock/MockInit';
import AuthGuard from '@/features/common/AuthGuard';
import I18nProvider from '@/components/I18nProvider';
import { ThemeProvider } from '@/features/theme/ThemeProvider';
import { ThemeScript } from '@/features/theme/ThemeScript';
import ErrorBoundary from '@/features/common/ErrorBoundary';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import TelemetryInit from '@/components/TelemetryInit';
import RuntimeConfigInit from '@/components/RuntimeConfigInit';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import PWAEnhancements from '@/components/PWAEnhancements';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'Wegent AI',
  description:
    'AI-powered assistant - Open-source AI-native operating system for intelligent agent teams',
  applicationName: 'Wegent AI',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Wegent AI',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icons/icon-96x96.png',
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'Wegent AI',
    title: 'Wegent AI',
    description:
      'AI-powered assistant - Open-source AI-native operating system for intelligent agent teams',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wegent AI',
    description:
      'AI-powered assistant - Open-source AI-native operating system for intelligent agent teams',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#14B8A6' },
    { media: '(prefers-color-scheme: dark)', color: '#14B8A6' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans antialiased bg-base text-text-primary" suppressHydrationWarning>
        <ServiceWorkerRegistration />
        <PWAEnhancements />
        <TelemetryInit />
        <ErrorBoundary>
          <ThemeProvider>
            <TooltipProvider>
              <RuntimeConfigInit>
                <MockInit>
                  <I18nProvider>
                    <AuthGuard>{children}</AuthGuard>
                  </I18nProvider>
                </MockInit>
              </RuntimeConfigInit>
            </TooltipProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <Toaster />
        <SonnerToaster position="top-center" />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
