# Walkthrough - Global Visual Unification

## Context
The user reported that inner pages did not match the quality or formatting of the Homepage (`Landing.tsx`) and requested:
1.  Fixed formatting and sizing across all pages.
2.  Placeholder images in all sections.
3.  Strict adherence to the Homepage style.

## Updates
I performed a system-wide audit and refactor of `Product.tsx`, `AdsNewPage.tsx`, `Datasets.tsx`, and `Infrastructure.tsx` to align with `Landing.tsx`.

### 1. Typography & Layout Standardization
| Metric | `Landing.tsx` (Target) | Inner Pages (Before) | Inner Pages (After) |
| :--- | :--- | :--- | :--- |
| **Max Width** | `1600px` | `1200px` / `1400px` | **`1600px`** |
| **Hero Font** | `h1-hero` / `font-semibold` | `text-6xl`, `font-serif` | **Consistent `leading-[1.05]` & `tracking-tighter`** |
| **Padding** | `px-4 md:px-6` | `px-6` | **`px-4 md:px-6`** |
| **Cards** | `rounded-2xl border-gray-100` | Mixed | **Standardized `rounded-[2rem]` & `rounded-2xl`** |

# Visual Alignment & Hero Standardization Walkthrough

I have successfully completed the strict visual alignment of all marketing pages (`Product`, `Ads`, `Datasets`, `Infrastructure`) to match the premium design standard established in `Landing.tsx`.

## Key Changes
- **"Black Box" Hero Standardization**: Replaced all heterogeneous hero sections with the canonical `Landing.tsx` structure: A 75vh rounded-2xl black container with bottom-aligned text and video/image backgrounds.
- **Ads Page Theme Correction**: Reverted `AdsNewPage` from a custom dark theme to the global White theme to ensure consistency.
- **Logo Consistency**: Removed the hardcoded (and incorrect) Navbar from `AdsNewPage`, allowing it to inherit the correct global Navbar and Logo from `Layout.tsx`.
- **Component Styling**: Updated Bento Grids and Feature cards in `AdsNewPage` to match the light-mode standard used in `Product` and `Landing`.

## Verification
- **Build Verification**: `npm run build` passed successfully.
- **Linting**: Fixed missing imports in `Datasets.tsx`.

## Visual Reference
The "Black Box" Hero pattern is now applied consistently:
```tsx
<div className="relative w-full h-[70vh] md:h-[75vh] rounded-2xl overflow-hidden bg-[#0B0F19] group border border-white/5">
   {/* Background & Overlay */}
   <img className="..." />
   <div className="bg-gradient-to-t..." />
   
   {/* Bottom Aligned Content */}
   <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 pb-16">
      <h1 className="h1-hero text-white">...</h1>
   </div>
</div>
```

## Outcome
The site now feels like a single coherent product ("Harbor") rather than a collection of disparate pages. All pages respect the "Polar-style" guidelines established by the homepage.
