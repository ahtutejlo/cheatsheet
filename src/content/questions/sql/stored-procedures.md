---
ua_question: "Що таке збережені процедури?"
en_question: "What are stored procedures?"
ua_answer: |
  **Збережена процедура** -- це набір SQL-інструкцій, збережений на сервері бази даних, який можна викликати за іменем. Процедури дозволяють інкапсулювати бізнес-логіку на рівні бази даних.

  **Переваги:**
  - **Продуктивність** -- компілюються один раз, виконуються багато разів
  - **Безпека** -- можна надати доступ до процедури без прямого доступу до таблиць
  - **Повторне використання** -- один раз написав, використовуєш з будь-якого клієнта
  - **Зменшення трафіку** -- замість кількох запитів -- один виклик процедури

  ```sql
  -- Створення процедури (PostgreSQL)
  CREATE OR REPLACE FUNCTION transfer_funds(
      sender_id INT,
      receiver_id INT,
      amount DECIMAL
  ) RETURNS VOID AS $$
  BEGIN
      IF amount <= 0 THEN
          RAISE EXCEPTION 'Amount must be positive';
      END IF;

      UPDATE accounts SET balance = balance - amount
      WHERE id = sender_id AND balance >= amount;

      IF NOT FOUND THEN
          RAISE EXCEPTION 'Insufficient funds';
      END IF;

      UPDATE accounts SET balance = balance + amount
      WHERE id = receiver_id;
  END;
  $$ LANGUAGE plpgsql;

  -- Виклик процедури
  SELECT transfer_funds(1, 2, 100.00);
  ```

  **Функції vs Процедури:** функції повертають значення та можуть використовуватися у SELECT; процедури виконують дії та можуть управляти транзакціями.
en_answer: |
  A **stored procedure** is a set of SQL statements saved on the database server that can be called by name. Procedures allow encapsulating business logic at the database level.

  **Advantages:**
  - **Performance** -- compiled once, executed many times
  - **Security** -- can grant access to the procedure without direct table access
  - **Reusability** -- write once, use from any client
  - **Reduced traffic** -- instead of multiple queries, a single procedure call

  ```sql
  -- Create a procedure (PostgreSQL)
  CREATE OR REPLACE FUNCTION transfer_funds(
      sender_id INT,
      receiver_id INT,
      amount DECIMAL
  ) RETURNS VOID AS $$
  BEGIN
      IF amount <= 0 THEN
          RAISE EXCEPTION 'Amount must be positive';
      END IF;

      UPDATE accounts SET balance = balance - amount
      WHERE id = sender_id AND balance >= amount;

      IF NOT FOUND THEN
          RAISE EXCEPTION 'Insufficient funds';
      END IF;

      UPDATE accounts SET balance = balance + amount
      WHERE id = receiver_id;
  END;
  $$ LANGUAGE plpgsql;

  -- Call the procedure
  SELECT transfer_funds(1, 2, 100.00);
  ```

  **Functions vs Procedures:** functions return values and can be used in SELECT; procedures perform actions and can manage transactions.
section: "sql"
order: 12
tags:
  - advanced
---
