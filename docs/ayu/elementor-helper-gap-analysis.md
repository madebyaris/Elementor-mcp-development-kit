# Elementor Helper Gap Analysis

Based on the latest `/example-design` inspection (page ID 30) and recent MCP usage, the current helper API falls short in several areas.

## 1. Responsive Controls Missing

- No way to supply `*_tablet` / `*_mobile` variants for:
  - `padding`, `margin`, `flex_gap`, `flex_direction`, `align_items`, `justify_content`
  - Typography (`typography_font_size_tablet`, etc.)
  - `min_height`, `width`, `_element_custom_width`
- Result: builders must manually edit JSON or skip responsive fidelity.

## 2. Flex + Sizing Controls

- Helpers cannot set `_flex_size`, `_flex_size_tablet`, `_element_width_tablet`, `_element_custom_width_*`.
- Need utilities to define how inner containers grow/shrink and how widgets scale per breakpoint.

## 3. Section-Level Utilities

- No helper knobs for:
  - `structure`
  - `boxed_width` vs `content_width`
  - `reverse_order_tablet/mobile`
  - Background image settings (position, repeat, size) with responsive overrides
  - `link` metadata (entire container clickable)

## 4. Widget Options Too Sparse

- `createHeadingWidget`/`createTextEditorWidget` only expose a subset (no color, typography weight, responsive sizes). Example design relies on:
  - Uppercase headings, custom fonts, letter-spacing
  - `_padding`, `_element_custom_width`
- `createButtonWidget` lacks border radius, border color, background/hover colors, icon align, text padding.
- `createImageWidget` cannot set width/per-breakpoint width or alignment wrappers.
- No helpers for more complex widgets (e.g. testimonial cards, link-in-bio) even though they are part of the reference page.

## 5. Layout Presets Non-Existent

- Current code manually composes sections (hero, cards) inline. Need reusable presets for:
  - Hero (text + image)
  - Card grid (listings)
  - Feature list / icon columns
  - CTA & testimonial strips
- Presets should accept data (titles, copy, image URLs, meta text) and rely on improved helpers.

## 6. string vs number consistency

- Helpers handle some conversions (padding) but not others:
  - `createFlexGap` returns `size` as number; Elementor seems to allow this, but to be safe we can offer option to stringify.
  - `createContentContainer` lacks `padding_tablet/mobile` wrappers and cannot express `%` padding.

## 7. MCP Tool Interface

- `elementor.updatePage` only accepts `elementorData` + optional `settings`. Presets will need an easier way to request generated layouts (e.g., `elementor.buildPresetPage`).
- Schemas do not currently allow arbitrary metadata objects (should remain permissive to avoid stripping unknown keys).

## Next Steps

1. Expand helper option objects to accept structured responsive configs.
2. Introduce reusable preset builders in `apps/wp-mcp-server-ayu/src`.
3. Ensure MCP tool schema passes through all data unmodified.
4. Verify WordPress plugin keeps forwarding everything to `Document::save`.

