---
ua_question: "Що таке віконні функції?"
en_question: "What are window functions?"
ua_answer: |
  **Віконні функції** (window functions) виконують обчислення по набору рядків, пов'язаних з поточним рядком, без групування результатів. На відміну від агрегатних функцій з GROUP BY, віконні функції зберігають кожний рядок у результаті.

  Синтаксис: `function() OVER (PARTITION BY ... ORDER BY ... ROWS/RANGE ...)`

  **Основні віконні функції:**
  - **ROW_NUMBER()** -- порядковий номер рядка
  - **RANK()** -- ранг з пропусками при дублікатах
  - **DENSE_RANK()** -- ранг без пропусків
  - **LAG() / LEAD()** -- значення попереднього / наступного рядка
  - **SUM() OVER()** -- накопичувальна сума
  - **NTILE(n)** -- розподіл рядків на n груп

  ```sql
  -- Ранжування по зарплаті у кожному відділі
  SELECT
      name,
      department,
      salary,
      ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank,
      AVG(salary) OVER (PARTITION BY department) AS dept_avg
  FROM employees;

  -- Порівняння з попереднім місяцем
  SELECT
      month,
      revenue,
      LAG(revenue) OVER (ORDER BY month) AS prev_month,
      revenue - LAG(revenue) OVER (ORDER BY month) AS growth
  FROM monthly_sales;

  -- Накопичувальна сума
  SELECT
      date,
      amount,
      SUM(amount) OVER (ORDER BY date) AS running_total
  FROM transactions;
  ```
en_answer: |
  **Window functions** perform calculations across a set of rows related to the current row without grouping results. Unlike aggregate functions with GROUP BY, window functions preserve each row in the output.

  Syntax: `function() OVER (PARTITION BY ... ORDER BY ... ROWS/RANGE ...)`

  **Main window functions:**
  - **ROW_NUMBER()** -- sequential row number
  - **RANK()** -- rank with gaps for duplicates
  - **DENSE_RANK()** -- rank without gaps
  - **LAG() / LEAD()** -- previous / next row value
  - **SUM() OVER()** -- cumulative sum
  - **NTILE(n)** -- distribute rows into n groups

  ```sql
  -- Rank by salary within each department
  SELECT
      name,
      department,
      salary,
      ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank,
      AVG(salary) OVER (PARTITION BY department) AS dept_avg
  FROM employees;

  -- Compare with previous month
  SELECT
      month,
      revenue,
      LAG(revenue) OVER (ORDER BY month) AS prev_month,
      revenue - LAG(revenue) OVER (ORDER BY month) AS growth
  FROM monthly_sales;

  -- Running total
  SELECT
      date,
      amount,
      SUM(amount) OVER (ORDER BY date) AS running_total
  FROM transactions;
  ```
section: "sql"
order: 13
tags:
  - advanced
---
