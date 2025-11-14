# SDD (Spec-Driven Development) Workflow Guide

This monorepo integrates the [spec-kit-command-cursor](https://github.com/madebyaris/spec-kit-command-cursor) toolkit for structured feature development.

**Quick Links:**
- SDD System Rules: `.cursor/rules/sdd-system.mdc`
- SDD Guidelines: `.sdd/guidelines.md` (monorepo-specific)
- SDD Config: `.sdd/config.json`
- Templates: `.sdd/templates/`

## Quick Start

### For Most Features (80% of cases) - Lightweight SDD 2.5

```bash
# Start with a 30-minute brief
/brief feature-name Description of what this feature does
```

This creates `specs/active/feature-name/feature-brief.md` with:
- Problem statement
- User journey
- Success metrics
- Quick implementation plan

Then start coding immediately. Use `/evolve` to update specs as you learn.

### For Complex Features (20% of cases) - Full SDD 2.0

```bash
# Step 1: Research (optional, for complex domains)
/research feature-name

# Step 2: Create detailed specification
/specify feature-name

# Step 3: Create technical plan
/plan feature-name

# Step 4: Break into tasks
/tasks feature-name

# Step 5: Implement
/implement feature-name
```

### Escalation Path

If a brief becomes complex, upgrade it:

```bash
/upgrade feature-name
```

This converts `feature-brief.md` into full SDD spec + plan structure.

## Living Documentation

Keep specs aligned during development:

```bash
/evolve feature-name
```

Updates the spec based on code changes and new learnings.

## Integration with Monorepo

### Template Selection

Current baseline feature target:

- **WordPress Knowledge Agent** → `apps/wp-mcp-server` (MCP server) + Docker WordPress stack (`docker/_stacks_/wordpress.yaml`).
- **Legacy templates** (React, Go, FastAPI, Strapi) live under `templates/` for archival reference. Call them out explicitly if you plan to revive them.

### Moon Tasks Integration

Reference moon tasks in your plans:

```markdown
## Implementation Tasks
- [ ] Run `moon <project>:dev` to start development server
- [ ] Add tests using `moon <project>:test`
- [ ] Build with `moon <project>:build`
- [ ] Run E2E tests: `moon <project>:e2e`
```

### PRD Alignment

Before starting SDD, create a PRD using `docs-ai/prd-template.md`:

1. Business context → PRD (problem, metrics, journeys)
2. PRD → SDD `/specify` or `/brief`
3. SDD `/plan` → Technical guide using `docs-ai/technical-guide.md`

## Spec Storage Structure

```
specs/
├── index.md            # Features index dashboard
├── 00-overview.md      # Project overview
├── active/             # In-progress features
│   └── [task-id]/
│       ├── feature-brief.md    # SDD 2.5 lightweight brief
│       └── OR (SDD 2.0 full):
│           ├── research.md
│           ├── spec.md
│           ├── plan.md
│           └── tasks.md
├── completed/         # Finished features (archive)
├── backlog/           # Backlog items (from config.json)
└── todo-roadmap/      # Full project roadmaps (from /sdd-full-plan)
    └── [project-id]/
        ├── roadmap.json    # Kanban board data
        ├── roadmap.md      # Human-readable view
        └── tasks/          # Task JSON files
```

## Best Practices

1. **Start with `/brief`** for most features - saves time and still provides structure
2. **Use `/evolve`** regularly - keep specs aligned with code reality
3. **Reference templates** - link to specific apps/packages in your plans
4. **Link PRDs** - reference PRD docs when creating specs
5. **Update on completion** - move specs to `completed/` when feature ships

## Commands Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/brief` | 30-minute planning | 80% of features - quick start |
| `/specify` | Detailed specification | Complex features needing full SDD |
| `/plan` | Technical architecture | After `/specify` or `/research` |
| `/tasks` | Task breakdown | After `/plan` |
| `/implement` | Code generation | After `/tasks` |
| `/evolve` | Update specs | During development |
| `/upgrade` | Brief → Full SDD | When brief becomes complex |
| `/research` | Technology research | Before planning complex features |
| `/sdd-full-plan` | Full project roadmap | Entire applications or major systems |
| `/pecut-all-in-one` | All-in-one planning | Alternative to `/sdd-full-plan` |
| `/execute-task` | Execute roadmap task | From roadmap JSON structure |

## Advanced Features

### Full Project Planning

For entire applications or major systems:

```bash
/sdd-full-plan [project-id] [description]
```

Creates:
- Epic-level organization
- Task hierarchy (Epics → Tasks → Subtasks)
- Kanban board structure (roadmap.json)
- VSCode extension compatible format

See: `.sdd/ROADMAP_FORMAT_SPEC.md` for complete specification

### PLAN Mode Integration

All commands follow **plan-approve-execute** workflow:
1. Analysis (readonly exploration)
2. Present plan (what will be created/modified)
3. User approval
4. Execute with transparency

See: `.cursor/rules/sdd-system.mdc` for full details

## Integration Checklist

When using SDD commands:
- [ ] Review `docs-ai/business-context.md` to identify vertical
- [ ] Create PRD using `docs-ai/prd-template.md` (for complex features)
- [ ] Reference appropriate template/app in spec
- [ ] Include moon tasks in plans
- [ ] Link to `docs-ai/technical-guide.md` for implementation mapping
- [ ] Use `/evolve` to keep specs aligned during development

For more details, see:
- [spec-kit-command-cursor repository](https://github.com/madebyaris/spec-kit-command-cursor)
- `.cursor/rules/sdd-system.mdc` - System rules
- `.sdd/guidelines.md` - Monorepo-specific guidelines

