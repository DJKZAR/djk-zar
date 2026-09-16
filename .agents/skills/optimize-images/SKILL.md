---
name: optimize-images
description: Optimize DJK-ZAR website images for web delivery. Use whenever adding, replacing or updating an image, changing image rendering, or auditing image performance across pages. Includes a reproducible AVIF/WebP optimization script and verification workflow.
compatibility: Python 3 with Pillow 12.3.0, Node.js 22+ for site checks.
---

# Optimize images

## Required workflow

1. Read repository `AGENTS.md`, inspect git status, and follow the plan workflow for substantial changes. Keep this work within the current image-related task.
2. Audit the image's real usages in all page modules, shared layout, CSS backgrounds, responsive variants and social metadata. Check both languages and the reference/404 documents.
3. Register new originals in `src/static/assets/asset-manifest.json`, including source provenance, owners, alt guidance, dimensions, format and byte count. Keep existing public URLs available. Do not overwrite a source with a lossy derivative.
4. Choose dimensions from the rendered size and expected device pixel ratio. Typical photos: 640px and 1200px for up to 600px cards at 2x. Footer sponsor: 240px for 120px rendering. Full-width heroes: retain source resolution, at most 1920px unless justified. Never upscale. Preserve good existing AVIF, WebP, SVG and small PNG assets instead of blindly recompressing them.
5. Use the script below. Use AVIF quality 60 for photos after visual comparison, or WebP quality 82 (the script default) when that performs better. Logos, diagrams and text should use WebP `--lossless` and preserve sufficient resolution. Review color, text legibility, transparency and facial detail visually. Animated images require a separate manual workflow. Embedded color profiles are converted to sRGB before metadata is stripped; review color-critical sources carefully.
6. Render content images with `imageSource(path, sizes)` from `src/images.mjs`. Give an accurate `sizes` value, explicit width/height, meaningful alt text (empty only for decorative images), and lazy loading below the fold. Keep hero images eager. Use `imageUrl(path)` for optimized background images and matching preloads. Retain PNG social/favicon URLs for compatibility.
7. If changing shared CSS/JS references, bump the layout's corresponding cache query and structural check. Rebuild and run `npm run qa`. Checks reject stale derivatives after source updates, rendered JPEG originals, images exceeding 200 KB, missing image candidates and undeclared assets. Run `PYTHONDONTWRITEBYTECODE=1 /tmp/djk-image-tools/bin/python /absolute/path/to/optimize-images/scripts/test_optimize.py` when changing the optimizer; its tests cover orientation, color profiles, metadata removal, transparency, repeatability, no upscaling and safe regeneration.
8. Inspect every affected page with Playwright on desktop and mobile, scroll to lazy images, and confirm images decode and preserve the layout. Check hero/CSS backgrounds too. Compare screenshots or representative crops with originals. Confirm all SEO, redirects and 404 checks pass.
9. Report original and optimized byte counts and percentage savings. Distinguish per-image/unique-asset savings from actual page requests and deployed disk size. Originals are retained, so derivative generation increases disk size while decreasing visitors' downloads. Do not claim the whole-site speed improved by the same percentage.

## Setup

Use an external virtual environment, not a repository dependency:

```bash
python3 -m venv /tmp/djk-image-tools
/tmp/djk-image-tools/bin/pip install Pillow==12.3.0
```

## Script

Resolve `scripts/optimize.py` relative to this skill directory. It locates the repository itself, so it works from any working directory.

```bash
/tmp/djk-image-tools/bin/python /absolute/path/to/optimize-images/scripts/optimize.py mens-team-2.jpeg --widths 640,1200 --format avif --quality 60
/tmp/djk-image-tools/bin/python /absolute/path/to/optimize-images/scripts/optimize.py water-polo-rules.png --widths 800 --lossless
# Recreate all registered derivatives after editing their originals:
/tmp/djk-image-tools/bin/python /absolute/path/to/optimize-images/scripts/optimize.py --all
```

The script writes `*-web-WIDTH.avif` or `*-web-WIDTH.webp` derivatives and updates the manifest with actual dimensions/bytes, saved settings and a source SHA-256. It applies EXIF orientation and embedded color profiles before stripping EXIF/GPS metadata, never upscales, refuses unmanaged output overwrites, and skips variants that are not smaller than the source. Existing unrelated variants and source files remain intact. When replacing an original, review old manually generated variants too; the script only regenerates its own outputs. Commit image outputs, the manifest and consuming code together. Python/Pillow is optimization-time tooling only, not needed for normal builds.
