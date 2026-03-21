---
ua_question: "Які типи JOIN існують в SQL?"
en_question: "What types of JOINs exist in SQL?"
ua_answer: |
  **JOIN** -- це операція SQL для об'єднання даних з двох або більше таблиць на основі пов'язаних стовпців. Існує кілька типів JOIN.

  - **INNER JOIN** -- повертає лише рядки, що мають відповідність в обох таблицях
  - **LEFT JOIN** (LEFT OUTER JOIN) -- повертає всі рядки з лівої таблиці та відповідні з правої (NULL, якщо немає відповідності)
  - **RIGHT JOIN** (RIGHT OUTER JOIN) -- повертає всі рядки з правої таблиці та відповідні з лівої
  - **FULL OUTER JOIN** -- повертає всі рядки з обох таблиць (NULL для невідповідних)
  - **CROSS JOIN** -- декартовий добуток -- кожний рядок першої таблиці з кожним рядком другої
  - **SELF JOIN** -- з'єднання таблиці з самою собою

  ```sql
  -- INNER JOIN
  SELECT o.id, u.name, o.total
  FROM orders o
  INNER JOIN users u ON o.user_id = u.id;

  -- LEFT JOIN
  SELECT u.name, COUNT(o.id) AS order_count
  FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
  GROUP BY u.name;

  -- SELF JOIN (знайти менеджера кожного працівника)
  SELECT e.name AS employee, m.name AS manager
  FROM employees e
  LEFT JOIN employees m ON e.manager_id = m.id;
  ```
en_answer: |
  **JOIN** is an SQL operation for combining data from two or more tables based on related columns. There are several types of JOINs.

  - **INNER JOIN** -- returns only rows that have a match in both tables
  - **LEFT JOIN** (LEFT OUTER JOIN) -- returns all rows from the left table and matching rows from the right (NULL if no match)
  - **RIGHT JOIN** (RIGHT OUTER JOIN) -- returns all rows from the right table and matching rows from the left
  - **FULL OUTER JOIN** -- returns all rows from both tables (NULL for non-matching)
  - **CROSS JOIN** -- Cartesian product -- every row from the first table with every row from the second
  - **SELF JOIN** -- joining a table with itself

  ```sql
  -- INNER JOIN
  SELECT o.id, u.name, o.total
  FROM orders o
  INNER JOIN users u ON o.user_id = u.id;

  -- LEFT JOIN
  SELECT u.name, COUNT(o.id) AS order_count
  FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
  GROUP BY u.name;

  -- SELF JOIN (find each employee's manager)
  SELECT e.name AS employee, m.name AS manager
  FROM employees e
  LEFT JOIN employees m ON e.manager_id = m.id;
  ```
section: "sql"
order: 3
tags:
  - queries
---
