# Zero One Monorepo — Quick Reference

Use this sheet when you need fast answers about operating the repo.

## Setup & Bootstrap
- Install deps: `pnpm install`
- Run moon setup: `pnpm run prepare`
- Start local WordPress: `docker compose up -d wordpress wordpress-db`
- (Optional) phpMyAdmin: add `wordpress-phpmyadmin` to the command above.

## Daily Commands
- `moon wp-mcp-server:dev` — hot reload MCP server
- `moon wp-mcp-server:build` — compile to `dist/`
- `moon wp-mcp-server:start-stdio` — production stdio target (depends on `build`)
- `pnpm --filter wp-mcp-server start:stdio` — command used by Cursor MCP
- `pnpm run format` — Biome formatter
- `docker compose logs -f wordpress` — observe WordPress stack

## MCP Workflow Recap
1. Ensure WordPress is running locally (see `docs/wordpress-stack.md`).
2. Export `WORDPRESS_URL`, `WORDPRESS_USER`, `WORDPRESS_APPLICATION_PASSWORD`.
3. Build or dev-run `apps/wp-mcp-server`.
4. Configure Cursor MCP as documented in `docs/wp-mcp-server.md`.

## Managing Dependencies
- Add runtime dep: `pnpm --filter wp-mcp-server add <pkg>`
- Add dev dep: `pnpm --filter wp-mcp-server add -D <pkg>`
- Update workspace deps: `pnpm run update-deps`
- Cleanup install/cache artifacts: `pnpm run cleanup`

## Testing Highlights
- `moon wp-mcp-server:lint` / `:check` — Biome auto-fixes
- `moon wp-mcp-server:build` — TypeScript compilation
- Manual end-to-end: `docker compose up ...` + `pnpm --filter wp-mcp-server start:stdio` + Cursor prompt

## Contribution Checklist
- Update `docs/wp-mcp-server.md` and `docs/wordpress-stack.md` for any new env vars or tools.
- Keep moon tasks in `apps/wp-mcp-server/moon.yml` aligned with `package.json` scripts.
- Run formatter + lint (`pnpm run format`, `moon wp-mcp-server:lint`) before submitting changes.

## Getting Help
- GitHub issues: `https://github.com/zero-one-group/monorepo`
- Maintainers: WordPress/MCP `@madebyaris`; Infra `@prihuda`

Keep this file tight—expand long answers in `docsite/` or `docs/` when needed.

