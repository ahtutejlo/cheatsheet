# Phase 5: Content Generation - Research

**Researched:** 2026-03-21
**Domain:** Bilingual Markdown content creation for Astro content collections
**Confidence:** HIGH

## Summary

Phase 5 is a pure content generation phase -- no code changes required. The infrastructure (schema with `type` field, TypeBadge component, grouping UI) was completed in Phase 4. This phase creates 90 new Markdown files (15 per section x 6 sections) following established conventions in CONTENT_CONVENTIONS.md.

The work is structurally identical across all 6 sections: for each section, create 5 deep-technical, 5 trick, and 5 practical questions as bilingual UA/EN Markdown files with correct frontmatter. The primary risk is YAML formatting errors, order number collisions, or inconsistent content quality across the 90 files.

**Primary recommendation:** Batch content creation by section (one plan per section or grouped in waves), validate each batch with `astro build` before proceeding to next, and use the established conventions document as a strict template.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-01 | 5 deep technical questions for Automation QA (bilingual UA/EN) | File format, order 16-20, type: deep, CONTENT_CONVENTIONS.md patterns |
| CONT-02 | 5 trick questions for Automation QA (bilingual UA/EN) | Order 21-25, type: trick, "Trap:" callout pattern |
| CONT-03 | 5 practical scenarios for Automation QA (bilingual UA/EN) | Order 26-30, type: practical, Scenario/Approach/Solution structure |
| CONT-04 | 5 deep technical questions for Java (bilingual UA/EN) | Same patterns as CONT-01 |
| CONT-05 | 5 trick questions for Java (bilingual UA/EN) | Same patterns as CONT-02 |
| CONT-06 | 5 practical scenarios for Java (bilingual UA/EN) | Same patterns as CONT-03 |
| CONT-07 | 5 deep technical questions for Kubernetes (bilingual UA/EN) | Same patterns as CONT-01 |
| CONT-08 | 5 trick questions for Kubernetes (bilingual UA/EN) | Same patterns as CONT-02 |
| CONT-09 | 5 practical scenarios for Kubernetes (bilingual UA/EN) | Same patterns as CONT-03 |
| CONT-10 | 5 deep technical questions for Blockchain (bilingual UA/EN) | Same patterns as CONT-01 |
| CONT-11 | 5 trick questions for Blockchain (bilingual UA/EN) | Same patterns as CONT-02 |
| CONT-12 | 5 practical scenarios for Blockchain (bilingual UA/EN) | Same patterns as CONT-03 |
| CONT-13 | 5 deep technical questions for Docker (bilingual UA/EN) | Same patterns as CONT-01 |
| CONT-14 | 5 trick questions for Docker (bilingual UA/EN) | Same patterns as CONT-02 |
| CONT-15 | 5 practical scenarios for Docker (bilingual UA/EN) | Same patterns as CONT-03 |
| CONT-16 | 5 deep technical questions for SQL (bilingual UA/EN) | Same patterns as CONT-01 |
| CONT-17 | 5 trick questions for SQL (bilingual UA/EN) | Same patterns as CONT-02 |
| CONT-18 | 5 practical scenarios for SQL (bilingual UA/EN) | Same patterns as CONT-03 |
</phase_requirements>

## Standard Stack

No new libraries or dependencies needed. This phase creates content files only.

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Astro Content Collections | 6.0.7 | Validates frontmatter schema via Zod | Already configured in `src/content.config.ts` |
| Markdown | N/A | Content format | All questions are `.md` files with YAML frontmatter |

### Verification
| Tool | Purpose | Command |
|------|---------|---------|
| `astro build` | Validates all content files parse correctly | `pnpm build` |

## Architecture Patterns

### Content File Structure
```
src/content/questions/
├── automation-qa/     # 15 existing (basic) + 15 new (5 deep + 5 trick + 5 practical)
├── blockchain/        # 15 existing (basic) + 15 new
├── docker/            # 15 existing (basic) + 15 new
├── java/              # 15 existing (basic) + 15 new
├── kubernetes/        # 15 existing (basic) + 15 new
└── sql/               # 15 existing (basic) + 15 new
```

### Pattern 1: Deep Technical Question File
**What:** A question probing internal mechanics, edge cases, or architecture
**When to use:** CONT-01, CONT-04, CONT-07, CONT-10, CONT-13, CONT-16
**Template:**
```yaml
---
ua_question: "..."
en_question: "..."
ua_answer: |
  [Core concept - 1 paragraph]

  [Implementation details / internal mechanics - 1-2 paragraphs]

  ```language
  // Code showing internal mechanism or advanced usage
  ```

  [Why it matters for interviews]
en_answer: |
  [Same structure in English, identical code blocks]
section: "section-slug"
order: N  # 16-20
tags: [tag1, tag2]
type: "deep"
---
```

