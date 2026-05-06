---
ua_question: "Як організувати masking тестових даних з продакшна?"
en_question: "How to mask production test data?"
ua_answer: |
  **Сценарій:** ваш staging environment має використовувати "production-shaped" data для realistic testing, але всі PII (emails, phones, SSN, addresses) мають бути замасковані для compliance (GDPR, SOC2). Ad-hoc SQL `UPDATE` не годиться: масштаб 100M рядків, треба consistency, треба versioning.

  **Підхід:**
  1. **Class data:** PII (replace), sensitive (hash), reference (keep)
  2. **Pipeline** — automated dump → mask → load
  3. **Versioned masking rules** як код, не Confluence-doc
  4. **Verification** — автотест, що жодне PII не leakнуло

  **Рішення:**

  **Крок 1: класифікація полів.** Створіть schema-як-data:

  ```yaml
  # data_classification.yaml
  users:
    email: { class: PII, strategy: replace_with_fake }
    phone: { class: PII, strategy: replace_with_fake }
    full_name: { class: PII, strategy: replace_with_fake }
    ssn: { class: SECRET, strategy: redact }  # повний redact, не fake
    user_id: { class: REFERENCE, strategy: keep }  # не міняти, FK
    age: { class: SAFE, strategy: keep }
  orders:
    user_id: { class: REFERENCE, strategy: keep }  # consistency з users
    shipping_address: { class: PII, strategy: replace_with_fake }
    total: { class: SAFE, strategy: keep }
  ```

  **Крок 2: deterministic faker для referential integrity.** Якщо user_id=42 з'являється в 5 таблицях, його masked email має бути той самий:

  ```python
  import hashlib
  from faker import Faker

  def deterministic_faker(seed_str):
      seed = int(hashlib.md5(seed_str.encode()).hexdigest()[:8], 16)
      fake = Faker()
      fake.seed_instance(seed)
      return fake

  def mask_email(user_id):
      f = deterministic_faker(f"email_{user_id}")
      return f.email()

  # В obох таблицях user_id=42 → той самий fake email
  assert mask_email(42) == mask_email(42)
  ```

  **Крок 3: pipeline dump → mask → load:**

  ```python
  # GCP-native: Postgres prod → masking → staging
  import psycopg2
  from google.cloud import storage

  def mask_pipeline():
      # 1. Dump prod (read-only replica) до GCS
      run("pg_dump --schema-only prod > schema.sql")
      run("pg_dump --data-only prod | gzip > data.sql.gz")
      run("gsutil cp data.sql.gz gs://masking-staging/raw/")

      # 2. Mask в-flight через Apache Beam / Dataflow
      run("python mask_dataflow.py --input gs://...raw --output gs://...masked")

      # 3. Restore у staging
      run("gsutil cp gs://...masked/data.sql.gz .")
      run("zcat data.sql.gz | psql staging")
  ```

  **Альтернатива: in-DB masking** (без виходу на disk):
  ```sql
  -- Postgres + pg_anonymizer extension
  SECURITY LABEL FOR anon ON COLUMN users.email IS 'MASKED WITH FUNCTION anon.fake_email()';
  SECURITY LABEL FOR anon ON COLUMN users.phone IS 'MASKED WITH FUNCTION anon.fake_phone_number()';
  SELECT anon.anonymize_database();
  ```

  **Крок 4: verification — PII detector як CI gate:**

  ```python
  # tests/test_no_pii_leaked.py
  import re
  EMAIL = re.compile(r"[\w._%+-]+@(?!example\.com)[\w.-]+\.[a-zA-Z]{2,}")
  SSN = re.compile(r"\d{3}-\d{2}-\d{4}")

  def test_staging_has_no_real_emails(staging_db):
      cur = staging_db.cursor()
      cur.execute("SELECT email FROM users LIMIT 10000")
      for (email,) in cur:
          assert email.endswith("@example.com"), f"Real email leaked: {email}"

  def test_no_ssn_anywhere(staging_db):
      # Сканити всі text-стовпці
      for table, col in get_all_text_columns(staging_db):
          cur = staging_db.cursor()
          cur.execute(f"SELECT {col} FROM {table} LIMIT 5000")
          for (val,) in cur:
              if val:
                  assert not SSN.search(val), f"SSN in {table}.{col}"
  ```

  **Підводні камені:**
  - **Free-text fields** (chat messages, support tickets) часто містять PII всередині — треба regex-based scrub або NLP-based redaction (Presidio від Microsoft)
  - **Нерівномірні розподіли** — якщо masking порушує zipf-розподіл прізвищ, real bug в name-handling може проявитись лише на prod
  - **JSONB / semi-structured** — masking має traverse JSON
  - **GDPR right-to-deletion** — staging dataset має узгоджуватись з prod deletions, інакше "user requested deletion" не буде reflectнуто

  **Інструменти:** Microsoft Presidio (NLP PII detection), pg_anonymizer (Postgres extension), Dataflow + Apache Beam (large scale), AWS DataBrew, Google DLP API.
