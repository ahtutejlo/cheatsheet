---
ua_question: "Як спроектувати схему для аудит-логування всіх змін даних?"
en_question: "How would you design a schema for audit logging of all data changes?"
ua_answer: |
  **Scenario:** Регуляторні вимоги зобов'язують відстежувати всі зміни даних: хто, коли, що змінив, та які були попередні значення. Система повинна бути прозорою для існуючого коду і не сповільнювати основні операції.

  **Approach:**
  1. Створити універсальну таблицю аудиту з JSON-стовпцями для зберігання старих та нових значень
  2. Реалізувати generic тригер, який автоматично захоплює всі INSERT, UPDATE та DELETE операції
  3. Додати індекси для типових аудит-запитів (хто, коли, яка таблиця)

  **Solution:**
  ```sql
  -- 1. Таблиця аудиту
  CREATE TABLE audit_log (
      id BIGSERIAL PRIMARY KEY,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
      old_values JSONB,
      new_values JSONB,
      changed_fields TEXT[],
      performed_by TEXT NOT NULL DEFAULT current_user,
      performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      client_ip INET DEFAULT inet_client_addr()
  );

  -- 2. Індекси для типових запитів
  CREATE INDEX idx_audit_table_record ON audit_log (table_name, record_id);
  CREATE INDEX idx_audit_performed_at ON audit_log (performed_at);
  CREATE INDEX idx_audit_performed_by ON audit_log (performed_by);

  -- 3. Generic тригерна функція
  CREATE OR REPLACE FUNCTION audit_trigger_func()
  RETURNS TRIGGER AS $$
  DECLARE
      old_json JSONB;
      new_json JSONB;
      changed TEXT[];
      key TEXT;
  BEGIN
      IF TG_OP = 'DELETE' THEN
          old_json := to_jsonb(OLD);
          INSERT INTO audit_log (table_name, record_id, action, old_values)
          VALUES (TG_TABLE_NAME, OLD.id::TEXT, 'DELETE', old_json);
          RETURN OLD;
      ELSIF TG_OP = 'INSERT' THEN
          new_json := to_jsonb(NEW);
          INSERT INTO audit_log (table_name, record_id, action, new_values)
          VALUES (TG_TABLE_NAME, NEW.id::TEXT, 'INSERT', new_json);
          RETURN NEW;
      ELSIF TG_OP = 'UPDATE' THEN
          old_json := to_jsonb(OLD);
          new_json := to_jsonb(NEW);
          FOR key IN SELECT jsonb_object_keys(new_json) LOOP
              IF old_json->key IS DISTINCT FROM new_json->key THEN
                  changed := array_append(changed, key);
              END IF;
          END LOOP;
          IF array_length(changed, 1) > 0 THEN
              INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, changed_fields)
              VALUES (TG_TABLE_NAME, NEW.id::TEXT, 'UPDATE', old_json, new_json, changed);
          END IF;
          RETURN NEW;
      END IF;
  END;
  $$ LANGUAGE plpgsql;

  -- 4. Підключення тригера до таблиць
  CREATE TRIGGER audit_users
      AFTER INSERT OR UPDATE OR DELETE ON users
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

  CREATE TRIGGER audit_orders
      AFTER INSERT OR UPDATE OR DELETE ON orders
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
  ```

  Цей підхід зберігає повний знімок змінених рядків у JSONB, що дозволяє відстежувати точний diff. Поле `changed_fields` прискорює пошук змін конкретних стовпців. Для високонавантажених систем розгляньте партиціонування таблиці аудиту по `performed_at` та асинхронний запис через LISTEN/NOTIFY.
en_answer: |
  **Scenario:** Regulatory requirements mandate tracking all data changes: who, when, what changed, and what the previous values were. The system must be transparent to existing code and not slow down core operations.

  **Approach:**
  1. Create a universal audit table with JSON columns for storing old and new values
  2. Implement a generic trigger that automatically captures all INSERT, UPDATE, and DELETE operations
  3. Add indexes for typical audit queries (who, when, which table)

  **Solution:**
  ```sql
  -- 1. Audit table
  CREATE TABLE audit_log (
      id BIGSERIAL PRIMARY KEY,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
      old_values JSONB,
      new_values JSONB,
      changed_fields TEXT[],
      performed_by TEXT NOT NULL DEFAULT current_user,
      performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      client_ip INET DEFAULT inet_client_addr()
  );

  -- 2. Indexes for typical queries
  CREATE INDEX idx_audit_table_record ON audit_log (table_name, record_id);
  CREATE INDEX idx_audit_performed_at ON audit_log (performed_at);
  CREATE INDEX idx_audit_performed_by ON audit_log (performed_by);

  -- 3. Generic trigger function
  CREATE OR REPLACE FUNCTION audit_trigger_func()
  RETURNS TRIGGER AS $$
  DECLARE
      old_json JSONB;
      new_json JSONB;
      changed TEXT[];
      key TEXT;
  BEGIN
      IF TG_OP = 'DELETE' THEN
          old_json := to_jsonb(OLD);
          INSERT INTO audit_log (table_name, record_id, action, old_values)
          VALUES (TG_TABLE_NAME, OLD.id::TEXT, 'DELETE', old_json);
          RETURN OLD;
      ELSIF TG_OP = 'INSERT' THEN
          new_json := to_jsonb(NEW);
          INSERT INTO audit_log (table_name, record_id, action, new_values)
          VALUES (TG_TABLE_NAME, NEW.id::TEXT, 'INSERT', new_json);
          RETURN NEW;
      ELSIF TG_OP = 'UPDATE' THEN
          old_json := to_jsonb(OLD);
          new_json := to_jsonb(NEW);
          FOR key IN SELECT jsonb_object_keys(new_json) LOOP
              IF old_json->key IS DISTINCT FROM new_json->key THEN
                  changed := array_append(changed, key);
              END IF;
          END LOOP;
          IF array_length(changed, 1) > 0 THEN
              INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, changed_fields)
              VALUES (TG_TABLE_NAME, NEW.id::TEXT, 'UPDATE', old_json, new_json, changed);
          END IF;
          RETURN NEW;
      END IF;
  END;
  $$ LANGUAGE plpgsql;

  -- 4. Attach trigger to tables
  CREATE TRIGGER audit_users
      AFTER INSERT OR UPDATE OR DELETE ON users
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

  CREATE TRIGGER audit_orders
      AFTER INSERT OR UPDATE OR DELETE ON orders
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
  ```

  This approach stores a full snapshot of changed rows in JSONB, enabling precise diff tracking. The `changed_fields` column speeds up searches for specific column changes. For high-throughput systems, consider partitioning the audit table by `performed_at` and asynchronous writes via LISTEN/NOTIFY.
section: "sql"
order: 27
tags:
  - audit
  - triggers
  - compliance
type: "practical"
---
