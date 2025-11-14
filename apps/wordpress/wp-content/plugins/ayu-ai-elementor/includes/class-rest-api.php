<?php
/**
 * REST API Controller
 *
 * @package AYU_AI_Elementor
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class AYU_REST_API
 *
 * Registers all REST API endpoints for MCP tools
 */
class AYU_REST_API {

	const NAMESPACE = 'ayu/v1';

	/**
	 * Initialize REST API routes
	 */
	public static function init() {
		add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
		add_filter( 'rest_pre_serve_request', [ __CLASS__, 'add_cors_headers' ], 0, 4 );
	}

	/**
	 * Add CORS headers to REST responses
	 *
	 * @param bool             $served  Whether the request has already been served
	 * @param WP_REST_Response $result  Response to send
	 * @param WP_REST_Request  $request Request used to generate the response
	 * @param WP_REST_Server   $server  Server instance
	 * @return bool
	 */
	public static function add_cors_headers( $served, $result, $request, $server ) {
		if ( strpos( $request->get_route(), '/ayu/v1/' ) === false ) {
			return $served;
		}

		$allowed_origins = get_option( 'ayu_cors_origins', '' );
		$origins = ! empty( $allowed_origins ) ? array_filter( array_map( 'trim', explode( "\n", $allowed_origins ) ) ) : [];

		$origin = $request->get_header( 'Origin' );
		if ( $origin && ( empty( $origins ) || in_array( $origin, $origins, true ) ) ) {
			header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
		} elseif ( empty( $origins ) ) {
			// Same-origin only if no origins configured
			header( 'Access-Control-Allow-Origin: ' . esc_url_raw( home_url() ) );
		}

		header( 'Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS' );
		header( 'Access-Control-Allow-Credentials: true' );
		header( 'Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce' );

		// Handle preflight
		if ( $request->get_method() === 'OPTIONS' ) {
			status_header( 200 );
			exit;
		}

		return $served;
	}

