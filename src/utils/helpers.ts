import fs from "fs"

export function createStyledTitle(title: string){
        return title
        .replace(/[^\w\s-]/g, "") // remove weird symbols like slashes
        .replace(/\s+/g, "-")      // replace spaces with dashes
        .toLowerCase();
}

export async function downloadImage(url: string, destPath: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}`);
  const buffer = await res.arrayBuffer();
  await fs.promises.writeFile(destPath, Buffer.from(buffer));
}