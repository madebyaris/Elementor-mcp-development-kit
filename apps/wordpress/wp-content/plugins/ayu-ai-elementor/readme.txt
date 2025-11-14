=== AYU AI Elementor ===
Contributors: madebyaris
Tags: ai, mcp, elementor, wordpress, automation, cursor
Requires at least: 6.5
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 0.1.0
License: MIT
License URI: https://opensource.org/licenses/MIT

Open-source AI assistant for WordPress with MCP support and Elementor integration.

== Description ==

AYU AI Elementor is an open-source WordPress plugin that exposes WordPress functionality via MCP (Model Context Protocol) tools, allowing AI assistants like Cursor to interact with your WordPress site.

**Key Features:**

* MCP-compatible REST API for WordPress automation
* Personal Access Token (PAT) authentication with granular scopes
* Comprehensive WordPress tools: posts, media, users, menus, taxonomies, settings
* Elementor integration (coming in v0.2.0)
* Security-first: capability checks, rate limiting, audit logging
* Vendor-agnostic: works with or without Elementor

**Use Cases:**

* Automate WordPress content management from Cursor
* Bulk operations on posts, media, users
* Site configuration and maintenance
* Elementor page building (when Elementor is active)

== Installation ==

1. Upload `ayu-ai-elementor` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to **AYU AI → Tokens** to create a Personal Access Token
4. Configure your MCP client (Cursor) with the token

See [Quick Start Guide](https://github.com/madebyaris/Elementor-mcp-development-kit/blob/main/docs/ayu/quickstart.md) for detailed setup.

== Frequently Asked Questions ==

= Do I need Elementor? =

No. AYU AI Elementor works with standard WordPress. Elementor integration is optional and adds additional tools when Elementor is active.

= How do I use this with Cursor? =

1. Create a token in WordPress admin (AYU AI → Tokens)
2. Add MCP server configuration to `~/.cursor/mcp.json`
3. Restart Cursor
4. Start using AYU AI tools in Cursor chat

See [Quick Start Guide](https://github.com/madebyaris/Elementor-mcp-development-kit/blob/main/docs/ayu/quickstart.md) for details.

= Is this secure? =

Yes. AYU AI Elementor implements multiple security layers:
* Token-based authentication
* WordPress capability checks
* Rate limiting
* Input validation and sanitization
* Audit logging

See [Security Model](https://github.com/madebyaris/Elementor-mcp-development-kit/blob/main/docs/ayu/security-model.md) for details.

= What MCP clients are supported? =

Any MCP-compatible client. Tested with Cursor IDE. Should work with Claude Desktop, Continue.dev, and other MCP clients.

== Changelog ==

= 0.1.0 =
* Initial release
* WordPress core tools (posts, media, users, menus, taxonomies, options)
* Personal Access Token authentication
* Admin UI for token management
* Audit logging
* Rate limiting
* REST API endpoints

== Upgrade Notice ==

= 0.1.0 =
Initial release. No upgrade needed.

== Screenshots ==

1. Token management interface
2. Audit log viewer
3. Settings page

== Development ==

Contributions welcome! See [Contributing Guide](https://github.com/madebyaris/Elementor-mcp-development-kit/blob/main/.github/CONTRIBUTING.md).

== Support ==

* GitHub Issues: https://github.com/madebyaris/Elementor-mcp-development-kit/issues
* Documentation: https://github.com/madebyaris/Elementor-mcp-development-kit/tree/main/docs/ayu

