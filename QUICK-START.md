# AYU AI Elementor - Quick Start

## ✅ Status: Everything is Working!

Your setup is complete and tested. Here's what's ready:

- ✅ WordPress plugin activated
- ✅ REST API endpoints working
- ✅ Token authentication working
- ✅ MCP server built and ready
- ✅ All dependencies installed

## 🚀 Connect to Cursor (2 minutes)

### Step 1: Configure Cursor MCP

Open or create `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ayu-ai-elementor": {
      "command": "pnpm",
      "args": ["--filter", "wp-mcp-server-ayu", "start:stdio"],
      "cwd": "/Volumes/app/self-project/mcp-research-elementor",
      "env": {
        "WORDPRESS_URL": "http://localhost:8080",
        "AYU_TOKEN": "ayu_tUnLFIvhbkS2fQB0t6imbhgV7NkrJELZ"
      }
    }
  }
}
```

**Important**: Replace the token with your actual token from WordPress admin!

### Step 2: Restart Cursor

1. Completely quit Cursor (Cmd+Q on Mac)
2. Reopen Cursor
3. The MCP server should connect automatically

### Step 3: Test in Cursor

Try these commands in Cursor chat:

```
List my WordPress posts
```

```
Show WordPress site health information
```

```
Create a new WordPress post titled "Test from Cursor" with content "This is a test"
```

## 📋 Available Tools

### WordPress Core (30+ tools)
- `wp.listPosts` - List posts/pages
- `wp.createPost` - Create new content
- `wp.updatePost` - Edit existing content
- `wp.listMedia` - Browse media library
- `wp.listUsers` - Manage users
- `wp.listMenus` - Navigation menus
- `wp.getSiteHealth` - Site information
- And many more...

### Elementor (when Elementor is active)
- `elementor.listTemplates` - List templates
- `elementor.getKit` - Global settings
- `elementor.listPages` - Elementor pages

## 🔧 Troubleshooting

### MCP Server Not Connecting

1. **Check token**: Make sure token in `mcp.json` matches your WordPress token
2. **Verify path**: Ensure `cwd` path is correct for your system
3. **Test manually**:
   ```bash
   cd /Volumes/app/self-project/mcp-research-elementor
   WORDPRESS_URL=http://localhost:8080 AYU_TOKEN=your-token pnpm --filter wp-mcp-server-ayu start:stdio
   ```

### Token Issues

- Create new token: http://localhost:8080/wp-admin/admin.php?page=ayu-ai-tokens
- Check token scopes match what you need
- Verify token hasn't expired

### Rebuild MCP Server

```bash
cd apps/wp-mcp-server-ayu
rm -rf node_modules dist
pnpm install
pnpm run build
```

## 📚 Next Steps

- Explore all available tools
- Create content using natural language
- Check audit logs to see activity
- Customize token scopes for different use cases

## 🎉 You're Ready!

Everything is set up and working. Start using AYU AI in Cursor!

