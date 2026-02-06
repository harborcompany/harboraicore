# Design System

## Core/Base
- **Font Family**: 'Inter', sans-serif
- **Base Font Size**: 13px (html set to this, so 1rem = 13px)
- **Background**: #F9F9F9 (Light Gray)
- **Text Color**: #111827 (Charcoal)

## Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#000000` | Main actions, buttons, strong text |
| `secondary` | `#111827` | Headings, dark backgrounds |
| `muted` | `#6B7280` | Secondary text, placeholders |
| `border` | `#E5E7EB` | Dividers, inputs |
| `accent` | `#6366F1` | Brand highlights, focus states |
| `cream` | `#FFFFFF` | Card backgrounds, modals (reset from actual cream to white) |
| `charcoal` | `#111827` | Neutral dark |

## Typography
| Class | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `.h1-hero` | 56px | 600 (SemiBold) | 0.95 | Main Landing Hero |
| `body` | 13px | 400 (Regular) | ? | Standard copy |

## Spacing & Radius
- **Border Radius**:
  - `xl`: 12px
  - `2xl`: 18px
  - `pill`: 9999px
- **Padding**:
  - Buttons: `px-6 py-2.5` (0.625rem 1.5rem)

## Components (Extracted)

### Buttons
**Primary Button** (`.btn-primary`)
- Bg: `#000000`
- Text: `#FFFFFF`
- Radius: `9999px`
- Weight: 500
- Hover/Active: Scale 0.95

**Secondary Button** (`.btn-secondary`)
- Bg: `rgba(255, 255, 255, 0.05)`
- Border: `1px solid rgba(255, 255, 255, 0.1)` (Glass effect)
- Text: `#FFFFFF`
- Radius: `9999px`
- Weight: 500
- Hover: Bg `rgba(255, 255, 255, 0.1)`

## Shadows
- `soft`: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)`
