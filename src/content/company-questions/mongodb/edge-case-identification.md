---
company: "mongodb"
stage: "coding-1-fuzzer-edge-cases"
ua_question: "Дано функцію пошуку в базі даних. Визнач усі edge cases та напиши тести для них"
en_question: "Given a database search function, identify all edge cases and write tests for them"
ua_answer: |
  При тестуванні функції пошуку в базі даних потрібно систематично перевіряти граничні випадки за категоріями:

  **Вхідні дані:**
  - Порожній запит / null / undefined
  - Дуже довгий рядок пошуку (>16MB — ліміт BSON документа)
  - Спецсимволи: `.*+?^${}()|[]\`, Unicode, emoji, null bytes
  - Regex injection: `{"$regex": ".*", "$options": "s"}`
  - Числові межі: 0, -1, MAX_INT, MIN_INT, NaN, Infinity

  **Стан бази:**
  - Порожня колекція
  - Один документ
  - Мільйони документів (перформанс)
  - Документи з відсутніми полями (sparse data)
  - Дублікати

  **Конкурентність:**
  - Пошук під час запису
  - Пошук під час видалення індексу
  - Пошук в момент failover репліки

  ```python
  import pytest
  from pymongo import MongoClient

  @pytest.fixture
  def collection():
      client = MongoClient("mongodb://localhost:27017")
      db = client.test_db
      col = db.test_collection
      col.drop()
      yield col
      col.drop()

  class TestSearchEdgeCases:
      def test_empty_query(self, collection):
          collection.insert_one({"name": "test"})
          results = list(collection.find({}))
          assert len(results) == 1

      def test_null_field_search(self, collection):
          collection.insert_many([
              {"name": "Alice", "age": 30},
              {"name": "Bob"},  # no age field
              {"name": "Charlie", "age": None},
          ])
          # Documents where age is null OR field doesn't exist
          results = list(collection.find({"age": None}))
          assert len(results) == 2  # Bob + Charlie

      def test_empty_collection(self, collection):
          results = list(collection.find({"name": "test"}))
          assert results == []

      def test_special_chars_in_query(self, collection):
          collection.insert_one({"name": "test.*+?^$"})
          # Direct match, not regex
          results = list(collection.find({"name": "test.*+?^$"}))
          assert len(results) == 1

      def test_regex_injection(self, collection):
          collection.insert_many([{"name": f"user{i}"} for i in range(100)])
          # This should NOT match everything if properly handled
          results = list(collection.find({"name": {"$regex": ".*"}}))
          assert len(results) == 100  # Regex matches all

      def test_nested_document_search(self, collection):
          collection.insert_one({"user": {"address": {"city": "Kyiv"}}})
          result = collection.find_one({"user.address.city": "Kyiv"})
          assert result is not None

      def test_large_result_set(self, collection):
          collection.insert_many([{"i": i} for i in range(10000)])
          cursor = collection.find({"i": {"$gte": 0}}).batch_size(100)
          count = sum(1 for _ in cursor)
          assert count == 10000

      def test_unicode_search(self, collection):
          collection.insert_one({"name": "Тест 🚀"})
          result = collection.find_one({"name": "Тест 🚀"})
          assert result is not None
  ```
en_answer: |
  When testing a database search function, systematically check edge cases by category:

  **Input data:**
  - Empty query / null / undefined
  - Very long search string (>16MB — BSON document limit)
  - Special characters: `.*+?^${}()|[]\`, Unicode, emoji, null bytes
  - Regex injection: `{"$regex": ".*", "$options": "s"}`
  - Numeric boundaries: 0, -1, MAX_INT, MIN_INT, NaN, Infinity

  **Database state:**
  - Empty collection
  - Single document
  - Millions of documents (performance)
  - Documents with missing fields (sparse data)
  - Duplicates

  **Concurrency:**
  - Search during writes
  - Search during index deletion
  - Search during replica failover

  ```python
  import pytest
  from pymongo import MongoClient

  @pytest.fixture
  def collection():
      client = MongoClient("mongodb://localhost:27017")
      db = client.test_db
      col = db.test_collection
      col.drop()
      yield col
      col.drop()

  class TestSearchEdgeCases:
      def test_empty_query(self, collection):
          collection.insert_one({"name": "test"})
          results = list(collection.find({}))
          assert len(results) == 1

      def test_null_field_search(self, collection):
          collection.insert_many([
              {"name": "Alice", "age": 30},
              {"name": "Bob"},  # no age field
              {"name": "Charlie", "age": None},
          ])
          # Documents where age is null OR field doesn't exist
          results = list(collection.find({"age": None}))
          assert len(results) == 2  # Bob + Charlie

      def test_empty_collection(self, collection):
          results = list(collection.find({"name": "test"}))
          assert results == []

      def test_special_chars_in_query(self, collection):
          collection.insert_one({"name": "test.*+?^$"})
          # Direct match, not regex
          results = list(collection.find({"name": "test.*+?^$"}))
          assert len(results) == 1

      def test_regex_injection(self, collection):
          collection.insert_many([{"name": f"user{i}"} for i in range(100)])
          # This should NOT match everything if properly handled
          results = list(collection.find({"name": {"$regex": ".*"}}))
          assert len(results) == 100  # Regex matches all

      def test_nested_document_search(self, collection):
          collection.insert_one({"user": {"address": {"city": "Kyiv"}}})
          result = collection.find_one({"user.address.city": "Kyiv"})
          assert result is not None

      def test_large_result_set(self, collection):
          collection.insert_many([{"i": i} for i in range(10000)])
          cursor = collection.find({"i": {"$gte": 0}}).batch_size(100)
          count = sum(1 for _ in cursor)
          assert count == 10000

      def test_unicode_search(self, collection):
          collection.insert_one({"name": "Тест 🚀"})
          result = collection.find_one({"name": "Тест 🚀"})
          assert result is not None
  ```
tags: [edge-cases, testing, mongodb, python]
order: 2
---
