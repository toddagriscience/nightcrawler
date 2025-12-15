// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Icon Generation Script for Next.js App Router
 *
 * This script generates PWA icons from a source image for Next.js 15 App Router.
 * Next.js automatically detects these files in the /app directory.
 *
 * Usage: bun run generate-icons <source-image-path>
 * Example: bun run generate-icons path/to/source-logo.png
 *
 * Generated files in /app:
 * - favicon.ico (multi-size ICO - created manually via online tool)
 * - icon.png (PWA main icon, 512x512 for install prompts)
 * - apple-touch-icon.png (Apple touch icon, 180x180)
 * - opengraph-image.png (Open Graph & Twitter card image, 1200x630)
 *
 * Requirements:
 * - Source image must be at least 512x512px for best results
 * - Source image should be square (1:1 aspect ratio)
 * - Source image format: PNG, JPG, or SVG
 */
import * as fs from 'fs';
import * as path from 'path';

interface IconSpec {
  filename: string;
  width: number;
  height: number;
  description: string;
  format?: 'png' | 'jpg';
}

const APP_DIR = path.join(process.cwd(), 'src', 'app');

const ICON_SPECS: IconSpec[] = [
  {
    filename: 'icon.png',
    width: 512,
    height: 512,
    description: 'PWA main icon (512x512 for install prompts)',
    format: 'png',
  },
  {
    filename: 'apple-touch-icon.png',
    width: 180,
    height: 180,
    description: 'Apple touch icon (180x180)',
    format: 'png',
  },
  {
    filename: 'opengraph-image.png',
    width: 1200,
    height: 630,
    description: 'Open Graph & Twitter image (1200x630)',
    format: 'png',
  },
];

const COLORS = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

function log(message: string, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function success(message: string) {
  log(`✓ ${message}`, COLORS.green);
}

function error(message: string) {
  log(`✗ ${message}`, COLORS.red);
}

function warn(message: string) {
  log(`⚠ ${message}`, COLORS.yellow);
}

function info(message: string) {
  log(`ℹ ${message}`, COLORS.cyan);
}

/**
 * Generate icons from a source image using sharp
 */
async function generateIcons(sourceImagePath: string) {
  try {
    // Check if source image exists
    if (!fs.existsSync(sourceImagePath)) {
      error(`Source image not found: ${sourceImagePath}`);
      process.exit(1);
    }

    info(`Loading image processing library...`);

    // Dynamically import sharp
    let sharp;
    try {
      const sharpModule = await import('sharp');
      sharp = sharpModule.default;
    } catch (err) {
      error('Sharp library not found.');
      log('\nPlease install sharp to use this script:');
      log('  bun install --save-dev sharp');
      log(
        '\nAlternative: Use an online tool at https://realfavicongenerator.net/'
      );
      process.exit(1);
    }

    info(`Reading source image: ${sourceImagePath}`);
    const sourceImage = sharp(sourceImagePath);

    // Verify source image dimensions
    const metadata = await sourceImage.metadata();
    if (metadata.width && metadata.height) {
      info(`Source image dimensions: ${metadata.width}x${metadata.height}`);

      if (metadata.width < 512 || metadata.height < 512) {
        warn('Source image should be at least 512x512px for best results');
      }

      if (Math.abs(metadata.width / metadata.height - 1) > 0.01) {
        warn('Source image is not square. Icons may be stretched.');
      }
    }

    log('\nGenerating icons for Next.js App Router...\n');

    // Ensure app directory exists
    if (!fs.existsSync(APP_DIR)) {
      fs.mkdirSync(APP_DIR, { recursive: true });
    }

    // Generate each icon size
    for (const spec of ICON_SPECS) {
      try {
        const outputPath = path.join(APP_DIR, spec.filename);

        // Resize and save the icon
        await sourceImage
          .clone()
          .resize(spec.width, spec.height, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 },
          })
          .png()
          .toFile(outputPath);

        success(`Generated: ${spec.filename} (${spec.description})`);
      } catch (err) {
        error(`Failed to generate ${spec.filename}: ${err}`);
      }
    }

    // Generate favicon.ico (multi-size ICO file)
    log('\nGenerating favicon.ico...');
    try {
      const icoPath = path.join(APP_DIR, 'favicon.ico');

      // Generate 16x16, 32x32, and 48x48 sizes and combine into ICO
      // Note: Sharp doesn't directly support ICO format, so we create PNG
      // For a proper ICO file, use an online tool or convert manually
      await sourceImage
        .clone()
        .resize(32, 32, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(path.join(APP_DIR, 'favicon-temp.png'));

      // Use the PNG as favicon for now
      fs.copyFileSync(path.join(APP_DIR, 'favicon-temp.png'), icoPath);
      fs.unlinkSync(path.join(APP_DIR, 'favicon-temp.png'));

      warn('Note: favicon.ico is a PNG file. For a proper ICO file:');
      warn('  1. Use https://www.favicon-generator.org/');
      warn('  2. Or use ImageMagick: convert favicon-temp-*.png favicon.ico');
      success(`Created favicon.ico in /app directory`);
    } catch (err) {
      warn(`Could not generate favicon.ico: ${err}`);
    }

    log('\n' + '='.repeat(60));
    success('Icon generation complete!');
    log('='.repeat(60));

    info('\nNext.js will automatically detect these files in /app:');
    for (const spec of ICON_SPECS) {
      log(`  ${spec.filename}`);
    }
    log('  favicon.ico');

    log('\nFiles are ready to use. Next.js will:');
    log('  - Automatically add <link rel="icon"> tags');
    log(
      '  - Automatically add Open Graph tags (opengraph-image.png used for OG, Twitter, LinkedIn)'
    );
    log('  - Handle Apple touch icon detection');
    log('  - One Open Graph image works for all social platforms');

    warn('\nNote: For a proper favicon.ico file:');
    warn('  Use https://www.favicon-generator.org/ or similar online tool');
  } catch (err) {
    error('Failed to generate icons:');
    console.error(err);
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  error('No source image provided');
  log('\nUsage: bun run generate-icons <source-image-path>');
  log('Example: bun run generate-icons path/to/logo.png');
  log('\nThis will generate all necessary icon files in src/app/');
  process.exit(1);
}

const sourceImagePath = path.isAbsolute(args[0])
  ? args[0]
  : path.join(process.cwd(), args[0]);

generateIcons(sourceImagePath).catch((err) => {
  error('Unexpected error:');
  console.error(err);
  process.exit(1);
});
