<?php
defined( 'ABSPATH' ) or die();
add_action('wp_ajax_signage_delete_program_ajax', 'signage_delete_program_ajax');
add_action('wp_ajax_nopriv_signage_delete_program_ajax', 'signage_delete_program_ajax');
function signage_delete_program_ajax() {
	$result = 'failure';
	if (isset($_REQUEST)) {
		$result = 'success';
		if (isset($_REQUEST['program']) && is_numeric($_REQUEST['program']) && $_REQUEST['program'] > 0) {
			if (!isset($dsdbh)) {
				require(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_database_handler.php');
				$dsdbh = new DS_DB_Handler();
			}
			$dsdbh->delete_program_by_id($_REQUEST['program']);
		}
	}
	echo $result;
	die();
}
add_action('wp_ajax_signage_delete_programscreen_ajax', 'signage_delete_programscreen_ajax');
add_action('wp_ajax_nopriv_signage_delete_programscreen_ajax', 'signage_delete_programscreen_ajax');
function signage_delete_programscreen_ajax() {
	$result = 'failure';
	if (isset($_REQUEST)) {
		$result = 'success';
		if (isset($_REQUEST['program']) && is_numeric($_REQUEST['program']) && $_REQUEST['program'] > 0
			&& isset($_REQUEST['screen']) && is_numeric($_REQUEST['screen']) && $_REQUEST['screen'] > 0) {
			if (!isset($dsdbh)) {
				require(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_database_handler.php');
				$dsdbh = new DS_DB_Handler();
			}
			$dsdbh->remove_program_screen($_REQUEST['program'], $_REQUEST['screen']);
		}
	}
	echo $result;
	die();
}
add_action('wp_ajax_signage_delete_device_ajax', 'signage_delete_device_ajax');
add_action('wp_ajax_nopriv_signage_delete_device_ajax', 'signage_delete_device_ajax');
function signage_delete_device_ajax() {
	$result = 'failure';
	if (isset($_REQUEST)) {
		$result = 'success';
		if (isset($_REQUEST['device']) && is_numeric($_REQUEST['device']) && $_REQUEST['device'] > 0) {
			if (!isset($dsdbh)) {
				require(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_database_handler.php');
				$dsdbh = new DS_DB_Handler();
			}
			$dsdbh->delete_device_by_id($_REQUEST['device']);
		}
	}
	echo $result;
	die();
}
add_action('wp_ajax_signage_delete_devicewall_ajax', 'signage_delete_devicewall_ajax');
add_action('wp_ajax_nopriv_signage_delete_devicewall_ajax', 'signage_delete_devicewall_ajax');
function signage_delete_devicewall_ajax() {
	$result = 'failure';
	if (isset($_REQUEST)) {
		$result = 'success';
		if (isset($_REQUEST['device']) && is_numeric($_REQUEST['device']) && $_REQUEST['device'] > 0) {
			if (!isset($dsdbh)) {
				require(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_database_handler.php');
				$dsdbh = new DS_DB_Handler();
			}
			$dsdbh->delete_devicewall_by_id($_REQUEST['device']);
		}
	}
	echo $result;
	die();
}
add_action('wp_ajax_signage_refresh_slide_copy_ajax', 'signage_refresh_slide_copy_ajax');
add_action('wp_ajax_nopriv_signage_refresh_slide_copy_ajax', 'signage_refresh_slide_copy_ajax');
function signage_refresh_slide_copy_ajax() {
	$table = 'error';
	if (!isset($dsdbh)) {
		require(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_database_handler.php');
		$dsdbh = new DS_DB_Handler();
	}
	$programs = $dsdbh->get_all_programs(true);
	if (isset($programs)) {
		global $wpdb;
		$table = '';
		$formats = array();
		function limitname($name) {
			$result = $name;
			if (strlen($name) > 20) {
				$result = substr($name,0,19).'..';
			}
			return $result;
		}
		function limittitle($name) {
			$result = '';
			if (strlen($name) > 20) {
				$result = ' title="'.$name.'"';
			}
			return $result;
		}
		foreach($programs as $program) {
			foreach($program['screens'] as $screen) {
				if (isset($screen['format_type']) && $_REQUEST['orientation'] > -1 && $screen['format_type'] != $_REQUEST['orientation']) {
					continue;
				}
				$table .= '<li id="copy_entry_'.$program['id'].'_'.$screen['id'].'" class="copy_elem" onclick="selectcopy('.$program['id'].', '.$screen['id'].');">';
				$img = 'none.png';
				$landscape = -1;
				if ($screen['formatId'] > -1) {
					$formatId = $screen['formatId'];
					if (!isset($formats[$formatId])) {
						$temp = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$wpdb->prefix.'ds_format WHERE id = %d', $formatId), ARRAY_A);
						$formats[$formatId] = isset($temp) ? ($temp['type']%2) : null;
					}
					if (isset($formats[$formatId])) $landscape = $formats[$formatId];
				}
				if ($screen['customTemplateId'] > -1) {
					if ($landscape == -1) {
						$formatId = $wpdb->get_var($wpdb->prepare('SELECT formatId FROM '.$wpdb->prefix.'ds_custom_template WHERE id = %d', $screen['customTemplateId']));
						if (!isset($formats[$formatId])) {
							$temp = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$wpdb->prefix.'ds_format WHERE id = %d', $formatId), ARRAY_A);
							$formats[$formatId] = isset($temp) ? ($temp['type']%2) : 1;
						}
						$landscape = $formats[$formatId];
					}
					$img = SIGNAGE_PLUGIN_DIR.'/templates/screen_custom_'.($landscape ? 'landscape' : 'portrait').'.jpg';
				} else if ($screen['templateId'] > -1) {
					if ($landscape == -1) {
						$formatId = $wpdb->get_var($wpdb->prepare('SELECT formatId FROM '.$wpdb->prefix.'ds_template WHERE id = %d', $screen['templateId']));
						if (!isset($formats[$formatId])) {
							$temp = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$wpdb->prefix.'ds_format WHERE id = %d', $formatId), ARRAY_A);
							$formats[$formatId] = isset($temp) ? ($temp['type']%2) : 1;
						}
						$landscape = $formats[$formatId];
					}
					$img = SIGNAGE_PLUGIN_DIR.'/templates/'.($landscape ? 'v' : 'vp').sprintf('%03d', $screen['templateId']).'.jpg';
				}
				$table .= '<div class="copy_preview"><img src="'.$img.'"></div>';
				$table .= '<div class="copy_data"><div>'.__('Slide', 'digitalsignagepress').':</div><div style="margin-bottom:3px;"'.limittitle($screen['name']).'><b>'.limitname($screen['name']).'</b></div><div>'.__('Playlist', 'digitalsignagepress').':</div><div style="margin-bottom:3px;"'.limittitle($program['name']).'><b>'.limitname($program['name']).'</b></div><div>'.__('Last Edit', 'digitalsignagepress').':</div><div><b>'.date('Y-m-d H:i', $screen['change_date']).'</b></div></div>';
				$table .= '</li>';
			}
		}
	}
	echo $table;
	die();
}
add_action('wp_ajax_signage_make_slide_copy_ajax', 'signage_make_slide_copy_ajax');
add_action('wp_ajax_nopriv_signage_make_slide_copy_ajax', 'signage_make_slide_copy_ajax');
function signage_make_slide_copy_ajax() {
	$result = 'error';
	if (isset($_REQUEST) && isset($_REQUEST['scid'])) {
		if (!isset($dsdbh)) {
			require(SIGNAGE_PLUGIN_DIR_PATH.'/includes/ds_database_handler.php');
			$dsdbh = new DS_DB_Handler();
		}
		$screen = $dsdbh->get_screen_by_id($_REQUEST['scid']);
		if (isset($screen)) {
			$temp = array();
			$temp['Name'] = htmlspecialchars(stripslashes($screen['name']));
			$temp['Ratio'] = $screen['ratio'];
			$temp['Format'] = $screen['format_type'];
			foreach($screen['elements'] as $element) {
				$temp['E'.$element['pos_nr'].'_id'] = '-1';
				$temp['E'.$element['pos_nr'].'_name'] = esc_html($element['name']);
				$temp['E'.$element['pos_nr'].'_content'] = htmlspecialchars(stripslashes(stripslashes($element['htmlcode'])));
			}
			$temp['maxEID'] = count($screen['elements']);
			if ($screen['templateId'] > -1) {
				$temp['TemplateId'] = $screen['templateId'];
				$temp['CustomTemplateId'] = '-1';
			} else if ($screen['customTemplateId'] > -1) {
				$temp['CustomTemplateId'] = 0;
				$temp['CustomTemplateName'] = $screen['template_name'];
				$temp['CustomTemplateCode'] = htmlspecialchars(stripslashes(stripslashes($screen['template_htmlcode'])));
				$temp['TemplateId'] = -1;
			} else {
				$temp['TemplateId'] = 1;
				$temp['CustomTemplateId'] = '-1';
			}
		}
		$result = json_encode($temp);
	}
	echo $result;
	die();
}
add_action('wp_ajax_signage_img_info_ajax', 'signage_img_info_ajax');
add_action('wp_ajax_nopriv_signage_img_info_ajax', 'signage_img_info_ajax');
function signage_img_info_ajax() {
    if (isset($_REQUEST) && isset($_REQUEST["imageUrl"]) && !empty($_REQUEST["imageUrl"])) {
        global $wpdb;
        $img = $wpdb->get_row($wpdb->prepare("select * from wp_posts where guid = %s", $_REQUEST["imageUrl"]));
        if ($img == NULL){
            $result["error"] = "(001) Image not found in database.";
            signage_img_info_ajax_fallback($_REQUEST["imageUrl"]);
        } else {
            $meta = wp_get_attachment_metadata($img->ID);
            if ($meta == NULL){
                $result["error"] = "(002) Image meta data empty.";
                signage_img_info_ajax_fallback($_REQUEST["imageUrl"]);
            } else {
                 if ($meta['width'] == NULL || $meta['height'] == NULL){
                     $result["error"] = "(003) Size parameter of db method is zero.";
                    signage_img_info_ajax_fallback($_REQUEST["imageUrl"]);
                } else {
                    $result["width"] = $meta['width'];
                    $result["height"] = $meta['height'];
                    $result["success"] = true;
                }
            }
        }
    } else {
        $result["success"] = false;
        $result["error"] = "(004) Image url not set.";
    }
    echo json_encode($result);
    die();
}
function signage_img_info_ajax_fallback($url){
    $info = getimagesize($url);
    $result["width"] = $info[0];
    $result["height"] = $info[1];
    if ($info[0] <= 0 || $info[1] <= 0){
        $result["success"] = false;
        $result["error"] = "(005) Size parameter of fallback method is zero.";
    } else {
        $result["success"] = true;
    }
    echo json_encode($result);
    die();
}
