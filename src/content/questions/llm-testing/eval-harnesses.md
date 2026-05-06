---
ua_question: "Які є eval harnesses для LLM (promptfoo, deepeval, ragas)?"
en_question: "What eval harnesses exist for LLMs (promptfoo, deepeval, ragas)?"
ua_answer: |
  Eval harness — це фреймворк, який систематично проганяє LLM на dataset з input-cases і обчислює метрики. Без harness ви закінчуєте з ad-hoc Python скриптом, який неможливо повторити чи порівняти між версіями.

  **Три популярні OSS-варіанти:**

  **promptfoo** (Node.js / Python, YAML-конфіг)
  - Сильна сторона: A/B тести між промптами і моделями, side-by-side порівняння
  - Підтримує providers: OpenAI, Anthropic, Vertex AI, локальні моделі
  - Built-in assertions: `equals`, `contains`, `similar`, `llm-rubric`, `latency`
  - CLI запускається в CI; виводить HTML-репорт
  - Найкращий вибір, якщо хочете швидко iterate на промптах

  ```yaml
  # promptfooconfig.yaml
  providers:
    - openai:gpt-4o
    - anthropic:claude-sonnet-4
  prompts:
    - "Translate to {{language}}: {{text}}"
  tests:
    - vars: { text: "Hello", language: "French" }
      assert:
        - type: similar
          value: "Bonjour"
          threshold: 0.85
        - type: latency
          threshold: 2000
        - type: llm-rubric
          value: "Translation is grammatically correct"
  ```

  **deepeval** (Python, pytest-native)
  - Сильна сторона: інтегрується в pytest, як bibліотека асертів
  - 14+ метрик: `AnswerRelevancyMetric`, `FaithfulnessMetric`, `ToxicityMetric`, `BiasMetric`, `HallucinationMetric`
  - Працює з будь-якою моделлю (judge може бути gpt-4o, claude, gemini)
  - Confident AI як commercial backend для tracking trends

  ```python
  from deepeval import assert_test
  from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric
  from deepeval.test_case import LLMTestCase

  def test_rag_response():
      tc = LLMTestCase(
          input="What is MongoDB?",
          actual_output=rag_pipeline("What is MongoDB?"),
          retrieval_context=["MongoDB is a NoSQL document database..."]
      )
      assert_test(tc, [
          AnswerRelevancyMetric(threshold=0.7),
          FaithfulnessMetric(threshold=0.8)
      ])
  ```

  **ragas** (Python, RAG-specific)
  - Сильна сторона: чотири канонічні RAG-метрики
    - **Faithfulness** — чи всі факти response є в context
    - **Answer Relevancy** — чи response відповідає на question
    - **Context Precision** — чи retrieval повернув релевантні chunks першими
    - **Context Recall** — чи retrieval знайшов всі потрібні факти
  - Інтегрується з LangChain/LlamaIndex
  - Найкращий вибір, якщо у вас RAG, не просто chat

  ```python
  from ragas import evaluate
  from ragas.metrics import faithfulness, answer_relevancy
  from datasets import Dataset

  ds = Dataset.from_dict({
      "question": [...],
      "answer": [...],
      "contexts": [...],
      "ground_truth": [...],
  })
  result = evaluate(ds, metrics=[faithfulness, answer_relevancy])
  print(result)  # { faithfulness: 0.87, answer_relevancy: 0.91 }
  ```

  **Як обирати:**
  - **promptfoo** — швидке iteration, A/B compare, любите YAML
  - **deepeval** — pytest-світ, хочете в CI як звичайні asserts
  - **ragas** — у вас RAG-pipeline, треба специфічні RAG-метрики

  **Загальні tradeoffs:**
  - **Cost**: eval-runs палять токени швидко (LLM-as-judge — додатковий call). Sampling + кеш — обов'язкові.
  - **Determinism**: eval з temperature>0 дасть варіацію — зафіксуйте seed, де можливо, і робіть multiple runs з confidence intervals
  - **Drift**: GPT-4o "як модель" — це moving target. Використовуйте pinned model versions у CI.
en_answer: |
  An eval harness is a framework that systematically runs an LLM on a dataset of input cases and computes metrics. Without one you end up with ad-hoc Python scripts that can't be reproduced or compared between versions.

  **Three popular OSS options:**

  **promptfoo** (Node.js / Python, YAML config)
  - Strength: A/B tests between prompts and models, side-by-side comparison
  - Supports providers: OpenAI, Anthropic, Vertex AI, local models
  - Built-in assertions: `equals`, `contains`, `similar`, `llm-rubric`, `latency`
  - CLI runs in CI; outputs HTML reports
  - Best pick if you want to iterate on prompts fast

  ```yaml
  # promptfooconfig.yaml
  providers:
    - openai:gpt-4o
    - anthropic:claude-sonnet-4
  prompts:
    - "Translate to {{language}}: {{text}}"
  tests:
    - vars: { text: "Hello", language: "French" }
      assert:
        - type: similar
          value: "Bonjour"
          threshold: 0.85
        - type: latency
          threshold: 2000
        - type: llm-rubric
          value: "Translation is grammatically correct"
  ```

  **deepeval** (Python, pytest-native)
  - Strength: integrates with pytest as an assertion library
  - 14+ metrics: `AnswerRelevancyMetric`, `FaithfulnessMetric`, `ToxicityMetric`, `BiasMetric`, `HallucinationMetric`
  - Works with any model (judge can be gpt-4o, claude, gemini)
  - Confident AI as a commercial backend for trend tracking

  ```python
  from deepeval import assert_test
  from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric
  from deepeval.test_case import LLMTestCase

  def test_rag_response():
      tc = LLMTestCase(
          input="What is MongoDB?",
          actual_output=rag_pipeline("What is MongoDB?"),
          retrieval_context=["MongoDB is a NoSQL document database..."]
      )
      assert_test(tc, [
          AnswerRelevancyMetric(threshold=0.7),
          FaithfulnessMetric(threshold=0.8)
      ])
  ```

  **ragas** (Python, RAG-specific)
  - Strength: four canonical RAG metrics
    - **Faithfulness** — are all response facts present in context
    - **Answer Relevancy** — does the response answer the question
    - **Context Precision** — did retrieval return relevant chunks first
    - **Context Recall** — did retrieval find every needed fact
  - Integrates with LangChain / LlamaIndex
  - Best pick when you have RAG, not just chat

  ```python
  from ragas import evaluate
  from ragas.metrics import faithfulness, answer_relevancy
  from datasets import Dataset

  ds = Dataset.from_dict({
      "question": [...],
      "answer": [...],
      "contexts": [...],
      "ground_truth": [...],
  })
  result = evaluate(ds, metrics=[faithfulness, answer_relevancy])
  print(result)  # { faithfulness: 0.87, answer_relevancy: 0.91 }
  ```

  **How to choose:**
  - **promptfoo** — fast iteration, A/B compare, you like YAML
  - **deepeval** — pytest world, you want CI-style assertions
  - **ragas** — you have a RAG pipeline and need RAG-specific metrics

  **Common tradeoffs:**
  - **Cost**: eval runs burn tokens fast (LLM-as-judge adds another call). Sampling + caching are mandatory.
  - **Determinism**: eval with temperature>0 gives variance — pin a seed where possible and run multiple times with confidence intervals
  - **Drift**: "GPT-4o as a model" is a moving target. Use pinned model versions in CI.
section: "llm-testing"
order: 2
tags: [llm, evaluation, promptfoo, deepeval, ragas]
---
