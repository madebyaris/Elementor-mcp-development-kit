/**
 * Elementor Helper Utilities
 * 
 * Provides helper functions to create proper Elementor data structures
 * that match Elementor's actual format for containers, widgets, and layouts.
 */

type ResponsiveSetting<T = Record<string, unknown>> = {
	desktop?: T;
	tablet?: T;
	mobile?: T;
};

type ReverseOrderOptions = {
	tablet?: boolean;
	mobile?: boolean;
};

type TypographyOptions = {
	fontFamily?: string;
	fontWeight?: string;
	fontStyle?: string;
	textTransform?: string;
	textDecoration?: string;
	fontSize?: number;
	fontSizeTablet?: number;
	fontSizeMobile?: number;
	lineHeight?: number;
	lineHeightTablet?: number;
	lineHeightMobile?: number;
	letterSpacing?: number;
	color?: string;
};

/**
 * Generate a random ID for Elementor elements
 */
function generateId(): string {
	return Math.random().toString(36).substring(2, 9);
}

function toStringValue(value: string | number | undefined): string | undefined {
	if (value === undefined) {
		return undefined;
	}
	return typeof value === 'number' ? String(value) : value;
}

function applyResponsiveSetting(
	settings: Record<string, unknown>,
	key: string,
	value?: ResponsiveSetting,
): void {
	if (!value) {
		return;
	}

	if (value.desktop) {
		settings[key] = value.desktop;
	}

	if (value.tablet) {
		settings[`${key}_tablet`] = value.tablet;
	}

	if (value.mobile) {
		settings[`${key}_mobile`] = value.mobile;
	}
}

function applyReverseOrder(settings: Record<string, unknown>, reverse?: ReverseOrderOptions): void {
	if (!reverse) {
		return;
	}

	if (reverse.tablet) {
		settings.reverse_order_tablet = 'reverse-tablet';
	}

	if (reverse.mobile) {
		settings.reverse_order_mobile = 'reverse-mobile';
	}
}

function applyTypographySettings(settings: Record<string, unknown>, options?: TypographyOptions): void {
	if (!options) {
		return;
	}

	settings.typography_typography = 'custom';

	if (options.fontFamily) {
		settings.typography_font_family = options.fontFamily;
	}

	if (options.fontWeight) {
		settings.typography_font_weight = options.fontWeight;
	}

	if (options.fontStyle) {
		settings.typography_font_style = options.fontStyle;
	}

	if (options.textTransform) {
		settings.typography_text_transform = options.textTransform;
	}

	if (options.textDecoration) {
		settings.typography_text_decoration = options.textDecoration;
	}

	if (options.fontSize !== undefined) {
		settings.typography_font_size = {
			unit: 'px',
			size: toStringValue(options.fontSize),
			sizes: [],
		};
	}

	if (options.fontSizeTablet !== undefined) {
		settings.typography_font_size_tablet = {
			unit: 'px',
			size: toStringValue(options.fontSizeTablet),
			sizes: [],
		};
	}

	if (options.fontSizeMobile !== undefined) {
		settings.typography_font_size_mobile = {
			unit: 'px',
			size: toStringValue(options.fontSizeMobile),
			sizes: [],
		};
	}

	if (options.lineHeight !== undefined) {
		settings.typography_line_height = {
			unit: 'em',
			size: toStringValue(options.lineHeight),
			sizes: [],
		};
	}

	if (options.lineHeightTablet !== undefined) {
		settings.typography_line_height_tablet = {
			unit: 'em',
			size: toStringValue(options.lineHeightTablet),
			sizes: [],
		};
	}

	if (options.lineHeightMobile !== undefined) {
		settings.typography_line_height_mobile = {
			unit: 'em',
			size: toStringValue(options.lineHeightMobile),
			sizes: [],
		};
	}

	if (options.letterSpacing !== undefined) {
		settings.typography_letter_spacing = {
			unit: 'px',
			size: toStringValue(options.letterSpacing),
			sizes: [],
		};
	}

	if (options.color) {
		settings.title_color = options.color;
		settings.text_color = options.color;
	}
}

/**
 * Create a container element (modern Elementor uses containers instead of sections)
 * @param settings - Container settings
 * @param elements - Child elements (widgets or nested containers)
 * @param isInner - Whether this is a nested container (default: false for top-level)
 */
