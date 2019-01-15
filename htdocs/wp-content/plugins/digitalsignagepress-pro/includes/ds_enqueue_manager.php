<?php
defined( 'ABSPATH' ) or die();

if (has_blanktheme() && isset($_GET['page']) && strpos($_GET['page'], SIGNAGE_PLUGIN_MENU_SLUG) > -1) {
	$current = 'home';
	if (ds_wp_mechanic_page()) {
		$current = 'none';
	} else {
		if (isset($_GET['page'])) {
			$nav_types = array('home', 'overview', 'devices', 'devicewalls');
			$test = str_replace(SIGNAGE_PLUGIN_MENU_SLUG.'_', '', $_GET['page']);
			if (!empty($test) && in_array($test, $nav_types)) {
				$current = $test;
			} else {
				if (isset($_GET['viewds']) && in_array($_GET['viewds'], $nav_types)) {
					$current = $_GET['viewds'];
				}
			}
		}
	}
	if ($current != 'none') {
		function ds_enqueue_styles() {
			wp_register_style('dscss-grid', SIGNAGE_PLUGIN_DIR.'css/grid.css');
			wp_enqueue_style('dscss-grid');
			wp_register_style('dscss-typografie', SIGNAGE_PLUGIN_DIR.'css/typografie.css');
			wp_enqueue_style('dscss-typografie');
			wp_register_style('dscss-timepicker', SIGNAGE_PLUGIN_DIR.'css/bootstrap-timepicker.css');
			wp_enqueue_style('dscss-timepicker');
			wp_register_style('dscss-fonts', SIGNAGE_PLUGIN_DIR.'css/google_fonts.css');
			wp_enqueue_style('dscss-fonts');
		}
		add_action('admin_enqueue_scripts', 'ds_enqueue_styles', 10);
		add_action('wp_head', 'ds_enqueue_styles', 10);
		function ds_enqueue_styles_late() {
			wp_register_style('dscss-base-template', SIGNAGE_PLUGIN_DIR.'css/base-template.css');
			wp_enqueue_style('dscss-base-template');
			wp_register_style('dscss-colors', SIGNAGE_PLUGIN_DIR.'css/colors.css');
			wp_enqueue_style('dscss-colors');
		}
		add_action('admin_enqueue_scripts', 'ds_enqueue_styles_late', 15);
		add_action('wp_head', 'ds_enqueue_styles_late', 15);
	}
	if ($current == 'home') {
		function ds_enqueue_styles_step1() {
			wp_enqueue_media();
			wp_register_script('dsjs-signageplugin-js', SIGNAGE_PLUGIN_DIR.'js/signageplugin.js', array('jquery'));
			wp_enqueue_script('dsjs-signageplugin-js');
			wp_register_script('dsjs-jquery-ui', SIGNAGE_PLUGIN_DIR.'jquery/jquery-ui.min.js', array('jquery'));
			wp_enqueue_script('dsjs-jquery-ui');
			wp_register_script('dsjs-functions', SIGNAGE_PLUGIN_DIR.'js/functions.js', array('jquery'));
			wp_enqueue_script('dsjs-functions');
			wp_register_script('dsjs-owl-carousel', SIGNAGE_PLUGIN_DIR.'js/owl.carousel.js', array('jquery'));
			wp_enqueue_script('dsjs-owl-carousel');
			wp_register_script('dsjs-calendar', SIGNAGE_PLUGIN_DIR.'js/calendar.js', array('jquery'));
			wp_enqueue_script('dsjs-calendar');
			wp_register_script('dsjs-bootstrap', SIGNAGE_PLUGIN_DIR.'js/bootstrap.3.3.6.min.js', array('jquery'));
			wp_enqueue_script('dsjs-bootstrap');
			wp_register_script('dsjs-bs-timepicker', SIGNAGE_PLUGIN_DIR.'js/bootstrap-timepicker.js', array('jquery'));
			wp_enqueue_script('dsjs-bs-timepicker');
			wp_register_script('dsjs-spectrum', SIGNAGE_PLUGIN_DIR.'plugins/bgrins-spectrum-98454b5/spectrum.js', array('jquery'));
			wp_enqueue_script('dsjs-spectrum');
			wp_register_script('dsjs-previewds', SIGNAGE_PLUGIN_DIR.'js/previewds.js', array('jquery'));
			wp_enqueue_script('dsjs-previewds');
			wp_register_script('dsjs-vimeoplayer', SIGNAGE_PLUGIN_DIR.'js/vimeo_player.js', array('dsjs-functions'));
    			wp_enqueue_script('dsjs-vimeoplayer');
			wp_register_script('dsjs-enablediv', SIGNAGE_PLUGIN_DIR.'js/enablediv.js', array('dsjs-vimeoplayer'));
    			wp_enqueue_script('dsjs-enablediv');
			wp_register_script('dsjs-schedulingds', SIGNAGE_PLUGIN_DIR.'js/sched.js', array('dsjs-enablediv'));
			wp_enqueue_script('dsjs-schedulingds');
			wp_register_script('dsjs-rangy-core', SIGNAGE_PLUGIN_DIR.'plugins/rangy/rangy-core.js', array('jquery'));
			wp_enqueue_script('dsjs-rangy-core');
			wp_register_script('dsjs-rangy-classapplier', SIGNAGE_PLUGIN_DIR.'plugins/rangy/rangy-classapplier.js', array('jquery'));
			wp_enqueue_script('dsjs-rangy-classapplier');
			wp_register_script('dsjs-copyslide', SIGNAGE_PLUGIN_DIR.'js/copyslide.js', array('jquery'));
			wp_enqueue_script('dsjs-copyslide');
			wp_register_style('dscss-jqueryui', SIGNAGE_PLUGIN_DIR.'css/jquery-ui.css');
			wp_enqueue_style('dscss-jqueryui');
			wp_register_style('dscss-editor', SIGNAGE_PLUGIN_DIR.'css/ds-editor.css');
			wp_enqueue_style('dscss-editor');
			wp_register_style('dscss-templatecontent', SIGNAGE_PLUGIN_DIR.'css/ds-template-content.css');
			wp_enqueue_style('dscss-templatecontent');
			wp_register_style('dscss-fontsb', SIGNAGE_PLUGIN_DIR.'css/fontsb.css');
			wp_enqueue_style('dscss-fontsb');
			wp_register_style('dscss-spectrum', SIGNAGE_PLUGIN_DIR.'plugins/bgrins-spectrum-98454b5/spectrum.css');
			wp_enqueue_style('dscss-spectrum');
			wp_register_style('dscss-calendar', SIGNAGE_PLUGIN_DIR.'css/calendar.css');
			wp_enqueue_style('dscss-calendar');
			wp_register_style('dscss-owlcarousel', SIGNAGE_PLUGIN_DIR.'css/owl.carousel.css');
			wp_enqueue_style('dscss-owlcarousel');
			wp_register_style('dscss-owltheme', SIGNAGE_PLUGIN_DIR.'css/owl.theme.css');
			wp_enqueue_style('dscss-owltheme');
			wp_register_style('dscss-modal', SIGNAGE_PLUGIN_DIR.'css/modal.css');
			wp_enqueue_style('dscss-modal');
			wp_register_style('dscss-glyphicon', SIGNAGE_PLUGIN_DIR.'css/glyphicon.css');
			wp_enqueue_style('dscss-glyphicon');
		}
		function ds_enqueue_styles_step2() {
			wp_register_style('dscss-style', SIGNAGE_PLUGIN_DIR.'css/style.css');
			wp_enqueue_style('dscss-style');
		}
		add_action('admin_enqueue_scripts', 'ds_enqueue_styles_step1', 11);
		add_action('wp_head', 'ds_enqueue_styles_step1', 11);
		add_action('admin_enqueue_scripts', 'ds_enqueue_styles_step2', 12);
		add_action('wp_head', 'ds_enqueue_styles_step2', 12);
		$v_username = 'ds_'.md5(site_url()).'_'.get_current_user_id();
		$v_value = time()+(24 * 60 * 60);
		$cookiepath = defined('COOKIEPATH') ? COOKIEPATH : '';
		if (function_exists('is_multisite') && is_multisite() || empty($cpath)) {
			setrawcookie( $v_username, $v_value, $v_value, '/', '');
		} else {
			setrawcookie( $v_username, $v_value, $v_value, $cookiepath, COOKIE_DOMAIN );
		}
		update_option($v_username, $v_value);
	}	    
	if ($current == 'overview') {
		function ds_enqueue_styles_program() {
			wp_register_script('dsjs-bootstrap', SIGNAGE_PLUGIN_DIR.'js/bootstrap.3.3.6.min.js', array('jquery'));
			wp_enqueue_script('dsjs-bootstrap');
			wp_register_style('dscss-collapse', SIGNAGE_PLUGIN_DIR.'css/collapse.css');
			wp_enqueue_style('dscss-collapse');
			wp_register_style('dscss-devices', SIGNAGE_PLUGIN_DIR.'css/devices.css');
			wp_enqueue_style('dscss-devices');
			wp_register_style('dscss-style', SIGNAGE_PLUGIN_DIR.'css/style.css');
			wp_enqueue_style('dscss-style');
		}
		add_action('admin_enqueue_scripts', 'ds_enqueue_styles_program', 12);
		add_action('wp_head', 'ds_enqueue_styles_program', 12);
	}
	if ($current == 'devices') {
		function ds_enqueue_styles_device() {
			wp_register_style('dscss-devices', SIGNAGE_PLUGIN_DIR.'css/devices.css');
			wp_enqueue_style('dscss-devices');
			wp_register_style('dscss-style', SIGNAGE_PLUGIN_DIR.'css/style.css');
			wp_enqueue_style('dscss-style');
			if (!isset($_GET['DID']) || !is_numeric($_GET['DID'])) {
				wp_register_script('dsjs-list', SIGNAGE_PLUGIN_DIR.'js/list.js', array('jquery'));
				wp_enqueue_script('dsjs-list');
				wp_register_script('dsjs-listpagination', SIGNAGE_PLUGIN_DIR.'js/list.pagination.js', array('jquery'));
				wp_enqueue_script('dsjs-listpagination');
			}
		}
		add_action('admin_enqueue_scripts', 'ds_enqueue_styles_device', 12);
		add_action('wp_head', 'ds_enqueue_styles_device', 12);
	}
	if ($current == 'devicewalls') {
		function ds_enqueue_styles_devicewall() {
			wp_register_script('devicewalls-js', SIGNAGE_PLUGIN_DIR.'js/devicewalls.js', array('jquery'));
			wp_enqueue_script('devicewalls-js');
			wp_register_style('dscss-devices', SIGNAGE_PLUGIN_DIR.'css/devices.css');
			wp_enqueue_style('dscss-devices');
			wp_register_style('dscss-style', SIGNAGE_PLUGIN_DIR.'css/style.css');
			wp_enqueue_style('dscss-style');
			if (!isset($_GET['DID']) || !is_numeric($_GET['DID'])) {
				wp_register_script('dsjs-list', SIGNAGE_PLUGIN_DIR.'js/list.js', array('jquery'));
				wp_enqueue_script('dsjs-list');
				wp_register_script('dsjs-listpagination', SIGNAGE_PLUGIN_DIR.'js/list.pagination.js', array('jquery'));
				wp_enqueue_script('dsjs-listpagination');
			}
		}
		add_action('admin_enqueue_scripts', 'ds_enqueue_styles_devicewall', 12);
		add_action('wp_head', 'ds_enqueue_styles_devicewall', 12);
	}
}
