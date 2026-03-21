---
ua_question: "Що таке Views в SQL?"
en_question: "What are Views in SQL?"
ua_answer: |
  **View** (представлення) -- це віртуальна таблиця, що базується на результаті SQL-запиту. View не зберігає дані фізично, а виконує збережений запит кожного разу при зверненні.

  **Переваги Views:**
  - **Спрощення запитів** -- складні запити з JOIN можна інкапсулювати у View
  - **Безпека** -- обмеження доступу до конкретних стовпців або рядків
  - **Абстракція** -- приховування складної структури таблиць
  - **Повторне використання** -- один View використовується у багатьох запитах

  ```sql
  -- Створення View
  CREATE VIEW active_employees AS
  SELECT
      e.id,
      e.name,
      d.name AS department,
      e.salary
  FROM employees e
  JOIN departments d ON e.department_id = d.id
  WHERE e.status = 'active';

  -- Використання View як звичайної таблиці
  SELECT * FROM active_employees
  WHERE department = 'Engineering';

  -- Materialized View (зберігає результат фізично)
  CREATE MATERIALIZED VIEW monthly_stats AS
  SELECT
      DATE_TRUNC('month', created_at) AS month,
      COUNT(*) AS orders,
      SUM(total) AS revenue
  FROM orders
  GROUP BY DATE_TRUNC('month', created_at);

  -- Оновлення Materialized View
  REFRESH MATERIALIZED VIEW monthly_stats;
  ```

  **Materialized View** -- на відміну від звичайного View, зберігає результат фізично та потребує явного оновлення (`REFRESH`). Використовується для складних аналітичних запитів.
en_answer: |
  A **View** is a virtual table based on the result of an SQL query. A View does not store data physically but executes the stored query each time it is accessed.

  **View advantages:**
  - **Query simplification** -- complex queries with JOINs can be encapsulated in a View
  - **Security** -- restrict access to specific columns or rows
  - **Abstraction** -- hide complex table structures
  - **Reusability** -- one View is used across many queries

  ```sql
  -- Create a View
  CREATE VIEW active_employees AS
  SELECT
      e.id,
      e.name,
      d.name AS department,
      e.salary
  FROM employees e
  JOIN departments d ON e.department_id = d.id
  WHERE e.status = 'active';

  -- Use a View like a regular table
  SELECT * FROM active_employees
  WHERE department = 'Engineering';

  -- Materialized View (stores results physically)
  CREATE MATERIALIZED VIEW monthly_stats AS
  SELECT
      DATE_TRUNC('month', created_at) AS month,
      COUNT(*) AS orders,
      SUM(total) AS revenue
  FROM orders
  GROUP BY DATE_TRUNC('month', created_at);

  -- Refresh Materialized View
  REFRESH MATERIALIZED VIEW monthly_stats;
  ```

  **Materialized View** -- unlike a regular View, stores results physically and requires explicit refresh (`REFRESH`). Used for complex analytical queries.
section: "sql"
order: 11
tags:
  - design
---