export function createContainer(
	settings: Record<string, unknown> = {},
	elements: unknown[] = [],
	isInner: boolean = false,
): Record<string, unknown> {
	return {
		id: generateId(),
		elType: 'container',
		settings: settings,
		elements: elements,
		isInner: isInner,
	};
}

/**
 * Create a nested container (column/inner container)
 * @param columnSize - Width percentage as string (e.g., "50" for 50%)
 * @param settings - Additional container settings
 * @param elements - Child elements
 */
export function createNestedContainer(
	columnSize: string,
	settings: Record<string, unknown> = {},
	elements: unknown[] = [],
): Record<string, unknown> {
	const nestedSettings: Record<string, unknown> = {
		_column_size: columnSize,
		content_width: 'full',
		...settings,
	};
	return createContainer(nestedSettings, elements, true);
}

/**
 * Create a widget element
 */
export function createWidget(
	widgetType: string,
	settings: Record<string, unknown> = {},
	elements: unknown[] = [],
): Record<string, unknown> {
	return {
		id: generateId(),
		elType: 'widget',
		widgetType: widgetType,
		settings: settings,
		elements: elements,
	};
}

/**
 * Create a heading widget
 */
export function createHeadingWidget(options: {
	title: string;
	size?: 'default' | 'small' | 'medium' | 'large' | 'xl' | 'xxl';
	align?: 'left' | 'center' | 'right' | 'justify';
	headerSize?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p';
	color?: string;
	typographyFontSize?: number;
	typography?: TypographyOptions;
	extraSettings?: Record<string, unknown>;
}): Record<string, unknown> {
	const settings: Record<string, unknown> = {
		title: options.title,
	};

	if (options.size) {
		settings.size = options.size;
	}

	if (options.align) {
		settings.align = options.align;
	}

	if (options.headerSize) {
		settings.header_size = options.headerSize;
	}

	if (options.color) {
		settings.title_color = options.color;
	}

	if (options.typographyFontSize) {
		settings.typography_typography = 'custom';
		settings.typography_font_size = {
			unit: 'px',
			size: String(options.typographyFontSize), // String, not number!
			sizes: [],
		};
	}

	if (options.typography) {
		applyTypographySettings(settings, {
			...options.typography,
			color: options.typography.color ?? options.color,
		});
	}

	if (options.extraSettings) {
		Object.assign(settings, options.extraSettings);
	}

	return createWidget('heading', settings);
}

/**
 * Create a text editor widget
 */
export function createTextEditorWidget(options: {
	content: string;
	align?: 'left' | 'center' | 'right' | 'justify';
	color?: string;
	typography?: TypographyOptions;
	customWidth?: {
		desktop?: { unit?: 'px' | '%'; size: number };
		tablet?: { unit?: 'px' | '%'; size: number };
		mobile?: { unit?: 'px' | '%'; size: number };
	};
	extraSettings?: Record<string, unknown>;
}): Record<string, unknown> {
	const settings: Record<string, unknown> = {
		editor: options.content,
	};

	if (options.align) {
		settings.align = options.align;
	}

	if (options.color) {
		settings.text_color = options.color;
	}

	if (options.typography) {
		applyTypographySettings(settings, options.typography);
	}

	if (options.customWidth?.desktop) {
		settings._element_custom_width = {
			unit: options.customWidth.desktop.unit ?? '%',
			size: toStringValue(options.customWidth.desktop.size),
			sizes: [],
		};
		settings._element_width = 'custom';
	}

	if (options.customWidth?.tablet) {
		settings._element_custom_width_tablet = {
			unit: options.customWidth.tablet.unit ?? '%',
			size: toStringValue(options.customWidth.tablet.size),
			sizes: [],
		};
		settings._element_width_tablet = 'custom';
	}

	if (options.customWidth?.mobile) {
		settings._element_custom_width_mobile = {
			unit: options.customWidth.mobile.unit ?? '%',
			size: toStringValue(options.customWidth.mobile.size),
			sizes: [],
		};
		settings._element_width_mobile = 'custom';
	}

	if (options.extraSettings) {
		Object.assign(settings, options.extraSettings);
	}

	return createWidget('text-editor', settings);
}

/**
 * Create an icon widget
 */
