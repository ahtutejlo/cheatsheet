---
ua_question: "Як працює компонентне тестування у Playwright CT?"
en_question: "How does component testing work in Playwright CT?"
ua_answer: |
  **Playwright Component Testing (CT)** дозволяє тестувати окремі UI-компоненти React, Vue, Svelte та Solid безпосередньо у реальному браузері, без потреби запускати повний додаток.

  На відміну від jsdom-based рішень (Jest + Testing Library), Playwright CT рендерить компоненти у реальному браузері. Це дає доступ до реального CSS, browser API, viewport та всіх можливостей Playwright (network mocking, screenshots, trace).

  ```typescript
  // playwright-ct.config.ts
  import { defineConfig, devices } from '@playwright/experimental-ct-react';

  export default defineConfig({
    testDir: './tests/components',
    use: {
      ...devices['Desktop Chrome'],
    },
  });
  ```

  ```typescript
  // tests/components/Button.spec.tsx
  import { test, expect } from '@playwright/experimental-ct-react';
  import { Button } from '../../src/components/Button';

  test('renders button with text', async ({ mount }) => {
    const component = await mount(<Button label="Click me" />);

    await expect(component).toContainText('Click me');
    await expect(component).toBeVisible();
  });

  test('handles click event', async ({ mount }) => {
    let clicked = false;
    const component = await mount(
      <Button label="Submit" onClick={() => (clicked = true)} />
    );

    await component.click();
    expect(clicked).toBe(true);
  });

  test('disabled state', async ({ mount }) => {
    const component = await mount(<Button label="Save" disabled />);

    await expect(component).toBeDisabled();
    await expect(component).toHaveCSS('opacity', '0.5');
  });

  test('component with props update', async ({ mount }) => {
    const component = await mount(<Button label="Initial" />);
    await expect(component).toContainText('Initial');

    // Update props
    await component.update(<Button label="Updated" />);
    await expect(component).toContainText('Updated');
  });

  test('visual regression of component', async ({ mount }) => {
    const component = await mount(<Button label="Styled" variant="primary" />);

    await expect(component).toHaveScreenshot('primary-button.png');
  });
  ```

  Playwright CT найкорисніший для тестування складних інтерактивних компонентів (форми, таблиці з сортуванням, дропдауни), де jsdom не може точно відтворити поведінку браузера. Для простих компонентів Testing Library залишається швидшою альтернативою.
en_answer: |
  **Playwright Component Testing (CT)** allows testing individual UI components of React, Vue, Svelte, and Solid directly in a real browser, without needing to run the full application.

  Unlike jsdom-based solutions (Jest + Testing Library), Playwright CT renders components in a real browser. This provides access to real CSS, browser APIs, viewport, and all Playwright capabilities (network mocking, screenshots, trace).

  ```typescript
  // playwright-ct.config.ts
  import { defineConfig, devices } from '@playwright/experimental-ct-react';

  export default defineConfig({
    testDir: './tests/components',
    use: {
      ...devices['Desktop Chrome'],
    },
  });
  ```

  ```typescript
  // tests/components/Button.spec.tsx
  import { test, expect } from '@playwright/experimental-ct-react';
  import { Button } from '../../src/components/Button';

  test('renders button with text', async ({ mount }) => {
    const component = await mount(<Button label="Click me" />);

    await expect(component).toContainText('Click me');
    await expect(component).toBeVisible();
  });

  test('handles click event', async ({ mount }) => {
    let clicked = false;
    const component = await mount(
      <Button label="Submit" onClick={() => (clicked = true)} />
    );

    await component.click();
    expect(clicked).toBe(true);
  });

  test('disabled state', async ({ mount }) => {
    const component = await mount(<Button label="Save" disabled />);

    await expect(component).toBeDisabled();
    await expect(component).toHaveCSS('opacity', '0.5');
  });

  test('component with props update', async ({ mount }) => {
    const component = await mount(<Button label="Initial" />);
    await expect(component).toContainText('Initial');

    // Update props
    await component.update(<Button label="Updated" />);
    await expect(component).toContainText('Updated');
  });

  test('visual regression of component', async ({ mount }) => {
    const component = await mount(<Button label="Styled" variant="primary" />);

    await expect(component).toHaveScreenshot('primary-button.png');
  });
  ```

  Playwright CT is most useful for testing complex interactive components (forms, tables with sorting, dropdowns), where jsdom cannot accurately reproduce browser behavior. For simple components, Testing Library remains a faster alternative.
section: "playwright"
order: 29
tags:
  - component-testing
  - frameworks
type: "basic"
---
