<?php
defined( 'ABSPATH' ) or die();
$penalty = 2;
?>
<div class="wrapper wrapper_m">
<div class="col_12_nm wrap-header">
	<div class="col_12_nm main-header">
		<div class="col_02_nm">
			<a id="logo" href="https://digitalsignagepress.com" target=_blank>
			<img alt="Logo" style="height: 60px;background-color:#3E454C;" src="<?php echo SIGNAGE_PLUGIN_DIR; ?>/icons/dsp.png">
		</a>
		</div>
		<?php
$current = 'home';
$nav_types = array(
	__('New Playlist','digitalsignagepress') => 'home',
	__('Playlists','digitalsignagepress') => 'overview',
	__('Devices','digitalsignagepress') => 'devices',
	__('Videowalls','digitalsignagepress') => 'devicewalls'
);
$nav_title = array(
	'home' => __('Create a new playlist.','digitalsignagepress'),
	'overview' => __('View and edit existing playlists.','digitalsignagepress'),
	'devices' => __('Manage your viewing devices and generate urls for viewing your content on them.','digitalsignagepress'),
	'devicewalls' => __('Configure videowalls - show your content across multiple devices.','digitalsignagepress')
);
$user_id = get_current_user_id();
if (isset($_GET['viewds']) && in_array($_GET['viewds'], $nav_types)) {
	$current = $_GET['viewds'];
}
if (isset($_GET['page']) && strpos($_GET['page'], SIGNAGE_PLUGIN_MENU_SLUG) > -1) {
	$test = str_replace(SIGNAGE_PLUGIN_MENU_SLUG.'_', '', $_GET['page']);
	if (!empty($test) && in_array($test, $nav_types)) {
		$current = $test;
	}
}
if ($current == 'home' && isset($_GET['PID'])) {
	$current = 'overview';
}
$width_style = 'style="width:'.(100/(count($nav_types)+$penalty)).'%"';
foreach($nav_types as $nav => $type) {
	echo '<div class="col_02_nm"';
	if (!empty($nav_title[$type])) {
		echo ' title="'.$nav_title[$type].'"';
	}
	echo ' '.$width_style.'>';
	if ($type == $current) {
		echo '<a class="header-navi-active" ';
	} else {
		echo '<a class="header-navi" ';
	}
	$ds_url_link = 'admin.php?page='.SIGNAGE_PLUGIN_MENU_SLUG.'_'.$type;
	if ($type == 'logout'){
		$ds_url_link = wp_logout_url();
	}
		echo 'href="'.$ds_url_link.'">'
			.'<div class="navi-icon icon-nav-'.$type.'"></div>'
			.'<div>'.$nav.'</div>'
		.'</a>'
	.'</div>';
}
?>
		<div class="col_02_nm">
		</div>
	</div>
</div>
</div>

