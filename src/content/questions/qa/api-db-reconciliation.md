---
ua_question: "Як порівняти результати API та БД для великого датасету?"
en_question: "How to compare API and database results for a large dataset?"
ua_answer: |
  Задача — переконатися, що API повертає ті ж дані, що зберігаються в БД. На великих датасетах (тисячі-мільйони записів) наївний підхід «завантажити все і порівняти» не працює через пам'ять та час.

  **Стратегія: посторінкове порівняння (chunked reconciliation)**
  1. Запитуємо API посторінково (pagination або cursor-based)
  2. Для кожної сторінки запитуємо ті ж записи з БД за ID
  3. Порівнюємо поля — нормалізуємо формати (дати, float precision, null vs відсутнє поле)
  4. Збираємо розбіжності — не падаємо на першій, збираємо всі

  **Стратегія: checksum/hash порівняння**
  Замість порівняння всіх полів — рахуємо хеш рядка або всієї таблиці і порівнюємо з API-сумою. Швидко для виявлення «є різниця чи ні», але не вказує що саме відрізняється.

  **Типові пастки:**
  - Часовий зсув: API може повертати дані на мілісекунди пізніше запису в БД (eventual consistency, кеш)
  - Формат дат: `2024-01-01T00:00:00Z` vs `2024-01-01 00:00:00` — однакові дані, різний рядок
  - Null vs відсутнє поле в JSON: `{"x": null}` vs `{}` — залежить від серіалізатора
  - Soft-deleted записи: API може їх приховувати, БД — ні
  - Сортування: якщо порядок не детермінований — сортуємо перед порівнянням

  ```python
  import requests
  import psycopg2
  from dataclasses import dataclass
  from typing import Iterator

  @dataclass
  class Mismatch:
      record_id: int
      field: str
      api_value: object
      db_value: object

  def fetch_api_page(base_url: str, page: int, page_size: int) -> list[dict]:
      resp = requests.get(base_url, params={"page": page, "size": page_size})
      resp.raise_for_status()
      return resp.json()["items"]

  def fetch_db_records(conn, ids: list[int]) -> dict[int, dict]:
      with conn.cursor() as cur:
          cur.execute(
              "SELECT id, name, price, updated_at FROM products WHERE id = ANY(%s)",
              (ids,)
          )
          return {row[0]: {"id": row[0], "name": row[1], "price": float(row[2]),
                           "updated_at": row[3].isoformat()} for row in cur.fetchall()}

  def normalize_api_record(record: dict) -> dict:
      """Нормалізація API відповіді до формату БД."""
      return {
          "id": record["id"],
          "name": record["name"].strip(),
          "price": round(float(record["price"]), 2),
          "updated_at": record.get("updatedAt") or record.get("updated_at"),
      }

  def reconcile(base_url: str, conn, page_size: int = 500) -> Iterator[Mismatch]:
      page = 0
      fields_to_check = ["name", "price", "updated_at"]

      while True:
          api_page = fetch_api_page(base_url, page, page_size)
          if not api_page:
              break

          ids = [r["id"] for r in api_page]
          db_records = fetch_db_records(conn, ids)

          for api_raw in api_page:
              api_rec = normalize_api_record(api_raw)
              db_rec = db_records.get(api_rec["id"])

              if db_rec is None:
                  yield Mismatch(api_rec["id"], "_existence", "present", "missing")
                  continue

              for field in fields_to_check:
                  if api_rec.get(field) != db_rec.get(field):
                      yield Mismatch(api_rec["id"], field, api_rec.get(field), db_rec.get(field))

          page += 1

  # Запуск
  conn = psycopg2.connect("postgresql://...")
  mismatches = list(reconcile("https://api.example.com/products", conn))

  if mismatches:
      print(f"Знайдено {len(mismatches)} розбіжностей:")
      for m in mismatches[:10]:  # перші 10
          print(f"  ID={m.record_id} поле={m.field}: API={m.api_value!r} DB={m.db_value!r}")
  else:
      print("Дані API і БД збігаються")
  ```

  Ключові принципи: порівнювати **посторінково**, **нормалізувати** формати перед порівнянням, **збирати всі** розбіжності (не зупинятись на першій), враховувати **eventual consistency** (невеликий delay між записом у БД і появою в API).
