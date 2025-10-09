interface Post{
    title: string;
    excerpt: string;
    publishDate: Date;
    tags: string[];
    content: string;
    outDir: string;
};

interface Page{
    title: string;
    content: string;
    outDir: string;
}