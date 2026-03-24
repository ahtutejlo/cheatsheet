---
company: "mongodb"
stage: "coding-1-fuzzer-edge-cases"
ua_question: "Напиши простий фазер для тестування парсера JSON-like запитів. Як генерувати ефективні тест-кейси?"
en_question: "Write a simple fuzzer for testing a JSON-like query parser. How to generate effective test cases?"
ua_answer: |
  Фазер (fuzzer) — інструмент, що генерує випадкові або напів-випадкові вхідні дані для знаходження крашів, витоків пам'яті та некоректної поведінки.

  **Стратегії фазингу:**
  - **Mutation-based** — бере валідний вхід і мутує його (змінює байти, додає/видаляє символи)
  - **Generation-based** — генерує вхідні дані за граматикою/схемою
  - **Coverage-guided** — відстежує покриття коду і зберігає мутації, що відкривають нові шляхи

  ```python
  import random
  import string
  import json

  class QueryFuzzer:
      def __init__(self, seed_queries: list[str]):
          self.seeds = seed_queries
          self.interesting_inputs = []

      def mutate(self, query: str) -> str:
          """Apply random mutation to a query string."""
          mutations = [
              self._flip_char,
              self._insert_random,
              self._delete_char,
              self._duplicate_segment,
              self._inject_boundary,
          ]
          mutant = query
          # Apply 1-3 mutations
          for _ in range(random.randint(1, 3)):
              mutation = random.choice(mutations)
              mutant = mutation(mutant)
          return mutant

      def _flip_char(self, s: str) -> str:
          if not s: return s
          i = random.randint(0, len(s) - 1)
          return s[:i] + random.choice(string.printable) + s[i+1:]

      def _insert_random(self, s: str) -> str:
          i = random.randint(0, len(s))
          chunk = ''.join(random.choices(string.printable, k=random.randint(1, 10)))
          return s[:i] + chunk + s[i:]

      def _delete_char(self, s: str) -> str:
          if not s: return s
          i = random.randint(0, len(s) - 1)
          return s[:i] + s[i+1:]

      def _duplicate_segment(self, s: str) -> str:
          if len(s) < 2: return s * 2
          start = random.randint(0, len(s) - 2)
          end = random.randint(start + 1, len(s))
          return s[:end] + s[start:end] + s[end:]

      def _inject_boundary(self, s: str) -> str:
          boundaries = [
              "", "null", "undefined", "NaN", "Infinity",
              "\x00", "\n\r", "\\", "'", '"',
              "{" * 100, "}" * 100,  # deep nesting
              "a" * 10000,  # long string
              str(2**63), str(-2**63),  # integer boundaries
              '{"$where": "sleep(5000)"}',  # injection
          ]
          i = random.randint(0, len(s))
          return s[:i] + random.choice(boundaries) + s[i:]

      def generate_batch(self, count: int = 100) -> list[str]:
          results = []
          for _ in range(count):
              seed = random.choice(self.seeds)
              results.append(self.mutate(seed))
          return results

      def fuzz(self, target_fn, iterations: int = 1000):
          """Run fuzzer against target function, collect crashes."""
          crashes = []
          for i in range(iterations):
              seed = random.choice(self.seeds)
              mutant = self.mutate(seed)
              try:
                  result = target_fn(mutant)
              except Exception as e:
                  crashes.append({
                      "input": mutant,
                      "error": str(e),
                      "type": type(e).__name__,
                      "iteration": i,
                  })
          return crashes

  # Usage
  seeds = [
      '{"name": "test", "age": 25}',
      '{"$gt": 10, "$lt": 100}',
      '{"tags": {"$in": ["a", "b"]}}',
  ]
  fuzzer = QueryFuzzer(seeds)
  crashes = fuzzer.fuzz(json.loads, iterations=5000)
  print(f"Found {len(crashes)} crashes in {5000} iterations")
  for c in crashes[:5]:
      print(f"  [{c['type']}] {c['input'][:80]}...")
  ```

  **Ключові граничні значення для MongoDB запитів:**
  - Глибоко вкладені документи (100+ рівнів)
  - Дуже довгі ключі та значення
  - Спеціальні оператори (`$where`, `$regex`) з malicious payload
  - Невалідний BSON / Unicode
