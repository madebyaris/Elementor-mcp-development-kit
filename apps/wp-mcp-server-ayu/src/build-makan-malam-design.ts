/**
 * Build Elementor design for "makan malam" page using updated helpers
 * Demonstrates proper structure with nested containers, correct spacing, and colors
 */

import * as ElementorHelpers from './elementor-helpers.js';

export function buildMakanMalamDesign(): unknown[] {
    const design: unknown[] = [];

    // Hero Section - Full Width with Gradient Background
    const heroContainer = ElementorHelpers.createFullWidthLayout(
        [
            ElementorHelpers.createIconWidget({
                icon: 'fas fa-utensils',
                library: 'fa-solid',
                align: 'center',
                view: 'stacked',
                shape: 'circle',
                primaryColor: 'rgba(255,255,255,0.2)',
                secondaryColor: '#ffffff', // Required for stacked view!
                iconSize: 80,
                iconPadding: 30,
            }),
            ElementorHelpers.createHeadingWidget({
                title: 'Makan Malam Bersama',
                size: 'xxl',
                align: 'center',
                headerSize: 'h1',
                color: '#ffffff',
                typographyFontSize: 80,
            }),
            ElementorHelpers.createTextEditorWidget({
                content:
                    '<p style="text-align: center; color: #ffffff; font-size: 26px; line-height: 1.7; opacity: 0.95;">Nikmati momen spesial dengan hidangan lezat dan suasana yang hangat</p>',
                align: 'center',
            }),
            ElementorHelpers.createButtonWidget({
                text: 'Lihat Menu',
                link: '#menu',
                align: 'center',
                size: 'xl',
                type: 'primary',
            }),
        ],
        {
            background: ElementorHelpers.createGradientBackground({
                type: 'linear',
                angle: 135,
                colorOne: '#ff6b6b',
                colorTwo: '#ee5a6f',
            }),
            minHeight: {
                desktop: ElementorHelpers.createScalarValue({ unit: 'vh', size: 85 }),
            },
            padding: {
                desktop: ElementorHelpers.createPadding({
                    top: 160,
                    right: 20,
                    bottom: 160,
                    left: 20,
                    unit: 'px',
                }),
            },
            gap: {
                desktop: ElementorHelpers.createFlexGap({ size: 30, unit: 'px' }),
            },
            customSettings: {
                flex_align_items: 'center',
                flex_justify_content: 'center',
            },
        },
    );
    design.push(heroContainer);

    // Features Section - Boxed Container with 3 Columns
    const featuresRow = ElementorHelpers.createRowContainer(
        [
            ElementorHelpers.createNestedContainer(
                '33',
                {
                    flex_direction: 'column',
                    flex_align_items: 'center',
                    padding: ElementorHelpers.createPadding({
                        top: 50,
                        right: 30,
                        bottom: 50,
                        left: 30,
                        unit: 'px',
                    }),
                    background_background: 'classic',
                    background_color: '#fff8f8',
                    border_radius: {
                        unit: 'px',
                        top: '25',
                        right: '25',
                        bottom: '25',
                        left: '25',
                        isLinked: '1',
                    },
                },
                [
                    ElementorHelpers.createIconWidget({
                        icon: 'fas fa-fire',
                        library: 'fa-solid',
                        align: 'center',
                        view: 'stacked',
                        shape: 'circle',
                        primaryColor: '#ff6b6b',
                        secondaryColor: '#ffffff', // Required!
                        iconSize: 55,
                        iconPadding: 28,
                    }),
                    ElementorHelpers.createHeadingWidget({
                        title: 'Masakan Segar',
                        size: 'large',
                        align: 'center',
                        headerSize: 'h3',
                        color: '#333333',
                    }),
                    ElementorHelpers.createTextEditorWidget({
                        content:
                            '<p style="text-align: center; color: #666666; line-height: 1.8; font-size: 16px;">Bahan-bahan pilihan yang dimasak langsung di dapur kami dengan teknik terbaik</p>',
                        align: 'center',
                    }),
                ],
            ),
            ElementorHelpers.createNestedContainer(
                '33',
                {
                    flex_direction: 'column',
                    flex_align_items: 'center',
                    padding: ElementorHelpers.createPadding({
                        top: 50,
                        right: 30,
                        bottom: 50,
                        left: 30,
                        unit: 'px',
                    }),
                    background_background: 'classic',
                    background_color: '#fff8f8',
                    border_radius: {
                        unit: 'px',
                        top: '25',
                        right: '25',
                        bottom: '25',
                        left: '25',
                        isLinked: '1',
                    },
                },
                [
                    ElementorHelpers.createIconWidget({
                        icon: 'fas fa-users',
                        library: 'fa-solid',
                        align: 'center',
                        view: 'stacked',
                        shape: 'circle',
                        primaryColor: '#ff6b6b',
                        secondaryColor: '#ffffff', // Required!
                        iconSize: 55,
                        iconPadding: 28,
                    }),
                    ElementorHelpers.createHeadingWidget({
                        title: 'Suasana Hangat',
                        size: 'large',
                        align: 'center',
                        headerSize: 'h3',
                        color: '#333333',
                    }),
                    ElementorHelpers.createTextEditorWidget({
                        content:
                            '<p style="text-align: center; color: #666666; line-height: 1.8; font-size: 16px;">Tempat yang nyaman untuk berkumpul bersama keluarga dan teman-teman terbaik</p>',
                        align: 'center',
                    }),
                ],
            ),
            ElementorHelpers.createNestedContainer(
                '33',
                {
                    flex_direction: 'column',
                    flex_align_items: 'center',
                    padding: ElementorHelpers.createPadding({
                        top: 50,
                        right: 30,
                        bottom: 50,
                        left: 30,
                        unit: 'px',
                    }),
                    background_background: 'classic',
                    background_color: '#fff8f8',
                    border_radius: {
                        unit: 'px',
                        top: '25',
                        right: '25',
                        bottom: '25',
                        left: '25',
                        isLinked: '1',
                    },
                },
                [
                    ElementorHelpers.createIconWidget({
                        icon: 'fas fa-heart',
                        library: 'fa-solid',
                        align: 'center',
                        view: 'stacked',
                        shape: 'circle',
                        primaryColor: '#ff6b6b',
                        secondaryColor: '#ffffff', // Required!
                        iconSize: 55,
                        iconPadding: 28,
                    }),
                    ElementorHelpers.createHeadingWidget({
                        title: 'Pelayanan Ramah',
                        size: 'large',
                        align: 'center',
                        headerSize: 'h3',
                        color: '#333333',
                    }),
                    ElementorHelpers.createTextEditorWidget({
                        content:
                            '<p style="text-align: center; color: #666666; line-height: 1.8; font-size: 16px;">Tim kami siap memberikan pelayanan terbaik untuk pengalaman yang memuaskan</p>',
                        align: 'center',
                    }),
                ],
            ),
        ],
        {
            gap: {
                desktop: ElementorHelpers.createFlexGap({ size: 30, unit: 'px' }),
            },
            justifyContent: 'space-between',
            alignItems: 'stretch',
            wrap: true,
        },
    );

    const featuresContainer = ElementorHelpers.createContentContainer(
        [
            ElementorHelpers.createHeadingWidget({
                title: 'Kenapa Pilih Kami?',
                size: 'xl',
                align: 'center',
                headerSize: 'h2',
                color: '#333333',
            }),
            ElementorHelpers.createTextEditorWidget({
                content:
                    '<p style="text-align: center; color: #666666; font-size: 19px;">Pengalaman kuliner yang tak terlupakan</p>',
                align: 'center',
            }),
            featuresRow,
        ],
        1200,
        {
            padding: {
                desktop: ElementorHelpers.createPadding({
                    top: 100,
                    right: 20,
                    bottom: 100,
                    left: 20,
                    unit: 'px',
                }),
            },
        },
    );
    design.push(featuresContainer);

    // CTA Section - Full Width with Gradient
    const ctaContainer = ElementorHelpers.createFullWidthLayout(
        [
            ElementorHelpers.createHeadingWidget({
                title: 'Siap Menikmati Makan Malam Spesial?',
                size: 'xl',
                align: 'center',
                headerSize: 'h2',
                color: '#ffffff',
            }),
            ElementorHelpers.createTextEditorWidget({
                content:
                    '<p style="text-align: center; color: #ffffff; font-size: 20px; opacity: 0.95; line-height: 1.6;">Reservasi sekarang dan dapatkan pengalaman kuliner yang tak terlupakan bersama orang terkasih</p>',
                align: 'center',
            }),
            ElementorHelpers.createButtonWidget({
                text: 'Reservasi Sekarang',
                link: '#reservasi',
                align: 'center',
                size: 'xl',
                type: 'primary',
            }),
        ],
        {
            background: ElementorHelpers.createGradientBackground({
                type: 'linear',
                angle: 135,
                colorOne: '#ff6b6b',
                colorTwo: '#ee5a6f',
            }),
            padding: {
                desktop: ElementorHelpers.createPadding({
                    top: 100,
                    right: 20,
                    bottom: 100,
                    left: 20,
                    unit: 'px',
                }),
            },
            gap: {
                desktop: ElementorHelpers.createFlexGap({ size: 25, unit: 'px' }),
            },
            customSettings: {
                flex_align_items: 'center',
                flex_justify_content: 'center',
            },
        },
    );
    design.push(ctaContainer);

    return design;
}

