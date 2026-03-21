---
ua_question: "Як читати план виконання запиту?"
en_question: "How to read a query execution plan?"
ua_answer: |
  **План виконання запиту** (query execution plan) показує, як база даних планує виконати ваш SQL-запит. Це основний інструмент для оптимізації продуктивності запитів.

  ```sql
  -- Показати план без виконання
  EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

  -- Показати план з реальною статистикою
  EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
  ```

  **Ключові елементи плану:**
  - **Seq Scan** -- послідовне сканування всієї таблиці (повільно для великих таблиць)
  - **Index Scan** -- використання індексу для пошуку (швидко)
  - **Index Only Scan** -- всі дані отримані з індексу (найшвидше)
  - **Nested Loop** -- вкладені цикли для JOIN (ефективно для малих таблиць)
  - **Hash Join** -- хеш-з'єднання (ефективно для великих таблиць)
  - **Sort** -- сортування (може потребувати додаткової пам'яті)

  **Метрики:**
  - **cost** -- відносна вартість (startup cost..total cost)
  - **rows** -- очікувана кількість рядків
  - **actual time** -- реальний час виконання (з ANALYZE)
  - **loops** -- кількість повторень операції

  **Оптимізація:** якщо бачите Seq Scan на великій таблиці з фільтром -- створіть індекс. Якщо rows сильно відрізняється від actual rows -- оновіть статистику (`ANALYZE table_name`).
en_answer: |
  A **query execution plan** shows how the database plans to execute your SQL query. It is the primary tool for optimizing query performance.

  ```sql
  -- Show plan without executing
  EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

  -- Show plan with actual statistics
  EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
  ```

  **Key plan elements:**
  - **Seq Scan** -- sequential scan of the entire table (slow for large tables)
  - **Index Scan** -- using an index for lookup (fast)
  - **Index Only Scan** -- all data retrieved from the index (fastest)
  - **Nested Loop** -- nested loops for JOIN (efficient for small tables)
  - **Hash Join** -- hash join (efficient for large tables)
  - **Sort** -- sorting (may require additional memory)

  **Metrics:**
  - **cost** -- relative cost (startup cost..total cost)
  - **rows** -- estimated row count
  - **actual time** -- real execution time (with ANALYZE)
  - **loops** -- number of operation repetitions

  **Optimization:** if you see Seq Scan on a large table with a filter -- create an index. If rows differs significantly from actual rows -- update statistics (`ANALYZE table_name`).
section: "sql"
order: 15
tags:
  - performance
---
