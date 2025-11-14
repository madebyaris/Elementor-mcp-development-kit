# Elementor Structure Implementation - Code Changes

## Summary

Updated the MCP server code to match real Elementor structure patterns discovered from analyzing a properly structured Elementor page (ID 30).

## Key Changes Made

### 1. Container Structure (`elementor-helpers.ts`)

#### Added `isInner` Parameter
- **Before**: Always `isInner: false`
- **After**: Explicit `isInner` parameter (default: `false` for top-level, `true` for nested)
- **Impact**: Properly marks nested containers for Elementor rendering

#### New Function: `createNestedContainer()`
```typescript
createNestedContainer(
  columnSize: string,  // e.g., "50" for 50%
  settings: Record<string, unknown>,
  elements: unknown[]
)
```
- Creates nested containers with `_column_size` property
- Automatically sets `isInner: true`
- Uses `content_width: 'full'` by default

### 2. String Values Instead of Numbers

#### Padding/Margin Values
- **Before**: Numbers (`top: 100`)
- **After**: Strings (`top: "100"`)
- **Impact**: Matches Elementor's actual data format

#### Typography Sizes
- **Before**: `size: 65`
- **After**: `size: "65"` with `sizes: []` array
- **Impact**: Proper typography rendering

#### Flex Gap
- **Before**: `column: 30, row: 30` (numbers)
- **After**: `column: "30", row: "30"` (strings)
- **Impact**: Correct gap spacing

### 3. Content Width Format

#### Before
```typescript
content_width: {
  unit: '%',
  size: 100
}
```

#### After
```typescript
content_width: 'full'  // or 'boxed'
boxed_width: {
  unit: 'px',
  size: 1200,
  sizes: []
}
```

### 4. Icon Widget Enhancements

#### Added `secondaryColor` Support
- Required for `view: 'stacked'` and `view: 'framed'`
- **Before**: Only `primaryColor` (background)
- **After**: Both `primaryColor` (background) and `secondaryColor` (icon)

#### Added Icon Size/Padding
- `iconSize` option with proper string formatting
- `iconPadding` option with proper string formatting

### 5. New Helper Functions

#### `createFlexGap()`
```typescript
createFlexGap({
  size: 30,
  unit: 'px',
  column: 30,  // Optional, defaults to size
  row: 30,     // Optional, defaults to size
  isLinked: true
})
```
- Properly formats flex gap with strings
- Handles linked/unlinked gaps

#### `createRowContainer()`
```typescript
createRowContainer(elements, {
  gap: 30,
  justifyContent: 'space-between',
  alignItems: 'center',
  wrap: true
})
```
- Creates row-based flex containers
- Proper gap handling

### 6. Updated Container Functions

#### `createFullWidthLayout()`
- Now uses `layout: 'full_width'`
- Uses `content_width: 'full'` (string)
- Includes proper `flex_gap` structure
- Sets `flex_direction: 'column'` by default

#### `createContentContainer()`
- Now uses `layout: 'full_width'` with `content_width: 'boxed'`
- Uses `boxed_width` for max-width
- Padding values are strings
- Includes proper `flex_gap` structure

## Files Modified

1. **`apps/wp-mcp-server-ayu/src/elementor-helpers.ts`**
   - Updated all container creation functions
   - Updated padding/margin formatting
   - Added new helper functions
   - Fixed string/number conversions

## Testing Recommendations

1. **Test Container Nesting**
   - Verify `isInner: true` for nested containers
   - Verify `isInner: false` for top-level containers

2. **Test String Values**
   - Verify padding/margin values are strings
   - Verify typography sizes are strings
   - Verify flex gap column/row are strings

3. **Test Icon Colors**
   - Verify stacked icons have both `primary_color` and `secondary_color`
   - Verify icons are visible

4. **Test Layout Structure**
   - Verify `content_width` is string ('full' or 'boxed')
   - Verify `boxed_width` is set when using 'boxed'

## Migration Notes

When updating existing code that uses these helpers:

1. **Nested Containers**: Use `createNestedContainer()` instead of `createContainer()` with manual `_column_size`
2. **Icon Widgets**: Add `secondaryColor` for stacked/framed views
3. **Padding**: Values will automatically be converted to strings
4. **Content Width**: Use string values ('full' or 'boxed') instead of objects

## References

- Real Elementor page structure: Page ID 30
- Documentation: `docs/ayu/elementor-structure-patterns.md`
- Elementor core: `apps/wordpress/wp-content/plugins/elementor/includes/elements/container.php`

