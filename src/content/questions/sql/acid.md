---
ua_question: "Що таке ACID властивості транзакцій?"
en_question: "What are ACID transaction properties?"
ua_answer: |
  **ACID** -- це набір властивостей, що гарантують надійність транзакцій у базі даних. Кожна буква означає окрему гарантію.

  **Atomicity (Атомарність)** -- транзакція виконується повністю або не виконується зовсім. Якщо будь-яка операція всередині транзакції зазнає невдачі, всі зміни відкочуються.

  **Consistency (Узгодженість)** -- транзакція переводить базу даних з одного узгодженого стану в інший. Всі обмеження (constraints) та правила залишаються виконаними.

  **Isolation (Ізольованість)** -- паралельні транзакції не впливають одна на одну. Рівні ізоляції: `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, `SERIALIZABLE`.

  **Durability (Довговічність)** -- після успішного COMMIT зміни зберігаються навіть при збої системи. Дані записуються на диск.

  ```sql
  -- Приклад транзакції: переказ коштів
  BEGIN;

  UPDATE accounts SET balance = balance - 100
  WHERE id = 1;

  UPDATE accounts SET balance = balance + 100
  WHERE id = 2;

  -- Якщо все пройшло успішно
  COMMIT;

  -- Або відкотити при помилці
  -- ROLLBACK;
  ```

  ```sql
  -- Встановлення рівня ізоляції
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  ```
en_answer: |
  **ACID** is a set of properties that guarantee reliable database transactions. Each letter represents a separate guarantee.

  **Atomicity** -- a transaction is executed completely or not at all. If any operation within the transaction fails, all changes are rolled back.

  **Consistency** -- a transaction brings the database from one consistent state to another. All constraints and rules remain satisfied.

  **Isolation** -- concurrent transactions do not affect each other. Isolation levels: `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, `SERIALIZABLE`.

  **Durability** -- after a successful COMMIT, changes persist even in case of system failure. Data is written to disk.

  ```sql
  -- Transaction example: funds transfer
  BEGIN;

  UPDATE accounts SET balance = balance - 100
  WHERE id = 1;

  UPDATE accounts SET balance = balance + 100
  WHERE id = 2;

  -- If everything succeeded
  COMMIT;

  -- Or rollback on error
  -- ROLLBACK;
  ```

  ```sql
  -- Set isolation level
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  ```
section: "sql"
order: 8
tags:
  - transactions
---
