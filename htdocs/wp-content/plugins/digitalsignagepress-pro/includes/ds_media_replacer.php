<?php
defined( 'ABSPATH' ) or die();
add_filter('attachment_fields_to_edit', 'signage_add_replace_option', 10, 2);
add_filter('media_row_actions', 'signage_add_row_action', 10, 2);
add_action('admin_menu', 'signage_register_submenu_menu');
function signage_add_replace_option($form_fields, $post) {
	$action = 'ds_media_replace_form';
	$url = admin_url('upload.php?page=digitalsignagepress/includes/ds_media_replacer.php&action='.$action.'&attachment_id='.$post->ID);
  	$url = wp_nonce_url($url, $action);
	if (FORCE_SSL_ADMIN) {
		$url = str_replace('http:', 'https:', $url);
	}
	$link = 'href="'.$url.'"';
	$form_fields[$action] = array('input' => 'html', 'html' => '<p><a class="button-secondary"'.$link.'>'. __('Upload a new file', 'digitalsignagepress').'</a></p>', 'label' => __('Replace media', 'digitalsignagepress'), 'helps' => __('Replace the current file and automatically update all links to it.', 'digitalsignagepress'));
	return $form_fields;
}
function signage_add_row_action($actions, $post) {
	$action = 'ds_media_replace_form';
	$url = admin_url('upload.php?page=digitalsignagepress/includes/ds_media_replacer.php&action='.$action.'&attachment_id='.$post->ID);
  	$url = wp_nonce_url($url, $action);
	if (FORCE_SSL_ADMIN) {
		$url = str_replace('http:', 'https:', $url);
	}
	$url = 'href="'.$url.'"';
	$actions[$action] = '<a '.$url.' title="'.__('Replace media', 'digitalsignagepress').'" rel="permalink">'.__('Replace', 'digitalsignagepress').'</a>';
	return $actions;
}
function signage_register_submenu_menu() {
	add_submenu_page(NULL, __("Replace media", "digitalsignagepress"), '','upload_files', 'digitalsignagepress/includes/ds_media_replacer', 'signage_replace_panel_options');
}
function signage_replace_panel_options() {
	if (isset($_GET['action'])) {
		$action = $_GET['action'];
		if (in_array($action, array('ds_media_replace_form', 'ds_media_replace_upload'))) {
    			check_admin_referer($action);
			require_once($action.'.php');
		}
	}
}
?>
