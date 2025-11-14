# Elementor MCP Presets Guide

## Overview

The Elementor MCP server now includes enhanced helper functions and layout presets that generate Elementor-compatible JSON structures matching real-world complex designs. These improvements were learned from analyzing the `/example-design` page and implementing proper responsive settings, string formatting, and structure patterns.

## Key Improvements

### 1. Enhanced Helper Functions

All helper functions now support:
- **Responsive settings**: Tablet and mobile overrides for padding, margin, flex gap, and typography
- **Proper string formatting**: All numeric values are converted to strings (as Elementor expects)
- **Complete structure**: Proper `isInner` flags, `_column_size`, `sizes: []` arrays, and Elementor-compatible formats

### 2. Layout Presets

High-level presets for common marketing/app layouts:
- **Hero with Text + Image**: Two-column hero section with responsive stacking
- **Card Grid**: Responsive card layouts (3-4 columns) with images, titles, and metadata
- **Feature List**: Icon + heading + text columns in a grid
- **Testimonial Strip**: Horizontal testimonial cards

## Enhanced Helper Functions

### Container Helpers

#### `createContainer(settings, elements, isInner)`
Creates a container with proper `isInner` flag handling.

```typescript
const container = ElementorHelpers.createContainer(
  {
    layout: 'full_width',
    content_width: 'full',
    flex_direction: 'row',
    padding: ElementorHelpers.createPadding({
      top: 100,
      right: 20,
      bottom: 100,
      left: 20,
      unit: 'px',
    }),
    padding_tablet: ElementorHelpers.createPadding({
      top: 80,
      right: 15,
      bottom: 80,
      left: 15,
      unit: 'px',
    }),
    padding_mobile: ElementorHelpers.createPadding({
      top: 40,
      right: 10,
      bottom: 40,
      left: 10,
      unit: 'px',
    }),
  },
  [/* elements */],
  false // isInner: false for top-level
);
```

#### `createNestedContainer(columnSize, settings, elements)`
Creates a nested container with `_column_size` and `isInner: true`.

```typescript
const column = ElementorHelpers.createNestedContainer(
  '50', // 50% width
  {
    flex_direction: 'column',
    padding: ElementorHelpers.createPadding({ unit: 'px', top: 20 }),
  },
  [/* widgets */]
);
```

#### `createFullWidthLayout(elements, backgroundSettings)`
Creates a full-width container with column layout.

```typescript
const hero = ElementorHelpers.createFullWidthLayout(
  [
    ElementorHelpers.createHeadingWidget({ title: 'Hero Title' }),
  ],
  {
    ...ElementorHelpers.createGradientBackground({
      colorOne: '#667eea',
      colorTwo: '#764ba2',
    }),
    min_height: {
      unit: 'vh',
      size: '60',
      sizes: [],
    },
    padding: ElementorHelpers.createPadding({
      top: 120,
      bottom: 120,
      unit: 'px',
    }),
  }
);
```

#### `createContentContainer(elements, maxWidth, padding)`
Creates a boxed container with max-width.

```typescript
const section = ElementorHelpers.createContentContainer(
  [/* elements */],
  1200, // max width in px
  {
    top: 80,
    right: 40,
    bottom: 80,
    left: 40,
  }
);
```

#### `createRowContainer(elements, options)`
Creates a row container with flex layout.

```typescript
const row = ElementorHelpers.createRowContainer(
  [column1, column2, column3],
  {
    gap: 30,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    wrap: true,
  }
);
```

### Responsive Helpers

#### `createPadding(options)`
Creates padding with responsive variants.

```typescript
const padding = ElementorHelpers.createPadding({
  top: 100,
  right: 20,
  bottom: 100,
  left: 20,
  unit: 'px',
  isLinked: false, // or true
});

// Responsive variants
const paddingTablet = ElementorHelpers.createPadding({
  top: 80,
  right: 15,
  bottom: 80,
  left: 15,
  unit: 'px',
});
```

#### `createFlexGap(options)`
Creates flex gap with responsive variants.

```typescript
const gap = ElementorHelpers.createFlexGap({
  size: 30,
  unit: 'px',
  column: 30, // Optional, defaults to size
  row: 30,    // Optional, defaults to size
  isLinked: true,
});

// Responsive variants
const gapTablet = ElementorHelpers.createFlexGap({
  size: 20,
  unit: 'px',
});
```

