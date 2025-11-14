# AYU AI Elementor API Documentation

## Base URL

All endpoints are prefixed with `/wp-json/ayu/v1/`

## Authentication

Include token in Authorization header:

```
Authorization: Bearer ayu_<your-token>
```

## Endpoints

### Posts

#### List Posts
```
GET /posts
Query params:
  - post_type: 'post' | 'page' (default: 'post')
  - per_page: number (default: 10, max: 100)
  - page: number (default: 1)
  - search: string (optional)
  - status: 'publish' | 'draft' | 'future' | 'pending' | 'private' (optional)
```

#### Get Post
```
GET /posts/{id}
```

#### Create Post
```
POST /posts
Body:
{
  "title": string (required),
  "content": string (optional),
  "excerpt": string (optional),
  "status": "draft" | "publish" | "pending" | "private" (default: "draft"),
  "type": "post" | "page" (default: "post"),
  "slug": string (optional),
  "categories": number[] (optional),
  "tags": string[] (optional),
  "featured_image": number (optional)
}
```

#### Update Post
```
POST /posts/{id}
Body: Same as create, all fields optional
```

#### Delete Post
```
DELETE /posts/{id}
Query params:
  - force: boolean (default: false)
```

### Media

#### List Media
```
GET /media
Query params:
  - per_page: number (default: 20, max: 100)
  - page: number (default: 1)
  - search: string (optional)
  - mime_type: string (optional)
```

#### Get Media
```
GET /media/{id}
```

#### Delete Media
```
DELETE /media/{id}
```

### Users

#### List Users
```
GET /users
Query params:
  - per_page: number (default: 20, max: 100)
  - page: number (default: 1)
  - search: string (optional)
  - role: string (optional)
```

#### Get User
```
GET /users/{id}
```

#### Create User
```
POST /users
Body:
{
  "username": string (required),
  "email": string (required, valid email),
  "password": string (optional, min 8 chars),
  "display_name": string (optional),
  "role": "subscriber" | "contributor" | "author" | "editor" | "administrator" (default: "subscriber")
}
```

#### Update User
```
POST /users/{id}
Body: Same as create, all fields optional
```

#### Delete User
```
DELETE /users/{id}
Query params:
  - reassign: number (optional, user ID to reassign content to)
```

### Menus

#### List Menus
```
GET /menus
```

#### Get Menu
```
GET /menus/{id}
Returns menu with items array
```

#### Create Menu
```
POST /menus
Body:
{
  "name": string (required)
}
```

#### Update Menu
```
POST /menus/{id}
Body:
{
  "name": string (optional),
  "items": [
    {
      "title": string (required),
      "url": string (required, valid URL),
      "parent": number (default: 0),
      "order": number (default: 0)
    }
  ] (optional)
}
```

#### Delete Menu
```
DELETE /menus/{id}
```

### Taxonomies

#### List Taxonomies
```
GET /taxonomies
```

#### List Terms
```
GET /taxonomies/{taxonomy}/terms
```

#### Create Term
```
POST /taxonomies/{taxonomy}/terms
Body:
{
  "name": string (required),
  "slug": string (optional)
}
```

### Options

#### Get Option
```
GET /options/{name}
```

#### Update Option
```
POST /options/{name}
Body:
{
  "value": any
}
```

### Site Health

#### Get Site Health
```
GET /site-health
Returns WordPress site health test results
```

## Error Responses

All errors follow this format:

```json
{
  "code": "error_code",
  "message": "Human-readable error message",
  "data": {
    "status": 400
  }
}
```

Common error codes:
- `rest_forbidden` - Insufficient permissions
- `invalid_token` - Invalid or expired token
- `rate_limit_exceeded` - Too many requests
- `post_not_found` - Post doesn't exist
- `invalid_json` - Invalid JSON in request body

## Rate Limiting

Default: 100 requests per minute per token/IP.

Rate limit headers:
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

## CORS

CORS is disabled by default. Configure allowed origins in **AYU AI → Settings**.

