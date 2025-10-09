import fs from 'fs';
import { marked } from 'marked';

export async function loadPost(filePath: string, outPath: string){
    const {front, body } = await loadMardown(filePath);
    const html = await marked.parse(body);
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

export async function loadPage(filePath: string, outPath: string){
    const {front, body } = await loadMardown(filePath);
    const html = await marked.parse(body);
    const page: Page = {
        title: front.title ?? "Untitled",
        content: html,
        outDir: outPath
    }
    return page;
}

async function loadMardown(filePath: string){
    const raw = await fs.promises.readFile(filePath, "utf-8")
    const {front, body } = parseFrontMatter(raw);
    return {front, body};
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