<?php
defined('ABSPATH') or die();
require_once('ds_database_handler.php');
if (!isset($dsdbh)) {
    $dsdbh = new DS_DB_Handler();
}
if (isset($_POST['devicewall_id']) && is_numeric($_POST['devicewall_id'])) {
    $devicewall = $dsdbh->get_devicewall_by_id(sanitize_text_field($_POST['devicewall_id']));
} else {
    wp_die("Illegal Argument");
}
$updatedevices = false;
$changed = false;
if (!isset($devicewall)) {
    $devicewall = $dsdbh->make_new_devicewall('', '', '1920', '1080', '0', '0', '', '', '', '', '', '-1', '0', array());
    $changed = true;
} else {
    $updatedevices = true;
}
$types = array('resolution_w', 'resolution_h', 'bezel_compensation_w', 'bezel_compensation_h', 'name', 'location', 'street', 'city', 'zipcode', 'programId', 'portrait');
foreach ($types as $type) {
    if (isset($_POST['device_' . $type]) && sanitize_text_field($_POST['device_' . $type]) != $devicewall[$type]) {
        $devicewall[$type] = sanitize_text_field($_POST['device_' . $type]);
        $changed = true;
    }
}
if ($changed) {
    if ($updatedevices) {
        $types = array('resolution_w', 'resolution_h', 'name', 'location', 'street', 'city', 'zipcode', 'programId');
        foreach ($devicewall['devicewalldevices'] as $devicewalldevice) {
            $changed = false;
            foreach ($types as $type) {
                if (isset($_POST['device_' . $type]) && sanitize_text_field($_POST['device_' . $type]) != $devicewalldevice[$type]) {
                    $devicewalldevice[$type] = sanitize_text_field($_POST['device_' . $type]);
                    $changed = true;
                }
            }
            if ($changed) {
                $dsdbh->insert_or_update_devicewall_devices($devicewalldevice);
		$devicewall['devicewalldevices'][$devicewalldevice['id']] = $devicewalldevice;
            } else {
                break;
            }
        }
    }
    $devicewallId = $dsdbh->insert_or_update_devicewall($devicewall);
    $devicewall['id'] = $devicewallId;
} else {
    $devicewallId = $devicewall['id'];
}
if ($_POST['device_wall_rows'] != $devicewall['wall_rows'] || $_POST['device_wall_columns'] != $devicewall['wall_columns']) {
    if (count($devicewall['devicewalldevices']) == 0) {
        for ($j = 1; $j <= $_POST['device_wall_rows']; $j++) {
            for ($i = 1; $i <= $_POST['device_wall_columns']; $i++) {
                $deviceId_to_set = $i == 1 && $j == 1 ? $_POST['device_id'] : -1;
                $tmp_device = $dsdbh->make_new_devicewall_device(
                        $devicewallId, $deviceId_to_set, $i, $j, 0, $_POST['device_resolution_w'], $_POST['device_resolution_h'], $_POST['device_programId'], $_POST['device_name'], $_POST['device_location'], $_POST['device_street'], $_POST['device_city'], $_POST['device_zipcode']);
                $tmp_device_id = $dsdbh->insert_or_update_devicewall_devices($tmp_device);
                $tmp_device = $dsdbh->get_devicewall_device_by_id($tmp_device_id);
                $devicewall['devicewalldevices'][$tmp_device_id] = $tmp_device;
            }
        }
    } else {
        foreach ($devicewall['devicewalldevices'] as $devicewalldevice) {
            if ($devicewalldevice['pos_y'] > $_POST['device_wall_rows'] || $devicewalldevice['pos_x'] > $_POST['device_wall_columns']) {
                unset($devicewall['devicewalldevices'][$devicewalldevice['id']]);
            }
        }
        for ($i = 1; $i <= $_POST['device_wall_columns']; $i++) {
            for ($j = 1; $j <= $_POST['device_wall_rows']; $j++) {
                $tmp_device = $dsdbh->get_devicewall_device_by_pos($devicewallId, $i, $j);
                if (!isset($tmp_device)) {
                    $tmp_device = $dsdbh->make_new_devicewall_device(
                            $devicewallId, -1, $i, $j, 0, $_POST['device_resolution_w'], $_POST['device_resolution_h'], $_POST['device_programId'], $_POST['device_name'], $_POST['device_location'], $_POST['device_street'], $_POST['device_city'], $_POST['device_zipcode']);
                    $tmp_device_id = $dsdbh->insert_or_update_devicewall_devices($tmp_device);
                    $tmp_device = $dsdbh->get_devicewall_device_by_id($tmp_device_id);
                    $devicewall['devicewalldevices'][$tmp_device_id] = $tmp_device;
                }
            }
        }
    }
    $devicewall['wall_rows'] = $_POST['device_wall_rows'];
    $devicewall['wall_columns'] = $_POST['device_wall_columns'];
    $dsdbh->insert_or_update_devicewall($devicewall);
}
$redirect_url = admin_url("admin.php?page=" . SIGNAGE_PLUGIN_MENU_SLUG) . '_devicewalls';
wp_redirect($redirect_url);
