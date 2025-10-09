import fs from 'fs'
import path from 'path'

export async function writeHtml(fileDir: string, html: string) {
    await fs.promises.mkdir(fileDir, { recursive: true });
    await fs.promises.writeFile(path.join(fileDir, "index.html"), html);
}