# Companies Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Companies" tab to the homepage with company interview profiles and stage-grouped flashcards.

**Architecture:** Two new Astro content collections (`companies`, `companyQuestions`) feed a tab-switched homepage and per-company detail pages. Client-side JS handles tab switching with URL hash persistence. Existing Flashcard component is reused with a new `borderColor` prop for stage-based coloring.

**Tech Stack:** Astro 6, Tailwind CSS 4, TypeScript, Zod (content schema validation)

---

### Task 1: Content Collections Schema

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Add companies collection schema**

Add after the existing `questions` collection:

```typescript
const companies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/companies' }),
  schema: z.object({
    slug: z.string(),
    ua_name: z.string(),
    en_name: z.string(),
    type: z.enum(['outsource', 'product', 'startup', 'agency']),
    region: z.enum(['international', 'ukraine', 'usa', 'eu']),
    ua_description: z.string(),
    en_description: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    duration: z.string(),
    stages: z.array(z.object({
      ua_name: z.string(),
      en_name: z.string(),
      duration: z.string(),
    })),
    tags: z.array(z.string()).default([]),
    ua_tips: z.array(z.string()).default([]),
    en_tips: z.array(z.string()).default([]),
  }),
});
```

- [ ] **Step 2: Add companyQuestions collection schema**

Add after `companies`:

```typescript
const companyQuestions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/company-questions' }),
  schema: z.object({
    company: z.string(),
    stage: z.string(),
    ua_question: z.string(),
    en_question: z.string(),
    ua_answer: z.string(),
    en_answer: z.string(),
    tags: z.array(z.string()).default([]),
    order: z.number(),
  }),
});
```

- [ ] **Step 3: Export all collections**

Update the export:

```typescript
export const collections = { questions, companies, companyQuestions };
```

- [ ] **Step 4: Create content directories**

```bash
mkdir -p src/content/companies src/content/company-questions
```

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(companies): add content collection schemas for companies and company questions"
```

---

### Task 2: Sample Company Data

**Files:**
- Create: `src/content/companies/epam.md`
- Create: `src/content/company-questions/epam/page-object-pattern.md`
- Create: `src/content/company-questions/epam/implicit-vs-explicit-waits.md`

- [ ] **Step 1: Create sample company file**

Create `src/content/companies/epam.md`:

```yaml
---
slug: "epam"
ua_name: "EPAM Systems"
en_name: "EPAM Systems"
type: "outsource"
region: "international"
ua_description: "Міжнародна IT-компанія з центрами розробки в Україні"
en_description: "International IT company with development centers in Ukraine"
difficulty: "medium"
duration: "3 weeks"
stages:
  - ua_name: "HR скринінг"
    en_name: "HR Screening"
    duration: "30m"
  - ua_name: "Технічне інтерв'ю"
    en_name: "Technical Interview"
    duration: "1h"
  - ua_name: "Live coding"
    en_name: "Live Coding"
    duration: "1h"
  - ua_name: "Фінальна співбесіда"
    en_name: "Final Interview"
    duration: "45m"
tags: [java, automation, sql, rest-api, docker]
ua_tips:
  - "Багато запитують про паттерни автоматизації — Page Object обов'язково"
  - "На live coding дають реальну задачу з Selenium/Playwright"
  - "HR етап — стандартний, фокус на мотивації та англійській"
en_tips:
  - "Heavy focus on automation patterns — Page Object is a must"
  - "Live coding uses real-world Selenium/Playwright tasks"
  - "HR stage is standard — focus on motivation and English skills"
---
```

- [ ] **Step 2: Create sample company question 1**

Create `src/content/company-questions/epam/page-object-pattern.md`:

```yaml
---
company: "epam"
stage: "technical-interview"
ua_question: "Що таке Page Object Pattern і навіщо він потрібен?"
en_question: "What is Page Object Pattern and why is it needed?"
ua_answer: |
  Page Object — це паттерн проєктування в автоматизації тестування, який створює об'єктну модель для кожної сторінки або компонента UI.

  **Основні переваги:**
  - Розділення логіки тестів від деталей реалізації UI
  - Повторне використання коду — один Page Object для багатьох тестів
  - Легке оновлення при зміні UI — змінюється лише Page Object

  ```java
  public class LoginPage {
      private WebDriver driver;

      @FindBy(id = "username")
      private WebElement usernameField;

      @FindBy(id = "password")
      private WebElement passwordField;

      @FindBy(css = "button[type='submit']")
      private WebElement loginButton;

      public LoginPage(WebDriver driver) {
          this.driver = driver;
          PageFactory.initElements(driver, this);
      }

      public DashboardPage login(String user, String pass) {
          usernameField.sendKeys(user);
          passwordField.sendKeys(pass);
          loginButton.click();
          return new DashboardPage(driver);
      }
  }
  ```
