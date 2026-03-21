---
ua_question: "Як працює оператор SELECT?"
en_question: "How does the SELECT statement work?"
ua_answer: |
  **SELECT** -- це основний оператор SQL для вибірки даних з таблиць. Він дозволяє вибирати конкретні стовпці, фільтрувати рядки, сортувати результати та обмежувати кількість записів.

  Порядок виконання SQL-запиту (логічний):
  1. `FROM` -- визначає джерело даних
  2. `WHERE` -- фільтрує рядки
  3. `GROUP BY` -- групує результати
  4. `HAVING` -- фільтрує групи
  5. `SELECT` -- вибирає стовпці
  6. `ORDER BY` -- сортує результати
  7. `LIMIT` / `OFFSET` -- обмежує кількість

  ```sql
  -- Базова вибірка
  SELECT name, email FROM users;

  -- Фільтрація та сортування
  SELECT name, salary
  FROM employees
  WHERE department = 'Engineering'
    AND salary > 50000
  ORDER BY salary DESC;

  -- Аліаси та вирази
  SELECT
      first_name || ' ' || last_name AS full_name,
      salary * 12 AS annual_salary
  FROM employees
  LIMIT 10 OFFSET 20;

  -- DISTINCT для унікальних значень
  SELECT DISTINCT department FROM employees;
  ```
en_answer: |
  **SELECT** is the primary SQL statement for querying data from tables. It allows you to select specific columns, filter rows, sort results, and limit the number of records.

  SQL query execution order (logical):
  1. `FROM` -- determines the data source
  2. `WHERE` -- filters rows
  3. `GROUP BY` -- groups results
  4. `HAVING` -- filters groups
  5. `SELECT` -- selects columns
  6. `ORDER BY` -- sorts results
  7. `LIMIT` / `OFFSET` -- limits quantity

  ```sql
  -- Basic query
  SELECT name, email FROM users;

  -- Filtering and sorting
  SELECT name, salary
  FROM employees
  WHERE department = 'Engineering'
    AND salary > 50000
  ORDER BY salary DESC;

  -- Aliases and expressions
  SELECT
      first_name || ' ' || last_name AS full_name,
      salary * 12 AS annual_salary
  FROM employees
  LIMIT 10 OFFSET 20;

  -- DISTINCT for unique values
  SELECT DISTINCT department FROM employees;
  ```
section: "sql"
order: 2
tags:
  - queries
---
