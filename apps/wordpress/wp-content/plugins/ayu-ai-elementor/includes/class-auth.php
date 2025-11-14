<?php
/**
 * Authentication and Authorization Handler
 *
 * @package AYU_AI_Elementor
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class AYU_Auth
 *
 * Handles authentication, token management, and capability checks
 */
class AYU_Auth {

	const TOKEN_META_KEY = 'ayu_pat_tokens';
	const TOKEN_PREFIX = 'ayu_';
	const DEFAULT_TOKEN_LIFETIME = 90 * DAY_IN_SECONDS; // 90 days
	const MAX_TOKEN_LIFETIME = 365 * DAY_IN_SECONDS; // 1 year

	/**
	 * Generate a new Personal Access Token
	 *
	 * @param int    $user_id User ID
	 * @param array  $scopes  Array of permission scopes
	 * @param int    $expires Expiration time in seconds (default: 90 days)
	 * @return array|WP_Error Token data or error
	 */
	public static function create_token( $user_id, $scopes = [], $expires = null ) {
		if ( ! current_user_can( 'manage_options' ) && get_current_user_id() !== $user_id ) {
			return new WP_Error( 'insufficient_permissions', 'You do not have permission to create tokens.' );
		}

		if ( null === $expires ) {
			$expires = time() + self::DEFAULT_TOKEN_LIFETIME;
		} elseif ( $expires > time() + self::MAX_TOKEN_LIFETIME ) {
			$expires = time() + self::MAX_TOKEN_LIFETIME;
		}

		$token_id = self::TOKEN_PREFIX . wp_generate_password( 32, false );
		$token_hash = wp_hash_password( $token_id );

		$token_data = [
			'id' => $token_id,
			'hash' => $token_hash,
			'user_id' => $user_id,
			'scopes' => array_unique( $scopes ),
			'created_at' => time(),
			'expires_at' => $expires,
			'last_used_at' => null,
		];

		$tokens = get_user_meta( $user_id, self::TOKEN_META_KEY, true );
		if ( ! is_array( $tokens ) ) {
			$tokens = [];
		}

		$tokens[ $token_id ] = $token_data;
		update_user_meta( $user_id, self::TOKEN_META_KEY, $tokens );

		// Return token with plaintext ID (only shown once)
		return [
			'token' => $token_id,
			'scopes' => $token_data['scopes'],
			'expires_at' => $token_data['expires_at'],
			'created_at' => $token_data['created_at'],
		];
	}

	/**
	 * Verify a token and return user data
	 *
	 * @param string $token Token string
	 * @return array|WP_Error User ID and scopes, or error
	 */
	public static function verify_token( $token ) {
		if ( ! preg_match( '/^' . preg_quote( self::TOKEN_PREFIX, '/' ) . '[a-zA-Z0-9]{32}$/', $token ) ) {
			return new WP_Error( 'invalid_token_format', 'Invalid token format.' );
		}

		// Get all users with tokens (in production, use a more efficient lookup)
		$users = get_users( [
			'meta_key' => self::TOKEN_META_KEY,
		] );

		foreach ( $users as $user ) {
			$tokens = get_user_meta( $user->ID, self::TOKEN_META_KEY, true );
			if ( ! is_array( $tokens ) ) {
				continue;
			}

			foreach ( $tokens as $token_id => $token_data ) {
				if ( wp_check_password( $token, $token_data['hash'] ) ) {
					// Check expiration
					if ( isset( $token_data['expires_at'] ) && $token_data['expires_at'] < time() ) {
						return new WP_Error( 'token_expired', 'Token has expired.' );
					}

					// Update last used
					$token_data['last_used_at'] = time();
					$tokens[ $token_id ] = $token_data;
					update_user_meta( $user->ID, self::TOKEN_META_KEY, $tokens );

					return [
						'user_id' => $user->ID,
						'scopes' => isset( $token_data['scopes'] ) ? $token_data['scopes'] : [],
					];
				}
			}
		}

		return new WP_Error( 'invalid_token', 'Invalid or revoked token.' );
	}

