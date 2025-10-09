import fs from 'fs'
import path from 'path'

import { loadPost } from '../utils/markdown';
import { writeHtml } from '../utils/file';

export async function buildPosts(sourceDir: string, outDir: string){
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

export async function renderPosts(posts: Post[], template: string, navHtml: string) {
  for (const post of posts){
    const html = template
        .replaceAll("{{title}}", post.title)
        .replace("{{content}}", post.content)
        .replace("{{publishDate}}", post.publishDate.toDateString())
        .replace("{{tags}}", post.tags.join(", "))
        .replace("{{nav}}", navHtml);
    await writeHtml(post.outDir, html)
  }
}