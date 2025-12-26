# PWA Implementation for Wegent

This document describes the PWA (Progressive Web App) features added to Wegent for a better mobile experience.

## Features

### 1. Web App Manifest
- **File**: `frontend/public/manifest.json`
- Defines app name, icons, theme colors, and display mode
- Enables "Add to Home Screen" functionality
- Supports shortcuts and share targets

### 2. Service Worker
- **File**: `frontend/public/sw.js`
- Implements caching strategies for offline support
- Handles notification clicks
- Supports background sync
- Push notification support

### 3. PWA Icons
- **Directory**: `frontend/public/icons/`
- Multiple sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 180x180, 192x192, 384x384, 512x512
- Generated from the source logo using `npm run generate-icons`

### 4. Install Prompt
- **Component**: `frontend/src/components/PWAInstallPrompt.tsx`
- Shows platform-specific installation instructions
- iOS: Shows manual installation steps
- Android/Chrome: Shows native install prompt
- Remembers dismissal for 7 days

### 5. PWA Enhancements
- **Component**: `frontend/src/components/PWAEnhancements.tsx`
- Handles iOS-specific meta tags
- Adds splash screen support
- Manages standalone mode detection
- Tracks app installation events

### 6. Mobile Optimizations
- **File**: `frontend/src/app/pwa.css`
- Safe area insets for iOS notch/home indicator
- Better touch targets (min 44px)
- Smooth scrolling
- Prevents pull-to-refresh
- Optimized input focus (prevents iOS zoom)

### 7. Offline Support
- **Page**: `frontend/src/app/offline/page.tsx`
- User-friendly offline page
- Shows cached content availability
- Retry button

## Installation

### For Users

#### iOS (iPhone/iPad)
1. Open Wegent in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top right corner

#### Android/Chrome
1. Open Wegent in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Follow the prompts

### For Developers

```bash
# Generate PWA icons from source logo
npm run generate-icons

# Build the app
npm run build

# Test PWA features
# 1. Build and run in production mode
npm run build && npm start

# 2. Open Chrome DevTools > Application tab
# 3. Check Manifest, Service Workers, and Cache Storage
```

## Testing PWA Features

### Lighthouse Audit
```bash
# Run Lighthouse in Chrome DevTools
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Select "Progressive Web App" category
# 4. Click "Generate report"
```

### Service Worker Testing
```bash
# 1. Open Chrome DevTools > Application > Service Workers
# 2. Check "Update on reload" for development
# 3. Test offline mode by checking "Offline" checkbox
```

### Manifest Testing
```bash
# 1. Open Chrome DevTools > Application > Manifest
# 2. Verify all fields are correct
# 3. Click "Add to homescreen" to test installability
```

## Browser Support

- ✅ Chrome/Edge (Android & Desktop): Full support
- ✅ Safari (iOS): Partial support (no native install prompt, manual installation)
- ✅ Firefox (Android): Full support
- ⚠️ Safari (macOS): Limited support
- ❌ Internet Explorer: Not supported

## Technical Details

### Caching Strategy

1. **Static Assets** (Precache on install)
   - `/` (home page)
   - `/offline` (offline page)
   - `/manifest.json`
   - Key icons

2. **Images** (Cache-first)
   - Cached on first load
   - Served from cache when available
   - Falls back to network

3. **Navigation** (Network-first)
   - Try network first
   - Fall back to cache if offline
   - Show offline page if no cache

4. **API Requests** (Network-only)
   - Always fetch from network
   - Return error response if offline

### Performance Optimizations

- Lazy loading of service worker
- Efficient icon sizes and formats
- Optimized CSS for mobile
- Minimal JavaScript for core functionality
- Background cache updates

## Configuration

### Environment Variables
No additional environment variables required. PWA features work out of the box.

### Customization

To customize PWA settings, edit:
- `frontend/public/manifest.json` - App metadata
- `frontend/public/sw.js` - Caching strategies
- `frontend/src/app/pwa.css` - Mobile styles
- `frontend/src/components/PWAInstallPrompt.tsx` - Install prompt behavior

## Known Limitations

1. **iOS Safari**: Requires manual installation (no native install prompt)
2. **Splash Screens**: iOS splash screens require specific image assets per device
3. **Background Sync**: Limited support on iOS
4. **Push Notifications**: Not supported on iOS PWAs

## Future Enhancements

- [ ] Generate splash screen images for all iOS devices
- [ ] Add Web Push notification support for Android
- [ ] Implement background sync for offline task creation
- [ ] Add app shortcuts for common actions
- [ ] Improve offline task queue management
- [ ] Add update notification when new version available

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Checklist](https://web.dev/pwa-checklist/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [iOS PWA Guide](https://webkit.org/blog/8090/workers-at-your-service/)
