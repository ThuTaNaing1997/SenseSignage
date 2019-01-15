<?php
defined( 'ABSPATH' ) or die();

add_shortcode( 'digitalsignage', 'ds_make_digitalsignage_contents' );
function ds_make_digitalsignage_contents() {
    $refresh_interval = 10000;
    require_once('ds_database_handler.php');
    $dsdbh = new DS_DB_Handler();
    global $wpdb;
    $prefix = $wpdb->prefix.'ds_';
    $html = '<div id="wpbody">';
    $useVideoWall = false;
    $screenW = 960;
    $screenH = 540;
    $html .= '<div id="allDSScreens_taken" style="display:none;">'
		.__('This device number is already occupied by a different monitor, please enter the URL of a different device for this monitor.<br>Please use this URL only on one monitor at the same time.<br>If this is the right monitor for this URL please follow these steps:<br>1) navigate to Devices<br>2) edit this device<br>3) press the button "Allow other device to use this URL"<br>4) refresh this page on this monitor/browser or restart the monitor','digitalsignagepress').'<br><br>'
		.__('If this problem persists, make sure that your browser supports cookies and does not delete them upon restart.','digitalsignagepress')
		.'</div>';
    $html .= '<div id="allDSScreens_error" style="display:none;">'
		.__("An error occured.",'digitalsignagepress')
		.'</div>';
    $html .= '<div id="allDSScreens" style="display:none;">';
    $html .= "<input type=\"hidden\" value=\"".time()."\" id=\"buildtime\" name=\"buildtime\">";

    wp_register_style('dscss-gfonts', plugins_url('../css/google_fonts.css', __FILE__));   
    wp_enqueue_style('dscss-gfonts');
    wp_register_style('dscss-templatecontent', plugins_url('../css/ds-template-content.css', __FILE__));
    wp_enqueue_style('dscss-templatecontent');
    wp_register_style('dscss-typografie', plugins_url('../css/typografie.css', __FILE__));
    wp_enqueue_style('dscss-typografie');
    wp_register_style('dscss-grid', plugins_url('../css/grid.css', __FILE__));
    wp_enqueue_style('dscss-grid');
    wp_register_style('dscss-base-template', plugins_url('../css/base-template.css', __FILE__));
    wp_enqueue_style('dscss-base-template');
    $v_username = "ds_";
    $v_username .= md5(site_url());
    if ( array_key_exists('device', $_GET) ) {
            $deviceId = $_GET['device'];
    }
    if ( array_key_exists('program', $_GET) ) {
            $programId = $_GET['program'];
    }
    if (!isset($deviceId) || $deviceId == '') {
            $deviceId = 0;
    }
    if (!isset($programId) || $programId == '') {
            $programId = 0;
    }
    if ($deviceId == -1 && isset($_GET['type']) && $_GET['type'] == 'pip') {
        if (get_current_user_id() > 0) {
            $v_username = 'ds_'.md5(site_url()).'_'.get_current_user_id();
            if (!isset($_COOKIE[$v_username]) || $_COOKIE[$v_username] < time()) {
                $deviceId = 0;
            } else if (empty(get_option($v_username)) || get_option($v_username) == 0 || get_option($v_username) < time()) {
                $deviceId = 0;
            }
        } else {
            $deviceId = 0;
        }
    }
    $deviceIdValid = 0;
    if ($deviceId != 0) {
	$deviceIdValid = true;
            $device = $dsdbh->get_device_by_id($deviceId);
            if (isset($device)) {
                    if ($programId <= 0) {
                        $programId = $device['programId'];
                    }
                    $tmp = $dsdbh->get_devicewall_device_by_device_id($deviceId);
                    if(isset($tmp)) {
                        $device = $tmp;
                        $useVideoWall = true;
                        $screenW = $device['resolution_w'];
                        $screenH = $device['resolution_h'];
                    }
            } else {
                    $deviceId = 0;
                    $programId = 0;
            }
    }
    $html_pages = array();
    $ctrS = 0;
    if ($deviceIdValid == 1 && allowed_device($deviceId)){
            $url_constant = get_option('ds_signage_url_base');
            if (empty($url_constant)) {
                 $url_constant = '127.0.0.1/?device=-1&type=pip&program=PLAYLISTID';
            }
            $url_constant = htmlentities(str_replace('PLAYLISTID', '', $url_constant));
            $target_url = htmlentities(strtok($_SERVER['REQUEST_URI'],'?').'?device='.$_GET['device'].'&program=');
            $program = $dsdbh->get_program_by_id( $programId, true );
            if (!isset($program)) {
                    $program = $dsdbh->get_default_program( true );
            }
            foreach($program['screens'] as $screen) {
                    $ctrS++;

                    $templateId = $screen['templateId'];
                    $customTemplateId = $screen['customTemplateId'];
                    if ($templateId > -1) {
                            $template = $dsdbh->get_regular_template_by_id( $templateId );
                            if (!isset($template)) {
                                    $template = $dsdbh->get_default_template();
                            }
                            $html_page = file_get_contents(SIGNAGE_PLUGIN_DIR_PATH.'/templates/'.$template['filename']);
                    } else if ($customTemplateId > -1) {
                            $template = $dsdbh->get_custom_template_by_id( $customTemplateId );
                            if (!isset($template)) {
                                    $template = $dsdbh->get_default_custom_template();
                            }
                            $html_page = stripslashes($template['htmlcode']);
                    }
                    if (isset($html_page)) {	
                            foreach($screen['elements'] as $element) {
                                    $html_page = str_replace('[myDSEC'.$element['pos_nr'].']', $element['htmlcode'], $html_page);
                            }
                            $suchmuster = '/\[myDSEC[\d+]\]/';
                            $html_page = preg_replace($suchmuster, '', $html_page);
                    } else {
                            $template = $dsdbh->get_regular_template_by_id( 1 );
                            if (!isset($template)) {
                                    $template = $dsdbh->get_default_template();
                            }
                            $html_page = file_get_contents(SIGNAGE_PLUGIN_DIR_PATH.'/templates/'.$template['filename']);
                    }

                    $scheduling = "";
                    $cnt = 0;
                    foreach($screen['schedules'] as $schedule){
                            $cnt++;
                            if ($cnt == 1){
                                    $scheduling .= '<input type="hidden" id="myDS'.$screen['id'].'permanent"  value="'.$schedule['permanent'].'">';
                                    $scheduling .= '<input type="hidden" id="myDS'.$screen['id'].'playduration"  value="'.$schedule['playduration'].'">';
                                    $scheduling .= '<input type="hidden" id="myDS'.$screen['id'].'startdate"  value="'.$schedule['startdate'].'">';
                                    $scheduling .= '<input type="hidden" id="myDS'.$screen['id'].'enddate" value="'.$schedule['enddate'].'">';
                                    $scheduling .= '<input type="hidden" id="myDS'.$screen['id'].'dayofmonthstart"  value="'.$schedule['day_of_month_start'].'">';
                                    $scheduling .= '<input type="hidden" id="myDS'.$screen['id'].'dayofmonthend"  value="'.$schedule['day_of_month_end'].'">';
                            } 
                            $scheduling .=  '<input type="hidden" id="myDS'.$screen['id'].'wd'.$cnt.'startd" name="myDS'.$screen['id'].'wd'.$cnt.'startd" value="'.$schedule['weekday_start'].'">';
                            $scheduling .=  '<input type="hidden" id="myDS'.$screen['id'].'wd'.$cnt.'starth" name="myDS'.$screen['id'].'wd'.$cnt.'starth" value="'.$schedule['weekday_start_time_h'].'">';
                            $scheduling .=  '<input type="hidden" id="myDS'.$screen['id'].'wd'.$cnt.'startm" name="myDS'.$screen['id'].'wd'.$cnt.'startm" value="'.$schedule['weekday_start_time_m'].'">';
                            $scheduling .=  '<input type="hidden" id="myDS'.$screen['id'].'wd'.$cnt.'endd" name="myDS'.$screen['id'].'wd'.$cnt.'endd" value="'.$schedule['weekday_end'].'">';
                            $scheduling .=  '<input type="hidden" id="myDS'.$screen['id'].'wd'.$cnt.'endh" name="myDS'.$screen['id'].'wd'.$cnt.'endh" value="'.$schedule['weekday_end_time_h'].'">';
                            $scheduling .=  '<input type="hidden" id="myDS'.$screen['id'].'wd'.$cnt.'endm" name="myDS'.$screen['id'].'wd'.$cnt.'endm" value="'.$schedule['weekday_end_time_m'].'">';
                    }
                    $cssScreen = '';
                    if ( $ctrS > 1) $cssScreen .= 'display:none;visibility:none;';
                    if ($useVideoWall){
                        $devicewall = $dsdbh->get_devicewall_by_id($device['devicewallId']);
                        if($devicewall['wall_rows'] > 1 || $devicewall['wall_columns'] > 1) {
                            $resw = $devicewall['portrait'] ? $devicewall['resolution_h'] : $devicewall['resolution_w'];
                            $resh = $devicewall['portrait'] ? $devicewall['resolution_w'] : $devicewall['resolution_h'];
                            $resw_nb = $resw;
                            $resh_nb = $resh;
                            
                            $scale = max($devicewall['wall_rows'], $devicewall['wall_columns']);
                            $wmb = '';
                            $hmb = '';
                            if($devicewall['bezel_compensation_w'] != 0) {
                                if($devicewall['wall_columns'] > 1) {
                                    $resw = $resw + $devicewall['bezel_compensation_w'];
                                }
                            }
                            if($devicewall['bezel_compensation_h'] != 0) {
                                if($devicewall['wall_rows'] > 1) {
                                    $resh = $resh + $devicewall['bezel_compensation_h']; 
                                }
                            }
                            $wp = 100 / $devicewall['wall_columns'];
                            $hp = 100 / $devicewall['wall_rows'];
                            $wmm = '';
                            $wms = '';
                            $hmm = '';
                            $hms = '';
                            $wmm = 'left: '.($resw*($scale-1)/2-$resw*($device['pos_x']-1)).'px;';
                            $hmm = 'top: '.($resh*($scale-1)/2-$resh*($device['pos_y']-1)).'px;';
                            $scale_n1 = (($scale-1)*$resw+$resw_nb)/$resw_nb;
                            $scale_n2 = (($scale-1)*$resh+$resh_nb)/$resh_nb;
                            $cssScreen .= 'width:'.$resw_nb.'px; height:'.$resh_nb.'px; -webkit-transform:scale('.$scale_n1.','.$scale_n2.'); transform:scale('.$scale_n1.','.$scale_n2.'); '.$wmm.' '.$wms.' '.$hmm.' '.$hms.' '.$wmb.' '.$hmb.' position:fixed;';
                        }
                        $scheduling .= '<input type="hidden" id="currentShowedDivVariable" name="currentShowedDivVariable" value="0">';
                    }
                    $html_page = str_replace($url_constant, $target_url, $html_page);
                    $html_page = str_replace(' style=""', '' , $html_page);
                    $html_page = str_replace('="myDSX">', '="myDSX" style="'.$cssScreen.'">'.$scheduling , $html_page);
                    $html_page = str_replace('ds-custom-template">', 'ds-custom-template" style="'.$cssScreen.'">'.$scheduling , $html_page);
                    $html_page = str_replace('style=""', '' , $html_page);
                    $html_page = str_replace('FullwidthRow">', 'FullwidthRow" style="'. $cssScreen.'">'.$scheduling , $html_page);
                    $html_page = str_replace('myDSX', 'myDS'.$screen['id'] , $html_page);
                    $plugin_path = str_replace('includes', '', plugins_url('', __FILE__));

                    $html_page = str_replace('<link rel="stylesheet" type="text/css" href="[PLUGIN-PATH]css/grid.css" media="all">', '', $html_page);
                    $html_page = str_replace('<link rel="stylesheet" type="text/css" href="[PLUGIN-PATH]css/base-template.css" media="all">', '', $html_page);
                    $html_page = str_replace('<script type="text/javascript" src="[PLUGIN-PATH]js/jquery-2.2.1.min.js"></script>', '', $html_page);
                    $html_page = str_replace('<script type="text/javascript" src="[PLUGIN-PATH]js/functions.js"></script>', '', $html_page);
                    $html_page = str_replace('<script type="text/javascript" src="[PLUGIN-PATH]js/video.js"></script>', '', $html_page);
                    $html_page = str_replace('[PLUGIN-PATH]', $plugin_path, $html_page);
                    array_push( $html_pages, $html_page );
            }
            for($g = 0; $g < sizeof($program['screens']); $g++) {
                    $html .= stripslashes($html_pages[$g]);
            }

    } else if ($deviceIdValid == 1 && !allowed_device($deviceId)) {
            $html .= __("An error occured.",'digitalsignagepress');
    }
    wp_register_script('dsjs-editor-presentation', plugins_url('../js/ds-editor-presentation.js', __FILE__), array('jquery'));
    wp_enqueue_script('dsjs-editor-presentation');
    wp_register_script('dsjs-functions', plugins_url('../js/functions.js', __FILE__), array('jquery'));
    wp_enqueue_script('dsjs-functions');
    wp_register_script('dsjs-vimeoplayer', plugins_url('../js/vimeo_player.js', __FILE__), array('dsjs-functions'));
    wp_enqueue_script('dsjs-vimeoplayer');
    wp_register_script('dsjs-enablediv', plugins_url('../js/enablediv.js', __FILE__), array('dsjs-vimeoplayer'));
    wp_enqueue_script('dsjs-enablediv');
    if($useVideoWall){
            wp_register_script('dsjs-schedulingds', plugins_url('../js/videowall.js', __FILE__), array('dsjs-enablediv'));
            wp_enqueue_script('dsjs-schedulingds');
            wp_register_script('dsjs-wallpagefunctions', plugins_url('../js/ds_page_wall.js', __FILE__), array('dsjs-schedulingds'));
            wp_enqueue_script('dsjs-wallpagefunctions');
    } else {
            wp_register_script('dsjs-schedulingds', plugins_url('../js/sched.js', __FILE__), array('dsjs-enablediv'));
            wp_enqueue_script('dsjs-schedulingds');
    }
    wp_register_script('dsjs-pagefunctions', plugins_url('../js/ds_page.js', __FILE__), array('dsjs-schedulingds'));
    wp_enqueue_script('dsjs-pagefunctions');

    $html .= "</div></div>";
    $html = str_replace('contenteditable="true"', '', $html);
    $url = 'http'.((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 's://' : '://').$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
    $html .= '<script type="text/javascript">'
	   .'var last_state = "new";'
            .'function ds_update_page() {'
                    .'var time_obj = jQuery("#buildtime");'
                    .'if (time_obj != null) {'
                       .'var time = time_obj.val();'
                       .'jQuery.ajax({'
                            .'url:"'.admin_url( 'admin-ajax.php' ).'",'
                            .'data:{"action": "signage_update_page_ajax",'
                            .'"program":"'.$programId.'",'
                            .'"device":"'.$deviceId.'",'
                            .((!allowed_device($deviceId) || !has_blanktheme()) ? '"force_update":"1",' : '')
                            .'"time": time},'
                            .'type:"post",'
                            .'cache:false,'
                       .'}).done (function(data) {'
                       .'if (data !== last_state) {'
                            .'last_state = data;'
                            .'if (data=="update") {'
                                    .'var url = window.location.href;'
                                    .'var d = new Date();'
                                    .'var newtimestamp = d.getTime();'
                                    .'var n = url.indexOf("&time=");'
                                    .'if (n > -1) {'
                                         .'var timestamp = url.substr(n+6);'
                                         .'url = url.replace(timestamp, "") + newtimestamp;'
                                    .'} else {'
                                         .'url = url + "&time=" + newtimestamp;'
                                    .'}'
                                    .'window.location.replace(url);'
                            .'} else if (data=="occupied") {'
                                    .'jQuery("#allDSScreens").css("display","none");'
                                    .'jQuery("#allDSScreens_taken").css("display","");'
                                    .'jQuery("#allDSScreens_error").css("display","none");'
                                    .'jQuery("div#allDSScreens div[id^=myDS]").remove();'
                            .'} else if (data=="error") {'
                                    .'jQuery("#allDSScreens").css("display","none");'
                                    .'jQuery("#allDSScreens_taken").css("display","none");'
                                    .'jQuery("#allDSScreens_error").css("display","");'
                            .'} else {'
                                    .'jQuery("#allDSScreens").css("display","");'
                                    .'jQuery("#allDSScreens_taken").css("display","none");'
                                    .'jQuery("#allDSScreens_error").css("display","none");'
                                    .'jQuery(window).trigger("resize");'
                            .'}'
			.'}'
                       .'});'
                    .'}'
            .'}'
            .'</script>';

    if($useVideoWall){
            $html .= '<script type="text/javascript">'
                    .'function ds_sync_server_time() {'
                            .'var startReqTime = (new Date()).getTime();'
                            .'jQuery.ajax({'
                                    .'url:"'.admin_url( 'admin-ajax.php' ).'",'
                                    .'data:{"action": "signage_sync_server_time_ajax",'
                                    .'"program":"'.$programId.'",'
                                    .'"device":"'.$deviceId.'",'
                                    .'"time":"'.intval(time()).'"},'
                                    .'type:"post",'
                                    .'cache:false,'
                            .'}).done (function(data) {'
                                    .'checkVideoWall(startReqTime , data);'
                            .'});'
                    .'}'
                    .'</script>';
            $html .= '<script type="text/javascript">'
                    .'function ds_fetch_next_slide() {'
                            .'var startReqTime = (new Date()).getTime();'
                            .'var currentScreenId = document.getElementById("currentShowedDivVariable").value;'
                            .'jQuery.ajax({'
                                    .'url:"'.admin_url( 'admin-ajax.php' ).'",'
                                    .'data:{"action": "signage_fetch_next_slide_ajax",'
                                    .'"currentShowedDivIndex":currentScreenId,'
                                    .'"program":"'.$programId.'",'
                                    .'"device":"'.$deviceId.'",'
                                    .'"time":"'.intval(time()).'"},'
                                    .'type:"post",'
                                    .'cache:false,'
                            .'}).done (function(data) {'
                                    .'checkScreenToPlay(startReqTime , data);'
                            .'});'
                    .'}'
                    .'</script>';
    }
    return do_shortcode($html);
}
add_action( 'init', 'ds_button' );
function ds_button() {
    add_filter( "mce_external_plugins", "ds_add_buttons" );
    add_filter( 'mce_buttons', 'ds_register_buttons' );
}
function ds_add_buttons( $plugin_array ) {
    $plugin_array['signage'] = str_replace('includes', 'js', plugins_url('signage_button.js',__FILE__));
    return $plugin_array;
}
function ds_register_buttons( $buttons ) {
    array_push( $buttons, 'signage' );
    return $buttons;
}
add_action('wp_ajax_signage_sync_server_time_ajax', 'signage_sync_server_time_ajax');
add_action('wp_ajax_nopriv_signage_sync_server_time_ajax', 'signage_sync_server_time_ajax');
add_action('wp_ajax_signage_fetch_next_slide_ajax', 'signage_fetch_next_slide_ajax');
add_action('wp_ajax_nopriv_signage_fetch_next_slide_ajax', 'signage_fetch_next_slide_ajax');
function signage_sync_server_time_ajax() {
	$result = 'failure';
	if (isset($_REQUEST)) {
		$result = round(microtime(true) * 1000);
	}
	echo intval($result);
	die();
}

function calculate_videowall_ref_stamp($dsdbh, $possibleToPlayIDs, $possibleToPlayIDsPlayDur, $playDurAvg, $program, $deviceId) {
    $videowall = $dsdbh->get_devicewall_by_deviceId($deviceId);
    
    $sequencedur = 0;
    for($i = 0; $i < count($possibleToPlayIDsPlayDur); $i++) {
        if($possibleToPlayIDsPlayDur[$i] > 0) {
            $sequencedur = $sequencedur + $possibleToPlayIDsPlayDur[$i];
        } else {
            $sequencedur = $sequencedur + $playDurAvg;
        }
    }
    if($videowall['refpointcalcts'] == 0 || round($videowall['refpointcalcts'] / 1000) < $program['change_date']
            || $videowall['sequencevalidto'] == 0 || intval($videowall['sequencevalidto']) < time() ||
            $videowall['sequencedur'] != $sequencedur) {
        $sequencevalidto = calculate_sequencevalidto($program, $possibleToPlayIDs);
        $videowall['sequencedur'] = $sequencedur;
        $videowall['sequencevalidto'] = $sequencevalidto;
        $videowall['refpointcalcts'] = intval(round(microtime(true) * 1000));
	$dsdbh->insert_or_update_devicewall($videowall);
    }
    return $videowall;
}

function calculate_sequencevalidto($program, $possibleToPlayIDs) {
   $sequencevalidto = PHP_INT_MAX;
   $earliestnextscreenbegin = PHP_INT_MAX;
   if (isset($program['screens'])) {
    foreach($program['screens'] as $screen) {
        $firstschedule=current($screen['schedules']);
        if($firstschedule['permanent']) continue;
        if($firstschedule['enddate'] > 0 && $firstschedule['enddate'] < $sequencevalidto) {
            $sequencevalidto = $firstschedule['enddate'];
        }
        if($firstschedule['day_of_month_end'] > 0) {
            $date = date_create();
            date_date_set($date, $date->format("Y"), $date->format("m"), $firstschedule['day_of_month_end']);
            $new_end_time = intval(date_timestamp_get($date) + date('Z'));
            if($new_end_time < $sequencevalidto) {
                 $sequencevalidto = $new_end_time;
            }
        }
        $schedules=$screen['schedules'];
        foreach($schedules as $schedule) {
            $wdstartd = $schedule['weekday_start'];
            $wdendd = $schedule['weekday_end'];
            $wdstarth = $schedule['weekday_start_time_h'];
            $wdstartm = $schedule['weekday_start_time_m'];
            $wdendh = $schedule['weekday_end_time_h'];
            $wdendm = $schedule['weekday_end_time_m'];
	    $ret = checkWeekDayParams($wdstartd, $wdendd, $wdstarth, $wdstartm, $wdendh, $wdendm);
            if(!$ret) {
		if($wdstartd > 7) {
			if($wdstartd > time() && $wdstartd < $earliestnextscreenbegin) {
				$earliestnextscreenbegin = $wdstartd;
			}
		} else {
			if ($dnowd < $wdstartd || $dnowd <= $wdstartd && $dnowh < $wdstarth || $dnowd <= $wdstartd && $dnowh <= $wdstarth && $dnowm < $wdstartm) {
				$date = date_create();
				date_date_set($date, $date->format("Y"), $date->format("m"), $wdstartd);
				date_time_set($date, $wdstarth, $wdstartm);
				$tmp = date_timestamp_get($date) + date('Z');
				if($tmp < $earliestnextscreenbegin) {
					$earliestnextscreenbegin = $tmp;
				}
			}
		}
	    } else if($ret) {
		    if($wdstartd > 7 && $wdendd > 7) {
			$new_end_time = $wdendd;
		    } else {
            	        $date = date_create();
            	        date_time_set($date, $wdendh, $wdendm);
            	        $new_end_time = intval(date_timestamp_get($date) + date('Z'));
		    }
                    if($new_end_time < $sequencevalidto) {
                        $sequencevalidto = $new_end_time;
                    }
            }
                }
        }
    }
    if ($earliestnextscreenbegin < $sequencevalidto) {
        $sequencevalidto = $earliestnextscreenbegin;
    }
    return $sequencevalidto;
}
function checkWeekDayParams($wdstartd, $wdendd, $wdstarth, $wdstartm, $wdendh, $wdendm) {
	$ret = false;
	$wp_timezone = get_option('timezone_string');
        if (in_array($wp_timezone, DateTimeZone::listIdentifiers())) {
            date_default_timezone_set($wp_timezone);
        }
        $dnowd = date('w');
        $dnowh = date('H');
        $dnowm = date('i');
	if($wdstartd > 7 && $wdendd > 7) {
	    $dnowY = date('Y');
	    $dnowM = date('n');
	    $dnowD = date('j');
	    
	    if($wdstartd == $wdendd) {
		$date = date_create();
		date_timestamp_set($date, $wdstartd);
		$dnowsY = $date->format('Y');
		$dnowsM = $date->format('n');
		$dnowsD = $date->format('j');
		if($dnowY == $dnowsY && $dnowM == $dnowsM && $dnowD == $dnowsD) {
		    $ret = true;
		    return $ret;
		}
	    } else if($wdstartd <= time() && $wdendd >= time()) {
		$ret = true;
		return $ret;
	    }
	} else {
	    if($wdstartd == 0) {
		$ret = true;
	        return $ret;
	    }
	    if($wdstartd == 1) {
		$wdstartd = 7;
	    } else {
		$wdstartd--;
	    }
	    if($wdendd == 1) {
		$wdendd = 7;
	    } else {
		$wdendd--;
	    }
	    if ($dnowd >= $wdstartd && $dnowd <= $wdendd){
		if (($dnowh > $wdstarth || ($dnowh == $wdstarth && $dnowm >= $wdstartm)) && ($dnowh < $wdendh || ($dnowh == $wdendh && $dnowm < $wdendm)) ){
		    $ret = true;
		    return $ret;
		}
	    }
	}
	return $ret;
}

function signage_fetch_next_slide_ajax() {
    $deviceId = $_REQUEST['device'];
    $wp_timezone = get_option('timezone_string');
    if (in_array($wp_timezone, DateTimeZone::listIdentifiers())) {
       date_default_timezone_set($wp_timezone);
    }
    $currentShowedDivIndex = $_REQUEST['currentShowedDivIndex'];
    $firstplayback = $_REQUEST['currentShowedDivIndex'] <= 0;
    require_once('ds_database_handler.php');
    $dsdbh = new DS_DB_Handler();
    global $wpdb;
    $prefix = $wpdb->prefix.'ds_';
    $device = $dsdbh->get_device_by_id($deviceId);
    if (isset($device)) {
       $programId = $device['programId'];
       if (isset($_REQUEST['program'])) {
          $programId = $_REQUEST['program'];
       }
       $program = $dsdbh->get_program_by_id($programId, true);
    }
    if (!isset($program)) {
       die();
    }
    $screen = current($program['screens']);
    $firstscreenid = $screen['id'];
    $possibleNextShownDivIndex = $currentShowedDivIndex;
    
    $foundScreenToPlay = false;
    $possibleToPlayIDs = array();
    $possibleToPlayIDsPlayDur = array();
    $foundPlayDurHigherZero = false;
    $foundPlayDurationEqualsZero = false;
    $playDurAvg = 0;
    $sequencevalidto = 0;
    $remainingms = 0;
    $switchtime = 0;
    if (isset($program['screens'])) {
      foreach($program['screens'] as $screen) {
        if(checkStartDate($screen)) {
            $possibleToPlayIDs[] = $screen['id'];
            $firstschedule=current($screen['schedules']);
            $dur=$firstschedule['playduration'];
            $possibleToPlayIDsPlayDur[] = $dur;
            if($dur > 0) $foundPlayDurHigherZero = true;
            if($dur == 0) $foundPlayDurationEqualsZero = true;
            $foundScreenToPlay = true;
        }
      }
    }
    if(!$foundPlayDurHigherZero && count($possibleToPlayIDs) > 1) {
        $nowD = date('d');
        foreach($program['screens'] as $screen) {
            $firstschedule = current($screen['schedules']);
            $doMS = $firstschedule['day_of_month_start'];
            if($nowD == $doMS) {
                $possibleNextShownDivIndex = $screen['id'];
                break;
            } else if(isWeekDayStartToday($screen)) {
                $possibleNextShownDivIndex = $screen['id'];
                break;
            }
        }
        if($possibleNextShownDivIndex != $currentShowedDivIndex) {
            $sequencevalidto = calculate_sequencevalidto($program, $possibleToPlayIDs);
        }
    } else if(!$foundPlayDurHigherZero && count($possibleToPlayIDs) == 1) {
	$possibleNextShownDivIndex = $possibleToPlayIDs[0];
        $sequencevalidto = calculate_sequencevalidto($program, $possibleToPlayIDs);
    } else if(count($possibleToPlayIDsPlayDur) > 0) {
        if($foundPlayDurationEqualsZero && count($possibleToPlayIDs) > 1) {
            $ctrpdhz = 0;
            $sumpdhz = 0;
            for($i = 0; $i < count($possibleToPlayIDsPlayDur); $i++) {
                $cDur = $possibleToPlayIDsPlayDur[$i];
                if($cDur > 0) {
                    $ctrpdhz++;
                    $sumpdhz += $cDur;
                }
            }
            $playDurAvg = floor($sumpdhz / $ctrpdhz);
        }

        $videowall = calculate_videowall_ref_stamp($dsdbh, $possibleToPlayIDs, $possibleToPlayIDsPlayDur, $playDurAvg, $program, $deviceId);
        $sequencedur = $videowall['sequencedur'];
        $refpointcalcts = intval($videowall['refpointcalcts']);
        $mtime = intval(time(true));
        $secondsoffset = intval(round($mtime - round($refpointcalcts / 1000)) % $sequencedur);
        $sumDur = 0;
        for($i = 0; $i < count($possibleToPlayIDsPlayDur); $i++) {
            $cDur = $possibleToPlayIDsPlayDur[$i];
            if($cDur == 0) $cDur = $playDurAvg;
            $sumDur = $sumDur + $cDur;
            if($sumDur > $secondsoffset && $switchtime == 0) {
                $remainingms = intval((($sumDur - $secondsoffset) * 1000) + substr($refpointcalcts, -3));
                $switchtime = intval($mtime * 1000 + $remainingms);
                
                if($firstplayback) {
                    $possibleNextShownDivIndex = $possibleToPlayIDs[$i];
                } else if($i + 1 >= count($possibleToPlayIDsPlayDur)) {
                    $possibleNextShownDivIndex = $possibleToPlayIDs[0];
                } else {
                    $possibleNextShownDivIndex = $possibleToPlayIDs[$i + 1];
                }
                break;
            }
        }
    } else if(!$foundScreenToPlay){
        if($firstplayback) {
            $possibleNextShownDivIndex = $firstscreenid;
        }
        $sequencevalidto = calculate_sequencevalidto($program, $possibleToPlayIDs);
    }
    if ($sequencevalidto == PHP_INT_MAX) {
        $tmp = date_create();
	$m = $tmp->format('i');
	$m = $m-($m%5);
	$tmp->setTime($tmp->format('H'), $m, 0);
	date_add($tmp, date_interval_create_from_date_string('300 seconds'));
	$sequencevalidto = date_timestamp_get($tmp);
        if ($firstplayback || empty($possibleNextShownDivIndex)) {
            $possibleNextShownDivIndex = $firstscreenid;
        }
    }
    if($switchtime == 0) {
        if(strlen((string)$sequencevalidto) == 10) {
            $sequencevalidto = intval($sequencevalidto * 1000);
        }
        $switchtime = $sequencevalidto;
    }
    echo $possibleNextShownDivIndex . ',' . $switchtime;
    die();
}
function checkStartDate($screen) {
    $wp_timezone = get_option('timezone_string');
    if (in_array($wp_timezone, DateTimeZone::listIdentifiers())) {
       date_default_timezone_set($wp_timezone);
    }
    $firstschedule = current($screen['schedules']);
    if($firstschedule['permanent']) {
        return true;
    }
    $dnowsec = intval(round(time(true)) + date('Z'));
    $ddayofmonthnow = date('d');
    $sstart = $firstschedule['startdate'];
    $send = $firstschedule['enddate'];
    if ($send > 0) {
       $send += 1000*60*60*24;
    }
    $sdayofmonthstart = $firstschedule['day_of_month_start'];
    $sdayofmonthend = $firstschedule['day_of_month_end'];
    
    $ret = false;
    if($sstart <= $dnowsec && ($send > $dnowsec || $send == 0)) {
        if ($sdayofmonthstart <= $ddayofmonthnow && ($sdayofmonthend >= $ddayofmonthnow || $sdayofmonthend == 0) ){
            $ret = checkWeekDay($screen);
        }
    }
    
    return $ret;
}
function checkWeekDay($screen) {
    $dnowh = date('H');
    $schedules=$screen['schedules'];
    $ret = count($schedules) == 0;
    foreach($schedules as $schedule) {
        $wdstartd = $schedule['weekday_start'];
        $wdstarth = $schedule['weekday_start_time_h'];
        $wdstartm = $schedule['weekday_start_time_m'];
        $wdendd = $schedule['weekday_end'];
        $wdendh = $schedule['weekday_end_time_h'];
        $wdendm = $schedule['weekday_end_time_m'];
        $ret = checkWeekDayParams($wdstartd, $wdendd, $wdstarth, $wdstartm, $wdendh, $wdendm);
        if ($ret) {
		break;
	}
    }
    return $ret;
}
function isWeekDayStartToday($screen){
    $dnowd = date('w');
    $dnowh = date('H');
    $dnowm = date('i');
    $schedules=$screen['schedules'];
    $ret = count($schedules) == 0;
    foreach($schedules as $schedule) {
        $wdstartd = $schedule['weekday_start'];
        if($wdstartd == 0) {
            continue;
        }
        if($wdstartd == 1) {
            $wdstartd = 7;
        } else {
            $wdstartd--;
        }
        $wdstarth = $schedule['weekday_start_time_h'];
        $wdstartm = $schedule['weekday_start_time_m'];
        $wdendd = $schedule['weekday_end'];
        if($wdendd == 1) {
            $wdendd = 7;
        } else {
            $wdendd--;
        }
        $wdendh = $schedule['weekday_end_time_h'];
        $wdendm = $schedule['weekday_end_time_m'];
        if ( ($dnowd >= $wdstartd && $dnowd <= $wdendd) && $dnowh == $wdstarth && $dnowm == $wdstartm){
            $ret = true;
            break;
        }
    }
    return $ret;
}

add_action('wp_ajax_signage_update_page_ajax', 'signage_update_page_ajax');
add_action('wp_ajax_nopriv_signage_update_page_ajax', 'signage_update_page_ajax');
function signage_update_page_ajax() {
	$result = 'failure';
	if (isset($_REQUEST)) {
		$result = 'current';
		if (!isset($wpdb)) {
			global $wpdb;
		}
		$v_username = "ds_";
		$v_username .= md5(site_url());
		$cookset = false;
		$cooknew = false;
		if (isset($_REQUEST['device']) && $_REQUEST['device'] > 0) {
			$device = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$wpdb->prefix.'ds_device WHERE id = %d', $_REQUEST['device']), ARRAY_A);
		}
		if (isset($device)) {
			if(isset($_COOKIE[$v_username]) && strlen($device['dtp']) > 0 && $_COOKIE[$v_username] == md5(base64_encode($device['dtp']))) {
				$cookset = true;
			} else {
				if (strlen($device['dtp']) > 0) {
					$result = 'occupied';
				} else {
					if (!isset($dsdbh)) {
						require_once('ds_database_handler.php');
						$dsdbh = new DS_DB_Handler();
					}
					$device['ua'] = $_SERVER['HTTP_USER_AGENT'];
				  	$device['ald'] = time();
				  	$device['dtp'] = md5($device['ald']);
					$v_value = md5(base64_encode(md5($device['ald'])));
					if ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443) {
						$currenturl = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] ;
					} else {
						$currenturl = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
					}
					$cookiepath = defined('COOKIEPATH') ? COOKIEPATH : '';
			  		if (function_exists('is_multisite') && is_multisite() || empty($cookiepath)) {
						$resCook = setrawcookie( $v_username, $v_value, time()+(20 * 365 * 24 * 60 * 60), '/', '');
					} else {
						$resCook = setrawcookie( $v_username, $v_value, time()+(20 * 365 * 24 * 60 * 60), $cookiepath, COOKIE_DOMAIN );
					}
					if($resCook) {
			  			$dsdbh->insert_or_update_device($device);
					}
					$cookset = true;
					$cooknew = true;
				}
			}
			if ($cookset){
				if (strlen($device['dtp']) > 0 && ($cooknew || $_COOKIE[$v_username] == md5(base64_encode($device['dtp'])))){
					if ($device['changedate'] > $_REQUEST['time']) {
						$result = 'update';
					} else if (isset($_REQUEST['program']) && $_REQUEST['program'] != $device['programId']) {
						if (!isset($dsdbh)) {
							require_once('ds_database_handler.php');
							$dsdbh = new DS_DB_Handler();
						}
						$program = $dsdbh->get_program_by_id( $_REQUEST['program'], true );
						if (isset($program) && $program['change_date'] > $_REQUEST['time']) {
							$result = 'update';
						}
					}
					$wpdb->get_results($wpdb->prepare('UPDATE '.$wpdb->prefix.'ds_device SET last_request = '.time().' WHERE id = %d', $_REQUEST['device']));
				} else {
					if (!$cooknew) {
						$result = 'occupied';
					}
				}
				if (allowed_device($_REQUEST['device']) && isset($_REQUEST['force_update'])) {
					$result = 'update';
				}
			}
		} else {
			if (!isset($_REQUEST['device']) || $_REQUEST['device'] > -1) {
				$result = 'occupied';
			} else {
				if (get_current_user_id() > 0) {
					$v_username = 'ds_'.md5(site_url()).'_'.get_current_user_id();
					if (empty(get_option($v_username)) || get_option($v_username) == 0 || get_option($v_username) < time()) {
						$result = 'occupied';
					} else {
						if (isset($_REQUEST['program'])) {
							$program = $wpdb->get_row($wpdb->prepare('SELECT * FROM '.$wpdb->prefix.'ds_program WHERE id = %d', $_REQUEST['program']), ARRAY_A);
							if (isset($program)) {
								if ($program['change_date'] > $_REQUEST['time']) {
									$result = 'update';
								}
							} else {
								$result = 'occupied';
							}
						} else {
							$result = 'occupied';
						}
					}
				} else {
					$result = 'occupied';
				}
			}
		}
	}
	echo $result;
	die();
}

