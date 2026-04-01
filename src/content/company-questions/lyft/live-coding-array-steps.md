---
company: "lyft"
stage: "live-coding"
ua_question: "Дано масив цілих чисел, що представляють висоти. Порахуй мінімальну кількість кроків, щоб дістатися від першого елемента до останнього, якщо з позиції i можна стрибнути на відстань не більше arr[i]."
en_question: "Given an array of integers representing heights, count the minimum number of steps to get from the first element to the last, if from position i you can jump a distance of at most arr[i]."
ua_answer: |
  Класична задача **Jump Game II** (LeetCode #45). Жадібний алгоритм — на кожному кроці вибираємо найдальший досяжний елемент.

  ```python
  def min_jumps(arr: list[int]) -> int:
      if len(arr) <= 1:
          return 0

      jumps = 0
      current_end = 0  # межа поточного стрибка
      farthest = 0     # найдальша досяжна позиція

      for i in range(len(arr) - 1):
          farthest = max(farthest, i + arr[i])

          if i == current_end:
              jumps += 1
              current_end = farthest

              if current_end >= len(arr) - 1:
                  break

      return jumps if current_end >= len(arr) - 1 else -1

  # Приклади
  print(min_jumps([2, 3, 1, 1, 4]))  # 2: [0]→[1]→[4]
  print(min_jumps([1, 1, 1, 1]))     # 3: кожен раз по 1
  print(min_jumps([0]))              # 0: вже на місці
  ```

  **Складність:** O(n) часу, O(1) пам'яті.

  **Ключові моменти на інтерв'ю:**
  - Запитай про edge cases: порожній масив, один елемент, неможливо дістатися
  - Поясни чому greedy працює — на кожному "рівні" стрибків обираємо оптимальне продовження
  - Порівняй з BFS/DP підходами (O(n²)) і поясни чому greedy ефективніший
en_answer: |
  Classic **Jump Game II** problem (LeetCode #45). Greedy algorithm — at each step, choose the farthest reachable element.

  ```python
  def min_jumps(arr: list[int]) -> int:
      if len(arr) <= 1:
          return 0

      jumps = 0
      current_end = 0  # boundary of current jump
      farthest = 0     # farthest reachable position

      for i in range(len(arr) - 1):
          farthest = max(farthest, i + arr[i])

          if i == current_end:
              jumps += 1
              current_end = farthest

              if current_end >= len(arr) - 1:
                  break

      return jumps if current_end >= len(arr) - 1 else -1

  # Examples
  print(min_jumps([2, 3, 1, 1, 4]))  # 2: [0]→[1]→[4]
  print(min_jumps([1, 1, 1, 1]))     # 3: one step at a time
  print(min_jumps([0]))              # 0: already there
  ```

  **Complexity:** O(n) time, O(1) space.

  **Key points for the interview:**
  - Ask about edge cases: empty array, single element, unreachable end
  - Explain why greedy works — at each "level" of jumps, choose the optimal continuation
  - Compare with BFS/DP approaches (O(n²)) and explain why greedy is more efficient
tags: [algorithms, arrays, greedy, python]
order: 1
---