	/**
	 * Revoke a token
	 *
	 * @param string $token_id Token ID
	 * @param int    $user_id  User ID (optional, for verification)
	 * @return bool|WP_Error Success or error
	 */
	public static function revoke_token( $token_id, $user_id = null ) {
		if ( null === $user_id ) {
			$user_id = get_current_user_id();
		}

		if ( ! current_user_can( 'manage_options' ) && get_current_user_id() !== $user_id ) {
			return new WP_Error( 'insufficient_permissions', 'You do not have permission to revoke this token.' );
		}

		$tokens = get_user_meta( $user_id, self::TOKEN_META_KEY, true );
		if ( ! is_array( $tokens ) || ! isset( $tokens[ $token_id ] ) ) {
			return new WP_Error( 'token_not_found', 'Token not found.' );
		}

		unset( $tokens[ $token_id ] );
		update_user_meta( $user_id, self::TOKEN_META_KEY, $tokens );

		return true;
	}

	/**
	 * Get all tokens for a user
	 *
	 * @param int $user_id User ID
	 * @return array Array of token data (without plaintext tokens)
	 */
	public static function get_user_tokens( $user_id ) {
		$tokens = get_user_meta( $user_id, self::TOKEN_META_KEY, true );
		if ( ! is_array( $tokens ) ) {
			return [];
		}

		$result = [];
		foreach ( $tokens as $token_id => $token_data ) {
			$result[] = [
				'id' => $token_id,
				'scopes' => $token_data['scopes'] ?? [],
				'created_at' => $token_data['created_at'] ?? 0,
				'expires_at' => $token_data['expires_at'] ?? 0,
				'last_used_at' => $token_data['last_used_at'] ?? null,
			];
		}

		return $result;
	}

	/**
	 * Check if token has required scope
	 *
	 * @param array  $token_data Token verification result
	 * @param string $scope      Required scope
	 * @return bool
	 */
	public static function has_scope( $token_data, $scope ) {
		if ( is_wp_error( $token_data ) ) {
			return false;
		}

		$scopes = $token_data['scopes'] ?? [];
		return in_array( $scope, $scopes, true );
	}

	/**
	 * Map tool name to required capability
	 *
	 * @param string $tool_name Tool name
	 * @return string|array Required capability or array of capabilities
	 */
	public static function get_required_capability( $tool_name ) {
		$capability_map = [
			// Posts
			'wp:createPost' => 'edit_posts',
			'wp:updatePost' => 'edit_posts',
			'wp:deletePost' => 'delete_posts',
			'wp:getPost' => 'read',
			'wp:listPosts' => 'read',

			// Media
			'wp:uploadMedia' => 'upload_files',
			'wp:deleteMedia' => 'delete_posts',
			'wp:getMedia' => 'read',
			'wp:listMedia' => 'read',

			// Users
			'wp:createUser' => 'create_users',
			'wp:updateUser' => 'edit_users',
			'wp:deleteUser' => 'delete_users',
			'wp:getUser' => 'list_users',
			'wp:listUsers' => 'list_users',

			// Settings
			'wp:getOption' => 'manage_options',
			'wp:updateOption' => 'manage_options',
			'wp:getSiteHealth' => 'manage_options',

			// Menus
			'wp:getMenu' => 'edit_theme_options',
			'wp:updateMenu' => 'edit_theme_options',
			'wp:createMenu' => 'edit_theme_options',
			'wp:deleteMenu' => 'edit_theme_options',

			// Elementor
			'elementor:getTemplate' => 'edit_posts',
			'elementor:createTemplate' => 'edit_posts',
			'elementor:updateTemplate' => 'edit_posts',
			'elementor:deleteTemplate' => 'delete_posts',
			'elementor:getKit' => 'edit_posts',
			'elementor:updateKit' => 'edit_posts',
		];

		return $capability_map[ $tool_name ] ?? 'manage_options';
	}

	/**
	 * Check rate limit for token/IP
	 *
	 * @param string $identifier Token ID or IP address
	 * @param int    $limit      Requests per minute
	 * @return bool|WP_Error True if allowed, WP_Error if rate limited
	 */
	public static function check_rate_limit( $identifier, $limit = 100 ) {
		$transient_key = 'ayu_rate_limit_' . md5( $identifier );
		$requests = get_transient( $transient_key );

		if ( false === $requests ) {
			set_transient( $transient_key, [ time() ], MINUTE_IN_SECONDS );
			return true;
		}

		// Remove requests older than 1 minute
		$requests = array_filter( $requests, function( $timestamp ) {
			return $timestamp > ( time() - MINUTE_IN_SECONDS );
		} );

		if ( count( $requests ) >= $limit ) {
			return new WP_Error( 'rate_limit_exceeded', 'Rate limit exceeded. Please try again later.' );
		}

		$requests[] = time();
		set_transient( $transient_key, $requests, MINUTE_IN_SECONDS );

		return true;
	}
}