### Typography Helpers

#### Enhanced `createHeadingWidget(options)`
Now supports full typography with responsive sizes.

```typescript
const heading = ElementorHelpers.createHeadingWidget({
  title: 'My Heading',
  size: 'xl',
  headerSize: 'h1',
  align: 'center',
  color: '#1C244B',
  typography: {
    fontSize: 85,
    fontSizeTablet: 65,
    fontSizeMobile: 48,
    fontWeight: '600',
    lineHeight: 1.0,
    lineHeightMobile: 1.0,
    fontFamily: 'Poppins',
  },
});
```

#### Enhanced `createTextEditorWidget(options)`
Now supports typography with responsive sizes.

```typescript
const text = ElementorHelpers.createTextEditorWidget({
  content: '<p>Text content</p>',
  align: 'left',
  typography: {
    fontSize: 25,
    fontSizeTablet: 21,
    fontSizeMobile: 20,
    fontWeight: '400',
    lineHeight: 1.0,
    fontFamily: 'Poppins',
  },
  textColor: '#AD5207',
});
```

### Widget Helpers

#### Enhanced `createIconWidget(options)`
Now includes `secondaryColor` for stacked/framed views and proper size formatting.

```typescript
const icon = ElementorHelpers.createIconWidget({
  icon: 'fas fa-star',
  library: 'fa-solid',
  align: 'center',
  view: 'stacked',
  shape: 'circle',
  primaryColor: '#ff6b6b',    // Background color
  secondaryColor: '#ffffff',   // Icon color (REQUIRED for stacked!)
  iconSize: 55,
  iconPadding: 28,
});
```

#### Enhanced `createButtonWidget(options)`
Now supports full typography and responsive settings.

```typescript
const button = ElementorHelpers.createButtonWidget({
  text: 'Click Me',
  link: '#',
  align: 'center',
  size: 'xl',
  type: 'primary',
  typography: {
    fontSize: 16,
    fontSizeTablet: 14,
    fontWeight: '400',
    textTransform: 'capitalize',
    letterSpacing: 0,
  },
});
```

## Layout Presets

### Hero with Text + Image

```typescript
import { buildHeroTextImageSection } from './elementor-presets.js';

const hero = buildHeroTextImageSection({
  eyebrow: 'Welcome',
  title: 'This Headline Grabs Attention',
  description: 'A short description introducing visitors to your business.',
  button: {
    text: 'Learn More',
    link: '#',
  },
  image: {
    url: 'http://localhost:8080/wp-content/uploads/image.jpg',
    alt: 'Hero image',
  },
  layout: 'image-right', // or 'image-left'
  background: ElementorHelpers.createGradientBackground({
    colorOne: '#667eea',
    colorTwo: '#764ba2',
  }),
});
```

### Card Grid

```typescript
import { buildCardGridSection } from './elementor-presets.js';

const cardGrid = buildCardGridSection({
  heading: 'Popular Destinations',
  description: 'Explore our top-rated locations',
  cards: [
    {
      title: 'Paris Apartment',
      meta: 'Rp2,612,394 for 4 nights · 4.88 ★',
      image: {
        url: 'http://localhost:8080/wp-content/uploads/paris.jpg',
      },
    },
    {
      title: 'London Studio',
      meta: 'Rp3,886,493 for 4 nights · 4.77 ★',
      image: {
        url: 'http://localhost:8080/wp-content/uploads/london.jpg',
      },
    },
    // ... more cards
  ],
  columns: 4, // 3 or 4
  maxWidth: 1200,
});
```

### Feature List

```typescript
import { buildFeatureListSection } from './elementor-presets.js';

const features = buildFeatureListSection({
  heading: 'Why Choose Us',
  description: 'Key benefits of our service',
  items: [
    {
      icon: 'fas fa-check-circle',
      title: 'Feature One',
      description: 'Description of feature one',
    },
    {
      icon: 'fas fa-star',
      title: 'Feature Two',
      description: 'Description of feature two',
    },
    // ... more items
  ],
});
```

### Testimonial Strip

```typescript
import { buildTestimonialStripSection } from './elementor-presets.js';

const testimonials = buildTestimonialStripSection({
  heading: 'Client Testimonials',
  subheading: 'What our customers say',
  items: [
    {
      quote: 'Amazing service and great experience!',
      name: 'John Doe',
      role: 'CEO, Company Inc.',
      imageUrl: 'http://localhost:8080/wp-content/uploads/john.jpg',
    },
    // ... more testimonials
  ],
});
```

