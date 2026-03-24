# Interview Cheatsheet

A static flashcard site for technical interview preparation. Browse bilingual questions across multiple topics, click to reveal answers with syntax-highlighted code examples.

**Live:** [ahtutejlo.github.io/cheatsheet](https://ahtutejlo.github.io/cheatsheet/)

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

## Tech Stack

- [Astro 6](https://astro.build/) — static site generator
- [Tailwind CSS 4](https://tailwindcss.com/) — styling
- [Shiki](https://shiki.style/) — syntax highlighting
- [GitHub Actions](https://github.com/features/actions) — CI/CD

## Getting Started

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build → dist/
npm run preview    # preview production build
```

## Adding Content

Questions live in `src/content/questions/<section>/`. Each file is a single question with both languages:

```markdown
---
ua_question: "Що таке тестування?"
en_question: "What is testing?"
ua_answer: "Тестування — це процес..."
en_answer: "Testing is the process..."
section: "qa"
order: 1
tags: ["basics"]
---
```

Push to `main` and the site rebuilds automatically.

### Adding Company Profiles

Company data lives in `src/content/companies/` and questions in `src/content/company-questions/<company>/`. See [AGENTS.md](./AGENTS.md) for the full schema.

## Project Structure

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

## License

MIT
