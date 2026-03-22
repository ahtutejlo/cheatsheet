---
ua_question: "Як оптимізувати GC для досягнення пауз менше 10 мілісекунд?"
en_question: "How would you optimize GC to achieve sub-10ms pauses?"
ua_answer: |
  **Scenario:** Торгова платформа (trading application) на Java потребує затримки відповіді менше 10 мс. GC-паузи G1 collector досягають 50-200 мс, що порушує SLA. Heap розміром 8 ГБ, live data set ~3 ГБ, ~500 тис. алокацій/сек.

  **Approach:**
  1. Проаналізувати поточні GC-логи для розуміння частоти та тривалості пауз
  2. Обрати low-latency збирач (ZGC або Shenandoah) з конкурентною евакуацією
  3. Налаштувати heap та перевірити метрики під навантаженням

  **Solution:**
  ```java
  // Step 1: Enable GC logging for analysis
  // java -Xlog:gc*:file=gc.log:time,uptime,level,tags:filecount=5,filesize=100m

  // Step 2: Switch to ZGC (Java 17+, production-ready)
  // java -XX:+UseZGC
  //      -Xmx8g -Xms8g              // fixed heap size (avoid resizing)
  //      -XX:SoftMaxHeapSize=7g      // encourage collection before max
  //      -Xlog:gc*:file=gc.log

  // ZGC characteristics:
  // - Pause times < 1ms regardless of heap size
  // - Concurrent marking, relocation, and reference processing
  // - Supports heaps from 8MB to 16TB
  // - ~15% throughput overhead vs G1

  // Alternative: Shenandoah (available in OpenJDK)
  // java -XX:+UseShenandoahGC
  //      -Xmx8g -Xms8g
  //      -XX:ShenandoahGCHeuristics=adaptive

  // Step 3: Verify with JFR
  // java -XX:StartFlightRecording=duration=300s,filename=profile.jfr
  //      -XX:+UseZGC -Xmx8g -jar trading-app.jar

  // Step 4: Application-level optimizations
  public class OrderProcessor {
      // Pre-allocate buffers to reduce allocation rate
      private final ThreadLocal<ByteBuffer> bufferPool =
          ThreadLocal.withInitial(() -> ByteBuffer.allocateDirect(4096));

      // Use primitive collections to avoid autoboxing
      // (Eclipse Collections, HPPC, or Koloboke)
      // IntObjectHashMap<Order> instead of HashMap<Integer, Order>

      // Object pooling for hot-path objects
      private final ObjectPool<Order> orderPool = new ObjectPool<>(Order::new, 1000);
  }
  ```

  Порівняння збирачів для low-latency: ZGC забезпечує паузи менше 1 мс незалежно від розміру heap (найкращий вибір для Java 17+). Shenandoah -- альтернатива з подібними характеристиками, доступна в OpenJDK. G1 з `-XX:MaxGCPauseMillis=10` може досягти 10-20 мс, але не гарантує це при великому heap. Окрім вибору збирача, зменшення швидкості алокацій (allocation rate) через object pooling та примітивні колекції дає найбільший ефект.
en_answer: |
  **Scenario:** A trading application on Java requires response latency under 10ms. G1 collector GC pauses reach 50-200ms, violating the SLA. Heap size is 8GB, live data set ~3GB, ~500K allocations/sec.

  **Approach:**
  1. Analyze current GC logs to understand pause frequency and duration
  2. Choose a low-latency collector (ZGC or Shenandoah) with concurrent evacuation
  3. Tune heap and verify metrics under load

  **Solution:**
  ```java
  // Step 1: Enable GC logging for analysis
  // java -Xlog:gc*:file=gc.log:time,uptime,level,tags:filecount=5,filesize=100m

  // Step 2: Switch to ZGC (Java 17+, production-ready)
  // java -XX:+UseZGC
  //      -Xmx8g -Xms8g              // fixed heap size (avoid resizing)
  //      -XX:SoftMaxHeapSize=7g      // encourage collection before max
  //      -Xlog:gc*:file=gc.log

  // ZGC characteristics:
  // - Pause times < 1ms regardless of heap size
  // - Concurrent marking, relocation, and reference processing
  // - Supports heaps from 8MB to 16TB
  // - ~15% throughput overhead vs G1

  // Alternative: Shenandoah (available in OpenJDK)
  // java -XX:+UseShenandoahGC
  //      -Xmx8g -Xms8g
  //      -XX:ShenandoahGCHeuristics=adaptive

  // Step 3: Verify with JFR
  // java -XX:StartFlightRecording=duration=300s,filename=profile.jfr
  //      -XX:+UseZGC -Xmx8g -jar trading-app.jar

  // Step 4: Application-level optimizations
  public class OrderProcessor {
      // Pre-allocate buffers to reduce allocation rate
      private final ThreadLocal<ByteBuffer> bufferPool =
          ThreadLocal.withInitial(() -> ByteBuffer.allocateDirect(4096));

      // Use primitive collections to avoid autoboxing
      // (Eclipse Collections, HPPC, or Koloboke)
      // IntObjectHashMap<Order> instead of HashMap<Integer, Order>

      // Object pooling for hot-path objects
      private final ObjectPool<Order> orderPool = new ObjectPool<>(Order::new, 1000);
  }
  ```

  Collector comparison for low-latency: ZGC provides sub-1ms pauses regardless of heap size (best choice for Java 17+). Shenandoah is an alternative with similar characteristics, available in OpenJDK. G1 with `-XX:MaxGCPauseMillis=10` can achieve 10-20ms but cannot guarantee this with large heaps. Beyond collector choice, reducing allocation rate through object pooling and primitive collections has the greatest impact.
section: "java"
order: 28
tags:
  - gc
  - performance
  - jvm
type: "practical"
---
