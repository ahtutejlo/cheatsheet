---
ua_question: "MongoDB vs Postgres: коли і що обирати?"
en_question: "MongoDB vs Postgres: when to choose which?"
ua_answer: |
  Питання типу "SQL vs NoSQL" застаріле — обидва зараз вміють і JSON, і транзакції. Сучасний вибір — про модель даних, паттерни доступу і операційний tooling, не про фічі.

  **Postgres** — relational з потужною підтримкою JSON (`jsonb`), GIN-індексами, full-text search. Сильна гарантія транзакцій (ACID), складні джоїни, foreign keys, mature replication.

  **Підходить, коли:**
  - Дані мають жорсткий schema і складні відношення (users ↔ orders ↔ products)
  - Потрібні multi-row транзакції з сильною ізоляцією
  - Аналітика з джоїнами і агрегаціями (з матвьюшками вмикає сильно)
  - Команда вже вміє SQL і tooling (psql, pgAdmin, EXPLAIN, pg_stat_statements)

  **MongoDB** — document store з нативним JSON (BSON), гнучким schema, sharding як first-class, aggregation pipeline. Distributed by design.

  **Підходить, коли:**
  - Документи мають varied shape (catalog items, event logs, IoT readings)
  - Потрібно горизонтальне масштабування записів через sharding
  - Часто додаються нові поля без міграцій
  - Read-heavy workload з denormalized документами (один find замість 5 джоїнів)
  - Time-series/analytics через aggregation pipeline

  **Чого MongoDB **не** робить добре:**
  - Складні аналітичні запити з 10+ джоїнами — Postgres швидший
  - Сильні multi-collection транзакції — є, але coordinator overhead помітний
  - Звичайний reporting — без `$lookup` (мовляв join) часто неможливо

  ```javascript
  // Mongo: денормалізований document
  {
    _id: ObjectId(),
    userId: "u_123",
    items: [
      { sku: "A1", qty: 2, snapshot: { name: "Widget", price: 10 } },
      { sku: "B2", qty: 1, snapshot: { name: "Gadget", price: 25 } }
    ],
    total: 45,
    placedAt: ISODate("2024-01-15T10:00:00Z")
  }
  // одна find() — повний order, без join до products
  db.orders.find({ userId: "u_123" })
  ```

  ```sql
  -- Postgres: нормалізована схема
  SELECT o.id, oi.sku, oi.qty, p.name, p.price
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN products p ON p.sku = oi.sku
  WHERE o.user_id = 'u_123';
  ```

  **Для тестів:**
  - Mongo тести часто простіші, бо документ — самодостатній (не треба seedити 5 таблиць)
  - Postgres тести вимагають акуратної міграції schema між test runs
  - Оба підтримують ефемерні бази через Docker (`mongo:7`, `postgres:16`) — стандарт у CI

  **Часта реальність:** Postgres для transactional core (users, orders, billing), Mongo для analytics/event store/catalog — обидва в одному продукті.
en_answer: |
  The "SQL vs NoSQL" question is outdated — both now do JSON and transactions. The modern choice is about data model, access patterns, and operational tooling, not features.

  **Postgres** — relational with strong JSON support (`jsonb`), GIN indexes, full-text search. Strong transactional guarantees (ACID), complex joins, foreign keys, mature replication.

  **Pick it when:**
  - Data has a strict schema and complex relationships (users ↔ orders ↔ products)
  - You need multi-row transactions with strong isolation
  - Analytics with joins and aggregations (materialized views are powerful)
  - The team already knows SQL and tooling (psql, pgAdmin, EXPLAIN, pg_stat_statements)

  **MongoDB** — document store with native JSON (BSON), flexible schema, first-class sharding, aggregation pipeline. Distributed by design.

  **Pick it when:**
  - Documents have varied shape (catalog items, event logs, IoT readings)
  - You need horizontal write scale through sharding
  - New fields are added often without migrations
  - Read-heavy workload with denormalized documents (one find instead of 5 joins)
  - Time-series / analytics via aggregation pipeline

  **What MongoDB **doesn't** do well:**
  - Complex analytical queries with 10+ joins — Postgres wins
  - Strong multi-collection transactions — supported, but coordinator overhead is noticeable
  - Routine reporting — without `$lookup` (i.e., join) it's often impossible

  ```javascript
  // Mongo: denormalized document
  {
    _id: ObjectId(),
    userId: "u_123",
    items: [
      { sku: "A1", qty: 2, snapshot: { name: "Widget", price: 10 } },
      { sku: "B2", qty: 1, snapshot: { name: "Gadget", price: 25 } }
    ],
    total: 45,
    placedAt: ISODate("2024-01-15T10:00:00Z")
  }
  // one find() — full order, no product join
  db.orders.find({ userId: "u_123" })
  ```

  ```sql
  -- Postgres: normalized schema
  SELECT o.id, oi.sku, oi.qty, p.name, p.price
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN products p ON p.sku = oi.sku
  WHERE o.user_id = 'u_123';
  ```

  **For tests:**
  - Mongo tests are often simpler because the document is self-contained (no need to seed 5 tables)
  - Postgres tests require careful schema migration between test runs
  - Both support ephemeral databases via Docker (`mongo:7`, `postgres:16`) — standard in CI

  **The common reality:** Postgres for the transactional core (users, orders, billing), Mongo for analytics / event store / catalog — both in the same product.
section: "mongodb"
order: 1
tags: [mongodb, postgres, database-comparison, fundamentals]
---
