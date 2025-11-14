# SDD Guidelines for Zero One Monorepo

These guidelines help SDD commands understand the monorepo structure and conventions.

## Monorepo Context

- **Orchestrator**: moonrepo (≥1.41.1)
- **Package Manager**: pnpm 10.18.0
- **Formatting**: Biome
- **Testing**: Vitest (frontend), Go native tests, Playwright (E2E)

## Available Templates/Apps

When generating specs, reference these apps:

### Frontend
- `apps/react-app` - React SPA with React Router, Vite, Tailwind
- `apps/react-ssr` - Server-side rendered React
- `apps/nextjs-app` - Next.js 15 with App Router
- `apps/astro-web` - Astro static site generator

### Backend
- `apps/go-clean` - Clean architecture Go backend
- `apps/go-modular` - Modular Go backend with feature modules
- `apps/fastapi-ai` - FastAPI Python backend (AI/ML focused)

### CMS
- `apps/strapi-cms` - Strapi headless CMS

### Shared
- `packages/shared-ui` - React component library (shadcn/ui based)

## Moon Task Patterns

Always reference moon tasks in plans:

```markdown
- Development: `moon <project>:dev`
- Testing: `moon <project>:test`
- Building: `moon <project>:build`
- E2E: `moon <project>:e2e`
- Docker: `moon <project>:docker-build`, `docker-run`
```

## Code Style

- **TypeScript**: Strict mode, single quotes, no semicolons (Biome)
- **Go**: Standard formatting with `gofmt`
- **Python**: Black formatting (via uv/FastAPI setup)

## File Organization

- Frontend apps: `app/` or `src/app/` for routes
- Go apps: `cmd/` for CLI, `internal/` or `modules/` for business logic
- FastAPI: `app/router/` → `app/services/` → `app/repository/`

## Testing Expectations

- Unit tests co-located with code
- E2E tests in `tests-e2e/` for frontend apps
- Coverage expectations: 80%+ for critical paths

## Documentation

When creating SDD specs, reference these guides:

- **Business Context**: `docs-ai/business-context.md` - Core verticals, business outcomes, SDD/VDD alignment
- **PRD Template**: `docs-ai/prd-template.md` - Product requirements structure (create PRD before `/brief` or `/specify`)
- **Technical Guide**: `docs-ai/technical-guide.md` - Technical implementation mapping (use after `/plan`)
- **SDD Workflow**: `docs-ai/sdd-workflow.md` - Complete SDD command reference and usage patterns
- **Quick Reference**: `docs-ai/quick-reference.md` - Common moon commands and workflows

## Business Alignment (VDD Integration)

Before starting SDD commands, consider:

1. **Which vertical?** (See `docs-ai/business-context.md`)
   - Digital Commerce → `nextjs-app`, `react-app`, `go-clean`
   - Internal Operations → `react-ssr`, `astro-web`, `go-modular`
   - AI/Automation → `fastapi-ai`, `shared-ui`
   - Content & Community → `astro-web`, `strapi-cms`

2. **Create PRD first?** (Recommended for complex features)
   - Use `docs-ai/prd-template.md` to capture business requirements
   - Then reference PRD when running `/brief` or `/specify`

3. **Link specs to business outcomes**
   - Reference business metrics from PRD in specs
   - Map technical decisions to business value

## Recommended Workflow

**For most features (80%):**
1. Review business context → Choose vertical/template
2. `/brief feature-name` → 30-minute planning
3. Start coding, use `/evolve` to update specs

**For complex features (20%):**
1. Create PRD using `docs-ai/prd-template.md`
2. `/research feature-name` → Technology research
3. `/specify feature-name` → Detailed spec (reference PRD)
4. `/plan feature-name` → Technical architecture (reference `docs-ai/technical-guide.md`)
5. `/tasks feature-name` → Task breakdown
6. `/implement feature-name` → Code generation

