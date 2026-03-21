---
ua_question: "Коли варто автоматизувати тести?"
en_question: "When should you automate tests?"
ua_answer: |
  Рішення про автоматизацію залежить від кількох факторів: частоти виконання, стабільності функціоналу та ROI (повернення інвестицій).

  **Варто автоматизувати:**
  - **Регресійні тести** -- виконуються регулярно після кожного релізу
  - **Smoke тести** -- критичний шлях, який перевіряється після кожного білду
  - **Data-driven тести** -- один сценарій з багатьма наборами даних
  - **Тести продуктивності** -- навантажувальне тестування неможливо виконати вручну
  - **Кросбраузерне тестування** -- перевірка в різних браузерах та пристроях

  **НЕ варто автоматизувати:**
  - Тести, які виконуються один-два рази
  - Функціональність, яка часто змінюється (UI в ранній фазі)
  - Тестування зручності використання (UX)
  - Дослідницьке тестування

  **Формула ROI автоматизації:**
  - Вигода = (час ручного тесту * кількість запусків) - (час створення + час підтримки)
  - Якщо вигода > 0 -- автоматизація доцільна

  Загальне правило: якщо тест буде виконуватися більше 3-5 разів, його варто автоматизувати.
en_answer: |
  The decision to automate depends on several factors: execution frequency, feature stability, and ROI (return on investment).

  **Worth automating:**
  - **Regression tests** -- executed regularly after each release
  - **Smoke tests** -- critical path checked after every build
  - **Data-driven tests** -- one scenario with many data sets
  - **Performance tests** -- load testing cannot be done manually
  - **Cross-browser testing** -- verification across different browsers and devices

  **NOT worth automating:**
  - Tests executed once or twice
  - Frequently changing functionality (UI in early phase)
  - Usability testing (UX)
  - Exploratory testing

  **Automation ROI formula:**
  - Benefit = (manual test time * number of runs) - (creation time + maintenance time)
  - If benefit > 0 -- automation is worthwhile

  General rule: if a test will be executed more than 3-5 times, it is worth automating.
section: "automation-qa"
order: 2
tags:
  - strategy
  - roi
---
