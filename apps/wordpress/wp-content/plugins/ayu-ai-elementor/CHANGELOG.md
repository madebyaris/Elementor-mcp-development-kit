# Changelog

All notable changes to AYU AI Elementor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-11-14

### Added
- WordPress core REST API endpoints (posts, media, users, menus, taxonomies, options)
- Personal Access Token (PAT) authentication system
- Token management admin UI
- Scope-based permissions
- Rate limiting (100 req/min default)
- Audit logging system
- Site health endpoint
- MCP server implementation with stdio transport
- Comprehensive tool set for WordPress automation
- Security model documentation
- Quick start guide
- API documentation

### Security
- Token-based authentication
- WordPress capability checks
- Input validation and sanitization
- Rate limiting per token/IP
- Audit trail for all operations

## [Unreleased]

### Planned for 0.2.0
- Elementor integration (templates, pages, kit settings)
- Gutenberg fallbacks for page operations
- SSE/HTTP streamable MCP server
- Enhanced error handling
- More comprehensive tests

### Planned for 0.3.0
- Plugin/theme management tools
- Advanced Elementor features
- Batch operations
- Webhook support