### Pattern 2: Trick Question File
**What:** A question with a common wrong answer or widespread misconception
**When to use:** CONT-02, CONT-05, CONT-08, CONT-11, CONT-14, CONT-17
**Template:**
```yaml
---
ua_question: "..."
en_question: "..."
ua_answer: |
  > **Trap:** {common misconception or wrong answer in Ukrainian}

  [Correct answer - 1-2 paragraphs]

  ```language
  // Code demonstrating trap vs correct behavior
  ```

  [Why this misconception is common]
en_answer: |
  > **Trap:** {common misconception or wrong answer in English}

  [Same structure in English, identical code blocks]
section: "section-slug"
order: N  # 21-25
tags: [tag1, tag2]
type: "trick"
---
```

### Pattern 3: Practical Scenario Question File
**What:** A real-world problem-solving question with situation and solution
**When to use:** CONT-03, CONT-06, CONT-09, CONT-12, CONT-15, CONT-18
**Template:**
```yaml
---
ua_question: "..."
en_question: "..."
ua_answer: |
  **Scenario:** [realistic situation description]

  **Approach:**
  1. [step 1]
  2. [step 2]
  3. [step 3]

  **Solution:**
  ```language
  // Concrete code or configuration
  ```
en_answer: |
  **Scenario:** [same in English]

  **Approach:**
  1. [step 1]
  2. [step 2]
  3. [step 3]

  **Solution:**
  ```language
  // Same code
  ```
section: "section-slug"
order: N  # 26-30
tags: [tag1, tag2]
type: "practical"
---
```

### Order Number Allocation

Each section currently uses orders 1-15. New questions MUST follow this scheme:

| Type | Order Range | Count |
|------|-------------|-------|
| deep | 16-20 | 5 per section |
| trick | 21-25 | 5 per section |
| practical | 26-30 | 5 per section |

### File Naming Convention
- kebab-case reflecting the question topic
- Prefix or suffix can hint at type for author convenience but is not required
- Examples: `jvm-memory-model-internals.md`, `docker-stop-sigkill-trap.md`, `debug-memory-leak-scenario.md`

### Anti-Patterns to Avoid
- **Translating code:** Code blocks must be identical in UA and EN versions. Do not translate variable names, comments, or class names.
- **Shallow answers:** Each answer should be 3-6 paragraphs with code. Deep questions especially need substance.
- **Missing Trap callout:** Every trick question MUST start with `> **Trap:** ...` blockquote. This is rendered by the UI.
- **Missing Scenario/Approach/Solution structure:** Practical questions MUST use all three sections.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Content validation | Custom YAML validator | `astro build` (Zod schema) | Schema in content.config.ts already validates all fields |
| Order uniqueness check | Custom script | Manual allocation per convention | Fixed ranges (16-20, 21-25, 26-30) make collisions impossible if followed |
| Bilingual consistency | Diff tooling | Author discipline + review | Content is created in pairs by the same author |

## Common Pitfalls

### Pitfall 1: YAML Multiline Scalar Formatting
**What goes wrong:** YAML parsing fails because of incorrect indentation in `ua_answer` or `en_answer` block scalars.
**Why it happens:** The `|` (literal block scalar) requires consistent indentation. Code blocks inside need extra care.
**How to avoid:** Always use `|` (not `>` or bare strings) for answer fields. Indent all content by exactly 2 spaces from the field name. Never use tabs.
**Warning signs:** `astro build` fails with YAML parse errors.

### Pitfall 2: Order Number Collisions
**What goes wrong:** Two questions in the same section have the same `order` value, causing unpredictable display order.
**Why it happens:** Not following the allocation convention.
**How to avoid:** deep=16-20, trick=21-25, practical=26-30. Within each range, assign sequentially (e.g., first deep question = 16, second = 17, etc.).
**Warning signs:** Questions appear in wrong order on section page.

### Pitfall 3: Section Field Mismatch
**What goes wrong:** File is in `src/content/questions/java/` but frontmatter says `section: "automation-qa"`. While Astro may not error, the question won't display in the correct section.
**Why it happens:** Copy-paste between sections without updating the `section` field.
**How to avoid:** Always verify `section` matches the directory name.
**Warning signs:** Question count per section doesn't match expected (30).

