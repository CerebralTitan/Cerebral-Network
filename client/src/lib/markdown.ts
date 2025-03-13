import { marked } from "marked";

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
  headerPrefix: "section-",
});

// Custom renderer to handle internal links and enhanced styling
const renderer = new marked.Renderer();

// Handle Obsidian-style wiki links [[note-name]]
renderer.link = (href, title, text) => {
  if (href?.startsWith("[[") && href.endsWith("]]")) {
    const slug = href.slice(2, -2).toLowerCase().replace(/\s+/g, "-");
    return `<a href="/posts/${slug}" class="internal-link font-mono text-purple-500 hover:text-pink-500 border-b border-dashed border-purple-500 hover:border-pink-500 transition-colors">${text || href.slice(2, -2)}</a>`;
  }
  return `<a href="${href}" title="${title || ''}" class="text-purple-500 hover:text-pink-500 transition-colors">${text}</a>`;
};

// Enhanced code block styling with copy button
renderer.code = (code, language) => {
  return `<div class="relative group">
    <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto font-mono text-sm">
      <code class="language-${language || 'text'}">${code}</code>
    </pre>
    <button 
      class="absolute top-2 right-2 px-2 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
      onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, '\\`')}\`)"
    >
      Copy
    </button>
  </div>`;
};

// Enhanced blockquote styling
renderer.blockquote = (quote) => {
  return `<blockquote class="border-l-4 border-purple-500 pl-4 italic my-4 text-gray-600 dark:text-gray-300">${quote}</blockquote>`;
};

// Custom heading styling
renderer.heading = (text, level) => {
  const classes = [
    "font-mono font-bold tracking-tight",
    level === 1 ? "text-4xl mb-6" : "",
    level === 2 ? "text-3xl mb-4" : "",
    level === 3 ? "text-2xl mb-3" : "",
    level === 4 ? "text-xl mb-2" : "",
  ].filter(Boolean).join(" ");

  const id = text.toLowerCase().replace(/[^\w]+/g, "-");
  return `<h${level} id="${id}" class="${classes}">
    <a href="#${id}" class="no-underline">${text}</a>
  </h${level}>`;
};

marked.use({ renderer });

export function renderMarkdown(content: string): string {
  return marked(content);
}

// Extract all wiki-style links from content
export function extractInternalLinks(content: string): string[] {
  const links: string[] = [];
  const regex = /\[\[(.*?)\]\]/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    links.push(match[1].toLowerCase().replace(/\s+/g, "-"));
  }

  return links;
}