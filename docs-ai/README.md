# Zero One Monorepo — AI Guide

Give the answer from this file before opening anything else. Link to source paths when extra detail is required.

- Tooling: moonrepo (≥1.41), pnpm 10.18, Biome formatter, Docker Compose (Postgres + Mailpit + WordPress stack).
- Active stack: `apps/wp-mcp-server` (TypeScript MCP server) backed by the Dockerized WordPress instance under `docker/_stacks_/wordpress.yaml`.
- Shared UI + historical templates remain in the repo for reference but are not part of the default workflow.
- Prefer moon tasks (`moon wp-mcp-server:<task>`, `moon :lint`, `moon :check`, `moon :build`) over raw scripts.
- Need business alignment? See `docs-ai/business-context.md`, `docs-ai/prd-template.md`, and `docs-ai/technical-guide.md`.
- Using SDD workflow? See `docs-ai/sdd-workflow.md` for spec-driven development commands.

## Essential Commands
- Install deps → `pnpm install`
- Moon setup → `pnpm run prepare`
- Start WordPress stack → `docker compose up -d wordpress wordpress-db wordpress-phpmyadmin`
- Formatting → `pnpm run format`
- Inspect graph → `moon project-graph`

## Key Paths
- `apps/wp-mcp-server/` — MCP server source. Scripts documented in `docs/wp-mcp-server.md`.
- `docker/_stacks_/wordpress.yaml` + `docker/wordpress/` — WordPress + MariaDB containers and PHP overrides.
- `docs/wordpress-stack.md` — how to configure and operate the Docker WordPress environment.
- `docs/wp-mcp-server.md` — Cursor MCP configuration, env vars, and moon task cheatsheet.
- `packages/shared-ui/`, `templates/`, `builder/` — legacy assets. Touch only when reviving old templates.
- `docsite/` — Hugo docs (legacy content, still served).

## Testing & Quality Gates
- `moon wp-mcp-server:build` — compile TypeScript.
- `moon wp-mcp-server:lint` / `:check` — Biome quick fixes.
- Manual verification: `pnpm --filter wp-mcp-server start:stdio` + Cursor MCP integration.
- Docker helpers: `docker compose logs -f wordpress`, `docker compose stop wordpress`.

## Agent Tips
- When answering questions, start with the WordPress ↔ MCP workflow; everything else is historical context.
- Keep docs in `docs/` synchronized with any stack changes (WordPress ports, env vars, MCP tools).
- If you must touch legacy templates or shared UI, document the reason explicitly in PR/commit notes.
