---
ua_question: "Як ефективно gateити merge через CI без false negatives?"
en_question: "How to gate merges via CI effectively without false negatives?"
ua_answer: |
  **Сценарій:** ваша команда має 200 інженерів, ~80 PR на день. Поточний CI:
  - Все що зелене на PR — `merge` дозволено
  - 30% PR проходять flaky тести з retry
  - Регресії проскакують в main; іноді performance дегрейдить тихо
  - Розробники втратили довіру до CI: "ну в нас завжди flake — натисни re-run"

  Завдання: побудувати CI gate, який ловить regressions, але не блокує merge через flake.

  **Підхід:**
  1. Розділити gate на **required** і **advisory** signals
  2. Required — те, що дешеве і deterministic
  3. Advisory — те, що медленне, дороге, або flaky-natured
  4. Performance і coverage — gating з порогами і бюджетом

  **Рішення — multi-tier gate:**

  **Tier 1 — REQUIRED (блокує merge):**
  - Lint, typecheck, unit tests (5-10 хв)
  - Smoke E2E (5 критичних user flows, 5 хв)
  - Security scan (Trivy, Snyk) — high/critical severity
  - Coverage **delta** (не absolute) — `новий код має ≥ 80% coverage` (CodeCov annotation)

  **Tier 2 — ADVISORY (warns, але не блокує):**
  - Full E2E suite (slow, sometimes flaky)
  - Performance regression tests (variance natural)
  - Visual regression
  - Eval harness для LLM-based features
  - Mutation testing

  **Tier 3 — POST-MERGE (на main):**
  - Long perf tests на production-sized data
  - Security deep scan
  - Compliance audits
  - Якщо ламаються — auto-revert або `git revert` PR-policy

  **Performance gating з бюджетом:**

  ```python
  # tests/perf/test_api_perf.py
  import pytest
  import statistics

  BASELINE = json.load(open("tests/perf/baseline.json"))  # від main branch
  TOLERANCE = 0.10  # 10% degradation allowed

  @pytest.mark.parametrize("endpoint,baseline_p95", BASELINE.items())
  def test_perf_no_regression(endpoint, baseline_p95):
      samples = [measure(endpoint) for _ in range(20)]
      current_p95 = statistics.quantiles(samples, n=20)[18]

      # Tolerate 10% slowdown, but block bigger
      assert current_p95 <= baseline_p95 * (1 + TOLERANCE), (
          f"{endpoint}: p95 {current_p95:.0f}ms > baseline {baseline_p95:.0f}ms × 1.10"
      )
  ```

  **Anti-flake protocol:**
  - **Required jobs не мають retry**. Якщо retry потрібен — це не required.
  - **Advisory jobs можуть мати 1 retry**. Дві спроби, відмітка "flaked".
  - **Quarantine list** для тестів з flake rate > 5% — не блокують merge, але видно у дашборді щодня.
  - **Top-flaky leaderboard** — тиждень в quarantine = ticket для команди-власника.

  **GitHub branch protection (приклад):**

  ```yaml
  # branch-protection.yml через GitHub API
  required_status_checks:
    strict: true
    contexts:
      - "lint"
      - "unit-tests"
      - "smoke-e2e"
      - "security-scan-critical"
      - "coverage-delta"
  required_pull_request_reviews:
    required_approving_review_count: 1
    dismiss_stale_reviews: true
  enforce_admins: false  # дозвільте hotfix у emergencies
  ```

  **Coverage delta gating** (не absolute):

  ```yaml
  # codecov.yml
  coverage:
    status:
      project:
        default:
          target: auto
          threshold: 0.5%  # допустиме скидання
      patch:
        default:
          target: 80%  # новий код має покриватись на 80%+
          threshold: 0%
  ```

  **Чому це працює:**
  1. Розробники бачать дешевий required gate — швидкий feedback
  2. Advisory не блокує, але видно — повільне погіршення помітно
  3. Quarantine виловлює flake без панічних retries
  4. Coverage gate на patch не дає писати "untested code" непомітно

  **Anti-patterns, яких уникати:**
  - Required gate з 30 jobs — 80% часу хоч щось flaky
  - Coverage absolute target ("100%") — пишуть тести-обгортки заради числа
  - Auto-merge на retry — приховує flake, регресії проскакують
  - "Заблокуємо все, що йде в main" — розробники йдуть в обхід (force push, admin override)

  **Метрики ефективності gate:**
  - **Defect escape rate** — bugs, що проскочили в main / total. Цільове <2%
  - **Mean time to merge** — час від ready to merged. Цільове <2h на робочий день
  - **Override rate** — як часто admin pushes minus checks. Цільове <1%