en_answer: |
  Page Object is a design pattern in test automation that creates an object model for each page or UI component.

  **Key benefits:**
  - Separates test logic from UI implementation details
  - Code reuse — one Page Object for many tests
  - Easy maintenance when UI changes — only the Page Object needs updating

  ```java
  public class LoginPage {
      private WebDriver driver;

      @FindBy(id = "username")
      private WebElement usernameField;

      @FindBy(id = "password")
      private WebElement passwordField;

      @FindBy(css = "button[type='submit']")
      private WebElement loginButton;

      public LoginPage(WebDriver driver) {
          this.driver = driver;
          PageFactory.initElements(driver, this);
      }

      public DashboardPage login(String user, String pass) {
          usernameField.sendKeys(user);
          passwordField.sendKeys(pass);
          loginButton.click();
          return new DashboardPage(driver);
      }
  }
  ```
tags: [automation, patterns, page-object]
order: 1
---
```

- [ ] **Step 3: Create sample company question 2**

Create `src/content/company-questions/epam/implicit-vs-explicit-waits.md`:

```yaml
---
company: "epam"
stage: "technical-interview"
ua_question: "Різниця між implicit та explicit waits у Selenium"
en_question: "Difference between implicit and explicit waits in Selenium"
ua_answer: |
  **Implicit Wait** — глобальне очікування, яке застосовується до всіх пошуків елементів:
  ```java
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
  ```

  **Explicit Wait** — очікування конкретної умови для конкретного елемента:
  ```java
  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  WebElement element = wait.until(
      ExpectedConditions.visibilityOfElementLocated(By.id("result"))
  );
  ```

  **Ключові відмінності:**
  - Implicit — застосовується глобально, Explicit — точково
  - Explicit дозволяє чекати на конкретні умови (visibility, clickable, text presence)
  - Не рекомендується змішувати обидва типи — це може призвести до непередбачуваних таймаутів
en_answer: |
  **Implicit Wait** — global wait applied to all element lookups:
  ```java
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
  ```

  **Explicit Wait** — waits for a specific condition on a specific element:
  ```java
  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  WebElement element = wait.until(
      ExpectedConditions.visibilityOfElementLocated(By.id("result"))
  );
  ```

  **Key differences:**
  - Implicit applies globally, Explicit targets specific elements
  - Explicit allows waiting for specific conditions (visibility, clickable, text presence)
  - Mixing both types is not recommended — can lead to unpredictable timeouts
