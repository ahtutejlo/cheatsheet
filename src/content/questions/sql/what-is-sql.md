---
ua_question: "Що таке SQL?"
en_question: "What is SQL?"
ua_answer: |
  **SQL** (Structured Query Language) -- це стандартна мова для управління та маніпулювання реляційними базами даних. SQL дозволяє створювати, читати, оновлювати та видаляти дані (CRUD операції).

  SQL поділяється на кілька підмов:
  - **DDL** (Data Definition Language) -- визначення структури: `CREATE`, `ALTER`, `DROP`
  - **DML** (Data Manipulation Language) -- маніпулювання даними: `SELECT`, `INSERT`, `UPDATE`, `DELETE`
  - **DCL** (Data Control Language) -- управління доступом: `GRANT`, `REVOKE`
  - **TCL** (Transaction Control Language) -- управління транзакціями: `COMMIT`, `ROLLBACK`, `SAVEPOINT`

  ```sql
  -- Створення таблиці
  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Вставка даних
  INSERT INTO users (name, email) VALUES ('Ivan', 'ivan@example.com');

  -- Вибірка даних
  SELECT name, email FROM users WHERE created_at > '2024-01-01';
  ```

  Популярні реляційні СУБД: **PostgreSQL**, **MySQL**, **SQLite**, **Microsoft SQL Server**, **Oracle Database**.
en_answer: |
  **SQL** (Structured Query Language) is the standard language for managing and manipulating relational databases. SQL allows you to create, read, update, and delete data (CRUD operations).

  SQL is divided into several sub-languages:
  - **DDL** (Data Definition Language) -- structure definition: `CREATE`, `ALTER`, `DROP`
  - **DML** (Data Manipulation Language) -- data manipulation: `SELECT`, `INSERT`, `UPDATE`, `DELETE`
  - **DCL** (Data Control Language) -- access control: `GRANT`, `REVOKE`
  - **TCL** (Transaction Control Language) -- transaction management: `COMMIT`, `ROLLBACK`, `SAVEPOINT`

  ```sql
  -- Create a table
  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Insert data
  INSERT INTO users (name, email) VALUES ('Ivan', 'ivan@example.com');

  -- Query data
  SELECT name, email FROM users WHERE created_at > '2024-01-01';
  ```

  Popular relational DBMS: **PostgreSQL**, **MySQL**, **SQLite**, **Microsoft SQL Server**, **Oracle Database**.
section: "sql"
order: 1
tags:
  - fundamentals
---
