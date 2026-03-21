---
ua_question: "Що таке SQL ін'єкція і як від неї захиститись?"
en_question: "What is SQL injection and how to prevent it?"
ua_answer: |
  **SQL ін'єкція** -- це атака, при якій зловмисник вставляє шкідливий SQL-код у вхідні дані застосунку. Це одна з найпоширеніших та найнебезпечніших вразливостей веб-застосунків.

  **Приклад вразливого коду:**
  ```sql
  -- Небезпечно! Конкатенація вхідних даних
  SELECT * FROM users WHERE name = '' OR '1'='1' --'
  -- Зловмисник ввів: ' OR '1'='1' --
  -- Результат: повертає ВСІ записи
  ```

  **Методи захисту:**

  **1. Параметризовані запити (Prepared Statements)** -- найефективніший метод:
  ```sql
  -- PostgreSQL
  PREPARE user_query (text) AS
  SELECT * FROM users WHERE name = $1;
  EXECUTE user_query('Ivan');
  ```

  **2. ORM** -- використання об'єктно-реляційного маппінгу, який автоматично екранує вхідні дані.

  **3. Валідація вхідних даних** -- перевірка типу, довжини, формату вхідних даних.

  **4. Принцип найменших привілеїв** -- база даних повинна мати лише необхідні дозволи.

  **5. Stored Procedures** -- виклик процедур замість динамічних запитів.

  **Типи SQL ін'єкцій:** класична (in-band), сліпа (blind -- Boolean/Time-based), out-of-band (через DNS/HTTP канали).
en_answer: |
  **SQL injection** is an attack where a malicious actor inserts harmful SQL code into an application's input data. It is one of the most common and dangerous web application vulnerabilities.

  **Example of vulnerable code:**
  ```sql
  -- Dangerous! Input concatenation
  SELECT * FROM users WHERE name = '' OR '1'='1' --'
  -- Attacker entered: ' OR '1'='1' --
  -- Result: returns ALL records
  ```

  **Protection methods:**

  **1. Parameterized queries (Prepared Statements)** -- the most effective method:
  ```sql
  -- PostgreSQL
  PREPARE user_query (text) AS
  SELECT * FROM users WHERE name = $1;
  EXECUTE user_query('Ivan');
  ```

  **2. ORM** -- using Object-Relational Mapping, which automatically escapes input data.

  **3. Input validation** -- checking type, length, and format of input data.

  **4. Principle of least privilege** -- the database should have only necessary permissions.

  **5. Stored Procedures** -- calling procedures instead of dynamic queries.

  **Types of SQL injection:** classic (in-band), blind (Boolean/Time-based), out-of-band (via DNS/HTTP channels).
section: "sql"
order: 14
tags:
  - security
---
