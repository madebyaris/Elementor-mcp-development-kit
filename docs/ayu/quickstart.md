# AYU AI Elementor - Quick Start Guide

## Overview

AYU AI Elementor is an open-source WordPress plugin that exposes WordPress functionality via MCP (Model Context Protocol) tools, allowing AI assistants like Cursor to interact with your WordPress site.

## Prerequisites

- WordPress 6.5+ running locally or remotely
- Node.js 18+ and pnpm
- Cursor IDE (or another MCP-compatible client)

## Installation

### 1. Install WordPress Plugin

1. Copy `apps/wordpress/wp-content/plugins/ayu-ai-elementor` to your WordPress `wp-content/plugins/` directory
2. Activate the plugin in WordPress admin
3. Navigate to **AYU AI → Tokens** to create a Personal Access Token

### 2. Install MCP Server

```bash
cd apps/wp-mcp-server-ayu
pnpm install
pnpm run build
```

### 3. Configure Cursor

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ayu-ai-elementor": {
      "command": "pnpm",
      "args": ["--filter", "wp-mcp-server-ayu", "start:stdio"],
      "cwd": "/path/to/mcp-research-elementor",
      "env": {
        "WORDPRESS_URL": "http://localhost:8080",
        "AYU_TOKEN": "your-token-from-step-1"
      }
    }
  }
}
```

Replace:
- `/path/to/mcp-research-elementor` with your actual project path
- `http://localhost:8080` with your WordPress URL
- `your-token-from-step-1` with the token you created

### 4. Restart Cursor

Restart Cursor to load the MCP server configuration.

## Usage Examples

### Create a Post

```
Create a new blog post titled "Hello World" with content "This is my first post using AYU AI"
```

### List Posts

```
Show me the last 10 published posts
```

### Update Menu

```
Add a new menu item "Contact" linking to /contact to the main navigation menu
```

### Get Site Health

```
Check the WordPress site health status
```

## Available Tools

### WordPress Core Tools

- `wp.listPosts` - List posts/pages
- `wp.getPost` - Get post details
- `wp.createPost` - Create new post/page
- `wp.updatePost` - Update existing post/page
- `wp.deletePost` - Delete post/page
- `wp.listMedia` - List media files
- `wp.getMedia` - Get media details
- `wp.deleteMedia` - Delete media
- `wp.listUsers` - List users
- `wp.getUser` - Get user details
- `wp.createUser` - Create user
- `wp.updateUser` - Update user
- `wp.deleteUser` - Delete user
- `wp.listMenus` - List navigation menus
- `wp.getMenu` - Get menu with items
- `wp.createMenu` - Create menu
- `wp.updateMenu` - Update menu
- `wp.deleteMenu` - Delete menu
- `wp.listTaxonomies` - List taxonomies
- `wp.listTerms` - List taxonomy terms
- `wp.createTerm` - Create term
- `wp.getOption` - Get WordPress option
- `wp.updateOption` - Update WordPress option
- `wp.getSiteHealth` - Get site health status

### Elementor Tools (when Elementor is active)

- `elementor.listTemplates` - List Elementor templates
- `elementor.getTemplate` - Get template details
- `elementor.getKit` - Get global kit settings
- `elementor.updateKit` - Update kit settings
- `elementor.listPages` - List Elementor-edited pages
- `elementor.getPage` - Get page with Elementor data

## Troubleshooting

### MCP Server Not Connecting

1. Check that `WORDPRESS_URL` is correct and accessible
2. Verify `AYU_TOKEN` is valid (create new token if needed)
3. Check Cursor console for errors
4. Ensure `pnpm` is in your PATH

### Permission Errors

1. Verify token has required scopes
2. Check user capabilities in WordPress
3. Review audit log in **AYU AI → Audit Log**

### Rate Limiting

Default rate limit is 100 requests/minute. Adjust in **AYU AI → Settings**.

## Next Steps

- Read [API Documentation](api.md)
- Review [Security Model](security-model.md)
- Check [Elementor Integration Guide](elementor-integration.md) (coming soon)

