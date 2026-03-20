# Requirements: Interview Cheatsheet

**Defined:** 2026-03-20
**Core Value:** Будь-хто може швидко знайти та повторити ключові питання і відповіді для підготовки до технічної співбесіди з потрібної теми.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Content & Core

- [ ] **CORE-01**: Головна сторінка відображає список усіх розділів із назвою та кількістю питань
- [ ] **CORE-02**: Сторінка розділу відображає список питань у форматі флешкарток
- [ ] **CORE-03**: Клік/тап на флешкартку розкриває приховану відповідь з плавною анімацією
- [ ] **CORE-04**: Відповіді підтримують Markdown з підсвіткою синтаксису коду
- [ ] **CORE-05**: 5-7 розділів на старті: QA, Automation QA, Java, Kubernetes, Blockchain, Docker, SQL
- [ ] **CORE-06**: Контент зберігається у Markdown-файлах з frontmatter метаданими
- [ ] **CORE-07**: Якірні посилання на окремі питання (bookmark/share)

### i18n

- [ ] **I18N-01**: Перемикач мови UA/EN на всіх сторінках
- [ ] **I18N-02**: Кожне питання має версію українською та англійською
- [ ] **I18N-03**: UI елементи (навігація, кнопки) перекладені на обидві мови

### Design

- [ ] **DSGN-01**: Сучасний дизайн з яскравими акцентами та анімаціями
- [ ] **DSGN-02**: Dark/light mode з детекцією системних налаштувань та ручним перемикачем
- [ ] **DSGN-03**: Респонсивний layout (мобільні пристрої від 320px)
- [ ] **DSGN-04**: Чиста типографіка для читання технічного контенту

### Infrastructure

- [ ] **INFR-01**: Статичний сайт на Astro з деплоєм на GitHub Pages/Vercel/Netlify
- [ ] **INFR-02**: CI/CD: пуш у git автоматично перебудовує та деплоїть сайт
- [ ] **INFR-03**: Контент-пайплайн: Markdown → HTML build-time генерація

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
| CORE-01 | — | Pending |
| CORE-02 | — | Pending |
| CORE-03 | — | Pending |
| CORE-04 | — | Pending |
| CORE-05 | — | Pending |
| CORE-06 | — | Pending |
| CORE-07 | — | Pending |
| I18N-01 | — | Pending |
| I18N-02 | — | Pending |
| I18N-03 | — | Pending |
| DSGN-01 | — | Pending |
| DSGN-02 | — | Pending |
| DSGN-03 | — | Pending |
| DSGN-04 | — | Pending |
| INFR-01 | — | Pending |
| INFR-02 | — | Pending |
| INFR-03 | — | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 0
- Unmapped: 17 ⚠️

---
*Requirements defined: 2026-03-20*
*Last updated: 2026-03-20 after initial definition*
