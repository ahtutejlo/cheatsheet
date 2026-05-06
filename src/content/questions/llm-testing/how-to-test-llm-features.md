---
ua_question: "Як тестувати фічі на базі LLM?"
en_question: "How do you test LLM-based features?"
ua_answer: |
  Тестування LLM-based систем фундаментально відрізняється від тестування deterministic коду. Та сама input може дати різний output навіть при `temperature=0`, відповіді semantically правильні але lexically різні, і "правильність" часто не bool, а scale.

  **Шари тестування — піраміда для LLM:**

  **1. Deterministic unit tests (швидкі, дешеві):**
  - Prompt template assembly — чи правильно interpolation, що нема leak секретів
  - Output parser — чи коректно вилучаєте JSON / structured output
  - Token counters, rate limiters, retry logic
  - Mock LLM client (response fixtures), щоб тестувати business логіку без реальних викликів

  **2. Golden dataset tests (середня швидкість):**
  - Curated input/expected-output пари
  - Прогон через реальну модель (або мок з deterministic mode)
  - **Semantic similarity** замість exact match (cosine similarity ≥ 0.85)

  **3. Behavioral / property tests:**
  - Inputs з invariantами: "summary не може бути довшим за input", "translation зберігає named entities"
  - Adversarial inputs: prompt injection, дуже довгі prompts, multilingual
  - Toxicity / safety guards — модель не видає harmful content

  **4. Eval harness runs (нічні):**
  - LLM-as-judge: інша модель оцінює якість відповіді (relevance, factuality, completeness)
  - RAG-specific: faithfulness, answer relevancy, context precision (ragas)
  - Hallucination detection: чи містить response факти, яких нема в context

  **5. Production monitoring як continuous testing:**
  - Sampling реальних запитів → eval harness
  - User feedback loops (👍/👎)
  - A/B tests з statistical significance

  ```python
  # pytest приклад: golden dataset з semantic match
  import pytest
  from sentence_transformers import SentenceTransformer, util

  embedder = SentenceTransformer("all-MiniLM-L6-v2")

  GOLDEN = [
      ("Translate to French: hello", "Bonjour"),
      ("Summarize: ML is...", "ML is a subset of AI"),
  ]

  @pytest.mark.parametrize("prompt,expected", GOLDEN)
  def test_llm_response_semantic(prompt, expected):
      response = llm.complete(prompt, temperature=0)
      similarity = util.cos_sim(
          embedder.encode(response),
          embedder.encode(expected)
      ).item()
      assert similarity >= 0.85, f"Got: {response}"
  ```

  **Важливі принципи:**
  - **Не намагайтеся зробити detected output exact-match** — це fragile і flaky
  - **Версіонуйте всі компоненти**: model name, prompt template, system message, RAG index — щоб знати, що саме змінилось при regression
  - **Регресійний baseline** — нова версія промпту має принаймні не погіршити score на golden set
  - **Cost і latency — теж quality metrics**: якщо v2 на 0.05 кращий, але в 3× довший, це не upgrade
en_answer: |
  Testing LLM-based systems is fundamentally different from testing deterministic code. The same input can produce different output even at `temperature=0`, semantically correct answers can be lexically very different, and "correctness" is often not boolean but a scale.

  **Layered testing — an LLM pyramid:**

  **1. Deterministic unit tests (fast, cheap):**
  - Prompt template assembly — correct interpolation, no secret leakage
  - Output parser — correct extraction of JSON / structured output
  - Token counters, rate limiters, retry logic
  - Mock LLM client (response fixtures) to test business logic without real calls

  **2. Golden-dataset tests (medium speed):**
  - Curated input/expected-output pairs
  - Run through the real model (or a mock with a deterministic mode)
  - **Semantic similarity** instead of exact match (cosine similarity ≥ 0.85)

  **3. Behavioral / property tests:**
  - Invariant inputs: "summary cannot exceed the input length", "translation preserves named entities"
  - Adversarial inputs: prompt injection, very long prompts, multilingual
  - Toxicity / safety guards — the model must not emit harmful content

  **4. Eval harness runs (nightly):**
  - LLM-as-judge: another model rates the response (relevance, factuality, completeness)
  - RAG-specific: faithfulness, answer relevancy, context precision (ragas)
  - Hallucination detection: does the response contain facts absent from context

  **5. Production monitoring as continuous testing:**
  - Sampling real requests → eval harness
  - User feedback loops (👍/👎)
  - A/B tests with statistical significance

  ```python
  # pytest example: golden dataset with semantic match
  import pytest
  from sentence_transformers import SentenceTransformer, util

  embedder = SentenceTransformer("all-MiniLM-L6-v2")

  GOLDEN = [
      ("Translate to French: hello", "Bonjour"),
      ("Summarize: ML is...", "ML is a subset of AI"),
  ]

  @pytest.mark.parametrize("prompt,expected", GOLDEN)
  def test_llm_response_semantic(prompt, expected):
      response = llm.complete(prompt, temperature=0)
      similarity = util.cos_sim(
          embedder.encode(response),
          embedder.encode(expected)
      ).item()
      assert similarity >= 0.85, f"Got: {response}"
  ```

  **Key principles:**
  - **Don't aim for exact-match assertions** — they're fragile and flaky
  - **Version every component**: model name, prompt template, system message, RAG index — so you know exactly what changed at regression
  - **Regression baseline** — a new prompt version must at least not degrade golden-set scores
  - **Cost and latency are quality metrics too**: if v2 is 0.05 better but 3× longer, it's not an upgrade
section: "llm-testing"
order: 1
tags: [llm, testing-strategy, evaluation]
---
