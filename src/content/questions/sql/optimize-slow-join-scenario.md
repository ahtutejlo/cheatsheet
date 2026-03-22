---
ua_question: "Як оптимізувати повільний SQL-запит, який використовує JOIN на великих таблицях?"
en_question: "How would you optimize a slow SQL query that uses JOIN on large tables?"
ua_answer: |
  **Scenario:** Продакшн-запит з JOIN двох таблиць (orders: 10M рядків, customers: 1M рядків) виконується більше 30 секунд. Бізнес скаржиться на повільність звітів.

  **Approach:**
  1. Виконати EXPLAIN ANALYZE для розуміння плану виконання та виявлення вузьких місць
  2. Додати відсутні індекси на колонки JOIN та WHERE, використовуючи covering index для уникнення зайвих читань таблиці
  3. Розглянути матеріалізоване представлення для часто використовуваних звітів, щоб перенести навантаження з реального часу на фонове оновлення

  **Solution:**
  ```sql
  -- 1. Аналіз плану виконання
  EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
  SELECT c.name, COUNT(o.id), SUM(o.total)
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE o.created_at >= '2025-01-01'
  GROUP BY c.name;
  -- Seq Scan on orders (cost=0..185432 rows=10000000)
  -- -> Hash Join
  -- Execution Time: 32450.123 ms

  -- 2. Створення складеного covering index
  CREATE INDEX CONCURRENTLY idx_orders_customer_date
  ON orders (customer_id, created_at)
  INCLUDE (total, id);
  -- CONCURRENTLY дозволяє створювати індекс без блокування таблиці

  -- 3. Перевірка покращення
  EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
  SELECT c.name, COUNT(o.id), SUM(o.total)
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE o.created_at >= '2025-01-01'
  GROUP BY c.name;
  -- Index Scan using idx_orders_customer_date (cost=0..4523 rows=150000)
  -- Execution Time: 245.678 ms

  -- 4. Матеріалізоване представлення для часто використовуваних звітів
  CREATE MATERIALIZED VIEW monthly_customer_stats AS
  SELECT
      c.id AS customer_id,
      c.name,
      DATE_TRUNC('month', o.created_at) AS month,
      COUNT(o.id) AS order_count,
      SUM(o.total) AS total_spent
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  GROUP BY c.id, c.name, DATE_TRUNC('month', o.created_at);

  CREATE UNIQUE INDEX idx_monthly_stats
  ON monthly_customer_stats (customer_id, month);

  -- Оновлення матеріалізованого представлення (за розкладом)
  REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_customer_stats;
  ```

  Після додавання індексу час виконання зменшився з 32 секунд до 245 мілісекунд. Матеріалізоване представлення дає ще кращий результат для звітів, оскільки агрегація вже обчислена. Використовуйте `CONCURRENTLY` для обох операцій, щоб уникнути блокування продакшн-таблиць.
en_answer: |
  **Scenario:** A production query joining two tables (orders: 10M rows, customers: 1M rows) takes over 30 seconds. Business is complaining about slow reports.

  **Approach:**
  1. Run EXPLAIN ANALYZE to understand the execution plan and identify bottlenecks
  2. Add missing indexes on JOIN and WHERE columns, using a covering index to avoid unnecessary table reads
  3. Consider a materialized view for frequently used reports, shifting load from real-time to background refresh

  **Solution:**
  ```sql
  -- 1. Analyze execution plan
  EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
  SELECT c.name, COUNT(o.id), SUM(o.total)
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE o.created_at >= '2025-01-01'
  GROUP BY c.name;
  -- Seq Scan on orders (cost=0..185432 rows=10000000)
  -- -> Hash Join
  -- Execution Time: 32450.123 ms

  -- 2. Create composite covering index
  CREATE INDEX CONCURRENTLY idx_orders_customer_date
  ON orders (customer_id, created_at)
  INCLUDE (total, id);
  -- CONCURRENTLY allows creating index without locking the table

  -- 3. Verify improvement
  EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
  SELECT c.name, COUNT(o.id), SUM(o.total)
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE o.created_at >= '2025-01-01'
  GROUP BY c.name;
  -- Index Scan using idx_orders_customer_date (cost=0..4523 rows=150000)
  -- Execution Time: 245.678 ms

  -- 4. Materialized view for frequently used reports
  CREATE MATERIALIZED VIEW monthly_customer_stats AS
  SELECT
      c.id AS customer_id,
      c.name,
      DATE_TRUNC('month', o.created_at) AS month,
      COUNT(o.id) AS order_count,
      SUM(o.total) AS total_spent
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  GROUP BY c.id, c.name, DATE_TRUNC('month', o.created_at);

  CREATE UNIQUE INDEX idx_monthly_stats
  ON monthly_customer_stats (customer_id, month);

  -- Refresh materialized view (on schedule)
  REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_customer_stats;
  ```

  After adding the index, execution time dropped from 32 seconds to 245 milliseconds. The materialized view provides even better results for reports since aggregation is pre-computed. Use `CONCURRENTLY` for both operations to avoid locking production tables.
section: "sql"
order: 26
tags:
  - optimization
  - indexes
  - joins
type: "practical"
---
