---
ua_question: "Яка різниця між Primary Key та Foreign Key?"
en_question: "What is the difference between Primary Key and Foreign Key?"
ua_answer: |
  **Primary Key** (первинний ключ) та **Foreign Key** (зовнішній ключ) -- це обмеження (constraints), які забезпечують цілісність даних у реляційній базі даних.

  **Primary Key:**
  - Унікально ідентифікує кожний рядок у таблиці
  - Не може містити NULL значення
  - Таблиця може мати лише один Primary Key
  - Автоматично створює унікальний індекс
  - Може складатися з одного або кількох стовпців (складений ключ)

  **Foreign Key:**
  - Посилається на Primary Key іншої таблиці
  - Забезпечує **референціальну цілісність** -- не можна додати посилання на неіснуючий запис
  - Може містити NULL значення
  - Таблиця може мати кілька Foreign Keys
  - Підтримує каскадні операції (`ON DELETE CASCADE`, `ON UPDATE CASCADE`)

  ```sql
  CREATE TABLE departments (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL
  );

  CREATE TABLE employees (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      department_id INT,
      manager_id INT,
      FOREIGN KEY (department_id) REFERENCES departments(id)
          ON DELETE SET NULL,
      FOREIGN KEY (manager_id) REFERENCES employees(id)
          ON DELETE SET NULL
  );
  ```
en_answer: |
  **Primary Key** and **Foreign Key** are constraints that ensure data integrity in a relational database.

  **Primary Key:**
  - Uniquely identifies each row in a table
  - Cannot contain NULL values
  - A table can have only one Primary Key
  - Automatically creates a unique index
  - Can consist of one or more columns (composite key)

  **Foreign Key:**
  - References the Primary Key of another table
  - Ensures **referential integrity** -- cannot add a reference to a non-existent record
  - Can contain NULL values
  - A table can have multiple Foreign Keys
  - Supports cascading operations (`ON DELETE CASCADE`, `ON UPDATE CASCADE`)

  ```sql
  CREATE TABLE departments (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL
  );

  CREATE TABLE employees (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      department_id INT,
      manager_id INT,
      FOREIGN KEY (department_id) REFERENCES departments(id)
          ON DELETE SET NULL,
      FOREIGN KEY (manager_id) REFERENCES employees(id)
          ON DELETE SET NULL
  );
  ```
section: "sql"
order: 9
tags:
  - design
---
