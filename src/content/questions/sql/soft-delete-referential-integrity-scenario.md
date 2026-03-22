---
ua_question: "Як реалізувати soft delete, зберігаючи референційну цілісність та коректність запитів?"
en_question: "How would you implement soft delete while maintaining referential integrity and query correctness?"
ua_answer: |
  **Scenario:** Замість фізичного видалення записів потрібно реалізувати soft delete (прапорець is_deleted) для можливості відновлення даних. При цьому унікальні обмеження, зовнішні ключі та бізнес-запити повинні працювати коректно, ігноруючи видалені записи.

  **Approach:**
  1. Додати стовпець `deleted_at` (замість boolean) для збереження часу видалення та можливості аудиту
  2. Створити partial unique indexes, які застосовуються тільки до невидалених записів
  3. Визначити default scope для запитів на рівні додатку або через представлення (view)

  **Solution:**
  ```sql
  -- 1. Додавання стовпця soft delete
  ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

  -- 2. Partial unique index (унікальність тільки серед активних)
  -- Дозволяє повторно створити запис з тим самим email після soft delete
  CREATE UNIQUE INDEX idx_users_email_active
  ON users (email)
  WHERE deleted_at IS NULL;

  -- 3. Представлення для "активних" записів
  CREATE VIEW active_users AS
  SELECT * FROM users WHERE deleted_at IS NULL;

  CREATE VIEW active_orders AS
  SELECT * FROM orders WHERE deleted_at IS NULL;

  -- 4. Soft delete замість DELETE
  -- Замість: DELETE FROM users WHERE id = 123;
  UPDATE users SET deleted_at = now() WHERE id = 123;

  -- 5. Відновлення запису
  UPDATE users SET deleted_at = NULL WHERE id = 123;

  -- 6. Каскадний soft delete через тригер
  CREATE OR REPLACE FUNCTION cascade_soft_delete()
  RETURNS TRIGGER AS $$
  BEGIN
      IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
          UPDATE orders SET deleted_at = NEW.deleted_at
          WHERE user_id = NEW.id AND deleted_at IS NULL;
      END IF;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER trg_user_soft_delete
      AFTER UPDATE OF deleted_at ON users
      FOR EACH ROW EXECUTE FUNCTION cascade_soft_delete();

  -- 7. Індекс для фільтрації активних записів
  CREATE INDEX idx_users_not_deleted ON users (id) WHERE deleted_at IS NULL;
  CREATE INDEX idx_orders_not_deleted ON orders (user_id) WHERE deleted_at IS NULL;
  ```

  Використання `deleted_at TIMESTAMPTZ` замість `is_deleted BOOLEAN` дає додаткову інформацію про час видалення. Partial indexes гарантують, що бізнес-правила (наприклад, унікальність email) застосовуються тільки до активних записів. Для великих таблиць розгляньте партиціонування по статусу або періодичне переміщення видалених записів в архівну таблицю.
en_answer: |
  **Scenario:** Instead of physically deleting records, you need to implement soft delete (is_deleted flag) to enable data recovery. Unique constraints, foreign keys, and business queries must work correctly, ignoring deleted records.

  **Approach:**
  1. Add a `deleted_at` column (instead of boolean) to preserve deletion time and enable auditing
  2. Create partial unique indexes that apply only to non-deleted records
  3. Define a default scope for queries at the application level or through views

  **Solution:**
  ```sql
  -- 1. Add soft delete column
  ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

  -- 2. Partial unique index (uniqueness only among active records)
  -- Allows re-creating a record with the same email after soft delete
  CREATE UNIQUE INDEX idx_users_email_active
  ON users (email)
  WHERE deleted_at IS NULL;

  -- 3. View for "active" records
  CREATE VIEW active_users AS
  SELECT * FROM users WHERE deleted_at IS NULL;

  CREATE VIEW active_orders AS
  SELECT * FROM orders WHERE deleted_at IS NULL;

  -- 4. Soft delete instead of DELETE
  -- Instead of: DELETE FROM users WHERE id = 123;
  UPDATE users SET deleted_at = now() WHERE id = 123;

  -- 5. Restore a record
  UPDATE users SET deleted_at = NULL WHERE id = 123;

  -- 6. Cascading soft delete via trigger
  CREATE OR REPLACE FUNCTION cascade_soft_delete()
  RETURNS TRIGGER AS $$
  BEGIN
      IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
          UPDATE orders SET deleted_at = NEW.deleted_at
          WHERE user_id = NEW.id AND deleted_at IS NULL;
      END IF;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER trg_user_soft_delete
      AFTER UPDATE OF deleted_at ON users
      FOR EACH ROW EXECUTE FUNCTION cascade_soft_delete();

  -- 7. Index for filtering active records
  CREATE INDEX idx_users_not_deleted ON users (id) WHERE deleted_at IS NULL;
  CREATE INDEX idx_orders_not_deleted ON orders (user_id) WHERE deleted_at IS NULL;
  ```

  Using `deleted_at TIMESTAMPTZ` instead of `is_deleted BOOLEAN` provides additional information about deletion time. Partial indexes ensure business rules (e.g., email uniqueness) apply only to active records. For large tables, consider partitioning by status or periodically moving deleted records to an archive table.
section: "sql"
order: 28
tags:
  - soft-delete
  - integrity
  - design
type: "practical"
---
