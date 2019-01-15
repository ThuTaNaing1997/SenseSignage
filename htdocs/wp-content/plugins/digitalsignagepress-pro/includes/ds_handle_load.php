<?php
defined( 'ABSPATH' ) or die();
?><div id="load_form">
<select id="ds-playlist-selector">
<option id="ds-playlist-0" value="empty" title=""></option><?php
if (!isset($dsdbh)) {
	require_once('ds_database_handler.php');
	$dsdbh = new DS_DB_Handler();
}
$programs = $dsdbh->get_all_programs(-1);
if (isset($_GET['PID']) && is_numeric($_GET['PID'])) {
	$programId = $_GET['PID'];
} else {
	$programId = 0;
}
$i = 1;
foreach ($programs as $program) {
	if ($program['id'] != $programId) {
		echo '<option id="ds-playlist-'.$i.'" value="'.$program['id'].'" title="'.$program['name'].'">'.$program['name'].'</option>';
		$i++;
	}
}
?></select><?php
$url_constant = get_option('ds_signage_url_base');
if (!isset($url_constant) || empty($url_constant)) {
	global $wpdb;
	$page = $wpdb->get_row('SELECT ID, post_title, guid FROM '.$wpdb->prefix.'posts WHERE post_type = "page" AND post_content LIKE "%[digitalsignage]%" ORDER BY ID LIMIT 1', ARRAY_A);
	if (isset($page) && !empty($page)) {
		$url_constant = get_permalink($page['ID']);
		if (empty($url_constant)) {
			$url_constant = $page['guid'];
		}
		if (strpos($url_constant, '?') > -1) {
			$url_constant .= '&device=-1&type=pip&program=PLAYLISTID';
		} else {
			$url_constant .= '?device=-1&type=pip&program=PLAYLISTID';
		}
	} else {
		$url_constant = '127.0.0.1/?device=-1&type=pip&program=PLAYLISTID';
	}
	update_option('ds_signage_url_base', $url_constant);
}
?><div id="playlist_base_url"><?php echo $url_constant; ?></div><?php
$program = $dsdbh->get_program_by_id($programId, true);
if (!isset($program)) {
	?></div><?php
	return;
}
if (isset($_GET['SID']) && isset($program['screens'][$_GET['SID']])) {
?>
<input type="hidden" id="load_preloadScreenID" name="load_preloadScreenID" value="<?php echo $_GET['SID']; ?>">
<?php
}
?>
<input type="hidden" id="load_myDSPID" name="load_myDSPID" value="<?php echo $program['id']; ?>">
<input type="hidden" id="load_myDSPName" name="load_myDSPName" value="<?php echo esc_html($program['name']); ?>">
	<input type="hidden" id="load_myDSCID" name="load_myDSCID" value="-1">
