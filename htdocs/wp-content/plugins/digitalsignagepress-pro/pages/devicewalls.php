<?php
defined( 'ABSPATH' ) or die();

if (isset($_GET['DID']) && is_numeric($_GET['DID'])) {
	require_once('devicewall.php');
	return;
}

$items_per_row = 3;
if ($items_per_row > 0) {
	$col_X = 'col_'.str_pad(intval(12/$items_per_row, 10), 2, '0', STR_PAD_LEFT);
} else {
	$items_per_row = 1;
	$col_X = 'col_01';
}
$show = 'all';
$show_types = array(
	__('Everything','digitalsignagepress') => 'all',
	__('Videowallname','digitalsignagepress') => 'name',
	__('Playlistname','digitalsignagepress') => 'program',
	__('Zipcode','digitalsignagepress') => 'zipcode',
	__('City','digitalsignagepress') => 'city',
	__('Street','digitalsignagepress') => 'street',
	__('Location','digitalsignagepress') => 'location',
	__('Change Date','digitalsignagepress') => 'changedate',
	__('Last Request','digitalsignagepress') => 'last_request',
	__('Online','digitalsignagepress') => 'online',
	__('Offline','digitalsignagepress') => 'offline',
	__('Not Updated','digitalsignagepress') => 'not_updated'
);
$wp_timezone = get_option('timezone_string');
if (in_array($wp_timezone, DateTimeZone::listIdentifiers())) {
	date_default_timezone_set($wp_timezone);
}
if (isset($_GET['show']) && in_array($_GET['show'], $show_types)) {
	$show = $_GET['show'];
}
$max_tolerance = 10 * 60;
$now_with_tolerance = time() - $max_tolerance;
?>

<div class="FullWidthRow">
<div id="wrapper">
<?php require_once 'navigation_header.php'; ?>

<div class="content-panel col_12_nm">
	<div class="step-content signage format">
		<div id="devices" class="col_12_nm">
			<div class="filter_bar col_12">
				<span><?php _e('FILTER BY:','digitalsignagepress'); ?></span>
				<select id="select_filter" onchange="update_filter(this.value);">
<?php
foreach($show_types as $type => $value) {
	if ($show == $value) {
		echo '<option value="'.$value.'" selected="selected">'.$type.'</option>';
	} else {
		echo '<option value="'.$value.'">'.$type.'</option>';
	}
}
?>
				</select>
				<input id="search_filter" class="search search1" placeholder="<?php _e('Search Filter','digitalsignagepress'); ?>">
				<input id="search_filter2" class="search search2" placeholder="<?php _e('Search Filter','digitalsignagepress'); ?>" style="display:none;">
				<span>(<?php _e('use * as wildcard','digitalsignagepress'); ?>)</span>
				<div class="page_view_bar">
					<span><?php _e('VIEW','digitalsignagepress'); ?></span>
					<select id="per_page_filter" onchange="update_per_page_view(this.value);">
						<option value="99999" selected="selected"><?php _e('All Items','digitalsignagepress'); ?></option>
						<option value="<?php echo $items_per_row;?>"><?php _e('One Row','digitalsignagepress'); ?></option>
<?php
for ($i = 2; $i < 11; $i++) {
	echo '<option value="'.($items_per_row*$i).'">'.$i.' '. __('Row','digitalsignagepress') .'</option>';
}
?>
					</select>
				</div>
				<?php ds_vidw_pagination(); ?>
			</div>			
			<ul class="list col_12_nm">
