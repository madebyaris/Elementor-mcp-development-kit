# AYU AI Elementor - Testing Guide

This guide will help you test the AYU AI Elementor plugin end-to-end.

## Prerequisites

- WordPress running at http://localhost:8080
- Docker containers running (wordpress, wordpress-db)
- Node.js and pnpm installed

## Step 1: Verify Setup

Run the test script to check everything is in place:

```bash
./test-ayu-plugin.sh
```

This will verify:
- ✅ WordPress is running
- ✅ Plugin files exist
- ✅ MCP server is built

## Step 2: Activate Plugin

1. Go to WordPress admin: http://localhost:8080/wp-admin
2. Navigate to **Plugins**
3. Find **"AYU AI Elementor"** and click **Activate**

## Step 3: Create a Token

1. Go to **AYU AI → Tokens** in WordPress admin
2. Select scopes you want (or use "Select All")
3. Choose expiration (default: 90 days)
4. Click **Create Token**
5. **IMPORTANT**: Copy the token immediately - you won't see it again!

## Step 4: Test REST API

Test the REST API with your token:

```bash
./test-rest-api.sh <your-token>
```

This will test:
- `wp:listPosts` - List WordPress posts
- `wp:getSiteHealth` - Get site health status
- `wp:listTaxonomies` - List taxonomies
- `wp:listMenus` - List navigation menus

## Step 5: Configure Cursor MCP

1. Open `~/.cursor/mcp.json` (create if it doesn't exist)
2. Add the following configuration:

```json
{
  "mcpServers": {
    "ayu-ai-elementor": {
      "command": "pnpm",
      "args": ["--filter", "wp-mcp-server-ayu", "start:stdio"],
      "cwd": "/Volumes/app/self-project/mcp-research-elementor",
      "env": {
        "WORDPRESS_URL": "http://localhost:8080",
        "AYU_TOKEN": "your-token-here"
      }
    }
  }
}
```

3. Replace `your-token-here` with the token you created
4. Replace the `cwd` path with your actual project path

## Step 6: Restart Cursor

1. Completely quit Cursor
2. Reopen Cursor
3. The MCP server should connect automatically

## Step 7: Test in Cursor

Try these commands in Cursor chat:

### Basic Tests
- "List my WordPress posts"
- "Show me WordPress site health"
- "List all WordPress menus"

### Create Content
- "Create a new WordPress post titled 'Test Post' with content 'This is a test'"
- "Create a new page called 'About'"

### Advanced Tests
- "List all WordPress users"
- "Show me all taxonomies"
- "Get WordPress option 'blogname'"

## Step 8: Check Audit Log

1. Go to **AYU AI → Audit Log** in WordPress admin
2. You should see all API requests logged
3. Try different limit options (100, 500, 1000)

## Troubleshooting

### MCP Server Not Connecting

1. Check token is correct in `~/.cursor/mcp.json`
2. Verify MCP server builds: `cd apps/wp-mcp-server-ayu && pnpm run build`
3. Test MCP server manually:
   ```bash
   cd apps/wp-mcp-server-ayu
   WORDPRESS_URL=http://localhost:8080 AYU_TOKEN=your-token pnpm run start:stdio
   ```

### REST API Returns 403

- Check token has required scopes
- Verify token hasn't expired
- Check user has proper WordPress capabilities

### Plugin Not Appearing

- Check plugin files are in `apps/wordpress/wp-content/plugins/ayu-ai-elementor/`
- Verify WordPress can access the plugin directory
- Check for PHP errors in WordPress debug log

## Manual API Testing

You can test endpoints manually with curl:

```bash
# List posts
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/wp-json/ayu/v1/posts

# Get site health
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/wp-json/ayu/v1/site-health

# Create a post
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"Test content","status":"draft"}' \
  http://localhost:8080/wp-json/ayu/v1/posts
```

## Next Steps

Once everything is working:
- Explore all available tools in Cursor
- Create real content using AYU AI
- Check audit logs to monitor activity
- Customize token scopes for different use cases

