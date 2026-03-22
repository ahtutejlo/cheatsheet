---
ua_question: "Як знайти та виправити memory leak у продакшн Java-додатку?"
en_question: "How would you find and fix a memory leak in a production Java application?"
ua_answer: |
  **Scenario:** Продакшн-додаток на Java починає отримувати OutOfMemoryError після 48 годин роботи. Heap використання постійно зростає навіть при стабільному навантаженні. Перезапуск тимчасово вирішує проблему, але витік повертається.

  **Approach:**
  1. Увімкнути автоматичний heap dump при OOM: `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/heapdump.hprof`
  2. Проаналізувати heap dump за допомогою Eclipse MAT (Memory Analyzer Tool) для знаходження retained objects
  3. Знайти GC roots, які утримують об'єкти від збирання, та виправити код

  **Solution:**
  ```java
  // Common leak pattern 1: unbounded cache
  // BAD: HashMap grows forever
  class UserService {
      private Map<Long, User> cache = new HashMap<>();

      public User getUser(Long id) {
          return cache.computeIfAbsent(id, this::loadFromDb);
          // cache never evicts entries!
      }
  }

  // FIX: use bounded cache with eviction
  class UserService {
      private Map<Long, User> cache = new LinkedHashMap<>(100, 0.75f, true) {
          @Override
          protected boolean removeEldestEntry(Map.Entry<Long, User> eldest) {
              return size() > 1000; // evict when over 1000 entries
          }
      };
      // Or use Caffeine/Guava cache with TTL
      // Cache<Long, User> cache = Caffeine.newBuilder()
      //     .maximumSize(1000).expireAfterWrite(Duration.ofMinutes(30)).build();
  }

  // Common leak pattern 2: unclosed resources
  // BAD: connection leak
  Connection conn = dataSource.getConnection();
  Statement stmt = conn.createStatement();
  ResultSet rs = stmt.executeQuery("SELECT * FROM users");
  // exception here -> connection never closed!

  // FIX: try-with-resources
  try (Connection conn = dataSource.getConnection();
       Statement stmt = conn.createStatement();
       ResultSet rs = stmt.executeQuery("SELECT * FROM users")) {
      while (rs.next()) { /* process */ }
  } // auto-closed even on exception
  ```

  Для моніторингу у продакшені використовуйте JFR (Java Flight Recorder) з мінімальним overhead: `java -XX:StartFlightRecording=duration=60s,filename=recording.jfr`. JFR показує алокації, GC-паузи та витрати пам'яті без суттєвого впливу на продуктивність.
en_answer: |
  **Scenario:** A production Java application starts receiving OutOfMemoryError after 48 hours of operation. Heap usage continuously grows even under stable load. Restarting temporarily fixes the problem, but the leak returns.

  **Approach:**
  1. Enable automatic heap dump on OOM: `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/heapdump.hprof`
  2. Analyze the heap dump with Eclipse MAT (Memory Analyzer Tool) to find retained objects
  3. Find GC roots that prevent objects from being collected and fix the code

  **Solution:**
  ```java
  // Common leak pattern 1: unbounded cache
  // BAD: HashMap grows forever
  class UserService {
      private Map<Long, User> cache = new HashMap<>();

      public User getUser(Long id) {
          return cache.computeIfAbsent(id, this::loadFromDb);
          // cache never evicts entries!
      }
  }

  // FIX: use bounded cache with eviction
  class UserService {
      private Map<Long, User> cache = new LinkedHashMap<>(100, 0.75f, true) {
          @Override
          protected boolean removeEldestEntry(Map.Entry<Long, User> eldest) {
              return size() > 1000; // evict when over 1000 entries
          }
      };
      // Or use Caffeine/Guava cache with TTL
      // Cache<Long, User> cache = Caffeine.newBuilder()
      //     .maximumSize(1000).expireAfterWrite(Duration.ofMinutes(30)).build();
  }

  // Common leak pattern 2: unclosed resources
  // BAD: connection leak
  Connection conn = dataSource.getConnection();
  Statement stmt = conn.createStatement();
  ResultSet rs = stmt.executeQuery("SELECT * FROM users");
  // exception here -> connection never closed!

  // FIX: try-with-resources
  try (Connection conn = dataSource.getConnection();
       Statement stmt = conn.createStatement();
       ResultSet rs = stmt.executeQuery("SELECT * FROM users")) {
      while (rs.next()) { /* process */ }
  } // auto-closed even on exception
  ```

  For production monitoring, use JFR (Java Flight Recorder) with minimal overhead: `java -XX:StartFlightRecording=duration=60s,filename=recording.jfr`. JFR shows allocations, GC pauses, and memory usage without significant performance impact.
section: "java"
order: 26
tags:
  - debugging
  - memory
  - jvm
type: "practical"
---