export function createIconWidget(options: {
	icon: string; // e.g., "fas fa-star" or "fa fa-star"
	library?: 'fa-solid' | 'fa-regular' | 'fa-brands';
	align?: 'left' | 'center' | 'right';
	primaryColor?: string;
	secondaryColor?: string; // Required for stacked/framed views
	view?: 'default' | 'stacked' | 'framed';
	shape?: 'square' | 'rounded' | 'circle';
	iconSize?: number;
	iconPadding?: number;
}): Record<string, unknown> {
	const settings: Record<string, unknown> = {
		selected_icon: {
			value: options.icon,
			library: options.library || 'fa-solid',
		},
	};

	if (options.align) {
		settings.align = options.align;
	}

	if (options.primaryColor) {
		settings.primary_color = options.primaryColor;
	}

	if (options.secondaryColor) {
		settings.secondary_color = options.secondaryColor;
	}

	if (options.view) {
		settings.view = options.view;
	}

	if (options.shape) {
		settings.shape = options.shape;
	}

	if (options.iconSize) {
		settings.icon_size = {
			unit: 'px',
			size: String(options.iconSize),
			sizes: [],
		};
	}

	if (options.iconPadding) {
		settings.icon_padding = {
			unit: 'px',
			size: String(options.iconPadding),
			sizes: [],
		};
	}

	return createWidget('icon', settings);
}

/**
 * Create an icon box widget
 */
export function createIconBoxWidget(options: {
	icon: string;
	library?: 'fa-solid' | 'fa-regular' | 'fa-brands';
	title: string;
	description: string;
	align?: 'left' | 'center' | 'right';
}): Record<string, unknown> {
	const settings: Record<string, unknown> = {
		selected_icon: {
			value: options.icon,
			library: options.library || 'fa-solid',
		},
		title_text: options.title,
		description_text: options.description,
	};

	if (options.align) {
		settings.align = options.align;
	}

	return createWidget('icon-box', settings);
}

/**
 * Create an image widget
 */
export function createImageWidget(options: {
	imageUrl?: string;
	imageId?: number;
	imageAlt?: string;
	caption?: string;
	align?: 'left' | 'center' | 'right';
	width?: {
		desktop?: { unit?: '%' | 'px'; size: number };
		tablet?: { unit?: '%' | 'px'; size: number };
		mobile?: { unit?: '%' | 'px'; size: number };
	};
	extraSettings?: Record<string, unknown>;
}): Record<string, unknown> {
	const settings: Record<string, unknown> = {};

	if (options.imageUrl || options.imageId) {
		settings.image = {
			url: options.imageUrl || '',
			id: options.imageId || '',
			alt: options.imageAlt || '',
		};
	}

	if (options.caption) {
		settings.caption_source = 'custom';
		settings.caption = options.caption;
	}

	if (options.align) {
		settings.align = options.align;
	}

	if (options.width?.desktop) {
		settings.width = {
			unit: options.width.desktop.unit ?? '%',
			size: toStringValue(options.width.desktop.size),
			sizes: [],
		};
	}

	if (options.width?.tablet) {
		settings.width_tablet = {
			unit: options.width.tablet.unit ?? '%',
			size: toStringValue(options.width.tablet.size),
			sizes: [],
		};
	}

	if (options.width?.mobile) {
		settings.width_mobile = {
			unit: options.width.mobile.unit ?? '%',
			size: toStringValue(options.width.mobile.size),
			sizes: [],
		};
	}

	if (options.extraSettings) {
		Object.assign(settings, options.extraSettings);
	}

	return createWidget('image', settings);
}

/**
 * Create a button widget
 */
