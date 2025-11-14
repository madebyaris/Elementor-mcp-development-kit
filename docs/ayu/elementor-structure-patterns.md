# Elementor Structure Patterns - Real Page Analysis

Based on analysis of a properly structured Elementor page (ID 30), here are the key patterns and best practices.

## Container Structure

### Responsive Overrides Observed in `/example-design`

- Every spacing/flex setting often has tablet/mobile counterparts (`padding_tablet`, `flex_gap_mobile`, `flex_direction_tablet`, etc.).
- **Custom widths**: widgets and containers frequently set `_element_custom_width*` fields with either `%` or `px` units per breakpoint.
- **Min height**: hero sections set `min_height`, `min_height_tablet`, `min_height_mobile` separately (units stay `vh`, values stored as strings).
- **Flex wrap & reverse**: sections rely on `flex_wrap`, `reverse_order_tablet`, etc., to reorder content responsively.
- **Type fidelity** still applies—values are strings plus `sizes: []`.

### Top-Level Container (Section)
```json
{
  "id": "unique-id",
  "elType": "container",
  "settings": {
    "layout": "full_width",           // or "boxed"
    "content_width": "full",          // or "boxed"
    "flex_direction": "row",          // or "column"
    "flex_align_items": "stretch",   // or "center", "flex-start", etc.
    "flex_justify_content": "center", // or "flex-start", "space-between", etc.
    "flex_gap": {
      "size": 0,                      // Main gap value
      "unit": "px",
      "column": "0",                  // Column gap (horizontal)
      "row": "0",                     // Row gap (vertical)
      "isLinked": true                // Whether row/column are linked
    },
    "padding": {
      "unit": "%",
      "top": "0",
      "right": "3",
      "bottom": "0",
      "left": "3",
      "isLinked": ""                  // Empty string or "1" for linked
    },
    "min_height": {
      "unit": "vh",
      "size": 100,
      "sizes": []                     // Empty array
    },
    "structure": "20"                 // Layout preset (optional)
  },
  "elements": [],
  "isInner": false                    // Top-level containers are false
}
```

### Nested Container (Column/Inner Container)
```json
{
  "id": "unique-id",
  "elType": "container",
  "settings": {
    "_column_size": "50",             // Width percentage (50 = 50%)
    "width": {                        // Alternative width setting
      "size": "45",
      "unit": "%"
    },
    "width_tablet": {                 // Responsive width
      "size": 100,
      "unit": "%"
    },
    "width_mobile": {
      "size": 50,
      "unit": "%"
    },
    "content_width": "full",
    "flex_direction": "column",
    "flex_justify_content": "center",
    "flex_gap": {
      "size": 15,
      "unit": "px",
      "column": "15",
      "row": "15",
      "isLinked": true
    },
    "padding": {
      "unit": "%",
      "top": "0",
      "right": "5",
      "bottom": "0",
      "left": "0",
      "isLinked": ""
    }
  },
  "elements": [
    // Widgets go here directly
  ],
  "isInner": true                     // Nested containers are true
}
```

## Key Differences from Our Previous Code

### 1. `isInner` Property
- **Top-level containers**: `isInner: false`
- **Nested containers**: `isInner: true`
- **Critical**: This affects how Elementor renders the container

### 2. Width Settings
- **`_column_size`**: Simple percentage string ("50", "25", "33", etc.)
- **`width`**: Object with `size` and `unit` for more control
- Both can be used, but `_column_size` is simpler for flex layouts

### 3. Flex Gap Structure
```json
"flex_gap": {
  "size": 30,           // Main value (used when linked)
  "unit": "px",
  "column": "30",       // String, not number!
  "row": "30",          // String, not number!
  "isLinked": true      // Boolean
}
```
**Important**: `column` and `row` are **strings**, not numbers!

### 4. Padding/Margin Structure
```json
"padding": {
  "unit": "%",
  "top": "0",           // String, not number!
  "right": "3",
  "bottom": "0",
  "left": "3",
  "isLinked": ""         // Empty string or "1" for linked
}
```
**Important**: Values are **strings**, not numbers!

