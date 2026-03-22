---
ua_question: "Чи дають DISTINCT і GROUP BY (без агрегації) різні результати?"
en_question: "Do DISTINCT and GROUP BY (without aggregation) produce different results?"
ua_answer: |
  > **Trap:** Часто вважають, що DISTINCT і GROUP BY працюють по-різному навіть без агрегатних функцій. Насправді для простої дедуплікації вони повертають ідентичні набори рядків.

  Коли GROUP BY використовується без агрегатних функцій, він працює як DISTINCT -- видаляє дублікати. Обидва запити `SELECT DISTINCT department FROM employees` та `SELECT department FROM employees GROUP BY department` повертають однаковий результат. Сучасні оптимізатори зазвичай генерують ідентичний план виконання для обох варіантів.

  ```sql
  -- Ці два запити еквівалентні
  SELECT DISTINCT department FROM employees;
  SELECT department FROM employees GROUP BY department;

  -- Плани виконання зазвичай ідентичні
  EXPLAIN SELECT DISTINCT department FROM employees;
  -- HashAggregate або Sort + Unique
  EXPLAIN SELECT department FROM employees GROUP BY department;
  -- HashAggregate або Sort + Group

  -- Кілька стовпців -- теж еквівалентні
  SELECT DISTINCT department, city FROM employees;
  SELECT department, city FROM employees GROUP BY department, city;

  -- Коли обирати GROUP BY:
  -- Якщо потрібна агрегація -- тільки GROUP BY
  SELECT department, COUNT(*), AVG(salary)
  FROM employees
  GROUP BY department;

  -- Коли обирати DISTINCT:
  -- Для простої дедуплікації -- зрозуміліший намір
  SELECT DISTINCT customer_id FROM orders;
  ```

  Різниця полягає у наміру та читабельності: DISTINCT явно показує, що мета -- видалення дублікатів, тоді як GROUP BY натякає на подальшу агрегацію. GROUP BY є кращим вибором, коли вам також потрібні агрегатні функції (COUNT, SUM, AVG). У деяких старих версіях MySQL GROUP BY неявно сортував результат (ORDER BY було вбудоване), але це видалено в MySQL 8.0.
en_answer: |
  > **Trap:** It is often believed that DISTINCT and GROUP BY work differently even without aggregate functions. In reality, for simple deduplication they return identical result sets.

  When GROUP BY is used without aggregate functions, it works like DISTINCT -- removing duplicates. Both queries `SELECT DISTINCT department FROM employees` and `SELECT department FROM employees GROUP BY department` return the same result. Modern optimizers typically generate identical execution plans for both variants.

  ```sql
  -- These two queries are equivalent
  SELECT DISTINCT department FROM employees;
  SELECT department FROM employees GROUP BY department;

  -- Execution plans are usually identical
  EXPLAIN SELECT DISTINCT department FROM employees;
  -- HashAggregate or Sort + Unique
  EXPLAIN SELECT department FROM employees GROUP BY department;
  -- HashAggregate or Sort + Group

  -- Multiple columns -- also equivalent
  SELECT DISTINCT department, city FROM employees;
  SELECT department, city FROM employees GROUP BY department, city;

  -- When to choose GROUP BY:
  -- When aggregation is needed -- only GROUP BY
  SELECT department, COUNT(*), AVG(salary)
  FROM employees
  GROUP BY department;

  -- When to choose DISTINCT:
  -- For simple deduplication -- clearer intent
  SELECT DISTINCT customer_id FROM orders;
  ```

  The difference lies in intent and readability: DISTINCT explicitly shows the goal is deduplication, while GROUP BY hints at subsequent aggregation. GROUP BY is the better choice when you also need aggregate functions (COUNT, SUM, AVG). In some older MySQL versions, GROUP BY implicitly sorted results (ORDER BY was built-in), but this was removed in MySQL 8.0.
section: "sql"
order: 25
tags:
  - distinct
  - group-by
  - equivalence
type: "trick"
---
