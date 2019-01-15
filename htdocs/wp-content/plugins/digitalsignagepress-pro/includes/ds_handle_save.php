<?php
defined( 'ABSPATH' ) or die();
require_once('ds_database_handler.php');
if (!isset($dsdbh)) {
	$dsdbh = new DS_DB_Handler();
}
global $wpdb;
if (isset($_POST['save_nrOfScreens'])) {
	$total_screens = sanitize_text_field($_POST['save_nrOfScreens']);
} else {
	$total_screens = 0;
}
$screens = array();
for ($n = 1; count($screens) < $total_screens && $n < 100000; $n++) {
	if (!isset($_POST['save_myDSSID'.$n])) {
		continue;
	}
	$screen_prefix = sanitize_text_field($_POST['save_myDSSID'.$n]);
	if (isset($screen)) {
		unset($screen);
	}
	if (is_numeric($screen_prefix)) {
		$screen = $dsdbh->get_screen_by_id($screen_prefix);
	}
	if (isset($screen)) {
		if (isset($_POST['save_myDSPID']) && is_numeric($_POST['save_myDSPID'])) {
			$prog_sc = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$wpdb->prefix.'ds_program_screen WHERE programId = %d AND screenId = %d', $_POST['save_myDSPID'], $screen['id']), ARRAY_A);
			if (isset($prog_sc)) {
				$screen['screenOrder'] = $prog_sc['screenOrder'];
			}
		}
	} else {
		$screen = $dsdbh->make_new_screen('', -1, -1, -1, -1, array(), array(), -1);
	}
	$elements = array();
	$max_elements = 0;
	if (isset($_POST['save_myDS'.$screen_prefix.'maxEID'])) {
		$max_elements = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'maxEID']);
	}
	for ($i = 0; count($elements) < $max_elements && $i < 100000; $i++) {
		if (isset($_POST['save_myDS'.$screen_prefix.'E'.$i.'_id'])) {
			$id = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'E'.$i.'_id']);
			if (isset($element)) {
				unset($element);
			}
			if (is_numeric($id) && $id > 0) {
				if (isset($screen['elements'][$id])) {
					$element = $screen['elements'][$id];
					unset($screen['elements'][$id]);
				}
				if (!isset($element)) {
					$element = $dsdbh->get_screen_element_by_id($id);
				}
			}
			if (!isset($element)) {
				$element = $dsdbh->make_new_screen_element('', -1, '');			
			}
			if (isset($_POST['save_myDS'.$screen_prefix.'E'.$i.'_content'])) {
				$element['htmlcode'] = $_POST['save_myDS'.$screen_prefix.'E'.$i.'_content'];
			}
			if (isset($_POST['save_myDS'.$screen_prefix.'E'.$i.'_name'])) {
				$element['name'] = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'E'.$i.'_name']);
			}
			$element['pos_nr'] = $i;
			$new_id = $element['id'];
			if (!is_numeric($new_id) || $new_id < 1) {
				$new_id = 'X'.$i;
			}
			$elements[$new_id] = $element;
		}
	}
	$screen['elements'] = $elements;
	$schedules = array();
	$ds_permanent = 1;
	$ds_playduration = 0;
	$ds_startdate = 0;
	$ds_enddate = 0 ;
	$ds_dayofmonthstart = 0;
	$ds_dayofmonthend = 0;
	if (isset($_POST['save_myDS'.$screen_prefix.'playduration']) && is_numeric($_POST['save_myDS'.$screen_prefix.'playduration']) && $_POST['save_myDS'.$screen_prefix.'playduration'] > -1) {
		if ($_POST['save_myDS'.$screen_prefix.'playduration'] < 99999) {
			$ds_playduration = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'playduration']);
		} else {
			$ds_playduration = 99999;
		}
	}
	if (isset($_POST['save_myDS'.$screen_prefix.'active_show_by_date']) && $_POST['save_myDS'.$screen_prefix.'active_show_by_date'] == "true") {
		if (isset($_POST['save_myDS'.$screen_prefix.'startdate'])) {
			$ds_startdate = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'startdate']);
		}
		if (isset($_POST['save_myDS'.$screen_prefix.'enddate'])) {
			$ds_enddate = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'enddate']);
		}
	}
	if (isset($_POST['save_myDS'.$screen_prefix.'active_show_by_day_of_month']) && $_POST['save_myDS'.$screen_prefix.'active_show_by_day_of_month'] == "true") {
		if (isset($_POST['save_myDS'.$screen_prefix.'dayofmonthstart'])) {
			$ds_dayofmonthstart = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'dayofmonthstart']);
		}
		if (isset($_POST['save_myDS'.$screen_prefix.'dayofmonthend'])) {
			$ds_dayofmonthend = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'dayofmonthend']);
		}
	}
	if ($ds_startdate > 0 || $ds_enddate > 0 || $ds_dayofmonthstart > 0 || $ds_dayofmonthend > 0) {
		$ds_permanent = 0;
	}
		$foundWeekDay = false;
		for ($i = 1; $i <= 4000; $i++) {
			if (isset($_POST['save_myDS'.$screen_prefix.'wd'.$i.'startd'])) {
				$foundWeekDay = true;
				$ds_wdstartd = 0;
				if (isset($_POST['save_myDS'.$screen_prefix.'wd'.$i.'startd'])) {
					$ds_wdstartd = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'wd'.$i.'startd']);
				}
				$ds_wdstarth = 0;
				if (isset($_POST['save_myDS'.$screen_prefix.'wd'.$i.'starth'])) {
					$ds_wdstarth = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'wd'.$i.'starth']);
				}
				$ds_wdstartm = 0;
				if (isset($_POST['save_myDS'.$screen_prefix.'wd'.$i.'startm'])) {
					$ds_wdstartm = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'wd'.$i.'startm']);
				}
				$ds_wdendd = 0;
				if (isset($_POST['save_myDS'.$screen_prefix.'wd'.$i.'endd'])) {
					$ds_wdendd = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'wd'.$i.'endd']);
				}
				$ds_wdendh = 0;
				if (isset($_POST['save_myDS'.$screen_prefix.'wd'.$i.'endh'])) {
					$ds_wdendh = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'wd'.$i.'endh']);
				}
				$ds_wdendm = 0;
				if (isset($_POST['save_myDS'.$screen_prefix.'wd'.$i.'endm'])) {
					$ds_wdendm = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'wd'.$i.'endm']);
				}

				if ($ds_wdstartd > 0 || $ds_wdstarth > 0 || $ds_wdstartm > 0 || $ds_wdendd > 0 || $ds_wdendh > 0 || $ds_wdendm > 0) {
					$ds_permanent = 0;
				}
				$schedule = $dsdbh->make_new_screen_schedule($ds_permanent, $ds_startdate, $ds_enddate, $ds_playduration, $ds_wdstartd, $ds_wdstarth, $ds_wdstartm, $ds_wdendd, $ds_wdendh, $ds_wdendm, $ds_dayofmonthstart, $ds_dayofmonthend);
				if (isset($_POST['save_myDS'.$screen_prefix.'wd'.$i.'id']) && $_POST['save_myDS'.$screen_prefix.'wd'.$i.'id'] > 0) {
					$schedule['id'] = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'wd'.$i.'id']);
				}
				$schedules[] = $schedule;
			}
		}
		if (!$foundWeekDay) {
			$schedule = $dsdbh->make_new_screen_schedule($ds_permanent, $ds_startdate, $ds_enddate, $ds_playduration, 0, 0, 0, 0, 0, 0, $ds_dayofmonthstart, $ds_dayofmonthend);
			if (isset($_POST['save_myDS'.$screen_prefix.'scheduleid']) && $_POST['save_myDS'.$screen_prefix.'scheduleid'] > 0) {
				$schedule['id'] = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'scheduleid']);
			}
			$schedules[] = $schedule;
		}
	$screen['schedules'] = $schedules;
	$types = array('name' => 'Name', 'screenOrder' => 'screenorder', 'ratio' => 'Ratio', 'format_type' => 'Format');
	foreach ($types as $key => $type) {
		if (isset($_POST['save_myDS'.$screen_prefix.$type])) {
			$screen[$key] = sanitize_text_field($_POST['save_myDS'.$screen_prefix.$type]);
		}
	}
	if (isset($_POST['save_myDS'.$screen_prefix.'Name'])) {
		$screen['name'] = stripslashes(sanitize_text_field($_POST['save_myDS'.$screen_prefix.'Name']));
	}
	if (empty($screen['name'])) {
		$screen['name'] = 'Slide';
	}
	if (isset($_POST['save_myDS'.$screen_prefix.'CustomTemplateId']) && $_POST['save_myDS'.$screen_prefix.'CustomTemplateId'] > -1
				|| isset($screen['customTemplateId']) && $screen['customTemplateId'] > -1 &&
					(isset($_POST['save_myDS'.$screen_prefix.'TemplateId']) && $_POST['save_myDS'.$screen_prefix.'TemplateId'] == -1
					|| !isset($_POST['save_myDS'.$screen_prefix.'TemplateId']))) {
		$customTemplateId = isset($_POST['save_myDS'.$screen_prefix.'CustomTemplateId']) ? sanitize_text_field($_POST['save_myDS'.$screen_prefix.'CustomTemplateId']) : $screen['customTemplateId'];
		if ($customTemplateId > -1) {
			$customTemplate = $dsdbh->get_custom_template_by_id($customTemplateId);
		}
		if (!isset($customTemplate)) {
			$customTemplate = $dsdbh->make_new_custom_template('', '', $screen['format_type'], $screen['ratio']);
		} else {
			$customTemplate['format_type'] = $screen['format_type'];
			$customTemplate['ratio'] = $screen['ratio'];
		}
		if (isset($_POST['save_myDS'.$screen_prefix.'CustomTemplateCode'])) {
			$customTemplate['htmlcode'] = $_POST['save_myDS'.$screen_prefix.'CustomTemplateCode'];
		}
		if (isset($_POST['save_myDS'.$screen_prefix.'CustomTemplateName'])) {
			$customTemplate['name'] = stripslashes(sanitize_text_field($_POST['save_myDS'.$screen_prefix.'CustomTemplateName']));
		}
		$screen['customTemplateId'] = $dsdbh->insert_or_update_custom_template($customTemplate);
		$screen['templateId'] = -1;
	} else {
		$screen['customTemplateId'] = -1;
		if ($screen['customTemplateId'] < 0 && isset($_POST['save_myDS'.$screen_prefix.'TemplateId'])) {
			$screen['templateId'] = sanitize_text_field($_POST['save_myDS'.$screen_prefix.'TemplateId']);
		}
	}
	if ($screen['templateId'] == -1 && $screen['customTemplateId'] == -1) {
		$screen['templateId'] = 1;
	}
	$screens[] = $screen;
}
if (isset($_POST['save_myDSPID'])) {
	$programId = sanitize_text_field($_POST['save_myDSPID']);
	if (is_numeric($programId)) {
		$program = $dsdbh->get_program_by_id($programId, true);
	}
} else {
	$programId = -1;
}
if (!isset($program)) {
	$program = $dsdbh->make_new_program('', array(), array(), array(), -1);
}
$program['screens'] = $screens;
if (isset($_POST['save_myDSPName'])) {
	$program['name'] = stripslashes(sanitize_text_field($_POST['save_myDSPName']));
}
if (empty($program['name'])) {
	$program['name'] = __('Signage Playlist', 'digitalsignagepress');
}
$program_schedules = array();
$program['schedules'] = $program_schedules;
$programId = $dsdbh->insert_or_update_program($program);
$program['id'] = $programId;
require_once('ds_smil_save.php');
$redirect_url = admin_url('admin.php?page='.SIGNAGE_PLUGIN_MENU_SLUG.'_home');
if (isset($programId) && $programId > -1) {
	$redirect_url .= '&PID='.$programId;
}
wp_redirect($redirect_url);