## MCP Tool Usage

### Update Page with Elementor Data

```typescript
// Via MCP tool
await elementor.updatePage({
  id: 47,
  elementorData: [
    heroSection,
    featuresSection,
    cardGridSection,
  ],
  settings: {
    template: 'elementor_canvas',
  },
});
```

### Using Presets in MCP

```typescript
import { buildHeroTextImageSection, buildCardGridSection } from './elementor-presets.js';

const design = [
  buildHeroTextImageSection({
    title: 'Welcome',
    description: 'Your description here',
    image: { url: '...' },
  }),
  buildCardGridSection({
    heading: 'Featured Items',
    cards: [/* ... */],
  }),
];

await elementor.updatePage({
  id: 60,
  elementorData: design,
});
```

## Best Practices

### 1. Always Use Responsive Settings

```typescript
const container = ElementorHelpers.createContainer({
  padding: ElementorHelpers.createPadding({ top: 100, unit: 'px' }),
  padding_tablet: ElementorHelpers.createPadding({ top: 80, unit: 'px' }),
  padding_mobile: ElementorHelpers.createPadding({ top: 40, unit: 'px' }),
  flex_gap: ElementorHelpers.createFlexGap({ size: 30, unit: 'px' }),
  flex_gap_tablet: ElementorHelpers.createFlexGap({ size: 20, unit: 'px' }),
  flex_gap_mobile: ElementorHelpers.createFlexGap({ size: 15, unit: 'px' }),
});
```

### 2. Use Proper `isInner` Flags

- Top-level containers: `isInner: false`
- Nested containers: `isInner: true` (use `createNestedContainer`)

### 3. String Values for Settings

All padding, margin, typography sizes, and flex gap values are automatically converted to strings by the helpers.

### 4. Typography Responsive Sizes

Always provide tablet and mobile font sizes for better responsive design:

```typescript
typography: {
  fontSize: 85,        // Desktop
  fontSizeTablet: 65,  // Tablet
  fontSizeMobile: 48,  // Mobile
}
```

### 5. Icon Colors for Stacked Views

Always provide both `primaryColor` and `secondaryColor` for stacked/framed icon views:

```typescript
createIconWidget({
  view: 'stacked',
  primaryColor: '#ff6b6b',   // Background
  secondaryColor: '#ffffff', // Icon (REQUIRED!)
});
```

## Example: Complete Page

```typescript
import * as ElementorHelpers from './elementor-helpers.js';
import { buildHeroTextImageSection, buildCardGridSection } from './elementor-presets.js';

function buildCompletePage(): unknown[] {
  const design: unknown[] = [];

  // Hero Section
  design.push(
    buildHeroTextImageSection({
      title: 'Welcome to Our Site',
      description: 'Your compelling description here',
      button: { text: 'Get Started', link: '#' },
      image: { url: 'http://localhost:8080/wp-content/uploads/hero.jpg' },
    })
  );

  // Features Section
  design.push(
    ElementorHelpers.createContentContainer(
      [
        ElementorHelpers.createHeadingWidget({
          title: 'Our Features',
          size: 'xl',
          align: 'center',
        }),
        ElementorHelpers.createRowContainer(
          [
            ElementorHelpers.createNestedContainer('33', {}, [
              ElementorHelpers.createIconWidget({
                icon: 'fas fa-check',
                view: 'stacked',
                primaryColor: '#467FF7',
                secondaryColor: '#ffffff',
              }),
              ElementorHelpers.createHeadingWidget({ title: 'Feature 1' }),
            ]),
            // ... more features
          ],
          { gap: 30, wrap: true }
        ),
      ],
      1200,
      { top: 80, bottom: 80 }
    )
  );

  // Card Grid
  design.push(
    buildCardGridSection({
      heading: 'Popular Items',
      cards: [/* ... */],
    })
  );

  return design;
}
```

## References

- **Structure Patterns**: `docs/ayu/elementor-structure-patterns.md`
- **Helper Gap Analysis**: `docs/ayu/elementor-helper-gap-analysis.md`
- **Code Implementation**: `docs/ayu/elementor-code-implementation.md`
- **Example Design**: Page ID 30 (`/example-design/`)

