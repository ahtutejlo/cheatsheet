---
ua_question: "Як влаштований B-tree індекс зсередини і чому він забезпечує O(log n) пошук?"
en_question: "How does a B-tree index work internally and why does it provide O(log n) lookups?"
ua_answer: |
  **B-tree** (balanced tree) -- це самобалансуюча деревоподібна структура даних, яка використовується більшістю реляційних баз даних як структура індексу за замовчуванням. B-tree складається з трьох типів вузлів: **кореневий вузол** (root), **внутрішні вузли** (internal) та **листкові вузли** (leaf). Кожен вузол відповідає одній сторінці на диску (зазвичай 8 КБ у PostgreSQL, 16 КБ у MySQL InnoDB).

  Кореневий вузол містить ключі-розділювачі та вказівники на дочірні вузли. Внутрішні вузли також містять ключі та вказівники, формуючи ієрархію, яка звужує діапазон пошуку на кожному рівні. Листкові вузли містять фактичні проіндексовані значення та вказівники на рядки таблиці (або самі дані у випадку кластерного індексу). Листкові вузли з'єднані між собою у зв'язаний список, що дозволяє ефективний range scan.

  ```sql
  -- Створення B-tree індексу (тип за замовчуванням)
  CREATE INDEX idx_orders_date ON orders(created_at);

  -- Перегляд структури індексу в PostgreSQL
  SELECT * FROM bt_metap('idx_orders_date');
  -- level | root_blkno | ...
  -- Показує кількість рівнів дерева

  -- Аналіз використання індексу
  EXPLAIN (ANALYZE, BUFFERS)
  SELECT * FROM orders WHERE created_at = '2025-06-15';
  -- Index Scan using idx_orders_date
  -- Buffers: shared hit=3 (root -> internal -> leaf = 3 рівні)
  ```

  Пошук O(log n) досягається тому, що на кожному рівні дерева кількість кандидатів зменшується у B разів (де B -- порядок дерева, зазвичай сотні). Для таблиці з 10 мільйонами рядків дерево має лише 3-4 рівні, тобто будь-який рядок знаходиться за 3-4 дискових операцій. **Кластерний індекс** (clustered) зберігає дані рядків безпосередньо у листкових вузлах, а **некластерний** (non-clustered) зберігає вказівники на heap-рядки. **Index-only scan** відбувається, коли всі потрібні стовпці є в індексі, і читання таблиці не потрібне.
en_answer: |
  A **B-tree** (balanced tree) is a self-balancing tree data structure used by most relational databases as the default index structure. A B-tree consists of three types of nodes: **root node**, **internal nodes**, and **leaf nodes**. Each node corresponds to one disk page (typically 8 KB in PostgreSQL, 16 KB in MySQL InnoDB).

  The root node contains separator keys and pointers to child nodes. Internal nodes also contain keys and pointers, forming a hierarchy that narrows the search range at each level. Leaf nodes contain actual indexed values and pointers to table rows (or the data itself in the case of a clustered index). Leaf nodes are connected in a linked list, enabling efficient range scans.

  ```sql
  -- Create a B-tree index (default type)
  CREATE INDEX idx_orders_date ON orders(created_at);

  -- View index structure in PostgreSQL
  SELECT * FROM bt_metap('idx_orders_date');
  -- level | root_blkno | ...
  -- Shows the number of tree levels

  -- Analyze index usage
  EXPLAIN (ANALYZE, BUFFERS)
  SELECT * FROM orders WHERE created_at = '2025-06-15';
  -- Index Scan using idx_orders_date
  -- Buffers: shared hit=3 (root -> internal -> leaf = 3 levels)
  ```

  O(log n) lookup is achieved because at each tree level the number of candidates decreases by a factor of B (where B is the tree order, typically hundreds). For a table with 10 million rows, the tree has only 3-4 levels, meaning any row is found in 3-4 disk operations. A **clustered index** stores row data directly in leaf nodes, while a **non-clustered index** stores pointers to heap rows. An **index-only scan** occurs when all required columns are in the index, eliminating the need to read the table.
section: "sql"
order: 16
tags:
  - indexes
  - b-tree
  - internals
type: "deep"
---