tags: [selenium, waits, automation]
order: 2
---
```

- [ ] **Step 4: Verify build passes with sample data**

```bash
npm run build 2>&1 | head -20
```

Expected: build succeeds (new collections discovered but no pages consume them yet).

- [ ] **Step 5: Commit**

```bash
git add src/content/companies/ src/content/company-questions/
git commit -m "feat(companies): add sample EPAM company data with 2 interview questions"
```

---

### Task 3: i18n Keys

**Files:**
- Modify: `src/i18n/ui.ts`

- [ ] **Step 1: Add all company-related UI keys**

Add the following keys to both `ua` and `en` objects in `src/i18n/ui.ts`:

In the `ua` object, add after `'group.expandAll'`:
```typescript
'tab.questions': 'Питання',
'tab.companies': 'Компанії',
'company.stages': 'Процес співбесіди',
'company.duration': 'Загалом',
'company.difficulty': 'Складність',
'company.reviews': 'відгуків',
'company.tips': 'Поради від кандидатів',
'company.questions_asked': 'питань від кандидатів',
'company.back': 'Назад до компаній',
'company.empty.title': 'Компаній поки немає',
'company.empty.body': 'Цей розділ ще наповнюється. Поверніться пізніше.',
'company.questions_title': 'Питання які задавали',
'difficulty.easy': 'Легка',
'difficulty.medium': 'Середня',
'difficulty.hard': 'Висока',
'type.outsource': 'Outsource',
'type.product': 'Product',
'type.startup': 'Startup',
'type.agency': 'Agency',
'region.international': 'Міжнародна',
'region.ukraine': 'Україна',
'region.usa': 'США',
'region.eu': 'Європа',
```

In the `en` object, add the same keys:
```typescript
'tab.questions': 'Questions',
'tab.companies': 'Companies',
'company.stages': 'Interview Process',
'company.duration': 'Total Duration',
'company.difficulty': 'Difficulty',
'company.reviews': 'reviews',
'company.tips': 'Tips from Candidates',
'company.questions_asked': 'questions from candidates',
'company.back': 'Back to companies',
'company.empty.title': 'No companies yet',
'company.empty.body': 'This section is being populated. Check back soon.',
'company.questions_title': 'Questions asked',
'difficulty.easy': 'Easy',
'difficulty.medium': 'Medium',
'difficulty.hard': 'Hard',
'type.outsource': 'Outsource',
'type.product': 'Product',
'type.startup': 'Startup',
'type.agency': 'Agency',
'region.international': 'International',
'region.ukraine': 'Ukraine',
'region.usa': 'USA',
'region.eu': 'Europe',
```

- [ ] **Step 2: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "feat(companies): add i18n keys for companies tab and company pages"
```

---

### Task 4: Colors and Stage Utilities

**Files:**
- Modify: `src/lib/colors.ts`

- [ ] **Step 1: Add company and stage color utilities**

Add at the end of `src/lib/colors.ts`:

```typescript
// --- Company colors ---
export const defaultCompanyColor: SectionColor = {
  gradientFrom: '#f1f5f9',
  gradientTo: '#e2e8f0',
};

// --- Stage colors (cycle for interview stages) ---
const stagePalette = ['#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

export function getStageColor(index: number): string {
  return stagePalette[index % stagePalette.length];
}

export function getStageBorderClass(index: number): string {
  const classes = [
    'border-l-blue-500',
    'border-l-green-500',
    'border-l-purple-500',
    'border-l-amber-500',
    'border-l-pink-500',
    'border-l-cyan-500',
  ];
  return classes[index % classes.length];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/colors.ts
git commit -m "feat(companies): add stage color palette and company gradient defaults"
```

---

### Task 5: CompanyCard Component

**Files:**
- Create: `src/components/CompanyCard.astro`

- [ ] **Step 1: Create CompanyCard component**

Create `src/components/CompanyCard.astro`:

```astro
---
import { t, localePath, type Locale } from '../i18n/utils';
import { defaultCompanyColor } from '../lib/colors';

interface Props {
  slug: string;
  name: string;
  description: string;
  type: string;
  region: string;
  difficulty: string;
  duration: string;
  stageCount: number;
  tags: string[];
  questionCount: number;
  locale: Locale;
}

const { slug, name, description, type, region, difficulty, duration, stageCount, tags, questionCount, locale } = Astro.props;
const colors = defaultCompanyColor;
const initial = name.charAt(0).toUpperCase();
---
<a
  href={localePath(locale, `company/${slug}`)}
  class="group block rounded-[14px] border border-gray-200 dark:border-gray-700 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 dark:bg-white/[0.03]"
>
  <div class="flex items-center gap-3 mb-3">
    <div
      class="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl font-bold text-slate-600 dark:text-slate-300"
      style={`background: linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo});`}
    >
      {initial}
    </div>
    <div>
      <h2 class="text-lg font-bold leading-tight text-gray-900 dark:text-gray-100">
        {name}
      </h2>
      <p class="text-[11px] text-gray-400 dark:text-gray-500">
        {t(locale, `region.${region}` as any)} · {t(locale, `type.${type}` as any)}
      </p>
    </div>
  </div>
  <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
    {stageCount} {locale === 'ua' ? 'етапів' : 'stages'} · {duration} · {t(locale, `difficulty.${difficulty}` as any)}
  </p>
  <div class="flex flex-wrap gap-1.5 mb-3">
    {tags.slice(0, 5).map(tag => (
      <span class="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
        {tag}
      </span>
    ))}
  </div>
  {questionCount > 0 && (
    <div class="flex items-center gap-1.5">
      <span class="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full bg-purple-500">
        {questionCount}
      </span>
      <span class="text-[10px] text-slate-400">{t(locale, 'company.questions_asked')}</span>
    </div>
  )}
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CompanyCard.astro
git commit -m "feat(companies): add CompanyCard component for homepage grid"
```