### Pitfall 4: Inconsistent Bilingual Quality
**What goes wrong:** Ukrainian version is a poor transliteration rather than natural Ukrainian phrasing.
**Why it happens:** Translating word-for-word from English.
**How to avoid:** Write Ukrainian text with natural phrasing. Technical terms (Docker, JVM, SQL) stay in English. Explanations use proper Ukrainian.
**Warning signs:** Reading the UA version feels unnatural.

### Pitfall 5: Missing Type Field
**What goes wrong:** New questions default to `type: "basic"` instead of their intended type, appearing in the wrong group on the section page.
**Why it happens:** Forgetting to add the `type` field (it defaults to "basic").
**How to avoid:** Every new file MUST explicitly set `type: "deep"`, `type: "trick"`, or `type: "practical"`.
**Warning signs:** Questions show up under "Basic" heading instead of their intended group.

### Pitfall 6: Special Characters in YAML Strings
**What goes wrong:** Question strings containing colons, quotes, or other YAML special characters cause parse errors.
**Why it happens:** YAML interprets `:` as key-value separator, unescaped quotes break strings.
**How to avoid:** Always wrap `ua_question` and `en_question` values in double quotes. If the question itself contains double quotes, escape them with `\"`.
**Warning signs:** `astro build` fails with "bad indentation" or "unexpected token" errors.

## Code Examples

### Complete Deep Question Example (Java)
```yaml
---
ua_question: "Як працює модель пам'яті Java (JMM) і що таке happens-before?"
en_question: "How does the Java Memory Model (JMM) work and what is happens-before?"
ua_answer: |
  Java Memory Model (JMM) визначає правила видимості змін між потоками. Без JMM компілятор та процесор можуть переупорядковувати інструкції, що призводить до несподіваних результатів у багатопотокових програмах.

  **Happens-before** -- це гарантія, що запис у змінну в одному потоці буде видимий іншому потоку. Основні правила:
  - Запис у `volatile` змінну happens-before читання цієї змінної
  - Вихід із `synchronized` блоку happens-before входу в блок на тому ж моніторі
  - `Thread.start()` happens-before будь-якої дії в запущеному потоці

  ```java
  class SharedState {
      private volatile boolean ready = false;
      private int value = 0;

      // Thread 1
      void writer() {
          value = 42;          // (1)
          ready = true;        // (2) volatile write
      }

      // Thread 2
      void reader() {
          if (ready) {         // (3) volatile read
              // value guaranteed to be 42 here
              // because (2) happens-before (3)
              // and (1) happens-before (2)
              System.out.println(value);
          }
      }
  }
  ```

  Розуміння JMM критичне для написання коректного багатопотокового коду без data races.
en_answer: |
  Java Memory Model (JMM) defines rules for visibility of changes between threads. Without JMM, the compiler and processor can reorder instructions, leading to unexpected results in multithreaded programs.

  **Happens-before** is a guarantee that a write to a variable in one thread will be visible to another thread. Key rules:
  - Writing to a `volatile` variable happens-before reading that variable
  - Exiting a `synchronized` block happens-before entering a block on the same monitor
  - `Thread.start()` happens-before any action in the started thread

  ```java
  class SharedState {
      private volatile boolean ready = false;
      private int value = 0;

      // Thread 1
      void writer() {
          value = 42;          // (1)
          ready = true;        // (2) volatile write
      }

      // Thread 2
      void reader() {
          if (ready) {         // (3) volatile read
              // value guaranteed to be 42 here
              // because (2) happens-before (3)
              // and (1) happens-before (2)
              System.out.println(value);
          }
      }
  }
  ```

  Understanding JMM is critical for writing correct multithreaded code without data races.
section: "java"
order: 16
tags:
  - concurrency
  - jvm
  - memory-model
type: "deep"
---
```

