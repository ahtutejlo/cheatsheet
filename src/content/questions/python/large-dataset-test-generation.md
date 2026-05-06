---
ua_question: "Як генерувати великі тестові датасети ефективно?"
en_question: "How to generate large test datasets efficiently?"
ua_answer: |
  **Сценарій:** ваш performance test потребує 10M users, 100M orders, реалістично пов'язаних. Faker + insert по одному = 6 годин. Pandas DataFrame в RAM — вилітає на 32GB box.

  **Підхід:**
  1. Streaming generation замість in-memory
  2. Bulk inserts замість per-row
  3. Parallel generation з multiprocessing
  4. Dump до Parquet/CSV для повторного використання

  **Рішення:**

  **Streaming generator замість list/DataFrame:**

  ```python
  from faker import Faker
  from typing import Iterator

  fake = Faker()
  fake.seed_instance(42)

  def user_generator(count: int, start_id: int = 0) -> Iterator[dict]:
      """Yield по одному, не накопичує в RAM."""
      for i in range(start_id, start_id + count):
          yield {
              "id": f"u_{i}",
              "email": f"u{i}@example.com",  # deterministic, не fake.email() — швидше
              "name": fake.name(),
              "country": fake.country_code(),
              "created_at": fake.date_time_between(start_date="-2y").isoformat()
          }

  # 10M users — генерація в потоці, не в RAM
  for batch in chunk(user_generator(10_000_000), size=10_000):
      db.users.bulk_write([InsertOne(u) for u in batch])
  ```

  **Bulk inserts — критичний performance lever:**

  ```python
  # SLOW: 1M inserts по одному = 30 хвилин
  for user in users:
      db.users.insert_one(user)  # round-trip per row

  # FAST: bulk_write batches = 30 секунд
  from pymongo import InsertOne
  ops = [InsertOne(user) for user in batch_of_1000]
  db.users.bulk_write(ops, ordered=False)  # parallel inserts на сервері
  ```

  Postgres:
  ```python
  # SLOW
  for user in users:
      cur.execute("INSERT INTO users (id, email, name) VALUES (%s, %s, %s)",
                  (user["id"], user["email"], user["name"]))

  # FAST: COPY FROM stdin або executemany
  cur.executemany(
      "INSERT INTO users (id, email, name) VALUES (%s, %s, %s)",
      [(u["id"], u["email"], u["name"]) for u in batch_of_10_000]
  )

  # FASTEST: COPY (10× faster за executemany)
  import io, csv
  buf = io.StringIO()
  writer = csv.writer(buf)
  for u in batch:
      writer.writerow([u["id"], u["email"], u["name"]])
  buf.seek(0)
  cur.copy_from(buf, "users", sep=",", columns=("id", "email", "name"))
  ```

  **Parallel generation з multiprocessing:**

  ```python
  from multiprocessing import Pool
  import functools

  def gen_chunk(args):
      start_id, count, seed = args
      fake = Faker()
      fake.seed_instance(seed)
      return [
          {"id": f"u_{i}", "email": f"u{i}@e.com", "name": fake.name()}
          for i in range(start_id, start_id + count)
      ]

  if __name__ == "__main__":
      with Pool(processes=8) as pool:
          chunks = [(i * 100_000, 100_000, 42 + i) for i in range(100)]
          results = pool.map(gen_chunk, chunks)
      # Flatten and save
      with open("users.jsonl", "w") as f:
          for chunk in results:
              for user in chunk:
                  f.write(json.dumps(user) + "\n")
  ```

  Кожен process має свій Faker з detrministic seed — recreatable. 8× speedup на 8-core machine.

  **Зберігайте раз — використовуйте N разів:**

  Якщо суіт використовує той самий синтетичний dataset, не генеруйте кожен прогон:

  ```python
  # Один раз — generate і save до Parquet
  import pyarrow as pa
  import pyarrow.parquet as pq

  table = pa.table({
      "id": [u["id"] for u in users],
      "email": [u["email"] for u in users],
      "name": [u["name"] for u in users],
      "created_at": [u["created_at"] for u in users]
  })
  pq.write_table(table, "users_10m.parquet", compression="snappy")
  # 10M users → ~200MB Parquet (vs 1.5GB JSON)

  # У тестах — load:
  table = pq.read_table("users_10m.parquet")
  df = table.to_pandas()  # або streaming через batches
  ```

  Parquet зберігається в GCS, тести завантажують raz і кешують локально (`gsutil rsync`).

  **Realistic referential integrity:**

  Якщо `orders.user_id` має FK на `users.id`, не randomіть user_id — sample з вже згенерованих:

  ```python
  user_ids = [f"u_{i}" for i in range(10_000_000)]

  def order_generator(count, user_ids):
      for i in range(count):
          yield {
              "id": f"o_{i}",
              "user_id": random.choice(user_ids),  # FK guaranteed valid
              "total": round(random.uniform(10, 1000), 2)
          }
  ```

  **Підводні камені:**
  - **Faker `unique`** — гарантує uniqueness, але slow і memory-heavy. Для 10M rows використовуйте `f"user_{i}"` замість `fake.unique.email()`
  - **Random vs realistic distribution** — random.uniform не дає Pareto/Zipf, який є в реальних даних. Для realistic load testing використовуйте `numpy.random.zipf` або історичну distribution
  - **Indexes увімкнені при insert** — у Postgres/Mongo створюйте indexes ПІСЛЯ bulk insert. На 10M rows це різниця 30 min vs 6 hours.
  - **Disk space** — 100M order rows × 200B = 20GB на диску. Перевірте disk capacity до запуску.

  **Tooling alternatives:**
  - **Synthea** — medical synthetic data generator
  - **SDV (Synthetic Data Vault)** — SDV-based на existing distributions
  - **Faker + multiprocessing** — для most general case
  - **Mockaroo** — UI/API based, для невеликих datasets
