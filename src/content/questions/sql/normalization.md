---
ua_question: "Що таке нормалізація бази даних?"
en_question: "What is database normalization?"
ua_answer: |
  **Нормалізація** -- це процес організації таблиць бази даних для зменшення надлишковості даних та забезпечення цілісності. Нормалізація виконується через серію **нормальних форм** (NF).

  **1NF** (Перша нормальна форма):
  - Кожна комірка містить лише одне атомарне значення
  - Немає повторюваних груп стовпців

  **2NF** (Друга нормальна форма):
  - Відповідає 1NF
  - Усі неключові стовпці повністю залежать від первинного ключа (не від його частини)

  **3NF** (Третя нормальна форма):
  - Відповідає 2NF
  - Немає транзитивних залежностей (неключові стовпці не залежать один від одного)

  ```sql
  -- Ненормалізована таблиця
  -- orders: id, customer_name, customer_email, product1, product2

  -- Після нормалізації (3NF):
  CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(255)
  );

  CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES customers(id),
      created_at TIMESTAMP
  );

  CREATE TABLE order_items (
      id SERIAL PRIMARY KEY,
      order_id INT REFERENCES orders(id),
      product_id INT REFERENCES products(id),
      quantity INT
  );
  ```

  **Денормалізація** -- навмисне додавання надлишковості для покращення продуктивності читання. Використовується у OLAP системах та кешуванні.
en_answer: |
  **Normalization** is the process of organizing database tables to reduce data redundancy and ensure integrity. Normalization is performed through a series of **normal forms** (NF).

  **1NF** (First Normal Form):
  - Each cell contains only one atomic value
  - No repeating groups of columns

  **2NF** (Second Normal Form):
  - Meets 1NF
  - All non-key columns fully depend on the primary key (not on part of it)

  **3NF** (Third Normal Form):
  - Meets 2NF
  - No transitive dependencies (non-key columns don't depend on each other)

  ```sql
  -- Unnormalized table
  -- orders: id, customer_name, customer_email, product1, product2

  -- After normalization (3NF):
  CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(255)
  );

  CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES customers(id),
      created_at TIMESTAMP
  );

  CREATE TABLE order_items (
      id SERIAL PRIMARY KEY,
      order_id INT REFERENCES orders(id),
      product_id INT REFERENCES products(id),
      quantity INT
  );
  ```

  **Denormalization** is the intentional addition of redundancy to improve read performance. Used in OLAP systems and caching.
section: "sql"
order: 7
tags:
  - design
---
