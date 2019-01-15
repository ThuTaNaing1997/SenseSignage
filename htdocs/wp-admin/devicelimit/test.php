<?php
/** Load WordPress Administration Bootstrap */
//require_once( dirname( __FILE__ ) . '/admin.php' );

//require_once( dirname( __FILE__ ) . '/admin.php' );

echo dirname( __FILE__ );

//require_once( '../wp-settings.php');
//include('../header.php');

require_once( dirname( __FILE__ ) . '/admin.php' );

global $wpdb;
echo $wpdb->prefix;
echo $GLOBALS['table_prefix'];

echo $_SERVER['REQUEST_URI'];
?>

