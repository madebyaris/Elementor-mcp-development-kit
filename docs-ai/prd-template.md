# Product Requirements Template

Use this structure when documenting features before triggering SDD `/specify` or VDD workflows.

## Metadata
- **Feature Name:**
- **Vertical / Business Area:** (refer to `docs-ai/business-context.md`)
- **Author & Date:**
- **Status:** Draft / In Review / Approved

## 1. Problem Statement
- Current pain points or gaps
- Target users / personas
- Business motivation (KPIs tied to success)

## 2. Outcomes & Metrics
- Primary success metrics (quantitative)
- Supporting qualitative signals (e.g., NPS, satisfaction)
- Guardrails (latency, error rate, compliance constraints)

## 3. User Journeys
- Happy path (step-by-step)
- Alternate paths / edge cases
- External system touchpoints

## 4. Requirements
- Functional requirements (numbered list)
- Non-functional requirements (performance, security, compliance)
- Content / localization needs

## 5. Dependencies & Assumptions
- Upstream/downstream services
- Data contracts or integrations
- Open questions (flag for resolution before build)

## 6. Acceptance Criteria
- Scenario-based criteria (Given / When / Then)
- Analytics or logging hooks required

## 7. Release Considerations
- Rollout strategy (beta, feature flag, phased release)
- Migration or data seeding tasks
- Support/operations handoff notes

> Store completed PRDs near the relevant app/template (e.g., `apps/<name>/docs/prd.md`) or under `specs/` alongside SDD outputs. Keep a copy linked from planning threads so AI agents can ingest the latest context.

