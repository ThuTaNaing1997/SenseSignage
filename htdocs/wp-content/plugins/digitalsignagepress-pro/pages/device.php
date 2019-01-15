<?php
defined( 'ABSPATH' ) or die();
global $wpdb;
if (!isset($dsdbh)) {
	require_once(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_database_handler.php');
	$dsdbh = new DS_DB_Handler();
}
if (isset($_GET['DID']) && is_numeric($_GET['DID'])) {
	$device = $dsdbh->get_device_by_id($_GET['DID']);
	if (isset($_GET['rmBrow']) && $_GET['rmBrow'] == '1'){
		$device['dtp'] = "";
		$device['ua'] = "";
		$device['ald'] = "";
		$dsdbh->insert_or_update_device($device);
	}
}
if (!isset($device)) {
	$device = $dsdbh->make_new_device('', -1, '', '', '', '', '');
}
$wp_timezone = get_option('timezone_string');
if (in_array($wp_timezone, DateTimeZone::listIdentifiers())) {
	date_default_timezone_set($wp_timezone);
}
?>
<div class="FullWidthRow">
<div id="wrapper">
<?php require_once('navigation_header.php'); ?>


<div class="content-panel col_12_nm">
		<div id="devices" class="col_12">

<form id="save_myDS_form" name="save_myDS_form"  method="post" action="<?php echo get_admin_url().'admin-post.php'; ?>">
<input type="hidden" name="device_id" id="device_id" value="<?php echo $device['id'];?>">
<table class="device_table">
<tr><th colspan="3"><?php _e('Device Details','digitalsignagepress'); ?></th></tr>
<?php
$devicewalldevice_device = $wpdb->get_results($wpdb->prepare('SELECT * FROM '.$wpdb->prefix.'ds_devicewall_device WHERE deviceId = %d', $device['id']), ARRAY_A);
if(empty($devicewalldevice_device)) { ?>
<tr><td><?php _e('Name','digitalsignagepress'); ?></td><td colspan="2"><input type="text" name="device_name" id="device_name" value="<?php echo $device['name'];?>"></td></tr>
<?php } else { ?>
<tr><td><?php _e('Name','digitalsignagepress'); ?></td><td colspan="2"><span><?php echo $device['name'];?></span></td></tr>
<?php } ?>
<tr><td><?php _e('Playlist','digitalsignagepress'); ?></td><td colspan="2">
<?php
if (empty($devicewalldevice_device)) { ?>
<select id="device_programId" name="device_programId">
<?php
echo '<option value="-1">'. __('No Program','digitalsignagepress') .'</option>';
$programs = $wpdb->get_results('SELECT * FROM '.$wpdb->prefix.'ds_program ORDER BY id', ARRAY_A);
if ($programs) {
	foreach($programs as $program) {
		$programname = $program['name'];
		if (empty($programname)) {
			$programname = '(nameless playlist)';
		}
		if ($program['id'] == $device['programId']) {
			echo '<option value="'.$program['id'].'" selected="selected">'.$programname.'</option>';
		} else {
			echo '<option value="'.$program['id'].'">'.$programname.'</option>';
		}
	}
}
?>
</select>
<?php } else {
	echo '<span>';
	if ($device['programId'] > -1) {
		$program = $dsdbh->get_program_by_id($device['programId']);
		if (isset($program)) {
			echo $program['name'];
		} else {
			_e('No Program','digitalsignagepress');
		}
	} else {
		_e('No Program','digitalsignagepress');
	}
	echo '</span>';
} ?>
</td>
</tr>
<?php if (!empty($devicewalldevice_device)) {?>
<tr><td><?php _e('Location','digitalsignagepress'); ?></td><td colspan="2"><span><?php echo $device['location'];?></span></td></tr>
<tr><td><?php _e('Street','digitalsignagepress'); ?></td><td colspan="2"><span><?php echo $device['street'];?></span></td></tr>
<tr><td><?php _e('City','digitalsignagepress'); ?></td><td colspan="2"><span><?php echo $device['city'];?></span></td></tr>
<tr><td><?php _e('Zipcode','digitalsignagepress'); ?></td><td colspan="2"><span><?php echo $device['zipcode'];?></span></td></tr>
<?php } else { ?>
<tr><td><?php _e('Location','digitalsignagepress'); ?></td><td colspan="2"><input type="text" name="device_location" id="device_location" value="<?php echo $device['location'];?>"></td></tr>
<tr><td><?php _e('Street','digitalsignagepress'); ?></td><td colspan="2"><input type="text" name="device_street" id="device_street" value="<?php echo $device['street'];?>"></td></tr>
<tr><td><?php _e('City','digitalsignagepress'); ?></td><td colspan="2"><input type="text" name="device_city" id="device_city" value="<?php echo $device['city'];?>"></td></tr>
<tr><td><?php _e('Zipcode','digitalsignagepress'); ?></td><td colspan="2"><input type="text" name="device_zipcode" id="device_zipcode" value="<?php echo $device['zipcode'];?>"></td></tr>
<?php }
if ($device['id'] > -1) {
$changedate = date('Y-m-d H:i', $device['changedate']);
$last_request = ds_date('Y-m-d H:i', $device['last_request']);
$currentness_class = ($device['last_request'] > $device['changedate']) ? 'uptodate_device" title="'.__('This Device has the latest playlist.','digitalsignagepress') : 'outdated_device" title="'.__("This Device hasn't yet downloaded the latest playlist.",'digitalsignagepress');?>
<tr><td><?php _e('Change Date','digitalsignagepress'); ?></td><td colspan="2"><span><?php echo $changedate;?></span></td></tr>
<tr><td><?php _e('Last Request','digitalsignagepress'); ?></td><td colspan="2"><span class="<?php echo $currentness_class;?>"><?php echo $last_request;?></span></td></tr>
<?php } ?>
<?php if($device['id'] > -1) {
	?><tr><td><?php _e('Browser of allocated Device','digitalsignagepress'); ?></td><td colspan="2"><?php echo $device['ua'];?></td></tr><?php
}
?><tr><td></td><td colspan="2"><?php ds_devsvbtn();?>
<?php if ($device['id'] > -1) {
	?><a href="<?php echo "?page=".SIGNAGE_PLUGIN_MENU_SLUG."_devices&rmBrow=1&DID=".$device['id'];; ?>"><input class="big-btn lead-button-big"  value="<?php _e('Allow other device to use this URL','digitalsignagepress'); ?>" type="button" style="float: right"></a><?php
}?></td></tr>
</table>
<input name="action" value="mydssavedeviceaction" type="hidden">
</form>
</div>
</div>
<div class="col_12">
<?php
if ($device['id'] > 0) {
?><table class="device_table"><tr><th colspan="3"><?php _e('Enter these URLs into your device to see this playlist on your device','digitalsignagepress'); ?></th></tr><?php
	$pages = $wpdb->get_results('SELECT ID, post_title, guid FROM '.$wpdb->prefix.'posts WHERE post_type = "page" AND post_content LIKE "%[digitalsignage]%" ORDER BY ID', ARRAY_A);
	if (count($pages) > 0) {
		foreach ($pages as $page) {
			$post_url = get_permalink($page['ID']);
			if (empty($post_url)) {
				$post_url = $page['guid'];
			}
			if (strpos($post_url, '?') > -1) {
				$post_url .= '&device='.$device['id'];
			} else {
				$post_url .= '?device='.$device['id'];
			}
			echo '<tr><td>'.$device['name'] .'</td><td colspan="2"><a href="'.$post_url.'">'.$post_url.'</a></td></tr>';
		}
	} else {
		?>
		<tr><td colspan="3"><?php _e('No pages are configured with the [digitalsignage] shortcode.','digitalsignagepress'); ?></td></tr>
		<tr><td colspan="3"><?php _e('Please add it to one.','digitalsignagepress'); ?></td></tr>
		<?php
	}
	?></table><?php
}
if ($device['programId']) {
	$uploads = wp_upload_dir();
	$smil_file = $uploads['basedir'].'/digitalsignagepress/smil/'.$device['programId'].'.smil';
	if (file_exists($smil_file)) {
		?></div><div class="col_12"><table class="device_table"><tr><th colspan="3"><?php _e('Enter this URL into your device with SMIL support.','digitalsignagepress'); ?></th></tr><?php
		$smil_url = $uploads['baseurl'].'/digitalsignagepress/smil/'.$device['programId'].'.smil';
		echo '<tr><td></td><td colspan="2"><a href="'.$smil_url.'">'.$smil_url.'</a></td></tr>';
		?></table><?php
	}
}
?>
</div>
</div>
<?php