---

### Task 6: Homepage Tabs

**Files:**
- Modify: `src/pages/[locale]/index.astro`

- [ ] **Step 1: Replace the entire homepage with tab-based layout**

Replace the full content of `src/pages/[locale]/index.astro` with:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import SectionCard from '../../components/SectionCard.astro';
import CompanyCard from '../../components/CompanyCard.astro';
import { t, type Locale, locales } from '../../i18n/utils';
import { getAllSectionSlugs } from '../../i18n/sections';

export function getStaticPaths() {
  return locales.map(locale => ({ params: { locale } }));
}

const { locale } = Astro.params as { locale: Locale };
const allQuestions = await getCollection('questions');
const sectionSlugs = getAllSectionSlugs();

const TYPE_ORDER = ['basic', 'deep', 'trick', 'practical'] as const;

const sectionData = sectionSlugs.map(slug => {
  const questions = allQuestions.filter(q => q.data.section === slug);
  const typeCounts = TYPE_ORDER.map(type => ({
    type,
    count: questions.filter(q => (q.data.type || 'basic') === type).length,
  })).filter(tc => tc.count > 0);

  return { slug, count: questions.length, typeCounts };
});

// Companies data
const allCompanies = await getCollection('companies');
const allCompanyQuestions = await getCollection('companyQuestions');

const companyData = allCompanies.map(c => {
  const questionCount = allCompanyQuestions.filter(q => q.data.company === c.data.slug).length;
  const nameKey = `${locale}_name` as const;
  const descKey = `${locale}_description` as const;
  return {
    slug: c.data.slug,
    name: (c.data as any)[nameKey] as string,
    description: (c.data as any)[descKey] as string,
    type: c.data.type,
    region: c.data.region,
    difficulty: c.data.difficulty,
    duration: c.data.duration,
    stageCount: c.data.stages.length,
    tags: c.data.tags,
    questionCount,
  };
});
---
<BaseLayout title={t(locale, 'site.title')} description={t(locale, 'site.description')} locale={locale}>
  <Header locale={locale} />
  <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">{t(locale, 'home.title')}</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">{t(locale, 'home.subtitle')}</p>
    </div>

    <!-- Tab Switcher -->
    <div class="flex border-b-2 border-gray-200 dark:border-gray-700 mb-6">
      <button
        id="tab-questions"
        class="tab-btn px-5 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 -mb-[2px] transition-colors"
        data-tab="questions"
      >
        📝 {t(locale, 'tab.questions')}
      </button>
      <button
        id="tab-companies"
        class="tab-btn px-5 py-2.5 text-sm font-medium text-gray-400 dark:text-gray-500 border-b-2 border-transparent -mb-[2px] transition-colors hover:text-gray-600 dark:hover:text-gray-300"
        data-tab="companies"
      >
        🏢 {t(locale, 'tab.companies')}
      </button>
    </div>

    <!-- Questions Grid -->
    <div id="panel-questions" class="tab-panel">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sectionData.map(({ slug, count, typeCounts }) => (
          <SectionCard slug={slug} count={count} typeCounts={typeCounts} locale={locale} />
        ))}
      </div>
    </div>

    <!-- Companies Grid -->
    <div id="panel-companies" class="tab-panel hidden">
      {companyData.length > 0 ? (
        <div class="grid gap-4 sm:grid-cols-2">
          {companyData.map(company => (
            <CompanyCard {...company} locale={locale} />
          ))}
        </div>
      ) : (
        <div class="text-center py-16">
          <p class="text-lg font-semibold text-gray-500 dark:text-gray-400">{t(locale, 'company.empty.title')}</p>
          <p class="mt-2 text-sm text-gray-400 dark:text-gray-500">{t(locale, 'company.empty.body')}</p>
        </div>
      )}
    </div>
  </main>

  <script is:inline>
  (function() {
    var tabs = document.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.tab-panel');

    function activate(tabName) {
      tabs.forEach(function(btn) {
        var isActive = btn.dataset.tab === tabName;
        btn.classList.toggle('text-blue-600', isActive);
        btn.classList.toggle('dark:text-blue-400', isActive);
        btn.classList.toggle('border-blue-500', isActive);
        btn.classList.toggle('font-semibold', isActive);
        btn.classList.toggle('text-gray-400', !isActive);
        btn.classList.toggle('dark:text-gray-500', !isActive);
        btn.classList.toggle('border-transparent', !isActive);
        btn.classList.toggle('font-medium', !isActive);
      });
      panels.forEach(function(panel) {
        var panelTab = panel.id.replace('panel-', '');
        panel.classList.toggle('hidden', panelTab !== tabName);
      });
      try { localStorage.setItem('cheatsheet:tab', tabName); } catch(e) {}
    }

    tabs.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tab = btn.dataset.tab;
        activate(tab);
        history.replaceState(null, '', tab === 'questions' ? location.pathname : '#companies');
      });
    });

    // Restore from hash or localStorage
    var hash = location.hash.replace('#', '');
    if (hash === 'companies') {
      activate('companies');
    } else {
      try {
        var saved = localStorage.getItem('cheatsheet:tab');
        if (saved === 'companies' && !hash) activate('companies');
      } catch(e) {}
    }

    window.addEventListener('hashchange', function() {
      var h = location.hash.replace('#', '');
      if (h === 'companies') activate('companies');
      else activate('questions');
    });
  })();
  </script>
