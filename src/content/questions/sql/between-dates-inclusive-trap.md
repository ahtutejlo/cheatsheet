---
ua_question: "Чи коректно BETWEEN працює з діапазонами дат?"
en_question: "Does BETWEEN work correctly with date ranges?"
ua_answer: |
  > **Trap:** Розповсюджена помилка -- вважати, що BETWEEN інтуїтивно працює з датами. Насправді BETWEEN включає обидві межі (inclusive), що створює проблеми з timestamp-стовпцями.

  Оператор BETWEEN еквівалентний `>= AND <=`. Для стовпців типу DATE це зазвичай працює коректно. Але для TIMESTAMP або DATETIME `BETWEEN '2025-01-01' AND '2025-01-31'` неявно перетворюється на `BETWEEN '2025-01-01 00:00:00' AND '2025-01-31 00:00:00'`, пропускаючи всі записи 31 січня після опівночі. Це тихий баг, який часто не помічають при тестуванні.

  ```sql
  -- Проблемний запит (пропускає дані 31 січня після 00:00:00)
  SELECT * FROM orders
  WHERE created_at BETWEEN '2025-01-01' AND '2025-01-31';
  -- Еквівалентно:
  -- WHERE created_at >= '2025-01-01 00:00:00'
  --   AND created_at <= '2025-01-31 00:00:00'
  -- Пропускає: 2025-01-31 14:30:00, 2025-01-31 23:59:59 тощо

  -- Правильний варіант 1: використовувати наступний день з <
  SELECT * FROM orders
  WHERE created_at >= '2025-01-01'
    AND created_at < '2025-02-01';

  -- Правильний варіант 2: приведення до DATE
  SELECT * FROM orders
  WHERE created_at::date BETWEEN '2025-01-01' AND '2025-01-31';
  -- Увага: приведення типу не використовує індекс!

  -- Правильний варіант 3: для місячних діапазонів
  SELECT * FROM orders
  WHERE created_at >= DATE_TRUNC('month', '2025-01-15'::date)
    AND created_at < DATE_TRUNC('month', '2025-01-15'::date) + INTERVAL '1 month';
  ```

  Найкращою практикою є використання напіввідкритого інтервалу `>= start AND < end`, де end -- це перший момент наступного періоду. Це коректно працює з будь-яким типом дати або часу і дозволяє використовувати індекси. Уникайте BETWEEN для timestamp-стовпців у продакшн-коді.
en_answer: |
  > **Trap:** A common misconception is that BETWEEN works intuitively with dates. In reality, BETWEEN is inclusive on both ends, which creates problems with timestamp columns.

  The BETWEEN operator is equivalent to `>= AND <=`. For DATE columns, this usually works correctly. But for TIMESTAMP or DATETIME, `BETWEEN '2025-01-01' AND '2025-01-31'` is implicitly cast to `BETWEEN '2025-01-01 00:00:00' AND '2025-01-31 00:00:00'`, missing all records from January 31st after midnight. This is a silent bug that is often missed during testing.

  ```sql
  -- Problematic query (misses data on Jan 31 after 00:00:00)
  SELECT * FROM orders
  WHERE created_at BETWEEN '2025-01-01' AND '2025-01-31';
  -- Equivalent to:
  -- WHERE created_at >= '2025-01-01 00:00:00'
  --   AND created_at <= '2025-01-31 00:00:00'
  -- Misses: 2025-01-31 14:30:00, 2025-01-31 23:59:59, etc.

  -- Correct option 1: use next day with <
  SELECT * FROM orders
  WHERE created_at >= '2025-01-01'
    AND created_at < '2025-02-01';

  -- Correct option 2: cast to DATE
  SELECT * FROM orders
  WHERE created_at::date BETWEEN '2025-01-01' AND '2025-01-31';
  -- Warning: type cast prevents index usage!

  -- Correct option 3: for monthly ranges
  SELECT * FROM orders
  WHERE created_at >= DATE_TRUNC('month', '2025-01-15'::date)
    AND created_at < DATE_TRUNC('month', '2025-01-15'::date) + INTERVAL '1 month';
  ```

  The best practice is to use a half-open interval `>= start AND < end`, where end is the first moment of the next period. This works correctly with any date or time type and allows index usage. Avoid BETWEEN for timestamp columns in production code.
section: "sql"
order: 23
tags:
  - dates
  - between
  - pitfalls
type: "trick"
---
