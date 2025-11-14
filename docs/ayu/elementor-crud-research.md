# Elementor CRUD Operations Research

This document outlines how Elementor handles Create, Read, Update, and Delete (CRUD) operations for pages and documents, based on analysis of the Elementor plugin core files.

## Overview

Elementor stores page/document data in WordPress post meta fields. The core CRUD operations are managed through the `Documents_Manager` class and individual `Document` instances. All Elementor data is stored as JSON-encoded strings in post meta.

## Key Meta Keys

Elementor uses several post meta keys to store document data:

- **`_elementor_data`** - JSON array containing the Elementor structure (containers, widgets, etc.)
- **`_elementor_page_settings`** - Page/document-level settings
- **`_elementor_edit_mode`** - Set to `'builder'` if the page was built with Elementor
- **`_elementor_template_type`** - Document type (e.g., 'wp-page', 'wp-post')
- **`_elementor_version`** - Elementor version used when document was last saved
- **`_elementor_element_cache`** - Cached rendered content for performance
- **`_elementor_css`** - Reference to generated CSS file

## CRUD Operations

### CREATE

**Location:** `core/documents-manager.php::create()`

**Process:**
1. Validates document type exists
2. Creates WordPress post via `wp_insert_post()` with:
   - `meta_input['_elementor_edit_mode'] = 'builder'`
   - `meta_input['_elementor_template_type'] = $type`
3. Instantiates Document class for the post
4. Calls `$document->save([])` to initialize document

**Key Code:**
```php
$meta_data['_elementor_edit_mode'] = 'builder';
$meta_data[ Document::TYPE_META_KEY ] = $type;
$post_data['meta_input'] = $meta_data;
$post_id = wp_insert_post( $post_data );
$document = new $class( [ 'post_id' => $post_id ] );
$document->save( [] );
```

**Important:** The document must be marked as "built with Elementor" (`_elementor_edit_mode`) and have a template type set before it can be edited in Elementor.

### READ

**Location:** `core/base/document.php::get_elements_data()`

**Process:**
1. Retrieves JSON from `_elementor_data` meta key
2. Decodes JSON string to array
3. Handles draft/autosave status by checking for newer autosave
4. Returns empty array if no data exists

**Key Code:**
```php
public function get_elements_data( $status = self::STATUS_PUBLISH ) {
    $elements = $this->get_json_meta( self::ELEMENTOR_DATA_META_KEY );
    // ... handles autosave ...
    return $elements;
}

protected function get_json_meta( $key ) {
    $meta = get_post_meta( $this->post->ID, $key, true );
    if ( is_string( $meta ) && ! empty( $meta ) ) {
        $meta = json_decode( $meta, true );
    }
    return empty( $meta ) ? [] : $meta;
}
```

**Reading Settings:**
- Page settings: `$document->get_meta( Document::PAGE_META_KEY )`
- Template type: `$document->get_main_meta( Document::TYPE_META_KEY )`
- Check if built with Elementor: `$document->is_built_with_elementor()`

### UPDATE

**Location:** `core/base/document.php::save()`

**Process:**
1. Applies filter: `elementor/document/save/data`
2. Checks user permissions (`is_editable_by_current_user()`)
3. Sets saving flag: `set_is_saving(true)`
4. Fires hook: `elementor/document/before_save`
5. Sanitizes data if user lacks `unfiltered_html` capability
6. Saves settings if provided: `save_settings($data['settings'])`
7. Saves elements if provided: `save_elements($data['elements'])`
8. Saves template type and version
9. **Deletes Post CSS cache** - Critical for frontend rendering
10. **Deletes document cache** - Clears cached content
11. Fires hook: `elementor/document/after_save`
12. Sets saving flag: `set_is_saving(false)`

**Key Code:**
```php
public function save( $data ) {
    $data = apply_filters( 'elementor/document/save/data', $data, $this );
    
    if ( ! empty( $data['settings'] ) ) {
        $this->save_settings( $data['settings'] );
        $this->refresh_post();
    }
    
    if ( isset( $data['elements'] ) && is_array( $data['elements'] ) ) {
        $this->save_elements( $data['elements'] );
    }
    
    $this->save_template_type();
    $this->save_version();
    
    // Remove Post CSS
    $post_css = Post_CSS::create( $this->post->ID );
    $post_css->delete();
    
    // Remove Document Cache
    $this->delete_cache();
}
```

**Saving Elements:**
```php
protected function save_elements( $elements ) {
    $editor_data = $this->get_elements_raw_data( $elements );
    $json_value = wp_slash( wp_json_encode( $editor_data ) );
    update_metadata( 'post', $this->post->ID, self::ELEMENTOR_DATA_META_KEY, $json_value );
    // ... fires hooks and saves plain text ...
}
```

**Critical Points:**
- Data must be JSON-encoded and slashed (`wp_slash()`) before saving
- Uses `update_metadata()` instead of `update_post_meta()` to support revisions
- Cache deletion is essential - Elementor regenerates CSS on next render
- Settings and elements are saved separately

### DELETE

**Location:** `core/base/document.php::delete()`

**Process:**
1. Checks if post is revision or regular post
2. Calls `wp_delete_post_revision()` for revisions
3. Calls `wp_delete_post()` for regular posts
4. WordPress hooks trigger cleanup:
   - `deleted_post` hook fires
   - Files manager deletes CSS files
   - Cache meta keys are cleaned up

**Key Code:**
```php
public function delete() {
    if ( 'revision' === $this->post->post_type ) {
        $deleted = wp_delete_post_revision( $this->post );
    } else {
        $deleted = wp_delete_post( $this->post->ID );
    }
    return $deleted && ! is_wp_error( $deleted );
}
```

