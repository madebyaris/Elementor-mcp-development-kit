# Business Context Guide

Use this note to align SDD (Spec-Driven Development) and emerging VDD (Vertical-Driven Development) workflows with the Zero One monorepo.

## Purpose
- Provide a shared vocabulary for business stakeholders, product teams, and AI agents.
- Map business requirements to the templates/apps available in this repository.
- Supply the background needed to draft PRDs and technical plans quickly.

## Core Verticals (current focus)
- **Knowledge Assistants for Content Teams** – MCP server (`apps/wp-mcp-server`) that turns WordPress into an AI-friendly knowledge base. Use cases: editorial research, publishing automation, multi-lingual summarization.
- **Infrastructure & Platform** – Docker Compose stacks (WordPress + MariaDB + phpMyAdmin), monitoring bundles, CI/CD templates. These provide the runtime foundation for the assistant.

> Historical templates (React, Go, FastAPI, Strapi) live under `templates/` if you need to resurrect them, but they are no longer part of the default workflow.

## Business Outcomes & Metrics
- **Acquisition** – conversion rate, qualified leads captured, SEO performance.
- **Engagement** – active users, session duration, journey completion.
- **Operational Efficiency** – SLA compliance, automation coverage, time-to-resolution.
- **Retention & Revenue** – repeat usage, NPS, subscription/transaction volume.

## Aligning SDD and VDD
1. **VDD Discovery (Business First)**
   - Capture the vertical, target personas, and desired outcomes.
   - Document current vs. future journey and critical business rules.
2. **SDD Specification (Product & UX)**
   - Convert vertical insights into PRD sections: problem statement, success metrics, journey steps, edge cases.
   - Identify which templates or packages best fit the workload.
3. **SDD Planning (Technical)**
   - Produce architecture and tasks referencing moon tasks, templates, and shared UI components.
4. **Execution & Continuous Alignment**
   - Keep PRD/tech guides alongside code (see `docs-ai/prd-template.md`, `docs-ai/technical-guide.md`).
   - Update documentation when business rules or vertical assumptions change.

## Artifacts
- **PRD** – use `docs-ai/prd-template.md` to capture product perspective.
- **Technical Implementation Guide** – follow `docs-ai/technical-guide.md` to map requirements into code.
- **Feature Briefs / Specs** – store SDD outputs under `specs/` (if using the spec-kit workflow).

Keep this guide concise; expand vertical-specific playbooks in separate files only when necessary.

