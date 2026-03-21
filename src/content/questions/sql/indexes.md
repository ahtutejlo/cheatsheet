---
ua_question: "Що таке індекси і навіщо вони потрібні?"
en_question: "What are indexes and why are they needed?"
ua_answer: |
  **Індекс** -- це структура даних, що прискорює пошук та вибірку рядків з таблиці. Без індексу база даних виконує **full table scan** -- послідовний перегляд усіх рядків. З індексом пошук виконується за O(log n).

  **Типи індексів:**
  - **B-Tree** (за замовчуванням) -- збалансоване дерево, ефективне для порівнянь (`=`, `<`, `>`, `BETWEEN`)
  - **Hash** -- хеш-таблиця, ефективна лише для точного пошуку (`=`)
  - **GIN** (Generalized Inverted Index) -- для повнотекстового пошуку та масивів
  - **GiST** -- для геометричних даних та діапазонів

  ```sql
  -- Створення індексу
  CREATE INDEX idx_users_email ON users(email);

  -- Складений індекс (порядок стовпців має значення)
  CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

  -- Унікальний індекс
  CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

  -- Частковий індекс (тільки для активних)
  CREATE INDEX idx_active_users ON users(email)
  WHERE status = 'active';

  -- Перевірка використання індексу
  EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
  ```

  **Коли НЕ створювати індекси:** на малих таблицях, на стовпцях з низькою кардинальністю (наприклад, boolean), на таблицях з частими INSERT/UPDATE (індекси сповільнюють запис).
en_answer: |
  An **index** is a data structure that speeds up searching and retrieving rows from a table. Without an index, the database performs a **full table scan** -- sequential review of all rows. With an index, search is performed in O(log n).

  **Types of indexes:**
  - **B-Tree** (default) -- balanced tree, efficient for comparisons (`=`, `<`, `>`, `BETWEEN`)
  - **Hash** -- hash table, efficient only for exact lookups (`=`)
  - **GIN** (Generalized Inverted Index) -- for full-text search and arrays
  - **GiST** -- for geometric data and ranges

  ```sql
  -- Create an index
  CREATE INDEX idx_users_email ON users(email);

  -- Composite index (column order matters)
  CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

  -- Unique index
  CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

  -- Partial index (only for active records)
  CREATE INDEX idx_active_users ON users(email)
  WHERE status = 'active';

  -- Check index usage
  EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
  ```

  **When NOT to create indexes:** on small tables, on columns with low cardinality (e.g., boolean), on tables with frequent INSERT/UPDATE (indexes slow down writes).
section: "sql"
order: 6
tags:
  - performance
---
