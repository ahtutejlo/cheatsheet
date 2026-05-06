---
ua_question: "Як тестувати Playwright проти preview deployments?"
en_question: "How to run Playwright against preview deployments?"
ua_answer: |
  **Сценарій:** ваш CI створює ефемерне середовище для кожного PR на унікальному URL (`pr-1234.preview.example.com`). Playwright suite має бігти проти цього URL і прикладати артефакти до PR comment.

  **Підхід:**
  1. Pass URL у Playwright через env var або config
  2. Wait until preview is healthy перед запуском тестів
  3. Налаштувати traces / screenshots для retain-on-failure
  4. Comment на PR з link на report

  **Рішення:**

  **Крок 1: дочекатися здорового preview deployment:**

  ```python
  # tests/e2e/conftest.py
  import pytest, os, requests, time

  BASE_URL = os.environ["PREVIEW_URL"]  # напр. https://pr-1234.preview.example.com

  @pytest.fixture(scope="session", autouse=True)
  def wait_for_healthy():
      """Cloud Run cold-start може бути 10-15 секунд."""
      deadline = time.time() + 120
      while time.time() < deadline:
          try:
              r = requests.get(f"{BASE_URL}/health", timeout=5)
              if r.status_code == 200 and r.json().get("ready"):
                  return
          except Exception:
              pass
          time.sleep(2)
      pytest.fail(f"Preview {BASE_URL} not healthy after 120s")
  ```

  **Крок 2: Playwright config з dynamic baseURL:**

  ```python
  # playwright.config.py (Python варіант) або conftest fixture
  import pytest
  from playwright.sync_api import sync_playwright

  @pytest.fixture(scope="session")
  def browser_context_args():
      return {
          "base_url": os.environ["PREVIEW_URL"],
          "ignore_https_errors": False,
          "viewport": {"width": 1280, "height": 720},
      }
  ```

  Або для TypeScript:
  ```typescript
  // playwright.config.ts
  export default defineConfig({
    use: {
      baseURL: process.env.PREVIEW_URL,
      trace: "retain-on-failure",
      screenshot: "only-on-failure",
      video: "retain-on-failure",
    },
    retries: process.env.CI ? 1 : 0,  // один retry на CI для cold-start mitigation
    workers: 4,
  });
  ```

  **Крок 3: GitHub Actions workflow:**

  ```yaml
  name: Preview E2E
  on:
    deployment_status:  # тригер після ефемерного deploy
  jobs:
    test:
      if: github.event.deployment_status.state == 'success'
      runs-on: ubuntu-latest
      env:
        PREVIEW_URL: ${{ github.event.deployment.payload.url }}
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-python@v5
          with: { python-version: "3.12" }
        - run: pip install -e ".[test]"
        - run: playwright install chromium
        - run: pytest tests/e2e/ -v --tracing=retain-on-failure
          continue-on-error: true
        - name: Upload artifacts to GCS
          run: |
            gsutil -m cp -r test-results gs://e2e-artifacts/$GITHUB_RUN_ID/
        - name: Comment on PR
          uses: actions/github-script@v7
          with:
            script: |
              const url = `https://storage.googleapis.com/e2e-artifacts/${process.env.GITHUB_RUN_ID}/index.html`;
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: `🎭 E2E results: [report](${url})`
              });
  ```

  **Крок 4: graceful degradation для preview-specific issues:**

  ```python
  # tests/e2e/test_critical_flow.py
  import pytest
  from playwright.sync_api import Page, expect

  @pytest.mark.preview_only  # marker — не бігти на staging
  def test_login_on_preview(page: Page):
      page.goto("/login")
      # Preview може мати warning banner про test data
      banner = page.locator(".preview-banner")
      if banner.is_visible():
          banner.locator(".dismiss").click()

      page.fill("[name=email]", "test@example.com")
      page.fill("[name=password]", "TestPass123!")
      page.click("button[type=submit]")
      expect(page).to_have_url("/dashboard")
  ```

  **Чого пильнувати:**
  - **DNS propagation** — DNS-record на `pr-1234.preview.example.com` може бути не доступний 10-30 сек після Cloud Run deploy. Wait healthcheck before test start.
  - **TLS certificate** — managed cert generated lazily, перші запити можуть дати certificate error. Cloud Run + Cloud DNS зазвичай ОК через kilkda хвилин, або використовуйте wildcard cert.
  - **Auth bootstrapping** — preview env часто має power-user креденшали як seed; не використовуйте production OAuth flows
  - **Test data isolation** — preview-env-specific data не повинна leakнути у naст. PR's preview
  - **Concurrent PR's** — два preview-envs стартують одночасно, кожен зі своїм URL. Тести не мають shared state між ними.

  **Метрика успіху:** preview-tests мають бути **green within 5 хв** від deploy completion. Все інше — debug priority.
en_answer: |
  **Scenario:** your CI spins up an ephemeral environment per PR at a unique URL (`pr-1234.preview.example.com`). The Playwright suite must run against that URL and attach artifacts to the PR comment.

  **Approach:**
  1. Pass the URL into Playwright via env var or config
  2. Wait until the preview is healthy before launching tests
  3. Configure traces / screenshots for retain-on-failure
  4. Comment on the PR with a report link

  **Solution:**

  **Step 1: wait for the preview to be healthy:**

  ```python
  # tests/e2e/conftest.py
  import pytest, os, requests, time

  BASE_URL = os.environ["PREVIEW_URL"]  # e.g. https://pr-1234.preview.example.com

  @pytest.fixture(scope="session", autouse=True)
  def wait_for_healthy():
      """Cloud Run cold-start can take 10-15 seconds."""
      deadline = time.time() + 120
      while time.time() < deadline:
          try:
              r = requests.get(f"{BASE_URL}/health", timeout=5)
              if r.status_code == 200 and r.json().get("ready"):
                  return
          except Exception:
              pass
          time.sleep(2)
      pytest.fail(f"Preview {BASE_URL} not healthy after 120s")
  ```

  **Step 2: Playwright config with dynamic baseURL:**

  ```python
  # Python version — conftest fixture
  import pytest
  from playwright.sync_api import sync_playwright

  @pytest.fixture(scope="session")
  def browser_context_args():
      return {
          "base_url": os.environ["PREVIEW_URL"],
          "ignore_https_errors": False,
          "viewport": {"width": 1280, "height": 720},
      }
  ```

  Or for TypeScript:
  ```typescript
  // playwright.config.ts
  export default defineConfig({
    use: {
      baseURL: process.env.PREVIEW_URL,
      trace: "retain-on-failure",
      screenshot: "only-on-failure",
      video: "retain-on-failure",
    },
    retries: process.env.CI ? 1 : 0,  // one retry on CI for cold-start mitigation
    workers: 4,
  });
  ```

  **Step 3: GitHub Actions workflow:**

  ```yaml
  name: Preview E2E
  on:
    deployment_status:  # trigger after ephemeral deploy
  jobs:
    test:
      if: github.event.deployment_status.state == 'success'
      runs-on: ubuntu-latest
      env:
        PREVIEW_URL: ${{ github.event.deployment.payload.url }}
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-python@v5
          with: { python-version: "3.12" }
        - run: pip install -e ".[test]"
        - run: playwright install chromium
        - run: pytest tests/e2e/ -v --tracing=retain-on-failure
          continue-on-error: true
        - name: Upload artifacts to GCS
          run: |
            gsutil -m cp -r test-results gs://e2e-artifacts/$GITHUB_RUN_ID/
        - name: Comment on PR
          uses: actions/github-script@v7
          with:
            script: |
              const url = `https://storage.googleapis.com/e2e-artifacts/${process.env.GITHUB_RUN_ID}/index.html`;
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: `🎭 E2E results: [report](${url})`
              });
  ```

  **Step 4: graceful degradation for preview-specific issues:**

  ```python
  # tests/e2e/test_critical_flow.py
  import pytest
  from playwright.sync_api import Page, expect

  @pytest.mark.preview_only  # marker — don't run against staging
  def test_login_on_preview(page: Page):
      page.goto("/login")
      # Preview may have a test-data warning banner
      banner = page.locator(".preview-banner")
      if banner.is_visible():
          banner.locator(".dismiss").click()

      page.fill("[name=email]", "test@example.com")
      page.fill("[name=password]", "TestPass123!")
      page.click("button[type=submit]")
      expect(page).to_have_url("/dashboard")
  ```

  **What to watch out for:**
  - **DNS propagation** — DNS records for `pr-1234.preview.example.com` may not resolve for 10-30 s after a Cloud Run deploy. Wait on health check before tests start.
  - **TLS certificate** — managed cert is generated lazily; first requests may hit cert errors. Cloud Run + Cloud DNS usually fine after a few minutes, or use a wildcard cert.
  - **Auth bootstrapping** — preview envs often seed power-user credentials; don't use production OAuth flows
  - **Test data isolation** — preview-specific data must not leak into the next PR's preview
  - **Concurrent PRs** — two preview envs start simultaneously, each with its own URL. Tests must not share state.

  **Success metric:** preview tests should be **green within 5 min** of deploy completion. Anything slower is a debug priority.
section: "playwright"
order: 42
tags: [playwright, preview-deployments, ci-cd, ephemeral-environments]
type: "practical"
---
