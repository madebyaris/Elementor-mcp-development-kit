<?php
/**
 * Audit Logging
 *
 * @package AYU_AI_Elementor
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class AYU_Audit_Log
 *
 * Handles audit logging for all tool executions
 */
class AYU_Audit_Log {

	const LOG_OPTION = 'ayu_audit_logs';
	const MAX_LOGS = 10000;
	const RETENTION_DAYS = 90;

	/**
	 * Initialize audit logging
	 */
	public static function init() {
		// Logging is handled directly in REST API handlers
		// This method kept for future use if needed
	}


	/**
	 * Log an event
	 *
	 * @param string $tool_name Tool name
	 * @param int    $user_id   User ID
	 * @param string $ip_address IP address
	 * @param bool   $success   Success status
	 */
	public static function log( $tool_name, $user_id, $ip_address, $success = true ) {
		$logs = get_option( self::LOG_OPTION, [] );
		if ( ! is_array( $logs ) ) {
			$logs = [];
		}

		$logs[] = [
			'timestamp' => time(),
			'tool_name' => $tool_name,
			'user_id' => $user_id,
			'ip_address' => $ip_address,
			'success' => $success,
		];

		// Keep only recent logs
		$cutoff = time() - ( self::RETENTION_DAYS * DAY_IN_SECONDS );
		$logs = array_filter( $logs, function( $log ) use ( $cutoff ) {
			return $log['timestamp'] > $cutoff;
		} );

		// Limit total logs
		if ( count( $logs ) > self::MAX_LOGS ) {
			$logs = array_slice( $logs, -self::MAX_LOGS );
		}

		update_option( self::LOG_OPTION, $logs );
	}

	/**
	 * Get recent logs
	 *
	 * @param int $limit Number of logs to retrieve
	 * @return array
	 */
	public static function get_recent_logs( $limit = 100 ) {
		$logs = get_option( self::LOG_OPTION, [] );
		if ( ! is_array( $logs ) ) {
			return [];
		}

		// Sort by timestamp descending
		usort( $logs, function( $a, $b ) {
			return $b['timestamp'] - $a['timestamp'];
		} );

		return array_slice( $logs, 0, $limit );
	}

	/**
	 * Get total log count
	 *
	 * @return int
	 */
	public static function get_total_count() {
		$logs = get_option( self::LOG_OPTION, [] );
		if ( ! is_array( $logs ) ) {
			return 0;
		}

		return count( $logs );
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
				// Handle comma-separated IPs (X-Forwarded-For)
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
}

