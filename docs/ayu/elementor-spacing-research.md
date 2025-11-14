# Elementor Spacing and Structure Research

## Issues Found

### 1. Gap Format Problem

**Incorrect Format:**
```json
"flex_gap": {
  "unit": "px",
  "column": 30,
  "row": 40
}
```

**Correct Format:**
Elementor expects gaps to be set via the `flex_gap` control which uses the GAPS control type. The structure should be:
```json
"flex_gap": {
  "unit": "px",
  "column": 30,
  "row": 40,
  "isLinked": false  // Optional: links row and column
}
```

However, when saving, Elementor may store it differently. The key is that `column` and `row` should be at the same level as `unit`.

### 2. Container Default Padding

**Issue:** Containers have default padding of 10px (via CSS variable `--container-default-padding-top`, etc.)

**Solution:** 
- Set explicit padding values to override defaults
- Or use `content_width: 'full'` which may reduce default padding
- Set padding to `0` if you want no padding

### 3. Nested Container Structure

**Problem:** Too many nested containers create unnecessary complexity and spacing issues.

**Best Practice:**
- Use containers only when needed for layout (flexbox/grid)
- Place widgets directly in containers when possible
- Avoid wrapping single widgets in containers unnecessarily

### 4. Content Width vs Layout

**Issue:** Mixing `content_width` with `layout` settings incorrectly.

**Correct Usage:**
- `content_width: 'boxed'` - Container has max-width constraint
- `content_width: 'full'` - Container spans full width
- `layout: 'boxed'` - Legacy setting, use `content_width` instead
- When using `content_width: 'boxed'`, set `boxed_width` for the actual width

### 5. Spacer Widgets vs Gap

**Issue:** Using spacer widgets instead of proper gap settings.

**Better Approach:**
- Use `flex_gap` on containers for consistent spacing
- Use spacer widgets only for specific spacing needs
- Gap is more maintainable and responsive

## Corrected Structure Pattern

### Simple Container with Gap
```json
{
  "id": "container-id",
  "elType": "container",
  "settings": {
    "content_width": "full",
    "flex_direction": "row",
    "flex_wrap": "wrap",
    "flex_gap": {
      "unit": "px",
      "column": 30,
      "row": 40
    },
    "padding": {
      "unit": "px",
      "top": 80,
      "right": 40,
      "bottom": 80,
      "left": 40
    }
  },
  "elements": [
    // Widgets directly here, no unnecessary containers
  ]
}
```

### Boxed Content Container
```json
{
  "id": "container-id",
  "elType": "container",
  "settings": {
    "content_width": "boxed",
    "boxed_width": {
      "unit": "px",
      "size": 1200
    },
    "flex_direction": "column",
    "padding": {
      "unit": "px",
      "top": 100,
      "right": 0,
      "bottom": 100,
      "left": 0
    }
  },
  "elements": [
    // Direct widgets
  ]
}
```

## Key Takeaways

1. **Simplify Structure** - Reduce unnecessary nested containers
2. **Use Gap Properly** - Set `flex_gap` with `column` and `row` at same level as `unit`
3. **Explicit Padding** - Always set padding explicitly, don't rely on defaults
4. **Content Width** - Use `content_width: 'full'` for full-width sections, `boxed` for constrained
5. **Direct Widgets** - Place widgets directly in containers when possible

## References

- `apps/wordpress/wp-content/plugins/elementor/includes/controls/groups/flex-container.php` - Gap control structure
- `apps/wordpress/wp-content/plugins/elementor/includes/elements/container.php` - Container settings
- `apps/wordpress/wp-content/plugins/elementor/core/kits/documents/tabs/settings-layout.php` - Default spacing settings

