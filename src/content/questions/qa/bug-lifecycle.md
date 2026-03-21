---
ua_question: "Який життєвий цикл бага?"
en_question: "What is the bug lifecycle?"
ua_answer: |
  Життєвий цикл бага (defect lifecycle) -- це послідовність станів, через які проходить дефект від моменту його виявлення до закриття.

  **Основні стани бага:**
  - **New** -- баг щойно створений тестувальником
  - **Assigned** -- баг призначений розробнику для виправлення
  - **Open** -- розробник почав працювати над виправленням
  - **Fixed** -- розробник виправив баг
  - **Retest** -- тестувальник перевіряє виправлення
  - **Verified** -- виправлення підтверджено, баг більше не відтворюється
  - **Closed** -- баг офіційно закритий
  - **Reopened** -- баг відтворюється знову після виправлення

  Додатково існують стани **Deferred** (відкладений на пізніше), **Rejected** (не є багом) та **Duplicate** (дублікат існуючого бага).

  Правильне управління життєвим циклом бага допомагає команді ефективно відстежувати та пріоритизувати дефекти.
en_answer: |
  The bug lifecycle (defect lifecycle) is a sequence of states that a defect goes through from the moment it is discovered until it is closed.

  **Main bug states:**
  - **New** -- bug just created by tester
  - **Assigned** -- bug assigned to developer for fixing
  - **Open** -- developer started working on the fix
  - **Fixed** -- developer fixed the bug
  - **Retest** -- tester verifies the fix
  - **Verified** -- fix confirmed, bug no longer reproduces
  - **Closed** -- bug officially closed
  - **Reopened** -- bug reproduces again after the fix

  Additional states include **Deferred** (postponed for later), **Rejected** (not a bug) and **Duplicate** (duplicate of an existing bug).

  Proper bug lifecycle management helps the team effectively track and prioritize defects.
section: "qa"
order: 4
tags:
  - bug-tracking
  - process
---
