# WordPress MCP Server

This document covers how to run the `wp-mcp-server` project locally and connect it to Cursor (or any MCP-aware client).

## 1. Environment variables

| Variable | Description | Example |
| --- | --- | --- |
| `WORDPRESS_URL` | Base URL for the Dockerized WordPress instance | `http://localhost:8080` |
| `WORDPRESS_USER` | WordPress username with an Application Password | `admin` |
| `WORDPRESS_APPLICATION_PASSWORD` | Application password for the above user | `abcd efgh ijkl mnop` |

Store these in a local `.env` (not committed to git) inside `apps/wp-mcp-server` or export them before running the server. Anonymous access works for public data, but authenticated credentials unlock drafts and private posts.

## 2. Scripts and Moon tasks

```
pnpm --filter wp-mcp-server dev          # live-reload stdio server (tsx)
pnpm --filter wp-mcp-server build        # emit dist/server.js
pnpm --filter wp-mcp-server start:stdio  # run compiled server (used by Cursor)

moon wp-mcp-server:dev
moon wp-mcp-server:build
moon wp-mcp-server:start-stdio
```

## 3. Cursor MCP configuration

Add (or merge) the following snippet into your local `~/.cursor/mcp.json`:

```jsonc
{
  "mcpServers": {
    "wordpress": {
      "command": "pnpm",
      "args": ["--filter", "wp-mcp-server", "start:stdio"],
      "cwd": "/Volumes/app/self-project/mcp-research-elementor",
      "env": {
        "WORDPRESS_URL": "http://localhost:8080",
        "WORDPRESS_USER": "admin",
        "WORDPRESS_APPLICATION_PASSWORD": "your-app-password"
      }
    }
  }
}
```

After saving, restart Cursor → Settings → MCP Servers to load the new provider. The new tools appear under the `wordpress` namespace. Example commands:

- `wordpress:listPosts` – list recent posts (filters: `perPage`, `search`, `status`)
- `wordpress:getPost` – fetch by ID or slug (`context` defaults to `view`)
- `wordpress:getSiteInfo` – site metadata, namespaces, routes

## 4. Testing the end-to-end flow

1. `docker compose up -d wordpress wordpress-db` (see [`docs/wordpress-stack.md`](./wordpress-stack.md)).
2. Create at least one blog post inside WordPress.
3. `pnpm --filter wp-mcp-server build && pnpm --filter wp-mcp-server start:stdio`.
4. Connect Cursor to the MCP server and run `wordpress:listPosts`. You should receive JSON summaries from your local WordPress environment.