### 5. Responsive Settings
Many settings have responsive variants:
- `padding_tablet`, `padding_mobile`
- `margin_tablet`, `margin_mobile`
- `width_tablet`, `width_mobile`
- `flex_gap_tablet`, `flex_gap_mobile`
- `flex_direction_tablet`, `flex_direction_mobile`
- `min_height_tablet`, `min_height_mobile`

### 6. Layout vs Content Width
- **`layout`**: "full_width" or "boxed" - Controls container wrapper
- **`content_width`**: "full" or "boxed" - Controls inner content width
- **`boxed_width`**: Used when `content_width: "boxed"` - Sets max-width

### 7. Structure Property
- **`structure`**: Layout preset like "20", "32", "25" 
- Appears to be a shorthand for common layouts
- Optional, can be omitted

## Widget Settings Patterns

### Responsive Settings Snapshot

| Widget        | Desktop → Tablet → Mobile fields                               |
|---------------|----------------------------------------------------------------|
| Heading       | `typography_font_size`, `_tablet`, `_mobile`; `line_height_mobile` |
| Text Editor   | `typography_font_size[_tablet/_mobile]`, `_element_custom_width_*` |
| Image         | `width_tablet`, `_element_width_tablet`, `_element_custom_width_*` |
| Button        | `text_padding`, `text_padding_tablet`, `typography_font_size_tablet` |
| Containers    | `padding_tablet`, `padding_mobile`, `flex_gap_*`, `flex_direction_tablet`, `margin_mobile` |

Consistently **set all three breakpoints** for typography and spacing when designing presets.

### Heading Widget
```json
{
  "elType": "widget",
  "widgetType": "heading",
  "settings": {
    "title": "My Heading",
    "header_size": "h1",
    "align": "left",
    "title_color": "#1C244B",
    "typography_typography": "custom",
    "typography_font_family": "Poppins",
    "typography_font_size": {
      "unit": "px",
      "size": "65",              // String!
      "sizes": []
    },
    "typography_font_size_tablet": {
      "unit": "px",
      "size": "42",
      "sizes": []
    },
    "typography_font_size_mobile": {
      "unit": "px",
      "size": "28",
      "sizes": []
    },
    "typography_font_weight": "600",
    "typography_line_height": {
      "unit": "em",
      "size": "1.2",
      "sizes": []
    }
  },
  "elements": []
}
```

### Text Editor Widget
```json
{
  "elType": "widget",
  "widgetType": "text-editor",
  "settings": {
    "editor": "<p>Text content</p>",
    "text_color": "#324A6D",
    "typography_typography": "custom",
    "typography_font_family": "Poppins",
    "typography_font_size": {
      "unit": "px",
      "size": "22",
      "sizes": []
    }
  },
  "elements": []
}
```

### Button Widget
```json
{
  "elType": "widget",
  "widgetType": "button",
  "settings": {
    "text": "Button Text",
    "button_text_color": "#FFFFFF",
    "background_color": "#467FF7",
    "border_radius": {
      "unit": "px",
      "top": "100",
      "right": "100",
      "bottom": "100",
      "left": "100",
      "isLinked": "1"
    },
    "text_padding": {
      "unit": "px",
      "top": "16",
      "right": "55",
      "bottom": "16",
      "left": "55",
      "isLinked": ""
    }
  },
  "elements": []
}
```

### Icon Widget (Stacked)
```json
{
  "elType": "widget",
  "widgetType": "icon",
  "settings": {
    "selected_icon": {
      "value": "fas fa-star",
      "library": "fa-solid"
    },
    "view": "stacked",
    "shape": "circle",
    "primary_color": "#467FF7",      // Background color
    "secondary_color": "#FFFFFF",    // Icon color (REQUIRED!)
    "icon_size": {
      "unit": "px",
      "size": "50",
      "sizes": []
    },
    "icon_padding": {
      "unit": "px",
      "size": "20",
      "sizes": []
    }
  },
  "elements": []
}
```

### Link-in-Bio Widget
`/example-design` uses Elementor's **link-in-bio** widget with rich styling:

