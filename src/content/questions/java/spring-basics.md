---
ua_question: "Що таке Spring Framework?"
en_question: "What is Spring Framework?"
ua_answer: |
  Spring Framework -- це найпопулярніший фреймворк для розробки enterprise Java додатків. Він надає інфраструктуру для створення масштабованих та тестованих додатків.

  **Основні концепції:**

  **1. Inversion of Control (IoC) / Dependency Injection (DI)**
  - Spring створює та управляє об'єктами (beans)
  - Залежності інжектуються автоматично замість ручного створення

  ```java
  @Service
  public class UserService {
      private final UserRepository userRepository;

      @Autowired
      public UserService(UserRepository userRepository) {
          this.userRepository = userRepository;
      }

      public User findById(Long id) {
          return userRepository.findById(id)
              .orElseThrow(() -> new UserNotFoundException(id));
      }
  }
  ```

  **2. Spring Boot** -- спрощує конфігурацію Spring додатків:
  - Автоконфігурація
  - Вбудований сервер (Tomcat)
  - Starter залежності

  **3. Основні модулі:**
  - **Spring MVC** -- веб-додатки та REST API
  - **Spring Data JPA** -- робота з базами даних
  - **Spring Security** -- автентифікація та авторизація
  - **Spring Cloud** -- мікросервісна архітектура

  ```java
  @RestController
  @RequestMapping("/api/users")
  public class UserController {
      @GetMapping("/{id}")
      public ResponseEntity<User> getUser(@PathVariable Long id) {
          return ResponseEntity.ok(userService.findById(id));
      }

      @PostMapping
      public ResponseEntity<User> createUser(@RequestBody User user) {
          return ResponseEntity.status(201).body(userService.save(user));
      }
  }
  ```
en_answer: |
  Spring Framework is the most popular framework for developing enterprise Java applications. It provides infrastructure for creating scalable and testable applications.

  **Core concepts:**

  **1. Inversion of Control (IoC) / Dependency Injection (DI)**
  - Spring creates and manages objects (beans)
  - Dependencies are injected automatically instead of manual creation

  ```java
  @Service
  public class UserService {
      private final UserRepository userRepository;

      @Autowired
      public UserService(UserRepository userRepository) {
          this.userRepository = userRepository;
      }

      public User findById(Long id) {
          return userRepository.findById(id)
              .orElseThrow(() -> new UserNotFoundException(id));
      }
  }
  ```

  **2. Spring Boot** -- simplifies Spring application configuration:
  - Auto-configuration
  - Embedded server (Tomcat)
  - Starter dependencies

  **3. Core modules:**
  - **Spring MVC** -- web applications and REST API
  - **Spring Data JPA** -- database access
  - **Spring Security** -- authentication and authorization
  - **Spring Cloud** -- microservice architecture

  ```java
  @RestController
  @RequestMapping("/api/users")
  public class UserController {
      @GetMapping("/{id}")
      public ResponseEntity<User> getUser(@PathVariable Long id) {
          return ResponseEntity.ok(userService.findById(id));
      }

      @PostMapping
      public ResponseEntity<User> createUser(@RequestBody User user) {
          return ResponseEntity.status(201).body(userService.save(user));
      }
  }
  ```
section: "java"
order: 15
tags:
  - spring
  - framework
---
