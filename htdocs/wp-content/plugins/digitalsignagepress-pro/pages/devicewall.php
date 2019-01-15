<div class="FullWidthRow">
    <?php
    $plugindir = SIGNAGE_PLUGIN_DIR;
    $htmlcode = $plugindir.'/img/signage_button.png';
    $needleimage = 'ds-image-container';
    $needle2 = 'src="';
    $needleend = '"';

    global $wpdb;
    $lim_n=100;
    $lin_m=0;
    if (!isset($dsdbh)) {
        require_once(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_database_handler.php');
        $dsdbh = new DS_DB_Handler();
    }
    if (isset($_GET['DID']) && is_numeric($_GET['DID'])) {
	$devicewall = $dsdbh->get_devicewall_by_id($_GET['DID']);
    }
    if (!isset($devicewall)) {
        $device = $dsdbh->make_new_devicewall_device('-1', '-1', '1', '1', '', '1920', '1080', '-1', '""', '""', '""', '""', '""');
        $devicewall = $dsdbh->make_new_devicewall('3', '3', '1920', '1080', '0', '0', '', '', '', '', '', '', '0', array());
        unset($program);
    } else {
	$lin_m = $devicewall['wall_rows']*$devicewall['wall_columns'];
	$device = current($devicewall['devicewalldevices']);
        $foundcontent = false;
    }
if($lim_n < 0) {$lim_n = 0;}
if($lin_m < 0) {$lin_m = 0;}
    require_once('navigation_header.php');
    include("devicewall.phtml");
    ?></div>
<script type="text/javascript">
	function svform() {
		if (document.getElementById('device_wall_rows').value*document.getElementById('device_wall_columns').value - <?php echo $lin_m;?> <= <?php echo $lim_n;?>) {jQuery('#save_myDS_form').submit();}
	}
	function cksv() {
		if (document.getElementById('device_wall_rows').value*document.getElementById('device_wall_columns').value - <?php echo $lin_m;?> <= <?php echo $lim_n;?>) {document.getElementById('svfrm').className='big-btn lead-button-big';document.getElementById('svfrm').disabled=false;} else {document.getElementById('svfrm').className='big-btn ds_disabled_button';document.getElementById('svfrm').disabled=true;}
	}
</script>
<?php