</BaseLayout>
```

- [ ] **Step 2: Verify dev server shows both tabs**

```bash
npm run dev &
sleep 3
curl -s http://localhost:4321/ua/ | grep -c 'tab-btn'
```

Expected: `2` (two tab buttons found)

- [ ] **Step 3: Commit**

```bash
git add src/pages/[locale]/index.astro
git commit -m "feat(companies): add tab switcher to homepage with questions and companies panels"
```

---

### Task 7: CompanyHeader Component

**Files:**
- Create: `src/components/CompanyHeader.astro`

- [ ] **Step 1: Create CompanyHeader component**

Create `src/components/CompanyHeader.astro`:

```astro
---
import { t, type Locale } from '../i18n/utils';
import { getStageColor } from '../lib/colors';

interface Stage {
  ua_name: string;
  en_name: string;
  duration: string;
}

interface Props {
  name: string;
  type: string;
  region: string;
  difficulty: string;
  duration: string;
  stages: Stage[];
  tags: string[];
  tips: string[];
  questionCount: number;
  locale: Locale;
}

const { name, type, region, difficulty, duration, stages, tags, tips, questionCount, locale } = Astro.props;
const initial = name.charAt(0).toUpperCase();
const stageNameKey = `${locale}_name` as const;
---
<div class="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-[14px] p-5 sm:p-6 mb-8">
  <!-- Company name and meta -->
  <div class="flex items-center gap-3 mb-4">
    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400">
      {initial}
    </div>
    <div>
      <h1 class="text-2xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-3xl">{name}</h1>
      <p class="text-sm text-gray-400 dark:text-gray-500">
        {t(locale, `region.${region}` as any)} · {t(locale, `type.${type}` as any)}
      </p>
    </div>
  </div>

  <!-- Interview process timeline -->
  <div class="mb-4">
    <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
      {t(locale, 'company.stages')}
    </p>
    <div class="flex items-center gap-0 overflow-x-auto pb-1">
      {stages.map((stage, i) => (
        <>
          {i > 0 && <span class="text-gray-300 dark:text-gray-600 px-1 shrink-0">→</span>}
          <div
            class="rounded-lg px-3 py-2 text-center shrink-0 min-w-0"
            style={`background: ${getStageColor(i)}10; border: 1px solid ${getStageColor(i)}30;`}
          >
            <p class="text-[11px] font-semibold truncate" style={`color: ${getStageColor(i)};`}>
              {(stage as any)[stageNameKey]}
            </p>
            <p class="text-[10px] text-gray-400 dark:text-gray-500">{stage.duration}</p>
          </div>
        </>
      ))}
    </div>
  </div>

  <!-- Meta info -->
  <div class="flex flex-wrap gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
    <span>⏱ {t(locale, 'company.duration')}: {duration}</span>
    <span>📊 {t(locale, 'company.difficulty')}: {t(locale, `difficulty.${difficulty}` as any)}</span>
    <span>👥 {questionCount} {t(locale, 'company.questions_asked')}</span>
  </div>

  <!-- Tags -->
  {tags.length > 0 && (
    <div class="flex flex-wrap gap-1.5 mb-4">
      {tags.map(tag => (
        <span class="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full font-medium">
          {tag}
        </span>
      ))}
    </div>
  )}

  <!-- Tips -->
  {tips.length > 0 && (
    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
      <p class="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2">
        💡 {t(locale, 'company.tips')}
      </p>
      <ul class="list-disc list-inside text-sm text-amber-900 dark:text-amber-200 space-y-1">
        {tips.map(tip => <li>{tip}</li>)}
      </ul>
    </div>
  )}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CompanyHeader.astro
