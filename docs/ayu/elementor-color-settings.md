# Elementor Color Settings Research

## Icon Widget Color Settings

### View Types and Color Behavior

**1. Default View (`view: 'default'`)**
- `primary_color` - Sets the icon color directly
- No `secondary_color` needed

**2. Stacked View (`view: 'stacked'`)**
- `primary_color` - Sets the **background color** of the icon container
- `secondary_color` - Sets the **icon color** (the actual icon itself)
- **CRITICAL**: Both colors must be set for stacked icons to be visible!

**3. Framed View (`view: 'framed'`)**
- `primary_color` - Sets the icon color and border color
- `secondary_color` - Sets the background color of the frame

### Code Example

**Stacked Icon (requires both colors):**
```json
{
  "elType": "widget",
  "widgetType": "icon",
  "settings": {
    "selected_icon": {
      "value": "fas fa-utensils",
      "library": "fa-solid"
    },
    "view": "stacked",
    "shape": "circle",
    "primary_color": "#ff6b6b",      // Background color
    "secondary_color": "#ffffff",    // Icon color (REQUIRED!)
    "icon_background_color": "#ff6b6b",
    "icon_padding": {"unit": "px", "size": 25},
    "icon_size": {"unit": "px", "size": 55}
  }
}
```

**Default Icon (only primary_color needed):**
```json
{
  "elType": "widget",
  "widgetType": "icon",
  "settings": {
    "selected_icon": {
      "value": "fas fa-star",
      "library": "fa-solid"
    },
    "view": "default",
    "primary_color": "#ff6b6b"  // Icon color
  }
}
```

## Heading Widget Color Settings

**Text Color:**
- `title_color` - Sets the heading text color
- Must be explicitly set, defaults may not work

```json
{
  "elType": "widget",
  "widgetType": "heading",
  "settings": {
    "title": "My Heading",
    "title_color": "#333333"  // Required for visibility
  }
}
```

## Button Widget Color Settings

**Button Colors:**
- `button_text_color` - Text color
- `button_background_color` - Background color
- `button_text_hover_color` - Hover text color
- `button_background_hover_color` - Hover background color
- `button_border_color` - Border color (for outline buttons)

## Text Editor Widget Color

**Text Color:**
- Text color is set via inline CSS in the `editor` HTML content
- Example: `<p style="color: #666666;">Text</p>`

## Common Issues

### Issue 1: Stacked Icons Not Visible
**Problem:** Using `view: 'stacked'` but only setting `primary_color`
**Solution:** Always set both `primary_color` (background) and `secondary_color` (icon)

### Issue 2: Icons with White Background
**Problem:** Icon background color matches icon color
**Solution:** Use contrasting colors - light background with dark icon, or dark background with light icon

### Issue 3: Heading Text Not Visible
**Problem:** `title_color` not set, defaults to theme color which may be same as background
**Solution:** Always explicitly set `title_color`

## Best Practices

1. **Always set explicit colors** - Don't rely on defaults
2. **Use contrasting colors** - Ensure text/icons are visible against backgrounds
3. **For stacked icons** - Always set both `primary_color` and `secondary_color`
4. **Test visibility** - Check that all elements are visible on their backgrounds

## References

- `apps/wordpress/wp-content/plugins/elementor/includes/widgets/icon.php` - Icon widget color controls
- `apps/wordpress/wp-content/plugins/elementor/includes/widgets/heading.php` - Heading widget color controls

