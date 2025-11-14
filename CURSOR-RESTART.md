# Fix: Cursor MCP Connection Issue

## ✅ Server Status: Working!

The MCP server is working correctly. The issue is Cursor closing the connection.

## 🔧 Solution: Complete Cursor Restart

### Step 1: Quit Cursor Completely

**Mac:**
```bash
# Force quit if needed
killall Cursor 2>/dev/null || true
```

**Windows/Linux:**
- File → Exit (don't just close window)
- Or use Task Manager to end process

### Step 2: Wait 5 Seconds

Let Cursor fully close before reopening.

### Step 3: Reopen Cursor

Open Cursor fresh.

### Step 4: Verify MCP Connection

1. Go to: **Cursor → Settings → Features → MCP**
2. Look for: **"ayu-ai-elementor"** in the list
3. Status should show: **"Connected"** (green)

### Step 5: Test in Chat

Try asking:
```
List my WordPress posts
```

## 🐛 If Still Not Working

### Check MCP Logs

1. **View → Output**
2. Select **"MCP"** from dropdown
3. Look for errors

### Verify Configuration

Your `~/.cursor/mcp.json` should have:

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

### Test Server Manually

```bash
cd /Volumes/app/self-project/mcp-research-elementor
WORDPRESS_URL=http://localhost:8080 AYU_TOKEN=ayu_tUnLFIvhbkS2fQB0t6imbhgV7NkrJELZ pnpm --filter wp-mcp-server-ayu start:stdio
```

Should show server waiting (not exit immediately).

### Common Issues

1. **Token expired**: Create new token at http://localhost:8080/wp-admin/admin.php?page=ayu-ai-tokens
2. **WordPress not running**: `docker compose ps` to check
3. **Wrong path**: Verify `cwd` matches your actual project path

## ✅ Expected Result

After restart:
- MCP server shows as "Connected" in settings
- You can use tools like "List my WordPress posts"
- No errors in MCP logs

