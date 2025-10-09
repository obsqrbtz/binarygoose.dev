export function buildNav(pages: Page[]) {
  const links = [
    `<a href="/index.html">Home</a>`,
    ...pages.map(p => {
      const relativeUrl = p.outDir
        .replace(/\\/g, "/")
        .replace(/^.*\/dist\//, "")
        .replace(/\.html$/, "");
      return `<a href="/${relativeUrl}">${p.title}</a>`;
    })
  ];
  return links.join(" | ");
}