### Complete Trick Question Example (Docker)
```yaml
---
ua_question: "Чи надсилає docker stop сигнал SIGKILL контейнеру?"
en_question: "Does docker stop send SIGKILL to the container?"
ua_answer: |
  > **Trap:** Багато хто вважає, що `docker stop` одразу вбиває контейнер сигналом SIGKILL. Насправді спочатку надсилається SIGTERM.

  `docker stop` працює у два етапи:
  1. Надсилає **SIGTERM** процесу PID 1 у контейнері
  2. Чекає grace period (за замовчуванням 10 секунд)
  3. Якщо процес не завершився -- надсилає **SIGKILL**

  ```bash
  # SIGTERM з 10-секундним grace period (default)
  docker stop mycontainer

  # SIGTERM з 30-секундним grace period
  docker stop -t 30 mycontainer

  # Негайний SIGKILL (без SIGTERM)
  docker kill mycontainer
  ```

  Це важливо, бо додаток повинен обробляти SIGTERM для graceful shutdown -- закривати з'єднання, зберігати стан, завершувати транзакції.
en_answer: |
  > **Trap:** Many people assume `docker stop` immediately kills the container with SIGKILL. In reality, it first sends SIGTERM.

  `docker stop` works in two stages:
  1. Sends **SIGTERM** to PID 1 process in the container
  2. Waits for a grace period (10 seconds by default)
  3. If the process hasn't exited -- sends **SIGKILL**

  ```bash
  # SIGTERM with 10-second grace period (default)
  docker stop mycontainer

  # SIGTERM with 30-second grace period
  docker stop -t 30 mycontainer

  # Immediate SIGKILL (no SIGTERM)
  docker kill mycontainer
  ```

  This matters because the application should handle SIGTERM for graceful shutdown -- closing connections, saving state, completing transactions.
section: "docker"
order: 21
tags:
  - lifecycle
  - signals
type: "trick"
---
```

### Complete Practical Question Example (SQL)
```yaml
---
ua_question: "Як оптимізувати повільний SQL-запит, який використовує JOIN на великих таблицях?"
en_question: "How would you optimize a slow SQL query that uses JOIN on large tables?"
ua_answer: |
  **Scenario:** Продакшн-запит з JOIN двох таблиць (orders: 10M рядків, customers: 1M рядків) виконується більше 30 секунд. Бізнес скаржиться на повільність звітів.

  **Approach:**
  1. Виконати EXPLAIN ANALYZE для розуміння плану виконання
  2. Додати відсутні індекси на колонки JOIN та WHERE
  3. Розглянути денормалізацію або матеріалізовані представлення для часто використовуваних звітів

  **Solution:**
  ```sql
  -- 1. Аналіз плану виконання
  EXPLAIN ANALYZE
  SELECT c.name, COUNT(o.id), SUM(o.total)
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE o.created_at >= '2025-01-01'
  GROUP BY c.name;

  -- 2. Створення складеного індексу
  CREATE INDEX idx_orders_customer_date
  ON orders (customer_id, created_at)
  INCLUDE (total);

  -- 3. Матеріалізоване представлення для звітів
  CREATE MATERIALIZED VIEW monthly_customer_stats AS
  SELECT c.id, c.name, COUNT(o.id) as order_count, SUM(o.total) as total_spent
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  GROUP BY c.id, c.name;
  ```
en_answer: |
  **Scenario:** A production query joining two tables (orders: 10M rows, customers: 1M rows) takes over 30 seconds. Business is complaining about slow reports.

  **Approach:**
  1. Run EXPLAIN ANALYZE to understand the execution plan
  2. Add missing indexes on JOIN and WHERE columns
  3. Consider denormalization or materialized views for frequently used reports

  **Solution:**
  ```sql
  -- 1. Analyze execution plan
  EXPLAIN ANALYZE
  SELECT c.name, COUNT(o.id), SUM(o.total)
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE o.created_at >= '2025-01-01'
  GROUP BY c.name;

  -- 2. Create composite index
  CREATE INDEX idx_orders_customer_date
  ON orders (customer_id, created_at)
  INCLUDE (total);

  -- 3. Materialized view for reports
  CREATE MATERIALIZED VIEW monthly_customer_stats AS
  SELECT c.id, c.name, COUNT(o.id) as order_count, SUM(o.total) as total_spent
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  GROUP BY c.id, c.name;
  ```
section: "sql"
order: 26
tags:
  - optimization
  - indexes
  - joins
type: "practical"
---
```

## Section-Specific Topic Guidance

To avoid overlap with existing basic questions and ensure advanced-level content, here are recommended topic areas per section.

### Automation QA (existing: selenium, page-object, bdd, waits, ci-cd, etc.)
- **Deep:** Flaky test root causes, test architecture at scale, parallel execution internals, custom wait strategies, API testing authentication flows
- **Trick:** Implicit vs explicit waits interaction, StaleElementReferenceException causes, headless vs headed behavior differences, assertion anti-patterns, test isolation misconceptions
- **Practical:** Debug intermittent test failure, migrate test suite to new framework, set up cross-browser testing pipeline, handle dynamic content testing, design data-driven test architecture

### Java (existing: OOP, collections, JVM, streams, generics, etc.)
- **Deep:** JMM and happens-before, ConcurrentHashMap internals, class loading mechanism, JIT compilation, String interning details
- **Trick:** Integer caching (-128 to 127), autoboxing in equals, finally block with return, checked vs unchecked exception confusion, immutable String misconceptions
- **Practical:** Debug memory leak, implement thread-safe cache, optimize GC for low-latency app, design plugin system with class loaders, handle distributed transactions

