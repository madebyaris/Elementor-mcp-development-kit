import 'dotenv/config';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

type FetchParams = {
	path: string;
	query?: Record<string, string | number | undefined>;
};

const WORDPRESS_URL = process.env.WORDPRESS_URL ?? 'http://localhost:8080';
const WORDPRESS_USER = process.env.WORDPRESS_USER;
const WORDPRESS_APPLICATION_PASSWORD = process.env.WORDPRESS_APPLICATION_PASSWORD;

function getAuthHeader(): string | undefined {
	if (!WORDPRESS_USER || !WORDPRESS_APPLICATION_PASSWORD) {
		return undefined;
	}

	const encoded = Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_APPLICATION_PASSWORD}`).toString('base64');
	return `Basic ${encoded}`;
}

async function wordpressRequest<T>({ path, query }: FetchParams): Promise<T> {
	const url = new URL(path, WORDPRESS_URL);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined) continue;
			url.searchParams.set(key, String(value));
		}
	}

	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			...(getAuthHeader() ? { Authorization: getAuthHeader()! } : {}),
		},
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`WordPress API error (${response.status}): ${body}`);
	}

	return response.json() as Promise<T>;
}

const server = new McpServer({
	name: 'wp-mcp-server',
	version: '0.1.0',
});

const listPostsInputSchema = z.object({
	perPage: z.number().int().min(1).max(100).default(5),
	search: z.string().min(1).optional(),
	status: z.enum(['publish', 'draft', 'future', 'pending', 'private']).default('publish'),
});

server.registerTool(
	'wordpress:listPosts',
	{
		description: 'List recent WordPress posts via REST API',
		inputSchema: listPostsInputSchema,
	},
	async (rawArgs: z.input<typeof listPostsInputSchema>) => {
		const { perPage, search, status } = listPostsInputSchema.parse(rawArgs);

		const posts = await wordpressRequest<
			Array<{
				id: number;
				date: string;
				slug: string;
				status: string;
				title: { rendered: string };
				link: string;
				excerpt: { rendered: string };
			}>
		>({
			path: '/wp-json/wp/v2/posts',
			query: {
				per_page: perPage,
				search,
				status,
				_embed: 'author',
			},
		});

		const summary = posts.map((post) => ({
			id: post.id,
			slug: post.slug,
			status: post.status,
			date: post.date,
			title: post.title.rendered,
			link: post.link,
			excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 280),
		}));

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(summary, null, 2),
				},
			],
			data: summary,
		};
	},
);

const getPostInputSchema = z
	.object({
		id: z.number().int().min(1).optional(),
		slug: z.string().min(1).optional(),
		context: z.enum(['view', 'edit', 'embed']).default('view'),
	})
	.refine((data) => typeof data.id === 'number' || Boolean(data.slug), {
		message: 'Either "id" or "slug" must be provided.',
	});

server.registerTool(
	'wordpress:getPost',
	{
		description: 'Fetch a single WordPress post by ID or slug',
		inputSchema: getPostInputSchema,
	},
	async (rawArgs: z.input<typeof getPostInputSchema>) => {
		const { id, slug, context } = getPostInputSchema.parse(rawArgs);

		let post;

		if (id) {
			post = await wordpressRequest({
				path: `/wp-json/wp/v2/posts/${id}`,
				query: { context },
			});
		} else {
			const matches = await wordpressRequest<any[]>({
				path: '/wp-json/wp/v2/posts',
				query: { slug, context },
			});

			post = matches.at(0);
		}

		if (!post) {
			throw new Error('Post not found.');
		}

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

const emptyInputSchema = z.object({}).strict();

server.registerTool(
	'wordpress:getSiteInfo',
	{
		description: 'Get site-level metadata (title, description, routes, namespaces)',
		inputSchema: emptyInputSchema,
	},
	async (rawArgs: z.input<typeof emptyInputSchema>) => {
		emptyInputSchema.parse(rawArgs);

		const info = await wordpressRequest<Record<string, unknown>>({
			path: '/wp-json',
		});

		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(info, null, 2),
				},
			],
			data: info,
		};
	},
);

async function main(): Promise<void> {
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((error) => {
	console.error('[wp-mcp-server] Fatal error:', error);
	process.exit(1);
});
