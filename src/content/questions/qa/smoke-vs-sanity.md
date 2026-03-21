---
ua_question: "Яка різниця між smoke та sanity тестуванням?"
en_question: "What is the difference between smoke and sanity testing?"
ua_answer: |
  **Smoke тестування** -- це швидка перевірка основної функціональності системи після нового білду. Мета -- переконатися, що система стабільна і готова до більш детального тестування.

  Характеристики smoke тестування:
  - Виконується **після кожного білду**
  - Покриває **критичний шлях** користувача
  - Зазвичай **автоматизоване**
  - Якщо smoke тест не пройшов -- білд відхиляється

  **Sanity тестування** -- це вузькоспрямована перевірка конкретної функціональності після виправлення бага або додавання нової функції. Мета -- переконатися, що конкретна зміна працює правильно.

  Характеристики sanity тестування:
  - Виконується **після конкретної зміни**
  - Покриває **вузьку область** функціональності
  - Зазвичай **ручне** (manual)
  - Глибше ніж smoke, але вужче за обсягом

  **Простими словами:** smoke -- "чи працює система взагалі?", sanity -- "чи працює конкретна зміна?".
en_answer: |
  **Smoke testing** is a quick verification of the system's core functionality after a new build. The goal is to ensure the system is stable and ready for more detailed testing.

  Smoke testing characteristics:
  - Performed **after every build**
  - Covers the **critical user path**
  - Usually **automated**
  - If smoke test fails -- the build is rejected

  **Sanity testing** is a narrow, focused verification of specific functionality after a bug fix or new feature addition. The goal is to ensure a specific change works correctly.

  Sanity testing characteristics:
  - Performed **after a specific change**
  - Covers a **narrow area** of functionality
  - Usually **manual**
  - Deeper than smoke, but narrower in scope

  **In simple terms:** smoke -- "does the system work at all?", sanity -- "does the specific change work?".
section: "qa"
order: 9
tags:
  - testing-types
  - smoke-testing
  - sanity-testing
---
