# Zero One Group Monorepo

A unified foundation for building modern backend and frontend applications with TypeScript, Go, and Python.
Powered by [moonrepo](https://moonrepo.dev/docs/install), this monorepo offers curated templates,
shared UI libraries, and essential developer tools to accelerate development and foster best practices
across teams.

**Motivation:**
We built this monorepo to accelerate development, promote best practices, and simplify collaboration
across teams by providing ready-to-use templates, consistent tooling, and a scalable structure for all
Zero One Group projects.

## Quick Start

1. **Initialize new monorepo project:**
   `pnpm dlx moci init my-project`
2. **Generate the application from template:**
   `moon generate TEMPLATE_NAME`
3. **Configure the apps:**
   copy `.env.example` to `.env` and adjust as needed.
4. **Start development:**
   run all by running command `moon :dev` or `moon '#app:dev'`

## Templates

This monorepo includes a wide range of templates to help you start new projects quickly and consistently.
Templates are available for backend (Go, FastAPI), frontend (Astro, Next.js, React), and infrastructure
(Strapi, shared UI libraries).

Each template is designed to follow best practices and comes with pre-configured tooling, recommended
folder structures, and example code to get you up and running fast. You can generate new apps from these
templates using provided commands, and customize them to fit your needs.

For the full list of available templates, and usage instructions, please refer to the
[documentation](https://oss.zero-one-group.com/monorepo/available-templates/).

## Learn More

For complete guides and advanced usage, visit: 👉 [https://oss.zero-one-group.com/monorepo](https://oss.zero-one-group.com/monorepo)

## Contributions

Contributions are welcome! Please open a pull request or ticket for questions and improvements.

Read the full guidelines at: 👉 [https://oss.zero-one-group.com/monorepo/contribution-guidelines](https://oss.zero-one-group.com/monorepo/contribution-guidelines)

## AI-Assisted Development

This monorepo includes comprehensive AI documentation and Spec-Driven Development (SDD) workflows to help developers and AI agents work more effectively.

### Quick Start for AI Agents

- **`AGENTS.md`** - Start here! Concise briefing for AI assistants with key commands and guidelines.
- **`docs-ai/README.md`** - Detailed project guide with tooling, paths, and best practices.
- **`docs-ai/quick-reference.md`** - Command cheat sheet for daily operations.

### Spec-Driven Development (SDD)

This repository integrates the [spec-kit-command-cursor](https://github.com/madebyaris/spec-kit-command-cursor) toolkit for structured feature development.

**For Most Features (80%):**
```bash
/brief feature-name Description
```
Creates a lightweight 30-minute planning document to get started quickly.

**For Complex Features (20%):**
```bash
/research feature-name → /specify → /plan → /tasks → /implement
```
Full SDD 2.0 workflow for comprehensive planning.

**Documentation:**
- `docs-ai/sdd-workflow.md` - Complete SDD command reference
- `.cursor/rules/sdd-system.mdc` - SDD system rules and philosophy
- `.sdd/guidelines.md` - Monorepo-specific SDD guidelines

### Business Alignment & VDD

Integrate business requirements with technical implementation:

- **`docs-ai/business-context.md`** - Core verticals, business outcomes, and SDD/VDD alignment
- **`docs-ai/prd-template.md`** - Product Requirements Document template
- **`docs-ai/technical-guide.md`** - Technical implementation mapping guide

**Recommended Workflow:**
1. Review business context → Identify vertical
2. Create PRD (for complex features)
3. Use SDD commands (`/brief` or `/specify` → `/plan` → `/tasks`)
4. Reference technical guide during implementation

### Documentation Structure

```
docs-ai/
├── README.md              # Main AI guide
├── quick-reference.md     # Command cheat sheet
├── business-context.md    # Business verticals & alignment
├── prd-template.md        # PRD structure
├── technical-guide.md     # Technical implementation guide
└── sdd-workflow.md        # SDD commands & workflow
```

All AI documentation is designed to be token-efficient, allowing AI agents to understand the project structure without scanning the entire codebase.
