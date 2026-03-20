import { marked, type Tokens } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';

// Singleton highlighter instance (created once, reused across all renders at build time)
let highlighter: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['java', 'javascript', 'typescript', 'sql', 'bash', 'yaml', 'json', 'dockerfile'],
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

  renderer.code = function ({ text, lang }: Tokens.Code): string {
    const language = lang || 'text';
    try {
      // Use the same dual-theme approach as Astro's built-in Shiki config
      return hl.codeToHtml(text, {
        lang: language,
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
      });
    } catch {
      // Fallback for unsupported languages: render as plain preformatted text
      const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre class="shiki"><code>${escaped}</code></pre>`;
    }
  };

  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  return await marked.parse(content, { renderer });
}
