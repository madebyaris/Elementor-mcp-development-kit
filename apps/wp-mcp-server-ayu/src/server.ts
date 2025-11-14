import 'dotenv/config';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
	buildCardGridSection,
	buildFeatureListSection,
	buildHeroTextImageSection,
	buildTestimonialStrip,
} from './elementor-presets.js';

type FetchParams = {
	path: string;
	method?: 'GET' | 'POST' | 'DELETE';
	body?: unknown;
	query?: Record<string, string | number | undefined>;
};

const WORDPRESS_URL = process.env.WORDPRESS_URL ?? 'http://localhost:8080';
const AYU_TOKEN = process.env.AYU_TOKEN ?? '';

if (!AYU_TOKEN) {
	console.warn('[ayu-mcp-server] Warning: AYU_TOKEN not set. Some tools may not work.');
}

async function ayuRequest<T>({ path, method = 'GET', body, query }: FetchParams): Promise<T> {
	const url = new URL(path, WORDPRESS_URL);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined) continue;
			url.searchParams.set(key, String(value));
		}
	}

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (AYU_TOKEN) {
		headers['Authorization'] = `Bearer ${AYU_TOKEN}`;
	}

	const response = await fetch(url, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(`AYU API error (${response.status}): ${errorBody}`);
	}

	return response.json() as Promise<T>;
}

const server = new McpServer({
	name: 'ayu-ai-elementor',
	version: '0.1.0',
});

// ===== POSTS TOOLS =====

const listPostsInputSchema = z.object({
	postType: z.enum(['post', 'page']).default('post'),
	perPage: z.number().int().min(1).max(100).default(10),
	page: z.number().int().min(1).default(1),
	search: z.string().min(1).optional(),
	status: z.enum(['publish', 'draft', 'future', 'pending', 'private']).optional(),
});

