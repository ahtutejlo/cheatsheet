---
ua_question: "Semantic similarity vs exact match: коли і що використовувати?"
en_question: "Semantic similarity vs exact match: when to use which?"
ua_answer: |
  Це фундаментальне рішення архітектури LLM-тестів. Неправильний вибір призводить або до flaky тестів (false negatives), або до тестів, які пропускають реальні regressions (false positives).

  **Exact match** перевіряє: `actual == expected`. Жорсткий, deterministic, швидкий.

  **Підходить для:**
  - Structured output — JSON-fields, де keys і shape мають бути identical
  - Function/tool calls — які функції виклика модель і з якими аргументами
  - Constants and IDs — модель повертає reference codes / SKUs
  - Multi-class classification — output має бути один з відомих labels

  ```python
  # OK — structured output
  response = llm.complete(prompt, response_format="json")
  data = json.loads(response)
  assert data["status"] == "approved"
  assert data["amount"] == 100
  ```

  **Semantic similarity** обчислює embedding-based cosine similarity або використовує LLM-judge. Гнучкий, толерує лексичні варіації.

  **Підходить для:**
  - Free-form text — translations, summaries, explanations
  - Q&A — багато правильних формулювань відповіді
  - Creative output — стилі, описи, маркетингові копії

  ```python
  from sentence_transformers import SentenceTransformer, util

  embedder = SentenceTransformer("all-MiniLM-L6-v2")

  def assert_similar(actual, expected, threshold=0.85):
      score = util.cos_sim(
          embedder.encode(actual),
          embedder.encode(expected)
      ).item()
      assert score >= threshold, f"sim={score:.3f}, got: {actual}"
  ```

  **LLM-as-judge** — третій підхід, посередник:
  ```python
  def llm_judge(actual, expected, criterion):
      prompt = f"""You are a strict grader. Question: {criterion}
      Reference: {expected}
      Submission: {actual}
      Reply only with: PASS or FAIL."""
      verdict = judge_model.complete(prompt, temperature=0)
      assert "PASS" in verdict
  ```

  **Trade-offs (deep dive):**

  **Cost:**
  - Exact match — free
  - Embedding similarity — micro-cost (cached embedder в RAM)
  - LLM-judge — окремий API call за кожен test, $$

  **Reliability:**
  - Exact match — deterministic
  - Embedding similarity — стабільне (deterministic encoder), threshold tuneable
  - LLM-judge — flaky (judge сам non-deterministic), потребує consensus з кількох judges

  **Sensitivity to wording vs meaning:**
  - "Hello world" vs "Hi there" — exact: FAIL, semantic: PASS
  - "Tokyo is the capital" vs "Tokyo isn't the capital" — exact: FAIL (correctly), semantic: ⚠️ часто PASS (cosine ~0.9 — embedding "не помічає" заперечення)

  **Threshold calibration:**
  - 0.95+ — майже-exact (paraphrase tolerance only)
  - 0.85 — стандартний для translations/summaries
  - 0.70 — gist-level, для creative output
  - <0.70 — занадто м'яко, тести пропустять регресії

  **Гібридний підхід (рекомендований):**
  ```python
  def assert_response(actual, expected):
      # Layer 1: structural exact match
      assert actual["status"] in {"success", "partial"}

      # Layer 2: semantic match для free-text
      assert_similar(actual["explanation"], expected["explanation"], 0.85)

      # Layer 3: LLM judge на edge cases
      if "creative" in tags:
          llm_judge(actual["text"], criterion="grammatically correct, tone matches reference")
  ```

  **Підводні камені:**
  - **Negation blindness** embeddings — "X is good" і "X is not good" дають similarity ~0.9. Для critical assertions — explicit регекс на keywords ("not", "never", "no")
  - **Mismatched languages** — embedding моделі multilingual мають менш консистентні similarities
  - **Model drift** — оновлення judge model змінює baseline; pin version
en_answer: |
  This is a fundamental LLM-test architecture decision. The wrong choice yields either flaky tests (false negatives) or tests that miss real regressions (false positives).

  **Exact match** checks: `actual == expected`. Strict, deterministic, fast.

  **Use it for:**
  - Structured output — JSON fields whose keys and shape must be identical
  - Function/tool calls — which functions the model invoked and with what args
  - Constants and IDs — the model returns reference codes / SKUs
  - Multi-class classification — output must be one of known labels

  ```python
  # OK — structured output
  response = llm.complete(prompt, response_format="json")
  data = json.loads(response)
  assert data["status"] == "approved"
  assert data["amount"] == 100
  ```

  **Semantic similarity** computes embedding-based cosine similarity or uses an LLM judge. Flexible, tolerates lexical variation.

  **Use it for:**
  - Free-form text — translations, summaries, explanations
  - Q&A — many valid answer phrasings
  - Creative output — styles, descriptions, marketing copy

  ```python
  from sentence_transformers import SentenceTransformer, util

  embedder = SentenceTransformer("all-MiniLM-L6-v2")

  def assert_similar(actual, expected, threshold=0.85):
      score = util.cos_sim(
          embedder.encode(actual),
          embedder.encode(expected)
      ).item()
      assert score >= threshold, f"sim={score:.3f}, got: {actual}"
  ```

  **LLM-as-judge** is a third approach in between:
  ```python
  def llm_judge(actual, expected, criterion):
      prompt = f"""You are a strict grader. Question: {criterion}
      Reference: {expected}
      Submission: {actual}
      Reply only with: PASS or FAIL."""
      verdict = judge_model.complete(prompt, temperature=0)
      assert "PASS" in verdict
  ```

  **Trade-offs (deep dive):**

  **Cost:**
  - Exact match — free
  - Embedding similarity — micro-cost (cached encoder in RAM)
  - LLM-judge — separate API call per test, $$

  **Reliability:**
  - Exact match — deterministic
  - Embedding similarity — stable (deterministic encoder), tunable threshold
  - LLM-judge — flaky (judge itself is non-deterministic), needs consensus across multiple judges

  **Sensitivity to wording vs meaning:**
  - "Hello world" vs "Hi there" — exact: FAIL, semantic: PASS
  - "Tokyo is the capital" vs "Tokyo isn't the capital" — exact: FAIL (correctly), semantic: ⚠️ often PASS (cosine ~0.9 — embeddings "miss" negation)

  **Threshold calibration:**
  - 0.95+ — near-exact (paraphrase tolerance only)
  - 0.85 — standard for translations / summaries
  - 0.70 — gist level, for creative output
  - <0.70 — too lax, tests miss regressions

  **Hybrid approach (recommended):**
  ```python
  def assert_response(actual, expected):
      # Layer 1: structural exact match
      assert actual["status"] in {"success", "partial"}

      # Layer 2: semantic match for free-text
      assert_similar(actual["explanation"], expected["explanation"], 0.85)

      # Layer 3: LLM judge on edge cases
      if "creative" in tags:
          llm_judge(actual["text"], criterion="grammatically correct, tone matches reference")
  ```

  **Pitfalls:**
  - **Negation blindness** in embeddings — "X is good" and "X is not good" give similarity ~0.9. For critical assertions, add an explicit regex on keywords ("not", "never", "no")
  - **Mismatched languages** — multilingual embedding models have less consistent similarities
  - **Model drift** — updating the judge model shifts the baseline; pin its version
section: "llm-testing"
order: 3
tags: [llm, embeddings, similarity, evaluation]
type: "deep"
---
