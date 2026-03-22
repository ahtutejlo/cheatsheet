---
ua_question: "Як працює модель пам'яті Java (JMM) і що таке happens-before?"
en_question: "How does the Java Memory Model (JMM) work and what is happens-before?"
ua_answer: |
  Java Memory Model (JMM) визначає правила видимості змін між потоками. Без JMM компілятор та процесор можуть переупорядковувати інструкції, що призводить до несподіваних результатів у багатопотокових програмах. JMM гарантує, що при дотриманні певних правил, зміни зроблені одним потоком будуть видимі іншому.

  **Happens-before** -- це гарантія порядку: якщо дія A happens-before дії B, то результати A гарантовано видимі для B. Основні правила happens-before:
  - Запис у `volatile` змінну happens-before наступного читання цієї змінної іншим потоком
  - Вихід із `synchronized` блоку happens-before входу в блок на тому ж моніторі
  - `Thread.start()` happens-before будь-якої дії в запущеному потоці
  - Завершення потоку (`Thread.join()`) happens-before повернення з `join()` у потоці, що викликав

  ```java
  class SharedState {
      private volatile boolean ready = false;
      private int value = 0;

      // Thread 1
      void writer() {
          value = 42;          // (1)
          ready = true;        // (2) volatile write
      }

      // Thread 2
      void reader() {
          if (ready) {         // (3) volatile read
              // value guaranteed to be 42 here
              // because (2) happens-before (3)
              // and (1) happens-before (2) by program order
              System.out.println(value);
          }
      }
  }
  ```

  Без `volatile` на полі `ready` компілятор міг би переупорядкувати записи (1) і (2), і Thread 2 побачив би `ready == true`, але `value == 0`. Саме happens-before гарантує коректну видимість. Розуміння JMM критичне для написання коректного багатопотокового коду без data races -- це одне з найпоширеніших питань на senior-рівні.
en_answer: |
  Java Memory Model (JMM) defines rules for visibility of changes between threads. Without JMM, the compiler and processor can reorder instructions, leading to unexpected results in multithreaded programs. JMM guarantees that when certain rules are followed, changes made by one thread will be visible to another.

  **Happens-before** is an ordering guarantee: if action A happens-before action B, then the results of A are guaranteed to be visible to B. Key happens-before rules:
  - Writing to a `volatile` variable happens-before the next read of that variable by another thread
  - Exiting a `synchronized` block happens-before entering a block on the same monitor
  - `Thread.start()` happens-before any action in the started thread
  - Thread completion (`Thread.join()`) happens-before the return from `join()` in the calling thread

  ```java
  class SharedState {
      private volatile boolean ready = false;
      private int value = 0;

      // Thread 1
      void writer() {
          value = 42;          // (1)
          ready = true;        // (2) volatile write
      }

      // Thread 2
      void reader() {
          if (ready) {         // (3) volatile read
              // value guaranteed to be 42 here
              // because (2) happens-before (3)
              // and (1) happens-before (2) by program order
              System.out.println(value);
          }
      }
  }
  ```

  Without `volatile` on the `ready` field, the compiler could reorder writes (1) and (2), and Thread 2 might see `ready == true` but `value == 0`. It is happens-before that guarantees correct visibility. Understanding JMM is critical for writing correct multithreaded code without data races -- this is one of the most common senior-level interview questions.
section: "java"
order: 16
tags:
  - concurrency
  - jvm
  - memory-model
type: "deep"
---
