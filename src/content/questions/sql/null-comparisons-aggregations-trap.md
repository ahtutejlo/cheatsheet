---
ua_question: "Чи правда, що NULL = NULL повертає TRUE, а COUNT(*) і COUNT(column) працюють однаково?"
en_question: "Is it true that NULL = NULL returns TRUE, and COUNT(*) and COUNT(column) work the same way?"
ua_answer: |
  > **Trap:** Поширена помилка -- вважати, що NULL = NULL дає TRUE і що COUNT(*) та COUNT(column) повертають однаковий результат. Насправді обидва твердження хибні.

  У SQL NULL представляє невідоме значення, а не порожнє або нульове. Порівняння NULL = NULL повертає **NULL** (не TRUE і не FALSE), оскільки невідоме не може дорівнювати невідомому. Для перевірки на NULL потрібно використовувати оператори `IS NULL` або `IS NOT NULL`. Це стосується всіх операторів порівняння: `NULL > 5`, `NULL <> 5`, `NULL = NULL` -- всі повертають NULL.

  ```sql
  -- NULL порівняння
  SELECT NULL = NULL;       -- NULL (не TRUE!)
  SELECT NULL <> NULL;      -- NULL (не TRUE!)
  SELECT NULL IS NULL;      -- TRUE (правильний спосіб)

  -- COUNT відмінності
  CREATE TABLE test_null (id INT, name VARCHAR(50));
  INSERT INTO test_null VALUES (1, 'Alice'), (2, NULL), (3, 'Bob'), (4, NULL);

  SELECT COUNT(*) FROM test_null;       -- 4 (рахує всі рядки)
  SELECT COUNT(name) FROM test_null;    -- 2 (пропускає NULL)
  SELECT COUNT(DISTINCT name) FROM test_null; -- 2

  -- SUM і AVG також ігнорують NULL
  CREATE TABLE scores (student_id INT, score INT);
  INSERT INTO scores VALUES (1, 90), (2, NULL), (3, 80);

  SELECT SUM(score) FROM scores;   -- 170 (не 170 + NULL)
  SELECT AVG(score) FROM scores;   -- 85 (170/2, не 170/3!)

  -- WHERE з NULL
  SELECT * FROM test_null WHERE name = NULL;      -- 0 рядків!
  SELECT * FROM test_null WHERE name IS NULL;     -- 2 рядки
  SELECT * FROM test_null WHERE name NOT IN ('Alice', NULL); -- 0 рядків!
  ```

  Особливо небезпечна поведінка NOT IN з NULL: `WHERE name NOT IN ('Alice', NULL)` повертає порожній результат для всіх рядків, оскільки порівняння з NULL дає NULL, а NOT NULL також дає NULL. Використовуйте `NOT EXISTS` замість `NOT IN`, коли підзапит може повернути NULL.
en_answer: |
  > **Trap:** A common misconception is that NULL = NULL returns TRUE and that COUNT(*) and COUNT(column) return the same result. In reality, both statements are false.

  In SQL, NULL represents an unknown value, not empty or zero. Comparing NULL = NULL returns **NULL** (not TRUE and not FALSE), because an unknown cannot equal an unknown. To check for NULL, you must use `IS NULL` or `IS NOT NULL` operators. This applies to all comparison operators: `NULL > 5`, `NULL <> 5`, `NULL = NULL` -- all return NULL.

  ```sql
  -- NULL comparisons
  SELECT NULL = NULL;       -- NULL (not TRUE!)
  SELECT NULL <> NULL;      -- NULL (not TRUE!)
  SELECT NULL IS NULL;      -- TRUE (correct way)

  -- COUNT differences
  CREATE TABLE test_null (id INT, name VARCHAR(50));
  INSERT INTO test_null VALUES (1, 'Alice'), (2, NULL), (3, 'Bob'), (4, NULL);

  SELECT COUNT(*) FROM test_null;       -- 4 (counts all rows)
  SELECT COUNT(name) FROM test_null;    -- 2 (skips NULLs)
  SELECT COUNT(DISTINCT name) FROM test_null; -- 2

  -- SUM and AVG also ignore NULLs
  CREATE TABLE scores (student_id INT, score INT);
  INSERT INTO scores VALUES (1, 90), (2, NULL), (3, 80);

  SELECT SUM(score) FROM scores;   -- 170 (not 170 + NULL)
  SELECT AVG(score) FROM scores;   -- 85 (170/2, not 170/3!)

  -- WHERE with NULL
  SELECT * FROM test_null WHERE name = NULL;      -- 0 rows!
  SELECT * FROM test_null WHERE name IS NULL;     -- 2 rows
  SELECT * FROM test_null WHERE name NOT IN ('Alice', NULL); -- 0 rows!
  ```

  Particularly dangerous is NOT IN behavior with NULL: `WHERE name NOT IN ('Alice', NULL)` returns an empty result for all rows, because comparison with NULL yields NULL, and NOT NULL also yields NULL. Use `NOT EXISTS` instead of `NOT IN` when the subquery might return NULL values.
section: "sql"
order: 21
tags:
  - "null"
  - aggregations
  - pitfalls
type: "trick"
---
