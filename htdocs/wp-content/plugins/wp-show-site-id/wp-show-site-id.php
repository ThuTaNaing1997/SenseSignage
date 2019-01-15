<?php
/**
 * Plugin Name: Wp Show Site ID
 * Plugin URI: https://emanuelacastorina.com/
 * Description: This plugin in a multisite installation shows the ID of the current site/blog.
 * Version: 1.0.2
 * Author: Emanuela Castorina
 * Author URI: https://emanuelacastorina.com/
 * Requires at least: 4.4
 * Tested up to: 4.9.8
 *
 * Text Domain: wp-show-site-id
 * Domain Path: /languages/
 *
 */


if ( ! defined( 'WP_SHOW_SITE_ID_START_VERSION' ) ) {
	define( 'WP_SHOW_SITE_ID_START_VERSION', '1.0.2' );
}


if ( ! defined( 'WP_SHOW_SITE_ID_START' ) ) {
	define( 'WP_SHOW_SITE_ID_START', plugin_basename( __FILE__ ) );
}

add_filter( 'plugins_loaded', 'wp_show_site_id_start' );

if ( ! function_exists( 'wp_show_site_id_start' ) ) {
	function wp_show_site_id_start() {

		require_once( 'class.wp-show-site-id.php' );
		load_plugin_textdomain( 'wp-show-site-id', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
		WP_Show_Site_ID();
	}
}

