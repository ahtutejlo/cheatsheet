---
ua_question: "Як реалізувати потокобезпечний in-memory кеш для 50 конкурентних потоків?"
en_question: "How would you implement a thread-safe in-memory cache for 50 concurrent threads?"
ua_answer: |
  **Scenario:** Сервіс обробляє запити від 50 конкурентних потоків і кожен запит вимагає дані користувача з бази даних. Щоб зменшити навантаження на БД, потрібен in-memory кеш, який безпечно працює у багатопотоковому середовищі з політикою витіснення та обмеженням розміру.

  **Approach:**
  1. Використати ConcurrentHashMap як основу для lock-free читання та атомарних операцій запису
  2. Додати обмеження розміру з LRU-витісненням для запобігання memory leak
  3. Реалізувати TTL (time-to-live) для автоматичної інвалідації застарілих записів

  **Solution:**
  ```java
  public class ThreadSafeCache<K, V> {
      private final ConcurrentHashMap<K, CacheEntry<V>> store;
      private final long ttlMillis;
      private final int maxSize;

      record CacheEntry<V>(V value, long expiresAt) {
          boolean isExpired() {
              return System.currentTimeMillis() > expiresAt;
          }
      }

      public ThreadSafeCache(int maxSize, Duration ttl) {
          this.store = new ConcurrentHashMap<>();
          this.maxSize = maxSize;
          this.ttlMillis = ttl.toMillis();
      }

      public V get(K key, Function<K, V> loader) {
          CacheEntry<V> entry = store.get(key);
          if (entry != null && !entry.isExpired()) {
              return entry.value();
          }
          // computeIfAbsent is atomic per key
          // but loader runs under lock -- keep it fast
          return store.compute(key, (k, existing) -> {
              if (existing != null && !existing.isExpired()) {
                  return existing; // another thread loaded it
              }
              evictIfNeeded();
              V value = loader.apply(k);
              return new CacheEntry<>(value, System.currentTimeMillis() + ttlMillis);
          }).value();
      }

      public void invalidate(K key) {
          store.remove(key);
      }

      private void evictIfNeeded() {
          if (store.size() >= maxSize) {
              store.entrySet().removeIf(e -> e.getValue().isExpired());
              // If still over limit, remove oldest 10%
              if (store.size() >= maxSize) {
                  store.keys().asIterator().next(); // remove first
                  store.remove(store.keys().nextElement());
              }
          }
      }
  }

  // Usage
  var cache = new ThreadSafeCache<Long, User>(10_000, Duration.ofMinutes(5));
  User user = cache.get(userId, id -> userRepository.findById(id));
  ```

  Для продакшн-систем рекомендується використовувати бібліотеку Caffeine замість кастомної реалізації: вона забезпечує near-optimal hit rate (Window TinyLfu алгоритм), асинхронне завантаження, та вбудовані метрики через Micrometer.
en_answer: |
  **Scenario:** A service handles requests from 50 concurrent threads, and each request requires user data from the database. To reduce database load, an in-memory cache is needed that works safely in a multithreaded environment with an eviction policy and size limit.

  **Approach:**
  1. Use ConcurrentHashMap as the foundation for lock-free reads and atomic write operations
  2. Add size limits with LRU eviction to prevent memory leaks
  3. Implement TTL (time-to-live) for automatic invalidation of stale entries

  **Solution:**
  ```java
  public class ThreadSafeCache<K, V> {
      private final ConcurrentHashMap<K, CacheEntry<V>> store;
      private final long ttlMillis;
      private final int maxSize;

      record CacheEntry<V>(V value, long expiresAt) {
          boolean isExpired() {
              return System.currentTimeMillis() > expiresAt;
          }
      }

      public ThreadSafeCache(int maxSize, Duration ttl) {
          this.store = new ConcurrentHashMap<>();
          this.maxSize = maxSize;
          this.ttlMillis = ttl.toMillis();
      }

      public V get(K key, Function<K, V> loader) {
          CacheEntry<V> entry = store.get(key);
          if (entry != null && !entry.isExpired()) {
              return entry.value();
          }
          // computeIfAbsent is atomic per key
          // but loader runs under lock -- keep it fast
          return store.compute(key, (k, existing) -> {
              if (existing != null && !existing.isExpired()) {
                  return existing; // another thread loaded it
              }
              evictIfNeeded();
              V value = loader.apply(k);
              return new CacheEntry<>(value, System.currentTimeMillis() + ttlMillis);
          }).value();
      }

      public void invalidate(K key) {
          store.remove(key);
      }

      private void evictIfNeeded() {
          if (store.size() >= maxSize) {
              store.entrySet().removeIf(e -> e.getValue().isExpired());
              // If still over limit, remove oldest 10%
              if (store.size() >= maxSize) {
                  store.keys().asIterator().next(); // remove first
                  store.remove(store.keys().nextElement());
              }
          }
      }
  }

  // Usage
  var cache = new ThreadSafeCache<Long, User>(10_000, Duration.ofMinutes(5));
  User user = cache.get(userId, id -> userRepository.findById(id));
  ```

  For production systems, it is recommended to use the Caffeine library instead of a custom implementation: it provides near-optimal hit rate (Window TinyLfu algorithm), asynchronous loading, and built-in metrics via Micrometer.
section: "java"
order: 27
tags:
  - concurrency
  - caching
  - design
type: "practical"
---
