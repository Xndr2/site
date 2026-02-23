# Bundle Analysis -- Post-Cleanup

**Date:** 2026-02-23
**Tool:** webpack-bundle-analyzer via `ANALYZE=true npm run build`
**Next.js:** 15.5.11 (production build)

## Build Output Summary

| Route | Page JS | First Load JS | Notes |
|-------|---------|---------------|-------|
| `/` (Home) | 1.26 KB | 111 KB | Static |
| `/about-me` | 1.25 KB | 111 KB | Static |
| `/blog` | 1.25 KB | 111 KB | Static |
| `/blog/[slug]` | 1.26 KB | 111 KB | SSG via generateStaticParams |
| `/contact` | 1.25 KB | 111 KB | Static |
| `/projects` | 2.02 KB | 112 KB | SSG, revalidate 1d |
| Shared by all | -- | 102 KB | Framework + React + analytics |

## Shared JS Bundle Breakdown (102 KB gzipped)

| Chunk | Size (gzipped) | Size (raw) | Contents |
|-------|----------------|------------|----------|
| `chunks/255-*.js` | 45.9 KB | 168.4 KB | @headlessui/react, utility code |
| `chunks/4bd1b696-*.js` | 54.2 KB | 169.0 KB | React DOM, scheduler |
| Other shared | 1.99 KB | ~4 KB | Webpack runtime, manifest |

## Package Composition (Uncompressed)

| Package | Size | Modules | Notes |
|---------|------|---------|-------|
| next/dist | 1,640 KB | 280 | Next.js framework (expected) |
| react-dom | 530 KB | 2 | React DOM (expected, production build) |
| react | 17.8 KB | 2 | React core |
| scheduler | 9.9 KB | 1 | React scheduler |
| @vercel/speed-insights | 6.6 KB | 1 | Real user metrics |
| @vercel/analytics | 6.2 KB | 1 | Analytics |

## Static Assets (in bundle stats)

| Asset | Size | Notes |
|-------|------|-------|
| HeadshotInteractive Thumbnail | 6,086 KB | **Oversized** -- 6MB PNG, candidate for compression |
| jitsemoerman.be Thumbnail | 1,053 KB | **Oversized** -- 1MB PNG, candidate for compression |
| EN_Header_Capsule | 185 KB | Acceptable |
| FN_Website | 167 KB | Acceptable |
| Other thumbnails | ~50 KB each | Acceptable |
| Inter font (woff2) | 83 KB + 47 KB + 25 KB | Google Fonts, served efficiently |
| CSS | 38 KB | Single stylesheet |

## Dead Weight Removed (This Plan)

| Item | Size Saved | Description |
|------|------------|-------------|
| framer-motion | 0 KB runtime (dep cleanup) | Was in package.json but never imported; 0 bytes in bundle |
| public/fonts/ (Montserrat) | 4.3 MB static | TTF files never loaded by any page |
| particles.tsx + mouse.ts | 0 KB runtime (dead code) | Canvas component never imported |
| --font-calsans reference | 0 KB | Stale config reference in tailwind.config.ts |
| @next/swc-linux-x64-gnu workaround | N/A | Removed from optionalDependencies |

## Quick-Win Assessment

### Implemented (this plan)
- Removed framer-motion dependency (clean deps)
- Deleted 4.3MB unused Montserrat fonts
- Deleted dead particles component and mouse utility
- Cleaned stale font config reference

### Remaining Opportunities (for future plans)
1. **Image compression:** HeadshotInteractive thumbnail (6MB) and jitsemoerman.be thumbnail (1MB) are oversized. Compressing to WebP/AVIF at build time via next/image handles this for served content, but the source files still affect build time
2. **Image `sizes` props:** Several `next/image` usages lack `sizes` props, causing browser to download larger srcset entries than needed (covered in Plan 02)
3. **No duplicate modules detected** -- bundle is clean
4. **No unused large dependencies** -- all remaining deps are actively used
5. **@headlessui/react (45.9KB chunk):** Used for dropdown/menu components. Could be replaced with custom components for ~40KB savings, but this is a significant effort for modest gain

## Conclusion

The bundle is lean after cleanup. The shared JS is 102KB (gzipped), which is dominated by React framework code. No actionable quick-win bundle reductions remain beyond the dead weight already removed. The primary remaining optimization opportunity is image `sizes` props (Plan 02) and ISR/Suspense configuration (Plan 03).
