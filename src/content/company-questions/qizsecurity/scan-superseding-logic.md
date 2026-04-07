---
company: "qizsecurity"
stage: "technical-interview-2"
ua_question: "Огляньте систему Scan Superseding Logic та опишіть тест-кейси які ви покриєте"
en_question: "Review the Scan Superseding Logic system and describe the test cases you would cover"
ua_answer: |
  **Система:**
  Ingester забирає pending скани з Postgres, групує по `(data_source_config_id + template_id)`,
  найновіший → `processing`, решта → `skipped`. Використовує `SELECT FOR UPDATE SKIP LOCKED`.

  **Статуси:** pending → processing → done/failed; pending → skipped

  **Тест-кейси:**

  **1. Happy path — базова superseding логіка**
  → 3 pending скани для одного конфіга (10:01, 10:02, 10:03)
  ✅ Найновіший (10:03) → processing
  ✅ Решта → skipped з error = "superseded by newer scan"

  **2. Один скан у групі**
  → 1 pending скан
  ✅ Переходить в processing без superseding

  **3. Різні конфіги незалежні**
  → config-1 має 3 скани, config-2 має 2 скани
  ✅ Кожна група обробляється окремо, по 1 processing на групу

  **4. Однакові timestamp у групі**
  → Два скани з однаковим scanned_at
  ✅ Вибір детермінований (по id), не рандомний

  **5. Non-pending скани ігноруються**
  → Є done/failed/processing скани в таблиці
  ✅ Ingester їх не торкає

  **6. Порожня таблиця**
  ✅ Нічого не падає, завершується нормально

  **7. Конкурентність — два ingester-поди**
  → Запускаємо 2 інстанси паралельно для одного набору сканів
  ✅ Один скан не потрапляє в processing двічі
  ✅ SKIP LOCKED: другий под пропускає заблоковані рядки, не чекає

  **8. Атомарність транзакції**
  → Симулюємо помилку після часткового оновлення
  ✅ Rollback — всі скани повертаються в pending

  **9. error поле**
  ✅ skipped скани: error = "superseded by newer scan"
  ✅ processing скан: error порожній

  **10. Великий batch**
  → 100+ pending сканів для одного конфіга
  ✅ Рівно 1 processing, решта skipped, без дублів

en_answer: |
  **System:**
  Ingester picks pending scans from Postgres, groups by `(data_source_config_id + template_id)`,
  newest → `processing`, rest → `skipped`. Uses `SELECT FOR UPDATE SKIP LOCKED`.

  **Statuses:** pending → processing → done/failed; pending → skipped

  **Test Cases:**

  **1. Happy path — basic superseding logic**
  → 3 pending scans for same config (10:01, 10:02, 10:03)
  ✅ Newest (10:03) → processing
  ✅ Rest → skipped with error = "superseded by newer scan"

  **2. Single scan in group**
  → 1 pending scan
  ✅ Goes to processing, no superseding occurs

  **3. Different configs are independent**
  → config-1 has 3 scans, config-2 has 2 scans
  ✅ Each group handled separately, 1 processing per group

  **4. Identical timestamps in group**
  → Two scans with same scanned_at
  ✅ Selection is deterministic (by id), not random

  **5. Non-pending scans are ignored**
  → done/failed/processing scans exist in table
  ✅ Ingester doesn't touch them

  **6. Empty table**
  ✅ No crash, ingester exits cleanly

  **7. Concurrency — two ingester pods**
  → Run 2 instances simultaneously on same scan set
  ✅ Same scan doesn't enter processing twice
  ✅ SKIP LOCKED: second pod skips locked rows, doesn't block

  **8. Transaction atomicity**
  → Simulate failure mid-update
  ✅ Rollback — all scans return to pending

  **9. error field**
  ✅ Skipped scans: error = "superseded by newer scan"
  ✅ Processing scan: error is empty

  **10. Large batch**
  → 100+ pending scans for one config
  ✅ Exactly 1 processing, rest skipped, no duplicates
tags: [testing, concurrency, postgres, select-for-update, system-design]
order: 2
---
