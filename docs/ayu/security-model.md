# AYU AI Elementor Security Model

## Overview

AYU AI Elementor implements a multi-layered security model to ensure safe, controlled access to WordPress functionality through MCP tools.

## Authentication Methods

### 1. WordPress Nonces (Admin UI)

- **Use Case**: Direct admin interface interactions
- **Lifetime**: 24 hours (WordPress default)
- **Scope**: Full admin capabilities for authenticated user
- **Implementation**: Standard WordPress nonce system via `wp_create_nonce()` and `wp_verify_nonce()`

### 2. Personal Access Tokens (PAT)

- **Use Case**: MCP server authentication, API access
- **Lifetime**: Configurable (default: 90 days, max: 1 year)
- **Scopes**: Granular permissions per token
- **Storage**: Hashed in database, plaintext shown once on creation
- **Revocation**: User can revoke tokens at any time

#### Token Format

```
ayu_<random_32_chars>
```

#### Scope System

Scopes define what actions a token can perform:

- `read:posts` - Read posts/pages
- `write:posts` - Create/update posts/pages
- `delete:posts` - Delete posts/pages
- `read:media` - Read media library
- `write:media` - Upload/update media
- `delete:media` - Delete media
- `read:users` - Read user data
- `write:users` - Create/update users
- `read:settings` - Read WordPress options
- `write:settings` - Update WordPress options
- `read:elementor` - Read Elementor data (if Elementor active)
- `write:elementor` - Modify Elementor data (if Elementor active)
- `read:menus` - Read navigation menus
- `write:menus` - Modify navigation menus

### 3. Capability Mapping

Each tool maps to WordPress capabilities:

| Tool Category | Required Capability |
|--------------|-------------------|
| Posts/Pages | `edit_posts` / `edit_pages` |
| Media | `upload_files` |
| Users | `list_users` / `edit_users` |
| Settings | `manage_options` |
| Elementor | `edit_posts` + Elementor permissions |
| Menus | `edit_theme_options` |

## Security Features

### Rate Limiting

- **Default**: 100 requests per minute per token/IP
- **Configurable**: Per-token rate limits in admin UI
- **Storage**: Transient API with automatic cleanup

### CORS Protection

- **Allowed Origins**: Configurable in settings
- **Default**: Same-origin only
- **Headers**: `X-WP-Nonce`, `Authorization: Bearer <token>`

### Audit Logging

All tool executions are logged with:
- Timestamp
- User ID
- Token ID (if applicable)
- Tool name
- Input parameters (sanitized)
- Result status
- IP address

Logs retained for 90 days (configurable).

### Input Validation

- All inputs validated via Zod schemas in MCP server
- WordPress sanitization functions applied server-side
- SQL injection protection via prepared statements
- XSS protection via output escaping

## Best Practices

1. **Use Least Privilege**: Grant only necessary scopes
2. **Rotate Tokens**: Regularly regenerate PATs
3. **Monitor Logs**: Review audit logs for suspicious activity
4. **Secure Storage**: Never commit tokens to version control
5. **HTTPS Only**: Always use HTTPS in production

## Security Checklist

- [ ] All endpoints require authentication
- [ ] Capability checks on every request
- [ ] Input validation and sanitization
- [ ] Output escaping
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Audit logging active
- [ ] Tokens stored securely (hashed)
- [ ] Nonces verified on all admin actions
- [ ] Error messages don't leak sensitive info