export function createButtonWidget(options: {
	text: string;
	link?: string;
	isExternal?: boolean;
	noFollow?: boolean;
	linkAttributes?: string;
	align?: 'left' | 'center' | 'right';
	size?: 'sm' | 'md' | 'lg' | 'xl';
	type?: 'default' | 'primary' | 'secondary' | 'outline';
	textColor?: string;
	backgroundColor?: string;
	backgroundHoverColor?: string;
	borderColor?: string;
	borderRadius?: number;
	borderWidth?: number;
	textPadding?: { top?: number; right?: number; bottom?: number; left?: number; unit?: 'px' | 'em' | 'rem'; isLinked?: boolean };
	typography?: TypographyOptions;
	iconAlign?: 'left' | 'right';
	iconSpacing?: number;
	extraSettings?: Record<string, unknown>;
}): Record<string, unknown> {
	const settings: Record<string, unknown> = {
		text: options.text,
	};

	if (options.link) {
		settings.link = {
			url: options.link,
			is_external: options.isExternal ? 'on' : undefined,
			nofollow: options.noFollow ? 'on' : undefined,
			custom_attributes: options.linkAttributes,
		};
	}

	if (options.align) {
		settings.align = options.align;
	}

	if (options.size) {
		settings.size = options.size;
	}

	if (options.type) {
		settings.button_type = options.type;
	}

	if (options.textColor) {
		settings.button_text_color = options.textColor;
	}

	if (options.backgroundColor) {
		settings.button_background_color = options.backgroundColor;
	}

	if (options.backgroundHoverColor) {
		settings.button_background_hover_color = options.backgroundHoverColor;
	}

	if (options.borderColor) {
		settings.border_color = options.borderColor;
	}

	if (options.borderRadius !== undefined) {
		settings.border_radius = {
			unit: 'px',
			top: String(options.borderRadius),
			right: String(options.borderRadius),
			bottom: String(options.borderRadius),
			left: String(options.borderRadius),
			isLinked: '1',
		};
	}

	if (options.borderWidth !== undefined) {
		settings.border_width = {
			unit: 'px',
			top: String(options.borderWidth),
			right: String(options.borderWidth),
			bottom: String(options.borderWidth),
			left: String(options.borderWidth),
			isLinked: '1',
		};
		settings.border_border = 'solid';
	}

	if (options.textPadding) {
		settings.text_padding = {
			unit: options.textPadding.unit ?? 'px',
			top: String(options.textPadding.top ?? 0),
			right: String(options.textPadding.right ?? 0),
			bottom: String(options.textPadding.bottom ?? 0),
			left: String(options.textPadding.left ?? 0),
			isLinked: options.textPadding.isLinked ? '1' : '',
		};
	}

	if (options.typography) {
		applyTypographySettings(settings, options.typography);
	}

	if (options.iconAlign) {
		settings.icon_align = options.iconAlign;
	}

	if (options.iconSpacing !== undefined) {
		settings.icon_indent = {
			unit: 'px',
			size: String(options.iconSpacing),
			sizes: [],
		};
	}

	if (options.extraSettings) {
		Object.assign(settings, options.extraSettings);
	}

	return createWidget('button', settings);
}

/**
 * Create a full-width container layout
 */
type ContainerOptions = {
	contentWidth?: 'full' | 'boxed';
	boxedWidth?: number;
	flexDirection?: 'row' | 'column';
	gap?: ResponsiveSetting;
	padding?: ResponsiveSetting;
	margin?: ResponsiveSetting;
	minHeight?: ResponsiveSetting;
	background?: Record<string, unknown>;
	structure?: string;
	reverseOrder?: ReverseOrderOptions;
	link?: Record<string, unknown>;
	customSettings?: Record<string, unknown>;
};

export function createFullWidthLayout(
	elements: unknown[],
	options?: ContainerOptions,
): Record<string, unknown> {
	const settings: Record<string, unknown> = {
		layout: 'full_width',
		content_width: options?.contentWidth ?? 'full',
		flex_direction: options?.flexDirection ?? 'column',
	};

	applyResponsiveSetting(
		settings,
		'flex_gap',
		options?.gap ?? { desktop: createFlexGap({ size: 0 }) },
	);
	applyResponsiveSetting(settings, 'padding', options?.padding);
	applyResponsiveSetting(settings, 'margin', options?.margin);
	applyResponsiveSetting(settings, 'min_height', options?.minHeight);

	if (options?.background) {
		Object.assign(settings, options.background);
	}

	if (options?.structure) {
		settings.structure = options.structure;
	}

	if (options?.contentWidth === 'boxed' && options.boxedWidth !== undefined) {
		settings.boxed_width = {
			unit: 'px',
			size: String(options.boxedWidth),
			sizes: [],
		};
	}

	applyReverseOrder(settings, options?.reverseOrder);

	if (options?.link) {
		settings.link = options.link;
	}

	if (options?.customSettings) {
		Object.assign(settings, options.customSettings);
	}

	return createContainer(settings, elements, false);
}

/**
 * Create a container with max-width content (centered/boxed)
 */
