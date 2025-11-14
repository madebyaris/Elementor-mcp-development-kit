# Elementor Integration Guide

## Overview

AYU AI Elementor provides deep integration with Elementor when the Elementor plugin is active. This allows you to manage Elementor templates, pages, and kit settings via MCP tools.

## Requirements

- Elementor 3.0+ installed and activated
- AYU AI Elementor plugin active
- Token with `read:elementor` and/or `write:elementor` scopes

## Elementor Tools (Coming in v0.2.0)

### Templates

- `elementor:listTemplates` - List Elementor templates
- `elementor:getTemplate` - Get template details
- `elementor:createTemplate` - Create new template
- `elementor:updateTemplate` - Update template
- `elementor:deleteTemplate` - Delete template

### Pages/Documents

- `elementor:listPages` - List Elementor-edited pages
- `elementor:getPage` - Get page with Elementor data
- `elementor:createPage` - Create page with Elementor
- `elementor:updatePage` - Update page Elementor content

### Kit Settings

- `elementor:getKit` - Get global kit settings
- `elementor:updateKit` - Update kit settings

## Usage Examples

### Create Elementor Page

```
Create a new Elementor page titled "About Us" with a hero section and two-column layout
```

### Update Kit Colors

```
Update Elementor kit primary color to #0073aa
```

### Export Template

```
Export the "Header Template" Elementor template as JSON
```

## Implementation Status

Elementor integration is planned for v0.2.0. The REST API endpoints will be added to `includes/class-elementor-rest-api.php` and corresponding MCP tools will be added to the MCP server.

## Fallback Behavior

When Elementor is not active, AYU AI Elementor falls back to standard WordPress/Gutenberg functionality. All core WordPress tools remain available.

