---
ua_question: "Як працює ескалація блокувань і як запобігти дедлокам?"
en_question: "How does lock escalation work and how do you prevent deadlocks?"
ua_answer: |
  Реляційні бази даних використовують ієрархію блокувань для балансу між паралелізмом та захистом даних. **Row-level locks** (рядкові блокування) забезпечують максимальний паралелізм, дозволяючи різним транзакціям одночасно змінювати різні рядки. **Table-level locks** (блокування на рівні таблиці) простіші в управлінні, але блокують всю таблицю.

  **Lock escalation** -- це процес, при якому СУБД автоматично замінює багато дрібних блокувань (рядкових) на одне більше (табличне). SQL Server виконує ескалацію, коли транзакція утримує понад 5000 блокувань на одній таблиці. PostgreSQL не використовує ескалацію -- він завжди утримує рядкові блокування, але може страждати від overhead при великій кількості блокувань. MySQL InnoDB використовує intent locks (IS, IX) для сигналізації про наміри блокування на рівні таблиці.

  ```sql
  -- Перегляд активних блокувань в PostgreSQL
  SELECT
      l.locktype,
      l.relation::regclass,
      l.mode,
      l.granted,
      a.query
  FROM pg_locks l
  JOIN pg_stat_activity a ON l.pid = a.pid
  WHERE l.relation IS NOT NULL;

  -- SELECT FOR UPDATE -- явне рядкове блокування
  BEGIN;
  SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
  -- Інші транзакції будуть чекати при спробі змінити цей рядок
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  COMMIT;

  -- Advisory locks -- кооперативні блокування на рівні додатку
  SELECT pg_advisory_lock(12345);    -- блокування
  -- критична секція
  SELECT pg_advisory_unlock(12345);  -- розблокування
  ```

  **Deadlock** (взаємне блокування) виникає, коли дві або більше транзакцій циклічно очікують одна на одну. Бази даних виявляють дедлоки за допомогою алгоритму wait-for graph і примусово відкочують одну з транзакцій. Для запобігання: завжди блокуйте ресурси в **однаковому порядку**, використовуйте `SELECT FOR UPDATE NOWAIT` або `SKIP LOCKED` для уникнення очікування, мінімізуйте тривалість транзакцій, та використовуйте **advisory locks** для координації на рівні додатку.
en_answer: |
  Relational databases use a lock hierarchy to balance concurrency and data protection. **Row-level locks** provide maximum concurrency, allowing different transactions to modify different rows simultaneously. **Table-level locks** are simpler to manage but block the entire table.

  **Lock escalation** is the process where the DBMS automatically replaces many fine-grained locks (row-level) with a single coarser lock (table-level). SQL Server performs escalation when a transaction holds more than 5,000 locks on a single table. PostgreSQL does not use escalation -- it always maintains row-level locks, but can suffer from overhead with a large number of locks. MySQL InnoDB uses intent locks (IS, IX) to signal lock intentions at the table level.

  ```sql
  -- View active locks in PostgreSQL
  SELECT
      l.locktype,
      l.relation::regclass,
      l.mode,
      l.granted,
      a.query
  FROM pg_locks l
  JOIN pg_stat_activity a ON l.pid = a.pid
  WHERE l.relation IS NOT NULL;

  -- SELECT FOR UPDATE -- explicit row-level lock
  BEGIN;
  SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
  -- Other transactions will wait when trying to modify this row
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  COMMIT;

  -- Advisory locks -- cooperative application-level locks
  SELECT pg_advisory_lock(12345);    -- acquire lock
  -- critical section
  SELECT pg_advisory_unlock(12345);  -- release lock
  ```

  A **deadlock** occurs when two or more transactions are cyclically waiting for each other. Databases detect deadlocks using a wait-for graph algorithm and forcibly roll back one of the transactions. To prevent deadlocks: always lock resources in a **consistent order**, use `SELECT FOR UPDATE NOWAIT` or `SKIP LOCKED` to avoid waiting, minimize transaction duration, and use **advisory locks** for application-level coordination.
section: "sql"
order: 20
tags:
  - locking
  - concurrency
  - deadlocks
type: "deep"
---
