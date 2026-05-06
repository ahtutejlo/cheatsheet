---
ua_question: "Як ловити hallucinations у CI?"
en_question: "How to catch hallucinations in CI?"
ua_answer: |
  **Сценарій:** ви будуєте RAG-чат для довідкової бази SaaS-продукту. Користувачі скаржаться: модель іноді з впевненістю вигадує API-endpoints або pricing tiers, яких не існує. Звичайні unit-tests цього не ловлять — відповіді граматично правильні і semantically схожі на правду.

  **Підхід:**
  1. Визначити "hallucination" як "факт у відповіді, якого нема у retrieved context"
  2. Побудувати automated faithfulness check
  3. Запускати на golden dataset як CI gate; sampling реальних запитів — як continuous monitor

  **Рішення:**

  **Крок 1: Faithfulness metric з ragas:**

  ```python
  # tests/test_rag_faithfulness.py
  from ragas import evaluate
  from ragas.metrics import faithfulness, context_precision
  from datasets import Dataset
  import pytest, json

  with open("tests/golden_rag.json") as f:
      golden = json.load(f)

  def run_pipeline(question):
      contexts = vector_store.search(question, k=5)
      response = llm.complete(make_prompt(question, contexts), temperature=0)
      return response, [c.text for c in contexts]

  def test_rag_faithfulness():
      cases = []
      for item in golden:
          response, contexts = run_pipeline(item["question"])
          cases.append({
              "question": item["question"],
              "answer": response,
              "contexts": contexts,
              "ground_truth": item["expected_answer"],
          })
      ds = Dataset.from_list(cases)

      result = evaluate(ds, metrics=[faithfulness, context_precision])

      # Hard threshold
      assert result["faithfulness"] >= 0.85, f"hallucination rate too high: {result}"
      assert result["context_precision"] >= 0.75, f"retrieval quality dropped: {result}"
  ```

  **Крок 2: Verifier LLM, який витягає claims:**

  Інша модель ділить response на atomic claims і проти кожної перевіряє support у context.

  ```python
  CLAIM_EXTRACTOR = """Break the answer into a JSON list of atomic factual claims.
  Output: ["claim 1", "claim 2", ...]
  Answer: {answer}"""

  CLAIM_VERIFIER = """Given context, classify each claim as SUPPORTED or NOT_SUPPORTED.
  Context: {context}
  Claim: {claim}
  Reply with one word."""

  def hallucination_score(answer, context):
      claims = json.loads(judge.complete(CLAIM_EXTRACTOR.format(answer=answer)))
      verdicts = [
          judge.complete(CLAIM_VERIFIER.format(context=context, claim=c)).strip()
          for c in claims
      ]
      supported = sum(1 for v in verdicts if "SUPPORTED" in v)
      return supported / len(claims) if claims else 1.0
  ```

  **Крок 3: Adversarial probes у golden set:**

  Включіть questions, для яких context навмисно НЕ містить відповідь. Модель має відповісти "I don't know", а не вигадувати.

  ```python
  ADVERSARIAL = [
      {
          "question": "What is the price of the Enterprise SSO add-on?",
          "context_should_not_contain": "Enterprise SSO pricing",
          "expected_behavior": "refuse"  # "I don't have this information"
      }
  ]

  def test_refuses_unknown():
      for case in ADVERSARIAL:
          response = pipeline(case["question"])
          assert any(p in response.lower() for p in [
              "don't have", "not aware", "no information", "cannot find"
          ]), f"Hallucinated: {response}"
  ```

  **Крок 4: Production sampling як continuous test:**

  ```python
  # cron job: щодня 1% реальних запитів
  def daily_hallucination_audit():
      sample = sample_production_logs(percent=1)
      scores = [
          hallucination_score(item.response, item.context)
          for item in sample
      ]
      mean_score = statistics.mean(scores)
      cloud_monitoring.write_metric("rag.faithfulness", mean_score)
      if mean_score < 0.85:
          page_oncall("RAG faithfulness dropped")
  ```

  **CI gate config:**
  - **Pre-merge** на PR: golden faithfulness ≥ 0.85, adversarial refusal 100%
  - **Nightly**: full eval suite з reports у Slack
  - **Production sampling**: 1% запитів через verifier → metric у Cloud Monitoring

  **Важливо:**
  - Verifier LLM має бути **сильнішим** за production model (gpt-4o judge для claude-sonnet pipeline). Інакше judge сам hallucinates.
  - Не агресивна threshold — 0.95+ зробить тести flaky на reasonable response variation; 0.85 — sweet spot
  - Versioning prompts і model + retrieval index — інакше regression unattributable
