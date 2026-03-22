---
ua_question: "Як працює JIT-компіляція в JVM?"
en_question: "How does JIT compilation work in JVM?"
ua_answer: |
  JIT (Just-In-Time) компілятор перетворює "гарячий" байт-код у нативний машинний код під час виконання програми, що значно підвищує продуктивність порівняно з чистою інтерпретацією. JVM спочатку інтерпретує байт-код, а потім компілює методи, які викликаються найчастіше.

  **Дворівнева компіляція (Tiered Compilation):**
  - **C1 (Client Compiler)** -- швидка компіляція з базовими оптимізаціями. Застосовується після ~1500 викликів методу. Збирає профілювальні дані для C2.
  - **C2 (Server Compiler)** -- агресивні оптимізації на основі профілювальних даних. Застосовується після ~10000 викликів. Виконує inlining, escape analysis, loop unrolling, dead code elimination.

  **Ключові оптимізації:**
  - **Method Inlining** -- тіло методу вставляється замість виклику, усуваючи overhead виклику
  - **Escape Analysis** -- якщо об'єкт не "втікає" з методу, JVM може розмістити його на стеку замість heap або навіть повністю усунути алокацію (scalar replacement)
  - **On-Stack Replacement (OSR)** -- заміна інтерпретованого коду скомпільованим прямо під час виконання довгого циклу

  ```java
  // JVM flags for inspecting JIT compilation
  // -XX:+PrintCompilation        -- log compiled methods
  // -XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining  -- log inlining decisions
  // -XX:+PrintAssembly           -- print generated machine code (needs hsdis)

  // Example: escape analysis optimization
  public int sumPoints() {
      int total = 0;
      for (int i = 0; i < 1_000_000; i++) {
          // JIT detects Point doesn't escape this method
          // Allocates on stack or eliminates allocation entirely
          Point p = new Point(i, i * 2);
          total += p.x + p.y;
      }
      return total;
  }

  // Check compilation tier at runtime
  // java -XX:+PrintCompilation MyApp
  // Output: 142   3       3       MyApp::sumPoints (42 bytes)
  //         ^     ^       ^tier
  //         id    level
  ```

  Розуміння JIT критичне для performance-інженерів: мікробенчмарки без прогріву JVM дають некоректні результати (завжди використовуйте JMH). Деоптимізація може раптово знизити продуктивність, якщо JIT-припущення порушуються (наприклад, новий підклас порушує мономорфний інлайнінг).
en_answer: |
  JIT (Just-In-Time) compiler transforms "hot" bytecode into native machine code during program execution, significantly improving performance compared to pure interpretation. JVM initially interprets bytecode, then compiles the most frequently called methods.

  **Tiered Compilation:**
  - **C1 (Client Compiler)** -- fast compilation with basic optimizations. Applied after ~1500 method invocations. Collects profiling data for C2.
  - **C2 (Server Compiler)** -- aggressive optimizations based on profiling data. Applied after ~10000 invocations. Performs inlining, escape analysis, loop unrolling, dead code elimination.

  **Key optimizations:**
  - **Method Inlining** -- method body is inserted at the call site, eliminating call overhead
  - **Escape Analysis** -- if an object does not "escape" the method, JVM can allocate it on the stack instead of heap or even eliminate the allocation entirely (scalar replacement)
  - **On-Stack Replacement (OSR)** -- replacing interpreted code with compiled code during execution of a long-running loop

  ```java
  // JVM flags for inspecting JIT compilation
  // -XX:+PrintCompilation        -- log compiled methods
  // -XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining  -- log inlining decisions
  // -XX:+PrintAssembly           -- print generated machine code (needs hsdis)

  // Example: escape analysis optimization
  public int sumPoints() {
      int total = 0;
      for (int i = 0; i < 1_000_000; i++) {
          // JIT detects Point doesn't escape this method
          // Allocates on stack or eliminates allocation entirely
          Point p = new Point(i, i * 2);
          total += p.x + p.y;
      }
      return total;
  }

  // Check compilation tier at runtime
  // java -XX:+PrintCompilation MyApp
  // Output: 142   3       3       MyApp::sumPoints (42 bytes)
  //         ^     ^       ^tier
  //         id    level
  ```

  Understanding JIT is critical for performance engineers: microbenchmarks without JVM warmup produce incorrect results (always use JMH). Deoptimization can suddenly degrade performance if JIT assumptions are violated (e.g., a new subclass breaks monomorphic inlining).
section: "java"
order: 19
tags:
  - jvm
  - performance
  - compilation
type: "deep"
---