### Kubernetes (existing: pods, services, deployments, helm, RBAC, etc.)
- **Deep:** Pod scheduling algorithm, etcd consistency model, CNI plugin internals, controller reconciliation loop, CRD operator pattern
- **Trick:** Service vs Ingress confusion, PVC access modes, resource limits vs requests, rolling update zero-downtime requirements, ConfigMap hot-reload limitations
- **Practical:** Debug CrashLoopBackOff, implement blue-green deployment, set up horizontal pod autoscaler, migrate stateful app to K8s, design multi-tenant namespace strategy

### Blockchain (existing: consensus, smart contracts, Solidity, DeFi, etc.)
- **Deep:** EVM execution model, Merkle Patricia Trie internals, transaction lifecycle in Ethereum, storage layout in Solidity, cross-chain bridge mechanisms
- **Trick:** tx.origin vs msg.sender security, integer overflow in older Solidity, reentrancy attack pattern, gas estimation misconceptions, immutability vs upgradeability confusion
- **Practical:** Implement upgradeable contract pattern, audit smart contract for vulnerabilities, optimize gas usage, design token vesting schedule, handle front-running protection

### Docker (existing: images, volumes, networking, compose, security, etc.)
- **Deep:** Union filesystem and copy-on-write, cgroup resource isolation, container networking namespaces, image layer caching algorithm, BuildKit parallel builds
- **Trick:** COPY vs ADD behavior, ENTRYPOINT vs CMD interaction, docker stop signal handling, volume mount permissions, .dockerignore vs .gitignore differences
- **Practical:** Reduce Docker image size by 80%, debug container network connectivity, set up multi-stage build for Java app, implement health checks with dependencies, design logging strategy for microservices

### SQL (existing: joins, indexes, subqueries, window functions, normalization, etc.)
- **Deep:** B-tree index internals, MVCC and transaction isolation implementation, query optimizer cost estimation, WAL and crash recovery, lock escalation mechanics
- **Trick:** NULL in comparisons and aggregations, GROUP BY with non-aggregated columns, BETWEEN with dates (inclusive boundaries), correlated subquery vs JOIN performance assumptions, DISTINCT vs GROUP BY equivalence
- **Practical:** Optimize slow JOIN query, design schema for audit logging, implement soft delete with referential integrity, handle concurrent updates without deadlocks, migrate schema with zero downtime

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Astro build (Zod schema validation) |
| Config file | `src/content.config.ts` |
| Quick run command | `pnpm build 2>&1 \| head -50` |
| Full suite command | `pnpm build` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-01 to CONT-18 | All 90 new .md files parse with valid frontmatter | build validation | `pnpm build` | N/A (build-time) |
| CONT-01 to CONT-18 | Each section has exactly 30 questions (15 basic + 15 new) | smoke check | `ls src/content/questions/{section}/ \| wc -l` (expect 30) | N/A |
| CONT-02,05,08,11,14,17 | Trick questions contain "Trap:" callout | content check | `grep -L "Trap:" src/content/questions/{section}/*.md` filtered by type:trick | N/A |

### Sampling Rate
- **Per task commit:** `pnpm build` (validates all content parses)
- **Per wave merge:** `pnpm build` + manual spot-check of rendered pages
- **Phase gate:** Full `pnpm build` green + file count verification (30 per section, 195 total)

### Wave 0 Gaps
None -- existing build infrastructure covers all phase requirements. No additional test framework needed. The Zod schema in `content.config.ts` validates all required fields at build time.

## Sources

### Primary (HIGH confidence)
- `src/content.config.ts` -- Zod schema defining all required/optional fields and valid type enum
- `CONTENT_CONVENTIONS.md` -- Authoritative content creation guide (created in Phase 4)
- Existing question files (90 files across 7 sections) -- established format and patterns

### Secondary (HIGH confidence)
- `.planning/REQUIREMENTS.md` -- Phase 5 requirement definitions (CONT-01 through CONT-18)
- `.planning/STATE.md` -- Project decisions and current state

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, pure content creation
- Architecture: HIGH - patterns fully documented in CONTENT_CONVENTIONS.md, verified against existing files
- Pitfalls: HIGH - based on direct examination of YAML frontmatter format and Astro build requirements

**Research date:** 2026-03-21
**Valid until:** Indefinite - content format is stable, no external dependencies to change
