<?php
defined( 'ABSPATH' ) or die();
require_once('ds_database_handler.php');
if (!isset($dsdbh)) {
	$dsdbh = new DS_DB_Handler();
}

if (isset($_POST['device_id']) && is_numeric($_POST['device_id'])) {
	$device = $dsdbh->get_device_by_id(sanitize_text_field($_POST['device_id']));
}
$changed = false;
if (!isset($device)) {
	$device = $dsdbh->make_new_device('', '', '', '', '', '');
	$changed = true;
}
$types = array('name', 'programId', 'location', 'street', 'city', 'zipcode');
foreach($types as $type) {
	if (isset($_POST['device_'.$type]) && sanitize_text_field($_POST['device_'.$type]) != $device[$type]) {
		$device[$type] = stripslashes(sanitize_text_field($_POST['device_'.$type]));
		$changed = true;
	}
}
if ($changed) {
	$deviceId = $dsdbh->insert_or_update_device($device);
} else {
	$deviceId = $device['id'];
}
$redirect_url = admin_url("admin.php?page=".SIGNAGE_PLUGIN_MENU_SLUG).'_devices';
wp_redirect($redirect_url);
