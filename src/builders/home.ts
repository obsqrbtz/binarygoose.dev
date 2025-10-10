import fs from 'fs'
import path from 'path'
import config from '../config'
import { createStyledTitle } from '../utils/helpers';

export async function renderHome(posts: Post[], outDir: string, navHtml: string) {
    const template = await fs.promises.readFile(path.join(config.templateDir, "index.html"), "utf-8");

    const postsList = posts.map(p => {
        const relativePath = path.relative(outDir, p.outDir).replace(/\\/g, "/");
        const fileSize = (Math.random() * (6 - 1) + 1).toFixed(1) + "k";
        const date = p.publishDate.toDateString().substring(4);
        const postTitle = createStyledTitle(p.title)

        return `<li><a href="${relativePath}"><span class="perms">.rw-r--r--</span> ${fileSize} <span class="user">user</span> <span class="date">${date}</span> <span class="filename">${postTitle}.md</span></a></li>`;
    }).join("\n");

    const html = template
        .replaceAll("{{title}}", "binarygoose.dev")
        .replace("{{posts}}", postsList)
        .replace("{{nav}}", navHtml);

    await fs.promises.writeFile(path.join(outDir, "index.html"), html);
}

