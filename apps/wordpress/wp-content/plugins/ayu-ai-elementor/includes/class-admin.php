<?php
/**
 * Admin Interface
 *
 * @package AYU_AI_Elementor
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class AYU_Admin
 *
 * Handles admin UI for token management and settings
 */
class AYU_Admin {

	/**
	 * Initialize admin
	 */
	public static function init() {
		add_action( 'admin_menu', [ __CLASS__, 'add_admin_menu' ] );
		add_action( 'admin_enqueue_scripts', [ __CLASS__, 'enqueue_scripts' ] );
		add_action( 'wp_ajax_ayu_create_token', [ __CLASS__, 'ajax_create_token' ] );
		add_action( 'wp_ajax_ayu_revoke_token', [ __CLASS__, 'ajax_revoke_token' ] );
	}

	/**
	 * Add admin menu
	 */
	public static function add_admin_menu() {
		add_menu_page(
			__( 'AYU AI', 'ayu-ai-elementor' ),
			__( 'AYU AI', 'ayu-ai-elementor' ),
			'use_ayu',
			'ayu-ai',
			[ __CLASS__, 'render_main_page' ],
			'dashicons-admin-generic',
			30
		);

		add_submenu_page(
			'ayu-ai',
			__( 'Tokens', 'ayu-ai-elementor' ),
			__( 'Tokens', 'ayu-ai-elementor' ),
			'use_ayu',
			'ayu-ai-tokens',
			[ __CLASS__, 'render_tokens_page' ]
		);

		add_submenu_page(
			'ayu-ai',
			__( 'Settings', 'ayu-ai-elementor' ),
			__( 'Settings', 'ayu-ai-elementor' ),
			'manage_options',
			'ayu-ai-settings',
			[ __CLASS__, 'render_settings_page' ]
		);

		add_submenu_page(
			'ayu-ai',
			__( 'Audit Log', 'ayu-ai-elementor' ),
			__( 'Audit Log', 'ayu-ai-elementor' ),
			'manage_options',
			'ayu-ai-logs',
			[ __CLASS__, 'render_logs_page' ]
		);
	}

	/**
	 * Enqueue admin scripts
	 */
	public static function enqueue_scripts( $hook ) {
		if ( strpos( $hook, 'ayu-ai' ) === false ) {
			return;
		}

		wp_enqueue_style( 'ayu-admin', AYU_URL . 'assets/admin.css', [], AYU_VERSION );
		wp_enqueue_script( 'ayu-admin', AYU_URL . 'assets/admin.js', [ 'jquery' ], AYU_VERSION, true );
		wp_localize_script( 'ayu-admin', 'ayuAdmin', [
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'nonce' => wp_create_nonce( 'ayu-admin' ),
		] );
	}

