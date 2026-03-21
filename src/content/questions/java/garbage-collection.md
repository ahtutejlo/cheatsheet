---
ua_question: "Як працює збирання сміття в Java?"
en_question: "How does garbage collection work in Java?"
ua_answer: |
  Garbage Collection (GC) -- це автоматичний процес управління пам'яттю в Java. GC виявляє та видаляє об'єкти, на які більше немає посилань, звільняючи пам'ять для нових об'єктів.

  **Структура пам'яті JVM (Heap):**
  - **Young Generation** -- нові об'єкти (Eden + Survivor S0/S1)
  - **Old Generation (Tenured)** -- довгоживучі об'єкти
  - **Metaspace** (з Java 8) -- метадані класів

  **Як працює GC:**
  1. Новий об'єкт створюється в **Eden** (Young Gen)
  2. Коли Eden заповнений -- **Minor GC** переносить живі об'єкти в Survivor
  3. Об'єкти, що пережили кілька Minor GC, переносяться в **Old Gen**
  4. Коли Old Gen заповнений -- **Major GC (Full GC)** очищує всю пам'ять

  **Типи Garbage Collectors:**
  - **Serial GC** -- однопоточний, для маленьких додатків
  - **Parallel GC** -- багатопоточний, для серверних додатків
  - **G1 GC** -- збалансований, за замовчуванням з Java 9
  - **ZGC / Shenandoah** -- мінімальні паузи, для великих heap

  **Об'єкт доступний для GC коли:**
  - Посилання встановлено в `null`
  - Об'єкт вийшов з області видимості (scope)
  - Немає жодного шляху від GC roots до об'єкта

  Метод `System.gc()` лише **пропонує** JVM запустити GC, але не гарантує це.
en_answer: |
  Garbage Collection (GC) is an automatic memory management process in Java. GC detects and removes objects that no longer have references, freeing memory for new objects.

  **JVM Memory Structure (Heap):**
  - **Young Generation** -- new objects (Eden + Survivor S0/S1)
  - **Old Generation (Tenured)** -- long-lived objects
  - **Metaspace** (since Java 8) -- class metadata

  **How GC works:**
  1. New object is created in **Eden** (Young Gen)
  2. When Eden is full -- **Minor GC** moves live objects to Survivor
  3. Objects that survive several Minor GCs are moved to **Old Gen**
  4. When Old Gen is full -- **Major GC (Full GC)** cleans all memory

  **Types of Garbage Collectors:**
  - **Serial GC** -- single-threaded, for small applications
  - **Parallel GC** -- multi-threaded, for server applications
  - **G1 GC** -- balanced, default since Java 9
  - **ZGC / Shenandoah** -- minimal pauses, for large heaps

  **An object is eligible for GC when:**
  - Reference is set to `null`
  - Object goes out of scope
  - There is no path from GC roots to the object

  The `System.gc()` method only **suggests** JVM to run GC, but does not guarantee it.
section: "java"
order: 11
tags:
  - memory
  - garbage-collection
  - jvm
---
