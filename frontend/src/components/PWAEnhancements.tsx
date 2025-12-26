// SPDX-FileCopyrightText: 2025 Weibo, Inc.
//
// SPDX-License-Identifier: Apache-2.0

'use client';

import { useEffect } from 'react';

/**
 * PWA Enhancements for mobile devices
 * Handles splash screens, iOS specific features, and mobile optimizations
 */
export default function PWAEnhancements() {
  useEffect(() => {
    // Detect device capabilities
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    // Add dynamic meta tags for better mobile experience
    const addMetaTag = (name: string, content: string, property?: boolean) => {
      const meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    };

    // iOS specific enhancements
    if (isIOS) {
      // Add apple-mobile-web-app-capable if not already added
      if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
        addMetaTag('apple-mobile-web-app-capable', 'yes');
      }

      // Add apple-mobile-web-app-status-bar-style
      if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
        addMetaTag('apple-mobile-web-app-status-bar-style', 'default');
      }

      // Prevent iOS from auto-detecting phone numbers
      if (!document.querySelector('meta[name="format-detection"]')) {
        addMetaTag('format-detection', 'telephone=no');
      }

      // Add apple-touch-icon-precomposed for older iOS devices
      const appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon-precomposed';
      appleTouchIcon.href = '/icons/icon-180x180.png';
      document.head.appendChild(appleTouchIcon);

      // Add apple splash screens for different devices
      const splashScreens = [
        // iPhone 14 Pro Max, 13 Pro Max, 12 Pro Max
        { width: 1290, height: 2796, ratio: 3, href: '/splash/iphone-14-pro-max.png' },
        // iPhone 14 Pro, 13 Pro, 12 Pro
        { width: 1179, height: 2556, ratio: 3, href: '/splash/iphone-14-pro.png' },
        // iPhone 14, 13, 12
        { width: 1170, height: 2532, ratio: 3, href: '/splash/iphone-14.png' },
        // iPhone 13 mini, 12 mini
        { width: 1080, height: 2340, ratio: 3, href: '/splash/iphone-13-mini.png' },
        // iPhone 11 Pro Max, XS Max
        { width: 1242, height: 2688, ratio: 3, href: '/splash/iphone-11-pro-max.png' },
        // iPhone 11 Pro, X, XS
        { width: 1125, height: 2436, ratio: 3, href: '/splash/iphone-11-pro.png' },
        // iPhone 11, XR
        { width: 828, height: 1792, ratio: 2, href: '/splash/iphone-11.png' },
        // iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus
        { width: 1242, height: 2208, ratio: 3, href: '/splash/iphone-8-plus.png' },
        // iPhone 8, 7, 6s, 6
        { width: 750, height: 1334, ratio: 2, href: '/splash/iphone-8.png' },
        // iPad Pro 12.9"
        { width: 2048, height: 2732, ratio: 2, href: '/splash/ipad-pro-12-9.png' },
        // iPad Pro 11"
        { width: 1668, height: 2388, ratio: 2, href: '/splash/ipad-pro-11.png' },
        // iPad Air, iPad 10.2"
        { width: 1620, height: 2160, ratio: 2, href: '/splash/ipad-air.png' },
        // iPad mini
        { width: 1536, height: 2048, ratio: 2, href: '/splash/ipad-mini.png' },
      ];

      splashScreens.forEach(screen => {
        const link = document.createElement('link');
        link.rel = 'apple-touch-startup-image';
        link.media = `(device-width: ${screen.width / screen.ratio}px) and (device-height: ${screen.height / screen.ratio}px) and (-webkit-device-pixel-ratio: ${screen.ratio}) and (orientation: portrait)`;
        link.href = screen.href;
        document.head.appendChild(link);
      });
    }

    // Android specific enhancements
    if (isAndroid) {
      // Add mobile-web-app-capable
      if (!document.querySelector('meta[name="mobile-web-app-capable"]')) {
        addMetaTag('mobile-web-app-capable', 'yes');
      }
    }

    // Handle standalone mode detection
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      // Add a class to body for standalone mode styling
      document.body.classList.add('standalone-mode');

      // Log analytics event for PWA usage
      console.log('[PWA] Running in standalone mode');

      // Store standalone mode preference
      localStorage.setItem('pwa-standalone', 'true');
    }

    // Handle app install event
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      localStorage.setItem('pwa-installed', 'true');

      // Track install in analytics if available
      if (
        typeof window !== 'undefined' &&
        (window as { gtag?: (...args: unknown[]) => void }).gtag
      ) {
        (window as { gtag: (...args: unknown[]) => void }).gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'PWA Installed',
        });
      }
    });

    // Handle visibility change for better performance in background
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // App moved to background
        console.log('[PWA] App moved to background');
      } else {
        // App came to foreground
        console.log('[PWA] App came to foreground');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
