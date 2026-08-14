# Asset contract

Approved visual assets live under `src/static/assets/`. The build copies them to `/assets/` unchanged.

## Manifest

[`asset-manifest.json`](../src/static/assets/asset-manifest.json) is the old-to-new mapping. Each entry records:

- every captured WordPress source URL and its local replacement
- intrinsic dimensions, format, and byte size
- owning final routes
- rendered source alt text
- responsive variants retained for final markup

Page modules should use the local paths from the manifest. Social metadata must use absolute URLs such as `https://www.djk-zar.nl/assets/images/djk-zar-social.png` because crawlers do not reliably resolve relative preview images.

## Image policy

Original uploads are retained when available. Smaller responsive files use renamed standard 768px WordPress derivatives. The homepage also uses local AVIF variants for its hero and introductory images to meet the release performance budget; the original JPEGs remain in the manifest. Elementor crop files are excluded. The original Jochem portrait replaces its Elementor thumbnail, with the observed square crop left to CSS `object-fit`.

The source images had already been compressed by the production image optimizer. They are kept byte-for-byte to avoid another lossy pass. Existing WebP stays WebP. PNG is retained for transparency, favicons, and crawler-compatible social previews. SVG editor metadata was removed where present, and all SVGs are checked for scripts, event handlers, foreign objects, and external resources.

The 2020 and 2025 header-texture URLs are byte-identical and map to one local file. Reviews-feed sprites and plugin icons are omitted because static HTML/CSS replaces plugin UI. The four Instagram images are static content, not a live feed.

Empty and filename-like source alt values remain flagged in the manifest. Page tasks must use decorative empty alt where appropriate or seek owner-approved factual text rather than inventing details.

## Fonts and licenses

[`fonts/fonts.css`](../src/static/assets/fonts/fonts.css) defines only the production faces observed in visible content:

- Inter variable upright and italic
- Roboto variable upright and italic, Latin subset
- Poppins 500 upright and 700 italic, Latin subset

All cover the captured Dutch and English characters and include system fallbacks through the consuming CSS. The fonts are licensed under SIL Open Font License 1.1; license texts are stored beside the files. Inter uses the official Google Fonts Latin variable subsets instead of the much larger multilingual Twenty Twenty files. Roboto and Poppins come from Elementor's self-hosted Google Fonts cache.

## Documents

The two linked PDFs are stored locally at these public paths:

- `/assets/documents/gedragsregels-en-vertrouwenspersoon.pdf`
- `/assets/documents/machtiging-djk.pdf`

Redirects from old WordPress document URLs are defined in the shared Apache configuration.

## Verification

```sh
npm run check:assets
```

The check builds the site, verifies every deployed asset against the manifest, rejects duplicate source mappings and unsafe SVG content, and ensures the manifest accounts for every file.
