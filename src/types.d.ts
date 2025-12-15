interface Post {
	title: string;
	excerpt: string;
	publishDate: Date;
	tags: string[];
	content: string;
	size: number
	outDir: string;
};

interface Page {
	title: string;
	content: string;
	outDir: string;
}

interface ProjectNavItem {
	label: string;
	path?: string;
	children?: ProjectNavItem[];
}

interface ProjectDoc {
	title: string;
	content: string;
	outDir: string;
	relativePath: string;
}

interface Project {
	slug: string;
	title: string;
	entryPath: string;
	navItems: ProjectNavItem[];
	docs: ProjectDoc[];
}