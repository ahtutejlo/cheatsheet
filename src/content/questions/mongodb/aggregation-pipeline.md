---
ua_question: "Як працює MongoDB aggregation pipeline?"
en_question: "How does the MongoDB aggregation pipeline work?"
ua_answer: |
  Aggregation pipeline — основний інструмент для аналітичних запитів у MongoDB. Це послідовність **stages**, кожен бере документи на вході і віддає трансформовані документи далі. По суті — це функціональний потік: filter → group → project → sort.

  **Базові stages:**
  - **`$match`** — фільтр (як `WHERE` у SQL). Має йти першим для performance — використає індекси.
  - **`$project`** — вибрати/перейменувати/обчислити поля
  - **`$group`** — агрегувати (sum, avg, count) по ключу
  - **`$sort`** — сортувати; `$limit` — обмежити; `$skip` — пагінація
  - **`$lookup`** — join з іншою колекцією (left outer)
  - **`$unwind`** — розгорнути масив у окремі документи
  - **`$addFields` / `$set`** — додати обчислене поле без видалення інших

  ```javascript
  // Топ-5 категорій за виторгом за квартал
  db.orders.aggregate([
    {
      $match: {
        placedAt: {
          $gte: ISODate("2024-01-01"),
          $lt:  ISODate("2024-04-01")
        },
        status: "completed"
      }
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.category",
        revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
        orderCount: { $addToSet: "$_id" }
      }
    },
    {
      $project: {
        category: "$_id",
        revenue: 1,
        uniqueOrders: { $size: "$orderCount" },
        _id: 0
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 }
  ])
  ```

  **Порядок має значення для перформансу:**
  1. **`$match` найперше** — щоб скоротити working set
  2. **`$sort` перед `$group`** — якщо є індекс по sort key, оптимізатор використає
  3. **`$project` ранній** — щоб не возити непотрібні поля через pipeline
  4. **`$lookup` пізно** — після фільтрації, бо це найдорожчий stage

  **`explain()`** показує план — стежте, які stages мають `IXSCAN` (index used) vs `COLLSCAN` (full scan):

  ```javascript
  db.orders.explain("executionStats").aggregate([...])
  ```

  **Window functions** (з 5.0): `$setWindowFields` дає running totals, ranks, moving averages — раніше це було tricky без них.

  **Для тестів:**
  - Aggregation queries — типове джерело performance regressions; покривайте їх micro-benchmarks
  - Тестуйте edge cases: пусті колекції, `null` значення, missing fields (Mongo толерує, але результат може бути несподіваний)
en_answer: |
  The aggregation pipeline is MongoDB's core tool for analytical queries. It's a sequence of **stages**, each taking documents as input and emitting transformed documents downstream. Essentially a functional flow: filter → group → project → sort.

  **Core stages:**
  - **`$match`** — filter (like SQL `WHERE`). Put it first for performance — it can use indexes.
  - **`$project`** — pick/rename/compute fields
  - **`$group`** — aggregate (sum, avg, count) by key
  - **`$sort`** — sort; `$limit` — cap; `$skip` — pagination
  - **`$lookup`** — join with another collection (left outer)
  - **`$unwind`** — explode an array into separate documents
  - **`$addFields` / `$set`** — add a computed field without dropping others

  ```javascript
  // Top-5 categories by revenue this quarter
  db.orders.aggregate([
    {
      $match: {
        placedAt: {
          $gte: ISODate("2024-01-01"),
          $lt:  ISODate("2024-04-01")
        },
        status: "completed"
      }
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.category",
        revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
        orderCount: { $addToSet: "$_id" }
      }
    },
    {
      $project: {
        category: "$_id",
        revenue: 1,
        uniqueOrders: { $size: "$orderCount" },
        _id: 0
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 }
  ])
  ```

  **Order matters for performance:**
  1. **`$match` first** — shrink the working set early
  2. **`$sort` before `$group`** — if a sort-key index exists, the optimizer can use it
  3. **`$project` early** — don't carry useless fields through the pipeline
  4. **`$lookup` late** — after filtering, because it's the most expensive stage

  **`explain()`** shows the plan — watch which stages do `IXSCAN` (index used) vs `COLLSCAN` (full scan):

  ```javascript
  db.orders.explain("executionStats").aggregate([...])
  ```

  **Window functions** (since 5.0): `$setWindowFields` provides running totals, ranks, moving averages — previously these were hard to implement.

  **For testing:**
  - Aggregation queries are a typical source of performance regressions; cover them with micro-benchmarks
  - Test edge cases: empty collections, `null` values, missing fields (Mongo tolerates them, but results can surprise)
section: "mongodb"
order: 2
tags: [mongodb, aggregation, performance]
---
