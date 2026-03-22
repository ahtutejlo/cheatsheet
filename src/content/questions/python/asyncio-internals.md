---
ua_question: "Як працює asyncio: event loop, coroutines, tasks, futures?"
en_question: "How does asyncio work: event loop, coroutines, tasks, futures?"
ua_answer: |
  **asyncio** реалізує кооперативну багатозадачність через event loop. Корутини (async/await) добровільно віддають управління event loop'у на кожному `await`, дозволяючи іншим корутинам виконуватися.

  **Coroutine** -- це функція, визначена через `async def`. Виклик повертає coroutine object, який не виконується до `await` або подачі в event loop. **Task** -- це обгортка над корутиною, зареєстрована в event loop для конкурентного виконання. **Future** -- це низькорівневий об'єкт, що представляє результат, який буде доступний у майбутньому.

  Event loop працює в одному потоці, використовуючи `select`/`epoll`/`kqueue` для мультиплексування I/O. Це означає нуль накладних витрат на перемикання контексту між корутинами.

  ```python
  import asyncio

  # Coroutine -- does not run until awaited
  async def fetch_data(url: str) -> str:
      print(f"Fetching {url}")
      await asyncio.sleep(1)  # simulates I/O
      return f"Data from {url}"

  # Task -- scheduled for concurrent execution
  async def main():
      # Sequential -- 3 seconds total
      r1 = await fetch_data("url1")
      r2 = await fetch_data("url2")
      r3 = await fetch_data("url3")

      # Concurrent -- 1 second total
      tasks = [
          asyncio.create_task(fetch_data("url1")),
          asyncio.create_task(fetch_data("url2")),
          asyncio.create_task(fetch_data("url3")),
      ]
      results = await asyncio.gather(*tasks)

  asyncio.run(main())

  # TaskGroup (Python 3.11+) -- structured concurrency
  async def main_structured():
      async with asyncio.TaskGroup() as tg:
          t1 = tg.create_task(fetch_data("url1"))
          t2 = tg.create_task(fetch_data("url2"))
      # all tasks complete or all cancelled on error
      print(t1.result(), t2.result())

  # Timeout handling
  async def with_timeout():
      try:
          async with asyncio.timeout(2.0):
              result = await fetch_data("slow_url")
      except TimeoutError:
          print("Request timed out")

  # Semaphore -- limit concurrency
  async def limited_fetch(sem: asyncio.Semaphore, url: str):
      async with sem:
          return await fetch_data(url)

  async def main_limited():
      sem = asyncio.Semaphore(10)  # max 10 concurrent requests
      urls = [f"url{i}" for i in range(100)]
      tasks = [limited_fetch(sem, url) for url in urls]
      return await asyncio.gather(*tasks)

  # Async generators
  async def async_range(n):
      for i in range(n):
          await asyncio.sleep(0.1)
          yield i

  async def consume():
      async for value in async_range(5):
          print(value)
  ```

  asyncio -- основа для сучасних Python веб-фреймворків (FastAPI, aiohttp) та будь-яких I/O-інтенсивних додатків. Ключове правило: ніколи не блокуйте event loop синхронним кодом -- використовуйте `run_in_executor` для CPU-bound операцій.
en_answer: |
  **asyncio** implements cooperative multitasking through an event loop. Coroutines (async/await) voluntarily yield control to the event loop at each `await`, allowing other coroutines to execute.

  A **coroutine** is a function defined with `async def`. Calling it returns a coroutine object that does not execute until `await` or submission to the event loop. A **Task** is a wrapper around a coroutine registered in the event loop for concurrent execution. A **Future** is a low-level object representing a result that will be available in the future.

  The event loop runs in a single thread, using `select`/`epoll`/`kqueue` for I/O multiplexing. This means zero overhead for context switching between coroutines.

  ```python
  import asyncio

  # Coroutine -- does not run until awaited
  async def fetch_data(url: str) -> str:
      print(f"Fetching {url}")
      await asyncio.sleep(1)  # simulates I/O
      return f"Data from {url}"

  # Task -- scheduled for concurrent execution
  async def main():
      # Sequential -- 3 seconds total
      r1 = await fetch_data("url1")
      r2 = await fetch_data("url2")
      r3 = await fetch_data("url3")

      # Concurrent -- 1 second total
      tasks = [
          asyncio.create_task(fetch_data("url1")),
          asyncio.create_task(fetch_data("url2")),
          asyncio.create_task(fetch_data("url3")),
      ]
      results = await asyncio.gather(*tasks)

  asyncio.run(main())

  # TaskGroup (Python 3.11+) -- structured concurrency
  async def main_structured():
      async with asyncio.TaskGroup() as tg:
          t1 = tg.create_task(fetch_data("url1"))
          t2 = tg.create_task(fetch_data("url2"))
      # all tasks complete or all cancelled on error
      print(t1.result(), t2.result())

  # Timeout handling
  async def with_timeout():
      try:
          async with asyncio.timeout(2.0):
              result = await fetch_data("slow_url")
      except TimeoutError:
          print("Request timed out")

  # Semaphore -- limit concurrency
  async def limited_fetch(sem: asyncio.Semaphore, url: str):
      async with sem:
          return await fetch_data(url)

  async def main_limited():
      sem = asyncio.Semaphore(10)  # max 10 concurrent requests
      urls = [f"url{i}" for i in range(100)]
      tasks = [limited_fetch(sem, url) for url in urls]
      return await asyncio.gather(*tasks)

  # Async generators
  async def async_range(n):
      for i in range(n):
          await asyncio.sleep(0.1)
          yield i

  async def consume():
      async for value in async_range(5):
          print(value)
  ```

  asyncio is the foundation for modern Python web frameworks (FastAPI, aiohttp) and any I/O-intensive applications. The key rule: never block the event loop with synchronous code -- use `run_in_executor` for CPU-bound operations.
section: "python"
order: 19
tags:
  - async
  - concurrency
type: "deep"
---