en_answer: |
  **Scenario:** your staging environment must use "production-shaped" data for realistic testing, but every piece of PII (emails, phones, SSN, addresses) must be masked for compliance (GDPR, SOC2). Ad-hoc SQL `UPDATE` doesn't cut it: 100M rows, you need consistency, you need versioning.

  **Approach:**
  1. **Classify data:** PII (replace), sensitive (hash), reference (keep)
  2. **Pipeline** — automated dump → mask → load
  3. **Versioned masking rules** as code, not a Confluence page
  4. **Verification** — automated test that no PII leaked

  **Solution:**

  **Step 1: classify fields.** Schema-as-data:

  ```yaml
  # data_classification.yaml
  users:
    email: { class: PII, strategy: replace_with_fake }
    phone: { class: PII, strategy: replace_with_fake }
    full_name: { class: PII, strategy: replace_with_fake }
    ssn: { class: SECRET, strategy: redact }  # full redact, no fake
    user_id: { class: REFERENCE, strategy: keep }  # don't change — FK
    age: { class: SAFE, strategy: keep }
  orders:
    user_id: { class: REFERENCE, strategy: keep }  # consistency with users
    shipping_address: { class: PII, strategy: replace_with_fake }
    total: { class: SAFE, strategy: keep }
  ```

  **Step 2: deterministic faker for referential integrity.** If user_id=42 shows up in 5 tables, its masked email must be identical everywhere:

  ```python
  import hashlib
  from faker import Faker

  def deterministic_faker(seed_str):
      seed = int(hashlib.md5(seed_str.encode()).hexdigest()[:8], 16)
      fake = Faker()
      fake.seed_instance(seed)
      return fake

  def mask_email(user_id):
      f = deterministic_faker(f"email_{user_id}")
      return f.email()

  # In both tables user_id=42 → same fake email
  assert mask_email(42) == mask_email(42)
  ```

  **Step 3: dump → mask → load pipeline:**

  ```python
  # GCP-native: Postgres prod → masking → staging
  import psycopg2
  from google.cloud import storage

  def mask_pipeline():
      # 1. Dump prod (read replica) to GCS
      run("pg_dump --schema-only prod > schema.sql")
      run("pg_dump --data-only prod | gzip > data.sql.gz")
      run("gsutil cp data.sql.gz gs://masking-staging/raw/")

      # 2. Mask in-flight via Apache Beam / Dataflow
      run("python mask_dataflow.py --input gs://...raw --output gs://...masked")

      # 3. Restore into staging
      run("gsutil cp gs://...masked/data.sql.gz .")
      run("zcat data.sql.gz | psql staging")
  ```

  **Alternative: in-DB masking** (no disk export):
  ```sql
  -- Postgres + pg_anonymizer extension
  SECURITY LABEL FOR anon ON COLUMN users.email IS 'MASKED WITH FUNCTION anon.fake_email()';
  SECURITY LABEL FOR anon ON COLUMN users.phone IS 'MASKED WITH FUNCTION anon.fake_phone_number()';
  SELECT anon.anonymize_database();
  ```

  **Step 4: verification — PII detector as a CI gate:**

  ```python
  # tests/test_no_pii_leaked.py
  import re
  EMAIL = re.compile(r"[\w._%+-]+@(?!example\.com)[\w.-]+\.[a-zA-Z]{2,}")
  SSN = re.compile(r"\d{3}-\d{2}-\d{4}")

  def test_staging_has_no_real_emails(staging_db):
      cur = staging_db.cursor()
      cur.execute("SELECT email FROM users LIMIT 10000")
      for (email,) in cur:
          assert email.endswith("@example.com"), f"Real email leaked: {email}"

  def test_no_ssn_anywhere(staging_db):
      # Scan every text column
      for table, col in get_all_text_columns(staging_db):
          cur = staging_db.cursor()
          cur.execute(f"SELECT {col} FROM {table} LIMIT 5000")
          for (val,) in cur:
              if val:
                  assert not SSN.search(val), f"SSN in {table}.{col}"
  ```

  **Pitfalls:**
  - **Free-text fields** (chat messages, support tickets) often hide PII inside — needs regex scrub or NLP redaction (Microsoft Presidio)
  - **Skewed distributions** — if masking breaks the Zipf distribution of last names, a real bug in name-handling code may surface only in prod
  - **JSONB / semi-structured** — masking must traverse JSON
  - **GDPR right-to-deletion** — staging dataset must align with prod deletions, otherwise "user requested deletion" isn't reflected

  **Tools:** Microsoft Presidio (NLP PII detection), pg_anonymizer (Postgres extension), Dataflow + Apache Beam (large scale), AWS DataBrew, Google DLP API.
section: "automation-qa"
order: 22
tags: [test-data, masking, compliance, gdpr]
type: "practical"
---