<input type="hidden" id="load_nrOfScreens" name="load_nrOfScreens" value="<?php echo count($program['screens']);?>">
<?php
$i = 1;
foreach ($program['screens'] as $screen_prefix => $screen) {
	echo '<input type="hidden" id="load_myDSSID'.$i.'" name="load_myDSSID'.$i.'" value="'.$screen_prefix.'">';
	echo '<input type="hidden" id="load_myDS'.$screen_prefix.'screenorder" name="load_myDS'.$screen_prefix.'screenorder" value="'.$screen['screenOrder'].'">';
	echo '<input type="hidden" id="load_myDS'.$screen_prefix.'Name" name="load_myDS'.$screen_prefix.'Name" value="'.htmlspecialchars(stripslashes($screen['name'])).'">';
	echo '<input type="hidden" id="load_myDS'.$screen_prefix.'Ratio" name="load_myDS'.$screen_prefix.'Ratio" value="'.$screen['ratio'].'">';
	echo '<input type="hidden" id="load_myDS'.$screen_prefix.'Format" name="load_myDS'.$screen_prefix.'Format" value="'.$screen['format_type'].'">';
	echo '<input type="hidden" id="check_myDS'.$screen_prefix.'" name="check_myDS'.$screen_prefix.'" value="3">';
	$elem_pos = array();
	$elem_max = -1;
	foreach ($screen['elements'] as $element) {
		$elem_name = 'load_myDS'.$screen_prefix.'E'.$element['pos_nr'];
		echo '<input type="hidden" id="'.$elem_name.'_id" name="'.$elem_name.'_id" value="'.$element['id'].'">';
		echo '<input type="hidden" id="'.$elem_name.'_name" name="'.$elem_name.'_name" value="'.esc_html($element['name']).'">';
		echo '<input type="hidden" id="'.$elem_name.'_content" name="'.$elem_name.'_content" value="'.htmlspecialchars(stripslashes($element['htmlcode'])).'">';
		$elem_pos[$element['pos_nr']] = $element['pos_nr'];
		if ($elem_max < $element['pos_nr']) {
			$elem_max = $element['pos_nr'];
		}
	}
	$elem_max = count($screen['elements']);
	echo '<input type="hidden" id="load_myDS'.$screen_prefix.'maxEID" name="load_myDS'.$screen_prefix.'maxEID" value="'.$elem_max.'">';
	if ($screen['templateId'] > -1) {
		echo '<input type="hidden" id="load_myDS'.$screen_prefix.'TemplateId" name="load_myDS'.$screen_prefix.'TemplateId" value="'.$screen['templateId'].'">';
		echo '<input type="hidden" id="load_myDS'.$screen_prefix.'CustomTemplateId" name="load_myDS'.$screen_prefix.'CustomTemplateId" value="-1">';
	} else if ($screen['customTemplateId'] > -1) {
		echo '<input type="hidden" id="load_myDS'.$screen_prefix.'CustomTemplateId" name="load_myDS'.$screen_prefix.'CustomTemplateId" value="'.$screen['customTemplateId'].'">';
		echo '<input type="hidden" id="load_myDS'.$screen_prefix.'CustomTemplateName" name="load_myDS'.$screen_prefix.'CustomTemplateName" value="'.$screen['template_name'].'">';
		echo '<input type="hidden" id="load_myDS'.$screen_prefix.'CustomTemplateCode" name="load_myDS'.$screen_prefix.'CustomTemplateCode" value="'.htmlspecialchars(stripslashes(stripslashes($screen['template_htmlcode']))).'">';
		echo '<input type="hidden" id="load_myDS'.$screen_prefix.'TemplateId" name="load_myDS'.$screen_prefix.'TemplateId" value="-1">';
	} else {
		echo '<input type="hidden" id="load_myDS'.$screen_prefix.'TemplateId" name="load_myDS'.$screen_prefix.'TemplateId" value="1">';
		echo '<input type="hidden" id="load_myDS'.$screen_prefix.'CustomTemplateId" name="load_myDS'.$screen_prefix.'CustomTemplateId" value="-1">';
	}
	$sched_max = 0;
	foreach ($screen['schedules'] as $schedule) {
		$sched_max++;
		if ($sched_max == 1) {
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'scheduleid" name="load_myDS'.$screen_prefix.'scheduleid" value="'.$schedule['id'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'permanent" name="load_myDS'.$screen_prefix.'permanent" value="'.$schedule['permanent'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'playduration" name="load_myDS'.$screen_prefix.'playduration" value="'.$schedule['playduration'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'startdate" name="load_myDS'.$screen_prefix.'startdate" value="'.$schedule['startdate'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'enddate" name="load_myDS'.$screen_prefix.'enddate" value="'.$schedule['enddate'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'dayofmonthstart" name="load_myDS'.$screen_prefix.'dayofmonthstart" value="'.$schedule['day_of_month_start'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'dayofmonthend" name="load_myDS'.$screen_prefix.'dayofmonthend" value="'.$schedule['day_of_month_end'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'active_show_by_date" name="load_myDS'.$screen_prefix.'active_show_by_date" value="'.($schedule['startdate'] > 0 || $schedule['enddate'] > 0 ? "true" : "false").'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'active_show_by_day_of_month" name="load_myDS'.$screen_prefix.'active_show_by_day_of_month" value="'.($schedule['day_of_month_start'] > 0 || $schedule['day_of_month_end'] > 0 ? "true" : "false").'">';
		}
		if ($schedule['weekday_start'] > 0 && $schedule['weekday_end'] > 0) {
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'wd'.$sched_max.'id" name="load_myDS'.$screen_prefix.'wd'.$sched_max.'id" value="'.$schedule['id'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'wd'.$sched_max.'startd" name="load_myDS'.$screen_prefix.'wd'.$sched_max.'startd" value="'.$schedule['weekday_start'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'wd'.$sched_max.'starth" name="load_myDS'.$screen_prefix.'wd'.$sched_max.'starth" value="'.$schedule['weekday_start_time_h'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'wd'.$sched_max.'startm" name="load_myDS'.$screen_prefix.'wd'.$sched_max.'startm" value="'.$schedule['weekday_start_time_m'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'wd'.$sched_max.'endd" name="load_myDS'.$screen_prefix.'wd'.$sched_max.'endd" value="'.$schedule['weekday_end'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'wd'.$sched_max.'endh" name="load_myDS'.$screen_prefix.'wd'.$sched_max.'endh" value="'.$schedule['weekday_end_time_h'].'">';
			echo '<input type="hidden" id="load_myDS'.$screen_prefix.'wd'.$sched_max.'endm" name="load_myDS'.$screen_prefix.'wd'.$sched_max.'endm" value="'.$schedule['weekday_end_time_m'].'">';
		}
	}
	$i++;
}
echo '</div>';