	/**
	 * Register all REST routes
	 */
	public static function register_routes() {
		// Posts endpoints
		register_rest_route( self::NAMESPACE, '/posts', [
			[
				'methods' => 'GET',
				'callback' => [ __CLASS__, 'list_posts' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'POST',
				'callback' => [ __CLASS__, 'create_post' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
		] );

		register_rest_route( self::NAMESPACE, '/posts/(?P<id>\d+)', [
			[
				'methods' => 'GET',
				'callback' => [ __CLASS__, 'get_post' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'POST',
				'callback' => [ __CLASS__, 'update_post' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'DELETE',
				'callback' => [ __CLASS__, 'delete_post' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
		] );

		// Media endpoints
		register_rest_route( self::NAMESPACE, '/media', [
			[
				'methods' => 'GET',
				'callback' => [ __CLASS__, 'list_media' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'POST',
				'callback' => [ __CLASS__, 'upload_media' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
		] );

		register_rest_route( self::NAMESPACE, '/media/(?P<id>\d+)', [
			[
				'methods' => 'GET',
				'callback' => [ __CLASS__, 'get_media' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'DELETE',
				'callback' => [ __CLASS__, 'delete_media' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
		] );

		// Users endpoints
		register_rest_route( self::NAMESPACE, '/users', [
			[
				'methods' => 'GET',
				'callback' => [ __CLASS__, 'list_users' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'POST',
				'callback' => [ __CLASS__, 'create_user' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
		] );

		register_rest_route( self::NAMESPACE, '/users/(?P<id>\d+)', [
			[
				'methods' => 'GET',
				'callback' => [ __CLASS__, 'get_user' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'POST',
				'callback' => [ __CLASS__, 'update_user' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'DELETE',
				'callback' => [ __CLASS__, 'delete_user' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
		] );

		// Menus endpoints
		register_rest_route( self::NAMESPACE, '/menus', [
			[
				'methods' => 'GET',
				'callback' => [ __CLASS__, 'list_menus' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'POST',
				'callback' => [ __CLASS__, 'create_menu' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
		] );

		register_rest_route( self::NAMESPACE, '/menus/(?P<id>\d+)', [
			[
				'methods' => 'GET',
				'callback' => [ __CLASS__, 'get_menu' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'POST',
				'callback' => [ __CLASS__, 'update_menu' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'DELETE',
				'callback' => [ __CLASS__, 'delete_menu' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
		] );

		// Taxonomies endpoints
		register_rest_route( self::NAMESPACE, '/taxonomies', [
			[
				'methods' => 'GET',
				'callback' => [ __CLASS__, 'list_taxonomies' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
		] );

		register_rest_route( self::NAMESPACE, '/taxonomies/(?P<taxonomy>[a-zA-Z0-9_-]+)/terms', [
			[
				'methods' => 'GET',
				'callback' => [ __CLASS__, 'list_terms' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'POST',
				'callback' => [ __CLASS__, 'create_term' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
		] );

		// Options/Settings endpoints
		register_rest_route( self::NAMESPACE, '/options/(?P<name>[a-zA-Z0-9_-]+)', [
			[
				'methods' => 'GET',
				'callback' => [ __CLASS__, 'get_option' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
			[
				'methods' => 'POST',
				'callback' => [ __CLASS__, 'update_option' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
		] );

		register_rest_route( self::NAMESPACE, '/site-health', [
			[
				'methods' => 'GET',
				'callback' => [ __CLASS__, 'get_site_health' ],
				'permission_callback' => [ __CLASS__, 'check_permission' ],
			],
		] );
	}

	/**
	 * Check permission for REST request
	 *
	 * @param WP_REST_Request $request Request object
	 * @return bool|WP_Error
	 */
	public static function check_permission( $request ) {
		// Check for token authentication
		$auth_header = $request->get_header( 'Authorization' );
		if ( $auth_header && preg_match( '/Bearer\s+(.+)/i', $auth_header, $matches ) ) {
			$token = $matches[1];
			$token_data = AYU_Auth::verify_token( $token );
			if ( is_wp_error( $token_data ) ) {
				return $token_data;
			}

			// Set current user for capability checks
			wp_set_current_user( $token_data['user_id'] );

			// Check rate limit
			$rate_limit_per_minute = get_option( 'ayu_rate_limit', 100 );
			$rate_limit = AYU_Auth::check_rate_limit( $token, $rate_limit_per_minute );
			if ( is_wp_error( $rate_limit ) ) {
				return $rate_limit;
			}

			// Store token data in request for later use
			$request->set_param( '_token_data', $token_data );

			// Log the request
			$ip_address = self::get_client_ip();
			$tool_name = self::extract_tool_name_from_request( $request );
			AYU_Audit_Log::log( $tool_name, $token_data['user_id'], $ip_address, true );

			return true;
		}

		// Fallback to WordPress nonce for admin requests
		if ( is_user_logged_in() && current_user_can( 'use_ayu' ) ) {
			return true;
		}

		return new WP_Error( 'rest_forbidden', 'You do not have permission to access this endpoint.', [ 'status' => 403 ] );
	}

	/**
	 * Extract tool name from request for logging
	 *
	 * @param WP_REST_Request $request Request object
	 * @return string
	 */
	private static function extract_tool_name_from_request( $request ) {
		$route = $request->get_route();
		$method = $request->get_method();

		$route_map = [
			'/ayu/v1/posts' => $method === 'GET' ? 'wp:listPosts' : 'wp:createPost',
			'/ayu/v1/posts/' => $method === 'GET' ? 'wp:getPost' : ( $method === 'DELETE' ? 'wp:deletePost' : 'wp:updatePost' ),
			'/ayu/v1/media' => $method === 'GET' ? 'wp:listMedia' : 'wp:uploadMedia',
			'/ayu/v1/media/' => $method === 'GET' ? 'wp:getMedia' : 'wp:deleteMedia',
			'/ayu/v1/users' => $method === 'GET' ? 'wp:listUsers' : 'wp:createUser',
			'/ayu/v1/users/' => $method === 'GET' ? 'wp:getUser' : ( $method === 'DELETE' ? 'wp:deleteUser' : 'wp:updateUser' ),
			'/ayu/v1/menus' => $method === 'GET' ? 'wp:listMenus' : 'wp:createMenu',
			'/ayu/v1/menus/' => $method === 'GET' ? 'wp:getMenu' : ( $method === 'DELETE' ? 'wp:deleteMenu' : 'wp:updateMenu' ),
			'/ayu/v1/taxonomies' => 'wp:listTaxonomies',
			'/ayu/v1/taxonomies/' => $method === 'GET' ? 'wp:listTerms' : 'wp:createTerm',
			'/ayu/v1/options/' => $method === 'GET' ? 'wp:getOption' : 'wp:updateOption',
			'/ayu/v1/site-health' => 'wp:getSiteHealth',
		];

		foreach ( $route_map as $pattern => $tool_name ) {
			if ( strpos( $route, $pattern ) !== false ) {
				return $tool_name;
			}
		}

		return 'unknown';
	}

	/**
	 * Get client IP address
	 *
	 * @return string
	 */
	private static function get_client_ip() {
		$ip_keys = [
			'HTTP_CF_CONNECTING_IP', // Cloudflare
			'HTTP_X_REAL_IP',
			'HTTP_X_FORWARDED_FOR',
			'REMOTE_ADDR',
		];

		foreach ( $ip_keys as $key ) {
			if ( ! empty( $_SERVER[ $key ] ) ) {
				$ip = sanitize_text_field( wp_unslash( $_SERVER[ $key ] ) );
				if ( strpos( $ip, ',' ) !== false ) {
					$ip = trim( explode( ',', $ip )[0] );
				}
				if ( filter_var( $ip, FILTER_VALIDATE_IP ) ) {
					return $ip;
				}
			}
		}

		return '0.0.0.0';
	}

	// Posts handlers
	public static function list_posts( $request ) {
		$args = [
			'post_type' => $request->get_param( 'post_type' ) ?: 'post',
			'posts_per_page' => $request->get_param( 'per_page' ) ?: 10,
			'paged' => $request->get_param( 'page' ) ?: 1,
			'post_status' => $request->get_param( 'status' ) ?: 'publish',
		];

		if ( $request->get_param( 'search' ) ) {
			$args['s'] = sanitize_text_field( $request->get_param( 'search' ) );
		}

		$query = new WP_Query( $args );
		$posts = [];

		foreach ( $query->posts as $post ) {
			$posts[] = [
				'id' => $post->ID,
				'title' => $post->post_title,
				'slug' => $post->post_name,
				'status' => $post->post_status,
				'type' => $post->post_type,
				'date' => $post->post_date,
				'modified' => $post->post_modified,
				'author' => $post->post_author,
				'excerpt' => $post->post_excerpt,
			];
		}

		return rest_ensure_response( [
			'posts' => $posts,
			'total' => $query->found_posts,
			'pages' => $query->max_num_pages,
		] );
	}

	public static function get_post( $request ) {
		$post_id = (int) $request->get_param( 'id' );
		$post = get_post( $post_id );

		if ( ! $post ) {
			return new WP_Error( 'post_not_found', 'Post not found.', [ 'status' => 404 ] );
		}

		return rest_ensure_response( [
			'id' => $post->ID,
			'title' => $post->post_title,
			'slug' => $post->post_name,
			'status' => $post->post_status,
			'type' => $post->post_type,
			'content' => $post->post_content,
			'excerpt' => $post->post_excerpt,
			'date' => $post->post_date,
			'modified' => $post->post_modified,
			'author' => $post->post_author,
			'featured_image' => get_post_thumbnail_id( $post_id ),
			'categories' => wp_get_post_categories( $post_id ),
			'tags' => wp_get_post_tags( $post_id, [ 'fields' => 'ids' ] ),
		] );
	}

	public static function create_post( $request ) {
		$data = $request->get_json_params();

		$post_data = [
			'post_title' => sanitize_text_field( $data['title'] ?? '' ),
			'post_content' => wp_kses_post( $data['content'] ?? '' ),
			'post_excerpt' => sanitize_textarea_field( $data['excerpt'] ?? '' ),
			'post_status' => sanitize_text_field( $data['status'] ?? 'draft' ),
			'post_type' => sanitize_text_field( $data['type'] ?? 'post' ),
		];

		if ( isset( $data['slug'] ) ) {
			$post_data['post_name'] = sanitize_title( $data['slug'] );
		}

		$post_id = wp_insert_post( $post_data, true );

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		// Handle taxonomies
		if ( isset( $data['categories'] ) && is_array( $data['categories'] ) ) {
			wp_set_post_categories( $post_id, $data['categories'] );
		}

		if ( isset( $data['tags'] ) && is_array( $data['tags'] ) ) {
			wp_set_post_tags( $post_id, $data['tags'] );
		}

		// Handle featured image
		if ( isset( $data['featured_image'] ) ) {
			set_post_thumbnail( $post_id, (int) $data['featured_image'] );
		}

		return rest_ensure_response( [
			'id' => $post_id,
			'success' => true,
		] );
	}

	public static function update_post( $request ) {
		$post_id = (int) $request->get_param( 'id' );
		$data = $request->get_json_params();

		$post_data = [ 'ID' => $post_id ];

		if ( isset( $data['title'] ) ) {
			$post_data['post_title'] = sanitize_text_field( $data['title'] );
		}
		if ( isset( $data['content'] ) ) {
			$post_data['post_content'] = wp_kses_post( $data['content'] );
		}
		if ( isset( $data['excerpt'] ) ) {
			$post_data['post_excerpt'] = sanitize_textarea_field( $data['excerpt'] );
		}
		if ( isset( $data['status'] ) ) {
			$post_data['post_status'] = sanitize_text_field( $data['status'] );
		}
		if ( isset( $data['slug'] ) ) {
			$post_data['post_name'] = sanitize_title( $data['slug'] );
		}

		$result = wp_update_post( $post_data, true );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		// Handle taxonomies
		if ( isset( $data['categories'] ) && is_array( $data['categories'] ) ) {
			wp_set_post_categories( $post_id, $data['categories'] );
		}

		if ( isset( $data['tags'] ) && is_array( $data['tags'] ) ) {
			wp_set_post_tags( $post_id, $data['tags'] );
		}

		// Handle featured image
		if ( isset( $data['featured_image'] ) ) {
			set_post_thumbnail( $post_id, (int) $data['featured_image'] );
		}

		return rest_ensure_response( [
			'id' => $post_id,
			'success' => true,
		] );
	}

	public static function delete_post( $request ) {
		$post_id = (int) $request->get_param( 'id' );
		$force = $request->get_param( 'force' ) === true;

		$result = wp_delete_post( $post_id, $force );

		if ( ! $result ) {
			return new WP_Error( 'delete_failed', 'Failed to delete post.', [ 'status' => 500 ] );
		}

		return rest_ensure_response( [
			'success' => true,
			'deleted' => true,
		] );
	}

	// Media handlers
	public static function list_media( $request ) {
		$args = [
			'post_type' => 'attachment',
			'posts_per_page' => $request->get_param( 'per_page' ) ?: 20,
			'paged' => $request->get_param( 'page' ) ?: 1,
			'post_mime_type' => $request->get_param( 'mime_type' ),
		];

		if ( $request->get_param( 'search' ) ) {
			$args['s'] = sanitize_text_field( $request->get_param( 'search' ) );
		}

		$query = new WP_Query( $args );
		$media = [];

		foreach ( $query->posts as $attachment ) {
			$media[] = [
				'id' => $attachment->ID,
				'title' => $attachment->post_title,
				'url' => wp_get_attachment_url( $attachment->ID ),
				'mime_type' => $attachment->post_mime_type,
				'date' => $attachment->post_date,
			];
		}

		return rest_ensure_response( [
			'media' => $media,
			'total' => $query->found_posts,
		] );
	}

	public static function get_media( $request ) {
		$media_id = (int) $request->get_param( 'id' );
		$attachment = get_post( $media_id );

		if ( ! $attachment || $attachment->post_type !== 'attachment' ) {
			return new WP_Error( 'media_not_found', 'Media not found.', [ 'status' => 404 ] );
		}

		return rest_ensure_response( [
			'id' => $attachment->ID,
			'title' => $attachment->post_title,
			'url' => wp_get_attachment_url( $attachment->ID ),
			'mime_type' => $attachment->post_mime_type,
			'date' => $attachment->post_date,
			'sizes' => wp_get_attachment_image_srcset( $attachment->ID ),
		] );
	}

	public static function upload_media( $request ) {
		// Media upload handled via standard WordPress REST API
		// This endpoint can proxy to wp/v2/media or handle custom logic
		return new WP_Error( 'not_implemented', 'Use wp/v2/media endpoint for uploads.', [ 'status' => 501 ] );
	}

	public static function delete_media( $request ) {
		$media_id = (int) $request->get_param( 'id' );
		$result = wp_delete_attachment( $media_id, true );

		if ( ! $result ) {
			return new WP_Error( 'delete_failed', 'Failed to delete media.', [ 'status' => 500 ] );
		}

		return rest_ensure_response( [
			'success' => true,
			'deleted' => true,
		] );
	}

	// Users handlers
	public static function list_users( $request ) {
		$args = [
			'number' => $request->get_param( 'per_page' ) ?: 20,
			'paged' => $request->get_param( 'page' ) ?: 1,
			'role' => $request->get_param( 'role' ),
		];

		if ( $request->get_param( 'search' ) ) {
			$args['search'] = '*' . sanitize_text_field( $request->get_param( 'search' ) ) . '*';
		}

		$users = get_users( $args );
		$result = [];

		foreach ( $users as $user ) {
			$result[] = [
				'id' => $user->ID,
				'username' => $user->user_login,
				'email' => $user->user_email,
				'display_name' => $user->display_name,
				'roles' => $user->roles,
			];
		}

		return rest_ensure_response( [
			'users' => $result,
		] );
	}

	public static function get_user( $request ) {
		$user_id = (int) $request->get_param( 'id' );
		$user = get_user_by( 'id', $user_id );

		if ( ! $user ) {
			return new WP_Error( 'user_not_found', 'User not found.', [ 'status' => 404 ] );
		}

		return rest_ensure_response( [
			'id' => $user->ID,
			'username' => $user->user_login,
			'email' => $user->user_email,
			'display_name' => $user->display_name,
			'roles' => $user->roles,
			'registered' => $user->user_registered,
		] );
	}

	public static function create_user( $request ) {
		$data = $request->get_json_params();

		$user_data = [
			'user_login' => sanitize_user( $data['username'] ?? '' ),
			'user_email' => sanitize_email( $data['email'] ?? '' ),
			'user_pass' => $data['password'] ?? wp_generate_password(),
			'display_name' => sanitize_text_field( $data['display_name'] ?? '' ),
			'role' => sanitize_text_field( $data['role'] ?? 'subscriber' ),
		];

		$user_id = wp_insert_user( $user_data );

		if ( is_wp_error( $user_id ) ) {
			return $user_id;
		}

		return rest_ensure_response( [
			'id' => $user_id,
			'success' => true,
		] );
	}

	public static function update_user( $request ) {
		$user_id = (int) $request->get_param( 'id' );
		$data = $request->get_json_params();

		$user_data = [ 'ID' => $user_id ];

		if ( isset( $data['email'] ) ) {
			$user_data['user_email'] = sanitize_email( $data['email'] );
		}
		if ( isset( $data['display_name'] ) ) {
			$user_data['display_name'] = sanitize_text_field( $data['display_name'] );
		}
		if ( isset( $data['role'] ) ) {
			$user_data['role'] = sanitize_text_field( $data['role'] );
		}

		$result = wp_update_user( $user_data );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( [
			'id' => $user_id,
			'success' => true,
		] );
	}

	public static function delete_user( $request ) {
		$user_id = (int) $request->get_param( 'id' );
		$reassign = $request->get_param( 'reassign' );

		if ( $reassign ) {
			$result = wp_delete_user( $user_id, (int) $reassign );
		} else {
			$result = wp_delete_user( $user_id );
		}

		if ( ! $result ) {
			return new WP_Error( 'delete_failed', 'Failed to delete user.', [ 'status' => 500 ] );
		}

		return rest_ensure_response( [
			'success' => true,
			'deleted' => true,
		] );
	}

	// Menus handlers
	public static function list_menus( $request ) {
		$menus = wp_get_nav_menus();
		$result = [];

		foreach ( $menus as $menu ) {
			$result[] = [
				'id' => $menu->term_id,
				'name' => $menu->name,
				'slug' => $menu->slug,
				'count' => $menu->count,
			];
		}

		return rest_ensure_response( [
			'menus' => $result,
		] );
	}

	public static function get_menu( $request ) {
		$menu_id = (int) $request->get_param( 'id' );
		$menu = wp_get_nav_menu_object( $menu_id );

		if ( ! $menu ) {
			return new WP_Error( 'menu_not_found', 'Menu not found.', [ 'status' => 404 ] );
		}

		$items = wp_get_nav_menu_items( $menu_id );
		$menu_items = [];

		foreach ( $items as $item ) {
			$menu_items[] = [
				'id' => $item->ID,
				'title' => $item->title,
				'url' => $item->url,
				'parent' => $item->menu_item_parent,
				'order' => $item->menu_order,
			];
		}

		return rest_ensure_response( [
			'id' => $menu->term_id,
			'name' => $menu->name,
			'slug' => $menu->slug,
			'items' => $menu_items,
		] );
	}

	public static function create_menu( $request ) {
		$data = $request->get_json_params();
		$menu_name = sanitize_text_field( $data['name'] ?? '' );

		if ( empty( $menu_name ) ) {
			return new WP_Error( 'invalid_name', 'Menu name is required.', [ 'status' => 400 ] );
		}

		$menu_id = wp_create_nav_menu( $menu_name );

		if ( is_wp_error( $menu_id ) ) {
			return $menu_id;
		}

		return rest_ensure_response( [
			'id' => $menu_id,
			'success' => true,
		] );
	}

	public static function update_menu( $request ) {
		$menu_id = (int) $request->get_param( 'id' );
		$data = $request->get_json_params();

		$update_data = [];

		if ( isset( $data['name'] ) ) {
			$update_data['menu-name'] = sanitize_text_field( $data['name'] );
		}

		if ( ! empty( $update_data ) ) {
			wp_update_nav_menu_object( $menu_id, $update_data );
		}

		// Handle menu items
		if ( isset( $data['items'] ) && is_array( $data['items'] ) ) {
			// Clear existing items
			$existing_items = wp_get_nav_menu_items( $menu_id );
			foreach ( $existing_items as $item ) {
				wp_delete_post( $item->ID, true );
			}

			// Add new items
			foreach ( $data['items'] as $item ) {
				wp_update_nav_menu_item( $menu_id, 0, [
					'menu-item-title' => sanitize_text_field( $item['title'] ?? '' ),
					'menu-item-url' => esc_url_raw( $item['url'] ?? '' ),
					'menu-item-parent-id' => (int) ( $item['parent'] ?? 0 ),
					'menu-item-position' => (int) ( $item['order'] ?? 0 ),
					'menu-item-type' => 'custom',
					'menu-item-status' => 'publish',
				] );
			}
		}

		return rest_ensure_response( [
			'id' => $menu_id,
			'success' => true,
		] );
	}

	public static function delete_menu( $request ) {
		$menu_id = (int) $request->get_param( 'id' );
		$result = wp_delete_nav_menu( $menu_id );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( [
			'success' => true,
			'deleted' => true,
		] );
	}

	// Taxonomies handlers
	public static function list_taxonomies( $request ) {
		$taxonomies = get_taxonomies( [ 'public' => true ], 'objects' );
		$result = [];

		foreach ( $taxonomies as $taxonomy ) {
			$result[] = [
				'name' => $taxonomy->name,
				'label' => $taxonomy->label,
				'object_type' => $taxonomy->object_type,
			];
		}

		return rest_ensure_response( [
			'taxonomies' => array_values( $result ),
		] );
	}

	public static function list_terms( $request ) {
		$taxonomy = sanitize_text_field( $request->get_param( 'taxonomy' ) );
		$terms = get_terms( [
			'taxonomy' => $taxonomy,
			'hide_empty' => false,
		] );

		if ( is_wp_error( $terms ) ) {
			return $terms;
		}

		$result = [];
		foreach ( $terms as $term ) {
			$result[] = [
				'id' => $term->term_id,
				'name' => $term->name,
				'slug' => $term->slug,
				'count' => $term->count,
			];
		}

		return rest_ensure_response( [
			'terms' => $result,
		] );
	}

	public static function create_term( $request ) {
		$taxonomy = sanitize_text_field( $request->get_param( 'taxonomy' ) );
		$data = $request->get_json_params();

		$term_data = [
			'name' => sanitize_text_field( $data['name'] ?? '' ),
			'slug' => sanitize_title( $data['slug'] ?? '' ),
		];

		$result = wp_insert_term( $term_data['name'], $taxonomy, $term_data );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( [
			'id' => $result['term_id'],
			'success' => true,
		] );
	}

	// Options handlers
	public static function get_option( $request ) {
		$option_name = sanitize_text_field( $request->get_param( 'name' ) );
		$value = get_option( $option_name );

		return rest_ensure_response( [
			'name' => $option_name,
			'value' => $value,
		] );
	}

	public static function update_option( $request ) {
		$option_name = sanitize_text_field( $request->get_param( 'name' ) );
		$data = $request->get_json_params();
		$value = $data['value'] ?? null;

		$result = update_option( $option_name, $value );

		return rest_ensure_response( [
			'name' => $option_name,
			'value' => $value,
			'success' => $result,
		] );
	}

	public static function get_site_health( $request ) {
		// Return basic site health information without requiring admin functions
		global $wpdb;

		$results = [
			'site_info' => [
				'name' => get_bloginfo( 'name' ),
				'url' => home_url(),
				'admin_url' => admin_url(),
				'version' => get_bloginfo( 'version' ),
				'language' => get_locale(),
				'timezone' => wp_timezone_string(),
				'charset' => get_bloginfo( 'charset' ),
			],
			'php_info' => [
				'version' => PHP_VERSION,
				'memory_limit' => ini_get( 'memory_limit' ),
				'max_execution_time' => ini_get( 'max_execution_time' ),
				'upload_max_filesize' => ini_get( 'upload_max_filesize' ),
				'post_max_size' => ini_get( 'post_max_size' ),
			],
			'database_info' => [
				'version' => $wpdb->db_version(),
				'charset' => $wpdb->charset,
				'collate' => $wpdb->collate,
			],
			'wordpress_info' => [
				'version' => get_bloginfo( 'version' ),
				'multisite' => is_multisite(),
				'debug_mode' => defined( 'WP_DEBUG' ) && WP_DEBUG,
				'active_theme' => wp_get_theme()->get( 'Name' ),
				'active_plugins_count' => count( get_option( 'active_plugins', [] ) ),
			],
			'server_info' => [
				'server_software' => isset( $_SERVER['SERVER_SOFTWARE'] ) ? sanitize_text_field( $_SERVER['SERVER_SOFTWARE'] ) : 'Unknown',
				'php_sapi' => php_sapi_name(),
				'https' => is_ssl(),
			],
		];

		return rest_ensure_response( $results );
	}
}

