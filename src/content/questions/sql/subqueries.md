---
ua_question: "Що таке підзапити в SQL?"
en_question: "What are subqueries in SQL?"
ua_answer: |
  **Підзапит** (subquery) -- це SQL-запит, вкладений всередину іншого запиту. Підзапити можуть використовуватися у `WHERE`, `FROM`, `SELECT` та `HAVING` частинах основного запиту.

  **Типи підзапитів:**
  - **Скалярний** -- повертає одне значення
  - **Рядковий** -- повертає один рядок з кількома стовпцями
  - **Табличний** -- повертає набір рядків (використовується як тимчасова таблиця)
  - **Корельований** -- посилається на стовпці зовнішнього запиту (виконується для кожного рядка)

  ```sql
  -- Скалярний підзапит у WHERE
  SELECT name, salary
  FROM employees
  WHERE salary > (SELECT AVG(salary) FROM employees);

  -- Підзапит з IN
  SELECT name FROM users
  WHERE id IN (
      SELECT user_id FROM orders
      WHERE total > 1000
  );

  -- Підзапит у FROM (derived table)
  SELECT department, avg_salary
  FROM (
      SELECT department, AVG(salary) AS avg_salary
      FROM employees
      GROUP BY department
  ) AS dept_stats
  WHERE avg_salary > 60000;

  -- Корельований підзапит з EXISTS
  SELECT u.name FROM users u
  WHERE EXISTS (
      SELECT 1 FROM orders o
      WHERE o.user_id = u.id AND o.total > 500
  );
  ```
en_answer: |
  A **subquery** is an SQL query nested inside another query. Subqueries can be used in the `WHERE`, `FROM`, `SELECT`, and `HAVING` parts of the main query.

  **Types of subqueries:**
  - **Scalar** -- returns a single value
  - **Row** -- returns a single row with multiple columns
  - **Table** -- returns a set of rows (used as a temporary table)
  - **Correlated** -- references columns from the outer query (executes for each row)

  ```sql
  -- Scalar subquery in WHERE
  SELECT name, salary
  FROM employees
  WHERE salary > (SELECT AVG(salary) FROM employees);

  -- Subquery with IN
  SELECT name FROM users
  WHERE id IN (
      SELECT user_id FROM orders
      WHERE total > 1000
  );

  -- Subquery in FROM (derived table)
  SELECT department, avg_salary
  FROM (
      SELECT department, AVG(salary) AS avg_salary
      FROM employees
      GROUP BY department
  ) AS dept_stats
  WHERE avg_salary > 60000;

  -- Correlated subquery with EXISTS
  SELECT u.name FROM users u
  WHERE EXISTS (
      SELECT 1 FROM orders o
      WHERE o.user_id = u.id AND o.total > 500
  );
  ```
section: "sql"
order: 5
tags:
  - queries
---
