# Elementor MCP Integration Fixes

This document describes the fixes applied to the Elementor MCP integration based on research findings.

## Problem

The original implementation was using direct `update_post_meta()` calls to update Elementor page data, which bypassed Elementor's proper Document API. This caused several issues:

1. **Cache not cleared** - Post CSS and document cache were not invalidated
2. **Hooks not fired** - Elementor's save hooks were not executed
3. **Data sanitization skipped** - User capability checks were bypassed
4. **Version tracking missing** - Elementor version was not updated
5. **Revision support broken** - Used `update_post_meta()` instead of `update_metadata()`

## Solution

Updated the WordPress plugin REST API handlers to use Elementor's Document API:

### Fixed Methods

1. **`update_page()`** - Now uses `Document::save()` instead of direct meta updates
2. **`update_template()`** - Updated to use Document API
3. **`create_template()`** - Uses `Documents_Manager::create()` for proper initialization

## Changes Made

### `update_page()` Method

**Before:**
```php
if ( isset( $data['elementor_data'] ) ) {
    update_post_meta( $page_id, '_elementor_data', wp_json_encode( $data['elementor_data'] ) );
    update_post_meta( $page_id, '_elementor_edit_mode', 'builder' );
    \Elementor\Plugin::$instance->documents->get( $page_id )->set_is_built_with_elementor( true );
}
```

**After:**
```php
// Get document instance
$document = \Elementor\Plugin::$instance->documents->get( $page_id, false );

// Ensure page is marked as built with Elementor
if ( ! $document->is_built_with_elementor() ) {
    $document->set_is_built_with_elementor( true );
}

// Prepare save data
$save_data = [];
if ( isset( $data['elementor_data'] ) ) {
    $save_data['elements'] = is_array( $data['elementor_data'] ) ? $data['elementor_data'] : [];
}
if ( isset( $data['settings'] ) && is_array( $data['settings'] ) ) {
    $save_data['settings'] = $data['settings'];
}

// Check permissions
if ( ! $document->is_editable_by_current_user() ) {
    return new WP_Error( 'permission_denied', 'You do not have permission to edit this page.', [ 'status' => 403 ] );
}

// Save using Elementor's Document API
$saved = $document->save( $save_data );
```

### Key Improvements

1. **Uses `Document::save()`** - Properly handles:
   - Cache clearing (Post CSS and document cache)
   - Data sanitization based on user capabilities
   - Version tracking
   - Hook execution (`elementor/document/before_save`, `elementor/document/after_save`)
   - Revision support via `update_metadata()`

2. **Permission Checks** - Validates user can edit the document

3. **Error Handling** - Returns proper WP_Error responses

4. **Settings Support** - Can now update both elements and page settings

## Benefits

1. **Cache Management** - Elementor automatically clears caches on save
2. **Data Integrity** - Proper sanitization and validation
3. **Hook Support** - Other plugins can react to Elementor saves
4. **Version Tracking** - Elementor version is tracked for compatibility
5. **Revision Support** - Works with WordPress revisions
6. **Permission Security** - Respects WordPress user capabilities

## Testing

To test the fixes:

1. **Update a page via MCP:**
   ```bash
   # Use the elementor.updatePage MCP tool
   # The page should update and cache should clear automatically
   ```

2. **Verify cache clearing:**
   - Check that Post CSS files are regenerated
   - Verify document cache is cleared
   - Frontend should show updated content immediately

3. **Check permissions:**
   - Non-editable users should receive 403 error
   - Proper error messages should be returned

## Files Modified

- `apps/wordpress/wp-content/plugins/ayu-ai-elementor/includes/class-elementor-rest-api.php`
  - `update_page()` method (lines 488-548)
  - `update_template()` method (lines 240-309)
  - `create_template()` method (lines 197-245)

## Related Documentation

- [Elementor CRUD Research](./elementor-crud-research.md) - Detailed research on Elementor's CRUD operations
- [Elementor Widgets Guide](./elementor-widgets.md) - Elementor data structure reference

## Next Steps

1. Test the implementation with real Elementor designs
2. Add support for creating new pages via MCP (currently only updates)
3. Consider adding batch update support for multiple pages
4. Add validation for Elementor data structure before saving

