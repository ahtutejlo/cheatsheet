# Requirements: Interview Cheatsheet

**Defined:** 2026-03-20
**Core Value:** Будь-хто може швидко знайти та повторити ключові питання і відповіді для підготовки до технічної співбесіди з потрібної теми.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Content & Core

- [x] **CORE-01**: Головна сторінка відображає список усіх розділів із назвою та кількістю питань
- [x] **CORE-02**: Сторінка розділу відображає список питань у форматі флешкарток
- [x] **CORE-03**: Клік/тап на флешкартку розкриває приховану відповідь з плавною анімацією
- [x] **CORE-04**: Відповіді підтримують Markdown з підсвіткою синтаксису коду
- [x] **CORE-05**: 5-7 розділів на старті: QA, Automation QA, Java, Kubernetes, Blockchain, Docker, SQL
- [x] **CORE-06**: Контент зберігається у Markdown-файлах з frontmatter метаданими
- [x] **CORE-07**: Якірні посилання на окремі питання (bookmark/share)

### i18n

- [x] **I18N-01**: Перемикач мови UA/EN на всіх сторінках
- [x] **I18N-02**: Кожне питання має версію українською та англійською
- [x] **I18N-03**: UI елементи (навігація, кнопки) перекладені на обидві мови

### Design

- [x] **DSGN-01**: Сучасний дизайн з яскравими акцентами та анімаціями
- [x] **DSGN-02**: Dark/light mode з детекцією системних налаштувань та ручним перемикачем
- [x] **DSGN-03**: Респонсивний layout (мобільні пристрої від 320px)
- [x] **DSGN-04**: Чиста типографіка для читання технічного контенту

### Infrastructure

- [x] **INFR-01**: Статичний сайт на Astro з деплоєм на GitHub Pages/Vercel/Netlify
- [x] **INFR-02**: CI/CD: пуш у git автоматично перебудовує та деплоїть сайт
- [x] **INFR-03**: Контент-пайплайн: Markdown → HTML build-time генерація

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Discovery

- **DISC-01**: Повнотекстовий пошук по питаннях і відповідях (Pagefind)
- **DISC-02**: Теги для питань з фільтрацією
- **DISC-03**: Сторінка всіх тегів

### UX Enhancements

- **UX-01**: Expand all / Collapse all на сторінці розділу
- **UX-02**: Клавіатурна навігація (стрілки + Enter)
- **UX-03**: Print-friendly CSS

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / авторизація | Публічний ресурс без акаунтів, статичний сайт |
| Quiz mode з варіантами відповідей | Флешкартки ефективніші для повторення, значно менше контенту |
| Spaced repetition (SRS) | Сайт — шпаргалка, не Anki. Потрібен бекенд |
| CMS адмін-панель | Git + Markdown = CMS. Зайва складність |
| Рівні складності | Суб'єктивно, не додає цінності |
| Коментарі / обговорення | Потрібен бекенд, модерація |
| Користувацький контент | Контрибуції через GitHub PR |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Complete |
| CORE-02 | Phase 1 | Complete |
| CORE-03 | Phase 1 | Complete |
| CORE-04 | Phase 1 | Complete |
| CORE-05 | Phase 2 | Complete |
| CORE-06 | Phase 1 | Complete |
| CORE-07 | Phase 1 | Complete |
| I18N-01 | Phase 3 | Complete |
| I18N-02 | Phase 3 | Complete |
| I18N-03 | Phase 3 | Complete |
| DSGN-01 | Phase 2 | Complete |
| DSGN-02 | Phase 2 | Complete |
| DSGN-03 | Phase 1 | Complete |
| DSGN-04 | Phase 1 | Complete |
| INFR-01 | Phase 1 | Complete |
| INFR-02 | Phase 1 | Complete |
| INFR-03 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0

---
*Requirements defined: 2026-03-20*
*Last updated: 2026-03-20 after roadmap creation*
