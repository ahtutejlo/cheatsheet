---
company: "mongodb"
stage: "sdet-technical-screening"
ua_question: "Поясни aggregation pipeline в MongoDB і напиши запит, що групує замовлення по клієнту з підрахунком суми"
en_question: "Explain the aggregation pipeline in MongoDB and write a query that groups orders by customer with total sum"
ua_answer: |
  Aggregation pipeline — це фреймворк для обробки даних в MongoDB, де документи проходять через послідовність етапів (stages), кожен з яких трансформує дані.

  Основні етапи:
  - `$match` — фільтрація документів (аналог WHERE)
  - `$group` — групування та агрегація (аналог GROUP BY)
  - `$sort` — сортування
  - `$project` — вибір/трансформація полів
  - `$lookup` — JOIN з іншою колекцією
  - `$unwind` — розгортання масивів

  ```javascript
  db.orders.aggregate([
    { $match: { status: "completed" } },
    { $group: {
        _id: "$customerId",
        totalAmount: { $sum: "$amount" },
        orderCount: { $sum: 1 },
        avgOrder: { $avg: "$amount" }
    }},
    { $sort: { totalAmount: -1 } },
    { $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "customer"
    }},
    { $unwind: "$customer" },
    { $project: {
        customerName: "$customer.name",
        totalAmount: 1,
        orderCount: 1,
        avgOrder: { $round: ["$avgOrder", 2] }
    }}
  ])
  ```

  Pipeline оптимізується автоматично — MongoDB може переміщати `$match` ближче до початку для використання індексів.
en_answer: |
  The aggregation pipeline is a data processing framework in MongoDB where documents pass through a sequence of stages, each transforming the data.

  Key stages:
  - `$match` — filter documents (like WHERE)
  - `$group` — grouping and aggregation (like GROUP BY)
  - `$sort` — sorting
  - `$project` — field selection/transformation
  - `$lookup` — JOIN with another collection
  - `$unwind` — deconstruct arrays

  ```javascript
  db.orders.aggregate([
    { $match: { status: "completed" } },
    { $group: {
        _id: "$customerId",
        totalAmount: { $sum: "$amount" },
        orderCount: { $sum: 1 },
        avgOrder: { $avg: "$amount" }
    }},
    { $sort: { totalAmount: -1 } },
    { $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "customer"
    }},
    { $unwind: "$customer" },
    { $project: {
        customerName: "$customer.name",
        totalAmount: 1,
        orderCount: 1,
        avgOrder: { $round: ["$avgOrder", 2] }
    }}
  ])
  ```

  The pipeline is optimized automatically — MongoDB can move `$match` stages earlier to leverage indexes.
tags: [mongodb, aggregation, databases]
order: 1
---
