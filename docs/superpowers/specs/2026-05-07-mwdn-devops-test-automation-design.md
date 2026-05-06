# MWDN DevOps & Test Automation — Topical Question Coverage

**Date:** 2026-05-07
**Source JD:** https://jobs.mwdn.com/careers/co/remote/73.A6A/devops-test-automation-engineer/all/
**Goal:** Fill all topical gaps on the cheatsheet site that match the MWDN Senior DevOps & Test Automation Engineer job description, in time for interview on 2026-05-08.

## Context

The MWDN role is a Senior DevOps & Test Automation Engineer (Python / GCP / Playwright stack) responsible for building end-to-end test infrastructure, CI/CD pipelines, ephemeral environments, test data management, observability, and performance/LLM testing.

The site already has solid coverage for Python (incl. pytest), Playwright, Docker, Kubernetes (overlaps with GKE), Performance Testing, Automation-QA fundamentals, SQL, and QA fundamentals. It does NOT cover GCP-specific cloud topics, MongoDB, observability/SRE, AI/LLM testing, or test infrastructure topics like ephemeral environments and test data masking.

The user requested topical-only additions (no MWDN company profile), bilingual UA + EN, with new sections for DevOps and LLM testing acceptable.

## Out of Scope

- Creating an MWDN company profile or company-questions (explicitly excluded by the user).
- Refactoring existing sections beyond adding new question files.
- Dedicated `security-testing` section (folded into `devops` as a single SOC2 question).
- Java content (Java is the existing section, but the role uses Python).

## Architecture

### New sections (3)

Each new section requires:
1. Entry in `src/i18n/sections.ts` with UA + EN `name`, `description`, `icon`.
2. Entry in `src/lib/colors.ts` `sectionColorMap` with `gradientFrom` / `gradientTo`.
3. Directory `src/content/questions/{slug}/` with markdown files following CONTENT_CONVENTIONS.md.

| Slug | UA name | EN name | Icon | Gradient |
|---|---|---|---|---|
| `devops` | DevOps | DevOps | ⚙️ | `#fef3c7` → `#fde68a` |
| `mongodb` | MongoDB | MongoDB | 🍃 | `#dcfce7` → `#86efac` |
| `llm-testing` | LLM Testing | LLM Testing | 🤖 | `#fae8ff` → `#e9d5ff` |

### Additions to existing sections

No structural changes — only new markdown files, with `order` continuing from the highest existing value in each section.

## Question Inventory

Total: 35 new questions. Type distribution: 23 basic, 4 deep, 3 trick, 5 practical.

### `devops` (12 new — orders 1–12)

| # | Slug | Type | Topic |
|---|---|---|---|
| 1 | `cloud-run-vs-gke.md` | basic | When to choose Cloud Run vs GKE |
| 2 | `gcp-iam-service-accounts.md` | basic | IAM roles, service accounts, workload identity |
| 3 | `gcp-load-balancing.md` | basic | L4 vs L7, global vs regional LBs |
| 4 | `github-actions-matrix-reusable.md` | basic | Matrix builds, reusable workflows, composite actions |
| 5 | `cloud-build-vs-github-actions.md` | basic | Trade-offs, when each fits |
| 6 | `iac-terraform-pulumi-ephemeral.md` | basic | IaC for ephemeral environments |
| 7 | `slo-sli-error-budgets.md` | basic | Reliability targets and budgets |
| 8 | `observability-three-pillars.md` | basic | Logs vs metrics vs traces |
| 9 | `prometheus-grafana-basics.md` | basic | Pull-based metrics, queries, dashboards |
| 10 | `reduce-ci-cost-gcp-scenario.md` | practical | Cutting CI cost on Cloud Build / GitHub runners |
| 11 | `debug-cloud-build-flake-scenario.md` | practical | Diagnosing flake that only repros in Cloud Build |
| 12 | `devops-is-just-cicd-trap.md` | trick | DevOps ≠ CI/CD, scope of the role |

### `mongodb` (7 new — orders 1–7)

| # | Slug | Type | Topic |
|---|---|---|---|
| 1 | `mongo-vs-postgres.md` | basic | Document vs relational trade-offs |
| 2 | `aggregation-pipeline.md` | basic | Stages, common operators |
| 3 | `mongo-indexes.md` | basic | Single-field, compound, text, TTL |
| 4 | `replica-sets-read-preference.md` | basic | Primary/secondary, write concern, read preference |
| 5 | `mongo-transactions.md` | deep | Multi-document transactions, snapshot isolation |
| 6 | `test-data-seeding-mongo.md` | practical | Seeding strategies for tests |
| 7 | `schemaless-no-validation-trap.md` | trick | JSON Schema validation, $jsonSchema |

### `llm-testing` (5 new — orders 1–5)

| # | Slug | Type | Topic |
|---|---|---|---|
| 1 | `how-to-test-llm-features.md` | basic | Strategy: deterministic, semantic, golden datasets |
| 2 | `eval-harnesses.md` | basic | promptfoo, deepeval, ragas |
| 3 | `semantic-vs-exact-match.md` | deep | Embedding similarity, LLM-as-judge |
| 4 | `detect-hallucinations-ci-scenario.md` | practical | Hallucination guards in CI |
| 5 | `llm-tests-must-be-deterministic-trap.md` | trick | Why temperature=0 isn't enough |

### `automation-qa` additions (5 new — orders continue from highest)

| Slug | Type | Topic |
|---|---|---|
| `ephemeral-test-environments.md` | basic | PR-scoped envs, preview deployments |
| `env-parity-test-prod.md` | basic | Production parity strategies |
| `test-data-masking.md` | practical | PII masking pipelines |
| `test-pipeline-observability.md` | basic | Flake rate, duration, ownership |
| `ci-gating-strategies-scenario.md` | practical | Coverage/perf gates without false negatives |

### `playwright` additions (2 new)

| Slug | Type | Topic |
|---|---|---|
| `playwright-on-cloud-run-scenario.md` | practical | Running Playwright on Cloud Run / Cloud Build |
| `preview-deployment-testing.md` | practical | Testing PR preview deploys |

### `performance-testing` additions (2 new)

| Slug | Type | Topic |
|---|---|---|
| `distributed-locust-gke-scenario.md` | practical | Distributed Locust on GKE |
| `load-test-llm-endpoints.md` | deep | Load testing LLM/AI endpoints |

### `python` additions (2 new)

| Slug | Type | Topic |
|---|---|---|
| `synthetic-data-faker-pydantic.md` | practical | Faker + Pydantic for typed test data |
| `large-dataset-test-generation.md` | practical | Generating large test datasets efficiently |

## Content Conventions

- All files follow `CONTENT_CONVENTIONS.md` and `AGENTS.md`.
- Both `ua_question`/`en_question` and `ua_answer`/`en_answer` are mandatory.
- Code blocks identical in both languages; explanations translated.
- Trick questions begin with `> **Trap:** ...`.
- Practical questions follow Scenario → Approach → Solution structure.
- 2–4 lowercase hyphenated tags per question.

## Validation

- `npm run build` must complete without Astro content-collection schema errors.
- Spot-check 1–2 questions per new section in `npm run preview`.

## Order Allocation

- New sections start at `order: 1` and increment by 1 per question (per existing convention for newer sections like Python/Playwright/PT).
- Additions to existing sections take the next available `order` after scanning the section's current files.

## Risk

- Tomorrow's interview deadline: prioritize finishing all 35 questions in a single pass, but if time pressed, the order of priority is: `devops` → `mongodb` → `automation-qa` additions → `llm-testing` → others.