<?php
if (!isset($dsdbh)) {
	require_once(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_database_handler.php');
	$dsdbh = new DS_DB_Handler();
}
$devices = $dsdbh->get_all_devicewalls();
if (isset($devices)) {
	function deleteButton($deviceId) {
		return '<a class="sortable_list_edit_button">'
			.'<img src="'.SIGNAGE_PLUGIN_DIR.'/icons/delete.svg" onclick="deletedevice('.$deviceId.');">'
			.'</a>';
	}
	function editButton($deviceId) {
		return '<a href="?page='.SIGNAGE_PLUGIN_MENU_SLUG.'_devicewalls&DID='.$deviceId.'" class="sortable_list_edit_button">'
			.'<img src="'.SIGNAGE_PLUGIN_DIR.'/icons/edit.svg">'
			.'</a>';
	}
	$program_names = array();
	foreach($devices as $device) {
		$devicename = (!empty($device['name']) ? $device['name'] : '('.__('nameless device', 'digitalsignagepress').')');
		if ($device['programId'] > -1) {
			if (!isset($program_names[$device['programId']])) {
				$program = $dsdbh->get_program_by_id($device['programId'], false);
				if (isset($program)) {
					if (!empty($program['name'])) {
						$program_names[$device['programId']] = $program['name'];
					} else {
						$program_names[$device['programId']] = '('.__('nameless playlist', 'digitalsignagepress').')';
					}
				} else {
					$program_names[$device['programId']] = null;
				}
			}
		
			$prog_name = $program_names[$device['programId']];
			if (isset($prog_name)) {
				$ahref = '<a href="?page='.SIGNAGE_PLUGIN_MENU_SLUG.'_home&PID='.$device['programId'].'">';
				$ahref2 = '</a>';
			} else {
				$prog_name = '('.__('ERROR: no playlist', 'digitalsignagepress').')';
				$ahref = $ahref2 = '';
			}
		} else {
			$prog_name = __('N/A','digitalsignagepress');
			$ahref = $ahref2 = '';
		}
		$changedate = date('Y-m-d H:i', $device['change_date']);
		$last_request = time();
		$never = 'Never';
		foreach($device['devicewalldevices'] as $devicewalldevice) {
			$tmp_device = $dsdbh->get_device_by_id($devicewalldevice['deviceId']);
			if($last_request > $tmp_device['last_request']) {
				$last_request = $tmp_device['last_request'];
			}
			if($tmp_device['last_request'] > 0) {
				$never = __('Partly Never', 'digitalsignagepress');
			}
			
		}
		$invisible = '<p class="name" style="display:none;">'.$devicename.'</p>'
			.'<p class="program" style="display:none;">'.$prog_name.'</p>'
			.'<p class="changedate" style="display:none;">'.$changedate.'</p>'
			.'<p class="last_request" style="display:none;">'.$last_request.'</p>'
			.'<p class="up_to_date" style="display:none;">'.($last_request > $device['change_date'] ? 'yes' : 'no').'</p>'
			.'<p class="online" style="display:none;">'.($last_request > $now_with_tolerance ? 'yes' : 'no').'</p>';
		$data_types = array('zipcode', 'city', 'street', 'location');
		foreach($data_types as $type) {
			$invisible .= '<p class="'.$type.'" style="display:none;">'.$device[$type].'</p>';
		}
		echo '<li id="devrow'.$device['id'].'" class="sortable_list '.$col_X.'">'.$invisible;
		$cols = 2;
		$currentness_class = ($last_request > $device['change_date']) ? "uptodate_device" : "outdated_device";
		$last_request = ds_date('Y-m-d H:i', $last_request, $never);
		echo	'<ul class="col_12 sortable_list_item device-teaser-list">'
			.'<li class="sortable_list_item_attribute device-teaser-header"><div class="type_left">'.$devicename.'</div>'.deleteButton($device['id']).editButton($device['id']).'</li>'
			.'<div class="col_12">'
			.'<li class="sortable_list_item_attribute"><div class="type_left">'. __('Number of Devices','digitalsignagepress') .':</div>'.count($device['devicewalldevices']).'</li>'
			.'<li class="sortable_list_item_attribute"><div class="type_left">'. __('Playlist','digitalsignagepress') .':</div>'.$ahref.$prog_name.$ahref2.'</li>'
			.'<li class="sortable_list_item_attribute"><div class="type_left">'. __('Change Date','digitalsignagepress') .':</div>'.$changedate.'</li>'
			.'<li class="sortable_list_item_attribute"><div class="type_left">'. __('Last Request','digitalsignagepress') .':</div><span class="'.$currentness_class.'">'.$last_request.'</span></li>'
			.'</div>'
			.'</ul>';
		echo '</li>';
	}
}
?>
			</ul></div>
		</div>
	</div>
<?php if (isset($devices) && count($devices) > 0) { ?>
        <script type="text/javascript" src="<?php echo SIGNAGE_PLUGIN_DIR.'/js/ds_devices.js';?>"></script>
	<script type="text/javascript">
		function deletedevice(devId) {
			if (confirm("<?php _e('Are you sure you want to permanently delete this devicewall?','digitalsignagepress');?>")) {
				jQuery.ajax({
					url:"<?php echo admin_url( 'admin-ajax.php' ); ?>",
					data:{"action": "signage_delete_devicewall_ajax",
						"device": devId
					},
					type:"post",
					cache:false
				}).done (function(data) {
					if (data=="success") {
						sortList.remove('id', devId);
						jQuery('#devrow'+devId).remove();
					}
				});
			}
		}
		jQuery(document).ready(function() {
			update_filter("<?php echo $show;?>");
		});
	</script>
<?php } ?>
 </div>
</div>
