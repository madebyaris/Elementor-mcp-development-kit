# MCP Configuration Fix

## ✅ Server Status: Working!

The MCP server is working correctly. The issue is with Cursor's connection.

## 🔧 Fix Steps

### 1. Verify Your MCP Configuration

Check `~/.cursor/mcp.json` exists and has this exact structure:

```json
{
  "mcpServers": {
    "ayu-ai-elementor": {
      "command": "pnpm",
      "args": ["--filter", "wp-mcp-server-ayu", "start:stdio"],
      "cwd": "/Volumes/app/self-project/mcp-research-elementor",
      "env": {
        "WORDPRESS_URL": "http://localhost:8080",
        "AYU_TOKEN": "your-actual-token-here"
      }
    }
  }
}
```

### 2. Common Issues

#### Issue: Wrong Token
- **Symptom**: Server starts but tools fail with 401/403
- **Fix**: Get your token from: http://localhost:8080/wp-admin/admin.php?page=ayu-ai-tokens
- **Replace**: `"AYU_TOKEN": "your-actual-token-here"` with your real token

#### Issue: Wrong Path
- **Symptom**: "No such file or directory" errors
- **Fix**: Verify `cwd` path matches your actual project location
- **Check**: Run `pwd` in terminal, use that exact path

#### Issue: Server Closes Immediately
- **Symptom**: "Client closed for command" in logs
- **Fix**: 
  1. Completely quit Cursor (Cmd+Q on Mac)
  2. Delete `~/.cursor/mcp.json` if it exists
  3. Create fresh `~/.cursor/mcp.json` with config above
  4. Restart Cursor

### 3. Test Server Manually

Before configuring Cursor, test the server works:

```bash
cd /Volumes/app/self-project/mcp-research-elementor
WORDPRESS_URL=http://localhost:8080 AYU_TOKEN=your-token pnpm --filter wp-mcp-server-ayu start:stdio
```

You should see:
```
[ayu-mcp-server] Starting MCP server...
[ayu-mcp-server] Transport created, connecting...
[ayu-mcp-server] Server connected successfully
```

If you see errors, fix them before configuring Cursor.

### 4. Restart Cursor Properly

1. **Quit Cursor completely** (not just close window)
   - Mac: Cmd+Q
   - Windows/Linux: File → Exit
2. **Wait 5 seconds**
3. **Reopen Cursor**
4. **Check MCP status** in Settings → MCP Servers

### 5. Verify Connection

After restart, check:
- Settings → MCP Servers → Should show "ayu-ai-elementor" as connected
- Try asking: "List my WordPress posts"
- Check logs: Cursor → View → Output → "MCP" channel

## 🐛 Debugging

If still not working:

1. **Check Cursor logs**:
   - View → Output → Select "MCP" from dropdown
   - Look for error messages

2. **Test server directly**:
   ```bash
   echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | WORDPRESS_URL=http://localhost:8080 AYU_TOKEN=your-token pnpm --filter wp-mcp-server-ayu start:stdio
   ```
   Should return JSON response (not error)

3. **Verify WordPress is running**:
   ```bash
   curl http://localhost:8080/wp-json/
   ```

4. **Check token is valid**:
   ```bash
   curl -H "Authorization: Bearer your-token" http://localhost:8080/wp-json/ayu/v1/posts
   ```

## ✅ Expected Behavior

When working correctly:
- MCP server shows as "Connected" in Cursor settings
- You can ask Cursor to "List my WordPress posts"
- Tools appear in Cursor's tool list
- No errors in MCP logs