en_answer: |
  **Scenario:** your performance test needs 10M users, 100M orders, realistically connected. Faker + per-row inserts = 6 hours. A Pandas DataFrame in RAM blows up on a 32 GB box.

  **Approach:**
  1. Streaming generation instead of in-memory
  2. Bulk inserts instead of per-row
  3. Parallel generation with multiprocessing
  4. Dump to Parquet/CSV for reuse

  **Solution:**

  **Streaming generator instead of list/DataFrame:**

  ```python
  from faker import Faker
  from typing import Iterator

  fake = Faker()
  fake.seed_instance(42)

  def user_generator(count: int, start_id: int = 0) -> Iterator[dict]:
      """Yield one at a time, no RAM accumulation."""
      for i in range(start_id, start_id + count):
          yield {
              "id": f"u_{i}",
              "email": f"u{i}@example.com",  # deterministic, not fake.email() — faster
              "name": fake.name(),
              "country": fake.country_code(),
              "created_at": fake.date_time_between(start_date="-2y").isoformat()
          }

  # 10M users — generated in stream, not RAM
  for batch in chunk(user_generator(10_000_000), size=10_000):
      db.users.bulk_write([InsertOne(u) for u in batch])
  ```

  **Bulk inserts — a critical performance lever:**

  ```python
  # SLOW: 1M one-by-one inserts = 30 minutes
  for user in users:
      db.users.insert_one(user)  # round trip per row

  # FAST: bulk_write batches = 30 seconds
  from pymongo import InsertOne
  ops = [InsertOne(user) for user in batch_of_1000]
  db.users.bulk_write(ops, ordered=False)  # parallel inserts server-side
  ```

  Postgres:
  ```python
  # SLOW
  for user in users:
      cur.execute("INSERT INTO users (id, email, name) VALUES (%s, %s, %s)",
                  (user["id"], user["email"], user["name"]))

  # FAST: COPY FROM stdin or executemany
  cur.executemany(
      "INSERT INTO users (id, email, name) VALUES (%s, %s, %s)",
      [(u["id"], u["email"], u["name"]) for u in batch_of_10_000]
  )

  # FASTEST: COPY (10× faster than executemany)
  import io, csv
  buf = io.StringIO()
  writer = csv.writer(buf)
  for u in batch:
      writer.writerow([u["id"], u["email"], u["name"]])
  buf.seek(0)
  cur.copy_from(buf, "users", sep=",", columns=("id", "email", "name"))
  ```

  **Parallel generation with multiprocessing:**

  ```python
  from multiprocessing import Pool
  import functools

  def gen_chunk(args):
      start_id, count, seed = args
      fake = Faker()
      fake.seed_instance(seed)
      return [
          {"id": f"u_{i}", "email": f"u{i}@e.com", "name": fake.name()}
          for i in range(start_id, start_id + count)
      ]

  if __name__ == "__main__":
      with Pool(processes=8) as pool:
          chunks = [(i * 100_000, 100_000, 42 + i) for i in range(100)]
          results = pool.map(gen_chunk, chunks)
      with open("users.jsonl", "w") as f:
          for chunk in results:
              for user in chunk:
                  f.write(json.dumps(user) + "\n")
  ```

  Each process gets its own Faker with a deterministic seed — recreatable. 8× speedup on an 8-core machine.

  **Generate once, reuse N times:**

  If your suite uses the same synthetic dataset, don't regenerate every run:

  ```python
  # Once — generate and save to Parquet
  import pyarrow as pa
  import pyarrow.parquet as pq

  table = pa.table({
      "id": [u["id"] for u in users],
      "email": [u["email"] for u in users],
      "name": [u["name"] for u in users],
      "created_at": [u["created_at"] for u in users]
  })
  pq.write_table(table, "users_10m.parquet", compression="snappy")
  # 10M users → ~200MB Parquet (vs 1.5GB JSON)

  # In tests — load:
  table = pq.read_table("users_10m.parquet")
  df = table.to_pandas()  # or stream via batches
  ```

  Parquet lives in GCS, tests download once and cache locally (`gsutil rsync`).

  **Realistic referential integrity:**

  If `orders.user_id` has an FK to `users.id`, don't randomize user_id — sample from already generated ones:

  ```python
  user_ids = [f"u_{i}" for i in range(10_000_000)]

  def order_generator(count, user_ids):
      for i in range(count):
          yield {
              "id": f"o_{i}",
              "user_id": random.choice(user_ids),  # FK guaranteed valid
              "total": round(random.uniform(10, 1000), 2)
          }
  ```

  **Pitfalls:**
  - **Faker `unique`** — guarantees uniqueness but is slow and memory-heavy. For 10M rows use `f"user_{i}"` instead of `fake.unique.email()`
  - **Random vs realistic distribution** — random.uniform doesn't give the Pareto/Zipf shape real data has. For realistic load testing use `numpy.random.zipf` or sample from a historical distribution
  - **Indexes enabled during insert** — in Postgres/Mongo create indexes AFTER the bulk insert. On 10M rows this is the difference between 30 min and 6 hours.
  - **Disk space** — 100M order rows × 200B = 20 GB on disk. Verify capacity before running.

  **Tooling alternatives:**
  - **Synthea** — medical synthetic data generator
  - **SDV (Synthetic Data Vault)** — SDV based on existing distributions
  - **Faker + multiprocessing** — for the general case
  - **Mockaroo** — UI/API based, for small datasets
section: "python"
order: 54
tags: [test-data, performance, faker, bulk-operations]
type: "practical"
---
