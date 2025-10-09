import fs from 'fs';
import path from 'path';
import { buildPosts, renderPosts } from './builders/post';
import { buildPages, renderPages } from './builders/page';
import { renderHome } from './builders/home';
import { buildNav } from './builders/navigation';

import config from "./config.js";

async function main() {
  await fs.promises.rm(config.outDir, { recursive: true, force: true });
  await fs.promises.mkdir(config.outDir, { recursive: true });

  const pages = await buildPages(config.pageDir, config.outDir)
  const pageTemplate = await fs.promises.readFile(path.join(config.templateDir, "page.html"), "utf-8");
  const navHtml = buildNav(pages);

  await renderPages(pages, pageTemplate, navHtml);

  const posts = await buildPosts(config.postDir, config.outDir)
  const postTemplate = await fs.promises.readFile(path.join(config.templateDir, "post.html"), "utf8");
  
  await renderPosts(posts, postTemplate, navHtml);

  renderHome(posts, config.outDir, navHtml);

  console.log("Done");
}

main().catch(console.error);