---
ua_question: "Чи правда, що корельовані підзапити завжди повільніші за JOIN?"
en_question: "Is it true that correlated subqueries are always slower than JOINs?"
ua_answer: |
  > **Trap:** Поширена порада -- завжди замінювати корельовані підзапити на JOIN для кращої продуктивності. Насправді сучасні оптимізатори часто трансформують підзапити в JOIN автоматично, а в деяких випадках EXISTS з корельованим підзапитом працює швидше.

  Корельований підзапит виконується для кожного рядка зовнішнього запиту, що в наївній реалізації дає O(n * m) складність. Але сучасні оптимізатори (PostgreSQL, MySQL 8.0+, SQL Server) вміють перетворювати корельовані підзапити в semi-join або anti-join, що робить їх еквівалентними JOIN за продуктивністю. Оптимізатор аналізує план і обирає найефективнішу стратегію.

  ```sql
  -- Корельований підзапит з EXISTS (часто ефективний для semi-join)
  SELECT c.name, c.email
  FROM customers c
  WHERE EXISTS (
      SELECT 1 FROM orders o
      WHERE o.customer_id = c.id
      AND o.total > 1000
  );
  -- Оптимізатор може перетворити в Semi Hash Join

  -- Еквівалентний JOIN (може бути менш ефективним через дедуплікацію)
  SELECT DISTINCT c.name, c.email
  FROM customers c
  JOIN orders o ON o.customer_id = c.id
  WHERE o.total > 1000;
  -- DISTINCT додає додаткову вартість!

  -- Порівняння планів
  EXPLAIN ANALYZE
  SELECT * FROM products p
  WHERE EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);

  EXPLAIN ANALYZE
  SELECT DISTINCT p.*
  FROM products p
  JOIN order_items oi ON oi.product_id = p.id;

  -- NOT EXISTS vs LEFT JOIN WHERE NULL (anti-join)
  -- NOT EXISTS часто ефективніший
  SELECT c.name FROM customers c
  WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
  ```

  Правило: використовуйте EXISTS/NOT EXISTS для перевірки наявності (semi-join/anti-join), а JOIN -- коли потрібні дані з обох таблиць. Завжди перевіряйте EXPLAIN ANALYZE замість покладатися на загальні правила -- реальна продуктивність залежить від розміру таблиць, індексів та статистики.
en_answer: |
  > **Trap:** Common advice is to always replace correlated subqueries with JOINs for better performance. In reality, modern optimizers often transform subqueries into JOINs automatically, and in some cases EXISTS with a correlated subquery performs faster.

  A correlated subquery executes for each row of the outer query, which in a naive implementation gives O(n * m) complexity. But modern optimizers (PostgreSQL, MySQL 8.0+, SQL Server) can transform correlated subqueries into semi-joins or anti-joins, making them equivalent to JOINs in performance. The optimizer analyzes the plan and chooses the most efficient strategy.

  ```sql
  -- Correlated subquery with EXISTS (often efficient for semi-join)
  SELECT c.name, c.email
  FROM customers c
  WHERE EXISTS (
      SELECT 1 FROM orders o
      WHERE o.customer_id = c.id
      AND o.total > 1000
  );
  -- Optimizer may convert to Semi Hash Join

  -- Equivalent JOIN (may be less efficient due to deduplication)
  SELECT DISTINCT c.name, c.email
  FROM customers c
  JOIN orders o ON o.customer_id = c.id
  WHERE o.total > 1000;
  -- DISTINCT adds extra cost!

  -- Compare plans
  EXPLAIN ANALYZE
  SELECT * FROM products p
  WHERE EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);

  EXPLAIN ANALYZE
  SELECT DISTINCT p.*
  FROM products p
  JOIN order_items oi ON oi.product_id = p.id;

  -- NOT EXISTS vs LEFT JOIN WHERE NULL (anti-join)
  -- NOT EXISTS is often more efficient
  SELECT c.name FROM customers c
  WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
  ```

  Rule of thumb: use EXISTS/NOT EXISTS for existence checks (semi-join/anti-join), and JOIN when you need data from both tables. Always check EXPLAIN ANALYZE instead of relying on general rules -- actual performance depends on table sizes, indexes, and statistics.
section: "sql"
order: 24
tags:
  - subqueries
  - performance
  - optimization
type: "trick"
---
