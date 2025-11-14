# Elementor Widget Structures Guide

This document explains how to properly create Elementor data structures for use with AYU AI Elementor MCP tools.

## Elementor Data Structure

Modern Elementor uses **containers** instead of the old section/column structure. The data is stored as a JSON array in the `_elementor_data` post meta field.

### Basic Structure

```json
[
  {
    "id": "unique-id",
    "elType": "container",
    "settings": {},
    "elements": [],
    "isInner": false
  }
]
```

## Container vs Section/Column

**Modern Elementor (Recommended):**
- Uses `container` elements
- More flexible layout system
- Better for responsive design

**Legacy Elementor:**
- Uses `section` + `column` structure
- Still supported but deprecated

## Widget Structure

All widgets follow this structure:

```json
{
  "id": "unique-id",
  "elType": "widget",
  "widgetType": "widget-name",
  "settings": {
    // Widget-specific settings
  },
  "elements": []
}
```

## Available Widget Types

### Heading Widget

**Widget Type:** `heading`

**Settings:**
- `title` (string) - The heading text
- `size` (string) - Size: `default`, `small`, `medium`, `large`, `xl`, `xxl`
- `align` (string) - Alignment: `left`, `center`, `right`, `justify`
- `header_size` (string) - HTML tag: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `div`, `span`, `p`
- `title_color` (string) - Text color (hex code)

**Example:**
```json
{
  "elType": "widget",
  "widgetType": "heading",
  "settings": {
    "title": "My Heading",
    "size": "xl",
    "align": "center",
    "header_size": "h1",
    "title_color": "#333333"
  }
}
```

### Text Editor Widget

**Widget Type:** `text-editor`

**Settings:**
- `editor` (string) - HTML content
- `align` (string) - Alignment: `left`, `center`, `right`, `justify`

**Example:**
```json
{
  "elType": "widget",
  "widgetType": "text-editor",
  "settings": {
    "editor": "<p>Your HTML content here</p>",
    "align": "left"
  }
}
```

### Icon Widget

**Widget Type:** `icon`

**Settings:**
- `selected_icon` (object) - Icon definition
  - `value` (string) - Icon class (e.g., `"fas fa-star"`)
  - `library` (string) - Icon library: `fa-solid`, `fa-regular`, `fa-brands`
- `align` (string) - Alignment: `left`, `center`, `right`
- `primary_color` (string) - Icon color (hex code)
- `view` (string) - View style: `default`, `stacked`, `framed`
- `shape` (string) - Shape (when view is not default): `square`, `rounded`, `circle`

**Example:**
```json
{
  "elType": "widget",
  "widgetType": "icon",
  "settings": {
    "selected_icon": {
      "value": "fas fa-star",
      "library": "fa-solid"
    },
    "align": "center",
    "primary_color": "#667eea",
    "view": "default"
  }
}
```

### Icon Box Widget

**Widget Type:** `icon-box`

**Settings:**
- `selected_icon` (object) - Same as icon widget
- `title_text` (string) - Box title
- `description_text` (string) - Box description
- `align` (string) - Alignment

**Example:**
```json
{
  "elType": "widget",
  "widgetType": "icon-box",
  "settings": {
    "selected_icon": {
      "value": "fas fa-utensils",
      "library": "fa-solid"
    },
    "title_text": "Menu Beragam",
    "description_text": "Diverse menu options",
    "align": "center"
  }
}
```

### Image Widget

**Widget Type:** `image`

**Settings:**
- `image` (object) - Image definition
  - `url` (string) - Image URL
  - `id` (number) - WordPress attachment ID
  - `alt` (string) - Alt text
- `caption` (string) - Image caption
- `align` (string) - Alignment

**Example:**
```json
{
  "elType": "widget",
  "widgetType": "image",
  "settings": {
    "image": {
      "url": "https://example.com/image.jpg",
      "id": 123,
      "alt": "Description"
    },
    "align": "center"
  }
}
```

### Button Widget

**Widget Type:** `button`

**Settings:**
- `text` (string) - Button text
- `link` (object) - Link definition
  - `url` (string) - Link URL
  - `is_external` (boolean) - External link flag
  - `nofollow` (boolean) - NoFollow flag
- `align` (string) - Alignment
- `size` (string) - Size: `sm`, `md`, `lg`, `xl`
- `button_type` (string) - Type: `default`, `primary`, `secondary`, `outline`

**Example:**
```json
{
  "elType": "widget",
  "widgetType": "button",
  "settings": {
    "text": "Click Me",
    "link": {
      "url": "https://example.com",
      "is_external": false,
      "nofollow": false
    },
    "align": "center",
    "size": "md"
  }
}
```

