---
ua_question: "Як WAL забезпечує надійність даних і відновлення після збою?"
en_question: "How does WAL ensure data durability and crash recovery?"
ua_answer: |
  **WAL** (Write-Ahead Logging) -- це протокол, який гарантує, що жодна зміна даних не буде записана на диск до того, як відповідний запис у журналі буде збережений на постійний носій. Це фундаментальний механізм забезпечення властивостей **Durability** та **Atomicity** з ACID.

  Коли транзакція виконує INSERT, UPDATE або DELETE, зміни спочатку записуються в буфер WAL у пам'яті, потім при COMMIT синхронізуються на диск (fsync). Самі сторінки даних (heap pages) оновлюються в shared buffer cache і пізніше записуються на диск фоновим процесом. Це називається **write-ahead** -- журнал записується раніше за дані. При збою сервера неоновлені сторінки даних відновлюються шляхом повторення (replay) WAL-записів від останнього контрольного пункту.

  ```sql
  -- Перегляд поточної позиції WAL
  SELECT pg_current_wal_lsn();

  -- Перегляд налаштувань WAL
  SHOW wal_level;           -- minimal, replica, logical
  SHOW checkpoint_timeout;  -- інтервал між контрольними пунктами
  SHOW max_wal_size;        -- максимальний розмір WAL між checkpoint

  -- Примусовий контрольний пункт
  CHECKPOINT;

  -- Перегляд статистики checkpoint
  SELECT * FROM pg_stat_bgwriter;
  -- checkpoints_timed   -- автоматичні checkpoint
  -- checkpoints_req     -- примусові checkpoint
  ```

  **Checkpoint** (контрольний пункт) -- це процес, який записує всі брудні сторінки з буферного кешу на диск і фіксує позицію WAL, до якої відновлення не потрібне. Це зменшує час відновлення після збою, оскільки replay починається від останнього checkpoint, а не від початку WAL. **WAL archiving** дозволяє зберігати WAL-файли для Point-in-Time Recovery (PITR), що дає змогу відновити базу до будь-якого моменту часу між бекапами.
en_answer: |
  **WAL** (Write-Ahead Logging) is a protocol that guarantees no data change is written to disk before the corresponding log record is persisted to durable storage. This is the fundamental mechanism ensuring the **Durability** and **Atomicity** properties of ACID.

  When a transaction executes INSERT, UPDATE, or DELETE, changes are first written to the WAL buffer in memory, then synced to disk on COMMIT (fsync). The actual data pages (heap pages) are updated in shared buffer cache and later written to disk by a background process. This is called **write-ahead** -- the log is written before the data. On server crash, unwritten data pages are recovered by replaying WAL records from the last checkpoint.

  ```sql
  -- View current WAL position
  SELECT pg_current_wal_lsn();

  -- View WAL settings
  SHOW wal_level;           -- minimal, replica, logical
  SHOW checkpoint_timeout;  -- interval between checkpoints
  SHOW max_wal_size;        -- maximum WAL size between checkpoints

  -- Force a checkpoint
  CHECKPOINT;

  -- View checkpoint statistics
  SELECT * FROM pg_stat_bgwriter;
  -- checkpoints_timed   -- automatic checkpoints
  -- checkpoints_req     -- forced checkpoints
  ```

  A **checkpoint** is a process that writes all dirty pages from the buffer cache to disk and records the WAL position beyond which recovery is not needed. This reduces crash recovery time since replay starts from the last checkpoint, not from the beginning of WAL. **WAL archiving** allows saving WAL files for Point-in-Time Recovery (PITR), enabling database restoration to any point in time between backups.
section: "sql"
order: 19
tags:
  - wal
  - durability
  - recovery
type: "deep"
---