en_answer: |
  A fuzzer is a tool that generates random or semi-random input data to find crashes, memory leaks, and incorrect behavior.

  **Fuzzing strategies:**
  - **Mutation-based** — takes valid input and mutates it (flips bytes, adds/removes characters)
  - **Generation-based** — generates input based on grammar/schema
  - **Coverage-guided** — tracks code coverage and saves mutations that discover new paths

  ```python
  import random
  import string
  import json

  class QueryFuzzer:
      def __init__(self, seed_queries: list[str]):
          self.seeds = seed_queries
          self.interesting_inputs = []

      def mutate(self, query: str) -> str:
          """Apply random mutation to a query string."""
          mutations = [
              self._flip_char,
              self._insert_random,
              self._delete_char,
              self._duplicate_segment,
              self._inject_boundary,
          ]
          mutant = query
          # Apply 1-3 mutations
          for _ in range(random.randint(1, 3)):
              mutation = random.choice(mutations)
              mutant = mutation(mutant)
          return mutant

      def _flip_char(self, s: str) -> str:
          if not s: return s
          i = random.randint(0, len(s) - 1)
          return s[:i] + random.choice(string.printable) + s[i+1:]

      def _insert_random(self, s: str) -> str:
          i = random.randint(0, len(s))
          chunk = ''.join(random.choices(string.printable, k=random.randint(1, 10)))
          return s[:i] + chunk + s[i:]

      def _delete_char(self, s: str) -> str:
          if not s: return s
          i = random.randint(0, len(s) - 1)
          return s[:i] + s[i+1:]

      def _duplicate_segment(self, s: str) -> str:
          if len(s) < 2: return s * 2
          start = random.randint(0, len(s) - 2)
          end = random.randint(start + 1, len(s))
          return s[:end] + s[start:end] + s[end:]

      def _inject_boundary(self, s: str) -> str:
          boundaries = [
              "", "null", "undefined", "NaN", "Infinity",
              "\x00", "\n\r", "\\", "'", '"',
              "{" * 100, "}" * 100,  # deep nesting
              "a" * 10000,  # long string
              str(2**63), str(-2**63),  # integer boundaries
              '{"$where": "sleep(5000)"}',  # injection
          ]
          i = random.randint(0, len(s))
          return s[:i] + random.choice(boundaries) + s[i:]

      def generate_batch(self, count: int = 100) -> list[str]:
          results = []
          for _ in range(count):
              seed = random.choice(self.seeds)
              results.append(self.mutate(seed))
          return results

      def fuzz(self, target_fn, iterations: int = 1000):
          """Run fuzzer against target function, collect crashes."""
          crashes = []
          for i in range(iterations):
              seed = random.choice(self.seeds)
              mutant = self.mutate(seed)
              try:
                  result = target_fn(mutant)
              except Exception as e:
                  crashes.append({
                      "input": mutant,
                      "error": str(e),
                      "type": type(e).__name__,
                      "iteration": i,
                  })
          return crashes

  # Usage
  seeds = [
      '{"name": "test", "age": 25}',
      '{"$gt": 10, "$lt": 100}',
      '{"tags": {"$in": ["a", "b"]}}',
  ]
  fuzzer = QueryFuzzer(seeds)
  crashes = fuzzer.fuzz(json.loads, iterations=5000)
  print(f"Found {len(crashes)} crashes in {5000} iterations")
  for c in crashes[:5]:
      print(f"  [{c['type']}] {c['input'][:80]}...")
  ```

  **Key boundary values for MongoDB queries:**
  - Deeply nested documents (100+ levels)
  - Very long keys and values
  - Special operators (`$where`, `$regex`) with malicious payloads
  - Invalid BSON / Unicode
tags: [fuzzing, testing, python, edge-cases]
order: 1
---
