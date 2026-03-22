---
ua_question: "Чи завжди SELECT з неагрегованими стовпцями при GROUP BY викликає помилку?"
en_question: "Does SELECT with non-aggregated columns in GROUP BY always cause an error?"
ua_answer: |
  > **Trap:** Багато хто вважає, що вибірка неагрегованого стовпця, який не входить у GROUP BY, завжди призводить до помилки. Насправді це залежить від СУБД та її налаштувань.

  Стандарт SQL вимагає, щоб кожен стовпець у SELECT або був у GROUP BY, або був обгорнутий у агрегатну функцію. PostgreSQL та SQL Server строго дотримуються цього правила і завжди повертають помилку. Але MySQL за замовчуванням (без `ONLY_FULL_GROUP_BY`) **мовчки обирає довільне значення** з групи для неагрегованих стовпців, що може призвести до непередбачуваних і некоректних результатів.

  ```sql
  -- PostgreSQL: помилка
  SELECT department, name, MAX(salary)
  FROM employees
  GROUP BY department;
  -- ERROR: column "name" must appear in GROUP BY or aggregate function

  -- MySQL (без ONLY_FULL_GROUP_BY): мовчки працює, але небезпечно
  SELECT department, name, MAX(salary)
  FROM employees
  GROUP BY department;
  -- Повертає довільне name з кожної групи department!

  -- Перевірка режиму MySQL
  SELECT @@sql_mode;
  -- Якщо містить ONLY_FULL_GROUP_BY -- поведінка як PostgreSQL

  -- Правильний підхід: використовувати підзапит або віконну функцію
  SELECT department, name, salary
  FROM (
      SELECT department, name, salary,
             ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
      FROM employees
  ) ranked
  WHERE rn = 1;
  ```

  MySQL 5.7.5+ включає `ONLY_FULL_GROUP_BY` за замовчуванням, але багато застарілих систем працюють без нього. Це одна з найнебезпечніших відмінностей між СУБД -- один і той самий запит може працювати в MySQL і падати в PostgreSQL, або ще гірше -- працювати в обох, але повертати різні результати.
en_answer: |
  > **Trap:** Many believe that selecting a non-aggregated column not in GROUP BY always causes an error. In reality, it depends on the DBMS and its settings.

  The SQL standard requires every column in SELECT to either be in GROUP BY or wrapped in an aggregate function. PostgreSQL and SQL Server strictly enforce this rule and always return an error. But MySQL by default (without `ONLY_FULL_GROUP_BY`) **silently picks an arbitrary value** from the group for non-aggregated columns, which can lead to unpredictable and incorrect results.

  ```sql
  -- PostgreSQL: error
  SELECT department, name, MAX(salary)
  FROM employees
  GROUP BY department;
  -- ERROR: column "name" must appear in GROUP BY or aggregate function

  -- MySQL (without ONLY_FULL_GROUP_BY): silently works, but dangerous
  SELECT department, name, MAX(salary)
  FROM employees
  GROUP BY department;
  -- Returns arbitrary name from each department group!

  -- Check MySQL mode
  SELECT @@sql_mode;
  -- If it contains ONLY_FULL_GROUP_BY -- behavior matches PostgreSQL

  -- Correct approach: use subquery or window function
  SELECT department, name, salary
  FROM (
      SELECT department, name, salary,
             ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
      FROM employees
  ) ranked
  WHERE rn = 1;
  ```

  MySQL 5.7.5+ enables `ONLY_FULL_GROUP_BY` by default, but many legacy systems run without it. This is one of the most dangerous differences between DBMSes -- the same query may work in MySQL and fail in PostgreSQL, or worse -- work in both but return different results.
section: "sql"
order: 22
tags:
  - group-by
  - aggregations
  - sql-standard
type: "trick"
---
