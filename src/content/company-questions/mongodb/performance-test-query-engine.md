---
company: "mongodb"
stage: "coding-2-frameworks-performance"
ua_question: "Як би ти налаштував перформанс-тестування для query engine бази даних?"
en_question: "How would you set up performance testing for a database query engine?"
ua_answer: |
  Перформанс-тестування query engine потребує методичного підходу:

  **1. Визначити метрики**
  - Latency: p50, p95, p99 часу виконання запитів
  - Throughput: QPS (queries per second)
  - Resource usage: CPU, RAM, I/O під час тестів
  - Query plan stability: чи змінюється план при різних обсягах даних

  **2. Підготувати дані**
  - Реалістичний розподіл даних (не uniform random)
  - Різні обсяги: 1K, 100K, 10M, 100M документів
  - Різна кардинальність індексів
  - Hot/cold data patterns

  **3. Benchmark suite**
  ```python
  import time
  import statistics
  from pymongo import MongoClient
  from dataclasses import dataclass

  @dataclass
  class BenchmarkResult:
      query_name: str
      iterations: int
      latencies: list[float]

      @property
      def p50(self): return self._percentile(50)
      @property
      def p95(self): return self._percentile(95)
      @property
      def p99(self): return self._percentile(99)
      @property
      def qps(self): return len(self.latencies) / sum(self.latencies)

      def _percentile(self, p):
          sorted_lat = sorted(self.latencies)
          idx = int(len(sorted_lat) * p / 100)
          return sorted_lat[min(idx, len(sorted_lat)-1)]

      def report(self):
          return (f"{self.query_name}: p50={self.p50*1000:.1f}ms "
                  f"p95={self.p95*1000:.1f}ms p99={self.p99*1000:.1f}ms "
                  f"QPS={self.qps:.0f}")

  class QueryBenchmark:
      def __init__(self, collection):
          self.col = collection
          self.results = []

      def bench(self, name: str, query: dict, iterations: int = 1000,
                warmup: int = 100) -> BenchmarkResult:
          # Warmup — populate caches
          for _ in range(warmup):
              list(self.col.find(query).limit(10))

          # Measure
          latencies = []
          for _ in range(iterations):
              start = time.perf_counter()
              list(self.col.find(query).limit(10))
              latencies.append(time.perf_counter() - start)

          result = BenchmarkResult(name, iterations, latencies)
          self.results.append(result)
          return result

      def compare(self, name: str, queries: dict[str, dict],
                  iterations: int = 500):
          """Compare multiple query variants."""
          for variant, query in queries.items():
              self.bench(f"{name}/{variant}", query, iterations)

  # Usage
  client = MongoClient()
  col = client.benchmark.orders
  bm = QueryBenchmark(col)

  # Simple lookup vs range scan vs aggregation
  bm.compare("order_lookup", {
      "by_id": {"_id": "order_123"},
      "by_index": {"customerId": "cust_456"},
      "range_scan": {"amount": {"$gt": 100, "$lt": 500}},
      "no_index": {"notes": {"$regex": "urgent"}},
  })

  for r in bm.results:
      print(r.report())
  ```

  **4. Regression detection**
  - Зберігати baseline результати
  - Alert якщо p95 зросла >10%
  - Автоматично запускати при кожному PR

  **5. Типові проблеми query engine:**
  - Collection scan замість index scan
  - Index не покриває запит (covered query miss)
  - Sort в пам'яті замість index sort
  - Високий ratio відхилених планів (plan rejection)
en_answer: |
  Performance testing a query engine requires a methodical approach:

  **1. Define metrics**
  - Latency: p50, p95, p99 query execution time
  - Throughput: QPS (queries per second)
  - Resource usage: CPU, RAM, I/O during tests
  - Query plan stability: does the plan change with different data volumes

  **2. Prepare data**
  - Realistic data distribution (not uniform random)
  - Different volumes: 1K, 100K, 10M, 100M documents
  - Different index cardinality
  - Hot/cold data patterns

  **3. Benchmark suite**
  ```python
  import time
  import statistics
  from pymongo import MongoClient
  from dataclasses import dataclass

  @dataclass
  class BenchmarkResult:
      query_name: str
      iterations: int
      latencies: list[float]

      @property
      def p50(self): return self._percentile(50)
      @property
      def p95(self): return self._percentile(95)
      @property
      def p99(self): return self._percentile(99)
      @property
      def qps(self): return len(self.latencies) / sum(self.latencies)

      def _percentile(self, p):
          sorted_lat = sorted(self.latencies)
          idx = int(len(sorted_lat) * p / 100)
          return sorted_lat[min(idx, len(sorted_lat)-1)]

      def report(self):
          return (f"{self.query_name}: p50={self.p50*1000:.1f}ms "
                  f"p95={self.p95*1000:.1f}ms p99={self.p99*1000:.1f}ms "
                  f"QPS={self.qps:.0f}")

  class QueryBenchmark:
      def __init__(self, collection):
          self.col = collection
          self.results = []

      def bench(self, name: str, query: dict, iterations: int = 1000,
                warmup: int = 100) -> BenchmarkResult:
          # Warmup — populate caches
          for _ in range(warmup):
              list(self.col.find(query).limit(10))

          # Measure
          latencies = []
          for _ in range(iterations):
              start = time.perf_counter()
              list(self.col.find(query).limit(10))
              latencies.append(time.perf_counter() - start)

          result = BenchmarkResult(name, iterations, latencies)
          self.results.append(result)
          return result

      def compare(self, name: str, queries: dict[str, dict],
                  iterations: int = 500):
          """Compare multiple query variants."""
          for variant, query in queries.items():
              self.bench(f"{name}/{variant}", query, iterations)

  # Usage
  client = MongoClient()
  col = client.benchmark.orders
  bm = QueryBenchmark(col)

  # Simple lookup vs range scan vs aggregation
  bm.compare("order_lookup", {
      "by_id": {"_id": "order_123"},
      "by_index": {"customerId": "cust_456"},
      "range_scan": {"amount": {"$gt": 100, "$lt": 500}},
      "no_index": {"notes": {"$regex": "urgent"}},
  })

  for r in bm.results:
      print(r.report())
  ```

  **4. Regression detection**
  - Store baseline results
  - Alert if p95 increases >10%
  - Automatically run on every PR

  **5. Common query engine problems:**
  - Collection scan instead of index scan
  - Index doesn't cover the query (covered query miss)
  - In-memory sort instead of index sort
  - High plan rejection ratio
tags: [performance, testing, mongodb, benchmarking]
order: 2
---
