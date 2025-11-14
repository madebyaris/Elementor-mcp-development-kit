import * as ElementorHelpers from './elementor-helpers.js';

type HeroPresetOptions = {
    eyebrow?: string;
    title: string;
    description?: string;
    button?: {
        text: string;
        link?: string;
    };
    secondaryButton?: {
        text: string;
        link?: string;
    };
    image?: {
        url?: string;
        id?: number;
        alt?: string;
    };
    layout?: 'image-left' | 'image-right';
    background?: Record<string, unknown>;
};

type CardItem = {
    title: string;
    meta: string;
    image?: {
        url?: string;
        id?: number;
        alt?: string;
    };
};

type CardGridOptions = {
    heading?: string;
    description?: string;
    cards: CardItem[];
    columns?: 3 | 4;
    maxWidth?: number;
    background?: Record<string, unknown>;
};

type FeatureItem = {
    icon?: string;
    title: string;
    description: string;
};

type FeatureListOptions = {
    heading?: string;
    description?: string;
    items: FeatureItem[];
    background?: Record<string, unknown>;
};

type TestimonialItem = {
    quote: string;
    name: string;
    role?: string;
    imageUrl?: string;
    imageId?: number;
};

type TestimonialStripOptions = {
    heading?: string;
    subheading?: string;
    items: TestimonialItem[];
    background?: Record<string, unknown>;
};

export function buildHeroTextImageSection(options: HeroPresetOptions): Record<string, unknown> {
    const order = options.layout === 'image-left' ? ['image', 'text'] : ['text', 'image'];

    const textColumn = ElementorHelpers.createNestedContainer(
        '50',
        {
            flex_direction: 'column',
            flex_gap: ElementorHelpers.createFlexGap({ size: 20, unit: 'px' }),
            padding: ElementorHelpers.createPadding({ unit: 'px', top: 0, right: 20, bottom: 0, left: 20 }),
        },
        [
            options.eyebrow
                ? ElementorHelpers.createHeadingWidget({
                    title: options.eyebrow,
                    headerSize: 'h6',
                    color: '#ff6b6b',
                    typography: {
                        fontSize: 18,
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: 3,
                    },
                })
                : null,
            ElementorHelpers.createHeadingWidget({
                title: options.title,
                size: 'xl',
                headerSize: 'h1',
                color: '#1C244B',
                typography: {
                    fontSize: 64,
                    fontSizeTablet: 48,
                    fontSizeMobile: 32,
                    fontWeight: '600',
                    lineHeight: 1.1,
                },
            }),
            options.description
                ? ElementorHelpers.createTextEditorWidget({
                    content: `<p style="color:#4a4a4a; font-size: 18px; line-height: 1.6;">${options.description}</p>`,
                })
                : null,
            options.button
                ? ElementorHelpers.createButtonWidget({
                    text: options.button.text,
                    link: options.button.link,
                    align: 'left',
                    size: 'lg',
                    type: 'primary',
                    textColor: '#ffffff',
                    backgroundColor: '#ff6b6b',
                    borderRadius: 50,
                    textPadding: { top: 16, right: 32, bottom: 16, left: 32, unit: 'px' },
                })
                : null,
            options.secondaryButton
                ? ElementorHelpers.createButtonWidget({
                    text: options.secondaryButton.text,
                    link: options.secondaryButton.link,
                    align: 'left',
                    size: 'md',
                    type: 'outline',
                    textColor: '#ff6b6b',
                    borderColor: '#ff6b6b',
                    borderWidth: 2,
                    borderRadius: 50,
                    textPadding: { top: 12, right: 28, bottom: 12, left: 28, unit: 'px' },
                })
                : null,
        ].filter(Boolean) as Record<string, unknown>[],
    );

    const imageColumn = ElementorHelpers.createNestedContainer(
        '50',
        {
            flex_direction: 'column',
            flex_align_items: 'center',
            padding: ElementorHelpers.createPadding({ unit: 'px', top: 0, right: 20, bottom: 0, left: 20 }),
        },
        [
            ElementorHelpers.createImageWidget({
                imageUrl: options.image?.url,
                imageId: options.image?.id,
                imageAlt: options.image?.alt,
                width: {
                    desktop: { unit: '%', size: 100 },
                    tablet: { unit: '%', size: 100 },
                    mobile: { unit: '%', size: 100 },
                },
            }),
        ],
    );

    const children = order[0] === 'image' ? [imageColumn, textColumn] : [textColumn, imageColumn];

    return ElementorHelpers.createFullWidthLayout(children, {
        flexDirection: 'row',
        gap: {
            desktop: ElementorHelpers.createFlexGap({ size: 40, unit: 'px' }),
            mobile: ElementorHelpers.createFlexGap({ size: 20, unit: 'px' }),
        },
        padding: {
            desktop: ElementorHelpers.createPadding({ unit: 'px', top: 80, right: 40, bottom: 80, left: 40 }),
            mobile: ElementorHelpers.createPadding({ unit: 'px', top: 40, right: 20, bottom: 40, left: 20 }),
        },
        background: options.background ?? ElementorHelpers.createSolidBackground('#ffffff'),
        customSettings: {
            flex_direction_tablet: 'column',
            flex_direction_mobile: 'column',
            flex_align_items: 'center',
        },
    });
}

