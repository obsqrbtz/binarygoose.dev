import fs from "fs";
import path from "path";

import { loadPage } from "../utils/markdown";
import { writeHtml } from "../utils/file";
import { createStyledTitle } from "../utils/helpers";
import { buildHead } from "./common";

interface ProjectNavConfig {
	title?: string;
	items: ProjectNavItem[];
}

export async function buildProjects(sourceDir: string, outDir: string) {
	const entries = await fs.promises.readdir(sourceDir, { withFileTypes: true });
	const projects: Project[] = [];

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		const slug = entry.name;
		const projectDir = path.join(sourceDir, slug);
		const projectOutDir = path.join(outDir, "projects", slug);

		const navConfig = await loadProjectNav(projectDir);
		const docs = await loadProjectDocs(projectDir, projectOutDir);
		const navItems = navConfig.items ?? [];

		validateNavTargets(navItems, docs, slug);

		const entryPath = findFirstNavPath(navItems) ?? docs[0]?.relativePath ?? "overview";
		const projectTitle = navConfig.title ?? findOverviewTitle(docs) ?? slug;

		projects.push({
			slug,
			title: projectTitle,
			entryPath,
			navItems,
			docs
		});
	}

	return projects;
}

export async function renderProjects(projects: Project[], template: string, navHtml: string, headTemplate: string) {
	for (const project of projects) {
		for (const doc of project.docs) {
			const headHtml = buildHead(`${project.title} - ${doc.title}`, headTemplate);
			const termTitle = createStyledTitle(doc.title);
			const sidebarHtml = buildProjectSidebar(project, doc.relativePath);

			const html = template
				.replace("{{head}}", headHtml)
				.replaceAll("{{title}}", doc.title)
				.replace("{{project_title}}", project.title)
				.replace("{{project_nav}}", sidebarHtml)
				.replace("{{project_slug}}", project.slug)
				.replace("{{term_title}}", termTitle)
				.replace("{{content}}", doc.content)
				.replace("{{nav}}", navHtml);

			await writeHtml(doc.outDir, html);
		}
	}
}

export async function renderProjectIndex(projects: Project[], template: string, navHtml: string, headTemplate: string, outDir: string) {
	const projectItems = projects.map(project => {
		const entryHref = `/projects/${project.slug}/${project.entryPath}/`;
		const overviewDoc = project.docs.find(doc => doc.relativePath === 'overview');
		const description = extractDescription(overviewDoc?.content ?? '');
		
		return `<div class="project-card">
			<h2><a href="${entryHref}">${project.title}</a></h2>
			<p class="project-description">${description}</p>
			<a href="${entryHref}" class="project-link">View project →</a>
		</div>`;
	}).join("\n");

	const headHtml = buildHead("Projects", headTemplate);

	const html = template
		.replace("{{head}}", headHtml)
		.replaceAll("{{title}}", "Projects")
		.replace("{{projects}}", projectItems)
		.replace("{{nav}}", navHtml);

	await writeHtml(path.join(outDir, "projects"), html);
}

function extractDescription(content: string): string {
	const paragraphMatch = content.match(/<p>(.*?)<\/p>/);
	if (paragraphMatch && paragraphMatch[1]) {
		return paragraphMatch[1];
	}
	return '';
}

async function loadProjectDocs(projectDir: string, outDir: string) {
	const markdownFiles = await collectMarkdownFiles(projectDir);
	const docs: ProjectDoc[] = [];

	for (const filePath of markdownFiles) {
		const relativePath = normalizeRelativePath(path.relative(projectDir, filePath));
		const docOutDir = path.join(outDir, relativePath);
		const page = await loadPage(filePath, docOutDir);

		docs.push({
			title: page.title,
			content: page.content,
			outDir: docOutDir,
			relativePath
		});
	}

	return docs;
}

async function collectMarkdownFiles(dir: string, files: string[] = []) {
	const entries = await fs.promises.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			await collectMarkdownFiles(fullPath, files);
			continue;
		}

		if (entry.isFile() && entry.name.endsWith(".md")) {
			files.push(fullPath);
		}
	}

	return files;
}

async function loadProjectNav(projectDir: string) {
	const navPath = path.join(projectDir, "nav.json");
	try {
		const raw = await fs.promises.readFile(navPath, "utf-8");
		const parsed = JSON.parse(raw) as ProjectNavConfig;
		if (!Array.isArray(parsed.items)) {
			throw new Error("nav.json must contain an items array");
		}
		return parsed;
	} catch (error) {
		const reason = error instanceof Error ? error.message : "Unknown error";
		throw new Error(`Failed to load ${navPath}: ${reason}`);
	}
}

function findOverviewTitle(docs: ProjectDoc[]) {
	const overview = docs.find(doc => doc.relativePath === "overview");
	return overview?.title;
}

function findFirstNavPath(items: ProjectNavItem[]): string | undefined {
	for (const item of items) {
		if (item.path) return normalizeRelativePath(item.path);
		const childPath = item.children ? findFirstNavPath(item.children) : undefined;
		if (childPath) return childPath;
	}
	return undefined;
}

function normalizeRelativePath(relativePath: string) {
	return relativePath.replace(/\\/g, "/").replace(/\.md$/i, "");
}

function buildProjectSidebar(project: Project, activePath: string) {
	const itemsHtml = renderNavItems(project.navItems, project.slug, activePath);
	return `<div class="doc-nav"><div class="doc-nav-title">${escapeHtml(project.title)}</div><ul>${itemsHtml}</ul></div>`;
}

function renderNavItems(items: ProjectNavItem[], slug: string, activePath: string): string {
	return items.map(item => {
		const normalizedPath = item.path ? normalizeRelativePath(item.path) : undefined;
		const isActive = normalizedPath === activePath;
		const hasActiveChild = item.children ? item.children.some(child => isNavItemActive(child, activePath)) : false;
		const classes = [];

		if (isActive) classes.push("is-active");
		else if (hasActiveChild) classes.push("is-ancestor");

		const classAttr = classes.length ? ` class="${classes.join(" ")}"` : "";
		const href = normalizedPath ? `/projects/${slug}/${normalizedPath}/` : undefined;
		const label = escapeHtml(item.label);

		const link = href
			? `<a href="${href}">${label}</a>`
			: `<span class="doc-nav-label">${label}</span>`;

		const childrenHtml = item.children?.length
			? `<ul>${renderNavItems(item.children, slug, activePath)}</ul>`
			: "";

		return `<li${classAttr}>${link}${childrenHtml}</li>`;
	}).join("");
}

function isNavItemActive(item: ProjectNavItem, activePath: string): boolean {
	const normalizedPath = item.path ? normalizeRelativePath(item.path) : undefined;
	if (normalizedPath === activePath) return true;
	return item.children ? item.children.some(child => isNavItemActive(child, activePath)) : false;
}

function validateNavTargets(navItems: ProjectNavItem[], docs: ProjectDoc[], slug: string) {
	const docPaths = new Set(docs.map(doc => doc.relativePath));
	for (const item of navItems) {
		if (item.path) {
			const normalized = normalizeRelativePath(item.path);
			if (!docPaths.has(normalized)) {
				console.warn(`Nav entry "${item.label}" in project "${slug}" points to missing document "${normalized}".`);
			}
		}

		if (item.children) {
			validateNavTargets(item.children, docs, slug);
		}
	}
}

function escapeHtml(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

