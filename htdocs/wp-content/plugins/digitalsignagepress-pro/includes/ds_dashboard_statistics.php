<?php
defined( 'ABSPATH' ) or die();
add_action('wp_dashboard_setup', 'signage_add_custom_dashboard_widget');
function signage_add_custom_dashboard_widget() {
	wp_add_dashboard_widget('custom_help_widget', 'Digital Signage', 'signage_custom_dashboard');
}
function signage_custom_dashboard() {
	if (!isset($dsdbh)) {
		require_once(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_database_handler.php');
		$dsdbh = new DS_DB_Handler();
	}
	$wp_timezone = get_option('timezone_string');
	if (in_array($wp_timezone, DateTimeZone::listIdentifiers())) {
		date_default_timezone_set($wp_timezone);
	}
	global $wpdb;
	$prefix = $wpdb->prefix.'ds_';
	$max_tolerance = 10 * 60;
	$now_with_tolerance = time() - $max_tolerance;
	$total_programs = $wpdb->get_var('SELECT COUNT(*) FROM '.$prefix.'program');
	$total_screens = $wpdb->get_var('SELECT COUNT(*) FROM '.$prefix.'screen');
	$total_devices = $wpdb->get_var('SELECT COUNT(*) FROM '.$prefix.'device');
	$total_devicewalls = $wpdb->get_var('SELECT COUNT(*) FROM '.$prefix.'devicewall');
	$updated_devices = $wpdb->get_var('SELECT COUNT(*) FROM '.$prefix.'device WHERE last_request > changedate');
	$online_devices = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$prefix.'device WHERE last_request > %d', $now_with_tolerance));
	$latest_change = $wpdb->get_row('SELECT mp, ms, md, dw, dd FROM (SELECT MAX(change_date) AS mp FROM '.$prefix.'program) mp, (SELECT MAX(change_date) AS ms FROM '.$prefix.'screen) ms, (SELECT MAX(changedate) AS md FROM '.$prefix.'device) AS md, (SELECT MAX(change_date) AS dw FROM '.$prefix.'devicewall) AS dw, (SELECT MAX(change_date) AS dd FROM '.$prefix.'devicewall_device) AS dd', ARRAY_A);
	$latest_edit = 'N/A';
	if (isset($latest_change)) {
		$last_timestamp = 0;
		$types = array('md', 'mp', 'ms', 'dw', 'dd');
		foreach($types as $type) {
			if (isset($latest_change[$type])) {
				$last_timestamp = max($last_timestamp, $latest_change[$type]);
			}
		}
		if ($last_timestamp > 0) {
			$latest_edit = ds_date('Y-m-d H:i', $last_timestamp);
		}
	}
?>
<p>
<link rel="stylesheet" type="text/css" href="<?php echo SIGNAGE_PLUGIN_DIR; ?>/css/dashboard.css">
</p>
<table id="signage_dashboard_table">
<?php if ($online_devices == $total_devices) { ?>
	<tr><td><?php _e('Online Devices','digitalsignagepress');?></td><td><?php echo $online_devices.__(' of ','digitalsignagepress').$total_devices;?></td></tr>
<?php } else { ?>
	<tr><td><?php _e('Online Devices','digitalsignagepress');?></td><td><a href="<?php echo 'admin.php?page='.SIGNAGE_PLUGIN_MENU_SLUG.'_devices&show=offline';?>"><?php echo $online_devices.__(' of ','digitalsignagepress').$total_devices;?></a></td></tr>
<?php }?>
<?php if ($updated_devices == $total_devices) { ?>
	<tr><td><?php _e('Updated Devices','digitalsignagepress');?></td><td><?php echo $updated_devices.__(' of ','digitalsignagepress').$total_devices;?></td></tr>
<?php } else { ?>
	<tr><td><?php _e('Updated Devices','digitalsignagepress');?></td><td><a href="<?php echo 'admin.php?page='.SIGNAGE_PLUGIN_MENU_SLUG.'_devices&show=not_updated';?>"><?php echo $updated_devices.__(' of ','digitalsignagepress').$total_devices;?></a></td></tr>
<?php }?>
	<tr><td><?php _e('Last Edit','digitalsignagepress');?></td><td><?php echo $latest_edit;?></td></tr>
	<tr><td><?php _e('Number of Playlists','digitalsignagepress');?></td><td><?php echo $total_programs;?></td></tr>
	<tr><td><?php _e('Number of Slides','digitalsignagepress');?></td><td><?php echo $total_screens;?></td></tr>
	<tr><td><?php _e('Number of Devices','digitalsignagepress');?></td><td><?php echo $total_devices;?></td></tr>
	<tr><td><?php _e('Number of Devicewalls','digitalsignagepress');?></td><td><?php echo $total_devicewalls;?></td></tr>
</table>

<?php
}