export function createContentContainer(
	elements: unknown[],
	maxWidth: number = 1200,
	options?: Omit<ContainerOptions, 'contentWidth' | 'boxedWidth'>,
): Record<string, unknown> {
	const settings: Record<string, unknown> = {
		layout: 'full_width',
		content_width: 'boxed',
		boxed_width: {
			unit: 'px',
			size: String(maxWidth),
			sizes: [],
		},
		flex_direction: options?.flexDirection ?? 'column',
	};

	applyResponsiveSetting(
		settings,
		'flex_gap',
		options?.gap ?? { desktop: createFlexGap({ size: 0 }) },
	);
	applyResponsiveSetting(settings, 'padding', options?.padding);
	applyResponsiveSetting(settings, 'margin', options?.margin);
	applyResponsiveSetting(settings, 'min_height', options?.minHeight);

	if (options?.background) {
		Object.assign(settings, options.background);
	}

	if (options?.structure) {
		settings.structure = options.structure;
	}

	applyReverseOrder(settings, options?.reverseOrder);

	if (options?.link) {
		settings.link = options.link;
	}

	if (options?.customSettings) {
		Object.assign(settings, options.customSettings);
	}

	return createContainer(settings, elements, false);
}

/**
 * Create a gradient background setting
 */
export function createGradientBackground(options: {
	type?: 'linear' | 'radial';
	angle?: number;
	colorOne: string;
	colorTwo: string;
}): Record<string, unknown> {
	return {
		background_background: 'gradient',
		background_gradient_type: options.type || 'linear',
		background_gradient_angle: {
			unit: 'deg',
			size: String(options.angle || 135), // String, not number!
		},
		background_gradient_color_one: options.colorOne,
		background_gradient_color_two: options.colorTwo,
	};
}

/**
 * Create a solid color background setting
 */
export function createSolidBackground(color: string): Record<string, unknown> {
	return {
		background_background: 'classic',
		background_color: color,
	};
}

/**
 * Create padding settings (values are strings in Elementor)
 */
export function createPadding(options: {
	top?: number;
	right?: number;
	bottom?: number;
	left?: number;
	unit?: 'px' | 'em' | 'rem' | '%' | 'vh' | 'vw';
	isLinked?: boolean | string;
}): Record<string, unknown> {
	return {
		unit: options.unit || 'px',
		top: String(options.top || 0),
		right: String(options.right || 0),
		bottom: String(options.bottom || 0),
		left: String(options.left || 0),
		isLinked: options.isLinked === true ? '1' : options.isLinked === false ? '' : '',
	};
}

/**
 * Create a scalar object (e.g., min_height) with proper structure
 */
export function createScalarValue(options: {
	unit?: 'px' | 'vh' | 'vw' | '%';
	size: number | string;
}): Record<string, unknown> {
	return {
		unit: options.unit ?? 'px',
		size: toStringValue(options.size),
		sizes: [],
	};
}

/**
 * Create flex gap settings (column and row are strings)
 */
export function createFlexGap(options: {
	size: number;
	unit?: 'px' | 'em' | 'rem' | '%';
	column?: number;
	row?: number;
	isLinked?: boolean;
}): Record<string, unknown> {
	const column = options.column !== undefined ? options.column : options.size;
	const row = options.row !== undefined ? options.row : options.size;
	return {
		size: options.size,
		unit: options.unit || 'px',
		column: String(column),
		row: String(row),
		isLinked: options.isLinked !== false,
	};
}

/**
 * Create a row container with flex layout
 */
export function createRowContainer(
	elements: unknown[],
	options?: {
		gap?: ResponsiveSetting;
		justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
		alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
		wrap?: boolean;
		background?: Record<string, unknown>;
		padding?: ResponsiveSetting;
		margin?: ResponsiveSetting;
		isInner?: boolean;
		customSettings?: Record<string, unknown>;
	},
): Record<string, unknown> {
	const settings: Record<string, unknown> = {
		content_width: 'full',
		flex_direction: 'row',
	};

	applyResponsiveSetting(
		settings,
		'flex_gap',
		options?.gap ?? { desktop: createFlexGap({ size: 0 }) },
	);

	if (options?.justifyContent) {
		settings.flex_justify_content = options.justifyContent;
	}

	if (options?.alignItems) {
		settings.flex_align_items = options.alignItems;
	}

	if (options?.wrap) {
		settings.flex_wrap = 'wrap';
	}

	if (options?.background) {
		Object.assign(settings, options.background);
	}

	applyResponsiveSetting(settings, 'padding', options?.padding);
	applyResponsiveSetting(settings, 'margin', options?.margin);

	if (options?.customSettings) {
		Object.assign(settings, options.customSettings);
	}

	return createContainer(settings, elements, options?.isInner ?? false);
}