en_answer: |
  **Scenario:** your team has 200 engineers and ~80 PRs/day. Current CI:
  - Anything green on a PR allows `merge`
  - 30% of PRs pass flaky tests via retry
  - Regressions slip into main; performance degrades silently sometimes
  - Devs lost trust in CI: "we always have flake — just hit re-run"

  Task: build a CI gate that catches regressions without blocking merges on flake.

  **Approach:**
  1. Split the gate into **required** and **advisory** signals
  2. Required — cheap and deterministic
  3. Advisory — slow, expensive, or flake-prone
  4. Performance and coverage — gate with thresholds and budgets

  **Solution — multi-tier gate:**

  **Tier 1 — REQUIRED (blocks merge):**
  - Lint, typecheck, unit tests (5-10 min)
  - Smoke E2E (5 critical user flows, 5 min)
  - Security scan (Trivy, Snyk) — high/critical severity
  - Coverage **delta** (not absolute) — `new code has ≥ 80% coverage` (CodeCov annotation)

  **Tier 2 — ADVISORY (warns but doesn't block):**
  - Full E2E suite (slow, sometimes flaky)
  - Performance regression tests (natural variance)
  - Visual regression
  - Eval harness for LLM-based features
  - Mutation testing

  **Tier 3 — POST-MERGE (on main):**
  - Long perf tests on production-sized data
  - Deep security scans
  - Compliance audits
  - If they break — auto-revert or a `git revert` PR policy

  **Performance gating with a budget:**

  ```python
  # tests/perf/test_api_perf.py
  import pytest
  import statistics

  BASELINE = json.load(open("tests/perf/baseline.json"))  # from main
  TOLERANCE = 0.10  # 10% degradation allowed

  @pytest.mark.parametrize("endpoint,baseline_p95", BASELINE.items())
  def test_perf_no_regression(endpoint, baseline_p95):
      samples = [measure(endpoint) for _ in range(20)]
      current_p95 = statistics.quantiles(samples, n=20)[18]

      # Tolerate 10% slowdown, block bigger
      assert current_p95 <= baseline_p95 * (1 + TOLERANCE), (
          f"{endpoint}: p95 {current_p95:.0f}ms > baseline {baseline_p95:.0f}ms × 1.10"
      )
  ```

  **Anti-flake protocol:**
  - **Required jobs don't retry.** If a retry is needed — it isn't required.
  - **Advisory jobs may retry once.** Two attempts, marked "flaked".
  - **Quarantine list** for tests with >5% flake rate — they don't block merge but appear in the dashboard daily.
  - **Top-flaky leaderboard** — a week in quarantine = a ticket for the owning team.

  **GitHub branch protection (example):**

  ```yaml
  # branch-protection.yml via GitHub API
  required_status_checks:
    strict: true
    contexts:
      - "lint"
      - "unit-tests"
      - "smoke-e2e"
      - "security-scan-critical"
      - "coverage-delta"
  required_pull_request_reviews:
    required_approving_review_count: 1
    dismiss_stale_reviews: true
  enforce_admins: false  # allow hotfix in emergencies
  ```

  **Coverage delta gating** (not absolute):

  ```yaml
  # codecov.yml
  coverage:
    status:
      project:
        default:
          target: auto
          threshold: 0.5%  # allowed regression
      patch:
        default:
          target: 80%  # new code must hit 80%+
          threshold: 0%
  ```

  **Why this works:**
  1. Devs see a cheap required gate — fast feedback
  2. Advisory doesn't block but is visible — slow degradation is noticed
  3. Quarantine handles flake without panic retries
  4. Patch coverage gate prevents "untested code" from sneaking in

  **Anti-patterns to avoid:**
  - Required gate with 30 jobs — 80% of the time something flakes
  - Coverage absolute target ("100%") — wrapper-tests written just for the number
  - Auto-merge on retry — masks flake, regressions sneak through
  - "Block everything going to main" — devs go around it (force push, admin override)

  **Gate effectiveness metrics:**
  - **Defect escape rate** — bugs reaching main / total. Target <2%
  - **Mean time to merge** — time from ready to merged. Target <2h workday
  - **Override rate** — how often admin pushes bypass checks. Target <1%
section: "automation-qa"
order: 24
tags: [ci-cd, gating, flake-management, quality-gates]
type: "practical"
---
