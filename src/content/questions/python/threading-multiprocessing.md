---
ua_question: "Коли використовувати threading vs multiprocessing vs asyncio?"
en_question: "When to use threading vs multiprocessing vs asyncio?"
ua_answer: |
  Вибір між threading, multiprocessing та asyncio визначається типом задачі: I/O-bound чи CPU-bound, а також вимогами до ізоляції та накладних витрат.

  **Threading:** кілька потоків в одному процесі з спільною пам'яттю. Через GIL Python-потоки не виконуються паралельно для CPU-bound коду, але при I/O (network, disk) GIL звільняється. Використовуйте для: concurrent I/O без asyncio, інтеграції з блокуючими бібліотеками.

  **Multiprocessing:** окремі процеси з окремою пам'яттю — обходить GIL. Накладні витрати: fork/spawn процесу, серіалізація даних між процесами. Використовуйте для: CPU-bound задач (обчислення, обробка зображень, ML).

  **asyncio:** кооперативна багатозадачність в одному потоці. Найменші накладні витрати, але вимагає async-aware бібліотек. Використовуйте для: high-concurrency I/O (сотні/тисячі з'єднань).

  ```python
  import threading
  import multiprocessing
  import asyncio
  import requests
  from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

  # THREADING -- I/O bound задачі
  def fetch_url(url):
      response = requests.get(url)
      return response.status_code

  urls = ["https://httpbin.org/get"] * 10

  # Послідовно (~10 секунд)
  # results = [fetch_url(url) for url in urls]

  # З ThreadPoolExecutor (~1 секунда)
  with ThreadPoolExecutor(max_workers=10) as executor:
      results = list(executor.map(fetch_url, urls))

  # Thread-safe черга і Lock
  import queue
  task_queue = queue.Queue()

  lock = threading.Lock()
  shared_counter = 0

  def increment():
      global shared_counter
      with lock:
          shared_counter += 1

  # MULTIPROCESSING -- CPU bound задачі
  def cpu_heavy(n):
      """Факторіал для великого числа."""
      result = 1
      for i in range(1, n + 1):
          result *= i
      return result

  numbers = [100000, 200000, 300000, 400000]

  # З ProcessPoolExecutor (паралельно на всіх CPU)
  with ProcessPoolExecutor() as executor:
      results = list(executor.map(cpu_heavy, numbers))

  # multiprocessing.Pool
  with multiprocessing.Pool(processes=4) as pool:
      results = pool.map(cpu_heavy, numbers)

  # Спільна пам'ять між процесами
  shared_value = multiprocessing.Value("i", 0)  # int
  shared_array = multiprocessing.Array("d", [1.0, 2.0, 3.0])  # double

  with shared_value.get_lock():
      shared_value.value += 1

  # ASYNCIO -- high-concurrency I/O
  import aiohttp

  async def fetch_async(session, url):
      async with session.get(url) as response:
          return response.status

  async def main():
      async with aiohttp.ClientSession() as session:
          tasks = [fetch_async(session, url) for url in urls]
          results = await asyncio.gather(*tasks)
      return results

  asyncio.run(main())

  # Змішування: запуск blocking коду в asyncio
  async def run_in_thread(blocking_function, arg):
      loop = asyncio.get_event_loop()
      # executor=None -- використовує ThreadPoolExecutor за замовчуванням
      result = await loop.run_in_executor(None, blocking_function, arg)
      return result

  # Правило вибору:
  # - Багато I/O з'єднань (>100)  -> asyncio
  # - Блокуючі бібліотеки + I/O  -> threading / ThreadPoolExecutor
  # - CPU-bound обчислення        -> multiprocessing / ProcessPoolExecutor
  # - Простота важливіша          -> concurrent.futures
  ```

  Підсумок: threading — спільна пам'ять, GIL обмежує CPU, малі накладні витрати. Multiprocessing — ізольована пам'ять, справжній паралелізм, великі накладні витрати (fork + міжпроцесна серіалізація). asyncio — один потік, найменші накладні, вимагає async-екосистему. `concurrent.futures` — уніфікований API поверх обох.
en_answer: |
  The choice between threading, multiprocessing, and asyncio is determined by task type: I/O-bound or CPU-bound, plus isolation and overhead requirements.

  **Threading:** multiple threads in one process with shared memory. Due to the GIL, Python threads don't execute Python bytecode in parallel for CPU-bound code, but the GIL is released during I/O (network, disk). Use for: concurrent I/O without asyncio, integration with blocking libraries.

  **Multiprocessing:** separate processes with separate memory — bypasses the GIL. Overhead: process fork/spawn, cross-process data serialization. Use for: CPU-bound tasks (computation, image processing, ML).

  **asyncio:** cooperative multitasking in a single thread. Lowest overhead, but requires async-aware libraries. Use for: high-concurrency I/O (hundreds/thousands of connections).

  ```python
  import threading
  import multiprocessing
  import asyncio
  import requests
  from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

  # THREADING -- I/O bound tasks
  def fetch_url(url):
      response = requests.get(url)
      return response.status_code

  urls = ["https://httpbin.org/get"] * 10

  # Sequential (~10 seconds)
  # results = [fetch_url(url) for url in urls]

  # With ThreadPoolExecutor (~1 second)
  with ThreadPoolExecutor(max_workers=10) as executor:
      results = list(executor.map(fetch_url, urls))

  # Thread-safe queue and Lock
  import queue
  task_queue = queue.Queue()

  lock = threading.Lock()
  shared_counter = 0

  def increment():
      global shared_counter
      with lock:
          shared_counter += 1

  # MULTIPROCESSING -- CPU bound tasks
  def cpu_heavy(n):
      """Factorial for a large number."""
      result = 1
      for i in range(1, n + 1):
          result *= i
      return result

  numbers = [100000, 200000, 300000, 400000]

  # With ProcessPoolExecutor (parallel across all CPUs)
  with ProcessPoolExecutor() as executor:
      results = list(executor.map(cpu_heavy, numbers))

  # multiprocessing.Pool
  with multiprocessing.Pool(processes=4) as pool:
      results = pool.map(cpu_heavy, numbers)

  # Shared memory between processes
  shared_value = multiprocessing.Value("i", 0)  # int
  shared_array = multiprocessing.Array("d", [1.0, 2.0, 3.0])  # double

  with shared_value.get_lock():
      shared_value.value += 1

  # ASYNCIO -- high-concurrency I/O
  import aiohttp

  async def fetch_async(session, url):
      async with session.get(url) as response:
          return response.status

  async def main():
      async with aiohttp.ClientSession() as session:
          tasks = [fetch_async(session, url) for url in urls]
          results = await asyncio.gather(*tasks)
      return results

  asyncio.run(main())

  # Mixing: run blocking code in asyncio
  async def run_in_thread(blocking_function, arg):
      loop = asyncio.get_event_loop()
      # executor=None -- uses ThreadPoolExecutor by default
      result = await loop.run_in_executor(None, blocking_function, arg)
      return result

  # Decision rule:
  # - Many I/O connections (>100)   -> asyncio
  # - Blocking libs + I/O           -> threading / ThreadPoolExecutor
  # - CPU-bound computation         -> multiprocessing / ProcessPoolExecutor
  # - Simplicity matters            -> concurrent.futures
  ```

  Summary: threading — shared memory, GIL limits CPU, low overhead. Multiprocessing — isolated memory, true parallelism, high overhead (fork + cross-process serialization). asyncio — single thread, lowest overhead, requires async ecosystem. `concurrent.futures` — unified API over both.
section: "python"
order: 52
tags:
  - core-language
  - async
  - performance
type: "basic"
---
