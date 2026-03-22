---
ua_question: "Як MVCC реалізує рівні ізоляції транзакцій?"
en_question: "How does MVCC implement transaction isolation levels?"
ua_answer: |
  **MVCC** (Multi-Version Concurrency Control) -- це механізм, який дозволяє кільком транзакціям одночасно читати та записувати дані без блокування. Замість перезапису даних, MVCC зберігає кілька версій кожного рядка. Кожна транзакція бачить узгоджений знімок (snapshot) бази даних на певний момент часу.

  У PostgreSQL кожен рядок має приховані стовпці `xmin` (ID транзакції, яка створила рядок) та `xmax` (ID транзакції, яка видалила або оновила рядок). При UPDATE створюється нова версія рядка з новим `xmin`, а стара позначається `xmax`. Видимість рядка визначається порівнянням цих значень зі знімком транзакції. У MySQL InnoDB замість цього використовується undo log -- ланцюжок попередніх версій рядків.

  ```sql
  -- READ COMMITTED: кожен SELECT бачить новий знімок
  SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
  BEGIN;
  SELECT balance FROM accounts WHERE id = 1; -- бачить 1000
  -- Інша транзакція: UPDATE accounts SET balance = 500 WHERE id = 1; COMMIT;
  SELECT balance FROM accounts WHERE id = 1; -- бачить 500 (новий знімок)
  COMMIT;

  -- REPEATABLE READ: знімок фіксується на початку транзакції
  SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
  BEGIN;
  SELECT balance FROM accounts WHERE id = 1; -- бачить 1000
  -- Інша транзакція: UPDATE accounts SET balance = 500 WHERE id = 1; COMMIT;
  SELECT balance FROM accounts WHERE id = 1; -- все ще бачить 1000 (той самий знімок)
  COMMIT;

  -- Перевірка поточного рівня ізоляції
  SHOW transaction_isolation;
  ```

  **READ COMMITTED** створює новий знімок для кожного оператора SELECT, тому бачить зміни інших закомічених транзакцій. **REPEATABLE READ** фіксує знімок на початку транзакції, забезпечуючи стабільні читання. **Phantom reads** (фантомні читання) виникають, коли інша транзакція вставляє рядки, що відповідають умові WHERE -- PostgreSQL запобігає їм на рівні REPEATABLE READ завдяки SSI (Serializable Snapshot Isolation), тоді як MySQL InnoDB використовує gap locks.
en_answer: |
  **MVCC** (Multi-Version Concurrency Control) is a mechanism that allows multiple transactions to read and write data concurrently without locking. Instead of overwriting data, MVCC keeps multiple versions of each row. Each transaction sees a consistent snapshot of the database at a specific point in time.

  In PostgreSQL, each row has hidden columns `xmin` (transaction ID that created the row) and `xmax` (transaction ID that deleted or updated the row). On UPDATE, a new row version is created with a new `xmin`, and the old one is marked with `xmax`. Row visibility is determined by comparing these values against the transaction's snapshot. MySQL InnoDB uses an undo log instead -- a chain of previous row versions.

  ```sql
  -- READ COMMITTED: each SELECT sees a fresh snapshot
  SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
  BEGIN;
  SELECT balance FROM accounts WHERE id = 1; -- sees 1000
  -- Another transaction: UPDATE accounts SET balance = 500 WHERE id = 1; COMMIT;
  SELECT balance FROM accounts WHERE id = 1; -- sees 500 (new snapshot)
  COMMIT;

  -- REPEATABLE READ: snapshot is fixed at transaction start
  SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
  BEGIN;
  SELECT balance FROM accounts WHERE id = 1; -- sees 1000
  -- Another transaction: UPDATE accounts SET balance = 500 WHERE id = 1; COMMIT;
  SELECT balance FROM accounts WHERE id = 1; -- still sees 1000 (same snapshot)
  COMMIT;

  -- Check current isolation level
  SHOW transaction_isolation;
  ```

  **READ COMMITTED** creates a new snapshot for each SELECT statement, so it sees changes from other committed transactions. **REPEATABLE READ** fixes the snapshot at transaction start, ensuring stable reads. **Phantom reads** occur when another transaction inserts rows matching a WHERE clause -- PostgreSQL prevents them at REPEATABLE READ level through SSI (Serializable Snapshot Isolation), while MySQL InnoDB uses gap locks.
section: "sql"
order: 17
tags:
  - mvcc
  - transactions
  - isolation
type: "deep"
---
