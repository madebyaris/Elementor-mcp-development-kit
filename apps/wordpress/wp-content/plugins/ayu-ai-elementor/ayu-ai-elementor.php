<?php
/**
 * Plugin Name: AYU AI Elementor
 * Plugin URI: https://github.com/madebyaris/Elementor-mcp-development-kit
 * Description: Open-source AI assistant for WordPress with MCP support and Elementor integration
 * Version: 0.1.0
 * Author: AYU AI Contributors
 * Author URI: https://github.com/madebyaris/Elementor-mcp-development-kit
 * License: MIT
 * License URI: https://opensource.org/licenses/MIT
 * Text Domain: ayu-ai-elementor
 * Requires at least: 6.5
 * Requires PHP: 7.4
 *
 * @package AYU_AI_Elementor
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'AYU_VERSION', '0.1.0' );
define( 'AYU_PATH', plugin_dir_path( __FILE__ ) );
define( 'AYU_URL', plugin_dir_url( __FILE__ ) );
define( 'AYU_INCLUDES', AYU_PATH . 'includes/' );

// Load core files
require_once AYU_INCLUDES . 'class-auth.php';
require_once AYU_INCLUDES . 'class-rest-api.php';
require_once AYU_INCLUDES . 'class-admin.php';
require_once AYU_INCLUDES . 'class-audit-log.php';
require_once AYU_INCLUDES . 'class-elementor-rest-api.php';

/**
 * Initialize plugin
 */
function ayu_ai_elementor_init() {
	AYU_REST_API::init();
	AYU_Admin::init();
	AYU_Audit_Log::init();
	AYU_Elementor_REST_API::init();
}
add_action( 'plugins_loaded', 'ayu_ai_elementor_init' );

/**
 * Activation hook
 */
function ayu_ai_elementor_activate() {
	// Add capability to administrators
	$admin_role = get_role( 'administrator' );
	if ( $admin_role ) {
		$admin_role->add_cap( 'use_ayu' );
	}
}
register_activation_hook( __FILE__, 'ayu_ai_elementor_activate' );

/**
 * Uninstall hook
 */
function ayu_ai_elementor_uninstall() {
	// Cleanup can be added here if needed
}
register_uninstall_hook( __FILE__, 'ayu_ai_elementor_uninstall' );