## Container Settings

### Full-Width Container

```json
{
  "id": "container-id",
  "elType": "container",
  "settings": {
    "content_width": {
      "unit": "%",
      "size": 100
    },
    "layout": "boxed"
  },
  "elements": []
}
```

### Content Container (Max-Width)

```json
{
  "id": "container-id",
  "elType": "container",
  "settings": {
    "content_width": {
      "unit": "px",
      "size": 1200
    },
    "layout": "boxed",
    "padding": {
      "unit": "px",
      "top": 80,
      "right": 40,
      "bottom": 80,
      "left": 40
    }
  },
  "elements": []
}
```

### Background Settings

**Gradient Background:**
```json
{
  "background_background": "gradient",
  "background_gradient_type": "linear",
  "background_gradient_angle": {
    "unit": "deg",
    "size": 135
  },
  "background_gradient_color_one": "#667eea",
  "background_gradient_color_two": "#764ba2"
}
```

**Solid Color Background:**
```json
{
  "background_background": "classic",
  "background_color": "#f8f9fa"
}
```

## Complete Example

Here's a complete example of a full-width hero section with heading and text:

```json
[
  {
    "id": "hero-container",
    "elType": "container",
    "settings": {
      "content_width": {
        "unit": "%",
        "size": 100
      },
      "layout": "boxed",
      "background_background": "gradient",
      "background_gradient_type": "linear",
      "background_gradient_angle": {
        "unit": "deg",
        "size": 135
      },
      "background_gradient_color_one": "#667eea",
      "background_gradient_color_two": "#764ba2",
      "padding": {
        "unit": "px",
        "top": 100,
        "right": 0,
        "bottom": 100,
        "left": 0
      }
    },
    "elements": [
      {
        "id": "heading-widget",
        "elType": "widget",
        "widgetType": "heading",
        "settings": {
          "title": "Welcome",
          "size": "xxl",
          "align": "center",
          "title_color": "#ffffff"
        },
        "elements": []
      },
      {
        "id": "text-widget",
        "elType": "widget",
        "widgetType": "text-editor",
        "settings": {
          "editor": "<p>This is a description</p>",
          "align": "center"
        },
        "elements": []
      }
    ],
    "isInner": false
  }
]
```

## Using Helper Functions

The MCP server includes helper functions in `elementor-helpers.ts`:

- `createContainer()` - Create container element
- `createWidget()` - Create widget element
- `createHeadingWidget()` - Create heading widget
- `createTextEditorWidget()` - Create text editor widget
- `createIconWidget()` - Create icon widget
- `createIconBoxWidget()` - Create icon box widget
- `createImageWidget()` - Create image widget
- `createButtonWidget()` - Create button widget
- `createFullWidthLayout()` - Create full-width container
- `createContentContainer()` - Create content container with max-width
- `createGradientBackground()` - Create gradient background settings
- `createSolidBackground()` - Create solid color background settings

## Common Widget Types

Available widget types in Elementor Free:
- `heading` - Headings and titles
- `text-editor` - Rich text content
- `icon` - Single icon
- `icon-box` - Icon with title and description
- `image` - Image display
- `button` - Button element
- `divider` - Horizontal divider
- `spacer` - Spacing element
- `image-gallery` - Image gallery
- `image-carousel` - Image carousel
- `icon-list` - List with icons
- `counter` - Number counter
- `progress` - Progress bar
- `testimonial` - Testimonials
- `tabs` - Tabbed content
- `accordion` - Accordion content
- `toggle` - Toggle content
- `social-icons` - Social media icons
- `alert` - Alert box
- `html` - HTML code
- `shortcode` - Shortcode insertion

## Best Practices

1. **Use Containers**: Always use `container` elements, not `section`/`column`
2. **Unique IDs**: Each element needs a unique `id` (helper functions generate these automatically)
3. **Proper Structure**: Widgets go directly in container `elements` array
4. **Settings Match**: Widget settings must match the control IDs from Elementor widget classes
5. **Full-Width**: Use `content_width: { unit: "%", size: 100 }` for full-width layouts
6. **Content Width**: Use `content_width: { unit: "px", size: 1200 }` for centered content

## Troubleshooting

**Widget not rendering?**
- Check widget type name matches exactly (case-sensitive)
- Verify settings structure matches widget controls
- Ensure container structure is correct

**Layout issues?**
- Use containers, not sections
- Check padding/margin settings
- Verify content_width settings

**Icons not showing?**
- Ensure `selected_icon` has both `value` and `library`
- Use correct Font Awesome class format
- Check library name matches: `fa-solid`, `fa-regular`, `fa-brands`

