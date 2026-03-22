---
ua_question: "Як уникнути дедлоків при одночасному оновленні тих самих рядків різними процесами?"
en_question: "How do you avoid deadlocks when multiple processes update the same rows concurrently?"
ua_answer: |
  **Scenario:** Два фонові процеси обробляють замовлення і регулярно оновлюють ті самі рядки в різному порядку. Логи показують часті deadlock-помилки: "ERROR: deadlock detected". Бізнес-процеси переривається і потребують ручного перезапуску.

  **Approach:**
  1. Забезпечити консистентний порядок блокування ресурсів у всіх процесах
  2. Використовувати SELECT FOR UPDATE з NOWAIT або SKIP LOCKED для уникнення очікування
  3. Реалізувати retry-логіку з експоненційним backoff для обробки залишкових конфліктів

  **Solution:**
  ```sql
  -- ПРОБЛЕМА: процес A і B блокують рядки в різному порядку
  -- Процес A: UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  --           UPDATE accounts SET balance = balance + 100 WHERE id = 2;
  -- Процес B: UPDATE accounts SET balance = balance - 50 WHERE id = 2;
  --           UPDATE accounts SET balance = balance + 50 WHERE id = 1;
  -- DEADLOCK!

  -- РІШЕННЯ 1: Консистентний порядок блокування (завжди по зростанню ID)
  BEGIN;
  SELECT * FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
  COMMIT;

  -- РІШЕННЯ 2: SELECT FOR UPDATE NOWAIT (негайна помилка замість очікування)
  BEGIN;
  SELECT * FROM accounts WHERE id = 1 FOR UPDATE NOWAIT;
  -- Якщо рядок заблокований: ERROR: could not obtain lock
  -- Додаток перехоплює помилку і повторює спробу
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  COMMIT;

  -- РІШЕННЯ 3: SKIP LOCKED (для черги задач)
  -- Кожен worker бере тільки вільні записи
  BEGIN;
  SELECT id FROM tasks
  WHERE status = 'pending'
  ORDER BY created_at
  LIMIT 10
  FOR UPDATE SKIP LOCKED;
  -- Повертає тільки незаблоковані рядки

  UPDATE tasks SET status = 'processing', worker_id = 'worker-1'
  WHERE id IN (/* IDs з попереднього SELECT */);
  COMMIT;

  -- Налаштування таймауту дедлоку
  SET lock_timeout = '5s';      -- максимальний час очікування блокування
  SET deadlock_timeout = '1s';  -- як швидко виявляти дедлоки
  ```

  Найефективніша стратегія -- завжди блокувати ресурси в одному порядку (наприклад, за зростанням primary key). SKIP LOCKED ідеальний для патернів "черга задач", де кожен worker бере наступне доступне завдання. Retry-логіка на рівні додатку з експоненційним backoff (100ms, 200ms, 400ms) обробляє рідкісні конфлікти, які неможливо уникнути на рівні SQL.
en_answer: |
  **Scenario:** Two background processes handle orders and regularly update the same rows in different order. Logs show frequent deadlock errors: "ERROR: deadlock detected". Business processes are interrupted and require manual restart.

  **Approach:**
  1. Ensure consistent resource locking order across all processes
  2. Use SELECT FOR UPDATE with NOWAIT or SKIP LOCKED to avoid waiting
  3. Implement retry logic with exponential backoff to handle remaining conflicts

  **Solution:**
  ```sql
  -- PROBLEM: process A and B lock rows in different order
  -- Process A: UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  --            UPDATE accounts SET balance = balance + 100 WHERE id = 2;
  -- Process B: UPDATE accounts SET balance = balance - 50 WHERE id = 2;
  --            UPDATE accounts SET balance = balance + 50 WHERE id = 1;
  -- DEADLOCK!

  -- SOLUTION 1: Consistent lock ordering (always ascending by ID)
  BEGIN;
  SELECT * FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
  COMMIT;

  -- SOLUTION 2: SELECT FOR UPDATE NOWAIT (immediate error instead of waiting)
  BEGIN;
  SELECT * FROM accounts WHERE id = 1 FOR UPDATE NOWAIT;
  -- If row is locked: ERROR: could not obtain lock
  -- Application catches error and retries
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  COMMIT;

  -- SOLUTION 3: SKIP LOCKED (for task queue pattern)
  -- Each worker picks only unlocked records
  BEGIN;
  SELECT id FROM tasks
  WHERE status = 'pending'
  ORDER BY created_at
  LIMIT 10
  FOR UPDATE SKIP LOCKED;
  -- Returns only unlocked rows

  UPDATE tasks SET status = 'processing', worker_id = 'worker-1'
  WHERE id IN (/* IDs from previous SELECT */);
  COMMIT;

  -- Configure deadlock timeout
  SET lock_timeout = '5s';      -- maximum lock wait time
  SET deadlock_timeout = '1s';  -- how quickly to detect deadlocks
  ```

  The most effective strategy is to always lock resources in the same order (e.g., ascending by primary key). SKIP LOCKED is ideal for "task queue" patterns where each worker picks the next available task. Application-level retry logic with exponential backoff (100ms, 200ms, 400ms) handles rare conflicts that cannot be avoided at the SQL level.
section: "sql"
order: 29
tags:
  - deadlocks
  - concurrency
  - transactions
type: "practical"
---
