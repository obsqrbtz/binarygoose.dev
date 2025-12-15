import fs from 'fs';
import path from 'path';
import { buildPosts, renderPosts } from './builders/post';
import { buildPages, renderPages } from './builders/page';
import { renderHome } from './builders/home';
import { buildNav } from './builders/common';
import { buildProjects, renderProjectIndex, renderProjects } from './builders/project';

import config from "./config.js";

async function main() {
	await fs.promises.rm(config.outDir, { recursive: true, force: true });
	await fs.promises.mkdir(config.outDir, { recursive: true });

	const assetsDir = path.join(config.outDir, 'assets');
	const fontSrcDir = path.join('src', 'assets', 'fonts');
	const fontDestDir = path.join(assetsDir, 'fonts');
	const cssSrcDir = path.join('src', 'assets', 'css');
	const cssDestDir = path.join(assetsDir, 'css');

	await fs.promises.mkdir(assetsDir, { recursive: true });

	try {
		await fs.promises.mkdir(cssDestDir, { recursive: true });
		const cssFiles = await fs.promises.readdir(cssSrcDir);

		for (const cssFile of cssFiles) {
			await fs.promises.copyFile(
				path.join(cssSrcDir, cssFile),
				path.join(cssDestDir, cssFile)
			);
		}
	}
	catch (error) {
		console.log('Could not copy css');
	}

	try {
		await fs.promises.copyFile(
			path.join('src', 'assets', 'favicon.png'),
			path.join(assetsDir, 'favicon.png')
		);
	}
	catch (error) {
		console.log('Favicon is missing.');
	}

	try {
		await fs.promises.access(fontSrcDir);
		await fs.promises.mkdir(fontDestDir, { recursive: true });
		const fontFiles = await fs.promises.readdir(fontSrcDir);

		for (const fontFile of fontFiles) {
			await fs.promises.copyFile(
				path.join(fontSrcDir, fontFile),
				path.join(fontDestDir, fontFile)
			);
		}
	} catch (error) {
		console.log('Fonts dir is missing');
	}

	const pages = await buildPages(config.pageDir, config.outDir)
	const projects = await buildProjects(config.projectDir, config.outDir);
	const pageTemplate = await fs.promises.readFile(path.join(config.templateDir, "page.html"), "utf-8");
	const projectTemplate = await fs.promises.readFile(path.join(config.templateDir, "project.html"), "utf-8");
	const projectIndexTemplate = await fs.promises.readFile(path.join(config.templateDir, "project-index.html"), "utf-8");
	const navHtml = buildNav(pages, projects.length > 0);
	const headTemplate = await fs.promises.readFile(path.join(config.templateDir, "head.html"), "utf-8");

	await renderPages(pages, pageTemplate, navHtml, headTemplate);
	await renderProjects(projects, projectTemplate, navHtml, headTemplate);
	await renderProjectIndex(projects, projectIndexTemplate, navHtml, headTemplate, config.outDir);

	const posts = await buildPosts(config.postDir, config.outDir)
	const postTemplate = await fs.promises.readFile(path.join(config.templateDir, "post.html"), "utf8");

	await renderPosts(posts, postTemplate, navHtml, headTemplate);

	renderHome(posts, config.outDir, navHtml, headTemplate);

	console.log("Done");
}

main().catch(console.error);