git commit -m "feat(companies): add CompanyHeader component with stages timeline and tips"
```

---

### Task 8: Company Detail Page

**Files:**
- Create: `src/pages/[locale]/company/[company]/index.astro`

- [ ] **Step 1: Create the company detail page**

Create `src/pages/[locale]/company/[company]/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../../../layouts/BaseLayout.astro';
import Header from '../../../../components/Header.astro';
import CompanyHeader from '../../../../components/CompanyHeader.astro';
import FlashcardList from '../../../../components/FlashcardList.astro';
import { t, localePath, type Locale, locales } from '../../../../i18n/utils';
import { getStageColor, getStageBorderClass } from '../../../../lib/colors';

export async function getStaticPaths() {
  const companies = await getCollection('companies');
  return locales.flatMap(locale =>
    companies.map(c => ({
      params: { locale, company: c.data.slug },
      props: { companyData: c },
    }))
  );
}

const { locale, company } = Astro.params as { locale: Locale; company: string };
const { companyData } = Astro.props;
const data = companyData.data;

const nameKey = `${locale}_name` as const;
const descKey = `${locale}_description` as const;
const tipsKey = `${locale}_tips` as const;
const companyName = (data as any)[nameKey] as string;
const companyTips = (data as any)[tipsKey] as string[];

const allCompanyQuestions = await getCollection('companyQuestions');
const questions = allCompanyQuestions
  .filter(q => q.data.company === company)
  .sort((a, b) => a.data.order - b.data.order);

const questionKey = `${locale}_question` as const;
const answerKey = `${locale}_answer` as const;

// Build stage slug -> index map for colors
const stageIndexMap = new Map<string, number>();
data.stages.forEach((stage: any, i: number) => {
  const slug = stage.en_name.toLowerCase().replace(/\s+/g, '-');
  stageIndexMap.set(slug, i);
});

// Group questions by stage
const stageNameKey = `${locale}_name` as const;
const grouped = data.stages
  .map((stage: any, i: number) => {
    const stageSlug = stage.en_name.toLowerCase().replace(/\s+/g, '-');
    return {
      stageName: stage[stageNameKey] as string,
      stageIndex: i,
      stageSlug,
      questions: questions
        .filter(q => q.data.stage === stageSlug)
        .map(q => {
          const slug = q.id.split('/').pop()?.replace('.md', '') || q.id;
          return {
            slug,
            question: (q.data as any)[questionKey] as string,
            answer: (q.data as any)[answerKey] as string,
            tags: q.data.tags || [],
          };
        }),
    };
  })
  .filter(g => g.questions.length > 0);
---
<BaseLayout
  title={`${companyName} - ${t(locale, 'site.title')}`}
  description={(data as any)[descKey]}
  locale={locale}
