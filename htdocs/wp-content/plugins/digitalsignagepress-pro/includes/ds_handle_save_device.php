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


//New Code Start

/* Attempt MySQL server connection. Assuming you are running MySQL
server with default setting (user 'root' with no password) */
$link = mysqli_connect("localhost:3306", "bn_wordpress", "ee58c16529", "bitnami_wordpress");
 
// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}

 

global $wpdb;
$tablename = $wpdb->prefix.'ds_device'; //OK


$limit = 'SELECT devicecount FROM devicelimit WHERE siteID = 1';
$count = 'SELECT COUNT(*) FROM '.$tablename;

if($result = mysqli_query($link, $limit)){
	$row = mysqli_fetch_array($result);
	$limit1 = $row['devicecount']; //OK 5ku
	
}

if($result = mysqli_query($link, $count)){
	$row = mysqli_fetch_array($result);
	$count1 = $row['COUNT(*)']; //OK
	$count1 = $count1+1;
	
}


if ($limit1 >= $count1) //OK Now
{
		if ($changed) 
	{
	
		$deviceId = $dsdbh->insert_or_update_device($device);
	
		} 
	else 
	{
	$deviceId = $device['id'];
	}
	
}
else{ //OK Now

	//print_r($limit1);
	//print_r($count1);
	//die();
	
	 print_r($limit1);
	 print_r($count1);
	 die();

 }



// NEW Code, Close connection
mysqli_close($link);

$redirect_url = admin_url("admin.php?page=".SIGNAGE_PLUGIN_MENU_SLUG).'_devices';
wp_redirect($redirect_url);
