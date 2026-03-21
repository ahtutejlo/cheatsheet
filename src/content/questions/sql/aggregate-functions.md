---
ua_question: "Які агрегатні функції є в SQL?"
en_question: "What aggregate functions exist in SQL?"
ua_answer: |
  **Агрегатні функції** обчислюють одне значення з набору рядків. Вони зазвичай використовуються з `GROUP BY` для обчислення значень по групах.

  Основні агрегатні функції:
  - **COUNT()** -- кількість рядків
  - **SUM()** -- сума значень
  - **AVG()** -- середнє значення
  - **MAX()** -- максимальне значення
  - **MIN()** -- мінімальне значення

  ```sql
  -- Базове використання
  SELECT
      COUNT(*) AS total_orders,
      COUNT(DISTINCT user_id) AS unique_customers,
      SUM(total) AS revenue,
      AVG(total) AS avg_order,
      MAX(total) AS largest_order,
      MIN(total) AS smallest_order
  FROM orders;

  -- З GROUP BY
  SELECT
      department,
      COUNT(*) AS employees,
      ROUND(AVG(salary), 2) AS avg_salary,
      SUM(salary) AS total_payroll
  FROM employees
  GROUP BY department
  ORDER BY avg_salary DESC;

  -- COUNT з різними варіантами
  SELECT
      COUNT(*) AS all_rows,            -- включає NULL
      COUNT(email) AS with_email,       -- виключає NULL
      COUNT(DISTINCT city) AS cities    -- унікальні значення
  FROM users;
  ```

  **Важливо:** `NULL` значення ігноруються агрегатними функціями (окрім `COUNT(*)`). `AVG` з NULL значеннями обчислює середнє лише з ненульових значень.
en_answer: |
  **Aggregate functions** compute a single value from a set of rows. They are typically used with `GROUP BY` to calculate values per group.

  Main aggregate functions:
  - **COUNT()** -- number of rows
  - **SUM()** -- sum of values
  - **AVG()** -- average value
  - **MAX()** -- maximum value
  - **MIN()** -- minimum value

  ```sql
  -- Basic usage
  SELECT
      COUNT(*) AS total_orders,
      COUNT(DISTINCT user_id) AS unique_customers,
      SUM(total) AS revenue,
      AVG(total) AS avg_order,
      MAX(total) AS largest_order,
      MIN(total) AS smallest_order
  FROM orders;

  -- With GROUP BY
  SELECT
      department,
      COUNT(*) AS employees,
      ROUND(AVG(salary), 2) AS avg_salary,
      SUM(salary) AS total_payroll
  FROM employees
  GROUP BY department
  ORDER BY avg_salary DESC;

  -- COUNT variations
  SELECT
      COUNT(*) AS all_rows,            -- includes NULL
      COUNT(email) AS with_email,       -- excludes NULL
      COUNT(DISTINCT city) AS cities    -- unique values
  FROM users;
  ```

  **Important:** `NULL` values are ignored by aggregate functions (except `COUNT(*)`). `AVG` with NULL values computes the average only from non-null values.
section: "sql"
order: 10
tags:
  - queries
---
