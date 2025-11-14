/**
 * Test script to update Elementor page using the MCP server's internal functions
 * This simulates what the MCP tool would do
 */

import 'dotenv/config';
import * as ElementorHelpers from './dist/elementor-helpers.js';

const WORDPRESS_URL = process.env.WORDPRESS_URL ?? 'http://localhost:8080';
const AYU_TOKEN = process.env.AYU_TOKEN ?? '';

async function ayuRequest<T>({ path, method = 'GET', body }: {
	path: string;
	method?: 'GET' | 'POST' | 'DELETE';
	body?: unknown;
}): Promise<T> {
	const url = new URL(path, WORDPRESS_URL);

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

function buildDesign(): unknown[] {
	const design: unknown[] = [];

	// Hero Section - Full Width with Gradient
	const hero = ElementorHelpers.createFullWidthLayout([
		ElementorHelpers.createHeadingWidget({
			title: 'Makan Bersama Aris',
			size: 'xxl',
			align: 'center',
			headerSize: 'h1',
			color: '#ffffff',
			typographyFontSize: 72,
		}),
		ElementorHelpers.createHeadingWidget({
			title: 'Momen Kebersamaan yang Berharga',
			size: 'large',
			align: 'center',
			headerSize: 'h2',
			color: '#ffffff',
			typographyFontSize: 24,
		}),
	], {
		background: ElementorHelpers.createGradientBackground({
			colorOne: '#667eea',
			colorTwo: '#764ba2',
		}),
		padding: {
			desktop: ElementorHelpers.createPadding({
				top: 100,
				right: 0,
				bottom: 100,
				left: 0,
				unit: 'px',
			}),
		},
	});
	design.push(hero);

	// Intro Content Section
	const introContent = ElementorHelpers.createContentContainer([
		ElementorHelpers.createTextEditorWidget({
			content:
				'<p style="font-size: 20px; line-height: 1.8; color: #333; margin-bottom: 40px;">Hari ini adalah hari yang menyenangkan! Kami berkumpul bersama untuk makan bersama Aris. Acara ini diadakan di tempat yang nyaman dengan suasana yang hangat dan penuh kebersamaan.</p>',
			align: 'left',
		}),
	], 1200, {
		padding: {
			desktop: ElementorHelpers.createPadding({
				top: 80,
				right: 40,
				bottom: 80,
				left: 40,
				unit: 'px',
			}),
		},
	});
	design.push(introContent);

	// Features Section
	const features = ElementorHelpers.createContentContainer([
		ElementorHelpers.createIconBoxWidget({
			icon: 'fas fa-utensils',
			library: 'fa-solid',
			title: 'Menu Beragam',
			description:
				'Menu yang disajikan sangat beragam dan lezat, mulai dari hidangan pembuka yang menggugah selera, hingga hidangan utama yang memuaskan.',
			align: 'center',
		}),
		ElementorHelpers.createIconBoxWidget({
			icon: 'fas fa-users',
			library: 'fa-solid',
			title: 'Kebersamaan',
			description:
				'Kami saling berbagi cerita, tertawa bersama, dan menikmati momen kebersamaan yang berharga.',
			align: 'center',
		}),
		ElementorHelpers.createIconBoxWidget({
			icon: 'fas fa-heart',
			library: 'fa-solid',
			title: 'Kenangan Indah',
			description:
				'Momen yang akan selalu dikenang dan diharapkan bisa terulang di masa depan.',
			align: 'center',
		}),
	], 1200, {
		padding: {
			desktop: ElementorHelpers.createPadding({
				top: 80,
				right: 40,
				bottom: 80,
				left: 40,
				unit: 'px',
			}),
		},
		background: ElementorHelpers.createSolidBackground('#f8f9fa'),
	});
	design.push(features);

	// Main Content Section
	const mainContent = ElementorHelpers.createContentContainer([
		ElementorHelpers.createTextEditorWidget({
			content:
				'<p style="font-size: 18px; line-height: 1.8; color: #444; margin-bottom: 30px;">Menu yang disajikan sangat beragam dan lezat. Mulai dari hidangan pembuka yang menggugah selera, hingga hidangan utama yang memuaskan. Tidak lupa juga berbagai minuman segar yang menemani perbincangan kami.</p><p style="font-size: 18px; line-height: 1.8; color: #444; margin-bottom: 30px;">Selama acara berlangsung, kami saling berbagi cerita, tertawa bersama, dan menikmati momen kebersamaan yang berharga. Makan bersama memang selalu menjadi cara terbaik untuk mempererat hubungan antar teman dan keluarga.</p><p style="font-size: 18px; line-height: 1.8; color: #444;">Terima kasih kepada Aris yang telah menginisiasi acara ini. Semoga kita bisa mengadakan acara serupa lagi di masa depan!</p>',
			align: 'left',
		}),
	], 1200, {
		padding: {
			desktop: ElementorHelpers.createPadding({
				top: 80,
				right: 40,
				bottom: 80,
				left: 40,
				unit: 'px',
			}),
		},
	});
	design.push(mainContent);

	// CTA Section
	const cta = ElementorHelpers.createFullWidthLayout([
		ElementorHelpers.createHeadingWidget({
			title: 'Sampai Jumpa di Acara Selanjutnya!',
			size: 'xl',
			align: 'center',
			headerSize: 'h2',
			color: '#ffffff',
			typographyFontSize: 42,
		}),
	], {
		background: ElementorHelpers.createGradientBackground({
			colorOne: '#764ba2',
			colorTwo: '#667eea',
		}),
		padding: {
			desktop: ElementorHelpers.createPadding({
				top: 80,
				right: 0,
				bottom: 80,
				left: 0,
				unit: 'px',
			}),
		},
	});
	design.push(cta);

	return design;
}

async function updatePage() {
	const postId = 19;
	const elementorData = buildDesign();

	console.log(`Updating post ${postId} with Elementor design...`);
	console.log(`Design contains ${elementorData.length} containers`);

	const result = await ayuRequest<{ id: number; success: boolean }>({
		path: `/wp-json/ayu/v1/elementor/pages/${postId}`,
		method: 'POST',
		body: {
			elementor_data: elementorData,
		},
	});

	if (result.success) {
		console.log(`✅ Post ${postId} successfully updated with Elementor design!`);
		console.log(`View at: http://localhost:8080/makan-bersama-aris/`);
	} else {
		console.error(`❌ Failed to update post ${postId}`);
	}
}

updatePage().catch(console.error);

