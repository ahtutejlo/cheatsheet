import { marked, type Tokens } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';

// Singleton highlighter instance (created once, reused across all renders at build time)
let highlighter: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['java', 'javascript', 'typescript', 'sql', 'bash', 'yaml', 'json', 'dockerfile', 'solidity', 'python'],
    });
  }
  return highlighter;
}

/**
 * Renders a Markdown string to HTML with Shiki syntax-highlighted code blocks.
 * Used for frontmatter answer fields (ua_answer, en_answer) that cannot use
 * Astro's native render() API.
 *
 * Shiki produces dual-theme output (github-light / github-dark) using CSS variables,
 * matching the astro.config.mjs shikiConfig. The global.css already has dark mode
 * rules for --shiki-dark / --shiki-dark-bg.
 */
export async function renderMarkdown(content: string): Promise<string> {
  const hl = await getHighlighter();

  const renderer = new marked.Renderer();

  // --- Callout patterns ---
  const calloutPatterns: { pattern: RegExp; type: string; icon: string; label: string }[] = [
    { pattern: /^<p><strong>Trap:<\/strong>/, type: 'trap', icon: '🪤', label: 'Trap' },
    { pattern: /^<p><strong>Пастка:<\/strong>/, type: 'trap', icon: '🪤', label: 'Пастка' },
    { pattern: /^<p><strong>Note:<\/strong>/, type: 'note', icon: 'ℹ️', label: 'Note' },
    { pattern: /^<p><strong>Примітка:<\/strong>/, type: 'note', icon: 'ℹ️', label: 'Примітка' },
    { pattern: /^<p><strong>Key:<\/strong>/, type: 'key', icon: '💡', label: 'Key' },
    { pattern: /^<p><strong>Ключове:<\/strong>/, type: 'key', icon: '💡', label: 'Ключове' },
  ];

  renderer.blockquote = function ({ tokens }: Tokens.Blockquote): string {
    const html = this.parser.parse(tokens);
    for (const callout of calloutPatterns) {
      if (callout.pattern.test(html)) {
        const content = html.replace(callout.pattern, '<p>');
        return `<div class="callout callout-${callout.type}">
        <span class="callout-icon">${callout.icon}</span>
        <div>
          <div class="callout-label">${callout.label}</div>
          ${content}
        </div>
      </div>`;
      }
    }
    return `<blockquote>${html}</blockquote>`;
  };

  renderer.code = function ({ text, lang }: Tokens.Code): string {
    const language = lang || 'text';
    let codeHtml: string;
    try {
      codeHtml = hl.codeToHtml(text, {
        lang: language,
        themes: { light: 'github-light', dark: 'github-dark' },
      });
    } catch {
      const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      codeHtml = `<pre class="shiki"><code>${escaped}</code></pre>`;
    }

    if (lang) {
      return `<div class="code-block-wrapper">
      <div class="code-block-header"><span class="code-block-lang">📄 ${language}</span></div>
      ${codeHtml}
    </div>`;
    }
    return codeHtml;
  };

  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  return await marked.parse(content, { renderer });
}
