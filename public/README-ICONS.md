# PWA Icon Strategy

## How Favicons Work for PWA Sites

### favicon.ico - Traditional Multi-Size ICO

The `favicon.ico` file is a special format that contains **multiple icon sizes in one file**:

- 16x16 pixels (browser tabs)
- 32x32 pixels (bookmarks, browser UI)
- 48x48 pixels (legacy Windows)

**Important:** You cannot create this with `sharp` or standard image tools. Use:

- [favicon.io](https://favicon.io/) - Free online generator
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Comprehensive tool
- [IconKitchen](https://icon.kitchen/)

### Next.js 15 Automatic Detection

Next.js 15 (App Router) automatically detects these files in the `/app` directory:

- `favicon.ico` → Browser favicon
- `icon.png` → Main icon (used for various sizes)
- `apple-touch-icon.png` → iOS home screen (180x180)
- `opengraph-image.png` → Social sharing (1200x630)
- `twitter-image.png` → Twitter cards (optional)

### PWA Requirements

For **Progressive Web App** installation prompts, you need:

1. **Manifest icons (site.webmanifest):**
   - At least **192x192** pixels (Android home screen)
   - At least **512x512** pixels (install splash screen)
   - Both sizes serve the same purpose but different contexts

2. **Our current setup:**
   - `icon.png` (512x512) - Used for PWA install prompts
   - `apple-touch-icon.png` (180x180) - iOS devices
   - `opengraph-image.png` (1200x630) - Social sharing

### Icon Generation

Use the included script to generate icons from your logo:

```bash
bun run generate-icons <path-to-source-logo.png>
```

**Requirements for source image:**

- Minimum 512x512 pixels
- Square (1:1 aspect ratio) for best results
- PNG, JPG, or SVG format

### Manual favicon.ico Creation

Since the script cannot generate a proper multi-size ICO file, create it manually:

1. Go to [favicon.io](https://favicon.io/) or [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Upload your logo
3. Generate the favicon.ico file
4. Place it in `src/app/favicon.ico`

### Why Not Multiple Separate Icons?

Next.js 15's automatic detection system simplifies icon management. Instead of maintaining:

- `/icons/favicon-16x16.png`
- `/icons/favicon-32x32.png`

- `/icons/android-chrome-192x192.png`
- `/icons/android-chrome-512x512.png`

You now only need:

- `icon.png` (512x512) - PWA and general use
- `apple-touch-icon.png` (180x180) - iOS
- `favicon.ico` - Traditional browsers (created via online tool)

Next.js and the manifest handle the rest automatically!

## File Structure

```
src/app/
├── favicon.ico              # Multi-size ICO (create manually)
├── icon.png                 # 512x512 PWA icon
├── apple-touch-icon.png    # 180x180 iOS icon
└── opengraph-image.png     # 1200x630 social sharing

public/
├── site.webmanifest         # PWA manifest (references icon.png sizes)
└── robots.txt              # SEO configuration
```

## Testing Your Icons

- **Browser tabs:** Check favicon in browser tab
- **Bookmarks:** Add to bookmarks to see icon
- **PWA install:** Check install prompt in dev tools (Application → Manifest)
- **iOS:** Test on Apple device or iOS simulator
- **Social sharing:** Use [Open Graph Debugger](https://developers.facebook.com/tools/debug/)

## Next Steps

1. Run `bun run generate-icons` to create proper icons from your actual logo
2. Generate proper `favicon.ico` using an online tool
3. Test PWA installation on mobile and desktop

4. Verify icons appear correctly in all contexts
