# Requirements: Interview Cheatsheet

**Defined:** 2026-03-21
**Core Value:** Будь-хто може швидко знайти та повторити ключові питання і відповіді для підготовки до технічної співбесіди з потрібної теми.

## v1.1 Requirements

Requirements for milestone v1.1 Advanced Questions. Each maps to roadmap phases.

### Infrastructure

- [x] **INFRA-01**: Schema має підтримувати поле type (basic/deep/trick/practical) з default('basic')
- [x] **INFRA-02**: Shiki підсвічує solidity та python код у відповідях
- [x] **INFRA-03**: Документ content conventions визначає структуру для кожного типу питань

### UI

- [x] **UI-01**: Користувач бачить type badge (Deep / Trick / Practical) на кожній flashcard
- [x] **UI-02**: Питання згруповані по типах на сторінці розділу (Basic → Deep → Trick → Practical)
- [x] **UI-03**: Користувач бачить кількість питань по типах на сторінці розділу

### Content — Automation QA

- [x] **CONT-01**: 5 глибоких технічних питань для Automation QA (білінгвальні UA/EN)
- [x] **CONT-02**: 5 питань-пасток для Automation QA (білінгвальні UA/EN)
- [x] **CONT-03**: 5 практичних задач для Automation QA (білінгвальні UA/EN)

### Content — Java

- [x] **CONT-04**: 5 глибоких технічних питань для Java (білінгвальні UA/EN)
- [x] **CONT-05**: 5 питань-пасток для Java (білінгвальні UA/EN)
- [x] **CONT-06**: 5 практичних задач для Java (білінгвальні UA/EN)

### Content — Kubernetes

- [x] **CONT-07**: 5 глибоких технічних питань для Kubernetes (білінгвальні UA/EN)
- [x] **CONT-08**: 5 питань-пасток для Kubernetes (білінгвальні UA/EN)
- [x] **CONT-09**: 5 практичних задач для Kubernetes (білінгвальні UA/EN)

### Content — Blockchain

- [x] **CONT-10**: 5 глибоких технічних питань для Blockchain (білінгвальні UA/EN)
- [x] **CONT-11**: 5 питань-пасток для Blockchain (білінгвальні UA/EN)
- [x] **CONT-12**: 5 практичних задач для Blockchain (білінгвальні UA/EN)

### Content — Docker

- [x] **CONT-13**: 5 глибоких технічних питань для Docker (білінгвальні UA/EN)
- [x] **CONT-14**: 5 питань-пасток для Docker (білінгвальні UA/EN)
- [x] **CONT-15**: 5 практичних задач для Docker (білінгвальні UA/EN)

### Content — SQL

- [x] **CONT-16**: 5 глибоких технічних питань для SQL (білінгвальні UA/EN)
- [x] **CONT-17**: 5 питань-пасток для SQL (білінгвальні UA/EN)
- [x] **CONT-18**: 5 практичних задач для SQL (білінгвальні UA/EN)

### Search & Filter

- [ ] **SRCH-01**: Користувач може шукати по всіх питаннях і відповідях (Pagefind)
- [ ] **SRCH-02**: Користувач може фільтрувати питання за тегами

## Future Requirements

### Content Expansion

- **CONT-19**: Додати advanced питання для розділу QA
- **CONT-20**: Нові розділи (CI/CD, Git, Linux, Networks)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Рівні складності (Junior/Middle/Senior) | Типи питань (deep/trick/practical) вже дають структуру |
| Тестовий режим з варіантами відповідей | Залишаємо формат flashcards |
| Інтерактивні code playgrounds | Складність реалізації, статичний сайт |
| AI-генерація питань on-the-fly | Контент генерується офлайн, зберігається у Markdown |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 4 | Complete |
| INFRA-02 | Phase 4 | Complete |
| INFRA-03 | Phase 4 | Complete |
| UI-01 | Phase 4 | Complete |
| UI-02 | Phase 4 | Complete |
| UI-03 | Phase 4 | Complete |
| CONT-01 | Phase 5 | Complete |
| CONT-02 | Phase 5 | Complete |
| CONT-03 | Phase 5 | Complete |
| CONT-04 | Phase 5 | Complete |
| CONT-05 | Phase 5 | Complete |
| CONT-06 | Phase 5 | Complete |
| CONT-07 | Phase 5 | Complete |
| CONT-08 | Phase 5 | Complete |
| CONT-09 | Phase 5 | Complete |
| CONT-10 | Phase 5 | Complete |
| CONT-11 | Phase 5 | Complete |
| CONT-12 | Phase 5 | Complete |
| CONT-13 | Phase 5 | Complete |
| CONT-14 | Phase 5 | Complete |
| CONT-15 | Phase 5 | Complete |
| CONT-16 | Phase 5 | Complete |
| CONT-17 | Phase 5 | Complete |
| CONT-18 | Phase 5 | Complete |
| SRCH-01 | Phase 6 | Pending |
| SRCH-02 | Phase 6 | Pending |

**Coverage:**
- v1.1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 after roadmap creation*
