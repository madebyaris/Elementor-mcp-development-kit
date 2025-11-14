/**
 * Use the elementor.updatePage MCP tool code path
 * This executes the exact same code that the MCP tool would execute
 */

import 'dotenv/config';
import { z } from 'zod';
import * as fs from 'fs';

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

// Exact same schema from the MCP tool
const updateElementorPageInputSchema = z.object({
	id: z.number().int().min(1),
	elementorData: z.array(z.unknown()).optional(),
});

// Exact same handler logic from the MCP tool
async function updateElementorPage(id: number, elementorData: unknown[]) {
	const { id: parsedId, elementorData: parsedData } = updateElementorPageInputSchema.parse({
		id,
		elementorData,
	});

	const result = await ayuRequest<{
		id: number;
		success: boolean;
	}>({
		path: `/wp-json/ayu/v1/elementor/pages/${parsedId}`,
		method: 'POST',
		body: {
			elementor_data: parsedData || [],
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
}

async function main() {
	console.log('🔄 Using elementor.updatePage MCP tool code path...');
	console.log('');

	// Load design from file
	const design = JSON.parse(fs.readFileSync('/tmp/mcp-design.json', 'utf8'));

	console.log('📋 Design loaded:');
	console.log(`   - Containers: ${design.length}`);
	console.log(`   - Total widgets: ${design.reduce((sum: number, c: any) => sum + (c.elements?.length || 0), 0)}`);
	console.log('');

	// Call the MCP tool handler
	const result = await updateElementorPage(19, design);

	console.log('✅ MCP tool execution result:');
	console.log(JSON.stringify(result.data, null, 2));
	console.log('');

	if (result.data.success) {
		console.log('🎉 Successfully updated post 19 using elementor.updatePage MCP tool!');
		console.log('   View at: http://localhost:8080/makan-bersama-aris/');
	} else {
		console.error('❌ Update failed');
	}
}

main().catch((error) => {
	console.error('❌ Error:', error.message);
	process.exit(1);
});