	/**
	 * Render main page
	 */
	public static function render_main_page() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'AYU AI Elementor', 'ayu-ai-elementor' ); ?></h1>
			<div class="ayu-welcome">
				<h2><?php esc_html_e( 'Welcome to AYU AI', 'ayu-ai-elementor' ); ?></h2>
				<p><?php esc_html_e( 'AYU AI is an open-source AI assistant for WordPress that works with MCP-compatible clients like Cursor.', 'ayu-ai-elementor' ); ?></p>
				<h3><?php esc_html_e( 'Quick Start', 'ayu-ai-elementor' ); ?></h3>
				<ol>
					<li><?php esc_html_e( 'Go to Tokens page to create a Personal Access Token', 'ayu-ai-elementor' ); ?></li>
					<li><?php esc_html_e( 'Configure your MCP client (Cursor) with the token', 'ayu-ai-elementor' ); ?></li>
					<li><?php esc_html_e( 'Start using AYU AI tools in Cursor', 'ayu-ai-elementor' ); ?></li>
				</ol>
				<p>
					<a href="<?php echo esc_url( admin_url( 'admin.php?page=ayu-ai-tokens' ) ); ?>" class="button button-primary">
						<?php esc_html_e( 'Create Token', 'ayu-ai-elementor' ); ?>
					</a>
					<a href="<?php echo esc_url( admin_url( 'admin.php?page=ayu-ai-settings' ) ); ?>" class="button">
						<?php esc_html_e( 'Settings', 'ayu-ai-elementor' ); ?>
					</a>
				</p>
			</div>
		</div>
		<?php
	}

	/**
	 * Render tokens page
	 */
	public static function render_tokens_page() {
		$tokens = AYU_Auth::get_user_tokens( get_current_user_id() );
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Personal Access Tokens', 'ayu-ai-elementor' ); ?></h1>

			<div class="ayu-token-form">
				<h2><?php esc_html_e( 'Create New Token', 'ayu-ai-elementor' ); ?></h2>
				<form id="ayu-create-token-form">
					<table class="form-table">
						<tr>
							<th><label for="token-scopes"><?php esc_html_e( 'Scopes', 'ayu-ai-elementor' ); ?></label></th>
							<td>
								<fieldset>
									<div class="ayu-select-all-wrapper">
										<label class="ayu-select-all-label">
											<input type="checkbox" id="ayu-select-all-scopes" class="ayu-select-all-checkbox">
											<strong><?php esc_html_e( 'Select All', 'ayu-ai-elementor' ); ?></strong>
										</label>
									</div>
									<div class="ayu-scopes-list">
										<label><input type="checkbox" name="scopes[]" value="read:posts" class="ayu-scope-checkbox"> <?php esc_html_e( 'Read Posts', 'ayu-ai-elementor' ); ?></label><br>
										<label><input type="checkbox" name="scopes[]" value="write:posts" class="ayu-scope-checkbox"> <?php esc_html_e( 'Write Posts', 'ayu-ai-elementor' ); ?></label><br>
										<label><input type="checkbox" name="scopes[]" value="read:media" class="ayu-scope-checkbox"> <?php esc_html_e( 'Read Media', 'ayu-ai-elementor' ); ?></label><br>
										<label><input type="checkbox" name="scopes[]" value="write:media" class="ayu-scope-checkbox"> <?php esc_html_e( 'Write Media', 'ayu-ai-elementor' ); ?></label><br>
										<label><input type="checkbox" name="scopes[]" value="read:users" class="ayu-scope-checkbox"> <?php esc_html_e( 'Read Users', 'ayu-ai-elementor' ); ?></label><br>
										<label><input type="checkbox" name="scopes[]" value="write:users" class="ayu-scope-checkbox"> <?php esc_html_e( 'Write Users', 'ayu-ai-elementor' ); ?></label><br>
										<label><input type="checkbox" name="scopes[]" value="read:settings" class="ayu-scope-checkbox"> <?php esc_html_e( 'Read Settings', 'ayu-ai-elementor' ); ?></label><br>
										<label><input type="checkbox" name="scopes[]" value="write:settings" class="ayu-scope-checkbox"> <?php esc_html_e( 'Write Settings', 'ayu-ai-elementor' ); ?></label><br>
										<?php if ( class_exists( '\Elementor\Plugin' ) ) : ?>
											<label><input type="checkbox" name="scopes[]" value="read:elementor" class="ayu-scope-checkbox"> <?php esc_html_e( 'Read Elementor', 'ayu-ai-elementor' ); ?></label><br>
											<label><input type="checkbox" name="scopes[]" value="write:elementor" class="ayu-scope-checkbox"> <?php esc_html_e( 'Write Elementor', 'ayu-ai-elementor' ); ?></label><br>
										<?php endif; ?>
									</div>
								</fieldset>
							</td>
						</tr>
						<tr>
							<th><label for="token-expires"><?php esc_html_e( 'Expires In', 'ayu-ai-elementor' ); ?></label></th>
							<td>
								<select name="expires" id="token-expires">
									<option value="30">30 days</option>
									<option value="90" selected>90 days</option>
									<option value="180">180 days</option>
									<option value="365">1 year</option>
								</select>
							</td>
						</tr>
					</table>
					<?php wp_nonce_field( 'ayu-create-token', 'ayu_nonce' ); ?>
					<p class="submit">
						<button type="submit" class="button button-primary"><?php esc_html_e( 'Create Token', 'ayu-ai-elementor' ); ?></button>
					</p>
				</form>
			</div>

			<div class="ayu-tokens-list">
				<h2><?php esc_html_e( 'Existing Tokens', 'ayu-ai-elementor' ); ?></h2>
				<?php if ( empty( $tokens ) ) : ?>
					<p><?php esc_html_e( 'No tokens created yet.', 'ayu-ai-elementor' ); ?></p>
				<?php else : ?>
					<table class="wp-list-table widefat fixed striped">
						<thead>
							<tr>
								<th><?php esc_html_e( 'Token ID', 'ayu-ai-elementor' ); ?></th>
								<th><?php esc_html_e( 'Scopes', 'ayu-ai-elementor' ); ?></th>
								<th><?php esc_html_e( 'Created', 'ayu-ai-elementor' ); ?></th>
								<th><?php esc_html_e( 'Expires', 'ayu-ai-elementor' ); ?></th>
								<th><?php esc_html_e( 'Last Used', 'ayu-ai-elementor' ); ?></th>
								<th><?php esc_html_e( 'Actions', 'ayu-ai-elementor' ); ?></th>
							</tr>
						</thead>
						<tbody>
							<?php foreach ( $tokens as $token ) : ?>
								<tr>
									<td><code><?php echo esc_html( substr( $token['id'], 0, 16 ) ); ?>...</code></td>
									<td><?php echo esc_html( implode( ', ', $token['scopes'] ) ); ?></td>
									<td><?php echo esc_html( date_i18n( get_option( 'date_format' ), $token['created_at'] ) ); ?></td>
									<td><?php echo esc_html( date_i18n( get_option( 'date_format' ), $token['expires_at'] ) ); ?></td>
									<td><?php echo $token['last_used_at'] ? esc_html( date_i18n( get_option( 'date_format' ), $token['last_used_at'] ) ) : '—'; ?></td>
									<td>
										<button class="button button-small ayu-revoke-token" data-token-id="<?php echo esc_attr( $token['id'] ); ?>">
											<?php esc_html_e( 'Revoke', 'ayu-ai-elementor' ); ?>
										</button>
									</td>
								</tr>
							<?php endforeach; ?>
						</tbody>
					</table>
				<?php endif; ?>
			</div>
		</div>

		<div id="ayu-token-modal" class="ayu-modal" style="display:none;">
			<div class="ayu-modal-content">
				<span class="ayu-modal-close">&times;</span>
				<h2><?php esc_html_e( 'Token Created', 'ayu-ai-elementor' ); ?></h2>
				<p><?php esc_html_e( 'Your token has been created. Copy it now - you won\'t be able to see it again!', 'ayu-ai-elementor' ); ?></p>
				<input type="text" id="ayu-token-display" readonly class="large-text" />
				<p class="submit">
					<button type="button" class="button button-primary" id="ayu-copy-token"><?php esc_html_e( 'Copy Token', 'ayu-ai-elementor' ); ?></button>
				</p>
			</div>
		</div>
		<?php
	}

	/**
	 * Render settings page
	 */
	public static function render_settings_page() {
		// Handle form submission
		if ( isset( $_POST['ayu_save_settings'] ) && check_admin_referer( 'ayu_settings', 'ayu_settings_nonce' ) ) {
			update_option( 'ayu_rate_limit', isset( $_POST['ayu_rate_limit'] ) ? (int) $_POST['ayu_rate_limit'] : 100 );
			update_option( 'ayu_cors_origins', isset( $_POST['ayu_cors_origins'] ) ? sanitize_textarea_field( $_POST['ayu_cors_origins'] ) : '' );
			echo '<div class="notice notice-success"><p>' . esc_html__( 'Settings saved.', 'ayu-ai-elementor' ) . '</p></div>';
		}

		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'AYU AI Settings', 'ayu-ai-elementor' ); ?></h1>
			<form method="post" action="">
				<?php wp_nonce_field( 'ayu_settings', 'ayu_settings_nonce' ); ?>
				<table class="form-table">
					<tr>
						<th><label for="ayu_rate_limit"><?php esc_html_e( 'Rate Limit (requests/minute)', 'ayu-ai-elementor' ); ?></label></th>
						<td>
							<input type="number" id="ayu_rate_limit" name="ayu_rate_limit" value="<?php echo esc_attr( get_option( 'ayu_rate_limit', 100 ) ); ?>" min="1" max="1000" />
							<p class="description"><?php esc_html_e( 'Maximum requests per minute per token/IP address.', 'ayu-ai-elementor' ); ?></p>
						</td>
					</tr>
					<tr>
						<th><label for="ayu_cors_origins"><?php esc_html_e( 'Allowed CORS Origins', 'ayu-ai-elementor' ); ?></label></th>
						<td>
							<textarea id="ayu_cors_origins" name="ayu_cors_origins" rows="5" class="large-text"><?php echo esc_textarea( get_option( 'ayu_cors_origins', '' ) ); ?></textarea>
							<p class="description"><?php esc_html_e( 'One origin per line (e.g., https://example.com). Leave empty for same-origin only.', 'ayu-ai-elementor' ); ?></p>
						</td>
					</tr>
				</table>
				<?php submit_button( __( 'Save Settings', 'ayu-ai-elementor' ), 'primary', 'ayu_save_settings' ); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Render logs page
	 */
	public static function render_logs_page() {
		// Get limit from query parameter or default to 100
		$limit = isset( $_GET['limit'] ) ? (int) $_GET['limit'] : 100;
		$allowed_limits = [ 100, 500, 1000 ];
		if ( ! in_array( $limit, $allowed_limits, true ) ) {
			$limit = 100;
		}

		$logs = AYU_Audit_Log::get_recent_logs( $limit );
		$total_logs = AYU_Audit_Log::get_total_count();
		?>
		<div class="wrap">
			<h1 class="ayu-page-title">
				<?php esc_html_e( 'Audit Log', 'ayu-ai-elementor' ); ?>
				<span class="ayu-badge"><?php echo esc_html( number_format_i18n( $total_logs ) ); ?> <?php esc_html_e( 'total entries', 'ayu-ai-elementor' ); ?></span>
			</h1>

			<div class="ayu-logs-controls">
				<div class="ayu-limit-selector">
					<label for="ayu-log-limit"><?php esc_html_e( 'Show:', 'ayu-ai-elementor' ); ?></label>
					<select id="ayu-log-limit" class="ayu-select" onchange="window.location.href='<?php echo esc_url( admin_url( 'admin.php?page=ayu-ai-logs&limit=' ) ); ?>' + this.value">
						<option value="100" <?php selected( $limit, 100 ); ?>>100</option>
						<option value="500" <?php selected( $limit, 500 ); ?>>500</option>
						<option value="1000" <?php selected( $limit, 1000 ); ?>>1000</option>
					</select>
					<span class="ayu-description"><?php esc_html_e( 'entries', 'ayu-ai-elementor' ); ?></span>
				</div>
			</div>

			<?php if ( empty( $logs ) ) : ?>
				<div class="ayu-empty-state">
					<div class="ayu-empty-icon">📋</div>
					<h2><?php esc_html_e( 'No logs yet', 'ayu-ai-elementor' ); ?></h2>
					<p><?php esc_html_e( 'Activity logs will appear here once you start using AYU AI tools.', 'ayu-ai-elementor' ); ?></p>
				</div>
			<?php else : ?>
				<div class="ayu-logs-container">
					<table class="ayu-logs-table">
						<thead>
							<tr>
								<th class="ayu-col-time"><?php esc_html_e( 'Time', 'ayu-ai-elementor' ); ?></th>
								<th class="ayu-col-user"><?php esc_html_e( 'User', 'ayu-ai-elementor' ); ?></th>
								<th class="ayu-col-tool"><?php esc_html_e( 'Tool', 'ayu-ai-elementor' ); ?></th>
								<th class="ayu-col-status"><?php esc_html_e( 'Status', 'ayu-ai-elementor' ); ?></th>
								<th class="ayu-col-ip"><?php esc_html_e( 'IP Address', 'ayu-ai-elementor' ); ?></th>
							</tr>
						</thead>
						<tbody>
							<?php foreach ( $logs as $log ) : 
								$user = get_user_by( 'id', $log['user_id'] );
								$user_name = $user ? $user->display_name : sprintf( __( 'User #%d', 'ayu-ai-elementor' ), $log['user_id'] );
								$user_email = $user ? $user->user_email : '';
								$time_ago = human_time_diff( $log['timestamp'], current_time( 'timestamp' ) );
							?>
								<tr class="ayu-log-row <?php echo $log['success'] ? 'ayu-success' : 'ayu-error'; ?>">
									<td class="ayu-col-time">
										<div class="ayu-time-primary"><?php echo esc_html( date_i18n( get_option( 'date_format' ), $log['timestamp'] ) ); ?></div>
										<div class="ayu-time-secondary">
											<?php echo esc_html( date_i18n( get_option( 'time_format' ), $log['timestamp'] ) ); ?>
											<span class="ayu-time-ago"><?php printf( esc_html__( '%s ago', 'ayu-ai-elementor' ), esc_html( $time_ago ) ); ?></span>
										</div>
									</td>
									<td class="ayu-col-user">
										<div class="ayu-user-info">
											<span class="ayu-user-name"><?php echo esc_html( $user_name ); ?></span>
											<?php if ( $user_email ) : ?>
												<span class="ayu-user-email"><?php echo esc_html( $user_email ); ?></span>
											<?php endif; ?>
										</div>
									</td>
									<td class="ayu-col-tool">
										<code class="ayu-tool-name"><?php echo esc_html( $log['tool_name'] ); ?></code>
									</td>
									<td class="ayu-col-status">
										<?php if ( $log['success'] ) : ?>
											<span class="ayu-status-badge ayu-status-success">
												<span class="ayu-status-icon">✓</span>
												<?php esc_html_e( 'Success', 'ayu-ai-elementor' ); ?>
											</span>
										<?php else : ?>
											<span class="ayu-status-badge ayu-status-error">
												<span class="ayu-status-icon">✗</span>
												<?php esc_html_e( 'Failed', 'ayu-ai-elementor' ); ?>
											</span>
										<?php endif; ?>
									</td>
									<td class="ayu-col-ip">
										<code class="ayu-ip-address"><?php echo esc_html( $log['ip_address'] ); ?></code>
									</td>
								</tr>
							<?php endforeach; ?>
						</tbody>
					</table>
				</div>

				<div class="ayu-logs-footer">
					<p class="ayu-logs-info">
						<?php 
						printf(
							esc_html__( 'Showing %1$d of %2$d recent entries', 'ayu-ai-elementor' ),
							count( $logs ),
							$total_logs
						);
						?>
					</p>
				</div>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * AJAX handler for creating token
	 */
	public static function ajax_create_token() {
		check_ajax_referer( 'ayu-admin', 'nonce' );

		if ( ! current_user_can( 'use_ayu' ) ) {
			wp_send_json_error( [ 'message' => 'Insufficient permissions' ] );
		}

		$scopes = isset( $_POST['scopes'] ) ? array_map( 'sanitize_text_field', $_POST['scopes'] ) : [];
		$expires_days = isset( $_POST['expires'] ) ? (int) $_POST['expires'] : 90;
		$expires = time() + ( $expires_days * DAY_IN_SECONDS );

		$result = AYU_Auth::create_token( get_current_user_id(), $scopes, $expires );

		if ( is_wp_error( $result ) ) {
			wp_send_json_error( [ 'message' => $result->get_error_message() ] );
		}

		wp_send_json_success( $result );
	}

	/**
	 * AJAX handler for revoking token
	 */
	public static function ajax_revoke_token() {
		check_ajax_referer( 'ayu-admin', 'nonce' );

		if ( ! current_user_can( 'use_ayu' ) ) {
			wp_send_json_error( [ 'message' => 'Insufficient permissions' ] );
		}

		$token_id = isset( $_POST['token_id'] ) ? sanitize_text_field( $_POST['token_id'] ) : '';

		$result = AYU_Auth::revoke_token( $token_id );

		if ( is_wp_error( $result ) ) {
			wp_send_json_error( [ 'message' => $result->get_error_message() ] );
		}

		wp_send_json_success();
	}
}

