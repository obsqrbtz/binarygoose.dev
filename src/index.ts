import fs from 'fs';
import path from 'path';
import {loadPage, loadPost } from './markdown'

import config from "./config.js";

async function main() {
  await fs.promises.rm(config.outDir, { recursive: true, force: true });
  await fs.promises.mkdir(config.outDir, { recursive: true });

  const pages = await createPages(config.pageDir, config.outDir)
  const pageTemplate = await fs.promises.readFile(path.join(config.templateDir, "page.html"), "utf-8");
  const navHtml = buildNav(pages);

  for (const page of pages){
    const html = pageTemplate
        .replaceAll("{{title}}", page.title)
        .replace("{{content}}", page.content)
        .replace("{{nav}}", navHtml);
    await writeHtml(page.outDir, html)
  }

  const posts = await createPosts(config.postDir, config.outDir)
  const postTemplate = await fs.promises.readFile(path.join(config.templateDir, "post.html"), "utf8");

  for (const post of posts){
    const html = postTemplate
        .replaceAll("{{title}}", post.title)
        .replace("{{content}}", post.content)
        .replace("{{publishDate}}", post.publishDate.toDateString())
        .replace("{{tags}}", post.tags.join(", "))
        .replace("{{nav}}", navHtml);
    await writeHtml(post.outDir, html)
  }

  generateIndex(posts, config.outDir, navHtml);

  console.log("Done");
}

async function createPosts(sourceDir: string, outDir: string){
    const files = await fs.promises.readdir(sourceDir);
    const posts: Post[] = [];
    for (const file of files){
        if (!file.endsWith(".md")) 
            continue;
        const postPath = path.join(outDir, "posts", file.replace(/\.md$/, ""));
        const post = await loadPost(path.join(sourceDir, file), postPath)
        posts.push(post);
    }
    return posts;
}

async function createPages(sourceDir: string, outDir: string){
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

async function writeHtml(fileDir: string, html: string) {
    await fs.promises.mkdir(fileDir, { recursive: true });
    await fs.promises.writeFile(path.join(fileDir, "index.html"), html);
}

async function generateIndex(posts: Post[], outDir: string, navHtml: string) {
    const template = await fs.promises.readFile(path.join(config.templateDir, "index.html"), "utf-8");

    const postsList = posts.map(p => {
        const relativePath = path.relative(outDir, p.outDir).replace(/\\/g, "/");
        return `<li><a href="${relativePath}">${p.title}</a> (${p.publishDate.toDateString()})</li>`;
    }).join("\n");

    const html = template
        .replaceAll("{{title}}", "binarygoose.dev")
        .replace("{{posts}}", postsList)
        .replace("{{nav}}", navHtml);

    await fs.promises.writeFile(path.join(outDir, "index.html"), html);
}

function buildNav(pages: Page[]) {
  const links = [
    `<a href="/index.html">Home</a>`,
    ...pages.map(p => {
      const relativeUrl = p.outDir
        .replace(/\\/g, "/")
        .replace(/^.*\/dist\//, "")
        .replace(/\.html$/, "");
      return `<a href="/${relativeUrl}">${p.title}</a>`;
    })
  ];
  return links.join(" | ");
}

main().catch(console.error);