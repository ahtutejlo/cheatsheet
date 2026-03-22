---
ua_question: "Як працює GIL зсередини та які є способи його обійти?"
en_question: "How does the GIL work internally and what are the workarounds?"
ua_answer: |
  GIL в CPython -- це глобальний м'ютекс, який захищає доступ до reference counting. Потік, що виконує байт-код, тримає GIL і звільняє його кожні N інструкцій (в Python 3.2+ -- кожні 5ms, керується `sys.getswitchinterval()`). При I/O операціях GIL звільняється автоматично.

  **Внутрішній механізм:** коли потік хоче GIL, він встановлює прапорець `eval_breaker` і чекає. Потік, що тримає GIL, перевіряє цей прапорець і звільняє GIL. В Python 3.2+ додано механізм таймауту замість старого підрахунку інструкцій, що значно покращило продуктивність.

  **Способи обходу GIL:** multiprocessing (окремі процеси), asyncio (кооперативна багатозадачність для I/O), C-розширення з `Py_BEGIN_ALLOW_THREADS`, concurrent.futures для зручного API.

  ```python
  import asyncio
  import aiohttp
  from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor
  import multiprocessing as mp

  # asyncio -- cooperative multitasking for I/O
  async def fetch_all(urls: list[str]) -> list[str]:
      async with aiohttp.ClientSession() as session:
          tasks = [fetch_one(session, url) for url in urls]
          return await asyncio.gather(*tasks)

  async def fetch_one(session, url):
      async with session.get(url) as resp:
          return await resp.text()

  # ProcessPoolExecutor -- CPU-bound parallelism
  def cpu_heavy(n):
      return sum(i * i for i in range(n))

  def parallel_cpu():
      with ProcessPoolExecutor(max_workers=4) as pool:
          futures = [pool.submit(cpu_heavy, 10_000_000) for _ in range(4)]
          results = [f.result() for f in futures]
      return results

  # ThreadPoolExecutor -- I/O-bound parallelism
  def parallel_io(urls):
      with ThreadPoolExecutor(max_workers=10) as pool:
          results = list(pool.map(fetch_sync, urls))
      return results

  # Mixed: run CPU tasks in process pool from async code
  async def async_with_cpu():
      loop = asyncio.get_event_loop()
      with ProcessPoolExecutor() as pool:
          result = await loop.run_in_executor(pool, cpu_heavy, 10_000_000)
      return result

  # Shared memory between processes (Python 3.8+)
  from multiprocessing import shared_memory

  def worker(shm_name, size):
      shm = shared_memory.SharedMemory(name=shm_name)
      # work with shm.buf[:]
      shm.close()
  ```

  В CPython 3.13 з'явився експериментальний free-threaded режим (PEP 703), де GIL можна вимкнути прапорцем `--disable-gil`. Це потребує перекомпіляції інтерпретатора та сумісних C-розширень, але відкриває шлях до справжнього паралелізму в Python.
en_answer: |
  The GIL in CPython is a global mutex that protects access to reference counting. A thread executing bytecode holds the GIL and releases it every N instructions (in Python 3.2+ -- every 5ms, controlled by `sys.getswitchinterval()`). During I/O operations the GIL is released automatically.

  **Internal mechanism:** when a thread wants the GIL, it sets the `eval_breaker` flag and waits. The thread holding the GIL checks this flag and releases it. In Python 3.2+ a timeout mechanism replaced the old instruction counting, which significantly improved performance.

  **GIL workarounds:** multiprocessing (separate processes), asyncio (cooperative multitasking for I/O), C extensions with `Py_BEGIN_ALLOW_THREADS`, concurrent.futures for a convenient API.

  ```python
  import asyncio
  import aiohttp
  from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor
  import multiprocessing as mp

  # asyncio -- cooperative multitasking for I/O
  async def fetch_all(urls: list[str]) -> list[str]:
      async with aiohttp.ClientSession() as session:
          tasks = [fetch_one(session, url) for url in urls]
          return await asyncio.gather(*tasks)

  async def fetch_one(session, url):
      async with session.get(url) as resp:
          return await resp.text()

  # ProcessPoolExecutor -- CPU-bound parallelism
  def cpu_heavy(n):
      return sum(i * i for i in range(n))

  def parallel_cpu():
      with ProcessPoolExecutor(max_workers=4) as pool:
          futures = [pool.submit(cpu_heavy, 10_000_000) for _ in range(4)]
          results = [f.result() for f in futures]
      return results

  # ThreadPoolExecutor -- I/O-bound parallelism
  def parallel_io(urls):
      with ThreadPoolExecutor(max_workers=10) as pool:
          results = list(pool.map(fetch_sync, urls))
      return results

  # Mixed: run CPU tasks in process pool from async code
  async def async_with_cpu():
      loop = asyncio.get_event_loop()
      with ProcessPoolExecutor() as pool:
          result = await loop.run_in_executor(pool, cpu_heavy, 10_000_000)
      return result

  # Shared memory between processes (Python 3.8+)
  from multiprocessing import shared_memory

  def worker(shm_name, size):
      shm = shared_memory.SharedMemory(name=shm_name)
      # work with shm.buf[:]
      shm.close()
  ```

  In CPython 3.13 an experimental free-threaded mode appeared (PEP 703) where the GIL can be disabled with the `--disable-gil` flag. This requires recompiling the interpreter and compatible C extensions, but opens the path to true parallelism in Python.
section: "python"
order: 16
tags:
  - concurrency
  - internals
type: "deep"
---
