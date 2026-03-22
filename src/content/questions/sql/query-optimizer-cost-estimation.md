---
ua_question: "Як оптимізатор запитів оцінює вартість і обирає план виконання?"
en_question: "How does the query optimizer estimate costs and choose an execution plan?"
ua_answer: |
  **Оптимізатор запитів** (query optimizer) -- це компонент СУБД, який аналізує SQL-запит і генерує найефективніший план виконання. Він використовує **cost-based optimization** (CBO) -- оцінює вартість кожного можливого плану і обирає план з найнижчою вартістю. Вартість вимірюється в абстрактних одиницях, що відображають дисковий I/O, використання CPU та пам'яті.

  Для оцінки кількості рядків оптимізатор використовує **статистику таблиць**: загальну кількість рядків, кількість унікальних значень (n_distinct), **гістограми** розподілу значень та кореляцію між фізичним порядком рядків і значеннями стовпців. PostgreSQL зберігає цю статистику в `pg_statistic`, а оновлює її командою `ANALYZE`. Неточна статистика -- найчастіша причина поганих планів.

  ```sql
  -- Оновлення статистики таблиці
  ANALYZE orders;

  -- Перегляд статистики стовпця
  SELECT
      n_distinct,
      most_common_vals,
      most_common_freqs,
      histogram_bounds
  FROM pg_stats
  WHERE tablename = 'orders' AND attname = 'status';

  -- Аналіз плану виконання з деталями
  EXPLAIN (ANALYZE, COSTS, BUFFERS, FORMAT TEXT)
  SELECT o.id, c.name
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE o.status = 'pending' AND o.created_at > '2025-01-01';
  -- Hash Join (cost=1234.56..5678.90 rows=1500 width=36)
  --   -> Seq Scan on orders (estimated rows vs actual rows)
  --   -> Hash (customers)
  ```

  Оптимізатор обирає між алгоритмами з'єднання: **Nested Loop** (ефективний для малих таблиць або з індексом), **Hash Join** (ефективний для великих таблиць без індексу) та **Merge Join** (ефективний для попередньо відсортованих даних). Якщо `EXPLAIN ANALYZE` показує велику різницю між estimated rows і actual rows, це сигнал оновити статистику або збільшити `default_statistics_target` для кращої точності гістограм.
en_answer: |
  The **query optimizer** is a DBMS component that analyzes an SQL query and generates the most efficient execution plan. It uses **cost-based optimization** (CBO) -- estimating the cost of each possible plan and choosing the one with the lowest cost. Cost is measured in abstract units reflecting disk I/O, CPU usage, and memory.

  To estimate row counts, the optimizer uses **table statistics**: total row count, number of distinct values (n_distinct), value distribution **histograms**, and correlation between physical row order and column values. PostgreSQL stores this in `pg_statistic` and updates it via the `ANALYZE` command. Inaccurate statistics are the most common cause of poor plans.

  ```sql
  -- Update table statistics
  ANALYZE orders;

  -- View column statistics
  SELECT
      n_distinct,
      most_common_vals,
      most_common_freqs,
      histogram_bounds
  FROM pg_stats
  WHERE tablename = 'orders' AND attname = 'status';

  -- Analyze execution plan with details
  EXPLAIN (ANALYZE, COSTS, BUFFERS, FORMAT TEXT)
  SELECT o.id, c.name
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE o.status = 'pending' AND o.created_at > '2025-01-01';
  -- Hash Join (cost=1234.56..5678.90 rows=1500 width=36)
  --   -> Seq Scan on orders (estimated rows vs actual rows)
  --   -> Hash (customers)
  ```

  The optimizer chooses between join algorithms: **Nested Loop** (efficient for small tables or with an index), **Hash Join** (efficient for large tables without an index), and **Merge Join** (efficient for pre-sorted data). If `EXPLAIN ANALYZE` shows a large discrepancy between estimated rows and actual rows, it signals the need to update statistics or increase `default_statistics_target` for better histogram accuracy.
section: "sql"
order: 18
tags:
  - optimizer
  - query-planning
  - performance
type: "deep"
---