server.registerTool(
	'wp.listPosts',
	{
		description: 'List WordPress posts or pages with optional filters',
		inputSchema: listPostsInputSchema,
	},
	async (rawArgs: z.input<typeof listPostsInputSchema>) => {
		const { postType, perPage, page, search, status } = listPostsInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			posts: Array<{
				id: number;
				title: string;
				slug: string;
				status: string;
				type: string;
				date: string;
				modified: string;
				author: number;
			}>;
			total: number;
			pages: number;
		}>({
			path: '/wp-json/ayu/v1/posts',
			query: {
				post_type: postType,
				per_page: perPage,
				page,
				search,
				status,
			},
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const getPostInputSchema = z.object({
	id: z.number().int().min(1),
});

server.registerTool(
	'wp.getPost',
	{
		description: 'Get a single WordPress post or page by ID',
		inputSchema: getPostInputSchema,
	},
	async (rawArgs: z.input<typeof getPostInputSchema>) => {
		const { id } = getPostInputSchema.parse(rawArgs);

		const post = await ayuRequest<{
			id: number;
			title: string;
			slug: string;
			status: string;
			type: string;
			content: string;
			excerpt: string;
			date: string;
			modified: string;
			author: number;
			featured_image: number | null;
			categories: number[];
			tags: number[];
		}>({
			path: `/wp-json/ayu/v1/posts/${id}`,
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(post, null, 2),
				},
			],
			data: post,
		};
	},
);

const createPostInputSchema = z.object({
	title: z.string().min(1),
	content: z.string().optional(),
	excerpt: z.string().optional(),
	status: z.enum(['draft', 'publish', 'pending', 'private']).default('draft'),
	type: z.enum(['post', 'page']).default('post'),
	slug: z.string().optional(),
	categories: z.array(z.number().int()).optional(),
	tags: z.array(z.string()).optional(),
	featuredImage: z.number().int().optional(),
});

server.registerTool(
	'wp.createPost',
	{
		description: 'Create a new WordPress post or page',
		inputSchema: createPostInputSchema,
	},
	async (rawArgs: z.input<typeof createPostInputSchema>) => {
		const args = createPostInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			id: number;
			success: boolean;
		}>({
			path: '/wp-json/ayu/v1/posts',
			method: 'POST',
			body: {
				title: args.title,
				content: args.content,
				excerpt: args.excerpt,
				status: args.status,
				type: args.type,
				slug: args.slug,
				categories: args.categories,
				tags: args.tags,
				featured_image: args.featuredImage,
			},
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const updatePostInputSchema = z.object({
	id: z.number().int().min(1),
	title: z.string().optional(),
	content: z.string().optional(),
	excerpt: z.string().optional(),
	status: z.enum(['draft', 'publish', 'pending', 'private']).optional(),
	slug: z.string().optional(),
	categories: z.array(z.number().int()).optional(),
	tags: z.array(z.string()).optional(),
	featuredImage: z.number().int().optional(),
});

server.registerTool(
	'wp.updatePost',
	{
		description: 'Update an existing WordPress post or page',
		inputSchema: updatePostInputSchema,
	},
	async (rawArgs: z.input<typeof updatePostInputSchema>) => {
		const args = updatePostInputSchema.parse(rawArgs);
		const { id, ...updateData } = args;

		const result = await ayuRequest<{
			id: number;
			success: boolean;
		}>({
			path: `/wp-json/ayu/v1/posts/${id}`,
			method: 'POST',
			body: {
				title: updateData.title,
				content: updateData.content,
				excerpt: updateData.excerpt,
				status: updateData.status,
				slug: updateData.slug,
				categories: updateData.categories,
				tags: updateData.tags,
				featured_image: updateData.featuredImage,
			},
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const deletePostInputSchema = z.object({
	id: z.number().int().min(1),
	force: z.boolean().default(false),
});

server.registerTool(
	'wp.deletePost',
	{
		description: 'Delete a WordPress post or page',
		inputSchema: deletePostInputSchema,
	},
	async (rawArgs: z.input<typeof deletePostInputSchema>) => {
		const { id, force } = deletePostInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			success: boolean;
			deleted: boolean;
		}>({
			path: `/wp-json/ayu/v1/posts/${id}`,
			method: 'DELETE',
			query: { force: force ? 'true' : 'false' },
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

// ===== MEDIA TOOLS =====

const listMediaInputSchema = z.object({
	perPage: z.number().int().min(1).max(100).default(20),
	page: z.number().int().min(1).default(1),
	search: z.string().optional(),
	mimeType: z.string().optional(),
});

server.registerTool(
	'wp.listMedia',
	{
		description: 'List media files from WordPress media library',
		inputSchema: listMediaInputSchema,
	},
	async (rawArgs: z.input<typeof listMediaInputSchema>) => {
		const { perPage, page, search, mimeType } = listMediaInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			media: Array<{
				id: number;
				title: string;
				url: string;
				mime_type: string;
				date: string;
			}>;
			total: number;
		}>({
			path: '/wp-json/ayu/v1/media',
			query: {
				per_page: perPage,
				page,
				search,
				mime_type: mimeType,
			},
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const getMediaInputSchema = z.object({
	id: z.number().int().min(1),
});

server.registerTool(
	'wp.getMedia',
	{
		description: 'Get media file details by ID',
		inputSchema: getMediaInputSchema,
	},
	async (rawArgs: z.input<typeof getMediaInputSchema>) => {
		const { id } = getMediaInputSchema.parse(rawArgs);

		const media = await ayuRequest<{
			id: number;
			title: string;
			url: string;
			mime_type: string;
			date: string;
			sizes: string;
		}>({
			path: `/wp-json/ayu/v1/media/${id}`,
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(media, null, 2),
				},
			],
			data: media,
		};
	},
);

const deleteMediaInputSchema = z.object({
	id: z.number().int().min(1),
});

server.registerTool(
	'wp.deleteMedia',
	{
		description: 'Delete a media file from WordPress',
		inputSchema: deleteMediaInputSchema,
	},
	async (rawArgs: z.input<typeof deleteMediaInputSchema>) => {
		const { id } = deleteMediaInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			success: boolean;
			deleted: boolean;
		}>({
			path: `/wp-json/ayu/v1/media/${id}`,
			method: 'DELETE',
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

// ===== USERS TOOLS =====

const listUsersInputSchema = z.object({
	perPage: z.number().int().min(1).max(100).default(20),
	page: z.number().int().min(1).default(1),
	search: z.string().optional(),
	role: z.string().optional(),
});

server.registerTool(
	'wp.listUsers',
	{
		description: 'List WordPress users with optional filters',
		inputSchema: listUsersInputSchema,
	},
	async (rawArgs: z.input<typeof listUsersInputSchema>) => {
		const { perPage, page, search, role } = listUsersInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			users: Array<{
				id: number;
				username: string;
				email: string;
				display_name: string;
				roles: string[];
			}>;
		}>({
			path: '/wp-json/ayu/v1/users',
			query: {
				per_page: perPage,
				page,
				search,
				role,
			},
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const getUserInputSchema = z.object({
	id: z.number().int().min(1),
});

server.registerTool(
	'wp.getUser',
	{
		description: 'Get WordPress user details by ID',
		inputSchema: getUserInputSchema,
	},
	async (rawArgs: z.input<typeof getUserInputSchema>) => {
		const { id } = getUserInputSchema.parse(rawArgs);

		const user = await ayuRequest<{
			id: number;
			username: string;
			email: string;
			display_name: string;
			roles: string[];
			registered: string;
		}>({
			path: `/wp-json/ayu/v1/users/${id}`,
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(user, null, 2),
				},
			],
			data: user,
		};
	},
);

const createUserInputSchema = z.object({
	username: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(8).optional(),
	displayName: z.string().optional(),
	role: z.enum(['subscriber', 'contributor', 'author', 'editor', 'administrator']).default('subscriber'),
});

server.registerTool(
	'wp.createUser',
	{
		description: 'Create a new WordPress user',
		inputSchema: createUserInputSchema,
	},
	async (rawArgs: z.input<typeof createUserInputSchema>) => {
		const args = createUserInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			id: number;
			success: boolean;
		}>({
			path: '/wp-json/ayu/v1/users',
			method: 'POST',
			body: {
				username: args.username,
				email: args.email,
				password: args.password,
				display_name: args.displayName,
				role: args.role,
			},
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const updateUserInputSchema = z.object({
	id: z.number().int().min(1),
	email: z.string().email().optional(),
	displayName: z.string().optional(),
	role: z.enum(['subscriber', 'contributor', 'author', 'editor', 'administrator']).optional(),
});

server.registerTool(
	'wp.updateUser',
	{
		description: 'Update an existing WordPress user',
		inputSchema: updateUserInputSchema,
	},
	async (rawArgs: z.input<typeof updateUserInputSchema>) => {
		const args = updateUserInputSchema.parse(rawArgs);
		const { id, ...updateData } = args;

		const result = await ayuRequest<{
			id: number;
			success: boolean;
		}>({
			path: `/wp-json/ayu/v1/users/${id}`,
			method: 'POST',
			body: {
				email: updateData.email,
				display_name: updateData.displayName,
				role: updateData.role,
			},
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const deleteUserInputSchema = z.object({
	id: z.number().int().min(1),
	reassign: z.number().int().optional(),
});

server.registerTool(
	'wp.deleteUser',
	{
		description: 'Delete a WordPress user (optionally reassign content)',
		inputSchema: deleteUserInputSchema,
	},
	async (rawArgs: z.input<typeof deleteUserInputSchema>) => {
		const { id, reassign } = deleteUserInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			success: boolean;
			deleted: boolean;
		}>({
			path: `/wp-json/ayu/v1/users/${id}`,
			method: 'DELETE',
			query: reassign ? { reassign: String(reassign) } : undefined,
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

// ===== MENUS TOOLS =====

const listMenusInputSchema = z.object({}).strict();

server.registerTool(
	'wp.listMenus',
	{
		description: 'List all WordPress navigation menus',
		inputSchema: listMenusInputSchema,
	},
	async () => {
		const result = await ayuRequest<{
			menus: Array<{
				id: number;
				name: string;
				slug: string;
				count: number;
			}>;
		}>({
			path: '/wp-json/ayu/v1/menus',
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const getMenuInputSchema = z.object({
	id: z.number().int().min(1),
});

server.registerTool(
	'wp.getMenu',
	{
		description: 'Get WordPress navigation menu with items by ID',
		inputSchema: getMenuInputSchema,
	},
	async (rawArgs: z.input<typeof getMenuInputSchema>) => {
		const { id } = getMenuInputSchema.parse(rawArgs);

		const menu = await ayuRequest<{
			id: number;
			name: string;
			slug: string;
			items: Array<{
				id: number;
				title: string;
				url: string;
				parent: number;
				order: number;
			}>;
		}>({
			path: `/wp-json/ayu/v1/menus/${id}`,
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(menu, null, 2),
				},
			],
			data: menu,
		};
	},
);

const createMenuInputSchema = z.object({
	name: z.string().min(1),
});

server.registerTool(
	'wp.createMenu',
	{
		description: 'Create a new WordPress navigation menu',
		inputSchema: createMenuInputSchema,
	},
	async (rawArgs: z.input<typeof createMenuInputSchema>) => {
		const { name } = createMenuInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			id: number;
			success: boolean;
		}>({
			path: '/wp-json/ayu/v1/menus',
			method: 'POST',
			body: { name },
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const updateMenuInputSchema = z.object({
	id: z.number().int().min(1),
	name: z.string().optional(),
	items: z
		.array(
			z.object({
				title: z.string(),
				url: z.string().url(),
				parent: z.number().int().default(0),
				order: z.number().int().default(0),
			}),
		)
		.optional(),
});

server.registerTool(
	'wp.updateMenu',
	{
		description: 'Update WordPress navigation menu (name and/or items)',
		inputSchema: updateMenuInputSchema,
	},
	async (rawArgs: z.input<typeof updateMenuInputSchema>) => {
		const args = updateMenuInputSchema.parse(rawArgs);
		const { id, ...updateData } = args;

		const result = await ayuRequest<{
			id: number;
			success: boolean;
		}>({
			path: `/wp-json/ayu/v1/menus/${id}`,
			method: 'POST',
			body: updateData,
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const deleteMenuInputSchema = z.object({
	id: z.number().int().min(1),
});

server.registerTool(
	'wp.deleteMenu',
	{
		description: 'Delete a WordPress navigation menu',
		inputSchema: deleteMenuInputSchema,
	},
	async (rawArgs: z.input<typeof deleteMenuInputSchema>) => {
		const { id } = deleteMenuInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			success: boolean;
			deleted: boolean;
		}>({
			path: `/wp-json/ayu/v1/menus/${id}`,
			method: 'DELETE',
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

// ===== TAXONOMIES TOOLS =====

const listTaxonomiesInputSchema = z.object({}).strict();

server.registerTool(
	'wp.listTaxonomies',
	{
		description: 'List all WordPress taxonomies',
		inputSchema: listTaxonomiesInputSchema,
	},
	async () => {
		const result = await ayuRequest<{
			taxonomies: Array<{
				name: string;
				label: string;
				object_type: string[];
			}>;
		}>({
			path: '/wp-json/ayu/v1/taxonomies',
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const listTermsInputSchema = z.object({
	taxonomy: z.string().min(1),
});

server.registerTool(
	'wp.listTerms',
	{
		description: 'List terms for a specific taxonomy',
		inputSchema: listTermsInputSchema,
	},
	async (rawArgs: z.input<typeof listTermsInputSchema>) => {
		const { taxonomy } = listTermsInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			terms: Array<{
				id: number;
				name: string;
				slug: string;
				count: number;
			}>;
		}>({
			path: `/wp-json/ayu/v1/taxonomies/${taxonomy}/terms`,
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const createTermInputSchema = z.object({
	taxonomy: z.string().min(1),
	name: z.string().min(1),
	slug: z.string().optional(),
});

server.registerTool(
	'wp.createTerm',
	{
		description: 'Create a new term in a taxonomy',
		inputSchema: createTermInputSchema,
	},
	async (rawArgs: z.input<typeof createTermInputSchema>) => {
		const { taxonomy, name, slug } = createTermInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			id: number;
			success: boolean;
		}>({
			path: `/wp-json/ayu/v1/taxonomies/${taxonomy}/terms`,
			method: 'POST',
			body: { name, slug },
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

// ===== OPTIONS/SETTINGS TOOLS =====

const getOptionInputSchema = z.object({
	name: z.string().min(1),
});

server.registerTool(
	'wp.getOption',
	{
		description: 'Get a WordPress option value',
		inputSchema: getOptionInputSchema,
	},
	async (rawArgs: z.input<typeof getOptionInputSchema>) => {
		const { name } = getOptionInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			name: string;
			value: unknown;
		}>({
			path: `/wp-json/ayu/v1/options/${name}`,
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const updateOptionInputSchema = z.object({
	name: z.string().min(1),
	value: z.unknown(),
});

server.registerTool(
	'wp.updateOption',
	{
		description: 'Update a WordPress option value',
		inputSchema: updateOptionInputSchema,
	},
	async (rawArgs: z.input<typeof updateOptionInputSchema>) => {
		const { name, value } = updateOptionInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			name: string;
			value: unknown;
			success: boolean;
		}>({
			path: `/wp-json/ayu/v1/options/${name}`,
			method: 'POST',
			body: { value },
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const getSiteHealthInputSchema = z.object({}).strict();

server.registerTool(
	'wp.getSiteHealth',
	{
		description: 'Get WordPress site health status information',
		inputSchema: getSiteHealthInputSchema,
	},
	async () => {
		const result = await ayuRequest<Record<string, unknown>>({
			path: '/wp-json/ayu/v1/site-health',
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

// ===== ELEMENTOR TOOLS =====

const listElementorTemplatesInputSchema = z.object({
	perPage: z.number().int().min(1).max(100).default(20),
	page: z.number().int().min(1).default(1),
});

server.registerTool(
	'elementor.listTemplates',
	{
		description: 'List Elementor templates (requires Elementor plugin)',
		inputSchema: listElementorTemplatesInputSchema,
	},
	async (rawArgs: z.input<typeof listElementorTemplatesInputSchema>) => {
		const { perPage, page } = listElementorTemplatesInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			templates: Array<{
				id: number;
				title: string;
				slug: string;
				type: string;
			}>;
			total: number;
		}>({
			path: '/wp-json/ayu/v1/elementor/templates',
			query: {
				per_page: perPage,
				page,
			},
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const getElementorTemplateInputSchema = z.object({
	id: z.number().int().min(1),
});

server.registerTool(
	'elementor.getTemplate',
	{
		description: 'Get Elementor template details by ID',
		inputSchema: getElementorTemplateInputSchema,
	},
	async (rawArgs: z.input<typeof getElementorTemplateInputSchema>) => {
		const { id } = getElementorTemplateInputSchema.parse(rawArgs);

		const template = await ayuRequest<{
			id: number;
			title: string;
			slug: string;
			type: string;
			data: unknown;
		}>({
			path: `/wp-json/ayu/v1/elementor/templates/${id}`,
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(template, null, 2),
				},
			],
			data: template,
		};
	},
);

const getElementorKitInputSchema = z.object({}).strict();

server.registerTool(
	'elementor.getKit',
	{
		description: 'Get Elementor global kit settings',
		inputSchema: getElementorKitInputSchema,
	},
	async () => {
		const result = await ayuRequest<{
			id: number;
			settings: Record<string, unknown>;
		}>({
			path: '/wp-json/ayu/v1/elementor/kit',
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const updateElementorKitInputSchema = z.object({
	settings: z.record(z.unknown()),
});

server.registerTool(
	'elementor.updateKit',
	{
		description: 'Update Elementor global kit settings',
		inputSchema: updateElementorKitInputSchema,
	},
	async (rawArgs: z.input<typeof updateElementorKitInputSchema>) => {
		const { settings } = updateElementorKitInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			id: number;
			success: boolean;
		}>({
			path: '/wp-json/ayu/v1/elementor/kit',
			method: 'POST',
			body: { settings },
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const listElementorPagesInputSchema = z.object({
	perPage: z.number().int().min(1).max(100).default(20),
	page: z.number().int().min(1).default(1),
});

server.registerTool(
	'elementor.listPages',
	{
		description: 'List pages edited with Elementor',
		inputSchema: listElementorPagesInputSchema,
	},
	async (rawArgs: z.input<typeof listElementorPagesInputSchema>) => {
		const { perPage, page } = listElementorPagesInputSchema.parse(rawArgs);

		const result = await ayuRequest<{
			pages: Array<{
				id: number;
				title: string;
				slug: string;
				status: string;
			}>;
			total: number;
		}>({
			path: '/wp-json/ayu/v1/elementor/pages',
			query: {
				per_page: perPage,
				page,
			},
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

const getElementorPageInputSchema = z.object({
	id: z.number().int().min(1),
});

server.registerTool(
	'elementor.getPage',
	{
		description: 'Get Elementor page with Elementor data',
		inputSchema: getElementorPageInputSchema,
	},
	async (rawArgs: z.input<typeof getElementorPageInputSchema>) => {
		const { id } = getElementorPageInputSchema.parse(rawArgs);

		const page = await ayuRequest<{
			id: number;
			title: string;
			slug: string;
			status: string;
			is_elementor: boolean;
			elementor_data: unknown;
		}>({
			path: `/wp-json/ayu/v1/elementor/pages/${id}`,
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(page, null, 2),
				},
			],
			data: page,
		};
	},
);

const updateElementorPageInputSchema = z.object({
	id: z.number().int().min(1),
	elementorData: z.array(z.unknown()).optional(),
	settings: z.record(z.unknown()).optional(),
});

server.registerTool(
	'elementor.updatePage',
	{
		description: 'Update Elementor page with Elementor data structure',
		inputSchema: updateElementorPageInputSchema,
	},
	async (rawArgs: z.input<typeof updateElementorPageInputSchema>) => {
		const { id, elementorData, settings } = updateElementorPageInputSchema.parse(rawArgs);

		const body: Record<string, unknown> = {};
		if (elementorData !== undefined) {
			body.elementor_data = elementorData;
		}
		if (settings !== undefined) {
			body.settings = settings;
		}

		const result = await ayuRequest<{
			id: number;
			success: boolean;
		}>({
			path: `/wp-json/ayu/v1/elementor/pages/${id}`,
			method: 'POST',
			body,
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(result, null, 2),
				},
			],
			data: result,
		};
	},
);

// Preset builders
const heroPresetSchema = z.object({
	preset: z.literal('hero'),
	options: z.object({
		title: z.string(),
		eyebrow: z.string().optional(),
		description: z.string().optional(),
		layout: z.enum(['image-left', 'image-right']).optional(),
		button: z
			.object({
				text: z.string(),
				link: z.string().optional(),
			})
			.optional(),
		secondaryButton: z
			.object({
				text: z.string(),
				link: z.string().optional(),
			})
			.optional(),
		image: z
			.object({
				url: z.string().url().optional(),
				id: z.number().optional(),
				alt: z.string().optional(),
			})
			.optional(),
	}),
});

const cardGridPresetSchema = z.object({
	preset: z.literal('cardGrid'),
	options: z.object({
		heading: z.string().optional(),
		description: z.string().optional(),
		columns: z.union([z.literal(3), z.literal(4)]).optional(),
		maxWidth: z.number().optional(),
		cards: z
			.array(
				z.object({
					title: z.string(),
					meta: z.string(),
					image: z
						.object({
							url: z.string().url().optional(),
							id: z.number().optional(),
							alt: z.string().optional(),
						})
						.optional(),
				}),
			)
			.min(1),
	}),
});

const featureListPresetSchema = z.object({
	preset: z.literal('featureList'),
	options: z.object({
		heading: z.string().optional(),
		description: z.string().optional(),
		items: z
			.array(
				z.object({
					title: z.string(),
					description: z.string(),
					icon: z.string().optional(),
				}),
			)
			.min(1),
	}),
});

const testimonialPresetSchema = z.object({
	preset: z.literal('testimonials'),
	options: z.object({
		heading: z.string().optional(),
		subheading: z.string().optional(),
		items: z
			.array(
				z.object({
					quote: z.string(),
					name: z.string(),
					role: z.string().optional(),
					imageUrl: z.string().url().optional(),
					imageId: z.number().optional(),
				}),
			)
			.min(1),
	}),
});

const buildPresetInputSchema = z.discriminatedUnion('preset', [
	heroPresetSchema,
	cardGridPresetSchema,
	featureListPresetSchema,
	testimonialPresetSchema,
]);

server.registerTool(
	'elementor.buildPresetSections',
	{
		description: 'Generate Elementor section JSON using predefined presets (hero, card grid, feature list, testimonials).',
		inputSchema: buildPresetInputSchema,
	},
	async (rawArgs: z.input<typeof buildPresetInputSchema>) => {
		const args = buildPresetInputSchema.parse(rawArgs);

		let sections: Record<string, unknown>[] = [];

		switch (args.preset) {
			case 'hero':
				sections = [buildHeroTextImageSection(args.options)];
				break;
			case 'cardGrid':
				sections = [buildCardGridSection(args.options)];
				break;
			case 'featureList':
				sections = [buildFeatureListSection(args.options)];
				break;
			case 'testimonials':
				sections = [buildTestimonialStrip(args.options)];
				break;
			default:
				throw new Error(`Unsupported preset: ${args satisfies never}`);
		}

		const payload = { elementor_data: sections };

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(payload, null, 2),
				},
			],
			data: payload,
		};
	},
);

async function main(): Promise<void> {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	// Server stays alive waiting for requests
}

main().catch((error) => {
	// Log to stderr (won't interfere with JSON-RPC on stdout)
	console.error('[ayu-mcp-server] Fatal error:', error);
	process.exit(1);
});

