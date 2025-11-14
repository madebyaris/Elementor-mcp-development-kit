# WordPress Development Stack

This project now ships with a Dockerized WordPress environment that you can enable directly from the root `compose.yaml`.

## 1. Configure environment variables

Create a `.env` file in the repository root (or export the following variables in your shell) so Docker Compose can interpolate them:

```
WORDPRESS_PORT=8080
WORDPRESS_PHPMYADMIN_PORT=8081
WORDPRESS_URL=http://localhost:8080

WORDPRESS_DB_PORT=3307
WORDPRESS_DB_NAME=wordpress
WORDPRESS_DB_USER=wp_user
WORDPRESS_DB_PASSWORD=wp_password
WORDPRESS_DB_ROOT_PASSWORD=supersecure
WORDPRESS_TABLE_PREFIX=wp_
```

Feel free to customize the credentials for your local setup.

## 2. Start WordPress and MariaDB

```bash
docker compose up -d wordpress wordpress-db wordpress-phpmyadmin
```

This command reuses the existing `compose.yaml` and attaches the services to the shared `madebyaris-mcp-elementor_network`. Containers expose:

- WordPress: <http://localhost:8080>
- phpMyAdmin: <http://localhost:8081>
- MariaDB: `localhost:3307` (for local clients)

## 3. First-time setup

1. Visit `WORDPRESS_URL` in your browser.
2. Complete the standard WordPress installer (site title, admin user, password).
3. Log into the dashboard to verify everything works.

The WordPress container mounts two named volumes defined in `docker/_stacks_/wordpress.yaml`:

- `wordpress_app_data` – WP core, plugins, uploads.
- `wordpress_db_data` – MariaDB data directory.

## 4. Helpful commands

| Task | Command |
| --- | --- |
| Follow logs | `docker compose logs -f wordpress` |
| Stop stack | `docker compose stop wordpress wordpress-db wordpress-phpmyadmin` |
| Remove stack | `docker compose down -v wordpress wordpress-db wordpress-phpmyadmin` |

## 5. WordPress REST API

The MCP server will communicate with WordPress via its REST API: `WORDPRESS_URL/wp-json/wp/v2/...`. Make sure the URL you configure is reachable from the environment where the MCP server runs (typically your local machine when using Cursor MCP). If you enable authentication, create an application password in WordPress and store the credentials securely (e.g., `.env.local`, not committed to git).

## 6. Local `wp-content` for plugin/theme development

The repository now includes a tracked `apps/wordpress/wp-content/` directory that is bind-mounted into the container (`/var/www/html/wp-content`). Anything you place inside this folder—custom plugins, themes, mu-plugins—will instantly be available inside the running WordPress instance.

Typical structure:

```
apps/
└── wordpress/
└── wp-content/
    ├── plugins/
    ├── mu-plugins/
    └── themes/
```

Create your plugin folder (e.g., `apps/wordpress/wp-content/plugins/my-mcp-bridge`) and WordPress will detect it after a browser refresh. This keeps source-controlled copies of your plugin code alongside the MCP server without relying on Docker volumes stored outside the repo.

