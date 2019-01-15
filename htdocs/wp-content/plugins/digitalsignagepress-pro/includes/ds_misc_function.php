<?php
defined( 'ABSPATH' ) or die();
global $wpdb;
function ds_date($format, $timestamp, $time_zero_text = 'Never') {
	if ($time_zero_text == 'Never') {
		$time_zero_text = __('Never','digitalsignagepress');
	}
	return ($timestamp > 0 ? date($format, $timestamp) : $time_zero_text);
}
function has_blanktheme() {
	return (wp_get_theme(DS_BLANK_THEME)->exists() || wp_get_theme(str_replace('Plugin', '', DS_BLANK_THEME))->exists());
}
function allowed_device($deviceId) {
	if ($deviceId == -1) {return true;}
	global $wpdb;
	$var = $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM '.$wpdb->prefix.'ds_device WHERE id = %d', $deviceId));
	return ($var > 0);
}
function show_admin_notices() {
	if (!isset($_GET['page']) || ($_GET['page'] != 'signagesettings' && $_GET['page'] != 'MySignage_home')) {
		if (!has_blanktheme()) {
			$msg = str_replace('PLUGIN', SIGNAGE_PLUGIN_NAME, __('Only a few more steps until you can use the PLUGIN plugin.','digitalsignagepress'));
			?><div class="update-nag"><p><?php echo $msg; ?></p>
				<p>
					<a href="<?php echo admin_url('admin.php?page=signagesettings'); ?>">
						<?php _e('Complete the setup now.','digitalsignagepress'); ?>
					</a>
				</p>
			</div><?php
		}
	}
}
add_action('admin_notices', 'show_admin_notices');
function ds_dev_make_pagination() {
	?><div class="pagination_bar"><?php
	global $wpdb;
		?><a href="?page=<?php echo SIGNAGE_PLUGIN_MENU_SLUG.'_devices&DID=-1';?>" class="sortable_list_add_button"><input class="big-btn lead-button-big" type="button" value="<?php _e('Add New Device','digitalsignagepress'); ?>"></a>
	<ul class="pagination"></ul><span><?php _e('PAGE','digitalsignagepress'); ?>: </span></div><?php
}
function ds_vidw_pagination() {
	?><div class="pagination_bar"><?php
	global $wpdb;
	?><a href="?page=<?php echo SIGNAGE_PLUGIN_MENU_SLUG.'_devicewalls&DID=-1';?>" class="sortable_list_add_button"><input class="big-btn lead-button-big" type="button" value="<?php _e('Add New Videowall','digitalsignagepress'); ?>"></a>
	<ul class="pagination"></ul><span><?php _e('PAGE','digitalsignagepress'); ?>: </span>
	</div><?php
}
function ds_devsvbtn() {
	global $wpdb;
	?><input class="big-btn lead-button-big" onclick="jQuery('#save_myDS_form').submit();" value="<?php _e('SAVE','digitalsignagepress'); ?>" type="button"><?php
}
function ds_valid_nav_page() {
	$result = false;
	if (is_admin()) {
		if (!$result) {
			$page = $_SERVER['PHP_SELF'];
			$page = explode('/', $page);
			$page = end($page);
			if (in_array($page, array('login.php', 'upload.php'))) {
				$result = true;
			}
			if (!$result && $page == 'admin.php' && isset($_GET['page']) && strpos($_GET['page'], SIGNAGE_PLUGIN_MENU_SLUG) > -1) {
				$result = true;
			}
			if (!$result && $page == 'post.php' && isset($_GET['action']) && $_GET['action'] == 'edit') {
				$result = true;
			}
		}
	}
	return $result;
}
function ds_wp_mechanic_page() {
	$result = false;
	$page = $_SERVER['PHP_SELF'];
	$page = explode('/', $page);
	$page = end($page);
	if (in_array($page, array('login.php', 'upload.php', 'admin-ajax.php', 'admin-post.php', 'async-upload.php', 'post.php', 'post-new.php'))) {
		$result = true;
	}
	return $result;
}
function ds_home_url() {
	global $wpdb;
	if (stripos(strrev($wpdb->prefix), strrev($wpdb->blogid.'_')) === 0) {
		$z = -strlen('_'.$wpdb->blogid);
		$blogs = substr($wpdb->prefix, 0, $z).'blogs';
	} else {
		$blogs = $wpdb->prefix.'blogs';
	}
	if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $blogs)) == $blogs) {
		$domain = $wpdb->get_var($wpdb->prepare('SELECT domain FROM '.$blogs.' WHERE blog_id = %d', $wpdb->blogid));
		if (isset($domain) && !empty($domain)) {
			return $domain;
		}
	}
	return network_home_url();
}
