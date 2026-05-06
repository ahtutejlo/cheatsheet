---
ua_question: "Які бувають індекси у MongoDB і як їх використовувати?"
en_question: "What indexes does MongoDB support and how to use them?"
ua_answer: |
  Індекси — основний важіль перформансу в MongoDB. Без них кожен `find` робить `COLLSCAN` — повне сканування колекції. З правильними — мілісекунди на мільйонах документів.

  **Типи індексів:**

  **Single field** — найпростіший:
  ```javascript
  db.users.createIndex({ email: 1 })  // 1 = ascending
  db.users.find({ email: "a@b.com" })  // IXSCAN
  ```

  **Compound (composite)** — кілька полів. Порядок критичний — підтримує запити на префікс:
  ```javascript
  db.orders.createIndex({ userId: 1, placedAt: -1 })
  // підтримує: { userId }, { userId, placedAt }
  // НЕ підтримує: { placedAt } без userId
  db.orders.find({ userId: "u_123" }).sort({ placedAt: -1 })  // perfect
  ```

  **Multikey** — автоматично, коли індексуєте поле-масив. Кожен елемент масиву отримує запис в індексі:
  ```javascript
  db.posts.createIndex({ tags: 1 })
  db.posts.find({ tags: "mongodb" })  // знайде всі документи з "mongodb" у tags
  ```

  **Text** — full-text search:
  ```javascript
  db.articles.createIndex({ title: "text", body: "text" })
  db.articles.find({ $text: { $search: "performance tuning" } })
  ```

  **TTL (Time-To-Live)** — документи автоматично видаляються після X секунд:
  ```javascript
  db.sessions.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 3600 }  // годину
  )
  ```
  Корисно для test data, sessions, audit logs з обмеженою retention.

  **Partial / sparse** — індекс лише по підмножині:
  ```javascript
  // індексувати тільки активних користувачів
  db.users.createIndex(
    { lastLogin: 1 },
    { partialFilterExpression: { active: true } }
  )
  ```

  **Hashed** — для рівномірного шардингу (sharded cluster):
  ```javascript
  db.events.createIndex({ userId: "hashed" })
  ```

  **Unique** — гарантує унікальність:
  ```javascript
  db.users.createIndex({ email: 1 }, { unique: true })
  ```

  **ESR-правило (Equality, Sort, Range)** для compound індексів — порядок полів:
  1. **Equality** першим (`status: "active"`)
  2. **Sort** другим (`createdAt: -1`)
  3. **Range** останнім (`age: { $gt: 18 }`)

  ```javascript
  // Запит:
  db.users.find({ status: "active", age: { $gt: 18 } }).sort({ createdAt: -1 })
  // Оптимальний індекс:
  db.users.createIndex({ status: 1, createdAt: -1, age: 1 })
  ```

  **Перевірка плану:**
  ```javascript
  db.users.find({ email: "a@b.com" }).explain("executionStats")
  // дивіться: stage = IXSCAN (good) або COLLSCAN (bad)
  // totalKeysExamined / totalDocsExamined / nReturned
  ```

  **Підводні камені:**
  - Кожен індекс уповільнює writes (треба оновлювати індекс)
  - Мульти-key + великі масиви = роздуття індексу (1 doc → 1000 entries)
  - Indexes займають RAM — більше індексів означає менше місця для working set
  - Не індексуйте поля з низькою кардинальністю (booleans без partial filter)
en_answer: |
  Indexes are the main performance lever in MongoDB. Without them every `find` does a `COLLSCAN` — a full collection scan. With proper ones — milliseconds on millions of documents.

  **Index types:**

  **Single field** — simplest:
  ```javascript
  db.users.createIndex({ email: 1 })  // 1 = ascending
  db.users.find({ email: "a@b.com" })  // IXSCAN
  ```

  **Compound (composite)** — multiple fields. Order is critical — supports queries on the prefix:
  ```javascript
  db.orders.createIndex({ userId: 1, placedAt: -1 })
  // supports: { userId }, { userId, placedAt }
  // does NOT support: { placedAt } alone
  db.orders.find({ userId: "u_123" }).sort({ placedAt: -1 })  // perfect
  ```

  **Multikey** — automatic when you index an array field. Each array element gets an index entry:
  ```javascript
  db.posts.createIndex({ tags: 1 })
  db.posts.find({ tags: "mongodb" })  // finds all docs with "mongodb" in tags
  ```

  **Text** — full-text search:
  ```javascript
  db.articles.createIndex({ title: "text", body: "text" })
  db.articles.find({ $text: { $search: "performance tuning" } })
  ```

  **TTL (Time-To-Live)** — documents auto-deleted after X seconds:
  ```javascript
  db.sessions.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 3600 }  // one hour
  )
  ```
  Handy for test data, sessions, audit logs with limited retention.

  **Partial / sparse** — index only a subset:
  ```javascript
  // index only active users
  db.users.createIndex(
    { lastLogin: 1 },
    { partialFilterExpression: { active: true } }
  )
  ```

  **Hashed** — for even sharding distribution:
  ```javascript
  db.events.createIndex({ userId: "hashed" })
  ```

  **Unique** — uniqueness guarantee:
  ```javascript
  db.users.createIndex({ email: 1 }, { unique: true })
  ```

  **ESR rule (Equality, Sort, Range)** for compound indexes — field order:
  1. **Equality** first (`status: "active"`)
  2. **Sort** second (`createdAt: -1`)
  3. **Range** last (`age: { $gt: 18 }`)

  ```javascript
  // Query:
  db.users.find({ status: "active", age: { $gt: 18 } }).sort({ createdAt: -1 })
  // Optimal index:
  db.users.createIndex({ status: 1, createdAt: -1, age: 1 })
  ```

  **Inspect the plan:**
  ```javascript
  db.users.find({ email: "a@b.com" }).explain("executionStats")
  // look at: stage = IXSCAN (good) or COLLSCAN (bad)
  // totalKeysExamined / totalDocsExamined / nReturned
  ```

  **Pitfalls:**
  - Every index slows writes (the index must be updated)
  - Multikey + large arrays = index bloat (1 doc → 1000 entries)
  - Indexes consume RAM — more indexes means less room for the working set
  - Don't index low-cardinality fields (booleans without partial filter)
section: "mongodb"
order: 3
tags: [mongodb, indexes, performance]
---
