<?php
defined( 'ABSPATH' ) or die();

?>
<div class="wrap">
	<h2><?php _e('Setup for DigitalSignagePress','digitalsignagepress'); ?></h2><?php
if (version_compare(phpversion(), '5.5', '<')) {
?><h3><a href="https://digitalsignagepress.com/faq/"><?php _e('This plugin requires at least PHP 5.5 or higher.','digitalsignagepress');?></a></h3>
<?php
} else {
?>
	<p><?php _e('To use our DigitalSignagePress Plugin, please follow the next steps to activate it.','digitalsignagepress'); ?></p>
	<table class="form-table">
		<tbody>
			<tr valign="top">
				<th scope="row" valign="top" style="width:300px">
					<?php _e('Step 1: Install DigitalSignagePress Theme','digitalsignagepress'); ?>
				</th>
				<td>
					<?php if(has_blanktheme()) { ?>
						<span style="color:green;"><?php _e('installed','digitalsignagepress'); ?></span>
						<p><?php _e('Activation is <b>not</b> required.','digitalsignagepress') ?></p>
					<?php } else {?>
						<a href="<?php echo DS_THEME_LINK;?>"><?php _e('Download','digitalsignagepress'); ?></a>
						<p><?php _e('Please download the DigitalSignagePress Theme and install it.<br>You <b>don\'t</b> need to <b>activate</b> it, only install it.','digitalsignagepress'); ?></p>
					<?php } ?>
				</td>
			</tr>
		</tbody>
	</table>
<?php
}
