import fs from 'fs'
import path from 'path'

import { loadPage } from '../utils/markdown';
import { writeHtml } from '../utils/file';
import { createStyledTitle } from '../utils/helpers';

export async function buildPages(sourceDir: string, outDir: string){
    const files = await fs.promises.readdir(sourceDir);
    const pages: Page[] = []
    for (const file of files){
        if (!file.endsWith(".md")) 
            continue;
        const pagePath = path.join(outDir, "pages", file.replace(/\.md$/, ""));
        const page = await loadPage(path.join(sourceDir, file), pagePath)
        pages.push(page);
    }
    return pages;
}

export async function renderPages(pages: Page[], template: string, navHtml: string) {
  for (const page of pages){
    const html = template
        .replaceAll("{{title}}", page.title)
        .replace("{{term_title}}", createStyledTitle(page.title))
        .replace("{{content}}", page.content)
        .replace("{{nav}}", navHtml);
    await writeHtml(page.outDir, html)
  }
}