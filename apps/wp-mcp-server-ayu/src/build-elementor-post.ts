/**
 * Example script showing how to build proper Elementor structures
 * This demonstrates the correct way to create Elementor layouts
 */

import * as ElementorHelpers from './elementor-helpers.js';

/**
 * Build a full-width Elementor design for "makan bersama aris" post
 */
export function buildMakanBersamaArisDesign(): unknown[] {
    const design: unknown[] = [];

    // Hero Section - Full Width with Gradient
    const heroContainer = ElementorHelpers.createFullWidthLayout(
        [
            ElementorHelpers.createHeadingWidget({
                title: 'Makan Bersama Aris',
                size: 'xxl',
                align: 'center',
                headerSize: 'h1',
                color: '#ffffff',
            }),
            ElementorHelpers.createHeadingWidget({
                title: 'Momen Kebersamaan yang Berharga',
                size: 'large',
                align: 'center',
                headerSize: 'h2',
                color: '#ffffff',
                typographyFontSize: 24,
            }),
        ],
        {
            background: ElementorHelpers.createGradientBackground({
                type: 'linear',
                angle: 135,
                colorOne: '#667eea',
                colorTwo: '#764ba2',
            }),
            minHeight: {
                desktop: ElementorHelpers.createScalarValue({ unit: 'vh', size: 60 }),
            },
            padding: {
                desktop: ElementorHelpers.createPadding({
                    top: 100,
                    right: 0,
                    bottom: 100,
                    left: 0,
                    unit: 'px',
                }),
            },
        },
    );
    design.push(heroContainer);

    // Content Section - Centered with Max Width
    const contentContainer = ElementorHelpers.createContentContainer(
        [
            ElementorHelpers.createTextEditorWidget({
                content:
                    '<p style="font-size: 20px; line-height: 1.8; color: #333; margin-bottom: 40px;">Hari ini adalah hari yang menyenangkan! Kami berkumpul bersama untuk makan bersama Aris. Acara ini diadakan di tempat yang nyaman dengan suasana yang hangat dan penuh kebersamaan.</p>',
                align: 'left',
            }),
        ],
        1200,
        {
            padding: {
                desktop: ElementorHelpers.createPadding({
                    top: 80,
                    right: 40,
                    bottom: 80,
                    left: 40,
                    unit: 'px',
                }),
            },
        },
    );
    design.push(contentContainer);

    // Features Section - Full Width Background with 3 Columns
    const featuresContainer = ElementorHelpers.createContentContainer(
        [
            ElementorHelpers.createIconBoxWidget({
                icon: 'fas fa-utensils',
                library: 'fa-solid',
                title: 'Menu Beragam',
                description: 'Menu yang disajikan sangat beragam dan lezat, mulai dari hidangan pembuka hingga hidangan utama.',
                align: 'center',
            }),
            ElementorHelpers.createIconBoxWidget({
                icon: 'fas fa-users',
                library: 'fa-solid',
                title: 'Kebersamaan',
                description: 'Kami saling berbagi cerita, tertawa bersama, dan menikmati momen kebersamaan yang berharga.',
                align: 'center',
            }),
            ElementorHelpers.createIconBoxWidget({
                icon: 'fas fa-heart',
                library: 'fa-solid',
                title: 'Kenangan Indah',
                description: 'Momen yang akan selalu dikenang dan diharapkan bisa terulang di masa depan.',
                align: 'center',
            }),
        ],
        1200,
        {
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
        },
    );
    design.push(featuresContainer);

    // Main Content Section
    const mainContentContainer = ElementorHelpers.createContentContainer(
        [
            ElementorHelpers.createTextEditorWidget({
                content: `<p style="font-size: 18px; line-height: 1.8; color: #444; margin-bottom: 30px;">Menu yang disajikan sangat beragam dan lezat. Mulai dari hidangan pembuka yang menggugah selera, hingga hidangan utama yang memuaskan. Tidak lupa juga berbagai minuman segar yang menemani perbincangan kami.</p>
<p style="font-size: 18px; line-height: 1.8; color: #444; margin-bottom: 30px;">Selama acara berlangsung, kami saling berbagi cerita, tertawa bersama, dan menikmati momen kebersamaan yang berharga. Makan bersama memang selalu menjadi cara terbaik untuk mempererat hubungan antar teman dan keluarga.</p>
<p style="font-size: 18px; line-height: 1.8; color: #444;">Terima kasih kepada Aris yang telah menginisiasi acara ini. Semoga kita bisa mengadakan acara serupa lagi di masa depan!</p>`,
                align: 'left',
            }),
        ],
        1200,
        {
            padding: {
                desktop: ElementorHelpers.createPadding({
                    top: 80,
                    right: 40,
                    bottom: 80,
                    left: 40,
                    unit: 'px',
                }),
            },
        },
    );
    design.push(mainContentContainer);

    // CTA Section - Full Width with Gradient
    const ctaContainer = ElementorHelpers.createFullWidthLayout(
        [
            ElementorHelpers.createHeadingWidget({
                title: 'Sampai Jumpa di Acara Selanjutnya!',
                size: 'xl',
                align: 'center',
                headerSize: 'h2',
                color: '#ffffff',
            }),
        ],
        {
            background: ElementorHelpers.createGradientBackground({
                type: 'linear',
                angle: 135,
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
        },
    );
    design.push(ctaContainer);

    return design;
}

// Export the design as JSON for easy use
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log(JSON.stringify(buildMakanBersamaArisDesign(), null, 2));
}

