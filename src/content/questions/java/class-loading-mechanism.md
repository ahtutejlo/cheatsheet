---
ua_question: "Як працює механізм завантаження класів у JVM?"
en_question: "How does the class loading mechanism work in JVM?"
ua_answer: |
  Завантаження класів (Class Loading) у JVM -- це процес знаходження, читання та підготовки класів для використання. JVM використовує трирівневу ієрархію завантажувачів з принципом делегування батьківському класу (Parent Delegation Model).

  **Три рівні завантажувачів:**
  - **Bootstrap ClassLoader** -- завантажує ядро Java (java.lang, java.util тощо) з rt.jar. Написаний на C/C++, не має Java-представлення (getClassLoader() повертає null).
  - **Extension (Platform) ClassLoader** -- завантажує розширення з $JAVA_HOME/lib/ext (Java 8) або модулі платформи (Java 9+).
  - **Application ClassLoader** -- завантажує класи з classpath додатку. Це класи вашого коду та бібліотек.

  **Parent Delegation Model:** коли клас запитується, завантажувач спочатку делегує запит батьківському. Лише якщо батьківський не може знайти клас, дочірній намагається завантажити сам. Це запобігає підміні системних класів.

  ```java
  // Check which classloader loaded a class
  System.out.println(String.class.getClassLoader());
  // null (Bootstrap)

  System.out.println(MyApp.class.getClassLoader());
  // jdk.internal.loader.ClassLoaders$AppClassLoader

  // Custom ClassLoader example
  class PluginClassLoader extends ClassLoader {
      @Override
      protected Class<?> findClass(String name) throws ClassNotFoundException {
          byte[] bytes = loadClassBytes(name); // read .class file
          return defineClass(name, bytes, 0, bytes.length);
      }

      private byte[] loadClassBytes(String name) {
          // Load from plugin JAR, network, or encrypted source
          return Files.readAllBytes(Path.of(name.replace('.', '/') + ".class"));
      }
  }
  ```

  Кастомні ClassLoader потрібні для: плагінних систем (завантаження/вивантаження модулів без перезапуску), application серверів (ізоляція веб-додатків), hot-reload у dev-режимі, та завантаження зашифрованих класів. Розуміння class loading допомагає діагностувати ClassNotFoundException, NoClassDefFoundError та конфлікти версій бібліотек.
en_answer: |
  Class Loading in JVM is the process of finding, reading, and preparing classes for use. JVM uses a three-tier classloader hierarchy with the Parent Delegation Model.

  **Three classloader tiers:**
  - **Bootstrap ClassLoader** -- loads Java core (java.lang, java.util, etc.) from rt.jar. Written in C/C++, has no Java representation (getClassLoader() returns null).
  - **Extension (Platform) ClassLoader** -- loads extensions from $JAVA_HOME/lib/ext (Java 8) or platform modules (Java 9+).
  - **Application ClassLoader** -- loads classes from the application classpath. These are your code and library classes.

  **Parent Delegation Model:** when a class is requested, the classloader first delegates to its parent. Only if the parent cannot find the class does the child attempt to load it itself. This prevents substitution of system classes.

  ```java
  // Check which classloader loaded a class
  System.out.println(String.class.getClassLoader());
  // null (Bootstrap)

  System.out.println(MyApp.class.getClassLoader());
  // jdk.internal.loader.ClassLoaders$AppClassLoader

  // Custom ClassLoader example
  class PluginClassLoader extends ClassLoader {
      @Override
      protected Class<?> findClass(String name) throws ClassNotFoundException {
          byte[] bytes = loadClassBytes(name); // read .class file
          return defineClass(name, bytes, 0, bytes.length);
      }

      private byte[] loadClassBytes(String name) {
          // Load from plugin JAR, network, or encrypted source
          return Files.readAllBytes(Path.of(name.replace('.', '/') + ".class"));
      }
  }
  ```

  Custom ClassLoaders are needed for: plugin systems (loading/unloading modules without restart), application servers (web app isolation), hot-reload in dev mode, and loading encrypted classes. Understanding class loading helps diagnose ClassNotFoundException, NoClassDefFoundError, and library version conflicts.
section: "java"
order: 18
tags:
  - jvm
  - classloading
  - architecture
type: "deep"
---
