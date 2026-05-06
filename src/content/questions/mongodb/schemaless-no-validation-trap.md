---
ua_question: "MongoDB schemaless — отже валідація не потрібна?"
en_question: "MongoDB is schemaless — so no validation needed?"
ua_answer: |
  > **Trap:** "MongoDB не має схеми, тому записати можна будь-який JSON — валідацію зробимо на рівні застосунку." Цей міф призводить до production-катастроф через 6 місяців, коли документи в одній колекції мають 5 різних форм.

  **Реальність:** Mongo за замовчуванням **flexible-schema**, не schemaless. Тобто: schema є — вона неявно живе у вашому коді. Без явного schema у БД, валідації або перевірок, ви отримаєте:
  - Поле `email` як string у 90% документів і `["a@b.com", "c@d.com"]` array у 10%
  - `created_at` то як ISODate, то як string `"2024-01-15"`
  - Опечатки в назвах полів (`user_id` vs `userId`) — тихо створюються "нові" поля

  **Що Mongo дає для валідації:**

  **JSON Schema validation на рівні колекції:**

  ```javascript
  db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "createdAt", "userId"],
        properties: {
          email: {
            bsonType: "string",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
          },
          createdAt: { bsonType: "date" },
          userId: { bsonType: "string", pattern: "^u_[0-9]+$" },
          age: { bsonType: "int", minimum: 0, maximum: 150 }
        }
      }
    },
    validationLevel: "strict",   // | "moderate" (only for new docs)
    validationAction: "error"    // | "warn" (log instead of reject)
  })
  ```

  **На рівні застосунку (Python):**
  ```python
  from pydantic import BaseModel, EmailStr, field_validator
  from datetime import datetime

  class User(BaseModel):
      user_id: str
      email: EmailStr
      created_at: datetime
      age: int | None = None

      @field_validator("user_id")
      def valid_uid(cls, v):
          if not v.startswith("u_"):
              raise ValueError("invalid user_id format")
          return v

  # При запису
  validated = User(**raw_data).model_dump()
  db.users.insert_one(validated)
  ```

  **Чому валідація потрібна:**
  1. **Bug shielding** — race conditions у застосунку не запишуть кривий документ
  2. **Backward compatibility** — стара версія застосунку не зможе ламати інваріанти
  3. **Аналітика** — `$avg("age")` не падає на документах з `age: "twenty"`
  4. **Тестування** — тести на API детектують схема-зміни одразу, а не через тиждень
  5. **Compliance** — SOC2/HIPAA вимагають демонструвати, що PII зберігається у відомому форматі

  **Як використовувати в тестовій інфрі:**
  - **Schema migration tests** — runтайте `validate_collection_against_schema` як частину CI; кожна зміна моделі ламає тест навмисне, форсуючи migration
  - **Production data sampling** — періодично заміряйте, скільки документів падає `$jsonSchema` валідації; це rivet до technical debt
  - **Fuzz-тести** — генеруйте semi-valid documents через Hypothesis і перевіряйте, що application код graceful обробляє

  **Що НЕ робити:**
  - "Валідація сповільнить writes" — overhead менше 1ms на документ, prod-критично рідко
  - "Будемо валідувати на API gateway" — гарантії слабші, бо direct DB access (script, mongoimport) обходить
  - Робити схеми лише для нових колекцій — старі вже забагнені, але `validationAction: "warn"` дає сигнал

  **Висновок:** Mongo flexible не означає "без правил". Schema-on-write через `$jsonSchema` + Pydantic/JSON Schema на app-рівні — стандарт серйозного MongoDB-проєкту.
en_answer: |
  > **Trap:** "MongoDB has no schema, so we can write any JSON — we'll validate in the app." This myth causes production disasters six months later when documents in one collection have five different shapes.

  **Reality:** Mongo is **flexible-schema**, not schemaless. The schema exists — it implicitly lives in your code. Without an explicit DB-side schema, validation, or checks, you get:
  - `email` as a string in 90% of documents and `["a@b.com", "c@d.com"]` array in 10%
  - `created_at` as ISODate sometimes, as string `"2024-01-15"` other times
  - Field-name typos (`user_id` vs `userId`) silently creating "new" fields

  **What Mongo provides for validation:**

  **JSON Schema validation at the collection level:**

  ```javascript
  db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "createdAt", "userId"],
        properties: {
          email: {
            bsonType: "string",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
          },
          createdAt: { bsonType: "date" },
          userId: { bsonType: "string", pattern: "^u_[0-9]+$" },
          age: { bsonType: "int", minimum: 0, maximum: 150 }
        }
      }
    },
    validationLevel: "strict",   // | "moderate" (only new docs)
    validationAction: "error"    // | "warn" (log instead of reject)
  })
  ```

  **At the application level (Python):**
  ```python
  from pydantic import BaseModel, EmailStr, field_validator
  from datetime import datetime

  class User(BaseModel):
      user_id: str
      email: EmailStr
      created_at: datetime
      age: int | None = None

      @field_validator("user_id")
      def valid_uid(cls, v):
          if not v.startswith("u_"):
              raise ValueError("invalid user_id format")
          return v

  # On write
  validated = User(**raw_data).model_dump()
  db.users.insert_one(validated)
  ```

  **Why validation is needed:**
  1. **Bug shielding** — race conditions in the app can't write a broken document
  2. **Backward compatibility** — an old app version can't break invariants
  3. **Analytics** — `$avg("age")` doesn't crash on documents with `age: "twenty"`
  4. **Testing** — API tests catch schema changes immediately, not a week later
  5. **Compliance** — SOC2/HIPAA require showing that PII is stored in a known format

  **How to use in test infrastructure:**
  - **Schema migration tests** — run `validate_collection_against_schema` as part of CI; every model change breaks the test on purpose, forcing a migration
  - **Production data sampling** — periodically measure how many documents fail `$jsonSchema` validation; this drives technical debt visibility
  - **Fuzz tests** — generate semi-valid documents via Hypothesis and verify the application handles them gracefully

  **Don't:**
  - "Validation slows writes" — overhead is sub-millisecond per doc, almost never prod-critical
  - "We'll validate at the API gateway" — guarantees are weaker because direct DB access (scripts, mongoimport) bypasses
  - Schema only for new collections — old ones are already polluted, but `validationAction: "warn"` gives signal

  **Bottom line:** "flexible" Mongo does not mean "no rules". Schema-on-write via `$jsonSchema` + Pydantic / JSON Schema at the app level is the standard for any serious MongoDB project.
section: "mongodb"
order: 7
tags: [mongodb, validation, schema, data-quality]
type: "trick"
---
