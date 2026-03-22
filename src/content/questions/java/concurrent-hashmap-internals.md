---
ua_question: "Як влаштований ConcurrentHashMap зсередини?"
en_question: "How does ConcurrentHashMap work internally?"
ua_answer: |
  ConcurrentHashMap -- це потокобезпечна реалізація Map, яка дозволяє одночасне читання та запис без блокування всієї структури. Її внутрішня реалізація суттєво змінилась між Java 7 та Java 8+.

  **Java 7: сегментне блокування.** Map поділялась на 16 сегментів (Segment), кожен з яких мав свій ReentrantLock. Запис блокував лише один сегмент, тому до 16 потоків могли писати одночасно. Читання у більшості випадків не вимагало блокування завдяки volatile-полям.

  **Java 8+: node-level CAS.** Сегменти замінені на масив Node, де кожен бакет -- це або зв'язний список, або червоно-чорне дерево (при 8+ елементах). Запис використовує CAS (Compare-And-Swap) для першого вузла бакету та synchronized на вузлі для решти операцій. Читання повністю lock-free завдяки volatile next-посиланням.

  ```java
  ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

  // Atomic operations -- thread-safe without external sync
  map.put("key", 1);
  map.putIfAbsent("key", 2);       // won't overwrite
  map.computeIfAbsent("new", k -> expensiveComputation(k));
  map.merge("key", 1, Integer::sum); // atomic increment

  // Bulk operations (Java 8+) -- parallel with threshold
  long count = map.mappingCount();
  map.forEach(2, (k, v) -> System.out.println(k + "=" + v));
  int sum = map.reduceValues(2, Integer::sum);
  ```

  Важливо розуміти, що `size()` у ConcurrentHashMap -- це приблизне значення (eventual consistency), оскільки точний підрахунок вимагав би глобального блокування. Для точного розміру використовуйте `mappingCount()`, яка повертає long і також є приблизною, але без ризику overflow. На співбесідах часто запитують саме про різницю між Java 7 та Java 8+ реалізаціями.
en_answer: |
  ConcurrentHashMap is a thread-safe Map implementation that allows concurrent reads and writes without locking the entire structure. Its internal implementation changed significantly between Java 7 and Java 8+.

  **Java 7: segment locking.** The map was divided into 16 segments (Segment), each with its own ReentrantLock. Writing locked only one segment, so up to 16 threads could write simultaneously. Reading in most cases required no locking thanks to volatile fields.

  **Java 8+: node-level CAS.** Segments were replaced with a Node array, where each bucket is either a linked list or a red-black tree (at 8+ elements). Writing uses CAS (Compare-And-Swap) for the first node of a bucket and synchronized on the node for other operations. Reading is completely lock-free thanks to volatile next references.

  ```java
  ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

  // Atomic operations -- thread-safe without external sync
  map.put("key", 1);
  map.putIfAbsent("key", 2);       // won't overwrite
  map.computeIfAbsent("new", k -> expensiveComputation(k));
  map.merge("key", 1, Integer::sum); // atomic increment

  // Bulk operations (Java 8+) -- parallel with threshold
  long count = map.mappingCount();
  map.forEach(2, (k, v) -> System.out.println(k + "=" + v));
  int sum = map.reduceValues(2, Integer::sum);
  ```

  It is important to understand that `size()` in ConcurrentHashMap is an approximate value (eventual consistency), since an exact count would require global locking. For exact size use `mappingCount()`, which returns long and is also approximate but without overflow risk. In interviews, the difference between Java 7 and Java 8+ implementations is a frequent topic.
section: "java"
order: 17
tags:
  - concurrency
  - collections
  - internals
type: "deep"
---
