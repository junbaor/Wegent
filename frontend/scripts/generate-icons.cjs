#!/usr/bin/env node

// SPDX-FileCopyrightText: 2025 Weibo, Inc.
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Script to generate PWA icons from the source logo
 * Uses sharp library for image processing
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('Sharp not installed. Installing...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install --no-save sharp', { stdio: 'inherit' });
    sharp = require('sharp');
  } catch (installError) {
    console.error('Failed to install sharp:', installError);
    process.exit(1);
  }
}

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SOURCE_LOGO = path.join(__dirname, '../public/weibo-logo.png');
const ICONS_DIR = path.join(__dirname, '../public/icons');

async function generateIcons() {
  // Ensure icons directory exists
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  // Check if source logo exists
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error(`Source logo not found at ${SOURCE_LOGO}`);
    process.exit(1);
  }

  console.log('Generating PWA icons...');

  // Generate icons for each size
  for (const size of ICON_SIZES) {
    const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);

    try {
      await sharp(SOURCE_LOGO)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(`✗ Failed to generate ${size}x${size} icon:`, error);
    }
  }

  console.log('✓ All icons generated successfully!');
}

generateIcons().catch(error => {
  console.error('Error generating icons:', error);
  process.exit(1);
});
