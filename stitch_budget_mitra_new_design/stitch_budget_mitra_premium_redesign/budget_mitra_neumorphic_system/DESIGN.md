---
name: Budget Mitra Neumorphic System
colors:
  surface: '#fbf9fb'
  surface-dim: '#dbd9dc'
  surface-bright: '#fbf9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f5'
  surface-container: '#efedf0'
  surface-container-high: '#e9e7ea'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1e'
  on-surface-variant: '#44474d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f2f0f3'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#4e5f7c'
  primary: '#00030a'
  on-primary: '#ffffff'
  primary-container: '#0a1d37'
  on-primary-container: '#7586a5'
  inverse-primary: '#b6c7e9'
  secondary: '#00687b'
  on-secondary: '#ffffff'
  secondary-container: '#50dcff'
  on-secondary-container: '#005f71'
  tertiary: '#000301'
  on-tertiary: '#ffffff'
  tertiary-container: '#002213'
  on-tertiary-container: '#009865'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b6c7e9'
  on-primary-fixed: '#081c36'
  on-primary-fixed-variant: '#364763'
  secondary-fixed: '#afecff'
  secondary-fixed-dim: '#48d7f9'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#004e5d'
  tertiary-fixed: '#82f9be'
  tertiary-fixed-dim: '#65dca4'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005235'
  background: '#fbf9fb'
  on-background: '#1b1b1e'
  surface-variant: '#e4e2e4'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
  container-max: 1200px
---

## Brand & Style

The design system is centered on **Advanced Neumorphism**, moving beyond flat surfaces to create a tactile, physical environment for financial management. The brand personality is professional, high-tech, and reassuring, using depth to signify stability and interaction.

The style utilizes soft-extruded surfaces and inset "wells" to create a sense of physical machinery. By emphasizing light source directionality (typically top-left), the UI provides immediate intuitive feedback on what can be pressed (protruding) and what holds information (recessed). This tactile approach transforms a standard fintech app into a premium, specialized tool.

## Colors

The palette is anchored by a sophisticated, cool-toned neutral base (`#E6E9EF`). This specific off-white/grey is essential for Neumorphism as it provides enough "headroom" for white highlights to pop and enough saturation for colored shadows to feel integrated.

- **Primary (Deep Navy):** Reserved for high-priority actions and branding elements to provide maximum contrast against the soft base.
- **Secondary (Vibrant Teal):** Used for interactive accents, progress bars, and data visualization highlights.
- **Tertiary (Emerald Green):** Dedicated to positive financial indicators, savings goals, and success states.
- **Shadow Logic:** To avoid a "muddy" look, the dark shadows (`#B8C2D0`) are slightly tinted with the blue of the base surface. Highlighting is pure white (`#FFFFFF`) to mimic a direct light source.

## Typography

This design system uses **Plus Jakarta Sans** exclusively to maintain a modern, tech-forward aesthetic that balances clean geometry with high readability.

Headlines use tighter letter spacing and heavier weights to command attention against the soft UI shadows. For financial figures, `label-md` is frequently used with semi-bold weights to ensure numbers are the focal point. Large display sizes are scaled down for mobile to ensure the tactile layout has sufficient room to breathe.

## Layout & Spacing

A **fluid grid** model is used, but with significantly more internal padding than traditional flat designs. Neumorphic elements require "breathing room" for their shadows to extend without overlapping adjacent components.

- **Rhythm:** An 8px base unit governs all dimensions. 
- **Density:** Elements are spaced generously. Cards should have at least 24px of internal padding to ensure the "extrusion" effect doesn't feel cramped.
- **Responsive:** On mobile, margins are kept at 20px. On desktop, a 12-column grid is used, but components are often grouped into larger tactile "trays" or containers to maintain the physical metaphor.

## Elevation & Depth

Hierarchy is established through the direction and intensity of shadows. 

1.  **Extruded (Convex):** Standard cards and buttons. Created using two shadows: a light shadow (Top-Left: -8px, -8px, 16px, #FFFFFF) and a dark shadow (Bottom-Right: 8px, 8px, 16px, #B8C2D0).
2.  **Inset (Concave):** Input fields and "pressed" button states. Created using two *inner* shadows with the same coordinates and colors as the extruded shadows.
3.  **Floating:** High-priority modals or FABs. These use a larger blur radius (32px) and a slightly deeper dark shadow to suggest greater distance from the base surface.

All shadows should be applied at low opacities (approx. 50-80%) to ensure they feel like light hitting a surface rather than a graphic border.

## Shapes

The design system utilizes **Rounded** (Level 2) geometry. Soft corners are mandatory for the Neumorphic effect to work; sharp corners break the "liquid plastic" illusion. 

- **Primary Radius:** 16px (1rem) for standard cards and containers.
- **Large Radius:** 24px (1.5rem) for major layout sections or "trays."
- **Pill Shapes:** Used exclusively for buttons and tags to provide a distinct silhouette against rectangular content cards.

## Components

### Buttons
Primary buttons use the Deep Navy color with white text. When unpressed, they are extruded. When clicked/tapped, they transition to an **inset state** with inner shadows, providing a mechanical "click" feel. Accent buttons use the Teal or Green palettes with the same logic.

### Cards
Cards are the primary container. They must never have borders. Instead, the double-shadow technique creates the edge. Content inside cards should be aligned with sufficient padding (24px+) to avoid the shadows of internal elements (like inputs) clashing with the card's edge.

### Input Fields
Inputs are always **inset**. This creates a "well" that signifies the user can place information into the UI. The label should sit above the well, while the cursor and text sit inside the recessed area.

### Chips & Progress Bars
Progress bars are treated as inset tracks with an extruded "filler" that uses a gradient of the secondary or tertiary color. This creates a high-tech "liquid level" appearance.

### Icons
Icons should be thin-stroke (2px) and use the Primary Navy color. Avoid filled icons unless they are used inside an extruded button to maintain the light-and-shadow consistency.