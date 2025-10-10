import fs from 'fs';
import { marked } from 'marked';
import hljs from "highlight.js";
import sharp from "sharp"
import path from 'path';
import { downloadImage } from './helpers';

const renderer = new marked.Renderer();

renderer.code = function ({ text, lang }: { text: string, lang?: string, escaped?: boolean }) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(text, { language: lang }).value;
      return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
    } catch (err) {
      console.error('Syntax highlighting failed for language:', lang, err);
    }
  }

  try {
    const highlighted = hljs.highlightAuto(text).value;
    return `<pre><code class="hljs">${highlighted}</code></pre>`;
  } catch (err) {
    console.error('Syntax highlighting failed:', err);
    return `<pre><code>${text}</code></pre>`;
  }
};

marked.setOptions({
  renderer: renderer
} as any);

export async function loadPost(filePath: string, outPath: string) {
  const { front, body } = await loadMardown(filePath);
  let bodyHtml = body;
  bodyHtml = await optimizeImages(body, outPath);
  const html = await marked.parse(bodyHtml);
  const post: Post = {
    title: front.title ?? "Untitled",
    excerpt: front.excerpt ?? "",
    publishDate: front.publishDate ? new Date(front.publishDate) : new Date(),
    tags: front.tags ?? [],
    content: html,
    outDir: outPath
  }
  return post;
}

export async function loadPage(filePath: string, outPath: string) {
  const { front, body } = await loadMardown(filePath);
  const html = await marked.parse(body);
  const page: Page = {
    title: front.title ?? "Untitled",
    content: html,
    outDir: outPath
  }
  return page;
}

async function loadMardown(filePath: string) {
  const raw = await fs.promises.readFile(filePath, "utf-8")
  const { front, body } = parseFrontMatter(raw);
  return { front, body };
}

function parseFrontMatter(text: string) {
  if (!text.startsWith("---")) return { front: {}, body: text };

  const end = text.indexOf("---", 3);
  if (end === -1) return { front: {}, body: text };

  const frontRaw = text.slice(3, end).trim();
  const body = text.slice(end + 3).trim();
  const front: Record<string, any> = {};

  const lines = frontRaw.split("\n");

  let currentKey: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // array item
    if (trimmed.startsWith("- ") && currentKey) {
      if (!Array.isArray(front[currentKey])) front[currentKey] = [];
      front[currentKey].push(trimmed.slice(2).trim());
      continue;
    }

    const [key, ...rest] = line.split(":");
    if (key) {
      const value = rest.join(":").trim();
      front[key.trim()] = value || null;
      currentKey = key.trim();
    } else {
      currentKey = null;
    }
  }

  return { front, body };
}

export async function optimizeImages(markdown: string, postDistDir: string) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const matches = Array.from(markdown.matchAll(imageRegex));

  let newMarkdown = markdown;
  for (const match of matches) {
    const [fullMatch, alt, url] = match;
    const imgDir = path.join(postDistDir, "images");
    await fs.promises.mkdir(imgDir, { recursive: true });

    const fileName = path.basename(new URL(url as string).pathname);
    const localPath = path.join(imgDir, fileName);

    if (!fs.existsSync(localPath)) {
      await downloadImage(url as string, localPath);
    }

    const resizedPath = path.join(imgDir, `${fileName}-670.webp`);

    await sharp(localPath)
      .resize({ width: 670 })
      .webp({ quality: 80 })
      .toFile(resizedPath);

    const hdpiPath = path.join(imgDir, `${fileName}-1340.webp`);
    await sharp(localPath)
      .resize({ width: 1340 })
      .webp({ quality: 80 })
      .toFile(hdpiPath);

    const postName = path.basename(postDistDir);
    const imageUrlBase = `/posts/${postName}/images`;

    const pictureHtml = `
<picture>
  <source srcset="${imageUrlBase}/${fileName}-670.webp" type="image/webp" media="(max-width: 670px)">
  <source srcset="${imageUrlBase}/${fileName}-1340.webp" type="image/webp">
  <img src="${imageUrlBase}/${fileName}-670.webp" alt="${alt}" loading="lazy" decoding="async" style="max-width:100%;height:auto;">
</picture>
`;
    newMarkdown = newMarkdown.replace(fullMatch, pictureHtml);
  }
  return newMarkdown;
}