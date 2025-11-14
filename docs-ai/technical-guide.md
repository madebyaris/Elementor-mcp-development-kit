# Technical Implementation Guide

Follow this outline when translating a PRD into actionable technical work within the monorepo.

## 1. Inputs
- Link to PRD (see `docs-ai/prd-template.md`).
- Link to business context (`docs-ai/business-context.md`).
- Existing specs/briefs (SDD `/specify`, `/plan`, `/tasks`).

## 2. Architecture Overview
- Current target: `apps/wp-mcp-server` (MCP server) + Docker WordPress stack (`docker/_stacks_/wordpress.yaml`).
- Define how WordPress content flows into MCP tools (list posts, fetch post, metadata).
- Integration points: Cursor MCP stdio transport, WordPress REST API, docker-compose networking.

## 3. Moon Tasks & Tooling
- Required moon tasks to run (dev, build, test, docker).
- Additional tooling (Playwright, Storybook, migrations).
- Any new tasks to define in `moon.yml`.

## 4. Data & Schema Planning
- Data models (link to migrations or ERDs).
- Persistence decisions (Postgres, Strapi, external data sources).
- API contracts (REST routes, GraphQL, gRPC).

## 5. Implementation Steps
- Feature breakdown referencing SDD `/tasks` output.
- Shared UI usage: components/utilities to import.
- Infrastructure updates (Compose stacks, Terraform modules, etc.).

## 6. Quality Gates
- Unit tests (Vitest, Go tests, Pytest) and coverage expectations.
- E2E/Integration tests (Playwright, API tests) with command references.
- Observability: logging, tracing, metrics hooks.

## 7. Deployment & Operations
- Build/publish steps (Docker images, artifacts).
- Environment variables/secrets required.
- Rollback plan or feature flag strategy.

## 8. Documentation & Handover
- Update `AGENTS.md`/`docs-ai` links if new patterns emerge.
- README or `/docs` updates for the affected app/template.
- Support playbook or runbook links.

> Store this guide alongside the feature PRD (e.g., `apps/<name>/docs/technical-guide.md` or under `specs/<feature>/`). Keep sections succinct so AI agents can quickly map business intent to code changes.