en_answer: |
  **Scenario:** you're building a RAG chat for a SaaS product knowledge base. Users complain: the model sometimes confidently invents API endpoints or pricing tiers that don't exist. Regular unit tests don't catch this — answers are grammatical and semantically near truth.

  **Approach:**
  1. Define "hallucination" as "a fact in the answer that's not in retrieved context"
  2. Build an automated faithfulness check
  3. Run on a golden dataset as a CI gate; production sampling as a continuous monitor

  **Solution:**

  **Step 1: Faithfulness metric with ragas:**

  ```python
  # tests/test_rag_faithfulness.py
  from ragas import evaluate
  from ragas.metrics import faithfulness, context_precision
  from datasets import Dataset
  import pytest, json

  with open("tests/golden_rag.json") as f:
      golden = json.load(f)

  def run_pipeline(question):
      contexts = vector_store.search(question, k=5)
      response = llm.complete(make_prompt(question, contexts), temperature=0)
      return response, [c.text for c in contexts]

  def test_rag_faithfulness():
      cases = []
      for item in golden:
          response, contexts = run_pipeline(item["question"])
          cases.append({
              "question": item["question"],
              "answer": response,
              "contexts": contexts,
              "ground_truth": item["expected_answer"],
          })
      ds = Dataset.from_list(cases)

      result = evaluate(ds, metrics=[faithfulness, context_precision])

      # Hard threshold
      assert result["faithfulness"] >= 0.85, f"hallucination rate too high: {result}"
      assert result["context_precision"] >= 0.75, f"retrieval quality dropped: {result}"
  ```

  **Step 2: Verifier LLM that extracts claims:**

  A separate model splits the response into atomic claims and checks each one for support in context.

  ```python
  CLAIM_EXTRACTOR = """Break the answer into a JSON list of atomic factual claims.
  Output: ["claim 1", "claim 2", ...]
  Answer: {answer}"""

  CLAIM_VERIFIER = """Given context, classify each claim as SUPPORTED or NOT_SUPPORTED.
  Context: {context}
  Claim: {claim}
  Reply with one word."""

  def hallucination_score(answer, context):
      claims = json.loads(judge.complete(CLAIM_EXTRACTOR.format(answer=answer)))
      verdicts = [
          judge.complete(CLAIM_VERIFIER.format(context=context, claim=c)).strip()
          for c in claims
      ]
      supported = sum(1 for v in verdicts if "SUPPORTED" in v)
      return supported / len(claims) if claims else 1.0
  ```

  **Step 3: Adversarial probes in the golden set:**

  Include questions whose context deliberately doesn't contain the answer. The model must reply "I don't know" rather than invent.

  ```python
  ADVERSARIAL = [
      {
          "question": "What is the price of the Enterprise SSO add-on?",
          "context_should_not_contain": "Enterprise SSO pricing",
          "expected_behavior": "refuse"  # "I don't have this information"
      }
  ]

  def test_refuses_unknown():
      for case in ADVERSARIAL:
          response = pipeline(case["question"])
          assert any(p in response.lower() for p in [
              "don't have", "not aware", "no information", "cannot find"
          ]), f"Hallucinated: {response}"
  ```

  **Step 4: Production sampling as a continuous test:**

  ```python
  # cron job: 1% of real requests daily
  def daily_hallucination_audit():
      sample = sample_production_logs(percent=1)
      scores = [
          hallucination_score(item.response, item.context)
          for item in sample
      ]
      mean_score = statistics.mean(scores)
      cloud_monitoring.write_metric("rag.faithfulness", mean_score)
      if mean_score < 0.85:
          page_oncall("RAG faithfulness dropped")
  ```

  **CI gate config:**
  - **Pre-merge** on PR: golden faithfulness ≥ 0.85, adversarial refusal 100%
  - **Nightly**: full eval suite with reports in Slack
  - **Production sampling**: 1% of requests via verifier → metric in Cloud Monitoring

  **Important:**
  - The verifier LLM must be **stronger** than the production model (gpt-4o judge for a claude-sonnet pipeline). Otherwise the judge itself hallucinates.
  - Don't be aggressive on threshold — 0.95+ makes tests flaky on reasonable variation; 0.85 is the sweet spot
  - Version prompts, model, and retrieval index — otherwise regressions are unattributable
section: "llm-testing"
order: 4
tags: [llm, hallucinations, rag, ci-cd]
type: "practical"
---
