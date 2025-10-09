import path from 'path';

class Config{
    rootDir = process.cwd();
    srcDir = path.join(this.rootDir, "src");
    contentDir = path.join(this.rootDir, "content");
    outDir = path.join(this.rootDir, "dist");

    postDir = path.join(this.contentDir, "posts");
    pageDir = path.join(this.contentDir, "pages");
    templateDir = path.join(this.srcDir, "templates");
}

const config = new Config();

export default config;