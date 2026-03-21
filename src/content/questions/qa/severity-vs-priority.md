---
ua_question: "Яка різниця між severity та priority?"
en_question: "What is the difference between severity and priority?"
ua_answer: |
  **Severity (серйозність)** -- це ступінь впливу дефекту на функціональність системи. Визначається тестувальником з технічної точки зору.

  Рівні severity:
  - **Blocker** -- система не працює, тестування неможливе
  - **Critical** -- основна функція не працює, немає workaround
  - **Major** -- функція працює неправильно, але є workaround
  - **Minor** -- незначний дефект, який не впливає на основну функціональність
  - **Trivial** -- косметичний дефект (помилка в тексті, вирівнювання)

  **Priority (пріоритет)** -- це порядок, у якому дефект повинен бути виправлений. Визначається менеджером або Product Owner з бізнес-точки зору.

  Рівні priority:
  - **High** -- виправити негайно
  - **Medium** -- виправити в поточному спринті
  - **Low** -- виправити, коли буде час

  **Важливо:** severity і priority не завжди збігаються. Наприклад, помилка в логотипі компанії на головній сторінці -- low severity (косметика), але high priority (репутація бренду).
en_answer: |
  **Severity** is the degree of impact a defect has on system functionality. It is determined by the tester from a technical perspective.

  Severity levels:
  - **Blocker** -- system does not work, testing is impossible
  - **Critical** -- main function does not work, no workaround
  - **Major** -- function works incorrectly, but workaround exists
  - **Minor** -- insignificant defect that does not affect core functionality
  - **Trivial** -- cosmetic defect (typo, alignment)

  **Priority** is the order in which a defect should be fixed. It is determined by the manager or Product Owner from a business perspective.

  Priority levels:
  - **High** -- fix immediately
  - **Medium** -- fix in current sprint
  - **Low** -- fix when time permits

  **Important:** severity and priority do not always match. For example, a wrong company logo on the main page is low severity (cosmetic), but high priority (brand reputation).
section: "qa"
order: 11
tags:
  - bug-tracking
  - severity
  - priority
---