>
  <Header locale={locale} currentPath={`company/${company}`} />
  <main data-pagefind-body class="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
    <div class="mb-4" data-pagefind-ignore>
      <a href={`${localePath(locale)}#companies`}
         class="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {t(locale, 'company.back')}
      </a>
    </div>

    <CompanyHeader
      name={companyName}
      type={data.type}
      region={data.region}
      difficulty={data.difficulty}
      duration={data.duration}
      stages={data.stages}
      tags={data.tags}
      tips={companyTips}
      questionCount={questions.length}
      locale={locale}
    />

    {grouped.length > 0 && (
      <div data-pagefind-ignore class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t(locale, 'company.questions_title')}
        </h2>
      </div>
    )}

    {grouped.map(group => (
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-3" data-pagefind-ignore>
          <span
            class="w-1.5 h-1.5 rounded-full"
            style={`background: ${getStageColor(group.stageIndex)};`}
          ></span>
          <h3 class="text-sm font-semibold" style={`color: ${getStageColor(group.stageIndex)};`}>
            {group.stageName}
          </h3>
        </div>
        <div class="flex flex-col gap-3">
          {group.questions.map(q => (
            <details
              class:list={[
                'flashcard group overflow-hidden rounded-xl border-l-4',
                'border border-gray-200 dark:border-gray-700',
                getStageBorderClass(group.stageIndex),
                'shadow-sm',
              ]}
              data-tags={q.tags.join(',')}
            >
              <summary class="cursor-pointer select-none p-4 sm:p-5 font-medium text-gray-900 dark:text-gray-100
                             hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors
                             min-h-[44px] flex items-center gap-3 list-none">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3">
                    <h3 class="flex-1 text-base leading-relaxed font-medium">{q.question}</h3>
                    <svg class:list={['w-5 h-5 transition-transform duration-200 group-open:rotate-180 shrink-0 text-gray-400']}
                         viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clip-rule="evenodd" />
                    </svg>
                  </div>
                  {q.tags.length > 0 && (
                    <div class="flex flex-wrap gap-1.5 mt-2">
                      {q.tags.map(tag => (
                        <span class="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </summary>
              <div class:list={[
                'flashcard-answer border-t p-4 sm:p-5',
                'prose prose-sm sm:prose-base max-w-none dark:prose-invert',
                'prose-pre:rounded-lg prose-pre:text-sm',
                'prose-code:before:content-none prose-code:after:content-none',
                'border-gray-200 dark:border-gray-700',
              ]}>
                <Fragment set:html={await import('../../../../lib/markdown').then(m => m.renderMarkdown(q.answer))} />
              </div>
            </details>
          ))}
        </div>
      </div>
    ))}
  </main>
</BaseLayout>
```

Note: This page inlines the flashcard markup rather than using the Flashcard component because company flashcards use stage-based border colors (via `getStageBorderClass`) instead of type-based colors. The existing Flashcard component is tightly coupled to question types. Inlining keeps it simpler than adding conditional props.

- [ ] **Step 2: Verify build succeeds**

```bash
npm run build 2>&1 | tail -10
```

Expected: Build completes with pages generated for `/ua/company/epam/` and `/en/company/epam/`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/[locale]/company/
git commit -m "feat(companies): add company detail page with stage-grouped questions"
```

---

### Task 9: AGENTS.md

**Files:**
- Create: `AGENTS.md` (project root)

- [ ] **Step 1: Create AGENTS.md**

Create `AGENTS.md` in project root:

```markdown
# AI Agent Guide

Instructions for AI agents contributing content to this project.

## Project Overview

A static Astro site for QA interview preparation. Two types of content:
1. **Questions** — flashcards grouped by tech topic (Java, Docker, etc.)
2. **Companies** — interview profiles with process details and real questions asked

## Adding a Company

### 1. Create company profile

File: `src/content/companies/{slug}.md`

```yaml
---
slug: "company-slug"
ua_name: "Назва компанії"
en_name: "Company Name"
type: "outsource"              # outsource | product | startup | agency
region: "international"        # international | ukraine | usa | eu
ua_description: "Короткий опис українською"
en_description: "Short description in English"
difficulty: "medium"           # easy | medium | hard
duration: "3 weeks"
stages:
  - ua_name: "HR скринінг"
    en_name: "HR Screening"
    duration: "30m"
  - ua_name: "Технічне інтерв'ю"
    en_name: "Technical Interview"
    duration: "1h"
tags: [java, automation, sql]
ua_tips:
  - "Порада українською"
en_tips:
  - "Tip in English"
---
```

### 2. Add interview questions

File: `src/content/company-questions/{company-slug}/{question-slug}.md`

```yaml
---
company: "company-slug"
stage: "technical-interview"   # kebab-case of stage en_name
ua_question: "Питання українською"
en_question: "Question in English"
ua_answer: |
  Відповідь в markdown форматі.
  Підтримуються блоки коду з підсвіткою синтаксису.
en_answer: |
  Answer in markdown format.
  Code blocks with syntax highlighting are supported.
tags: [tag1, tag2]
order: 1
---
```

### Stage Slug Convention

The `stage` field in questions must be the kebab-case version of the stage's `en_name`:
- "HR Screening" → `hr-screening`
- "Technical Interview" → `technical-interview`
- "Live Coding" → `live-coding`
- "Final Interview" → `final-interview`

### Validation Rules

- `company` must match an existing company slug in `src/content/companies/`
- `stage` must correspond to a stage defined in the company's `stages` array
- Both UA and EN fields are mandatory
- `tags` should have 2-4 entries, lowercase, hyphenated
- `order` determines display sequence within a stage (start from 1)
- Code examples must be identical in both languages (don't translate code)

## Adding Questions (existing sections)

See `CONTENT_CONVENTIONS.md` for the question format used in tech topic sections (Java, Docker, etc.).

## Build & Verify

```bash
npm install
npm run build    # must complete without errors
npm run preview  # check your content at http://localhost:4321
```
```

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add AGENTS.md with AI agent contribution guide"
```

---

### Task 10: Update README and CONTENT_CONVENTIONS

**Files:**
- Modify: `README.md`
- Modify: `CONTENT_CONVENTIONS.md`

- [ ] **Step 1: Update README.md**

Add the Companies section to features list. Replace the Features section:

```markdown
## Features

- **10 question sections** — QA, Automation QA, Python, Playwright, Performance Testing, Java, Docker, Kubernetes, Blockchain, SQL
- **Company interview profiles** — real interview processes, tips, and questions from candidates
- **Click-to-reveal flashcards** — smooth animation, anchor links for sharing individual questions
- **Bilingual** — Ukrainian and English with a one-click language toggle
- **Dark/light mode** — system preference detection, manual toggle, no flash on load
- **Syntax highlighting** — dual-theme code blocks via Shiki
- **Responsive** — works on mobile (320px+)
- **AI-friendly** — structured content format for AI agent contributions (see AGENTS.md)
- **No backend** — fully static, hosted on GitHub Pages
```

Update the "Adding Content" section — add after the existing question example:

```markdown
### Adding Company Profiles

Company data lives in `src/content/companies/` and questions in `src/content/company-questions/<company>/`. See [AGENTS.md](./AGENTS.md) for the full schema.
```

Update the Project Structure:

```
src/
├── components/     # Header, SectionCard, CompanyCard, CompanyHeader, Flashcard
├── content/
│   ├── questions/          # Flashcards across 10 tech sections
│   ├── companies/          # Company interview profiles
│   └── company-questions/  # Interview questions per company
├── i18n/           # UI translations, section metadata, utilities
├── layouts/        # BaseLayout
├── lib/            # Markdown renderer with Shiki, color utilities
├── pages/          # Locale-based routing ([locale]/[section]/, [locale]/company/[slug]/)
└── styles/         # Global CSS with Tailwind
```

- [ ] **Step 2: Update CONTENT_CONVENTIONS.md**

Add a note at the end of `CONTENT_CONVENTIONS.md`:

```markdown
## Company Content

For adding company interview profiles and company-specific questions, see [AGENTS.md](./AGENTS.md).
```

- [ ] **Step 3: Commit**

```bash
git add README.md CONTENT_CONVENTIONS.md
git commit -m "docs: update README and CONTENT_CONVENTIONS with companies section info"
```

---

### Task 11: Final Build Verification

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds, generates pages for all locales including `/ua/company/epam/` and `/en/company/epam/`.

- [ ] **Step 2: Verify homepage tabs work**

```bash
npm run preview &
sleep 2
curl -s http://localhost:4321/ua/ | grep 'tab-btn' | wc -l
curl -s http://localhost:4321/ua/ | grep 'panel-companies' | wc -l
```

Expected: 2 tab buttons, 1 companies panel.

- [ ] **Step 3: Verify company page renders**

```bash
curl -s http://localhost:4321/ua/company/epam/ | grep 'EPAM Systems' | wc -l
```

Expected: At least 1 match.

- [ ] **Step 4: Stop preview server and commit if any fixes were needed**

```bash
kill %1 2>/dev/null
```
