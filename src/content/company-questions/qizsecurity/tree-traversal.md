---
company: "qizsecurity"
stage: "technical-interview"
ua_question: "Реалізуй функцію printAllTests(testNode) — виведи всі тести з дерева тестів"
en_question: "Implement printAllTests(testNode) — print all tests from a test tree"
ua_answer: |
  **Рекурсивний DFS (найпростіший варіант):**
  ```python
  def printAllTests(testNode):
      if testNode.isTest():
          print(testNode.getTestName())
      elif testNode.isDirectory():
          for child in testNode.getChilds():
              printAllTests(child)
  ```

  **Ітеративний DFS (зі стеком, уникає stack overflow):**
  ```python
  def printAllTests(testNode):
      stack = [testNode]
      while stack:
          node = stack.pop()
          if node.isTest():
              print(node.getTestName())
          elif node.isDirectory():
              for child in reversed(node.getChilds()):
                  stack.append(child)
  ```

  **Складність:**
  - Time: O(n) — кожен вузол відвідується рівно раз
  - Space: O(h) — де h = висота дерева
en_answer: |
  **Recursive DFS (simplest approach):**
  ```python
  def printAllTests(testNode):
      if testNode.isTest():
          print(testNode.getTestName())
      elif testNode.isDirectory():
          for child in testNode.getChilds():
              printAllTests(child)
  ```

  **Iterative DFS (with stack, avoids stack overflow):**
  ```python
  def printAllTests(testNode):
      stack = [testNode]
      while stack:
          node = stack.pop()
          if node.isTest():
              print(node.getTestName())
          elif node.isDirectory():
              for child in reversed(node.getChilds()):
                  stack.append(child)
  ```

  **Complexity:**
  - Time: O(n) — each node visited exactly once
  - Space: O(h) — where h = tree height
tags: [algorithms, tree-traversal, dfs, recursion]
order: 1
---
