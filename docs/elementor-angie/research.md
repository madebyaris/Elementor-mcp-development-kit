# Elementor Angie Research

_Last updated: 2025-11-14_

## TL;DR
- The bundled Angie plugin (`apps/wordpress/wp-content/plugins/angie`) is a modular shell that boots multiple feature modules via `includes/modules-manager.php`.
- “Premium” behavior is enforced indirectly: most advanced modules require both consent (`angie_external_scripts_consent`) and the custom `use_angie` capability, not a license check. The remote UI bundle (served by Elementor) likely performs the real subscription validation.
- Elementor is optional at runtime, but many modules no-op without it (Elementor Core, Sidebar hooks, Kit provider, Elementor Settings REST endpoints). A fork must supply Gutenberg/native fallbacks if Elementor is absent.
- Angie’s UI lives in an iframe/overlay powered by the remote script `https://editor-static-bucket.elementor.com/angie.umd.cjs`. Replacing that script (plus OAuth + consent copy) is mandatory for a non-Elementor release.
- Elementor publicly ships an [Angie SDK](https://github.com/elementor/angie-sdk) for registering browser-based MCP servers. It documents the expected front-end contract (tool registration, prompts, etc.)—handy reference when authoring our own bundle.

## Plugin Boot Sequence
1. `angie.php` defines constants and instantiates the `Angie` class.
2. `Angie::init()` includes `plugin.php`, which in turn creates a singleton `\Angie\Plugin`.
3. `Plugin::__construct()` registers a PSR-ish autoloader, optionally loads `vendor/autoload.php`, and calls `init()`.
4. `init()` includes `includes/modules-manager.php` and instantiates `\Angie\Manager`.
5. `Manager::__construct()` loops over `self::get_module_list()`:
   - `AngieApp`, `ElementorCore`, `ConsentManager`, `AcfRestApi`, `ThemeManager`, `PluginManager`, `Navigation`, `AngieSettings`, `ElementorPro`, `Notifications`, `Sidebar`.
   - Each module extends `Classes\Module_Base` (singleton with `instance()`, `register_components()`, etc.).
   - Modules decide whether to activate by overriding `is_active()`.

## Capability & Consent Gates
- Activation hook (`Angie::activate_plugin()`) grants administrators the custom capability `use_angie` via `Classes/angie-capability-manager.php` and sets the transient `angie_activation_redirect`.
- `AngieApp::is_active()` returns `current_user_can('use_angie')` — only those users see the UI.
- `ConsentManager::has_consent()` checks the option `angie_external_scripts_consent` (default `no`).
- Modules such as `Sidebar` (`modules/sidebar/module.php`) require both capability and consent: `ConsentManagerModule::has_consent() && current_user_can('use_angie')`.
- The consent UI (modules/consent-manager/components/{consent-page, consent-notice}.php) links to Elementor’s TOS/privacy pages and stores the user’s choice.

## Module Matrix
| Module | File | Activation Rule | Notes |
| --- | --- | --- | --- |
| AngieApp | `modules/angie-app/module.php` | `current_user_can('use_angie')` | Registers admin menu, enqueues remote Angie bundle, handles OAuth query params. |
| ConsentManager | `modules/consent-manager/module.php` | Always active | Manages consent option and renders consent page/notice. |
| ElementorCore | `modules/elementor-core/module.php` | `ConsentManager::has_consent()` **and** `Utils::is_plugin_active('elementor/elementor.php')` | Provides kit REST endpoints, enqueues scripts inside Elementor editor. |
| ElementorPro | `modules/elementor-pro/module.php` | Always active | Adds status info for Elementor Pro via `angie_mcp_plugins` filter (no gating). |
| Sidebar | `modules/sidebar/module.php` | `ConsentManager::has_consent() && current_user_can('use_angie')` | Injects iframe/sidebar into Elementor editor via `elementor/editor/*` hooks. |
| PluginManager | `modules/plugin-manager` | Always active | REST endpoints for plugin search/install, uses WP.org APIs. |
| ThemeManager | `modules/theme-manager` | Always active | REST endpoints for theme install/update. |
| Navigation | `modules/navigation` | Always active | Provides menu provider for the remote UI.
| AngieSettings | `modules/angie-settings` | Always active | REST endpoints for Angie settings, Elementor settings, WordPress options. |

## Elementor-Specific Touchpoints
1. **Module Activation** – `ElementorCore::is_active()` ensures nothing loads without Elementor installed **and** consent granted.
2. **Kit Provider** – `modules/elementor-core/components/kit-provider.php` exposes REST routes (`angie/v1/elementor-kit/*`) that call into Elementor classes (documents, settings). Without Elementor these routes never register, meaning the remote UI cannot fetch layout/theme data.
3. **REST Guardrails** – `AngieSettings\Components\Elementor_Settings::get_supported_post_types()` returns `WP_Error('elementor_not_active', ...)` when Elementor is missing. Any front-end expecting data must handle or replace this endpoint.
4. **Sidebar Hooks** – Components under `modules/sidebar/components` hook into `elementor/editor/init`, `elementor/editor/after_enqueue_scripts`, etc. Gutenberg or custom editor support would need equivalent hooks (e.g., `enqueue_block_editor_assets`).
5. **Plugin metadata** – `angie.php` advertises Elementor URLs (plugin URI, author). Consent pages also reference Elementor-branded assets (`go.elementor.com/*`).

## Remote Bundle & OAuth
- `modules/angie-app/components/angie-app.php` enqueues:
  ```php
  wp_enqueue_script(
      'angie-app',
      'https://editor-static-bucket.elementor.com/angie.umd.cjs',
      ['wp-api-request'],
      ANGIE_VERSION,
      false
  );
  ```
- Before the script tag, it injects `window.angieConfig` with:
  - `plugins` (Elementor/WooCommerce/etc. status via `apply_filters('angie_mcp_plugins', [])`).
  - `postTypesNames` (all CPTs with `show_in_menu` & `show_in_rest`).
  - `siteKey` stored in the option `elementor_connect_site_key`.
  - Current WP user display name and role (marked “untrusted”).
- OAuth helpers (`is_oauth_flow_active()`) look for `?start-oauth`, `?oauth_code`, `?oauth_state` query params. Completion triggers sidebar open + page reload to update available MCP servers.
- Because all business logic lives in that remote script, any fork must ship a replacement bundle and reimplement OAuth or token authentication.

## REST API Inventory
| Route | Component | Purpose | Elementor Dependency |
| --- | --- | --- | --- |
| `angie/v1/settings/<name>` | `AngieSettings\Components\Settings` | Store/retrieve JSON settings (`_angie_<name>`). | None |
| `angie/v1/settings/website-uuid` | same | Returns site UUID (creates if missing). | None |
| `angie/v1/elementor-settings/*` | `AngieSettings\Components\Elementor_Settings` | Exposes Elementor-supported post types. | **Requires Elementor**, otherwise WP_Error |
| `angie/v1/wp-options` (GET/POST) | `AngieSettings\Components\WP_Options` | Safe proxy for core WP options, site health. | None |
| `angie/v1/plugins/*` | `PluginManager\Components\Plugin_Searcher` | Search WP.org, fetch info, check updates. | None |
| `angie/v1/theme-manager/*` | `ThemeManager` components | Install/activate/delete themes. | None |
| `angie/v1/elementor-kit/*` | `ElementorCore\Components\Kit_Provider` | CRUD for Elementor kit settings. | **Requires Elementor** |

## External SDK Reference
Elementor publishes [`@elementor/angie-sdk`](https://github.com/elementor/angie-sdk) — an MCP helper that runs inside the browser, registers custom MCP servers, and triggers Angie prompts. Key takeaways:
- Confirms Angie uses the Model Context Protocol (MCP) on the front end.
- SDK exposes `AngieMcpSdk`, `McpServer`, and helper schemas for registering tools/resources.
- Documentation covers tool discovery, tool execution, remote SSE/HTTP streamable servers, and custom prompts.
- No private backend docs are provided publicly; SDK README is the only technical reference outside this codebase.

## Implications for a Custom “Angie”
1. **Bundle Replacement** – Need our own front-end (iframe/sidebar + chat UI) that honors the `window.angieConfig` contract or redefines it. Also swap OAuth + consent flows.
2. **Module Overrides** – Either strip Elementor-specific modules or provide alternative implementations (e.g., `GutenbergCore` module). Keep consent/capability gating to control who sees the assistant.
3. **REST Parity** – Decide which `angie/v1/*` routes remain. For missing data (kit, Elementor settings), build replacements backed by Gutenberg, site options, or custom metadata.
4. **Consent & Legal** – Update consent copy to reference our org, not Elementor. Store consent under a new option name if we don’t want to reuse `angie_external_scripts_consent`.
5. **Branding & Metadata** – Update plugin header, readme, assets, and admin copy so users know it’s our fork.
6. **Extensibility Story** – If we keep MCP compatibility, document how third parties can hook in (potentially referencing the public SDK for guidance).

## Open Questions
- What minimum features must the assistant support when Elementor is absent? (e.g., Should we read/write Gutenberg blocks, manage themes/plugins, or focus on site settings?)
- Do we want to keep MCP on the front end, or rebuild the assistant as a PHP/REST service talking to our MCP server (apps/wp-mcp-server)?
- How will we enforce licensing/subscription once the Elementor infrastructure is removed?

---
_References: [elementor/angie-sdk](https://github.com/elementor/angie-sdk)_