export function buildCardGridSection(options: CardGridOptions): Record<string, unknown> {
    const columns = options.columns ?? 3;
    const columnSize = columns === 4 ? '25' : '33';

    const cards = options.cards.map((card) =>
        ElementorHelpers.createNestedContainer(
            columnSize,
            {
                flex_direction: 'column',
                flex_gap: ElementorHelpers.createFlexGap({ size: 10, unit: 'px' }),
                background_background: 'classic',
                background_color: '#ffffff',
                border_radius: {
                    unit: 'px',
                    top: '16',
                    right: '16',
                    bottom: '16',
                    left: '16',
                    isLinked: '1',
                },
                box_shadow_box_shadow_type: 'yes',
                box_shadow_box_shadow: {
                    horizontal: 0,
                    vertical: 10,
                    blur: 30,
                    spread: 0,
                    color: 'rgba(0,0,0,0.08)',
                },
                padding: ElementorHelpers.createPadding({ unit: 'px', top: 0, right: 0, bottom: 16, left: 0 }),
            },
            [
                card.image
                    ? ElementorHelpers.createImageWidget({
                        imageUrl: card.image.url,
                        imageId: card.image.id,
                        imageAlt: card.image.alt,
                        width: {
                            desktop: { unit: '%', size: 100 },
                        },
                    })
                    : null,
                ElementorHelpers.createHeadingWidget({
                    title: card.title,
                    size: 'small',
                    align: 'left',
                    headerSize: 'h3',
                    color: '#222222',
                }),
                ElementorHelpers.createTextEditorWidget({
                    content: `<p style="font-size:14px;color:#717171;margin:0;">${card.meta}</p>`,
                    align: 'left',
                }),
            ].filter(Boolean) as Record<string, unknown>[],
        ),
    );

    const row = ElementorHelpers.createRowContainer(cards, {
        isInner: true,
        wrap: true,
        gap: {
            desktop: ElementorHelpers.createFlexGap({ size: 24, unit: 'px' }),
            mobile: ElementorHelpers.createFlexGap({ size: 16, unit: 'px' }),
        },
    });

    const elements: Record<string, unknown>[] = [];

    if (options.heading) {
        elements.push(
            ElementorHelpers.createHeadingWidget({
                title: options.heading,
                size: 'large',
                headerSize: 'h2',
                color: '#222222',
            }),
        );
    }

    if (options.description) {
        elements.push(
            ElementorHelpers.createTextEditorWidget({
                content: `<p style="font-size: 18px; color: #717171;">${options.description}</p>`,
                align: 'left',
            }),
        );
    }

    elements.push(row);

    return ElementorHelpers.createContentContainer(elements, options.maxWidth ?? 1200, {
        padding: {
            desktop: ElementorHelpers.createPadding({ unit: 'px', top: 60, right: 20, bottom: 60, left: 20 }),
        },
        background: options.background,
    });
}

