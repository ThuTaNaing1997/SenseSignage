<?php
defined( 'ABSPATH' ) or die();
if (!current_user_can('upload_files')) {
	wp_die(__('You do not have permission to upload files.', 'digitalsignagepress'));
}
echo '<div class="wrap"><h2>'.__('Media Replacement', 'digitalsignagepress').'</h2>';
global $wpdb;
if (isset($_GET['attachment_id']) && is_numeric($_GET['attachment_id'])) {
	$file_id = (int) $_GET['attachment_id'];
	$guid = $wpdb->get_var('SELECT guid FROM '.$wpdb->prefix.'posts WHERE ID = '.$file_id);
} else {
	$guid = null;
}
if (isset($guid)) {
	$guid = substr($guid, (strrpos($guid, '/') + 1));
	$action = 'ds_media_replace_upload';
	$url = admin_url('upload.php?page=digitalsignagepress/includes/ds_media_replacer.php&noheader=true&action='.$action.'&attachment_id='.$file_id);
	$nonce_url = wp_nonce_url($url, $action);
	if (FORCE_SSL_ADMIN) {
		$nonce_url = str_replace('http:', 'https:', $nonce_url);
	}
?>
	<form method="post" action="<?php echo $nonce_url; ?>" enctype="multipart/form-data">
		<div id="message" class="updated fade"><p><?php echo str_replace('FILENAME','"<b>'.$guid.'</b>"',__('Choose a new file to replace FILENAME', 'digitalsignagepress')); ?></b>".</p></div>
		<p><?php echo __('All links to the old file will be updated.', 'digitalsignagepress'); ?><br>
		<?php echo __('Once the upload is finished, this can not be undone!', 'digitalsignagepress'); ?></p>
		<?php echo __('Upload a new file', 'digitalsignagepress'); ?><br>
		<input type="file" name="replacementfile" />

		<p><input type="hidden" name="attachment_id" value="<?php echo $file_id; ?>" /></p>
		<input type="submit" class="button" value="<?php echo __('Upload', 'digitalsignagepress'); ?>" /> <a href="#" onclick="history.back();" class="ds-back-button"><?php echo __('Back', 'digitalsignagepress'); ?></a>
	</form>
</div>
<style>
.ds-back-button {line-height: 28px;padding:5px;text-decoration:none;}
</style>
<?php
} else {
?>
<div id="message" class="error"><p><?php echo __('You must choose an existing file to replace!', 'digitalsignagepress'); ?></p></div>
<?php
}
?>
