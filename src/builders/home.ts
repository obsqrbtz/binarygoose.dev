import fs from 'fs'
import path from 'path'
import config from '../config'

export async function renderHome(posts: Post[], outDir: string, navHtml: string) {
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