export function buildFeatureListSection(options: FeatureListOptions): Record<string, unknown> {
    const items = options.items.map((item) =>
        ElementorHelpers.createNestedContainer(
            '33',
            {
                flex_direction: 'column',
                flex_align_items: 'flex-start',
                flex_gap: ElementorHelpers.createFlexGap({ size: 12, unit: 'px' }),
                padding: ElementorHelpers.createPadding({ unit: 'px', top: 20, right: 20, bottom: 20, left: 20 }),
            },
            [
                item.icon
                    ? ElementorHelpers.createIconWidget({
                        icon: item.icon,
                        align: 'left',
                        view: 'stacked',
                        shape: 'circle',
                        primaryColor: '#ff6b6b',
                        secondaryColor: '#ffffff',
                        iconSize: 32,
                        iconPadding: 18,
                    })
                    : null,
                ElementorHelpers.createHeadingWidget({
                    title: item.title,
                    size: 'medium',
                    headerSize: 'h4',
                    color: '#222222',
                }),
                ElementorHelpers.createTextEditorWidget({
                    content: `<p style="font-size: 15px; color: #666666; line-height: 1.6;">${item.description}</p>`,
                    align: 'left',
                }),
            ].filter(Boolean) as Record<string, unknown>[],
        ),
    );

    const row = ElementorHelpers.createRowContainer(items, {
        isInner: true,
        wrap: true,
        gap: {
            desktop: ElementorHelpers.createFlexGap({ size: 24, unit: 'px' }),
        },
    });

    const elements: Record<string, unknown>[] = [];
    if (options.heading) {
        elements.push(
            ElementorHelpers.createHeadingWidget({
                title: options.heading,
                size: 'large',
                headerSize: 'h2',
                color: '#1C244B',
            }),
        );
    }

    if (options.description) {
        elements.push(
            ElementorHelpers.createTextEditorWidget({
                content: `<p style="font-size: 18px; color: #717171;">${options.description}</p>`,
            }),
        );
    }

    elements.push(row);

    return ElementorHelpers.createContentContainer(elements, 1200, {
        padding: {
            desktop: ElementorHelpers.createPadding({ unit: 'px', top: 80, right: 20, bottom: 80, left: 20 }),
        },
        background: options.background ?? ElementorHelpers.createSolidBackground('#f7faff'),
    });
}

export function buildTestimonialStrip(options: TestimonialStripOptions): Record<string, unknown> {
    const cards = options.items.map((item) =>
        ElementorHelpers.createNestedContainer(
            '33',
            {
                flex_direction: 'column',
                flex_gap: ElementorHelpers.createFlexGap({ size: 12, unit: 'px' }),
                padding: ElementorHelpers.createPadding({ unit: 'px', top: 24, right: 24, bottom: 24, left: 24 }),
                background_background: 'classic',
                background_color: '#ffffff',
                box_shadow_box_shadow_type: 'yes',
                box_shadow_box_shadow: {
                    horizontal: 0,
                    vertical: 8,
                    blur: 26,
                    spread: 0,
                    color: 'rgba(0,0,0,0.08)',
                },
                border_radius: {
                    unit: 'px',
                    top: '18',
                    right: '18',
                    bottom: '18',
                    left: '18',
                    isLinked: '1',
                },
            },
            [
                ElementorHelpers.createTextEditorWidget({
                    content: `<p style="font-size: 16px; color:#404040; line-height:1.7;">“${item.quote}”</p>`,
                }),
                ElementorHelpers.createHeadingWidget({
                    title: item.name,
                    size: 'small',
                    headerSize: 'h4',
                    color: '#111111',
                }),
                item.role
                    ? ElementorHelpers.createTextEditorWidget({
                        content: `<p style="font-size: 14px; color:#888888;">${item.role}</p>`,
                    })
                    : null,
            ].filter(Boolean) as Record<string, unknown>[],
        ),
    );

    const row = ElementorHelpers.createRowContainer(cards, {
        isInner: true,
        wrap: true,
        gap: {
            desktop: ElementorHelpers.createFlexGap({ size: 24, unit: 'px' }),
        },
    });

    const elements: Record<string, unknown>[] = [];
    if (options.heading) {
        elements.push(
            ElementorHelpers.createHeadingWidget({
                title: options.heading,
                size: 'large',
                headerSize: 'h2',
                color: '#ffffff',
            }),
        );
    }

    if (options.subheading) {
        elements.push(
            ElementorHelpers.createTextEditorWidget({
                content: `<p style="font-size: 18px; color:#f0f0f0;">${options.subheading}</p>`,
            }),
        );
    }

    elements.push(row);

    return ElementorHelpers.createFullWidthLayout(elements, {
        padding: {
            desktop: ElementorHelpers.createPadding({ unit: 'px', top: 100, right: 40, bottom: 100, left: 40 }),
        },
        background:
            options.background ??
            ElementorHelpers.createGradientBackground({
                type: 'linear',
                angle: 140,
                colorOne: '#1c1e2b',
                colorTwo: '#363a5b',
            }),
    });
}

