<?php
/*
Plugin Name: Digitalsignagepress Pro
Plugin URI: https://digitalsignagepress.com/
Description: Use WordPress to power screens for your business. A WP Theme &amp; Plugin with examples to get content up &amp; running straight away!
Author: Digitalsignagepress.com
Version: 1.5.0
Author URI: https://digitalsignagepress.com
Copyright 2015-2017 Digitalsignagepress.com
*/


defined('ABSPATH') or die();
define('DS_VERSION', '1.5.0');


add_action( 'plugins_loaded', 'signage_load_textdomain' );
function signage_load_textdomain() {
	$folder = plugin_basename( __FILE__ );
	$folder = substr($folder, 0, strpos($folder,'/'));
	load_plugin_textdomain( 'digitalsignagepress', false, $folder.'/languages/' );
}
define('SIGNAGE_PLUGIN_NAME', 'SenseSignage');
define('SIGNAGE_PLUGIN_DIR', plugin_dir_url(__FILE__));
define('SIGNAGE_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ));
define('SIGNAGE_PLUGIN_MENU_SLUG', 'MySignage');
define('DS_BLANK_THEME', 'DigitalSignagePressThemePlugin');
define('DS_THEME_LINK', 'http://digitalsignagepress.com/wp-update-server/DigitalSignagePressTheme.zip');
function ds_nocachehead() {
	echo '<meta http-equiv="cache-control" content="max-age=0" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
<meta http-equiv="pragma" content="no-cache" />';
}
add_action('admin_head', 'ds_nocachehead');
function ds_handle_myDSSave(){
	include(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_handle_save.php'); 
}
add_action('admin_post_mydssaveaction', 'ds_handle_myDSSave');
add_action('admin_post_nopriv_mydssaveaction', 'ds_handle_myDSSave');	
function ds_handle_myDSSaveDevice(){
	include(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_handle_save_device.php');
}
add_action('admin_post_mydssavedeviceaction', 'ds_handle_myDSSaveDevice');
add_action('admin_post_nopriv_mydssavedeviceaction', 'ds_handle_myDSSaveDevice');	
function ds_handle_myDSSaveDeviceWall(){
	include(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_handle_save_devicewall.php');
}
add_action('admin_post_mydssavedevicewallaction', 'ds_handle_myDSSaveDeviceWall');
add_action('admin_post_nopriv_mydssavedevicwalleaction', 'ds_handle_myDSSaveDeviceWall');
require_once(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_misc_function.php');
function ds_print_new_signage(){
	if (has_blanktheme()) {
		$curPID = 0;
		$index = isset($_GET['viewds']) ? $_GET['viewds'] : 'home';
		if(isset($_GET['PID'])) {
			$curPID = $_GET['PID'] ;
		}
		require_once(SIGNAGE_PLUGIN_DIR_PATH.'/languages/ds_admin.php');
		if ($index == 'overview'){
				include(SIGNAGE_PLUGIN_DIR_PATH.'/pages/programs.php');
		} else if ($index == 'overviewdetails'){
				include(SIGNAGE_PLUGIN_DIR_PATH.'/pages/programsdetails.php');
		} else if ($index == 'devices'){
				include(SIGNAGE_PLUGIN_DIR_PATH.'/pages/devices.php');
		} else if ($index == 'devicewalls'){
				include(SIGNAGE_PLUGIN_DIR_PATH.'/pages/devicewalls.php');
		} else {
			require_once(SIGNAGE_PLUGIN_DIR_PATH.'/pages/admin.php');
		}
	} else {
		signage_submenu_setting();
	}
}
function ds_add_signage_menu() {
	if (has_blanktheme()) {
		$master = SIGNAGE_PLUGIN_MENU_SLUG.'_home';
	} else {
		$master = NULL;
	}
	add_menu_page (
		SIGNAGE_PLUGIN_NAME,
		SIGNAGE_PLUGIN_NAME,
		'edit_others_pages',
		SIGNAGE_PLUGIN_MENU_SLUG.'_home',
		'ds_print_new_signage',
		plugin_dir_url( __FILE__ ).'icons/icon.png',
		'23.56'
	);
	$submenus = array(__('New Playlist','digitalsignagepress') => 'home', __('Playlist','digitalsignagepress') => 'overview', __('Devices','digitalsignagepress') => 'devices', __('Videowalls','digitalsignagepress') => 'devicewalls');
	foreach ($submenus as $title => $submenu) {
		add_submenu_page( 
			$master, 
			$title, 
			$title, 
			'edit_others_pages',
			SIGNAGE_PLUGIN_MENU_SLUG.'_'.$submenu,
			'signage_submenu_'.$submenu
		);
	}
	add_submenu_page( 
		$master, 
		__('Setup','digitalsignagepress'),
		__('Setup','digitalsignagepress'),
		'edit_others_pages',
		'signagesettings',
		'signage_submenu_setting'
	);
	add_submenu_page( 
		null,
		SIGNAGE_PLUGIN_NAME, 
		SIGNAGE_PLUGIN_NAME, 
		'edit_others_pages',
		SIGNAGE_PLUGIN_MENU_SLUG,
        	'ds_print_new_signage'
	);
}
if(is_admin()) {
	add_action( 'admin_menu', 'ds_add_signage_menu' );
}
function signage_submenu_home() {
	if (has_blanktheme()) {
		require_once(SIGNAGE_PLUGIN_DIR_PATH.'/languages/ds_admin.php');
		require_once(SIGNAGE_PLUGIN_DIR_PATH.'/pages/admin.php');
	} else {
		signage_submenu_setting();
	}
}
function signage_submenu_overview() {
	if (has_blanktheme()) {
		require_once(SIGNAGE_PLUGIN_DIR_PATH.'/languages/ds_admin.php');
		include(SIGNAGE_PLUGIN_DIR_PATH.'/pages/programs.php');
	} else {
		signage_submenu_setting();
	}
}
function signage_submenu_devices() {
	if (has_blanktheme()) {
		require_once(SIGNAGE_PLUGIN_DIR_PATH.'/languages/ds_admin.php');
		include(SIGNAGE_PLUGIN_DIR_PATH.'/pages/devices.php');
	} else {
		signage_submenu_setting();
	}
}
function signage_submenu_devicewalls() {
	if (has_blanktheme()) {
		require_once(SIGNAGE_PLUGIN_DIR_PATH.'/languages/ds_admin.php');
		include(SIGNAGE_PLUGIN_DIR_PATH.'/pages/devicewalls.php');
	} else {
		signage_submenu_setting();
	}
}
function signage_submenu_setting() {
	require_once(SIGNAGE_PLUGIN_DIR_PATH.'/languages/ds_admin.php');
	require_once(SIGNAGE_PLUGIN_DIR_PATH.'/pages/ds_settings_form.php');
}
register_activation_hook( __FILE__, 'digitalsignage_activate_plugin' );
function digitalsignage_activate_plugin($networkwide) {
        require_once(SIGNAGE_PLUGIN_DIR_PATH.'includes/ds_plugin-activator.php');
        DS_Plugin_Activator::activate($networkwide);
}
require_once(SIGNAGE_PLUGIN_DIR_PATH.'includes/ds_build_page.php');
require_once(SIGNAGE_PLUGIN_DIR_PATH.'includes/ds_theme_switch.php');
require_once(SIGNAGE_PLUGIN_DIR_PATH.'includes/ds_media_replacer.php');
require_once(SIGNAGE_PLUGIN_DIR_PATH.'includes/ds_dashboard_statistics.php');
require_once(SIGNAGE_PLUGIN_DIR_PATH.'includes/ds_ajax_handlers.php');
function start_enqueue_manager() {
	require_once(SIGNAGE_PLUGIN_DIR_PATH.'includes/ds_enqueue_manager.php');
}
add_action( 'init', 'start_enqueue_manager' );