```json
{
  "widgetType": "link-in-bio",
  "settings": {
    "identity_image": { "id": 55, "url": "..." },
    "bio_heading": "Willow Bennett",
    "bio_title": "Registered Dietitian + Nutritionist 🥑",
    "bio_description": "· Health Educator · ",
    "icon": [
      { "icon_platform": "Messenger", "icon_url": { "url": "#", "is_external": "1" } },
      ...
    ],
    "cta_link": [
      { "cta_link_text": "Contact", "cta_link_url": { "url": "#", "is_external": "1" } }
    ],
    "bio_heading_typography_font_size": { "unit": "px", "size": "36", "sizes": [] },
    "bio_title_typography_font_size": { "unit": "px", "size": "20", "sizes": [] },
    "cta_links_background_color": "#FAADA0",
    "cta_links_border_color": "#013941"
  }
}
```

Even complex widgets follow the same rules:
- Colors stored as hex strings.
- Typography objects include `sizes: []`.
- Repeater items (`icon`, `cta_link`) contain `_id` keys.

## Common Patterns

### Two-Column Layout
```json
{
  "elType": "container",
  "settings": {
    "content_width": "full",
    "flex_direction": "row",
    "flex_gap": {
      "size": 30,
      "unit": "px",
      "column": "30",
      "row": "30",
      "isLinked": true
    }
  },
  "elements": [
    {
      "elType": "container",
      "settings": {
        "_column_size": "50",
        "content_width": "full",
        "flex_direction": "column"
      },
      "elements": [/* widgets */],
      "isInner": true
    },
    {
      "elType": "container",
      "settings": {
        "_column_size": "50",
        "content_width": "full",
        "flex_direction": "column"
      },
      "elements": [/* widgets */],
      "isInner": true
    }
  ],
  "isInner": false
}
```

### Three-Column Grid
```json
{
  "elType": "container",
  "settings": {
    "content_width": "full",
    "flex_direction": "row",
    "flex_wrap": "wrap",
    "flex_gap": {
      "size": 30,
      "unit": "px",
      "column": "30",
      "row": "30",
      "isLinked": true
    }
  },
  "elements": [
    {
      "elType": "container",
      "settings": {
        "_column_size": "33",
        "width": {"size": 33, "unit": "%"},
        "content_width": "full"
      },
      "elements": [/* widgets */],
      "isInner": true
    },
    // ... two more columns
  ],
  "isInner": false
}
```

### Split “Service Details” Layout (Image + Text Stack)

```json
{
  "elType": "container",
  "settings": {
    "flex_direction": "row",
    "flex_gap": { "unit": "px", "size": 69, "column": "69", "row": "69", "isLinked": true },
    "background_color": "#E9E3DD",
    "padding": { "unit": "%", "top": "5", "right": "5", "bottom": "5", "left": "5", "isLinked": false },
    "padding_mobile": { "unit": "%", "top": "15", "right": "3", "bottom": "15", "left": "3", "isLinked": false }
  },
  "elements": [
    { "widgetType": "image", "settings": { "width": { "unit": "%", "size": "100", "sizes": [] }, "_flex_size": "grow" } },
    {
      "elType": "container",
      "isInner": true,
      "settings": {
        "_flex_size": "shrink",
        "flex_gap": { "unit": "px", "size": 20, "column": "20", "row": "20", "isLinked": true },
        "padding": { "unit": "%", "top": "0", "right": "15", "bottom": "0", "left": "0", "isLinked": false }
      },
      "elements": [/* heading, text, button */]
    }
  ]
}
```

Key takeaways:
- Use `flex_size` to influence how columns grow/shrink.
- Mirror Elementor's habit of **wrapping content blocks inside another inner container** when more padding/gap control is needed.

## Critical Fixes Needed

1. **String Values**: Most numeric values in settings are **strings**, not numbers
2. **`isInner` Flag**: Must be set correctly (`false` for top-level, `true` for nested)
3. **`_column_size`**: Use this for flex-based widths instead of `width` percentage
4. **Flex Gap**: `column` and `row` must be strings
5. **Padding/Margin**: Values are strings, `isLinked` is string ("1" or "")
6. **Responsive triplets**: When a design needs responsive behavior, set desktop/tablet/mobile fields together; Elementor expects missing breakpoints to inherit but real templates explicitly set them.

## References

- Real Elementor page structure from page ID 30
- Elementor core files: `includes/elements/container.php`