**Cleanup (via Files Manager):**
```php
public function on_delete_post( $post_id ) {
    $css_file = Post_CSS::create( $post_id );
    $css_file->delete();
    // Also deletes cache meta keys
}
```

## AJAX/REST API Integration

### AJAX Actions

**Location:** `core/documents-manager.php::register_ajax_actions()`

Registered actions:
- **`save_builder`** - Calls `ajax_save()` method
- **`discard_changes`** - Discards autosave
- **`get_document_config`** - Retrieves document configuration

**AJAX Save Flow:**
```php
public function ajax_save( $request ) {
    $document = $this->get( $request['editor_post_id'] );
    
    // Permission check
    if ( ! $document->is_built_with_elementor() || ! $document->is_editable_by_current_user() ) {
        throw new \Exception( 'Access denied.' );
    }
    
    $data = [
        'elements' => $request['elements'],
        'settings' => $request['settings'],
    ];
    
    $document->save( $data );
    
    return [
        'status' => $post->post_status,
        'config' => [ /* ... */ ],
    ];
}
```

### REST API Endpoints

**Location:** `core/documents-manager.php::register_rest_routes()`

Limited REST endpoints:
- **`POST /elementor/v1/documents/{id}/media/import`** - Import media for document
- **`GET/POST /elementor/v1/settings/{key}`** - Get/update Elementor settings

**Note:** Elementor primarily uses AJAX for document operations, not REST API. The REST API is mainly for settings and media import.

## Data Structure

### Elements Array Format

The `_elementor_data` meta contains a JSON array of element objects:

```json
[
  {
    "id": "unique-string-id",
    "elType": "container",
    "settings": {},
    "elements": [],
    "isInner": false
  }
]
```

**Element Types:**
- `container` - Modern flexbox container (Elementor 3.0+)
- `section` - Legacy section (deprecated)
- `column` - Legacy column (deprecated)
- `widget` - Widget element

**Widget Structure:**
```json
{
  "id": "unique-id",
  "elType": "widget",
  "widgetType": "heading",
  "settings": {
    "title": "My Heading",
    "size": "xl",
    "align": "center"
  },
  "elements": []
}
```

## Important Considerations for MCP Integration

### 1. Required Meta Keys for Updates

When updating an Elementor page via MCP, ensure:
- Page exists and has `_elementor_edit_mode = 'builder'`
- Document type is set (`_elementor_template_type`)
- User has edit permissions

### 2. Cache Invalidation

**Critical:** After updating Elementor data, Elementor automatically:
- Deletes Post CSS cache
- Deletes document element cache
- Regenerates CSS on next frontend render

**Do NOT manually delete cache** - let Elementor handle it through `Document::save()`.

### 3. Data Format

- Elements must be a valid array (can be empty `[]`)
- Data must be JSON-encoded before saving
- Use `wp_slash()` when encoding to prevent WordPress unslashing issues
- Use `update_metadata()` not `update_post_meta()` to support revisions

### 4. Permissions

Elementor checks:
- `is_built_with_elementor()` - Page must be marked as Elementor-built
- `is_editable_by_current_user()` - User must have edit permissions
- `current_user_can('unfiltered_html')` - Affects data sanitization

### 5. Settings vs Elements

- **Settings** (`_elementor_page_settings`) - Page-level configuration
- **Elements** (`_elementor_data`) - The actual content structure

Both can be updated independently or together via `Document::save()`.

### 6. Version Tracking

Elementor saves version on each save:
```php
$this->update_meta( '_elementor_version', ELEMENTOR_VERSION );
```

This helps with compatibility and migration.

## Recommended MCP Implementation Pattern

Based on this research, here's the recommended approach for updating Elementor pages:

```php
// 1. Get document instance
$document = Plugin::$instance->documents->get( $post_id );

// 2. Verify it's an Elementor page
if ( ! $document || ! $document->is_built_with_elementor() ) {
    // Handle error or convert to Elementor
    $document->set_is_built_with_elementor( true );
}

// 3. Prepare data
$data = [
    'elements' => $elementor_data_array, // Your Elementor structure
    'settings' => $page_settings_array,  // Optional page settings
];

// 4. Save (handles all cache clearing automatically)
$document->save( $data );
```

**Alternative Direct Meta Update (Not Recommended):**
```php
// Direct meta update - bypasses Elementor hooks and cache clearing
update_metadata( 'post', $post_id, '_elementor_data', wp_slash( wp_json_encode( $elements ) ) );
// ⚠️ Must manually clear cache:
$post_css = Post_CSS::create( $post_id );
$post_css->delete();
delete_post_meta( $post_id, '_elementor_element_cache' );
```

## References

- **Documents Manager:** `apps/wordpress/wp-content/plugins/elementor/core/documents-manager.php`
- **Document Base:** `apps/wordpress/wp-content/plugins/elementor/core/base/document.php`
- **DB Handler:** `apps/wordpress/wp-content/plugins/elementor/includes/db.php`
- **Files Manager:** `apps/wordpress/wp-content/plugins/elementor/core/files/manager.php`

## Summary

Elementor's CRUD operations are well-structured around the Document pattern:

1. **Create** - Use `Documents_Manager::create()` to properly initialize
2. **Read** - Use `Document::get_elements_data()` to retrieve structure
3. **Update** - Use `Document::save()` to update (handles cache automatically)
4. **Delete** - Use `Document::delete()` or WordPress post deletion

The key insight is that **`Document::save()` is the proper way to update Elementor pages** because it:
- Validates permissions
- Handles data sanitization
- Clears caches automatically
- Fires necessary hooks
- Updates version tracking

Direct meta updates bypass these safeguards and require manual cache management.

