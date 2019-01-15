<?php
if ( !defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit();
}
function dsppro_recursive_delete_folder($path) {
	if (is_dir($path) === true) {
		$files = array_diff(scandir($path), array('.', '..'));
		foreach ($files as $file) {
			dsppro_recursive_delete_folder(realpath($path) . '/' . $file);
		}
		return rmdir($path);
	} else if (is_file($path) === true) {
		return unlink($path);
	}
	return false;
}
function dsppro_uninstall() {
	global $wpdb;
	$prefix = $wpdb->prefix.'ds_';
	$tables = array('custom_template', 'device', 'format', 'program', 'program_program', 'program_program_scheduling', 'program_screen', 'program_screen_scheduling', 'screen', 'screen_element', 'screen_element_screen', 'screen_scheduling', 'template', 'scheduling', 'devicewall', 'devicewall_device');
	foreach($tables as $table) {
		$wpdb->query( 'DROP TABLE IF EXISTS '.$prefix.$table );
	}
	$uploads = wp_upload_dir();
	$path = $uploads['basedir'].'/digitalsignagepress/';
	if (is_dir($path) === true) {
		dsppro_recursive_delete_folder($path);
	}
}
if (function_exists('is_multisite') && is_multisite()) {
	global $wpdb;
	$prev_blog = $wpdb->blogid;
	$blog_ids = $wpdb->get_col('SELECT blog_id FROM '.$wpdb->blogs);
	foreach ($blog_ids as $blog_id) {
		switch_to_blog($blog_id);
		dsppro_uninstall();
	}
	switch_to_blog($prev_blog);
} else {
	dsppro_uninstall();
}
