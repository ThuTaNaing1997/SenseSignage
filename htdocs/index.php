<?php
/**
 * 
 * Front to the WordPress application. This file doesn't do anything, but loads
 * wp-blog-header.php which does and tells WordPress to load the theme.
 *
 * @package WordPress
 */

/**
 * Tells WordPress to load the WordPress theme and output it.
 *
 * @var bool
 */
header("location: /wp-admin/index.php",  true,  301 );  exit;

define('WP_USE_THEMES', true);

?>

<?php
//Test Code below


/** Loads the WordPress Environment and Template */
require( dirname( __FILE__ ) . '/wp-blog-header.php' );
