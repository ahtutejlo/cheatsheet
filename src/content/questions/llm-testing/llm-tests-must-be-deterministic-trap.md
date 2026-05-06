---
ua_question: "LLM-тести мають бути детермінованими — temperature=0 вирішує?"
en_question: "LLM tests must be deterministic — does temperature=0 fix it?"
ua_answer: |
  > **Trap:** "Поставимо `temperature=0` і отримаємо deterministic output, можна писати exact-match assertions." Це найпопулярніша помилка serial — вона не вирішує проблему flaky LLM-тестів, а маскує її.

  **Чому temperature=0 не дає детермінізму:**

  1. **Sampling — не єдиний source of randomness.** Модель — це distributed system з GPU floating-point arithmetic. Дві inferences того ж prompt дають bit-rівно різні logits через non-associative floating-point operations. На token boundaries це може змінити вибір.

  2. **Provider-side load balancing.** OpenAI / Anthropic / Vertex AI керують fleet з GPUs різних поколінь. Запит маршрутизується на різні backends — output теж відрізняється.

  3. **Model versioning.** "gpt-4o" — alias, який мігрує між snapshot версіями. `gpt-4o-2024-08-06` — pinned, але вони deprecate і теж змінюються.

  4. **Tokenizer drift.** Оновлення токенайзера ламає cache, output може бути різний.

  5. **Prompt eval ordering.** Якщо `system message` приходить як один блок vs два блоки — навіть semantically той самий prompt — output відрізняється.

  **Що насправді треба:**

  **Прийняти non-determinism як data point**, не баг. Сучасні LLM-тести — це **statistical tests**, не deterministic asserts.

  ```python
  # Wrong (flaky):
  def test_translate_bad():
      assert llm.complete("Translate 'hello' to French", temperature=0) == "Bonjour"

  # Right (statistical):
  def test_translate_good():
      results = [
          llm.complete("Translate 'hello' to French", temperature=0)
          for _ in range(5)  # repeated samples
      ]
      # майже всі мають бути "Bonjour", "Salut" або "Allô"
      hit_rate = sum(
          util.cos_sim(embed(r), embed("Bonjour")).item() > 0.85
          for r in results
      ) / len(results)
      assert hit_rate >= 0.8, f"hit_rate={hit_rate}, samples={results}"
  ```

  **Стратегії боротьби з non-determinism:**

  **1. Pin model version і system context.** Регресії, де змінилася сама модель, мають бути explicit:
  ```python
  MODEL = "claude-sonnet-4-6-2026-03-15"  # pinned snapshot
  ```

  **2. Mock LLM client у unit tests.** Не пали токени на тестування detection логіки — мокайте response і тестуйте downstream код.
  ```python
  @patch("app.llm_client.complete", return_value="mocked response")
  def test_business_logic(mock_llm):
      result = process_query("anything")
      assert result.parsed_correctly
  ```

  **3. Real-LLM tests — окремі, marker'ом, у nightly не на PR.**
  ```python
  @pytest.mark.real_llm
  @pytest.mark.slow
  def test_against_real_model(): ...
  ```

  **4. Confidence intervals замість "passed/failed".** Прогнати golden set 3-5 разів, calculate mean і CI, alert якщо mean<threshold з 95% confidence.

  **5. Snapshot testing з manual review** для creative output. Промпт-вихід зберігається у файл; PR diff показує семантичні зміни — рев'юер approve'ить.

  **6. LLM-as-judge з consensus.** Один judge non-deterministic; три judges і majority vote зменшують flake.

  **Чого НЕ робити:**
  - **Не ховайте flake retry-ями.** `pytest --reruns 3` робить тести зеленими, але приховує real regressions.
  - **Не порівнюйте exact strings free-form виходу.** `assert response == "..."` — гарантоване страждання.
  - **Не ставте threshold 0.99+.** Embedding similarity має natural variance — тести треба будувати під реальність моделі.

  **Висновок:** detrminism у LLM-тестах — це fantasy. Краща модель — це **stability under sampling**: статистичний тест, який детектує regression, але не б'є на normal variation.
en_answer: |
  > **Trap:** "We'll set `temperature=0` and get deterministic output, then we can write exact-match assertions." This is the most popular serial misconception — it doesn't fix flaky LLM tests, it just masks them.

  **Why temperature=0 doesn't give determinism:**

  1. **Sampling isn't the only source of randomness.** A model is a distributed system with GPU floating-point arithmetic. Two inferences of the same prompt yield bit-different logits because of non-associative floating-point operations. At token boundaries this can flip a choice.

  2. **Provider-side load balancing.** OpenAI / Anthropic / Vertex AI manage fleets of GPUs from different generations. A request is routed to different backends — output differs too.

  3. **Model versioning.** "gpt-4o" is an alias that migrates across snapshot versions. `gpt-4o-2024-08-06` is pinned, but providers deprecate snapshots and the underlying model still drifts.

  4. **Tokenizer drift.** A tokenizer update breaks cache; output can differ.

  5. **Prompt eval ordering.** If `system message` arrives as one block vs two — even with the same content — output differs.

  **What you actually want:**

  **Accept non-determinism as a data point**, not a bug. Modern LLM tests are **statistical tests**, not deterministic asserts.

  ```python
  # Wrong (flaky):
  def test_translate_bad():
      assert llm.complete("Translate 'hello' to French", temperature=0) == "Bonjour"

  # Right (statistical):
  def test_translate_good():
      results = [
          llm.complete("Translate 'hello' to French", temperature=0)
          for _ in range(5)  # repeated samples
      ]
      # almost all should be "Bonjour", "Salut", or "Allô"
      hit_rate = sum(
          util.cos_sim(embed(r), embed("Bonjour")).item() > 0.85
          for r in results
      ) / len(results)
      assert hit_rate >= 0.8, f"hit_rate={hit_rate}, samples={results}"
  ```

  **Strategies for handling non-determinism:**

  **1. Pin model version and system context.** Regressions where the model itself changed must be explicit:
  ```python
  MODEL = "claude-sonnet-4-6-2026-03-15"  # pinned snapshot
  ```

  **2. Mock the LLM client in unit tests.** Don't burn tokens testing detection logic — mock the response and test downstream code.
  ```python
  @patch("app.llm_client.complete", return_value="mocked response")
  def test_business_logic(mock_llm):
      result = process_query("anything")
      assert result.parsed_correctly
  ```

  **3. Real-LLM tests — separate, marked, run nightly, not on PR.**
  ```python
  @pytest.mark.real_llm
  @pytest.mark.slow
  def test_against_real_model(): ...
  ```

  **4. Confidence intervals instead of "passed/failed".** Run the golden set 3-5 times, compute mean and CI, alert when mean < threshold with 95% confidence.

  **5. Snapshot testing with manual review** for creative output. The prompt output is saved to a file; the PR diff shows semantic changes — a reviewer approves.

  **6. LLM-as-judge with consensus.** One judge is non-deterministic; three judges and a majority vote reduce flake.

  **Don't:**
  - **Don't hide flake with retries.** `pytest --reruns 3` greens tests but masks real regressions.
  - **Don't compare exact strings of free-form output.** `assert response == "..."` is a guaranteed source of pain.
  - **Don't set thresholds at 0.99+.** Embedding similarity has natural variance — build tests around reality, not wishful thinking.

  **Bottom line:** determinism in LLM tests is fantasy. The better model is **stability under sampling**: a statistical test that detects regressions while ignoring normal variation.
section: "llm-testing"
order: 5
tags: [llm, determinism, flaky-tests, evaluation]
type: "trick"
---
