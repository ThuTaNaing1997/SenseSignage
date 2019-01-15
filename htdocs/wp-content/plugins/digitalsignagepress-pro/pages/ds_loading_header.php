<div id="loading_anim">
<img src="<?php echo SIGNAGE_PLUGIN_DIR.'/img/loading.gif'?>">
<input type="hidden" id="dslc" name="dslc" value="0">
</div>
<script type="text/javascript">
function showLoadingAnim() {
	jQuery('#dslc').val(parseInt(jQuery("#dslc").val()) + 1);
	jQuery('#loading_anim').css('display','');
}
function hideLoadingAnim() {
	jQuery('#dslc').val(parseInt(jQuery("#dslc").val()) - 1);
	var current = jQuery('#dslc').val();
	if (current <= 0) {
		jQuery('#loading_anim').css('display','none');
	}
}
</script>
