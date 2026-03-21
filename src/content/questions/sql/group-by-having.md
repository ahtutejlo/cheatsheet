---
ua_question: "Як працюють GROUP BY та HAVING?"
en_question: "How do GROUP BY and HAVING work?"
ua_answer: |
  **GROUP BY** групує рядки з однаковими значеннями у зведені рядки. Зазвичай використовується з агрегатними функціями (`COUNT`, `SUM`, `AVG`, `MAX`, `MIN`) для обчислення значень для кожної групи.

  **HAVING** фільтрує групи після агрегації, на відміну від `WHERE`, який фільтрує рядки до групування.

  Порядок: `WHERE` (фільтр рядків) -> `GROUP BY` (групування) -> `HAVING` (фільтр груп)

  ```sql
  -- Кількість замовлень по клієнтах
  SELECT user_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY user_id;

  -- Клієнти з більш ніж 5 замовленнями
  SELECT user_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY user_id
  HAVING COUNT(*) > 5;

  -- Середня зарплата по відділах (тільки відділи з > 10 працівників)
  SELECT
      department,
      COUNT(*) AS employee_count,
      AVG(salary) AS avg_salary,
      MAX(salary) AS max_salary
  FROM employees
  WHERE status = 'active'
  GROUP BY department
  HAVING COUNT(*) > 10
  ORDER BY avg_salary DESC;
  ```

  **GROUP BY** може групувати за кількома стовпцями: `GROUP BY department, role` створить окрему групу для кожної унікальної комбінації відділу та ролі.
en_answer: |
  **GROUP BY** groups rows with the same values into summary rows. It is typically used with aggregate functions (`COUNT`, `SUM`, `AVG`, `MAX`, `MIN`) to compute values for each group.

  **HAVING** filters groups after aggregation, unlike `WHERE`, which filters rows before grouping.

  Order: `WHERE` (row filter) -> `GROUP BY` (grouping) -> `HAVING` (group filter)

  ```sql
  -- Order count by customer
  SELECT user_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY user_id;

  -- Customers with more than 5 orders
  SELECT user_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY user_id
  HAVING COUNT(*) > 5;

  -- Average salary by department (only departments with > 10 employees)
  SELECT
      department,
      COUNT(*) AS employee_count,
      AVG(salary) AS avg_salary,
      MAX(salary) AS max_salary
  FROM employees
  WHERE status = 'active'
  GROUP BY department
  HAVING COUNT(*) > 10
  ORDER BY avg_salary DESC;
  ```

  **GROUP BY** can group by multiple columns: `GROUP BY department, role` creates a separate group for each unique combination of department and role.
section: "sql"
order: 4
tags:
  - queries
---
