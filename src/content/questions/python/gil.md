---
ua_question: "Що таке GIL і як він впливає на конкурентність?"
en_question: "What is the GIL and how does it affect concurrency?"
ua_answer: |
  **GIL (Global Interpreter Lock)** -- це м'ютекс в CPython, який дозволяє лише одному потоку виконувати Python байт-код одночасно. Це спрощує управління пам'яттю (reference counting), але обмежує паралелізм CPU-bound задач у багатопотоковому коді.

  GIL **не впливає** на I/O-bound задачі: коли потік чекає на мережу або диск, GIL звільняється, і інший потік може працювати. Тому `threading` ефективний для I/O-bound програм (веб-скрапінг, API-клієнти).

  Для CPU-bound задач використовуйте `multiprocessing` (окремі процеси, кожен зі своїм GIL) або C-розширення, які звільняють GIL (NumPy, pandas).

  ```python
  import threading
  import multiprocessing
  import time

  def cpu_bound(n):
      """CPU-intensive task."""
      total = 0
      for i in range(n):
          total += i * i
      return total

  # Threading -- GIL limits CPU parallelism
  def test_threads():
      start = time.perf_counter()
      threads = [threading.Thread(target=cpu_bound, args=(10_000_000,))
                 for _ in range(4)]
      for t in threads:
          t.start()
      for t in threads:
          t.join()
      print(f"Threads: {time.perf_counter() - start:.2f}s")

  # Multiprocessing -- bypasses GIL
  def test_processes():
      start = time.perf_counter()
      processes = [multiprocessing.Process(target=cpu_bound, args=(10_000_000,))
                   for _ in range(4)]
      for p in processes:
          p.start()
      for p in processes:
          p.join()
      print(f"Processes: {time.perf_counter() - start:.2f}s")

  # I/O-bound -- threading works great
  import urllib.request

  def fetch_url(url):
      urllib.request.urlopen(url).read()

  def test_io_threads():
      urls = ["https://example.com"] * 10
      start = time.perf_counter()
      threads = [threading.Thread(target=fetch_url, args=(u,)) for u in urls]
      for t in threads:
          t.start()
      for t in threads:
          t.join()
      print(f"IO Threads: {time.perf_counter() - start:.2f}s")
  ```

  Важливо знати: GIL -- це деталь реалізації CPython, а не мови Python. Jython та IronPython не мають GIL. В CPython 3.13+ працюють над експериментальним режимом free-threaded Python (PEP 703), який дозволяє вимкнути GIL.
en_answer: |
  **GIL (Global Interpreter Lock)** is a mutex in CPython that allows only one thread to execute Python bytecode at a time. This simplifies memory management (reference counting) but limits parallelism of CPU-bound tasks in multithreaded code.

  GIL **does not affect** I/O-bound tasks: when a thread waits for network or disk, the GIL is released, and another thread can work. This is why `threading` is effective for I/O-bound programs (web scraping, API clients).

  For CPU-bound tasks use `multiprocessing` (separate processes, each with its own GIL) or C extensions that release the GIL (NumPy, pandas).

  ```python
  import threading
  import multiprocessing
  import time

  def cpu_bound(n):
      """CPU-intensive task."""
      total = 0
      for i in range(n):
          total += i * i
      return total

  # Threading -- GIL limits CPU parallelism
  def test_threads():
      start = time.perf_counter()
      threads = [threading.Thread(target=cpu_bound, args=(10_000_000,))
                 for _ in range(4)]
      for t in threads:
          t.start()
      for t in threads:
          t.join()
      print(f"Threads: {time.perf_counter() - start:.2f}s")

  # Multiprocessing -- bypasses GIL
  def test_processes():
      start = time.perf_counter()
      processes = [multiprocessing.Process(target=cpu_bound, args=(10_000_000,))
                   for _ in range(4)]
      for p in processes:
          p.start()
      for p in processes:
          p.join()
      print(f"Processes: {time.perf_counter() - start:.2f}s")

  # I/O-bound -- threading works great
  import urllib.request

  def fetch_url(url):
      urllib.request.urlopen(url).read()

  def test_io_threads():
      urls = ["https://example.com"] * 10
      start = time.perf_counter()
      threads = [threading.Thread(target=fetch_url, args=(u,)) for u in urls]
      for t in threads:
          t.start()
      for t in threads:
          t.join()
      print(f"IO Threads: {time.perf_counter() - start:.2f}s")
  ```

  Important to know: GIL is an implementation detail of CPython, not the Python language. Jython and IronPython do not have a GIL. In CPython 3.13+ there is work on an experimental free-threaded Python mode (PEP 703) that allows disabling the GIL.
section: "python"
order: 13
tags:
  - core-language
  - concurrency
type: "basic"
---
