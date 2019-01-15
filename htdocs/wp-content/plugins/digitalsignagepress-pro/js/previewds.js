function generatePreview(){
	jQuery("#allDSScreens").html("");
	var nrScreen = parseInt(jQuery("#save_myDS_form").find("#save_nrOfScreens").val());
	for (aa=1; aa <= nrScreen; aa++){
		var dsid = jQuery("#save_myDS_form").find("#save_myDSSID"+aa).val();
		var dsprefix = "load_myDS"+ dsid;
		var ctIdLexists = false;
		if (jQuery("#load_form").find("#"+ dsprefix+"CustomTemplateId").length){
			ctIdLexists = true;
		}
		var dstemplIdLoad = parseInt(jQuery("#load_form").find("#"+ dsprefix+"TemplateId").val());
		var dscusttemplIdLoad = jQuery("#load_form").find("#"+ dsprefix+"CustomTemplateId").val();
		var dscusttemplCodeLengthLoad = parseInt((jQuery("#load_form").find("#"+ dsprefix+"CustomTemplateCode").val()+"").length);
		var dscusttemplCodeLoad = jQuery("#load_form").find("#"+ dsprefix+"CustomTemplateCode").val();
		var dscontElementsCntLoad = parseInt(jQuery("#load_form").find("#"+ dsprefix+"maxEID").val());
		dsprefix = "save_myDS"+ dsid;		
		var ctIdSexists = false;
		if (jQuery("#save_myDS_form").find("#"+ dsprefix+"CustomTemplateId").length){
			ctIdSexists = true;
		}
		var dstemplIdSave = parseInt(jQuery("#save_myDS_form").find("#"+ dsprefix+"TemplateId").val());
		var dscusttemplIdSave = jQuery("#save_myDS_form").find("#"+ dsprefix+"CustomTemplateId").val();
		var dscusttemplCodeLengthSave = parseInt((jQuery("#save_myDS_form").find("#"+ dsprefix+"CustomTemplateCode").val()+"").length);
		var dscusttemplCodeSave = jQuery("#save_myDS_form").find("#"+ dsprefix+"CustomTemplateCode").val();
		var dscontElementsCntSave = parseInt(jQuery("#save_myDS_form").find("#"+ dsprefix+"maxEID").val());
		var templateId = 0;
		var customtemplateId = 0;
		var customCode = "";
		var maxContElem = 0;
		if (!isNaN(dstemplIdSave) && dstemplIdSave > 0 ){
			templateId = dstemplIdSave;
		} else if (!isNaN(dstemplIdLoad) && dstemplIdLoad > 0){
			templateId = dstemplIdLoad;
		}
		if (dscusttemplIdLoad === undefined || dscusttemplIdLoad === null || dscusttemplIdLoad < 0 || dscusttemplIdLoad.length === 0){
			customtemplateId = dscusttemplIdSave;
		} else if (dscusttemplIdSave === undefined || dscusttemplIdSave === null || dscusttemplIdSave < 0 || dscusttemplIdSave.length === 0){
			customtemplateId = dscusttemplIdLoad;
		}
		if (dscusttemplCodeLengthSave > 9 ){
			customCode = dscusttemplCodeSave;
		} else if (dscusttemplCodeLengthLoad > 9){
			customCode = dscusttemplCodeLoad;
		}
		if (!isNaN(dscontElementsCntSave) && dscontElementsCntSave > 0 ){
			maxContElem = dscontElementsCntSave;
		} else if (!isNaN(dscontElementsCntLoad) && dscontElementsCntLoad > 0){
			maxContElem = dscontElementsCntLoad;
		}
		var htmlCode = getTemplateCode(parseInt(templateId), parseInt(customtemplateId), customCode);
		htmlCode = htmlCode.replace(/myDSX/g, "myDS"+ dsid);
		for (g=0; g <= 70; g++){
			var contSave = jQuery("#save_myDS"+ dsid +"E"+g+"_content").val()+"";
			var contLengthSave = parseInt(contSave.length);
			var contLoad = jQuery("#load_myDS"+ dsid +"E"+g+"_content").val()+"";
			var contLengthLoad = parseInt(contLoad.length);
			var usedContent = "";
			if ( !isNaN(contLengthSave) && contLengthSave > 9 ){
				usedContent = contSave;
			} else if ( !isNaN(contLengthLoad) && contLengthLoad > 9 ){
				usedContent = contLoad;
			}
			htmlCode = htmlCode.replace(new RegExp("\\[myDSEC"+g+"]", "g"), usedContent);
		}
		htmlCode = htmlCode + addScheduling(dsid);
		jQuery("#allDSScreens").append( htmlCode );			
	}
}
function addScheduling(dsid){
	var retVal = "";
	var dspermanent = ""+getValueFromForms(dsid+"permanent");
	retVal = retVal + '<input type="hidden" id="myDS'+dsid+'permanent"  value="'+ dspermanent +'">';
	var dsplayDuration = ""+getValueFromForms(dsid+"playduration");
	retVal = retVal + '<input type="hidden" id="myDS'+dsid+'playduration"  value="'+ dsplayDuration+'">';
	var dsstartdate = ""+getValueFromForms(dsid+"startdate");
	retVal = retVal + '<input type="hidden" id="myDS'+dsid+'startdate"  value="'+ dsstartdate +'">';
	var dsenddate = ""+getValueFromForms(dsid+"enddate");
	retVal = retVal + '<input type="hidden" id="myDS'+dsid+'enddate"  value="'+ dsenddate+'">';
	var dsdayofmonthstart = ""+getValueFromForms(dsid+"dayofmonthstart");
	retVal = retVal + '<input type="hidden" id="myDS'+dsid+'dayofmonthstart"  value="'+ dsdayofmonthstart +'">';
	var dsdayofmonthend = ""+getValueFromForms(dsid+"dayofmonthend");
	retVal = retVal + '<input type="hidden" id="myDS'+dsid+'dayofmonthend"  value="'+ dsdayofmonthend +'">';
	for (k=1; k<=70;k++){
		var dsstartd = ""+getValueFromForms(dsid+"wd"+k+"startd");
		if (dsstartd.length > 0){
			retVal = retVal + '<input type="hidden" id="myDS'+dsid+'wd'+k+'startd"  value="'+ dsstartd +'">';
			var dsstarth = ""+getValueFromForms(dsid+"wd"+k+"starth");
			retVal = retVal + '<input type="hidden" id="myDS'+dsid+'wd'+k+'starth"  value="'+ dsstarth +'">';
			var dsstartm = ""+getValueFromForms(dsid+"wd"+k+"startm");
			retVal = retVal + '<input type="hidden" id="myDS'+dsid+'wd'+k+'startm"  value="'+ dsstartd +'">';
			var dsendd = ""+getValueFromForms(dsid+"wd"+k+"endd");
			retVal = retVal + '<input type="hidden" id="myDS'+dsid+'wd'+k+'endd"  value="'+ dsendd +'">';
			var dsendh = ""+getValueFromForms(dsid+"wd"+k+"endh");
			retVal = retVal + '<input type="hidden" id="myDS'+dsid+'wd'+k+'endh"  value="'+ dsendh +'">';
			var dsendm = ""+getValueFromForms(dsid+"wd"+k+"endm");
			retVal = retVal + '<input type="hidden" id="myDS'+dsid+'wd'+k+'endm"  value="'+ dsendm +'">';
		}
	}
	return retVal;
}
function getValueFromForms(ds_keyName){
	var curVal = "";
	if ( jQuery("#save_myDS"+ ds_keyName).length  ){
		curVal = jQuery("#save_myDS"+ ds_keyName).val();
	} else if ( jQuery("#load_myDS"+ ds_keyName).length  ){
		curVal = jQuery("#load_myDS"+ ds_keyName).val();
	}
	return curVal;
}
function getTemplateCode(templateId, customtemplateId , customCode){
	var htmlcode = "";
	if ( !isNaN(templateId) && templateId > 0 ){
		htmlcode = sanitizeHtmlCode(wordPressTemplateArray[templateId]);
	} else if(customtemplateId > -1){
		htmlcode = sanitizeHtmlCode(customCode);
	}
	return htmlcode;
}
function sanitizeHtmlCode(htmlCode){
    var result = htmlCode
            .replace(/<script.*?<\/script>/g, "")
            .replace(/<link.*?>/g, "");
    return result;
};

