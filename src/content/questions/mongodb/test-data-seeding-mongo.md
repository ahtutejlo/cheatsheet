---
ua_question: "Як seedити test data у MongoDB?"
en_question: "How to seed test data in MongoDB?"
ua_answer: |
  **Сценарій:** ваш test suite має 50+ тестів, кожен потребує "користувача з 3 ордерами і 2 платіжними методами" або подібний контекст. Ви не хочете 50 разів писати створення даних. І ще треба, щоб тести були ізольовані — не залежали один від одного.

  **Підхід:**
  1. **Один ефемерний MongoDB на тестовий run** (Docker / testcontainers / GitHub services)
  2. **Скидувати state між тестами** — або drop database, або per-test transaction-rollback
  3. **Factory pattern** замість inline JSON-в-pytest

  **Рішення:**

  **Ефемерний MongoDB через testcontainers:**

  ```python
  # conftest.py
  import pytest
  from pymongo import MongoClient
  from testcontainers.mongodb import MongoDbContainer

  @pytest.fixture(scope="session")
  def mongo_uri():
      with MongoDbContainer("mongo:7") as mongo:
          yield mongo.get_connection_url()

  @pytest.fixture
  def db(mongo_uri):
      client = MongoClient(mongo_uri)
      db = client.test_db
      yield db
      # Скинути state після кожного тесту
      client.drop_database("test_db")
  ```

  **Factory pattern (factory_boy + faker):**

  ```python
  # tests/factories.py
  import factory
  from faker import Faker

  fake = Faker()

  class UserFactory(factory.Factory):
      class Meta:
          model = dict

      _id = factory.Sequence(lambda n: f"user_{n}")
      email = factory.LazyAttribute(lambda o: fake.email())
      name = factory.LazyAttribute(lambda o: fake.name())
      created_at = factory.LazyFunction(lambda: datetime.utcnow())
      preferences = factory.SubFactory(PreferencesFactory)

  class OrderFactory(factory.Factory):
      class Meta:
          model = dict

      _id = factory.Sequence(lambda n: f"order_{n}")
      user_id = factory.SubFactory(UserFactory).attribute("_id")
      total = factory.LazyAttribute(lambda o: round(fake.random.uniform(10, 500), 2))
      status = factory.Iterator(["pending", "shipped", "delivered"])
  ```

  **У тесті — компонуємо потрібний сценарій:**

  ```python
  def test_user_with_orders(db):
      user = UserFactory()
      orders = OrderFactory.create_batch(3, user_id=user["_id"])
      db.users.insert_one(user)
      db.orders.insert_many(orders)

      response = api.get(f"/users/{user['_id']}/orders")
      assert response.status_code == 200
      assert len(response.json()["orders"]) == 3
  ```

  **Альтернатива через JSON-fixtures (для legacy):**

  ```python
  @pytest.fixture
  def seed_users(db):
      with open("tests/fixtures/users.json") as f:
          db.users.insert_many(json.load(f))
  ```

  Ризики JSON-fixtures: ID конфлікти між тестами, важко версіонувати, не дають varied data — використовуйте лише для "reference data" (країни, валюти).

  **Performance-поради:**
  - **`insert_many`** замість 100×`insert_one` — у 10× швидше
  - **`bulk_write`** для mix create/update/delete
  - **Індекси створюйте до seed** — інакше insert тригерить ребілд
  - Для дуже великих фікстур — `mongoimport` файлу JSON/BSON

  **Snapshot strategy для дуже дорогої seed:**
  Якщо seed займає 30 сек, але потрібен в 50 тестах:
  1. Підготуйте dataset у session-fixture
  2. Робіть `mongodump` у session start
  3. Між тестами — `mongorestore` (швидше за повну переseedingку)

  **Anti-pattern:** seed від попереднього тесту. Тести стають **порядково-залежні**. Краще: повна ізоляція через drop або transactions.
en_answer: |
  **Scenario:** your test suite has 50+ tests, each requiring "a user with 3 orders and 2 payment methods" or similar context. You don't want to write that setup 50 times. Tests must also be isolated — not dependent on each other.

  **Approach:**
  1. **One ephemeral MongoDB per test run** (Docker / testcontainers / GitHub services)
  2. **Reset state between tests** — either drop database, or per-test transaction rollback
  3. **Factory pattern** instead of inline JSON in pytest

  **Solution:**

  **Ephemeral MongoDB via testcontainers:**

  ```python
  # conftest.py
  import pytest
  from pymongo import MongoClient
  from testcontainers.mongodb import MongoDbContainer

  @pytest.fixture(scope="session")
  def mongo_uri():
      with MongoDbContainer("mongo:7") as mongo:
          yield mongo.get_connection_url()

  @pytest.fixture
  def db(mongo_uri):
      client = MongoClient(mongo_uri)
      db = client.test_db
      yield db
      # Reset state after each test
      client.drop_database("test_db")
  ```

  **Factory pattern (factory_boy + faker):**

  ```python
  # tests/factories.py
  import factory
  from faker import Faker

  fake = Faker()

  class UserFactory(factory.Factory):
      class Meta:
          model = dict

      _id = factory.Sequence(lambda n: f"user_{n}")
      email = factory.LazyAttribute(lambda o: fake.email())
      name = factory.LazyAttribute(lambda o: fake.name())
      created_at = factory.LazyFunction(lambda: datetime.utcnow())
      preferences = factory.SubFactory(PreferencesFactory)

  class OrderFactory(factory.Factory):
      class Meta:
          model = dict

      _id = factory.Sequence(lambda n: f"order_{n}")
      user_id = factory.SubFactory(UserFactory).attribute("_id")
      total = factory.LazyAttribute(lambda o: round(fake.random.uniform(10, 500), 2))
      status = factory.Iterator(["pending", "shipped", "delivered"])
  ```

  **Compose the scenario inside a test:**

  ```python
  def test_user_with_orders(db):
      user = UserFactory()
      orders = OrderFactory.create_batch(3, user_id=user["_id"])
      db.users.insert_one(user)
      db.orders.insert_many(orders)

      response = api.get(f"/users/{user['_id']}/orders")
      assert response.status_code == 200
      assert len(response.json()["orders"]) == 3
  ```

  **Alternative via JSON fixtures (for legacy):**

  ```python
  @pytest.fixture
  def seed_users(db):
      with open("tests/fixtures/users.json") as f:
          db.users.insert_many(json.load(f))
  ```

  JSON-fixture risks: ID conflicts between tests, hard to version, no varied data — use only for "reference data" (countries, currencies).

  **Performance tips:**
  - **`insert_many`** instead of 100×`insert_one` — 10× faster
  - **`bulk_write`** for mixed create/update/delete
  - **Create indexes before seeding** — otherwise inserts trigger rebuilds
  - For very large fixtures — `mongoimport` of a JSON/BSON file

  **Snapshot strategy for very expensive seeds:**
  If a seed takes 30 s but is needed in 50 tests:
  1. Prepare the dataset in a session-fixture
  2. `mongodump` at session start
  3. Between tests, `mongorestore` (faster than full re-seed)

  **Anti-pattern:** seeding from a previous test. Tests become **order-dependent**. Better: full isolation via drop or transactions.
section: "mongodb"
order: 6
tags: [mongodb, test-data, fixtures, pytest]
type: "practical"
---
