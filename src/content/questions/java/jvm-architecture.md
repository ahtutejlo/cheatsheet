---
ua_question: "Як влаштована архітектура JVM?"
en_question: "What is the JVM architecture?"
ua_answer: |
  JVM (Java Virtual Machine) -- це віртуальна машина, яка виконує Java байт-код. Вона забезпечує платформонезалежність Java ("Write Once, Run Anywhere").

  **Основні компоненти JVM:**

  **1. ClassLoader (завантажувач класів)**
  - **Bootstrap ClassLoader** -- завантажує ядро Java (rt.jar)
  - **Extension ClassLoader** -- завантажує розширення
  - **Application ClassLoader** -- завантажує класи додатку
  - Принцип делегування: дочірній запитує батьківський перед завантаженням

  **2. Runtime Data Areas (області пам'яті)**
  - **Heap** -- об'єкти та масиви (спільний для всіх потоків)
  - **Stack** -- локальні змінні, виклики методів (окремий для кожного потоку)
  - **Method Area / Metaspace** -- метадані класів, статичні змінні
  - **PC Register** -- адреса поточної інструкції
  - **Native Method Stack** -- для нативних методів (C/C++)

  **3. Execution Engine (виконавчий механізм)**
  - **Interpreter** -- інтерпретує байт-код рядок за рядком
  - **JIT Compiler** -- компілює "гарячий" код в нативний для швидкості
  - **Garbage Collector** -- автоматичне управління пам'яттю

  **Процес виконання:**
  `.java` -> `javac` -> `.class` (байт-код) -> ClassLoader -> JVM -> виконання
en_answer: |
  JVM (Java Virtual Machine) is a virtual machine that executes Java bytecode. It ensures Java's platform independence ("Write Once, Run Anywhere").

  **Main JVM components:**

  **1. ClassLoader**
  - **Bootstrap ClassLoader** -- loads Java core (rt.jar)
  - **Extension ClassLoader** -- loads extensions
  - **Application ClassLoader** -- loads application classes
  - Delegation principle: child asks parent before loading

  **2. Runtime Data Areas**
  - **Heap** -- objects and arrays (shared across all threads)
  - **Stack** -- local variables, method calls (separate for each thread)
  - **Method Area / Metaspace** -- class metadata, static variables
  - **PC Register** -- address of current instruction
  - **Native Method Stack** -- for native methods (C/C++)

  **3. Execution Engine**
  - **Interpreter** -- interprets bytecode line by line
  - **JIT Compiler** -- compiles "hot" code to native for speed
  - **Garbage Collector** -- automatic memory management

  **Execution process:**
  `.java` -> `javac` -> `.class` (bytecode) -> ClassLoader -> JVM -> execution
section: "java"
order: 13
tags:
  - jvm
  - architecture
---
