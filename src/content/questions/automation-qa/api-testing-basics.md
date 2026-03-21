---
ua_question: "Що таке API тестування?"
en_question: "What is API testing?"
ua_answer: |
  API тестування -- це тестування інтерфейсів програмування додатків (Application Programming Interface) без залучення користувацького інтерфейсу. Тести перевіряють бізнес-логіку, обробку даних та відповіді сервера.

  **Що перевіряють при API тестуванні:**
  - **Статус-коди відповідей** (200, 201, 400, 404, 500)
  - **Тіло відповіді** -- структура та дані JSON/XML
  - **Заголовки** -- Content-Type, Authorization
  - **Час відповіді** -- продуктивність API
  - **Обробка помилок** -- коректні повідомлення при невалідних запитах

  **Популярні інструменти:**
  - **Postman** -- GUI інструмент для ручного та автоматизованого API тестування
  - **REST Assured** -- Java бібліотека для API автоматизації
  - **RestSharp** -- C# бібліотека
  - **requests** -- Python бібліотека

  ```java
  // REST Assured приклад
  given()
      .header("Content-Type", "application/json")
      .body("{\"name\": \"John\", \"email\": \"john@example.com\"}")
  .when()
      .post("/api/users")
  .then()
      .statusCode(201)
      .body("name", equalTo("John"))
      .body("id", notNullValue());
  ```

  API тестування швидше та стабільніше за UI тестування і знаходиться на середньому рівні піраміди тестування.
en_answer: |
  API testing is testing Application Programming Interfaces without involving the user interface. Tests verify business logic, data processing, and server responses.

  **What is checked in API testing:**
  - **Response status codes** (200, 201, 400, 404, 500)
  - **Response body** -- JSON/XML structure and data
  - **Headers** -- Content-Type, Authorization
  - **Response time** -- API performance
  - **Error handling** -- correct messages for invalid requests

  **Popular tools:**
  - **Postman** -- GUI tool for manual and automated API testing
  - **REST Assured** -- Java library for API automation
  - **RestSharp** -- C# library
  - **requests** -- Python library

  ```java
  // REST Assured example
  given()
      .header("Content-Type", "application/json")
      .body("{\"name\": \"John\", \"email\": \"john@example.com\"}")
  .when()
      .post("/api/users")
  .then()
      .statusCode(201)
      .body("name", equalTo("John"))
      .body("id", notNullValue());
  ```

  API testing is faster and more stable than UI testing and sits at the middle level of the testing pyramid.
section: "automation-qa"
order: 9
tags:
  - api-testing
  - rest-assured
---
