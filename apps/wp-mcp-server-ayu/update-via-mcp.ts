/**
 * Update Elementor page using MCP server code path
 * This simulates what the elementor.updatePage MCP tool would do
 */

import 'dotenv/config';
import { z } from 'zod';

const WORDPRESS_URL = process.env.WORDPRESS_URL ?? 'http://localhost:8080';
const AYU_TOKEN = process.env.AYU_TOKEN ?? '';

type FetchParams = {
	path: string;
	method?: 'GET' | 'POST' | 'DELETE';
	body?: unknown;
	query?: Record<string, string | number | undefined>;
};

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

// This is the exact same schema and logic from the MCP tool
const updateElementorPageInputSchema = z.object({
	id: z.number().int().min(1),
	elementorData: z.array(z.unknown()).optional(),
});

async function updateElementorPage(id: number, elementorData: unknown[]) {
	// Parse using the same schema as the MCP tool
	const args = updateElementorPageInputSchema.parse({ id, elementorData });

	const result = await ayuRequest<{
		id: number;
		success: boolean;
	}>({
		path: `/wp-json/ayu/v1/elementor/pages/${args.id}`,
		method: 'POST',
		body: {
			elementor_data: args.elementorData || [],
		},
	});

	return result;
}

// Load design and update
async function main() {
	const fs = await import('fs');
	const design = JSON.parse(fs.readFileSync('/tmp/mcp-design.json', 'utf8'));

	console.log('🔄 Using MCP server code path to update Elementor page...');
	console.log(`   Post ID: 19`);
	console.log(`   Containers: ${design.length}`);

	const result = await updateElementorPage(19, design);

	if (result.success) {
		console.log('');
		console.log('✅ Successfully updated post 19 with Elementor design!');
		console.log(`   View at: http://localhost:8080/makan-bersama-aris/`);
	} else {
		console.error('❌ Failed to update post');
	}
}

main().catch(console.error);

