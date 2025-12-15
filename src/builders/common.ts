export function buildNav(pages: Page[], includeProjects = false) {
	const links: string[] = [`<a href="/index.html">Home</a>`];

	if (includeProjects) {
		links.push(`<a href="/projects/index.html">Projects</a>`);
	}

	links.push(
		...pages.map(p => {
			const relativeUrl = p.outDir
				.replace(/\\/g, "/")
				.replace(/^.*\/dist\//, "")
				.replace(/\.html$/, "");
			return `<a href="/${relativeUrl}">${p.title}</a>`;
		})
	);

	return links.join("");
}

export function buildHead(title: string, template: string) {
	return template
		.replaceAll("{{title}}", title)
}