en_answer: |
  The task is to verify that an API returns the same data stored in the database. For large datasets (thousands to millions of records), the naive "load everything and compare" approach fails due to memory and time constraints.

  **Strategy: chunked reconciliation**
  1. Query the API page by page (pagination or cursor-based)
  2. For each page, query the same records from the DB by ID
  3. Compare fields — normalize formats (dates, float precision, null vs missing field)
  4. Collect mismatches — don't fail on the first one, collect all

  **Strategy: checksum/hash comparison**
  Instead of comparing all fields — compute a hash of the row or entire table and compare with an API-side checksum. Fast for detecting "is there a difference", but doesn't tell you what differs.

  **Common pitfalls:**
  - Time skew: API may return data milliseconds after DB write (eventual consistency, cache)
  - Date format: `2024-01-01T00:00:00Z` vs `2024-01-01 00:00:00` — same data, different string
  - Null vs missing JSON field: `{"x": null}` vs `{}` — depends on serializer
  - Soft-deleted records: API may hide them, DB does not
  - Ordering: if order is non-deterministic — sort before comparing

  ```python
  import requests
  import psycopg2
  from dataclasses import dataclass
  from typing import Iterator

  @dataclass
  class Mismatch:
      record_id: int
      field: str
      api_value: object
      db_value: object

  def fetch_api_page(base_url: str, page: int, page_size: int) -> list[dict]:
      resp = requests.get(base_url, params={"page": page, "size": page_size})
      resp.raise_for_status()
      return resp.json()["items"]

  def fetch_db_records(conn, ids: list[int]) -> dict[int, dict]:
      with conn.cursor() as cur:
          cur.execute(
              "SELECT id, name, price, updated_at FROM products WHERE id = ANY(%s)",
              (ids,)
          )
          return {row[0]: {"id": row[0], "name": row[1], "price": float(row[2]),
                           "updated_at": row[3].isoformat()} for row in cur.fetchall()}

  def normalize_api_record(record: dict) -> dict:
      """Normalize API response to DB format."""
      return {
          "id": record["id"],
          "name": record["name"].strip(),
          "price": round(float(record["price"]), 2),
          "updated_at": record.get("updatedAt") or record.get("updated_at"),
      }

  def reconcile(base_url: str, conn, page_size: int = 500) -> Iterator[Mismatch]:
      page = 0
      fields_to_check = ["name", "price", "updated_at"]

      while True:
          api_page = fetch_api_page(base_url, page, page_size)
          if not api_page:
              break

          ids = [r["id"] for r in api_page]
          db_records = fetch_db_records(conn, ids)

          for api_raw in api_page:
              api_rec = normalize_api_record(api_raw)
              db_rec = db_records.get(api_rec["id"])

              if db_rec is None:
                  yield Mismatch(api_rec["id"], "_existence", "present", "missing")
                  continue

              for field in fields_to_check:
                  if api_rec.get(field) != db_rec.get(field):
                      yield Mismatch(api_rec["id"], field, api_rec.get(field), db_rec.get(field))

          page += 1

  # Run
  conn = psycopg2.connect("postgresql://...")
  mismatches = list(reconcile("https://api.example.com/products", conn))

  if mismatches:
      print(f"Found {len(mismatches)} mismatches:")
      for m in mismatches[:10]:
          print(f"  ID={m.record_id} field={m.field}: API={m.api_value!r} DB={m.db_value!r}")
  else:
      print("API and DB data match")
  ```

  Key principles: compare **page by page**, **normalize** formats before comparison, **collect all** mismatches (don't stop at first), account for **eventual consistency** (small delay between DB write and API visibility).
section: "qa"
order: 16
tags:
  - testing
  - database
  - api
type: "practical"
---
