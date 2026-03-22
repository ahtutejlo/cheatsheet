---
ua_question: "Як додати NOT NULL стовпець до таблиці з 50 мільйонами рядків без даунтайму?"
en_question: "How do you add a NOT NULL column to a 50-million-row table without downtime?"
ua_answer: |
  **Scenario:** Потрібно додати обов'язковий стовпець `phone_verified BOOLEAN NOT NULL DEFAULT false` до таблиці users з 50M рядків. Пряме `ALTER TABLE ... ADD COLUMN ... NOT NULL` заблокує таблицю на хвилини, спричиняючи даунтайм для всіх користувачів.

  **Approach:**
  1. Додати nullable стовпець (миттєва операція в PostgreSQL 11+)
  2. Заповнити значення батчами без блокування таблиці
  3. Додати NOT NULL constraint після заповнення всіх рядків

  **Solution:**
  ```sql
  -- Крок 1: Додати nullable стовпець з DEFAULT (миттєво в PG 11+)
  -- PostgreSQL 11+ не переписує таблицю для ADD COLUMN ... DEFAULT
  ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT false;
  -- Виконується миттєво: default зберігається в каталозі, не на диску

  -- Крок 2: Для старих PostgreSQL або складніших міграцій
  -- Заповнення батчами (якщо потрібне нестандартне значення)
  DO $$
  DECLARE
      batch_size INT := 10000;
      max_id BIGINT;
      current_id BIGINT := 0;
  BEGIN
      SELECT MAX(id) INTO max_id FROM users;
      WHILE current_id < max_id LOOP
          UPDATE users
          SET phone_verified = false
          WHERE id > current_id
            AND id <= current_id + batch_size
            AND phone_verified IS NULL;
          current_id := current_id + batch_size;
          COMMIT;
          PERFORM pg_sleep(0.1); -- пауза для зменшення навантаження
      END LOOP;
  END $$;

  -- Крок 3: Додати NOT NULL constraint
  -- PostgreSQL 12+: NOT VALID пропускає перевірку існуючих рядків
  ALTER TABLE users
  ADD CONSTRAINT users_phone_verified_not_null
  CHECK (phone_verified IS NOT NULL) NOT VALID;

  -- Крок 4: Валідація constraint (ShareUpdateExclusiveLock, не блокує DML)
  ALTER TABLE users
  VALIDATE CONSTRAINT users_phone_verified_not_null;

  -- Крок 5 (опціонально): Замінити CHECK на справжній NOT NULL
  -- Тільки після того, як constraint валідований
  ALTER TABLE users ALTER COLUMN phone_verified SET NOT NULL;
  ALTER TABLE users DROP CONSTRAINT users_phone_verified_not_null;

  -- Перевірка прогресу міграції
  SELECT
      COUNT(*) FILTER (WHERE phone_verified IS NOT NULL) AS migrated,
      COUNT(*) FILTER (WHERE phone_verified IS NULL) AS remaining,
      COUNT(*) AS total
  FROM users;
  ```

  Ключовий принцип -- розділити операцію на кроки, кожен з яких або миттєвий, або не блокує таблицю. PostgreSQL 11+ додає стовпці з DEFAULT миттєво (значення зберігається в каталозі). NOT VALID constraint дозволяє додати перевірку без сканування таблиці, а VALIDATE виконує перевірку з мінімальним блокуванням. Для MySQL використовуйте `pt-online-schema-change` або `gh-ost` для аналогічного результату.
en_answer: |
  **Scenario:** You need to add a mandatory column `phone_verified BOOLEAN NOT NULL DEFAULT false` to a users table with 50M rows. A direct `ALTER TABLE ... ADD COLUMN ... NOT NULL` would lock the table for minutes, causing downtime for all users.

  **Approach:**
  1. Add a nullable column (instant operation in PostgreSQL 11+)
  2. Backfill values in batches without locking the table
  3. Add NOT NULL constraint after all rows are populated

  **Solution:**
  ```sql
  -- Step 1: Add nullable column with DEFAULT (instant in PG 11+)
  -- PostgreSQL 11+ does not rewrite the table for ADD COLUMN ... DEFAULT
  ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT false;
  -- Executes instantly: default is stored in catalog, not on disk

  -- Step 2: For older PostgreSQL or more complex migrations
  -- Batch backfill (if non-standard value is needed)
  DO $$
  DECLARE
      batch_size INT := 10000;
      max_id BIGINT;
      current_id BIGINT := 0;
  BEGIN
      SELECT MAX(id) INTO max_id FROM users;
      WHILE current_id < max_id LOOP
          UPDATE users
          SET phone_verified = false
          WHERE id > current_id
            AND id <= current_id + batch_size
            AND phone_verified IS NULL;
          current_id := current_id + batch_size;
          COMMIT;
          PERFORM pg_sleep(0.1); -- pause to reduce load
      END LOOP;
  END $$;

  -- Step 3: Add NOT NULL constraint
  -- PostgreSQL 12+: NOT VALID skips checking existing rows
  ALTER TABLE users
  ADD CONSTRAINT users_phone_verified_not_null
  CHECK (phone_verified IS NOT NULL) NOT VALID;

  -- Step 4: Validate constraint (ShareUpdateExclusiveLock, does not block DML)
  ALTER TABLE users
  VALIDATE CONSTRAINT users_phone_verified_not_null;

  -- Step 5 (optional): Replace CHECK with actual NOT NULL
  -- Only after constraint is validated
  ALTER TABLE users ALTER COLUMN phone_verified SET NOT NULL;
  ALTER TABLE users DROP CONSTRAINT users_phone_verified_not_null;

  -- Check migration progress
  SELECT
      COUNT(*) FILTER (WHERE phone_verified IS NOT NULL) AS migrated,
      COUNT(*) FILTER (WHERE phone_verified IS NULL) AS remaining,
      COUNT(*) AS total
  FROM users;
  ```

  The key principle is splitting the operation into steps, each of which is either instant or non-blocking. PostgreSQL 11+ adds columns with DEFAULT instantly (value stored in catalog). NOT VALID constraint allows adding a check without scanning the table, and VALIDATE performs the check with minimal locking. For MySQL, use `pt-online-schema-change` or `gh-ost` for a similar result.
section: "sql"
order: 30
tags:
  - migrations
  - zero-downtime
  - ddl
type: "practical"
---
