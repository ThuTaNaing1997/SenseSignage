function ds_mkslide() {
	ds_createNewSlide();
	jQuery('#modal_copyslide').modal('hide');
}
if (userId == null) {
	var userId = -1;
}
jQuery(document).ready(function() {
	jQuery('#tabhead_new_button').attr('onclick', 'ds_createNewSlide_conf();');
});
function ds_createNewSlide_conf () {
	document.getElementById('save_copyselection').disabled=true;
	document.getElementById('active_copy_sel').value=-1;
	jQuery('#modal_copyslide').modal('show');
	var data = new FormData();
	data.append('action','signage_refresh_slide_copy_ajax');
	data.append('user',userId);
	var orientation = -1;
	if (document.getElementById("screen-list").style.display != "none") {
		if (jQuery('#selector_portrait.selected_layout').length > 0) {
			orientation = 2;
		} else {
			orientation = 1;
		}
	}
	data.append('orientation',orientation);
	jQuery.ajax({
		type:"POST",
		url:uploadUrl,
		data:data,
		cache: false,
		contentType: false,
		processData: false,
		success:function(response){
			if (response != 'error') {
				jQuery('#slideselection_list').html(response);
			}
		}
	});
};
function selectcopy(pid, scid) {
	document.getElementById('active_copy_sel').value=scid;
	jQuery('.copy_elem').removeClass('copy_selected');
	jQuery('#copy_entry_'+pid+'_'+scid).addClass('copy_selected');
	document.getElementById('save_copyselection').disabled=false;
}
function choosecopy() {
	showLoadingAnim();
	ds_createNewSlide();
	var copyId = document.getElementById('active_copy_sel').value;
	var data = new FormData();
	data.append('action','signage_make_slide_copy_ajax');
	data.append('scid',copyId);
	jQuery.ajax({
		type:"POST",
		url:uploadUrl,
		data:data,
		cache: false,
		contentType: false,
		processData: false,
		success:function(response){
			if (response != null && response != '' && response != 'error') {
				var tabNumber = jQuery("#save_nrOfScreens").val();
				var dSId = jQuery('#save_myDSSID'+tabNumber).val();
				tabNumber--;
				var content = JSON.parse(response);
				var htmlCode = '';
				var isCustom = false;
				for(var key in content) {
					createUpdateSaveForm(dSId, key, content[key]);
					if (key == 'CustomTemplateCode') htmlCode = content[key];
					if (key == 'CustomTemplateId' && content[key] > -1) isCustom = true;
				}
				jQuery("#screen-title_"+tabNumber).val(document.getElementById('save_myDS'+dSId+'Name').value);
				ds_updateTitle(tabNumber);
				ds_updatePlayduration(tabNumber);
				if (jQuery('#check_myDS'+dSId).length > 0) {
					jQuery('#check_myDS'+dSId).val('3');
				} else {
					var newinput = document.createElement("input");
					newinput.id = 'check_myDS'+dSId;
					newinput.name = 'check_myDS'+dSId;
					newinput.type = 'hidden';
					newinput.value = '3';
					document.getElementById("load_form").appendChild(newinput);
				}
				jQuery('#tabheadsimg'+tabNumber).css('display', 'block');
				if (isCustom) {
					jQuery.fn.changeDisplayedTemplate(true, 0, '', htmlCode);
				}
				jQuery.fn.displayScreen(dSId);
				ds_switchTab(tabNumber);
				ds_unhideTab(tabNumber);
				caldragstart();
			}
			hideLoadingAnim();
		}
	});
}
