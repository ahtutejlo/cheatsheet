---
ua_question: "Як побудувати плагінну систему з можливістю завантаження/вивантаження модулів без перезапуску?"
en_question: "How would you build a plugin system with runtime loading/unloading without restart?"
ua_answer: |
  **Scenario:** Потрібно створити архітектуру плагінів для Java-додатку, де плагіни можуть бути завантажені, оновлені та вивантажені під час роботи без перезапуску основного додатку. Кожен плагін -- окремий JAR-файл з реалізацією спільного інтерфейсу.

  **Approach:**
  1. Визначити контракт плагіна через інтерфейс у core-модулі, який не змінюється
  2. Створити окремий ClassLoader для кожного плагіна для ізоляції та можливості вивантаження
  3. Реалізувати PluginManager, який керує життєвим циклом плагінів та слідкує за файловою системою

  **Solution:**
  ```java
  // Step 1: Plugin contract (in core module, never changes)
  public interface Plugin {
      String getName();
      void onLoad(PluginContext context);
      void onUnload();
      Object execute(String command, Map<String, Object> params);
  }

  // Step 2: Custom ClassLoader per plugin
  public class PluginClassLoader extends URLClassLoader {
      public PluginClassLoader(URL jarUrl, ClassLoader parent) {
          super(new URL[]{jarUrl}, parent);
      }

      // Override to load plugin classes FIRST (child-first delegation)
      // This isolates plugin dependencies from the main app
      @Override
      protected Class<?> loadClass(String name, boolean resolve)
              throws ClassNotFoundException {
          // Always delegate core interfaces to parent
          if (name.startsWith("com.myapp.api.")) {
              return super.loadClass(name, resolve);
          }
          // Try to load from plugin JAR first
          Class<?> c = findLoadedClass(name);
          if (c == null) {
              try { c = findClass(name); }
              catch (ClassNotFoundException e) { c = super.loadClass(name, resolve); }
          }
          if (resolve) resolveClass(c);
          return c;
      }
  }

  // Step 3: Plugin Manager
  public class PluginManager {
      private final Map<String, PluginEntry> plugins = new ConcurrentHashMap<>();

      record PluginEntry(Plugin plugin, PluginClassLoader loader) {}

      public void loadPlugin(Path jarPath) throws Exception {
          URL jarUrl = jarPath.toUri().toURL();
          PluginClassLoader loader = new PluginClassLoader(jarUrl, getClass().getClassLoader());

          ServiceLoader<Plugin> sl = ServiceLoader.load(Plugin.class, loader);
          Plugin plugin = sl.findFirst()
              .orElseThrow(() -> new IllegalArgumentException("No Plugin in " + jarPath));

          plugin.onLoad(new PluginContext());
          plugins.put(plugin.getName(), new PluginEntry(plugin, loader));
      }

      public void unloadPlugin(String name) throws Exception {
          PluginEntry entry = plugins.remove(name);
          if (entry != null) {
              entry.plugin().onUnload();
              entry.loader().close(); // releases JAR file handle
              // ClassLoader and its classes become eligible for GC
          }
      }
  }
  ```

  Ключові нюанси: ClassLoader та всі його класи збираються GC лише коли немає жодного посилання на них. Витоки ClassLoader -- поширена проблема: статичні поля, ThreadLocal, JDBC-драйвери, та логгери можуть утримувати посилання. Для промислових рішень розгляньте OSGi або Java Module System (JPMS) як альтернативи кастомним ClassLoader.
en_answer: |
  **Scenario:** You need to create a plugin architecture for a Java application where plugins can be loaded, updated, and unloaded at runtime without restarting the main application. Each plugin is a separate JAR file implementing a shared interface.

  **Approach:**
  1. Define the plugin contract through an interface in the core module that never changes
  2. Create a separate ClassLoader for each plugin for isolation and unloading capability
  3. Implement a PluginManager that manages plugin lifecycle and watches the filesystem

  **Solution:**
  ```java
  // Step 1: Plugin contract (in core module, never changes)
  public interface Plugin {
      String getName();
      void onLoad(PluginContext context);
      void onUnload();
      Object execute(String command, Map<String, Object> params);
  }

  // Step 2: Custom ClassLoader per plugin
  public class PluginClassLoader extends URLClassLoader {
      public PluginClassLoader(URL jarUrl, ClassLoader parent) {
          super(new URL[]{jarUrl}, parent);
      }

      // Override to load plugin classes FIRST (child-first delegation)
      // This isolates plugin dependencies from the main app
      @Override
      protected Class<?> loadClass(String name, boolean resolve)
              throws ClassNotFoundException {
          // Always delegate core interfaces to parent
          if (name.startsWith("com.myapp.api.")) {
              return super.loadClass(name, resolve);
          }
          // Try to load from plugin JAR first
          Class<?> c = findLoadedClass(name);
          if (c == null) {
              try { c = findClass(name); }
              catch (ClassNotFoundException e) { c = super.loadClass(name, resolve); }
          }
          if (resolve) resolveClass(c);
          return c;
      }
  }

  // Step 3: Plugin Manager
  public class PluginManager {
      private final Map<String, PluginEntry> plugins = new ConcurrentHashMap<>();

      record PluginEntry(Plugin plugin, PluginClassLoader loader) {}

      public void loadPlugin(Path jarPath) throws Exception {
          URL jarUrl = jarPath.toUri().toURL();
          PluginClassLoader loader = new PluginClassLoader(jarUrl, getClass().getClassLoader());

          ServiceLoader<Plugin> sl = ServiceLoader.load(Plugin.class, loader);
          Plugin plugin = sl.findFirst()
              .orElseThrow(() -> new IllegalArgumentException("No Plugin in " + jarPath));

          plugin.onLoad(new PluginContext());
          plugins.put(plugin.getName(), new PluginEntry(plugin, loader));
      }

      public void unloadPlugin(String name) throws Exception {
          PluginEntry entry = plugins.remove(name);
          if (entry != null) {
              entry.plugin().onUnload();
              entry.loader().close(); // releases JAR file handle
              // ClassLoader and its classes become eligible for GC
          }
      }
  }
  ```

  Key nuances: a ClassLoader and all its classes are GC-eligible only when there are no references to them. ClassLoader leaks are a common problem: static fields, ThreadLocal, JDBC drivers, and loggers can hold references. For industrial solutions, consider OSGi or Java Module System (JPMS) as alternatives to custom ClassLoaders.
section: "java"
order: 29
tags:
  - classloading
  - architecture
  - design
type: "practical"
---
