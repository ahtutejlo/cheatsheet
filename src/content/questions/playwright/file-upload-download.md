---
ua_question: "Як обробляти завантаження та скачування файлів у Playwright?"
en_question: "How to handle file upload and download in Playwright?"
ua_answer: |
  Playwright надає вбудований API для роботи з завантаженням файлів на сервер (upload) та скачуванням файлів (download). Обидва сценарії не потребують сторонніх бібліотек.

  **Upload** виконується через `setInputFiles()` для стандартних `<input type="file">` або через `fileChooser` подію для кастомних кнопок завантаження.

  **Download** перехоплюється через подію `download` на об'єкті Page. Playwright автоматично зберігає файл у тимчасову директорію, і ви можете отримати його шлях або зберегти у потрібне місце.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('file upload -- standard input', async ({ page }) => {
    await page.goto('https://example.com/upload');

    // Upload single file
    await page.getByLabel('Upload file').setInputFiles('data/report.pdf');

    // Upload multiple files
    await page.getByLabel('Upload files').setInputFiles([
      'data/image1.png',
      'data/image2.png',
    ]);

    // Clear file input
    await page.getByLabel('Upload file').setInputFiles([]);
  });

  test('file upload -- custom button', async ({ page }) => {
    await page.goto('https://example.com/upload');

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByRole('button', { name: 'Choose file' }).click(),
    ]);

    await fileChooser.setFiles('data/report.pdf');
  });

  test('file download', async ({ page }) => {
    await page.goto('https://example.com/reports');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('link', { name: 'Download report' }).click(),
    ]);

    // Wait for download to complete
    const filePath = await download.path();
    expect(filePath).toBeTruthy();

    // Save to specific location
    await download.saveAs('downloads/report.pdf');

    // Verify filename
    expect(download.suggestedFilename()).toBe('report.pdf');
  });
  ```

  Для download у конфігурації можна вказати `acceptDownloads: true` (увімкнено за замовчуванням). У CI-середовищі важливо переконатись, що директорія для збереження файлів існує.
en_answer: |
  Playwright provides a built-in API for handling file uploads and downloads. Both scenarios do not require third-party libraries.

  **Upload** is performed via `setInputFiles()` for standard `<input type="file">` elements or via the `fileChooser` event for custom upload buttons.

  **Download** is intercepted through the `download` event on the Page object. Playwright automatically saves the file to a temporary directory, and you can get its path or save it to a specific location.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('file upload -- standard input', async ({ page }) => {
    await page.goto('https://example.com/upload');

    // Upload single file
    await page.getByLabel('Upload file').setInputFiles('data/report.pdf');

    // Upload multiple files
    await page.getByLabel('Upload files').setInputFiles([
      'data/image1.png',
      'data/image2.png',
    ]);

    // Clear file input
    await page.getByLabel('Upload file').setInputFiles([]);
  });

  test('file upload -- custom button', async ({ page }) => {
    await page.goto('https://example.com/upload');

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByRole('button', { name: 'Choose file' }).click(),
    ]);

    await fileChooser.setFiles('data/report.pdf');
  });

  test('file download', async ({ page }) => {
    await page.goto('https://example.com/reports');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('link', { name: 'Download report' }).click(),
    ]);

    // Wait for download to complete
    const filePath = await download.path();
    expect(filePath).toBeTruthy();

    // Save to specific location
    await download.saveAs('downloads/report.pdf');

    // Verify filename
    expect(download.suggestedFilename()).toBe('report.pdf');
  });
  ```

  For downloads, the configuration can specify `acceptDownloads: true` (enabled by default). In CI environments, it is important to ensure the save directory exists.
section: "playwright"
order: 12
tags:
  - advanced
  - browser
type: "basic"
---
