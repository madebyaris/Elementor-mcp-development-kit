# Zero One Monorepo – Agent Briefing

Use this file first. Detailed summaries live in `docs-ai/README.md`; load that single file instead of scanning the entire repository. For command cheat sheets, see `docs-ai/quick-reference.md`.

## Setup
- Install dependencies: `pnpm install`
- Initialize moon toolkit: `pnpm run prepare`
- Bring up local services (optional): `pnpm compose:up`

## Core Commands
- `moon :dev` / `moon <project>:dev` – start development servers.
- `moon :lint`, `moon :check`, `moon :typecheck`, `moon :test`, `moon :build` – repo-wide tasks.
- `pnpm run format` – format with Biome.
- `moon project-graph` – inspect project dependencies.

## Project Map (read-only)
- `apps/wp-mcp-server` – the only active application. It is a TypeScript Model Context Protocol server that surfaces WordPress content to Cursor (stdio transport).
- `packages/shared-ui/` – legacy component kit (kept for reference; not wired into the new stack but still available if you need UI primitives).
- `templates/` / `builder/` – historical scaffolds retained for archival purposes. Touch only if you plan to revive old templates.
- `docker/` & `compose.yaml` – local infrastructure stacks. WordPress + MariaDB live under `docker/_stacks_/wordpress.yaml`.
- `docs/` – new documentation home for runtime instructions (`docs/wordpress-stack.md`, `docs/wp-mcp-server.md`).
- `docsite/` – Hugo docs (legacy articles, still published).
- ➡️ Always skim `docs-ai/README.md` before deep-diving into other files.

## Active Workflow
1. Bring up Docker WordPress via `docker compose up -d wordpress wordpress-db`.
2. Hack on `apps/wp-mcp-server` (see its `moon.yml` and docs in `docs/wp-mcp-server.md`).
3. Use Cursor MCP with the stdio command `pnpm --filter wp-mcp-server start:stdio`.
4. Update docs in `docs/` whenever WordPress or MCP behavior changes.

## Testing & QA
- Prefer moon tasks—they encapsulate dependencies and environment files.
- E2E tests via Playwright: `moon <frontend-project>:e2e` / `:e2e-ui`.
- Docker image build/run helpers live as moon tasks (`docker-build`, `docker-run`, `docker-shell`).

## Agent Guidelines
- Load `docs-ai/README.md` for additional context instead of trawling directories.
- Grab ready-to-run commands from `docs-ai/quick-reference.md` when you need task reminders.
- For product/business alignment consult `docs-ai/business-context.md`, `docs-ai/prd-template.md`, and `docs-ai/technical-guide.md`.
- **SDD Integration**: This monorepo uses Spec-Driven Development - see `docs-ai/sdd-workflow.md` for commands. Use `/brief` for 80% of features (30-min planning), full SDD 2.0 for complex ones. Check `.sdd/guidelines.md` for monorepo-specific SDD rules.
- **VDD Integration**: Vertical Driven Development guides architecture - organize by business features (vertical slices), not technical layers. See `.cursor/rules/vdd-core-principles.mdc` for VDD philosophy. Use `/vdd-build` or `/vdd-all-in-one` for complete apps with vertical slices.
- Avoid expanding `packages/shared-ui` unless necessary; consult `src/components/index.ts` first.
- When answering developer questions, cite specific paths and moon tasks. Keep responses token-efficient.

## SDD Workflow Quick Reference
- **Lightweight (80%)**: `/brief feature-name` → Start coding → `/evolve` to update
- **Complex (20%)**: PRD → `/research` → `/specify` → `/plan` → `/tasks` → `/implement`
- **Full Projects**: `/sdd-full-plan` for epic-level roadmaps
- **VDD Commands**: `/vdd-build` or `/vdd-all-in-one` for complete apps with vertical slices
- **System Rules**: `.cursor/rules/sdd-system.mdc` contains SDD system overview, `.cursor/rules/vdd-*.mdc` for VDD principles

