var custom_img_uploader;
var custom_vid_uploader;
var custom_slideshow_uploader;
jQuery.fn.getDefaultContainerName = function() {
    return jQuery.settings.containerIdBase + jQuery.settings.containerIdSuffix;
};
jQuery.fn.isContainer = function(){
    var trigger = jQuery(this);
    var idAttribute = trigger.attr("id");
    if (idAttribute.indexOf(jQuery.settings.containerIdBase) > -1 &&
            idAttribute.indexOf(jQuery.settings.containerIdSuffix) > -1){
        return true;
    } else {
        return false;
    }
};
jQuery.fn.getNextFreeContainerId = function(){
    var freeId = null;
    for (i=0; i <= jQuery.settings.maxContainerElems; i++){
        if(jQuery("#" + jQuery.fn.getDefaultContainerName() + i).length === 0){           
            freeId = i;
            break;
        }
    }
    return freeId;
};
jQuery.fn.calculateContainerPositionArray = function(){
    var positionArray = new Array();
    positionArray['left'] = Math.min(
            jQuery.containerCreator.position1.x,
            jQuery.containerCreator.position2.x);
    positionArray['top'] = Math.min(
            jQuery.containerCreator.position1.y,
            jQuery.containerCreator.position2.y);
    
    return positionArray;
};
jQuery.fn.calculateContainerSizeArray = function(){
    var sizeArray = new Array();

    sizeArray['width'] = Math.abs(
            jQuery.containerCreator.position2.x - 
            jQuery.containerCreator.position1.x);
    sizeArray['height'] = Math.abs(
            jQuery.containerCreator.position2.y - 
            jQuery.containerCreator.position1.y);
    return sizeArray;
};
jQuery.fn.getWorkbenchPosition = function(event){
    var parentOffset = jQuery('#workbench-area').offset();
    var currentX = Math.round(event.pageX - parentOffset.left);
    var currentY = Math.round(event.pageY - parentOffset.top);
    var position = new Array();
    position['x'] = 100 * (currentX / jQuery('#workbench-area').width());
    position['y'] = 100 * (currentY / jQuery('#workbench-area').height());
    return position;
};
jQuery.fn.getCellSizeX = function(){
    return jQuery.settings.selectedGridCellWidth;
};
jQuery.fn.getCellSizeY = function(){
    return jQuery.settings.selectedGridCellHeight;
};
jQuery.fn.getMaxZIndex = function(){
    var highestIndex = 0;
    jQuery("[id^=" + jQuery.fn.getDefaultContainerName() + "]").each(function(){
        var zValue = parseInt(jQuery(this).css("zIndex"), 10);
        if (zValue > highestIndex){
            highestIndex = zValue;
        }
    });
    return highestIndex;
};
jQuery.fn.getContainerElementId = function(){
    if (jQuery(this).attr("id") === undefined){
        return false;
    } else {
        var containerId = jQuery(this).attr("id").replace(jQuery.fn.getDefaultContainerName(), "");
        return parseInt(containerId, 10);
    }
};
jQuery.fn.getMaxContainerId = function(){
    var maxId = 0;
    jQuery("[id^=" + jQuery.fn.getDefaultContainerName() + "]").each(function(){
        if (jQuery(this).getContainerElementId() > maxId){
            maxId = jQuery(this).getContainerElementId();
        }
    });
    return maxId;
};
jQuery.fn.checkCurrentWorkbenchFormat = function(){
    var workbench = jQuery("#workbench-area");
    if (workbench.width() >= workbench.height()){
        return 1;
    } else {
        return 2;
    }
};
jQuery.fn.convertPositionToPercentage = function(isFreeMoveContainer, parentSizes){
    var trigger = jQuery(this);
    var percentageLocation = new Array();
    var parentWidth = 1280;
    var parentHeight = 720;
    if (jQuery.fn.isPercentage(trigger.parent().css("width"))){
        parentWidth = parseFloat(trigger.parent().parent().css("width"));
        parentHeight = parseFloat(trigger.parent().parent().css("height"));
    } else {
        parentWidth = parseFloat(trigger.parent().css("width"));
        parentHeight = parseFloat(trigger.parent().css("height"));
    }
    if (isFreeMoveContainer === true && parentSizes){
        parentWidth = parentSizes["width"];
        parentHeight = parentSizes["height"];
    }
    if (jQuery.fn.isPercentage(trigger.css("width"))){
            percentageLocation["width"] = parseFloat(trigger.css("width"));
    } else {
            percentageLocation["width"] = ((parseFloat(trigger.css("width")) / parentWidth) * 100);
    }
    if (jQuery.fn.isPercentage(trigger.css("height"))){
            percentageLocation["height"] = parseFloat(trigger.css("height"));
    } else {
            percentageLocation["height"] = ((parseFloat(trigger.css("height")) / parentHeight) * 100);
    }
    if (jQuery.fn.isPercentage(trigger.css("left"))){
        percentageLocation["left"] = parseFloat(trigger.css("left"));
    } else {
        percentageLocation["left"] = ((parseFloat(trigger.css("left")) / parentWidth) * 100);
    }
    if (jQuery.fn.isPercentage(trigger.css("top"))){
        percentageLocation["top"] = parseFloat(trigger.css("top"));
    } else {
        percentageLocation["top"] = ((parseFloat(trigger.css("top")) / parentHeight) * 100);
    }
    if (percentageLocation["left"] < 0){
        percentageLocation["left"] = 0;
    }
    if (percentageLocation["top"] < 0){
        percentageLocation["top"] = 0;
    }
    if (percentageLocation["width"] > 100){
        percentageLocation["width"] = 100;
    }
    if (percentageLocation["height"] > 100){
        percentageLocation["height"] = 100;
    }
    if (percentageLocation["width"] === 100){
        percentageLocation["left"] = 0;
    }
    if (percentageLocation["height"] === 100){
        percentageLocation["top"] = 0;
    }
    trigger.css({
        left: percentageLocation["left"] + "%",
        top: percentageLocation["top"] + "%",   
        width: percentageLocation["width"] + "%",
        height: percentageLocation["height"] + "%"
    });
};
jQuery.fn.isPercentage = function(cssValue){
    if (typeof(cssValue) == "string" || typeof(cssValue) == "String"){
        if (cssValue.endsWith("%")){
            return true;
        } else if (cssValue.endsWith("px")){
            return false;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
function isFileUrl(url){
    if (typeof(url) !== "string"){
        return false;
    }
    if (url.endsWith(".mp4") || url.endsWith(".webm") ||
            url.endsWith(".ogg") || url.endsWith(".ogv")){
        return true;
    } else {
        return false;
    }
};
function getFileTypeString(url){
    if (url.endsWith(".ogg") || url.endsWith(".ogv")){
        return "video/ogg";
    }
    if (url.endsWith(".mp4")){
        return "video/mp4";
    }
    if (url.endsWith(".webm")){
        return "video/webm";
    }
    return "";
}
function updateSize(trigger){
    getSize();
    jQuery(trigger).removeAttr("onload");
}
jQuery.fn.toggleDeleteButton = function(){
    if (jQuery.settings.selectedContainerId === undefined ||
            jQuery.settings.selectedContainerId === null){
        jQuery("#btn-container-delete-original").prop("disabled", true);
    } else {
        jQuery("#btn-container-delete-original").prop("disabled", false);
    }
};
jQuery.fn.setAspectRatioInput = function(){
    jQuery("#input-aspect-ratio").val(formData.screenRatio);
};
jQuery.fn.updateContainerColorPreview = function(){
    var trigger = jQuery(this);
    var backgroundContainerColor = jQuery("#" + jQuery.fn.getDefaultContainerName() + "0")
            .find(".ds-content").css("background-color");
    if (backgroundContainerColor === "transparent" || backgroundContainerColor === "rgba(0, 0, 0, 0)" ||
            backgroundContainerColor === "rgba(0,0,0,0)"){
        jQuery("[id^=btn-container-colorpicker-bg]").spectrum("set", "rgb(255, 255, 255)");
    } else {
        jQuery("[id^=btn-container-colorpicker-bg]").spectrum("set", backgroundContainerColor);
    }
    if (trigger === null || trigger === undefined || trigger.length <= 0){
        if (jQuery.settings.selectedContainerId !== null){
            trigger = jQuery("#" + jQuery.settings.selectedContainerId);
        } else {
            jQuery("[id^=btn-container-colorpicker-container]").spectrum("set", "rgb(255,255,255)");
            return;
        }
    }
    if (trigger.attr("id") === jQuery.fn.getDefaultContainerName() + "0"){
        if (trigger.find(".ds-content").length > 0){
            var currentBgColor = trigger.find(".ds-content").css("background-color");
            jQuery("[id^=btn-container-colorpicker]").spectrum("set", currentBgColor);
        } else {
            jQuery("[id^=btn-container-colorpicker]").spectrum("set", "rgb(255,255,255)");
        }
    } else {
        if (trigger.find(".ds-content").length > 0){
            var currentBgColor = trigger.find(".ds-content").css("background-color");
            if (currentBgColor === "transparent" || currentBgColor === "rgba(0, 0, 0, 0)" ||
            currentBgColor === "rgba(0,0,0,0)"){
                jQuery("[id^=btn-container-colorpicker-container]").spectrum("set", "rgb(255, 255, 255)");
            } else {
                jQuery("[id^=btn-container-colorpicker-container]").spectrum("set", currentBgColor);
            }
        } else {
            jQuery("[id^=btn-container-colorpicker-container]").spectrum("set", "rgb(255,255,255)");
        }
    }
};
jQuery.fn.handleContainerRadioClick = function(){
    var trigger = jQuery(this);
    if (trigger.data("checkState") === true){
        trigger.prop("checked", false).change();
        if (jQuery(this).attr("id") === "new-container-img"){
            jQuery("#hidden-div-1").text("");
        }
        jQuery("input[name=radio-container]").removeData("checkState");
    } else {
        trigger.data("checkState", true);
    }
    if (trigger.attr("id") === "new-container-img"){
        jQuery.settings.imageUploaderCalledBy = "new-container-img";
        jQuery.fn.handleNewImgContainer(true);
    }
};
jQuery.fn.toggleCustomTemplateButtons = function(showButton){
    if (showButton === true){
        jQuery("#selection-container-create-new-original").removeClass("ds-element-hide");
        jQuery("#btn-container-duplicate-original").removeClass("ds-element-hide");
    } else if (showButton === false){
        jQuery("#selection-container-create-new-original").addClass("ds-element-hide");
        jQuery("#btn-container-duplicate-original").addClass("ds-element-hide");
    }
};
jQuery.fn.handleMediaButtonState = function(enableMediaButtons){
    if (enableMediaButtons === true){
        jQuery(".ds-editor-button-media").prop("disabled", false);
    } else if (enableMediaButtons === false){
        jQuery(".ds-editor-button-media").prop("disabled", true);
    } else {
        if (jQuery.settings.selectedContainerId === null |
                jQuery.settings.selectedContainerId === undefined){
            jQuery(".ds-editor-button-media").prop("disabled", true);
        } else {
            jQuery(".ds-editor-button-media").prop("disabled", false);
        }
    }
};
jQuery.fn.handleTopicTextButtonState = function(enableButtons){
    if (enableButtons === true){
        jQuery(".ds-editor-button-topic-text").prop("disabled", false);
        jQuery("#btn-text-font-forecolor-original").spectrum("enable");
        jQuery(".button-group-text").css("background-color", "");
    } else if (enableButtons === false){
        jQuery(".ds-editor-button-topic-text").prop("disabled", true);
        jQuery("#btn-text-font-forecolor-original").spectrum("disable");
        jQuery(".button-group-text").css("background-color", "gray");
    } else {
        if (jQuery.settings.selectedContainerId === null |
                jQuery.settings.selectedContainerId === undefined){
            jQuery(".ds-editor-button-topic-text").prop("disabled", true);
        jQuery("#btn-text-font-forecolor-original").spectrum("disable");
        jQuery(".button-group-text").css("background-color", "gray");
        } else {
            jQuery(".ds-editor-button-topic-text").prop("disabled", false);
        jQuery("#btn-text-font-forecolor-original").spectrum("enable");
        jQuery(".button-group-text").css("background-color", "");
        }
    }
};
jQuery.fn.checkInputValue = function(){
    var trigger = jQuery(this);
    if (trigger.length === 0 || trigger === undefined || trigger === null){
        return;
    }
    if (trigger.prop("min") === undefined || 
            trigger.prop("min") === null ||
            trigger.prop("max") === undefined || 
            trigger.prop("max") === null){
        return;
    }
    var minValue = parseInt(trigger.prop("min"), 10);
    var maxValue = parseInt(trigger.prop("max"), 10);
    if (trigger.val() > maxValue){
        trigger.val(maxValue);
    }
    if (trigger.val() < minValue){
        trigger.val(minValue);
    } 
};
jQuery.fn.handleContainerMouseOver = function(){
    var trigger = jQuery(this);
    if (!trigger.isContainer()){
        return;
    }
    if (trigger.attr("id") === jQuery.fn.getDefaultContainerName() + "0"){
        return;
    }
    if (!trigger.hasClass("ds-container-selected") &&
            !trigger.hasClass("ds-container-editmode")){
        trigger.addClass("ds-container-highlight");
        trigger.handleOverlayHighlight(true);
    }
    if (trigger.hasClass("ds-container") &&
            !(trigger.attr("id") === jQuery.fn.getDefaultContainerName() + "0")){
        trigger.addDraggable();
    }
};
jQuery.fn.handleContainerMouseLeave = function(){
    var trigger = jQuery(this);
    if (!trigger.isContainer()){
        return;
    }
    trigger.handleOverlayHighlight(false);
    if (trigger.hasClass("ds-container-highlight")){
        trigger.removeClass("ds-container-highlight");
    }
};
jQuery.fn.handleSelectionAppearance = function(makeSelected){
    var trigger = jQuery(this);
    if (trigger.attr("id") === jQuery.fn.getDefaultContainerName() + "0"){
        return;
    }
    if (makeSelected === true){
        trigger.handleOverlayHighlight(false);
        trigger.addClass("ds-container-selected");
        trigger.handleOverlaySelected(true);
    } else if (makeSelected === false){
        trigger.removeClass("ds-container-selected");
        trigger.handleOverlaySelected(false);
    }
};
jQuery.fn.selectContainer = function(clickTarget){
    var trigger = jQuery(this);
    if (!trigger.isContainer()){
        return;
    }
    if (trigger.attr("id") === jQuery.settings.selectedContainerId){
        if (trigger.find(".ds-freemove").length > 0){
            if (jQuery(clickTarget).closest(".ds-freemove").length <= 0){
                if (!trigger.hasClass("ds-container-editmode")){
                    if (trigger.hasClass("ds-container")){
                        if (trigger.prop("id") !== jQuery.fn.getDefaultContainerName() + "0"){
                            if (!trigger.hasClass("ui-resizable")){
                                trigger.addResizable();
                            }
                            if (!trigger.hasClass("ui-draggable")){
                                trigger.addDraggable();
                            }
                        }
                    }
                    trigger.find(".ds-freemove").handleFreeMoveContainerHelper(false);
                    trigger.find(".ds-freemove").handleFreeMoveState(false);
                } else {
                    trigger.handleEditMode(false);
                }
            } else {
                if (!trigger.hasClass("ds-container-editmode")){
                    if (trigger.hasClass("ui-resizable")){
                        trigger.removeResizable();
                    }
                    if (trigger.hasClass("ui-draggable")){
                        trigger.removeDraggable();
                    }
                    trigger.find(".ds-freemove").handleFreeMoveContainerHelper(true);
                    trigger.find(".ds-freemove").handleFreeMoveState(true);
                }
            }
        }
        return;
    } else {
        jQuery.fn.deselectContainer();
        jQuery.settings.selectedContainerId = trigger.attr("id");
        if (jQuery.settings.selectedContainerId !==
                jQuery.fn.getDefaultContainerName() + "0"){
            jQuery.fn.handleMediaButtonState(true);
            jQuery("[id^=btn-container-colorpicker-container]").spectrum("enable");
        }
        trigger.handleSelectionAppearance(true);
        jQuery("#btn-container-delete-original").prop("disabled", false);
        trigger.updateContainerColorPreview();
        var setDraggableAndResizable = true;
        if (trigger.find(".ds-text-container-1").length > 0){
            trigger.find(".ds-text-container-1").handleTextContainerHelper(true);
            jQuery.fn.handleTopicTextButtonState(true);
        }
        if (trigger.find(".ds-html-container-1").length > 0){
            trigger.find(".ds-html-container-1").handleHtmlContainerHelper(true);
        }
        if (trigger.find(".ds-menu-container-1").length > 0){
            trigger.find(".ds-menu-container-1").handleMenuContainerHelper(true);
            jQuery.fn.handleTopicTextButtonState(true);
        }
        if (trigger.find(".ds-slideshow-container-1").length > 0){
            trigger.find(".ds-slideshow-container-1").handleSlideshowContainerHelper(true);
        }
        if (trigger.find(".ds-freemove").length > 0){
            if (jQuery(clickTarget).closest(".ds-freemove").length > 0){
                if (trigger.hasClass("ui-resizable")){
                    trigger.removeResizable();
                }
                if (trigger.hasClass("ui-draggable")){
                    trigger.removeDraggable();
                }
                setDraggableAndResizable = false;
                trigger.find(".ds-freemove").handleFreeMoveContainerHelper(true);
                trigger.find(".ds-freemove").handleFreeMoveState(true);
            } else {
                trigger.find(".ds-freemove").handleFreeMoveContainerHelper(false);
                trigger.find(".ds-freemove").handleFreeMoveState(false);
            }
        }
        if (setDraggableAndResizable && trigger.hasClass("ds-container")){
            if (trigger.attr("id") !== jQuery.fn.getDefaultContainerName() + "0"){
                if (!trigger.hasClass("ui-resizable")){
                    trigger.addResizable();
                }
                if (!trigger.hasClass("ui-draggable")){
                    trigger.addDraggable();
                }
            }
        }
    }
};
jQuery.fn.deselectContainer = function(){
    if (jQuery.settings.selectedContainerId === undefined ||
            jQuery.settings.selectedContainerId === null){
        return;
    }
    var currentSelectedContainer = jQuery("#" + jQuery.settings.selectedContainerId);
    if (currentSelectedContainer.length > 0){
        currentSelectedContainer.handleSelectionAppearance(false);
        currentSelectedContainer.removeDraggable();
        currentSelectedContainer.removeResizable();
        currentSelectedContainer.handleEditMode(false);
        if (currentSelectedContainer.find(".ds-text-container-1").length > 0){
            currentSelectedContainer.find(".ds-text-container-1")
                    .handleTextContainerHelper(false);
        }
        if (currentSelectedContainer.find(".ds-html-container-1").length > 0){
            currentSelectedContainer.find(".ds-html-container-1")
                    .handleHtmlContainerHelper(false);
        }
        if (currentSelectedContainer.find(".ds-menu-container-1").length > 0){
            currentSelectedContainer.find(".ds-menu-container-1")
                    .handleMenuContainerHelper(false);
        }
        if (currentSelectedContainer.find(".ds-slideshow-container-1").length > 0){
            currentSelectedContainer.find(".ds-slideshow-container-1")
                    .handleSlideshowContainerHelper(false);
        }
        if (currentSelectedContainer.find(".ds-freemove").length > 0){
            var freemoveContainer = currentSelectedContainer.find(".ds-freemove");
            freemoveContainer.handleFreeMoveContainerHelper(false);
            freemoveContainer.removeDraggable();
            freemoveContainer.removeFreeMoveResizable();
            freemoveContainer.removeClass("ds-freemove-on");
            freemoveContainer.handleOverlayFreemoveBlockade(false);
        }
    }
    jQuery.settings.selectedContainerId = null;
    jQuery("#btn-container-delete-original").prop("disabled", true);
    jQuery("[id^=btn-container-colorpicker-container]").spectrum("disable");
    jQuery.fn.handleMediaButtonState(false);
    jQuery.fn.handleTopicTextButtonState(false);
};
jQuery.fn.handleOverlayEditmode = function(setOverlay){
    var trigger = jQuery(this);
    if (trigger === undefined || trigger === null || trigger.length <= 0){
        return;
    }
    if (setOverlay === true){
        if (trigger.find(".ds-overlay-selection").length > 0){
            trigger.find(".ds-overlay-selection").remove();
        }
        jQuery("<div></div>", {
            class: "ds-overlay-selection ds-overlay-editmode",
            style: "width:100%; height:100%;"
        })
        .appendTo(trigger);
    } else if (setOverlay === false){
        trigger.find(".ds-overlay-editmode").remove();
    }
};
jQuery.fn.handleOverlayHighlight = function(setOverlay){
};
jQuery.fn.handleOverlaySelected = function(setOverlay){
    var trigger = jQuery(this);
    if (trigger === undefined || trigger === null || trigger.length <= 0){
        return;
    }
    if (setOverlay === true){
        if (trigger.find(".ds-overlay-selection").length > 0){
            trigger.find(".ds-overlay-selection").remove();
        }
        jQuery("<div></div>", {
            class: "ds-overlay-selection ds-overlay-selected",
            style: "width:100%; height:100%;"
        })
        .appendTo(trigger);
    } else if (setOverlay === false){
        trigger.find(".ds-overlay-selected").remove();
    }
};
jQuery.fn.handleEditMode = function(activateEditMode){
    var trigger = jQuery(this);
    if (trigger.find(".ds-text-container-1").length <= 0 && 
            trigger.find(".ds-menu-container-1").length <= 0){
        return;
    }
    trigger.handleEditModeAppearance(activateEditMode);
    if (activateEditMode){
        trigger.find(".ds-freemove").handleFreeMoveState(false);
    }
};
jQuery.fn.handleEditModeAppearance = function(activateEditMode){
    var trigger = jQuery(this);
    if (activateEditMode === true){
        trigger.addClass("ds-container-editmode");
        trigger.removeDraggable().change();
        trigger.removeResizable();
        trigger.removeClass("ds-container-highlight");
        trigger.handleOverlayEditmode(true);
    } else if (activateEditMode === false){
        jQuery(".ds-container").removeClass("ds-container-editmode");
        trigger.removeClass("ds-container-editmode");
        if (jQuery("#edit-menu-container").length > 0){
            jQuery("#edit-menu-container").remove();
        }
        trigger.handleOverlayEditmode(false);
    }
};
jQuery.fn.showEditMenu = function(){
    var trigger = jQuery(this);
    if (trigger.hasClass("ds-container-editmode")){
        jQuery("<div></div>", {
            id: "edit-menu-container",
            class: "edit-menu-container",
            style: "position:absolute !important; width: " + 100 + 
                    "px; height: " + 300 + 
                    "px; left: " + (trigger.position().left + trigger.width()) + 
                    "px; top: " + trigger.position().top +
                    "px; z-index: " + jQuery.fn.getMaxZIndex() + 1
        })
        .appendTo(jQuery('#workbench-area'));
    } else {
        jQuery.fn.hideEditMenu();
    }
};
jQuery.fn.hideEditMenu = function(){
    if (jQuery("#edit-menu-container").length > 0){
        jQuery("#edit-menu-container").remove();
    }
};
jQuery.fn.createContainer2 = function(containerId, positionArray, sizeArray){
    if (containerId < 0){
        return null;
    }
    if (positionArray === undefined || positionArray === null){
        positionArray = new Array();
        positionArray["left"] = "10";
        positionArray["top"] = "10";
    }
    if (sizeArray === undefined || sizeArray === null){
        sizeArray = new Array();
        sizeArray["width"] = "20";
        sizeArray["height"] = "20";
    }
    jQuery("<div></div>", {
        id: jQuery.fn.getDefaultContainerName() + containerId,
        class: 'ds-container',
        style: 'position:absolute !important; width: ' + sizeArray.width + 
                '%; height: ' + sizeArray.height + 
                '%; left: ' + positionArray.left + 
                '%; top: ' + positionArray.top + 
                '%; z-index: ' + (jQuery.fn.getMaxZIndex() + 1)
    })
    .appendTo(jQuery("#myDSX"));
    var newContainer = jQuery("#" + jQuery.fn.getDefaultContainerName() + containerId);
    jQuery("<div></div>", {
        class: "ds-content"
    })
    .appendTo(newContainer);
    newContainer.addDraggable();
    newContainer.finishContainer();
    jQuery.fn.updateDragLines();
    return newContainer;
};
jQuery.fn.handleContainerDelete = function(){
    if (formData.templateId > -1){
        jQuery.fn.clearContainer();
    } else {
        jQuery.fn.removeContainer();
    }
    jQuery.fn.updateContainerColorPreview();
};
jQuery.fn.removeContainer = function(){
    if (jQuery.settings.selectedContainerId === null || 
            jQuery.settings.selectedContainerId === undefined){
        return;
    }
    if (jQuery.settings.selectedContainerId === jQuery.fn.getDefaultContainerName() + "0"){
        jQuery.fn.clearContainer();
        return;
    }
    if (jQuery("#" + jQuery.settings.selectedContainerId).length > 0){
        jQuery("#" + jQuery.settings.selectedContainerId).remove();
        jQuery.fn.deleteContainerFormEntries();
        jQuery.fn.deselectContainer();
    }
    jQuery.fn.hideEditMenu();
};
jQuery.fn.clearContainer = function(){
    if (jQuery.settings.selectedContainerId === null ||
            jQuery.settings.selectedContainerId === undefined){
        return;
    }
    if (jQuery.settings.selectedContainerId === jQuery.fn.getDefaultContainerName() + "0"){
        jQuery("#" + jQuery.settings.selectedContainerId + " .ds-content").remove();
        jQuery.fn.changeContainerBgColor(jQuery.settings.selectedContainerId, "rgb(255,255,255)");
        return true;
    }
    if (jQuery("#" + jQuery.settings.selectedContainerId + " .ds-content").length > 0){
        jQuery("#" + jQuery.settings.selectedContainerId + " .ds-content").remove();
        jQuery("#" + jQuery.settings.selectedContainerId + " .ds-content-padding").remove();
        jQuery("#" + jQuery.settings.selectedContainerId + " .ds-content-freemove").remove();
        jQuery.fn.deleteContainerFormEntries();
        return true;
    } else {
        return false;
    }  
};
jQuery.containerCreator = new Object();
jQuery.fn.getCheckedNewContainerButton = function(){
    return jQuery("[id^=selection-container-new] :radio:checked").attr("id");
};
jQuery.fn.produceContainerStep1 = function(event){
    var tempPosition = jQuery.fn.getWorkbenchPosition(event);
    jQuery("#workbench-area")
            .prop("isMouseDown", true)
            .prop("mouseDownX", tempPosition.x)
            .prop("mouseDownY", tempPosition.y);
    if (jQuery.fn.getCheckedNewContainerButton() !== undefined){
        if (jQuery.containerCreator.position1 === undefined){
            jQuery.containerCreator.position1 = jQuery.fn.getWorkbenchPosition(event);
            jQuery("<div></div>", {
                id: "shadow-container",
                style: "position:absolute !important; border: red solid thin; left:"  + 
                        jQuery.containerCreator.position1.x + 
                        "%; top: " + jQuery.containerCreator.position1.y +
                        "%; z-index: " + (jQuery.fn.getMaxZIndex() + 1)
            })
            .appendTo(jQuery("#workbench-area"));
        }
    }
};
jQuery.fn.produceContainerStep2 = function(event){
    if (jQuery.fn.getCheckedNewContainerButton() !== undefined){
        if (jQuery.containerCreator.position1 !== undefined && 
                jQuery("#workbench-area").prop("isMouseDown") === true){
            var position = jQuery.fn.getWorkbenchPosition(event);
            jQuery("#shadow-container").css({
                "left": Math.min(
                        jQuery('#workbench-area').prop("mouseDownX"), 
                        position.x) + "%",
                "top": Math.min(
                        jQuery('#workbench-area').prop("mouseDownY"), 
                        position.y) + "%",
                "width": Math.abs(
                        jQuery('#workbench-area').prop("mouseDownX")
                        - position.x) + "%",
                "height": Math.abs(
                        jQuery('#workbench-area').prop("mouseDownY")
                        - position.y) + "%"
            });
        }
    }
};
jQuery.fn.produceContainerStep3 = function(event){
    if (jQuery.fn.getCheckedNewContainerButton() !== undefined){
        if (jQuery.containerCreator.position1 !== undefined && 
                jQuery.containerCreator.position2 === undefined){
            jQuery.containerCreator.position2 = jQuery.fn.getWorkbenchPosition(event);
            jQuery("#shadow-container").remove();
            var downX = jQuery("#workbench-area").prop("mouseDownX");
            var downY = jQuery("#workbench-area").prop("mouseDownY");
            var upPosition = jQuery.fn.getWorkbenchPosition(event);
            if (
                    Math.abs(downX - upPosition.x) < 10 &&
                    Math.abs(downY - upPosition.y) < 10){
                jQuery.fn.createContainer2(
                        jQuery.fn.getNextFreeContainerId(), 
                        jQuery.fn.calculateContainerPositionArray()
                );
            } else {
                jQuery.fn.createContainer2(
                        jQuery.fn.getNextFreeContainerId(), 
                        jQuery.fn.calculateContainerPositionArray(), 
                        jQuery.fn.calculateContainerSizeArray()
                );
            }
            jQuery.containerCreator = new Object();
            jQuery("#" + jQuery.fn.getCheckedNewContainerButton()).removeData("checkState").prop("checked", false).change();
        }
    }
    jQuery("#workbench-area")
            .removeProp("isMouseDown")
            .removeProp("mouseDownX")
            .removeProp("mouseDownY");
};
jQuery.fn.finishContainer = function(){
    var doneSomething = false;
    switch (jQuery.fn.getCheckedNewContainerButton()){
        default:
            break;
        case "new-container-dummy":
            jQuery("<span></span>", {
                text: "dummy container"
            })
            .appendTo(jQuery(this).find(".ds-content"));
            doneSomething = true;
            break;
        case "new-container-text":
            jQuery(this).find(".ds-content").createTextBodyDefault();
            doneSomething = true;
            break;
        case "new-container-img":
            if (jQuery("#hidden-div-1").text().length > 0){
                jQuery(this).createImageContainer(
                    jQuery("#hidden-div-1").text()
                );
            } else {
                jQuery(this).createImageContainer(
                        "http://dummyimage.com/250/aaccbb/0000ff");
            }
            jQuery("#hidden-div-1").text("");
            jQuery.settings.imageUploaderCalledBy = null;
            doneSomething = true;
            break;
    }
};
jQuery.fn.setBackgroundImage = function(containerId){
    if (containerId === null || containerId === undefined){
        return;
    }
    if (containerId === jQuery.fn.getDefaultContainerName() + "0"){
        jQuery.settings.imageUploaderCalledBy = "btn-container-set-img-bg0";
    } else {
        jQuery.settings.imageUploaderCalledBy = "btn-container-set-img-selected";
    }
    jQuery.fn.handleNewImgContainer();
};
jQuery.fn.handleNewImgContainer = function() {
    if (typeof(wp) === "undefined"){
        alert(ds_translation.stringWordpressFreeEnvironmentError+" (wp undefined)");
        return;
    }
    if (custom_img_uploader) {
        custom_img_uploader.open();
        return;
    } else {
        custom_img_uploader = wp.media.frames.file_frame = wp.media({
            title: ds_translation.stringChooseImage,
            library : { type : "image"},
            button: {
                text: ds_translation.stringChooseImage
            },
            multiple: false
        });
        custom_img_uploader.on("select", function() {
            attachment = custom_img_uploader.state().get("selection").first().toJSON();
            jQuery("#hidden-div-1").text(attachment.url);
            switch (jQuery.settings.imageUploaderCalledBy){
                default:
                    break;
                case "btn-container-set-img-bg0":
                    jQuery("#" + jQuery.fn.getDefaultContainerName() + "0")
                        .createImageContainer(attachment.url, 1);
                    jQuery.settings.imageUploaderCalledBy = null;
                    jQuery("#hidden-div-1").text("");
                    break;
                case "btn-container-set-img-selected":
                    if (jQuery.settings.selectedContainerId ===
                            jQuery.fn.getDefaultContainerName() + "0"){
                    } else {
                        jQuery("#" + jQuery.settings.selectedContainerId)
                            .createImageContainer(attachment.url);
                    }
                    jQuery.settings.imageUploaderCalledBy = null;
                    jQuery("#hidden-div-1").text("");
                    break;
                case "btn-container-new-img":
                        setImageWithCorrectAspectRatio(jQuery.fn.getNextFreeContainerId(), null, attachment.url);
                        jQuery.settings.imageUploaderCalledBy = null;
                        jQuery("#hidden-div-1").text("");
                    break;
                case "new-container-img":
                    break;
            }
        });
        custom_img_uploader.open();
    }
};
jQuery.fn.createImageContainer = function(imageUrl, imageType){
    var container = jQuery(this);
    if (container === null || container === undefined || container.length <= 0){
        return;
    }
    container.find(".ds-vid-container-1").remove();
    container.find(".ds-vid-container-2").remove();
    container.find(".ds-web-container-1").remove();
    container.find(".ds-html-container-1").remove();
    container.find(".ds-slideshow-container-1").remove();
    container.find(".ds-delete-this").remove();
    switch(imageType){
        case 1:
        case "1":
            if (container.find(".ds-content").length <= 0){
                jQuery("<div></div>", {
                    class: "ds-content ds-image-container-1",
                    style: "width:100%; height:100%; position:absolute; padding-bottom:0; overflow:hidden;"
                }).appendTo(container);
            } else {
                if (container.find(".ds-content").hasClass("ds-image-container-1")){
                    container.find(".ds-content").find("img").remove();
                }
                container.find(".ds-content").addClass("ds-image-container-1");
                container.find(".ds-content").css({
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    paddingBottom: "0",
                    overflow: "hidden"
                });
            }
            jQuery("<img></img>", {
                style: "width: 100%; height:100%; position: relative; top: 0; left: 0;",
                src: imageUrl
            }).appendTo(container.find(".ds-image-container-1"));
            break;
        default:
        case 2:
        case "2":
            if (container.find(".ds-content").length <= 0){
                jQuery("<div></div>", {
                    class: "ds-content"
                }).appendTo(container);
                jQuery("<div></div>", {
                    class: "ds-image-container-2",
                    style: "width:100%; height:100%; overflow:hidden;"
                }).prependTo(container.find(".ds-content"));
            } else if (container.find(".ds-image-container-2").length <= 0){
                jQuery("<div></div>", {
                    class: "ds-image-container-2",
                    style: "width:100%; height:100%; overflow:hidden;"
                }).prependTo(container.find(".ds-content"));
            } else {
                if (container.find(".ds-image-container-2").length > 0){
                    container.find(".bgimage").remove();
                } 
            }
            jQuery("<div></div>", {
                class: "bgimage"
            }).appendTo(container.find(".ds-image-container-2"));
            jQuery("<img>", {
                onLoad: "updateSize(this)",
                src: imageUrl
            }).appendTo(container.find(".bgimage"));
            break;
        case 3:
        case "3":
            if (container.find(".ds-content").length <= 0){
                jQuery("<div></div>", {
                    class: "ds-content ds-image-container-3 image-box landscape-to-quad"
                }).appendTo(container);
            } else {
                container.find(".ds-content").addClass("ds-image-container-3 image-box landscape-to-quad");
            }
            jQuery("<div></div>", {
                class: "image-box-image"
            }).appendTo(container.find(".ds-image-container-3"));
            jQuery("<img>", {
                src: imageUrl
            }).appendTo(container.find(".image-box-image"));
            break;
    }
    getSize();
    container.deselectContainer();
    container.selectContainer();
};
jQuery.fn.handleNewWebContainer = function(targetLink, createNewContainer, isPiP){
    var trigger = jQuery(this);
    if (targetLink === null || targetLink === undefined ||
            targetLink.length === 0 || targetLink === "" || targetLink === "http://"){
        return;
    }
    if (targetLink.indexOf("http") < 0){
        targetLink = "http://" + targetLink;
    }
    if (trigger.length > 0){
        trigger.createWebContainer(targetLink, isPiP);
        return;
    }
    if (!createNewContainer === true){
        if (jQuery.settings.selectedContainerId === null ||
                jQuery.settings.selectedContainerId === undefined){
        } else {
            jQuery("#" + jQuery.settings.selectedContainerId)
                    .createWebContainer(targetLink, isPiP);
        }
    } else {
        jQuery.fn.createContainer2(jQuery.fn.getNextFreeContainerId())
                    .createWebContainer(targetLink, isPiP);
    }
};
jQuery.fn.createWebContainer = function(websiteUrl, isPiP){
    var container = jQuery(this);
    if (container === null || container === undefined || container.length <= 0){
        return;
    }
    if (container.find(".ds-content").length > 0){
        container.find(".ds-content").remove();
    }
    if (container.find(".ds-content").length <= 0){
        if (container.find(".ds-content-padding").length > 0){
            jQuery("<div></div>", {
                class: "ds-content"
            }).appendTo(container.find(".ds-content-padding"));
        } else if (container.find(".ds-content-freemove").length > 0){
            jQuery("<div></div>", {
                class: "ds-content"
            }).appendTo(container.find(".ds-content-freemove"));   
        } else {
            jQuery("<div></div>", {
                class: "ds-content"
            }).appendTo(container);
        }
        jQuery("<div></div>", {
            class: "ds-web-container-1",
            style: "width:100%; height:100%; overflow:hidden;"
        }).appendTo(container.find(".ds-content"));
        
    } else if (container.find(".ds-web-container-1").length <= 0){
        jQuery("<div></div>", {
            class: "ds-web-container-1",
            style: "width:100%; height:100%; overflow:hidden;"
        }).appendTo(container.find(".ds-content"));
        
    } else {
        if (container.find(".ds-web-container-1").length > 0){
            container.find("embed").remove();
        } 
    }
    if (isPiP){
        container.find(".ds-web-container-1").addClass("ds-web-container-pip");
    } else {
        container.find(".ds-web-container-1").removeClass("ds-web-container-pip");
    }
    container.handleDragOverlay(true);
    jQuery("<embed></embed>", {
        style: "width: 100%; height:100%; float:none; clear:both;",
        src: websiteUrl
    }).appendTo(container.find(".ds-web-container-1"));
    container.deselectContainer();
    container.selectContainer();
};
jQuery.fn.handleNewVidContainer = function(targetLink, createNewContainer){
    var trigger = jQuery(this);
    var processedLink = null;
    if (targetLink === null || targetLink === undefined ||
                targetLink.length === 0){
            return;
        }
    var useVidContainerVersion = 1;
    var processedLink = new Array();
    if (typeof(targetLink) === "object"){
        targetLink = jQuery.grep(targetLink, function(entry){
            return (entry.length > 0 && entry !== "" && entry !== "http://");
        });
        if (targetLink.length === 0){
            return;
        }
        if (!isFileUrl(targetLink[0])){
            useVidContainerVersion = 1;
            processedLink.push(jQuery.fn.modifyVideoLink(targetLink[0]));
        } else {
            useVidContainerVersion = 2;
            processedLink = targetLink;
        }
    } else if (typeof(targetLink) === "string"){
        alert("[handleNewVidContainer] Parameter of type STRING, should no longer happen.");
        processedLink.push(jQuery.fn.modifyVideoLink(targetLink));
        if (isFileUrl(targetLink)){
            useVidContainerVersion = 2;
        }
    } else {
        return;
    }
    if (trigger.length > 0){
        trigger.createVidContainer(processedLink, useVidContainerVersion);
        return;
    }
    if (!createNewContainer === true){
        if (jQuery.settings.selectedContainerId === null ||
                jQuery.settings.selectedContainerId === undefined){
        } else {
            jQuery("#" + jQuery.settings.selectedContainerId)
                    .createVidContainer(processedLink, useVidContainerVersion);
        }
    } else {
        jQuery.fn.createContainer2(jQuery.fn.getNextFreeContainerId())
                .createVidContainer(processedLink, useVidContainerVersion);
    }
};
jQuery.fn.createVidContainer = function(videoUrl, containerType){
    var container = jQuery(this);
    if (container === null || container === undefined || container.length <= 0){
        return;
    }
    if (container.find(".ds-content").length > 0){
        container.find(".ds-content").remove();
    }
    switch (containerType){
        default:
        case 1:
            if (container.find(".ds-content").length <= 0){
                if (container.find(".ds-content-padding").length > 0){
                    jQuery("<div></div>", {
                        class: "ds-content"
                    }).appendTo(container.find(".ds-content-padding"));
                } else if (container.find(".ds-content-freemove").length > 0){
                    jQuery("<div></div>", {
                        class: "ds-content"
                    }).appendTo(container.find(".ds-content-freemove"));   
                } else {
                    jQuery("<div></div>", {
                        class: "ds-content"
                    }).appendTo(container);
                }
                jQuery("<div></div>", {
                    class: "ds-vid-container-1",
                    style: "width:100%; height:100%; overflow:hidden;"
                }).appendTo(container.find(".ds-content"));
            } else if (container.find(".ds-vid-container-1").length <= 0){
                jQuery("<div></div>", {
                    class: "ds-vid-container-1",
                    style: "width:100%; height:100%; overflow:hidden;"
                }).appendTo(container.find(".ds-content"));
            } else {
                if (container.find(".ds-vid-container-1").length > 0){
                    container.find("embed").remove();
                } 
            }
            container.handleDragOverlay(true);
            jQuery("<embed></embed>", {
                style: "width: 100%; height:100%; float:none; clear:both;",
                src: videoUrl[0]
            }).appendTo(container.find(".ds-vid-container-1"));
            break;
        case 2:
            if (container.find(".ds-content").length <= 0){
                if (container.find(".ds-content-padding").length > 0){
                    jQuery("<div></div>", {
                        class: "ds-content"
                    }).appendTo(container.find(".ds-content-padding"));
                } else if (container.find(".ds-content-freemove").length > 0){
                    jQuery("<div></div>", {
                        class: "ds-content"
                    }).appendTo(container.find(".ds-content-freemove"));   
                } else {
                    jQuery("<div></div>", {
                        class: "ds-content"
                    }).appendTo(container);
                }
                jQuery("<div></div>", {
                    class: "ds-vid-container-2",
                    style: "width:100%; height:100%; overflow:hidden;"
                }).appendTo(container.find(".ds-content"));
            } else if (container.find(".ds-vid-container-2").length <= 0){
                jQuery("<div></div>", {
                    class: "ds-vid-container-2",
                    style: "width:100%; height:100%; overflow:hidden;"
                }).appendTo(container.find(".ds-content"));
            } else {
                if (container.find(".ds-vid-container-2").length > 0){
                    container.find("embed").remove();
                } 
            }
            container.handleDragOverlay(true);
            jQuery("<video></video>", {
                style: "width: 100%; height:100%;",
                controls: "1"
            }).appendTo(container.find(".ds-vid-container-2"));
            var i=0;
            for (i=0; i < videoUrl.length; i++){
                if (videoUrl[i].length === 0 || videoUrl[i] === "" || videoUrl[i] === "http://"){
                } else {
                    jQuery("<source>", {
                        type: getFileTypeString(videoUrl[i]),
                        src: videoUrl[i]
                    }).appendTo(container.find("video"));
                }
            }
            jQuery("<p></p>", {
                    text: "Video-Tag not supported"
                }).appendTo(container.find("video"));
            break;
    }
    container.deselectContainer();
    container.selectContainer();
};
jQuery.fn.handleNewTextContainer = function(numberOfColumns, createNewContainer){
    var trigger = jQuery(this);
    if (trigger.length > 0){
        trigger.createTextContainer(numberOfColumns);
        return;
    }
    if (!createNewContainer === true){
        if (jQuery.settings.selectedContainerId === jQuery.fn.getDefaultContainerName() + "0"){
            return;
        }
        if (jQuery.settings.selectedContainerId === null ||
                jQuery.settings.selectedContainerId === undefined){
        } else {
            jQuery("#" + jQuery.settings.selectedContainerId)
                    .createTextContainer(numberOfColumns);
        }
    } else {
        jQuery.fn.createContainer2(jQuery.fn.getNextFreeContainerId())
                .createTextContainer(numberOfColumns);
    }
};
jQuery.fn.createTextContainer = function(numberOfColumns){
    var container = jQuery(this);
    var backgroundColor = null;
    if (container === null || container === undefined || container.length <= 0){
        return;
    }
    container.find(".ds-vid-container-1").remove();
    container.find(".ds-vid-container-2").remove();
    container.find(".ds-web-container-1").remove();
    container.find(".ds-html-container-1").remove();
    container.find(".ds-menu-container-1").remove();
    container.find(".ds-slideshow-container-1").remove();
    container.find(".ds-delete-this").remove();
    if (container.find(".ds-content").length <= 0){
        jQuery("<div></div>", {
            class: "ds-content"
        }).appendTo(container);
        jQuery("<div></div>", {
            class: "ds-text-container-1",
            style: "width:100%; position:absolute; top:0; left:0;"
        }).appendTo(container.find(".ds-content"));
    } else if (container.find(".ds-text-container-1").length <= 0){
        backgroundColor = container.find(".ds-content").css("background-color");
        jQuery("<div></div>", {
            class: "ds-text-container-1",
            style: "width:100%; position:absolute; top:0; left:0;"
        }).appendTo(container.find(".ds-content"));
    } else {
        backgroundColor = container.find(".ds-content").css("background-color");
        if (container.find(".ds-text-container-1").length > 0){
            container.find(".ds-text-container-1").remove();
            jQuery("<div></div>", {
                class: "ds-text-container-1",
                style: "width:100%; position:absolute; top:0; left:0;"
            }).appendTo(container.find(".ds-content"));
        } 
    }
    container.createTextBodyDefault();
    if (backgroundColor !== null && backgroundColor !== undefined &&
            backgroundColor !== ""){
        container.find(".ds-content").css("background-color", backgroundColor);
    }
    container.deselectContainer();
    container.selectContainer();
};
jQuery.fn.handleNewHtmlContainer = function(createNewContainer){
    var trigger = jQuery(this);
    if (trigger.length > 0){
        trigger.createHtmlContainer();
        return;
    }
    if (!createNewContainer === true){
        if (jQuery.settings.selectedContainerId === jQuery.fn.getDefaultContainerName() + "0"){
            return;
        }
        if (jQuery.settings.selectedContainerId === null ||
                jQuery.settings.selectedContainerId === undefined){
        } else {
            jQuery("#" + jQuery.settings.selectedContainerId)
                    .createHtmlContainer();
        }
    } else {
        jQuery.fn.createContainer2(jQuery.fn.getNextFreeContainerId())
                .createHtmlContainer();
    }
};
jQuery.fn.createHtmlContainer = function(){
    var container = jQuery(this);
    if (container === null || container === undefined || container.length <= 0){
        return;
    }
    if (container.find(".ds-content").length > 0){
        container.find(".ds-content").remove();
    }
    if (container.find(".ds-content").length <= 0){
        if (container.find(".ds-content-padding").length > 0){
            jQuery("<div></div>", {
                class: "ds-content"
            }).appendTo(container.find(".ds-content-padding"));
        } else if (container.find(".ds-content-freemove").length > 0){
            jQuery("<div></div>", {
                class: "ds-content"
            }).appendTo(container.find(".ds-content-freemove"));   
        } else {
            jQuery("<div></div>", {
                class: "ds-content"
            }).appendTo(container);
        }
        jQuery("<div></div>", {
            class: "ds-html-container-1",
            style: "width:100%; position:absolute; top:0; left:0;"
        }).appendTo(container.find(".ds-content"));
    } else if (container.find(".ds-html-container-1").length <= 0){
        jQuery("<div></div>", {
            class: "ds-html-container-1",
            style: "width:100%; position:absolute; top:0; left:0;"
        }).appendTo(container.find(".ds-content"));
    } else {
        if (container.find(".ds-html-container-1").length > 0){
            container.find(".ds-html-container-1").remove();
            jQuery("<div></div>", {
                class: "ds-html-container-1",
                style: "width:100%; position:absolute; top:0; left:0;"
            }).appendTo(container.find(".ds-content"));
        } 
    }
    jQuery("<div></div>", {
        class: "ds-html-result",
        style: "width:100%; height:100%;",
        text: "[" + ds_translation.stringHtmlContainerFiller + "]"
    })
    .appendTo(container.find(".ds-html-container-1"));
    container.handleDragOverlay(true);
    container.deselectContainer();
    container.selectContainer();
};
jQuery.fn.handleNewTwitterContainer = function(createNewContainer, twitterData){
    var trigger = jQuery(this);
    if (trigger.length > 0){
        trigger.createTwitterContainer(twitterData);
        return;
    }
    if (!createNewContainer === true) {
        if (jQuery.settings.selectedContainerId === jQuery.fn.getDefaultContainerName() + "0"){
            return;
        }
        if (jQuery.settings.selectedContainerId === null ||
                jQuery.settings.selectedContainerId === undefined){
        } else {
            jQuery("#" + jQuery.settings.selectedContainerId)
                    .createTwitterContainer(twitterData);
        }
    } else {
        jQuery.fn.createContainer2(jQuery.fn.getNextFreeContainerId())
                .createTwitterContainer(twitterData);
    }
};
jQuery.fn.createTwitterContainer = function(twitterData){
    var container = jQuery(this);
    if (container === null || container === undefined || container.length <= 0){
        return;
    }
    if (container.find(".ds-content").length > 0){
        container.find(".ds-content").remove();
    }
    if (container.find(".ds-content").length <= 0){
        if (container.find(".ds-content-padding").length > 0){
            jQuery("<div></div>", {
                class: "ds-content"
            }).appendTo(container.find(".ds-content-padding"));
        } else if (container.find(".ds-content-freemove").length > 0){
            jQuery("<div></div>", {
                class: "ds-content"
            }).appendTo(container.find(".ds-content-freemove"));   
        } else {
            jQuery("<div></div>", {
                class: "ds-content"
            }).appendTo(container);
        }
        jQuery("<div></div>", {
            class: "ds-twitter-container-1",
            style: "width:100%; position:absolute; top:0; left:0;"
        }).appendTo(container.find(".ds-content"));
        
    } else if (container.find(".ds-twitter-container-1").length <= 0){
        jQuery("<div></div>", {
            class: "ds-twitter-container-1",
            style: "width:100%; position:absolute; top:0; left:0;"
        }).appendTo(container.find(".ds-content"));
    } else {
        if (container.find(".ds-twitter-container-1").length > 0){
            container.find(".ds-twitter-container-1").remove();
            jQuery("<div></div>", {
                class: "ds-twitter-container-1",
                style: "width:100%; position:absolute; top:0; left:0;"
            }).appendTo(container.find(".ds-content"));
        } 
    }
    var widgetContainer = jQuery("<div></div>", {
        class: "ds-twitter-widget-display",
        style: "width:100%; height:100%;"
    })
    .appendTo(container.find(".ds-twitter-container-1"));
    var backupContainer = jQuery("<div></div>", {
        class: "ds-twitter-widget-data",
        style: "width:100%; height:100%; display:none;",
        text: twitterData
    })
    .appendTo(container.find(".ds-twitter-container-1"));
    widgetContainer.html(twitterData);
    container.deselectContainer();
    container.selectContainer();
};
jQuery.fn.handleNewTimeContainer = function(createNewContainer){
    var trigger = jQuery(this);
    if (trigger.length > 0){
        trigger.createTimeContainer();
        return;
    }
    if (!createNewContainer === true){
        if (jQuery.settings.selectedContainerId === jQuery.fn.getDefaultContainerName() + "0"){
            return;
        }
        if (jQuery.settings.selectedContainerId === null ||
                jQuery.settings.selectedContainerId === undefined){
        } else {
            jQuery("#" + jQuery.settings.selectedContainerId)
                    .createTimeContainer();
        }
    } else {
        jQuery.fn.createContainer2(jQuery.fn.getNextFreeContainerId())
                .createTimeContainer();
    }
};
jQuery.fn.createTimeContainer = function(twitterData){
    var container = jQuery(this);
    if (container === null || container === undefined || container.length <= 0){
        return;
    }
    if (container.find(".ds-content").length > 0){
        container.find(".ds-content").remove();
    }
    if (container.find(".ds-content").length <= 0){
        jQuery("<div></div>", {
            class: "ds-content"
        }).appendTo(container);
        jQuery("<div></div>", {
            class: "ds-time-container-1",
            style: "width:100%; position:absolute; top:0; left:0;"
        }).appendTo(container.find(".ds-content"));
    } else if (container.find(".ds-twitter-container-1").length <= 0){
        jQuery("<div></div>", {
            class: "ds-time-container-1",
            style: "width:100%; position:absolute; top:0; left:0;"
        }).appendTo(container.find(".ds-content"));
    } else {
        if (container.find(".ds-time-container-1").length > 0){
            container.find(".ds-time-container-1").remove();
            jQuery("<div></div>", {
                class: "ds-time-container-1",
                style: "width:100%; position:absolute; top:0; left:0;"
            }).appendTo(container.find(".ds-content"));
        } 
    }
    container.deselectContainer();
    container.selectContainer();
};
jQuery.fn.handleNewMenuContainer = function(numberOfRows, createNewContainer){
    var trigger = jQuery(this);
    if (trigger.length > 0){
        trigger.createMenuContainer(numberOfRows);
        return;
    }
    if (!createNewContainer === true){
        if (jQuery.settings.selectedContainerId === jQuery.fn.getDefaultContainerName() + "0"){
            return;
        }
        if (jQuery.settings.selectedContainerId === null ||
                jQuery.settings.selectedContainerId === undefined){
        } else {
            jQuery("#" + jQuery.settings.selectedContainerId)
                    .createMenuContainer(numberOfRows);
        }
    } else {
        var menuSizeArray = new Array();
        menuSizeArray["width"] = "50";
        menuSizeArray["height"] = "50";
        jQuery.fn.createContainer2(jQuery.fn.getNextFreeContainerId(), null, menuSizeArray)
                .createMenuContainer(numberOfRows);
    }
};
jQuery.fn.createMenuContainer = function(numberOfRows){
    var container = jQuery(this);
    var backgroundColor = null;
    if (container === null || container === undefined || container.length <= 0){
        return;
    }
    container.find(".ds-vid-container-1").remove();
    container.find(".ds-vid-container-2").remove();
    container.find(".ds-web-container-1").remove();
    container.find(".ds-html-container-1").remove();
    container.find(".ds-text-container-1").remove();
    container.find(".ds-slideshow-container-1").remove();
    container.find(".ds-delete-this").remove();
    if (container.find(".ds-content").length <= 0){
        jQuery("<div></div>", {
            class: "ds-content"
        }).appendTo(container);
        jQuery("<div></div>", {
            class: "ds-menu-container-1",
            style: "width:100%; position:absolute; top:0; left:0;"
        }).appendTo(container.find(".ds-content"));
    } else if (container.find(".ds-menu-container-1").length <= 0){
        backgroundColor = container.find(".ds-content").css("background-color");
        jQuery("<div></div>", {
            class: "ds-menu-container-1",
            style: "width:100%; position:absolute; top:0; left:0;"
        }).appendTo(container.find(".ds-content"));
    } else {
        backgroundColor = container.find(".ds-content").css("background-color");
        if (container.find(".ds-menu-container-1").length > 0){
            container.find(".ds-menu-container-1").remove();
            jQuery("<div></div>", {
                class: "ds-menu-container-1",
                style: "width:100%; position:absolute; top:0; left:0;"
            }).appendTo(container.find(".ds-content"));
        } 
    }
    container.createMenuBodyDefault(numberOfRows);
    if (backgroundColor !== null && backgroundColor !== undefined &&
            backgroundColor !== ""){
        container.find(".ds-content").css("background-color", backgroundColor);
    }
    container.deselectContainer();
    container.selectContainer();
};
jQuery.fn.handleNewSlideshowContainer = function(dataArray, createNewContainer){
    var trigger = jQuery(this);
    if (trigger.length > 0){
        trigger.createSlideshowContainer(dataArray);
        return;
    }
    if (!createNewContainer === true){
        if (jQuery.settings.selectedContainerId === jQuery.fn.getDefaultContainerName() + "0"){
            return;
        }
        if (jQuery.settings.selectedContainerId === null ||
                jQuery.settings.selectedContainerId === undefined){
        } else {
            jQuery("#" + jQuery.settings.selectedContainerId)
                    .createSlideshowContainer(dataArray);
        }
    } else {
        jQuery.fn.createContainer2(jQuery.fn.getNextFreeContainerId(), null, null)
                .createSlideshowContainer(dataArray);
    }
};
jQuery.fn.createSlideshowContainer = function(dataArray){
    var container = jQuery(this);
    var backgroundColor = container.find(".ds-content").css("background-color");
    if (container === null || container === undefined || container.length <= 0){
        return;
    }
    container.find(".ds-content").remove();
    if (container.find(".ds-content").length <= 0){
        if (container.find(".ds-content-padding").length > 0){
            jQuery("<div></div>", {
                class: "ds-content"
            }).appendTo(container.find(".ds-content-padding"));
        } else if (container.find(".ds-content-freemove").length > 0){
            jQuery("<div></div>", {
                class: "ds-content"
            }).appendTo(container.find(".ds-content-freemove"));   
        } else {
            jQuery("<div></div>", {
                class: "ds-content"
            }).appendTo(container);
        }
        jQuery("<div></div>", {
            class: "ds-slideshow-container-1",
            style: "width:100%; position:absolute; top:0; left:0;"
        }).appendTo(container.find(".ds-content"));
    } else if (container.find(".ds-menu-container-1").length <= 0){
        jQuery("<div></div>", {
            class: "ds-slideshow-container-1",
            style: "width:100%; position:absolute; top:0; left:0;"
        }).appendTo(container.find(".ds-content"));
    } else {
        if (container.find(".ds-menu-container-1").length > 0){
            container.find(".ds-slideshow-container-1").remove();
            jQuery("<div></div>", {
                class: "ds-slideshow-container-1",
                style: "width:100%; position:absolute; top:0; left:0;"
            }).appendTo(container.find(".ds-content"));
        } 
    }
    container.prepareSlideshowContainer(dataArray);
    if (backgroundColor !== null && backgroundColor !== undefined &&
            backgroundColor !== ""){
        container.find(".ds-content").css("background-color", backgroundColor);
    }
    container.deselectContainer();
    container.selectContainer();
};
jQuery.fn.createPaddingContainer = function(targetClass){
    var trigger = jQuery(this);
    if (trigger === undefined || trigger === null || trigger.length <= 0){
        return false;
    }
    var innerContainer = trigger.find("." + targetClass);
    if (innerContainer.length <= 0){
        return false;
    }
    var outerContainer = jQuery("<div></div>", {
       class: targetClass + "-padding" 
    });
    switch (targetClass){
        default:
            innerContainer.parent().append(outerContainer);
            break;
        case "ds-content":
            innerContainer.parent().prepend(outerContainer);
            break;
    }
    outerContainer.append(innerContainer);
    return true;
};
jQuery.fn.removePaddingContainer = function(targetClass){
    var trigger = jQuery(this);
    if (trigger === undefined || trigger === null || trigger.length <= 0){
        return false;
    }
    var innerContainer = trigger.find("." + targetClass);
    if (innerContainer.length <= 0){
        return false;
    }
    var outerContainer = trigger.find("." + targetClass + "-padding");
    if (outerContainer.length <= 0){
        return true;
    }
    switch (targetClass){
        default:
            outerContainer.parent().append(innerContainer);
            break;
        case "ds-content":
            outerContainer.parent().prepend(innerContainer);
            break;
    }
    outerContainer.remove();
    return true;
};
jQuery.fn.handleContainerPadding = function(paddingWidth, targetClass){
    var trigger = jQuery(this);
    var outerContainer = null;
    var innerContainer = null;
    if (targetClass === undefined || targetClass === null ||
            targetClass === "ds-content"){
        targetClass = "ds-content";
        if (trigger.find(".ds-padding").hasClass("ds-text-container-1-padding")){
            trigger.removePaddingContainer("ds-text-container-1");
        }
        outerContainer = trigger.find("." + targetClass + "-padding");
        innerContainer = trigger.find("." + targetClass);
        if (outerContainer.length <= 0 && paddingWidth > 0){
            if (trigger.createPaddingContainer("ds-content")){
                outerContainer = trigger.find("." + targetClass + "-padding");
            } else {
                return;
            }
        }
        if (paddingWidth > 0){
            outerContainer.addClass("ds-padding");
            outerContainer.css({
                padding: paddingWidth + "%"
            });
        } else {
            trigger.removePaddingContainer(targetClass);
        }
    } else if (targetClass === "ds-text-container-1"){
        if (trigger.find(".ds-padding").hasClass("ds-content-padding")){
            trigger.removePaddingContainer("ds-content");
        }
        outerContainer = trigger.find("." + targetClass + "-padding");
        innerContainer = trigger.find("." + targetClass);
        if (outerContainer.length <= 0 && paddingWidth > 0){
            if (trigger.createPaddingContainer(targetClass)){
                outerContainer = trigger.find("." + targetClass + "-padding");
            } else {
                return;
            }
        }
        if (paddingWidth > 0){
            outerContainer.addClass("ds-padding");
            outerContainer.css({
                padding: paddingWidth + "%"
            });
        } else {
            trigger.removePaddingContainer(targetClass);
        }
    } else {
        return;
    }
};
jQuery.fn.handleContainerDuplicate = function(){
    if (formData.templateId >= 0){
        alert(ds_translation.stringUnsupportedInFixedTemplate);
        return;
    }
    var targetContainer = jQuery("#" + jQuery.settings.selectedContainerId);
    var nextId = jQuery.fn.getNextFreeContainerId();
    var sizeArray = new Array();
    sizeArray["width"] = parseFloat(targetContainer.get(0).style.width);
    sizeArray["height"] = parseFloat(targetContainer.get(0).style.height);
    jQuery.fn.deselectContainer();
    jQuery.fn.createContainer2(nextId, null, sizeArray)
            .html(targetContainer.html());
    jQuery("#" + jQuery.fn.getDefaultContainerName() + nextId).selectContainer();
};
jQuery.fn.changeContainerBgColor = function(containerId, newBgColor){
    if (containerId === undefined || containerId === null){
        return;
    }
    if (jQuery("#" + containerId).length <= 0){
        return;
    }
    if (jQuery("#" + containerId + " .ds-content").length <= 0){
        jQuery("<div></div>", {
            class: "ds-content",
            style: "width:100%; height:100%;"
        })
        .appendTo(jQuery("#" + containerId));
    } else {
        jQuery("#" + containerId + " .ds-content").css({
            width: "100%",
            height: "100%"
        });
    }
    jQuery("#" + containerId + " .ds-content")
            .css("background-color", newBgColor);
    if (containerId === jQuery.fn.getDefaultContainerName() + "0"){
        jQuery("#" + containerId + " .ds-content")
            .css("position", "absolute");
    }
};
jQuery.fn.updateDragLines = function(deactivateDragLines){
    if (deactivateDragLines){
        if (jQuery(".drag-line").length > 0){
            jQuery(".drag-line").remove();
        }
    } else {
        if (jQuery(".drag-line").length > 0){
            jQuery(".drag-line").remove();
        }
        if (jQuery.settings.useDragLines > 0){
            jQuery(".ds-container").each(function(){
                jQuery(this).generateContainerDragLines();
                jQuery(this).generateFreeMoveDragLines();
            });
        }
    }
};
jQuery.fn.generateContainerDragLines = function(color){
    var trigger = jQuery(this);
    if (color === undefined || color === null){
        color = "#0f0";
    }
    var dragLine = jQuery("<div></div>", {
            "class": "drag-line",
            style: "outline-color: " + color +
                    "; opacity: " + 0
            });
    var mainContainer = trigger.parent();
    trigger.css({borderWidth: 0});
    var top1 = trigger.position().top + 'px';
    var top2 = trigger.position().top + trigger.outerHeight() + 'px';
    var left1 = trigger.position().left + 'px';
    var left2 = trigger.position().left + trigger.outerWidth() + 'px';
    dragLine.clone().css({top: 0, left: left1, height: mainContainer.height()}).appendTo(mainContainer);
    dragLine.clone().css({top: 0, left: left2, height: mainContainer.height()}).appendTo(mainContainer);
    dragLine.clone().css({top: top1, left: 0, width: mainContainer.width()}).appendTo(mainContainer);
    dragLine.clone().css({top: top2, left: 0, width: mainContainer.width()}).appendTo(mainContainer);
    trigger.css({borderWidth: 1});
};
jQuery.fn.toggleMagneticDock = function(){
   if (jQuery("[id^=btn-editor-toggle-magnet]").is(":checked")){
        jQuery.settings.magneticDocking = 5;
        jQuery.settings.useDragLines = 1;
    } else {
        jQuery.settings.magneticDocking = 0;
        jQuery.settings.useDragLines = 0;
        jQuery.fn.updateDragLines(true);
    } 
};
jQuery.fn.toggleGrid = function(){
    if (jQuery("[id^=btn-editor-toggle-grid]").is(":checked")){
        jQuery.settings.snapToleranceX = jQuery.fn.getCellSizeX();
        jQuery.settings.snapToleranceY = jQuery.fn.getCellSizeY();
        jQuery("#workbench-area").addClass(jQuery.settings.selectedGridClass);
    } else {
        jQuery.settings.snapToleranceX = 0;
        jQuery.settings.snapToleranceY = 0;
        jQuery("#workbench-area").removeClass(jQuery.settings.selectedGridClass);
    }
};
jQuery.fn.updateWorkbenchSize = function(widthVar, heightVar){
    var workbench = jQuery("#workbench-area");
    if (widthVar === null || widthVar === undefined){
        widthVar = 800;
    }
    if (heightVar === null || heightVar === undefined){
        heightVar = 600;
    }
    workbench.width(widthVar + "px");
    workbench.height(heightVar + "px");
};
jQuery.fn.emptyWorkbench = function(justClearWorkbench){
    if (justClearWorkbench === true){
        jQuery("#workbench-area").empty();
    } else {
        jQuery("#workbench-area").empty();
        jQuery("<div></div>", {
            id: "myDSX",
            class: "ds-custom-template"
        })
        .appendTo(jQuery("#workbench-area"));
        jQuery("<div></div>", {
            id: jQuery.fn.getDefaultContainerName() + "0"
        })
        .appendTo(jQuery("#myDSX"));
        jQuery("<div></div>", {
            class: "ds-content",
            style: "width:100%; height:100%; position: absolute; background-color: rgb(255,255,255);"
        })
        .appendTo("#" + jQuery.fn.getDefaultContainerName() + "0");
    }
};
function saveSelection() {
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    } else if (document.getSelection){
        sel = document.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    }
    return null;
}
function restoreSelection(range) {
    if (range) {
        if (window.getSelection) {
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.selection && range.select) {
            range.select();
        }
    }
}
function clearSelection(){
    if (window.getSelection) {
        if (window.getSelection().empty) {  
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {
        document.selection.empty();
    }
}
jQuery.fn.addDraggable = function(){
    var trigger = jQuery(this);
    if (trigger.hasClass("ds-container-editmode")){
        return trigger;
    }
    if (trigger.hasClass("ui-draggable")){
        return trigger;
    }
    var startPosition;
    trigger.draggable({
        stack: "[id^=" + jQuery.fn.getDefaultContainerName() + "]",
        distance: 0,
        containment: "parent",
        cancel: ".ds-container-helper, .ds-prevent-drag, video",
        snap: ".ds-container, .drag-line",
        snapTolerance: jQuery.settings.magneticDocking,
        start: function(event, ui){
            startPosition = ui.position;
        },
        drag: function(event, ui){
            jQuery(this).css({borderWidth: 0});
            if (Math.abs(ui.position.left - startPosition.left) < 5){
                ui.position.left = startPosition.left;
            }
            if (Math.abs(ui.position.top - startPosition.top) < 5){
                ui.position.top = startPosition.top;
            }
            var snapToleranceX = jQuery.settings.snapToleranceX;
            var snapToleranceY = jQuery.settings.snapToleranceY;
            var topRemainder = ui.position.top % jQuery.fn.getCellSizeY();
            var leftRemainder = ui.position.left % jQuery.fn.getCellSizeX();
            if (leftRemainder <= snapToleranceX) {
                ui.position.left = ui.position.left - leftRemainder;
            }
            if (topRemainder <= snapToleranceY) {
                ui.position.top = ui.position.top - topRemainder;
            }
            if (jQuery(this).data("ui-draggable") === undefined ||
                    jQuery(this).data("ui-draggable") === null){
            } else {
                var snapCandidates = jQuery(this).data("ui-draggable").snapElements;
                var snappedToElements = jQuery.map(snapCandidates, function(element) {
                    return element.snapping ? element.item : null;
                });
                jQuery.each(snapCandidates, function(index, element){
                    if (jQuery(element.item).hasClass("drag-line")){
                        jQuery(element.item).css({opacity: 0});
                    }
                });
                if (snappedToElements.length > 0){
                    jQuery.each(snappedToElements, function(){
                        if (jQuery(this).hasClass("drag-line")){
                            jQuery(this).css("opacity", 1);
                        }
                    });
                }
            }
        },
        stop: function(event, ui){
            jQuery(this).updateDragLines();
            jQuery(this).convertPositionToPercentage();
            jQuery(this).css({borderWidth: 1});
        }
    });
    return jQuery(this);
};
jQuery.fn.removeDraggable = function(){
    if (jQuery(this).hasClass("ui-draggable")){
        jQuery(this).draggable("destroy");
    }
    return jQuery(this);
};
jQuery.fn.handleDragOverlay = function(setOverlay){
    var trigger = jQuery(this);
    if (trigger === undefined || trigger === null || trigger.length <= 0){
        return;
    }
    if (setOverlay === true){
        if (trigger.find(".ds-overlay-drag").length > 0){
            trigger.find(".ds-overlay-drag").remove();
        }
        jQuery("<div></div>", {
            class: "ds-overlay-drag disable-select ds-delete-this",
            style: "position:absolute;width:100%;top:0px;left:0px;" +
                    "background-color: rgba(50,50,50,0.8);font-size:medium;" +
                    "padding-top:6px;padding-bottom:6px;color:white;" +
                    "font-weight:bold;text-align:center;",
            text: ds_translation.stringDragOverlayText
        }).appendTo(trigger.find(".ds-content"));
    } else if (setOverlay === false){
        jQuery(".ds-overlay-drag").remove();
    }
};
jQuery.fn.addResizable = function(){
    var trigger = jQuery(this);
    if (trigger.prop("activeResizable")){
        return;
    }
    jQuery("<div/>", {
        id: 'nwgrip',
        class: 'ui-resizable-handle ui-resizable-nw'
    })
    .appendTo(trigger);
    jQuery("<div/>", {
        id: 'negrip',
        class: 'ui-resizable-handle ui-resizable-ne'
    })
    .appendTo(trigger);
    jQuery("<div/>", {
        id: 'swgrip',
        class: 'ui-resizable-handle ui-resizable-sw'
    })
    .appendTo(trigger);
    jQuery("<div/>", {
        id: 'segrip',
        class: 'ui-resizable-handle ui-resizable-se'
    })
    .appendTo(trigger);
    trigger.handleResizableProp(true);
    trigger.resizable({
        containment: 'parent',
        snap: ".ds-container, .drag-line",
        snapTolerance: 5,
        handles: {
        'nw': '#nwgrip',
        'ne': '#negrip',
        'sw': '#swgrip',
        'se': '#segrip'
        },
        create: function(event, ui){
            jQuery(this).css({borderWidth: 0});
        },
        resize: function(event, ui){
            jQuery(this).css({borderWidth: 0});
            var snapCandidates = jQuery(this).data("ui-resizable").snapElements;
            var snappedToElements = jQuery.map(snapCandidates, function(element) {
               return element.snapping ? element.item : null;
            });
            jQuery.each(snapCandidates, function(index, element){
                if (jQuery(element.item).hasClass("drag-line")){
                    jQuery(element.item).css({opacity: 0});
                }
            });
            if (snappedToElements.length > 0){
                jQuery.each(snappedToElements, function(){
                    if (jQuery(this).hasClass("drag-line")){
                        jQuery(this).css("opacity", 1);
                    }
                });
            }
        },
        start: function(event, ui){
            trigger.handleResizeOverlay(true);
        },
        stop: function(event, ui) {
            if (jQuery.settings.snapToleranceX > 0){
                var tempElem2 = jQuery(this);
                var correctedWidth = 
                        Math.max(0, tempElem2.outerWidth() - 
                        tempElem2.outerWidth() % jQuery.fn.getCellSizeX());
                var correctedHeight = 
                        Math.max(0, tempElem2.outerHeight() - 
                        tempElem2.outerHeight() % jQuery.fn.getCellSizeY());

                tempElem2.outerWidth(correctedWidth);
                tempElem2.outerHeight(correctedHeight);
            }
            jQuery(this).convertPositionToPercentage();
            jQuery(this).updateDragLines();
            jQuery(this).css({borderWidth: 1});
            myresizer();
            jQuery("#myDSX").removeAttr("style");
            trigger.handleResizeOverlay(false);
        }
    });
};
jQuery.fn.removeResizable = function(){
    var trigger = jQuery(this);
    if(trigger.prop("activeResizable")){
        jQuery("#nwgrip").remove();
        jQuery("#negrip").remove();
        jQuery("#swgrip").remove();
        jQuery("#segrip").remove();
        trigger.handleResizableProp(false);
        trigger.resizable("destroy");
    }
};
jQuery.fn.handleResizableProp = function(activeResizable){
    if (activeResizable === true){
        jQuery(this).prop("activeResizable", true);
    } else {
        jQuery(this).removeProp("activeResizable");
    }
};
jQuery.fn.handleResizeOverlay = function(setOverlay){
    var trigger = jQuery(this);
    if (setOverlay === true){
        if (trigger.find(".ds-overlay-resize").length > 0){
            trigger.find(".ds-overlay-resize").remove();
        }
        jQuery("<div></div>", {
            class: "ds-overlay-resize ds-delete-this",
            style: "position:absolute;width:100%;height:100%;top:0px;left:0px;background-color: rgba(50,50,50, 0);"
        }).appendTo(trigger.find(".ds-content"));
    } else if (setOverlay === false){
        jQuery(".ds-overlay-resize").remove();
    }
};
jQuery.fn.triggerNormalFormUpdate = function(){
    jQuery.fn.updateSaveForm(false);
    ds_programmodified |= 1;
};
jQuery.fn.triggerFullFormUpdate = function(){
    jQuery.fn.updateSaveForm(true);
};
jQuery.fn.setGlobalTemplateArray = function(newTemplateArray){
    wordPressTemplateArray = newTemplateArray;
};
jQuery.fn.setGlobalCustomTemplateArray = function(newTemplateArray){
    customTemplateArray = newTemplateArray;
};
jQuery.fn.importFixTemplate = function(templateArrayIndex, suppliedContentArray){
    if (templateArrayIndex === undefined || templateArrayIndex === null 
            || templateArrayIndex < 0 || templateArrayIndex.length === 0){
        return false;
    } else {
        if (wordPressTemplateArray.length === 0){
            return false;
        }
        if (typeof wordPressTemplateArray[templateArrayIndex] === "undefined"){
            return false;
        }
        formData.templateId = templateArrayIndex;
        formData.customTemplateId = "-1";
        formData.customTemplateName = "";
    }
    var sanitizedHtmlString = jQuery.fn.sanitizeTemplateHtmlCode(wordPressTemplateArray[templateArrayIndex]);
    jQuery("#workbench-area").html(sanitizedHtmlString);
    if (suppliedContentArray === undefined || suppliedContentArray === null 
            || suppliedContentArray.length === 0){
    } else {
        if (suppliedContentArray.length > 0){
            jQuery("[id^=" + jQuery.fn.getDefaultContainerName() + "]").each(function(){
                var index = jQuery(this).getContainerElementId();

                if (!(typeof suppliedContentArray[index] === "undefined")){
                    jQuery(this).html(jQuery.fn.sanitizeContentHtmlCode(suppliedContentArray[index]));
                    jQuery(this).addEditorSpecifics();
                }
            });
        }
    }
    jQuery.fn.setMenuCardTemplate();
    jQuery.fn.toggleCustomTemplateButtons(false);
    return true;
};
jQuery.fn.importCustomTemplate = function(templateArrayIndex, templateName, suppliedContentArray){
    if (templateArrayIndex === undefined || templateArrayIndex === null 
            || templateArrayIndex < 0 || templateArrayIndex.length === 0){
        return false;
    } else {
        if (customTemplateArray.length === 0){
            return false;
        }
        if (typeof customTemplateArray[templateArrayIndex] === "undefined"){
            return false;
        }
        formData.customTemplateId = templateArrayIndex;
        if (templateName === undefined || templateName === null){
            formData.customTemplateName = "";
        } else {
            formData.customTemplateName = templateName;
        }
        formData.templateId = "-1";
    }
    var sanitizedHtmlString = jQuery.fn.sanitizeTemplateHtmlCode(customTemplateArray[templateArrayIndex]);    
    jQuery("#workbench-area").html(sanitizedHtmlString);
    if (suppliedContentArray === undefined || suppliedContentArray === null 
            || suppliedContentArray.length === 0){
    } else {
        if (suppliedContentArray.length > 0){
            jQuery("[id^=" + jQuery.fn.getDefaultContainerName() + "]").each(function(){
                var index = jQuery(this).getContainerElementId();
                if (!(typeof suppliedContentArray[index] === "undefined")){
                    jQuery(this).html(jQuery.fn.sanitizeContentHtmlCode(suppliedContentArray[index]));
                    jQuery(this).addEditorSpecifics();
                }
            });
        }
    }
    jQuery.fn.setMenuCardTemplate();
    jQuery.fn.toggleCustomTemplateButtons(true);
    return true;
};
jQuery.fn.importCustomCode = function(templateId, templateName, htmlCode, suppliedContentArray){
    if (htmlCode === undefined || htmlCode === null || htmlCode.length === 0){
        return false;
    } else {
        if (templateId === undefined || templateId === null){
            formData.customTemplateId = "0";
        } else {
            formData.customTemplateId = templateId;
        }
        if (templateName === undefined || templateName === null){
            formData.customTemplateName = "";
        } else {
            formData.customTemplateName = templateName;
        }
        formData.templateId = "-1";
    }
    var sanitizedHtmlString = jQuery.fn.sanitizeTemplateHtmlCode(htmlCode);
    jQuery("#workbench-area").html(sanitizedHtmlString);
    if (suppliedContentArray === undefined || suppliedContentArray === null 
            || suppliedContentArray.length === 0){
    } else {
        if (suppliedContentArray.length > 0){
            jQuery("[id^=" + jQuery.fn.getDefaultContainerName() + "]").each(function(){
                var index = jQuery(this).getContainerElementId();
                if (!(typeof suppliedContentArray[index] === "undefined")){
                    jQuery(this).html(jQuery.fn.sanitizeContentHtmlCode(suppliedContentArray[index]));
                    jQuery(this).addEditorSpecifics();
                }
            });
        }
    }
    jQuery.fn.setMenuCardTemplate();
    jQuery.fn.toggleCustomTemplateButtons(true);
    return true;
};
jQuery.fn.generateContentSaveArray = function(){
    var resultArray = new Array();
    var arrayLength = jQuery("[id^=" + jQuery.fn.getDefaultContainerName() + "]").length;
    var i;
    for (i=0; i<arrayLength; i++){
        resultArray[i] = "";
    }
    jQuery(".ds-content").each(function(){
        var parentIdNumber = jQuery(this)
                .parents("[id^=" + jQuery.fn.getDefaultContainerName() + "]")
                .getContainerElementId();
        var tempElement = null;
        if (jQuery(this).parents(".ds-content-padding").length > 0){
            tempElement = jQuery(this).parents(".ds-content-padding").clone();
        } else if (jQuery(this).parents(".ds-content-freemove").length > 0){
            tempElement = jQuery(this).parents(".ds-content-freemove").clone();
            var parentSizes = new Array();
            parentSizes["width"] = parseFloat(jQuery(this).parents("[id^=" + jQuery.fn.getDefaultContainerName() + "]").css("width"));
            parentSizes["height"] = parseFloat(jQuery(this).parents("[id^=" + jQuery.fn.getDefaultContainerName() + "]").css("height"));
            tempElement.convertPositionToPercentage(true, parentSizes);
        } else {
            tempElement = jQuery(this).clone();
        }
        if (tempElement.find(".ds-html-container-1 .ds-html-dynamic-content").length > 0){
            var id = jQuery(this).closest("[id^=" + jQuery.fn.getDefaultContainerName() + "]").prop("id");
            var data = jQuery("#" + id + " .ds-html-dynamic-content").data("original-html-data");
            tempElement.find(".ds-html-container-1 .ds-html-dynamic-content").html(data);
        }
        tempElement.removeEditorSpecifics();
        if (tempElement.find(".ds-template-generic").length > 0){
        } else {
            resultArray[parentIdNumber] = tempElement[0].outerHTML;
        }
    });
    return resultArray;
};
jQuery.fn.prepareContentDataForDisplay = function(){
    var resultArray = new Array();
    jQuery("[id^=save_myDS" + formData.screenId + "E][id$=_content]").each(function(){
        var elementIndex = parseInt(
                jQuery(this).attr("id")
                .replace("save_myDS" + formData.screenId + "E", "")
                .replace("_content", "")
        , 10);
        resultArray[elementIndex] = jQuery(this).val();
    });
    jQuery("[id^=load_myDS" + formData.screenId + "E][id$=_content]").each(function(){
        var elementIndex = parseInt(
                jQuery(this).attr("id")
                .replace("load_myDS" + formData.screenId + "E", "")
                .replace("_content", "")
        , 10);
        if (typeof(resultArray[elementIndex]) === "undefined"){
            resultArray[elementIndex] = jQuery(this).val();
        }
    });
    return resultArray;
};
jQuery.fn.generateCustomTemplateData = function(){
    if (jQuery(".ds-custom-template").length > 0){
        var customTemplateData = jQuery("#workbench-area").clone();
        customTemplateData.find(".ds-container").each(function(){
            jQuery(this).html(jQuery(this).setContainerPlaceholder());
            jQuery(this).removeClass("ds-container-highlight ds-container-selected ds-container-editmode");
            jQuery(this).removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging");
            jQuery(this).removeClass("ui-resizable ui-resizable-handle ui-resizable-resizing");
            jQuery(this).convertPositionToPercentage();
        });
        customTemplateData.find("[id^=myDS][id$=E0]").html("[myDSEC0]");
        customTemplateData.find(".drag-line").remove();
        customTemplateData.find("#myDSX").
                prepend(jQuery("#include-div-1").contents().clone());
        customTemplateData.find("#myDSX").
                append(jQuery("#include-div-2").contents().clone());
        return customTemplateData.html();
    } else {
        return null;
    }
};
jQuery.fn.removeAllFormElementData = function(screenId){
};
jQuery.fn.checkForChangedValue = function(oldValue, currentValue, saveFormId, defaultValue ){
    var targetField = jQuery("#" + saveFormId);
    if (oldValue === undefined || oldValue === null){
        if (defaultValue === undefined || defaultValue === null){
            oldValue = "";
        } else {
            oldValue = defaultValue;
        }
    }
    if (oldValue.toString() !== currentValue.toString()){
        if (targetField.length === 0){
            jQuery("<input>", {
                type: "hidden",
                id: saveFormId,
                name: saveFormId,
                value: currentValue
            })
            .appendTo(jQuery("#save_myDS_form"));
        } else {
            targetField.val(currentValue);
        }
        return true;
    } else {
        if (targetField.length > 0){
            targetField.remove();
        }
        return false;
    }
};
jQuery.fn.setValueOrCreateSaveFormField = function(value, inputFieldId, defaultValue){
    var targetField = jQuery("#" + inputFieldId);
    if(value === undefined || value === null){
        if (defaultValue === undefined || defaultValue === null){
            return;
        } else {
            value = defaultValue;
        }
    }
    if (targetField.length <= 0){
        jQuery("<input>", {
            type: "hidden",
            id: inputFieldId,
            name: inputFieldId,
            value: value
        })
        .appendTo(jQuery("#save_myDS_form"));
    } else {
        if (targetField.val() !== undefined && targetField.val() !== null &&
                value === defaultValue){
            return;
        }
        targetField.val(value);
    }
};
jQuery.fn.fillContentDataFields = function(screenId, index, elementId, elementContent, elementName){
    var saveForm = jQuery("#save_myDS_form");
    if (elementId !== null && elementId !== undefined){
        if (jQuery("#save_myDS" + screenId + "E" + index + "_id").length > 0){
            jQuery("#save_myDS" + screenId + "E" + index + "_id").val(elementId);
        } else {
            jQuery("<input>", {
                type: "hidden",
                id: "save_myDS" + screenId + "E" + index + "_id",
                name: "save_myDS" + screenId + "E" + index + "_id",
                value: elementId
            })
            .appendTo(saveForm);
        } 
    }
    if (elementContent !== null && elementContent !== undefined){
        if (jQuery("#save_myDS" + screenId + "E" + index + "_content").length > 0){
            jQuery("#save_myDS" + screenId + "E" + index + "_content").val(elementContent);
        } else {
            jQuery("<input>", {
                type: "hidden",
                id: "save_myDS" + screenId + "E" + index + "_content",
                name: "save_myDS" + screenId + "E" + index + "_content",
                value: elementContent
            })
            .appendTo(saveForm);
        }
    }
    if (elementName !== null && elementName !== undefined && elementName !== ""){
        if (jQuery("#save_myDS" + screenId + "E" + index + "_name").length > 0){
            jQuery("#save_myDS" + screenId + "E" + index + "_name").val(elementName);
        } else {
            jQuery("<input>", {
                type: "hidden",
                id: "save_myDS" + screenId + "E" + index + "_name",
                name: "save_myDS" + screenId + "E" + index + "_name",
                value: elementName
            })
            .appendTo(saveForm);
        }
    }
};
jQuery.fn.updateContentRelatedFormData = function(screenId){
    var dataChanged = false;
    jQuery.each(jQuery.fn.generateContentSaveArray(), function(index, content){
        dataChanged = jQuery.fn.checkForContentUpdate(screenId, index, content);
    });
    return dataChanged;
};
jQuery.fn.checkForContentUpdate = function(screenId, index, content){
    if (content === "" || content === null || content === undefined){
        return;
    }
    var loadElementId = jQuery("#load_myDS" + screenId + "E" + index + "_id");
    var loadElementContent = jQuery("#load_myDS" + screenId + "E" + index + "_content");
    var loadElementName = jQuery("#load_myDS" + screenId + "E" + index + "_name");
    if (loadElementContent.length <= 0){
        jQuery.fn.fillContentDataFields(screenId, index, "-1", content, "");
        return true;
    }
    var elementId = "-1";
    var elementName = "";
    if (loadElementId.length > 0){
        elementId = loadElementId.val();
    }
    if (loadElementName.length > 0){
        elementName = loadElementName.val();
    }
    if (jQuery.fn.isHtmlDataIdentical(loadElementContent.val(),content)){
        jQuery.fn.fillContentDataFields(screenId, index, elementId, null, null);
        return false;
    } else {
        jQuery.fn.fillContentDataFields(screenId, index, elementId, content, elementName);
        return true;
    }
};
jQuery.fn.isHtmlDataIdentical = function(oldData, newData){
    if (oldData === undefined || oldData === null || newData === undefined || newData === null){
        return false;
    }
    return (oldData.replace(/\s+/g, " ").replace(new RegExp("> <", "g"), "><") === 
            newData.replace(/\s+/g, " ").replace(new RegExp("> <", "g"), "><"));
};
jQuery.fn.setContainerPlaceholder = function(){
    var trigger = jQuery(this);
    var id = trigger.getContainerElementId();
    return "[myDSEC" + id + "]";
};
jQuery.fn.getHtmlCodeFromLoadForm = function(screenId){
    var targetFormField = jQuery("#save_myDS" + screenId + "CustomTemplateCode");
    if (targetFormField.length <= 0){
        targetFormField = jQuery("#load_myDS" + screenId + "CustomTemplateCode");
    }
    if (targetFormField.length > 0){
        if (targetFormField.val() !== undefined && 
                targetFormField.val() !== null &&
                targetFormField.val().length > 0)
            return targetFormField.val();
    } 
    return null;
};
jQuery.fn.sanitizeTemplateHtmlCode = function(htmlCode){
    var result = htmlCode
            .replace(new RegExp("\\[myDSEC[0-9]+\\]", "g"), "")
            .replace(/&lt;/ig,'<')
            .replace(/&gt;/ig,'>')
            .replace(/&amp;/ig,'&')
            .replace(/&quot;/ig, '"')
            .replace(/<script.*?<\/script>\n/igm, "")
            .replace(/<link.*?>\n/igm, "")
            .replace(/<script[^]*?<\/script>/igm, "")
            .replace(/<link.*?>/igm, "");
    return result;
};
jQuery.fn.sanitizeContentHtmlCode = function(htmlCode){
    var result = htmlCode
            .replace(new RegExp("\\[myDSEC[0-9]+\\]", "g"), "")
            .replace(/&lt;/ig,'<')
            .replace(/&gt;/ig,'>')
            .replace(/&amp;/ig,'&')
            .replace(/&quot;/ig, '"');

    return result;
};
jQuery.fn.checkIfScreenIdExist = function(screenId, lookInSaveForm){
    var idFound = false;
    if (lookInSaveForm === true){
        jQuery("[id^=save_myDSSID]").each(function(){
            if (jQuery(this).val() === screenId){
                idFound = true;
            }
        });
    } else {
        jQuery("[id^=load_myDSSID]").each(function(){
            if (jQuery(this).val() === screenId){
                idFound = true;
            }
        });
    }
    return idFound;
};
jQuery.fn.updateSaveForm = function(useFullSave){
    var programIdLoad = jQuery("#load_myDSPID");
    jQuery.fn.setValueOrCreateSaveFormField(
            programIdLoad.val(), 
            "save_myDSPID", 
            "X");
    var programNameLoad = jQuery("#load_myDSPName");
    if (jQuery("#save_myDSPName").length <= 0){
        jQuery.fn.setValueOrCreateSaveFormField(
            programNameLoad.val(), 
            "save_myDSPName", 
            "");
    }
    var customerIdLoad = jQuery("#load_myDSCID");
    jQuery.fn.setValueOrCreateSaveFormField(
            customerIdLoad.val(), 
            "save_myDSCID", 
            "-1");
    var customerNameLoad = jQuery("#load_myDSCName");
    jQuery.fn.setValueOrCreateSaveFormField(
            customerNameLoad.val(), 
            "save_myDSCName", 
            "");
    var customerDesc1Load = jQuery("#load_myDSCDesc1");
    jQuery.fn.setValueOrCreateSaveFormField(
            customerDesc1Load.val(), 
            "save_myDSCDesc1", 
            "");
    var customerDesc2Load = jQuery("#load_myDSCDesc2");
    jQuery.fn.setValueOrCreateSaveFormField(
            customerDesc2Load.val(), 
            "save_myDSCDesc2", 
            "");
    var customerStreetLoad = jQuery("#load_myDSCStreet");
    jQuery.fn.setValueOrCreateSaveFormField(
            customerStreetLoad.val(), 
            "save_myDSCStreet", 
            "");
    var customerHNumberLoad = jQuery("#load_myDSCHNr");
    jQuery.fn.setValueOrCreateSaveFormField(
            customerHNumberLoad.val(), 
            "save_myDSCHNr", 
            "");
    var customerZipLoad = jQuery("#load_myDSCZip");
    jQuery.fn.setValueOrCreateSaveFormField(
            customerZipLoad.val(), 
            "save_myDSCZip", 
            "");
    var customerCityLoad = jQuery("#load_myDSCCity");
    jQuery.fn.setValueOrCreateSaveFormField(
            customerCityLoad.val(), 
            "save_myDSCCity", 
            "");
    var customerCountryLoad = jQuery("#load_myDSCCountry");
    jQuery.fn.setValueOrCreateSaveFormField(
            customerCountryLoad.val(), 
            "save_myDSCCountry", 
            "");
   jQuery.fn.updateSaveFormTemplateData(formData.screenId);
   if (useFullSave !== undefined && useFullSave !== null){
       if (useFullSave === true){
           jQuery.fn.cleanUpSaveForm();
       }
   }
};
jQuery.fn.updateSaveFormTemplateData = function(screenId){
    var screenRatioLoad = jQuery("#load_myDS" + screenId + "Ratio");
    jQuery.fn.checkForChangedValue(
            screenRatioLoad.val(),
            formData.screenRatio, 
            "save_myDS" + screenId + "Ratio");
    var screenFormatLoad = jQuery("#load_myDS" + screenId + "Format");
    jQuery.fn.checkForChangedValue(
            screenFormatLoad.val(),
            formData.screenFormat, 
            "save_myDS" + screenId + "Format");
    jQuery.fn.removeAllFormElementData(screenId);
    if (jQuery.fn.updateContentRelatedFormData(screenId)){
    }
    jQuery.fn.checkForChangedValue(
        0,
        jQuery("[id^=save_myDS" + screenId + "E][id$=_id]").length,
        "save_myDS" + screenId + "maxEID");
    var templateIdLoad = jQuery("#load_myDS" + screenId + "TemplateId");
    jQuery.fn.checkForChangedValue(
            templateIdLoad.val(),
            formData.templateId, 
            "save_myDS" + screenId + "TemplateId");
    var customTemplateHtmlData = jQuery.fn.generateCustomTemplateData();
    var customTemplateIdLoad = jQuery("#load_myDS" + screenId + "CustomTemplateId");
    var customTemplateNameLoad = jQuery("#load_myDS" + screenId + "CustomTemplateName");
    var customTemplateContentLoad = jQuery("#load_myDS" + screenId + "CustomTemplateCode");
    if (customTemplateHtmlData === null || customTemplateHtmlData === undefined){
        jQuery.fn.checkForChangedValue(
                customTemplateIdLoad.val(),
                "-1", 
                "save_myDS" + screenId + "CustomTemplateId");
        jQuery.fn.checkForChangedValue(
                customTemplateNameLoad.val(),
                "", 
                "save_myDS" + screenId + "CustomTemplateName");
        jQuery.fn.checkForChangedValue(
                customTemplateContentLoad.val(),
                "", 
                "save_myDS" + screenId + "CustomTemplateCode");
    } else {
        jQuery.fn.checkForChangedValue(
                customTemplateIdLoad.val(),
                formData.customTemplateId, 
                "save_myDS" + screenId + "CustomTemplateId");
        jQuery.fn.checkForChangedValue(
                customTemplateNameLoad.val(),
                formData.customTemplateName, 
                "save_myDS" + screenId + "CustomTemplateName");
        if (jQuery.fn.isHtmlDataIdentical(customTemplateContentLoad.val(), customTemplateHtmlData)){
            jQuery.fn.checkForChangedValue(
                customTemplateHtmlData,
                customTemplateHtmlData, 
                "save_myDS" + screenId + "CustomTemplateCode");
        } else {
            jQuery.fn.checkForChangedValue(
                "",
                customTemplateHtmlData, 
                "save_myDS" + screenId + "CustomTemplateCode");
        }
    }
};
jQuery.fn.displayScreen = function(screenId){
    jQuery.fn.deselectContainer();
    if (!jQuery.fn.setFormDataSettings(screenId)){
    }
    if (!jQuery.fn.setWorkbenchSettings()){
    }
};
jQuery.fn.setFormDataSettings = function(screenId){
    if (!jQuery.fn.checkIfScreenIdExist(screenId, false)){
        if (!jQuery.fn.checkIfScreenIdExist(screenId, true)){
        }
    }
    formData.templateId = "";
    formData.customTemplateId = "";
    formData.screenId = screenId;
    var screenRatio = jQuery("#save_myDS" + screenId + "Ratio");
    if (screenRatio.length <= 0){
        screenRatio = jQuery("#load_myDS" + screenId + "Ratio");
    }
    formData.screenRatio = screenRatio.val() === undefined ? 
    jQuery("[id^=load_myDS][id$=Ratio]").first().val() : screenRatio.val();
    var screenFormat = jQuery("#save_myDS" + screenId + "Format");
    if (screenFormat.length <= 0){
        screenFormat = jQuery("#load_myDS" + screenId + "Format");
    }
    formData.screenFormat = screenFormat.val() === undefined ? 
    jQuery("[id^=load_myDS][id$=Format]").first().val() : screenFormat.val();
    var templateId = jQuery("#save_myDS" + screenId + "TemplateId");
    if (templateId.length <= 0){
        templateId = jQuery("#load_myDS" + screenId + "TemplateId");
    }
    formData.templateId = templateId.val() === undefined ? "-1" : templateId.val();
    var customTemplateId = jQuery("#save_myDS" + screenId + "CustomTemplateId");
    if (customTemplateId.length <= 0){
        customTemplateId = jQuery("#load_myDS" + screenId + "CustomTemplateId");
    }
    if (customTemplateId.val() === undefined || customTemplateId.val() === null){
        if (formData.templateId < 0){
            formData.customTemplateId = "0";
        } else {
            formData.customTemplateId = "-1";
        }
    } else {
        formData.customTemplateId = customTemplateId.val();
    }
    var customTemplateName = jQuery("#save_myDS" + screenId + "CustomTemplateName");
    if (customTemplateName.length <= 0){
        customTemplateName = jQuery("#load_myDS" + screenId + "CustomTemplateName");
    }
    formData.customTemplateName = customTemplateName.val() === undefined ? "" : customTemplateName.val();
    if (formData.screenRatio === undefined || formData.screenRatio === null){
        formData.screenRatio = "1.77777777";
    }
    if (formData.screenFormat === undefined || formData.screenFormat === null){
        formData.screenFormat = "1";
    }
    return true;
};
jQuery.fn.setWorkbenchSettings = function(){
    jQuery.fn.setAspectRatioInput();
    if (jQuery.fn.checkCurrentWorkbenchFormat().toString() !== formData.screenFormat){
        if (jQuery.fn.checkCurrentWorkbenchFormat() === 1){
            jQuery("[id^=btn-format-portrait]").trigger("click");
        } else {
            jQuery("[id^=btn-format-landscape]").trigger("click");
        }
    }
    if (formData.templateId >= 0 && formData.customTemplateId >= 0){
        alert("Both templateId and customTemplateId are set. Should not happen");
        return false;
    }
    if (formData.templateId < 0 && formData.customTemplateId < 0){
        formData.customTemplateId = "0";
    }
    if (formData.templateId > 0){
        return jQuery.fn.changeDisplayedTemplate(false, formData.templateId);
    } else if (formData.customTemplateId >= 0){
        return jQuery.fn.changeDisplayedTemplate(
                true, 
                formData.customTemplateId, 
                formData.customTemplateName,
                jQuery.fn.getHtmlCodeFromLoadForm(formData.screenId)
                );
    }
    return false;
};
jQuery.fn.changeDisplayedTemplate = function(isCustomTemplate, templateId, templateName, htmlCode){  
    var loadSuccessful = null;
    jQuery.fn.deselectContainer();
    if (isCustomTemplate){
        
        if (htmlCode !== undefined && htmlCode !== null && htmlCode.length > 0){
            loadSuccessful = jQuery.fn.importCustomCode(
                    templateId, templateName, htmlCode, jQuery.fn.prepareContentDataForDisplay());
        } else if (templateId > 0){
            loadSuccessful = jQuery.fn.importCustomTemplate(
                    templateId, templateName, jQuery.fn.prepareContentDataForDisplay());
        } else if (templateId > -1){
            jQuery.fn.emptyWorkbench();
            formData.templateId = "-1";
            formData.customTemplateId = templateId;
            if (templateName === undefined || templateName === null){
                formData.customTemplateName = "";
            } else {
                formData.customTemplateName = templateName;
            }
            jQuery.fn.toggleCustomTemplateButtons(true);
            loadSuccessful = true;
        }
    } else {
        if (templateId >= 0){
            loadSuccessful = jQuery.fn.importFixTemplate(
                    templateId, jQuery.fn.prepareContentDataForDisplay());
        }
    }
    myresizer();
    if (jQuery("#" + jQuery.fn.getDefaultContainerName() + "1").length > 0 &&
            jQuery(".ds-content").length === 1){
            jQuery("#" + jQuery.fn.getDefaultContainerName() + "1").selectContainer();
    }
    jQuery.fn.updateContainerColorPreview();
    if (loadSuccessful === null){
        return false;
    } else {
        return loadSuccessful;
    }
};
jQuery.fn.deleteContainerFormEntries = function(){
    var elementId = jQuery.settings.selectedContainerId.replace(jQuery.fn.getDefaultContainerName(), "");
    var loadForm = jQuery("[id^=load_myDS" + formData.screenId + "E" + elementId + "]");
    loadForm.remove();
    var saveForm = jQuery("[id^=save_myDS" + formData.screenId + "E" + elementId + "]");
    saveForm.remove();
};
jQuery.fn.deleteContainerBgFormEntries = function(){
    var loadForm = jQuery("[id^=load_myDS" + formData.screenId + "E0]");
    loadForm.remove();
    var saveForm = jQuery("[id^=save_myDS" + formData.screenId + "E0]");
    saveForm.remove();
};
jQuery.fn.deleteAllFormFieldsOfScreenId = function(screenId, deleteLoadForm, deleteSaveForm){
    if (screenId === undefined || screenId === null || screenId.length === 0){
        return;
    }
    if (deleteLoadForm === true){
        jQuery("[id^=load_myDS" + screenId + "]").each(function(){
            var fieldId = jQuery(this).attr("id").replace("load_myDS" + screenId, "");
            if (fieldId.match(/^[A-Za-z]+/i) !== null){
                jQuery(this).remove();
            }
        });
    }
    if (deleteSaveForm === true){
        jQuery("[id^=save_myDS" + screenId + "]").each(function(){
            var fieldId = jQuery(this).attr("id").replace("save_myDS" + screenId, "");
            if (fieldId.match(/^[A-Za-z]+/i) !== null){
                jQuery(this).remove();
            }
        });
    }
};
jQuery.fn.cleanUpSaveForm = function(){
    var ssidArray = new Array();
    jQuery("[id^=save_myDSSID]").each(function(){
        ssidArray.push(jQuery(this).val());
    });
    jQuery("[id^=save_myDS]").each(function(){
        var result = jQuery(this).attr("id").replace("save_myDS", "").match(/^X?[0-9]+/i);
        if (result !== null){
            if (ssidArray.indexOf(result[0]) < 0){
                jQuery(this).remove();
            }
        }
    });
    var maxId = jQuery.fn.getMaxContainerId();
    jQuery("[id^=save_myDS" + formData.screenId + "E]").each(function(){
        var containerNumber = parseInt(jQuery(this).attr("id")
                .replace("save_myDS" + formData.screenId + "E", ""), 10);
        if (containerNumber > maxId){
            jQuery(this).remove();
        }
    });
    jQuery.fn.checkForChangedValue(
        0,
        jQuery("[id^=save_myDS" + formData.screenId + "E][id$=_id]").length,
        "save_myDS" + formData.screenId + "maxEID");
};
jQuery.fn.addEditorSpecifics = function(){
    var trigger = jQuery(this);
    if (trigger.find(".ds-image-container-2").length > 0){
            if (trigger.find(".ds-image-container-2 img").length > 0){
                trigger.find("img").attr("onload", "updateSize(this)");
            }
    }
    if (trigger.find(".ds-vid-container-1").length > 0){
        var sourceLink = trigger.find("iframe").attr("src");
        trigger.find("iframe").replaceWith(
            jQuery("<embed></embed>", {
                style: "width: 100%; height:100%; float:none; clear:both;",
                src: sourceLink
            })
        );
    }
    if (trigger.find(".ds-web-container-1").length > 0){
        var sourceLink = trigger.find("iframe").attr("src");
        trigger.find("iframe").replaceWith(
            jQuery("<embed></embed>", {
                style: "width: 100%; height:100%; float:none; clear:both;",
                src: sourceLink
            })
        );
    }
    if (trigger.find(".ds-web-container-1").length > 0 ||
            trigger.find(".ds-vid-container-1").length > 0 ||
            trigger.find(".ds-vid-container-2").length > 0){
        trigger.handleDragOverlay(true);
    }
    if (trigger.find(".ds-html-container-1").length > 0){
        trigger.handleDragOverlay(true);
        if (trigger.find(".ds-html-container-1 .ds-html-dynamic-content").length > 0){
            trigger.find(".ds-html-container-1 .ds-html-dynamic-content").data("original-html-data", 
            trigger.find(".ds-html-container-1 .ds-html-dynamic-content").html());
        }
    }
    if (trigger.find(".ds-vid-container-2").length > 0){
        trigger.find("video").prop("controls", true);
        trigger.find("video").prop("loop", false);
        trigger.find("video").prop("autoplay", false);
        trigger.find("video")[0].pause();
    }
};
jQuery.fn.removeEditorSpecifics = function(){
    var trigger = jQuery(this);
    if (trigger.find(".ds-image-container-2").length > 0){
        trigger.find(".ds-image-container-2").removeAttr("style");
        trigger.find(".bgimage").removeAttr("style");
        trigger.find("img").removeAttr("onload");
    }
    if (trigger.find(".ds-text-container-1").length > 0){
        if (trigger.find("font").length > 0){
            trigger.find("font").css("line-height", "");
        }
    }
    if (trigger.find(".ds-vid-container-1").length > 0){
        var sourceLink = trigger.find("embed").attr("src");
        trigger.find("embed").replaceWith(
            jQuery("<iframe></iframe>", {
                style: "width: 100%; height:100%; float:none; clear:both;",
                frameborder: "0",
                src: sourceLink
            }) 
        );
    }
    if (trigger.find(".ds-web-container-1").length > 0){
        var sourceLink = trigger.find("embed").attr("src");
        trigger.find("embed").replaceWith(
            jQuery("<iframe></iframe>", {
                style: "width: 100%; height:100%; float:none; clear:both;",
                frameborder: "0",
                src: sourceLink
            }) 
        );
    }
    if (trigger.find(".ds-vid-container-2").length > 0){
        trigger.find("video").prop("controls", false);
        trigger.find("video").prop("loop", true);
        trigger.find("video").prop("autoplay", true);
        trigger.find("video")[0].pause();
    }
    if (trigger.find(".ds-slideshow-container-1").length > 0){
        trigger.find(".ds-slideshow-element").each(function(){
            var element = jQuery(this);
            element.css("z-index", "");
            element.css("visibility", "");
            element.removeClass("ds-slideshow-transition-center");
            element.removeClass("ds-slideshow-transition-left");
            element.removeClass("ds-slideshow-transition-right");
            element.removeClass("ds-slideshow-transition-top");
            element.removeClass("ds-slideshow-transition-bottom");
        });
    }
    if (trigger.find(".ds-delete-this").length > 0){
        trigger.find(".ds-delete-this").remove();
    }
    if (trigger.find(".ds-helper-cluster").length > 0){
        trigger.find(".ds-helper-cluster").remove();
    }
    if (trigger.find(".ds-container-helper").length > 0){
        trigger.find(".ds-container-helper").remove();
    }
    if (trigger.hasClass("ds-freemove")){
        trigger.removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging");
        trigger.removeClass("ui-resizable ui-resizable-handle ui-resizable-resizing");
        trigger.removeClass("ds-freemove-on");
        trigger.find(".ds-freemove-handle").remove();
    }
    if (trigger.find(".ds-freemove").length > 0){
        var freemoveContainer = trigger.find(".ds-freemove");
        freemoveContainer.removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging");
        freemoveContainer.removeClass("ui-resizable ui-resizable-handle ui-resizable-resizing");
        freemoveContainer.removeClass("ds-freemove-on");
        freemoveContainer.find(".ds-freemove-handle").remove();
    }
    return trigger;
};
jQuery.fn.createTextBody = function(numberOfColumns){
    alert("OBSOLETE createTextBody");
    var parentElement = jQuery(this).find(".ds-text-container-1");
    if (parentElement === null || parentElement === undefined ||
            parentElement.length <= 0){
        return;
    }
    switch(numberOfColumns){
        default:
        case 0:
        case "0":
            break;
        case 1:
        case "1":
            parentElement.addClass("row_12_nm");
            jQuery("<div></div>", {
                contenteditable: true,
                class: "col_12_nm",
                text: "(column 1)"
            })
            .appendTo(parentElement);
            break;
        case 2:
        case "2":
            parentElement.addClass("row_12_nm");
            jQuery("<div></div>", {
                contenteditable: true,
                class: 'col_06_nm',
                text: '(column 1)'
            })
            .appendTo(parentElement);
            jQuery("<div></div>", {
                contenteditable: true,
                class: 'col_06_nm',
                text: '(column 2)'
            })
            .appendTo(parentElement);
            break;
        case 3:
        case "3":
            parentElement.addClass("row_12_nm");
            jQuery("<div></div>", {
                contenteditable: true,
                class: 'col_04_nm',
                text: '(column 1)'
            })
            .appendTo(parentElement);
    
            jQuery("<div></div>", {
                contenteditable: true,
                class: 'col_04_nm',
                text: '(column 2)'
            })
            .appendTo(parentElement);
            jQuery("<div></div>", {
                contenteditable: true,
                class: 'col_04_nm',
                text: '(column 3)'
            })
            .appendTo(parentElement);
            break;
        case 4:
        case "4":
            parentElement.addClass("row_12_nm");
            jQuery("<div></div>", {
                contenteditable: true,
                class: 'col_03_nm',
                text: '(column 1)'
            })
            .appendTo(parentElement);
            jQuery("<div></div>", {
                contenteditable: true,
                class: 'col_03_nm',
                text: '(column 2)'
            })
            .appendTo(parentElement);
            jQuery("<div></div>", {
                contenteditable: true,
                class: 'col_03_nm',
                text: '(column 3)'
            })
            .appendTo(parentElement);
            jQuery("<div></div>", {
                contenteditable: true,
                class: 'col_03_nm',
                text: '(column 4)'
            })
            .appendTo(parentElement);
            break;
    }
};
function insertHTML(htmlTag) {
    if (htmlTag === null || htmlTag === undefined){
        return;
    }
    if (jQuery.settings.selectedContainerId === null ||
            jQuery.settings.selectedContainerId === undefined){
        return;
    }
    var selection, range;
    var parentElement = null;
    if (window.getSelection && (selection = window.getSelection()).rangeCount) {
        range = selection.getRangeAt(0);
        parentElement = range.commonAncestorContainer;
        if (parentElement.nodeType !== 1){
            parentElement = parentElement.parentNode;
        }
        if (!jQuery.contains(jQuery("#" + jQuery.settings.selectedContainerId)[0], parentElement)){
            return;
        }
        var insertedElement = document.createElement(htmlTag);
        if (range.toString().length <= 0){
            insertedElement.appendChild(document.createTextNode("[" + htmlTag + "]"));
        } else {
            insertedElement.appendChild(document.createTextNode(range));
        }
        range.deleteContents();
        range.insertNode(insertedElement);
        range.setStartAfter(insertedElement);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    } else if ((selection = document.selection) && selection.type !== "Control"){
        parentElement = selection.createRange().parentElement();
    }
}
jQuery.fn.handleContainerHelperClick = function(event){
    var clickTarget = jQuery(event.target);
    if (clickTarget.hasClass("ds-column-add")){
        clickTarget.parents(".ds-text-container-1, .ds-menu-container-1").handleColumnAdd();
        event.preventDefault();
        return true;
    } else if (clickTarget.hasClass("ds-column-remove")){
        clickTarget.parents(".ds-text-container-1, .ds-menu-container-1").handleColumnRemove();
        event.preventDefault();
        return true;
    } else if (clickTarget.hasClass("ds-html-switch")){
        clickTarget.parents(".ds-html-container-1").handleSwitchHtmlView();
        event.preventDefault();
        return true;
    } else if (clickTarget.hasClass("ds-html-drop")){
        jQuery.fn.showModalEditorHtml();
        event.preventDefault();
        return true;
    } else if (clickTarget.hasClass("ds-row-add")){
        clickTarget.parents(".ds-menu-container-1").handleRowAdd();
        event.preventDefault();
        return true;
    } else if (clickTarget.hasClass("ds-row-remove")){
        clickTarget.parents(".ds-menu-container-1").handleRowRemove();
        event.preventDefault();
        return true;
    } else if (clickTarget.hasClass("ds-slideshow-start")){
        clickTarget.parents(".ds-slideshow-container-1").startSingleSlideshow();
        event.preventDefault();
        return true;
    } else if (clickTarget.hasClass("ds-slideshow-stop")){
        clickTarget.parents(".ds-slideshow-container-1").stopSingleSlideshow();
        event.preventDefault();
        return true;
    }
    return false;
};
jQuery.fn.createTextBodyDefault = function(){
    var textContainer = jQuery(this).find(".ds-text-container-1");
    if (textContainer.length <= 0){
        return;
    }
    jQuery("<div></div>", {
        contenteditable: true,
        class: "ds-text-col",
        style: "width:100%",
        text: ds_translation.stringTextColumn
    })
    .appendTo(textContainer);
};
jQuery.fn.handleTextContainerHelper = function(activateHelpers){
    var trigger = jQuery(this);
    if (activateHelpers === false){
        trigger.find(".ds-helper-cluster").remove();
    } else if (activateHelpers === true){
        trigger.find(".ds-helper-cluster").remove();
        var divContainer = jQuery("<div></div>", {
            class: "ds-helper-cluster"
        });
        jQuery("<div></div>", {
            class: "ds-container-helper ds-column-add",
            title: ds_translation.stringAddColumn
        })
        .appendTo(divContainer);
        jQuery("<div></div>", {
            class: "ds-container-helper ds-column-remove",
            title: ds_translation.stringRemoveColumn
        })
        .appendTo(divContainer);
        divContainer.appendTo(trigger);
    }
};
jQuery.fn.handleColumnAdd = function(){
    var trigger = jQuery(this);
    var numberOfColumns = null;
    if (trigger.hasClass("ds-text-container-1")){
        numberOfColumns = trigger.find(".ds-text-col").length;
        if (numberOfColumns <= 0 || numberOfColumns >= 20){
            return false;
        } else {
            return trigger.addColumnByWidth(100/(numberOfColumns+1)); 
        }
    } else if (trigger.hasClass("ds-menu-container-1")){
        numberOfColumns = trigger.find(".ds-menu-content-other").length / trigger.find(".ds-menu-content-row").length;
        if (numberOfColumns <= 0 || numberOfColumns >= 8){
            return false;
        } else {
            return trigger.addColumnByWidth(50/(numberOfColumns+1)); 
        }
    }
};
jQuery.fn.handleColumnRemove = function(){
    var trigger = jQuery(this);
    var numberOfColumns = null;
    if (trigger.hasClass("ds-text-container-1")){
        numberOfColumns = trigger.find(".ds-text-col").length;
        if (numberOfColumns <= 1){
            return false;
        } else {
            return trigger.removeColumnByWidth(100/(numberOfColumns-1)); 
        }
    } else if (trigger.hasClass("ds-menu-container-1")){
        numberOfColumns = trigger.find(".ds-menu-content-other").length / trigger.find(".ds-menu-content-row").length;
        if (numberOfColumns <= 1){
            return false;
        } else {
            return trigger.removeColumnByWidth(50/(numberOfColumns-1)); 
        }
    }
};
jQuery.fn.addColumnByWidth = function(newColWidth){
    var trigger = jQuery(this);
    if (trigger.hasClass("ds-text-container-1")){
        trigger.find(".ds-text-col").each(function(){
            jQuery(this).css("width", newColWidth + "%");
        });
        jQuery("<div></div>", {
            class: "ds-text-col",
            style: "width:" + newColWidth + "%",
            contenteditable: true,
            text: ds_translation.stringNewTextColumn
        }).appendTo(trigger);
    } else if (trigger.hasClass("ds-menu-container-1")){
        trigger.find(".ds-menu-content-other").each(function(){
            jQuery(this).css("width", newColWidth + "%");
        });
        var newColumn = jQuery("<div></div>", {
            class: "ds-menu-content-other",
            style: "width:" + newColWidth + "%;",
            contenteditable: true,
            text: ds_translation.stringPrice
        });
        trigger.find(".ds-menu-content-row").each(function(){
            newColumn.clone().appendTo(jQuery(this));
        });
    }
};
jQuery.fn.removeColumnByWidth = function(newColWidth){
    var trigger = jQuery(this);
    if (trigger.hasClass("ds-text-container-1")){
        trigger.find(".ds-text-col").each(function(){
            jQuery(this).css("width", newColWidth + "%");
        });
        trigger.find(".ds-text-col").last().remove();
    } else if (trigger.hasClass("ds-menu-container-1")){
        trigger.find(".ds-menu-content-other").each(function(){
            jQuery(this).css("width", newColWidth + "%");
        });
        trigger.find(".ds-menu-content-row").each(function(){
            jQuery(this).find(".ds-menu-content-other").last().remove();
        });
    }
};
jQuery.fn.handleHtmlContainerHelper = function(activateHelpers){
    var trigger = jQuery(this);
    if (activateHelpers === false){
        trigger.find(".ds-helper-cluster").remove();
    } else if (activateHelpers === true){
        trigger.find(".ds-helper-cluster").remove();
        var divContainer = jQuery("<div></div>", {
            class: "ds-helper-cluster"
        });
        var dropButton = jQuery("<div></div>", {
                class: "ds-container-helper ds-html-drop disable-select",
                text: ds_translation.stringEdit,
                title: ds_translation.stringEditHtmlContent
            });
        dropButton.appendTo(divContainer);
        divContainer.appendTo(trigger);
    }
};
jQuery.fn.handleMenuContainerHelper = function(activateHelpers){
    var trigger = jQuery(this).find(".ds-menu-main");
    if (activateHelpers === false){
        trigger.find(".ds-helper-cluster").remove();
    } else if (activateHelpers === true){
        trigger.find(".ds-helper-cluster").remove();
        var divContainer1 = jQuery("<div></div>", {
            class: "ds-helper-cluster"
        });
        jQuery("<div></div>", {
            class: "ds-container-helper ds-column-add",
            title: ds_translation.stringAddColumn
        })
        .appendTo(divContainer1);
        jQuery("<div></div>", {
            class: "ds-container-helper ds-column-remove",
            title: ds_translation.stringRemoveColumn
        })
        .appendTo(divContainer1);
        jQuery("<div></div>", {
            class: "ds-container-helper ds-row-remove",
            title: ds_translation.stringRemoveRow
        })
        .appendTo(divContainer2);
        jQuery("<div></div>", {
            class: "ds-container-helper ds-row-add",
            title: ds_translation.stringAddRow
        })
        .appendTo(divContainer2);
        var divContainer2 = jQuery("<div></div>", {
            class: "ds-helper-cluster ds-helper-cluster-bottom"
        });
        jQuery("<div></div>", {
            class: "ds-container-helper ds-row-remove",
            title: ds_translation.stringRemoveRow
        })
        .appendTo(divContainer2);
        jQuery("<div></div>", {
            class: "ds-container-helper ds-row-add",
            title: ds_translation.stringAddRow
        })
        .appendTo(divContainer2);
        divContainer1.appendTo(trigger);
        divContainer2.appendTo(trigger);
    }
};
jQuery.fn.createMenuBodyDefault = function(numberOfRows){
    var menuContainer = jQuery(this).find(".ds-menu-container-1");
    if (menuContainer.length <= 0){
        return;
    }
    jQuery("<div></div>", {
        class: "ds-menu-header",
        contenteditable: true,
        text: ds_translation.stringHeader
    })
    .appendTo(menuContainer);
    var menuMain = jQuery("<div></div>", {
        class: "ds-menu-main"
    });
    menuMain.appendTo(menuContainer);
    jQuery("<div></div>", {
        contenteditable: true,
        class: "ds-menu-footer",
        text: ds_translation.stringFooter
    })
    .appendTo(menuContainer);
    var contentRow = jQuery("<div></div>", {
        class: "ds-menu-content-row"
    });
    jQuery("<div></div>", {
        contenteditable: true,
        class: "ds-menu-content-main",
        text: ds_translation.stringMenu
    }).appendTo(contentRow);
    jQuery("<div></div>", {
        contenteditable: true,
        class: "ds-menu-content-other",
        text: ds_translation.stringPrice
    }).appendTo(contentRow);
    contentRow.appendTo(menuMain);
    if (numberOfRows === undefined || numberOfRows === null ||
            numberOfRows <= 1){
        return;
    } else {
        var i=0;
        for (i=0; i < (numberOfRows - 1); i++){
            menuContainer.handleRowAdd();
        }
    }
};
jQuery.fn.handleRowAdd = function(){
    var trigger = jQuery(this);
    var numberOfRows = trigger.find(".ds-menu-content-row").length;
    if (numberOfRows <= 0 || numberOfRows >= 40){
        return false;
    } else {
        return trigger.addRowByHeight(100/(numberOfRows+1)); 
    }
};
jQuery.fn.handleRowRemove = function(){
    var trigger = jQuery(this);
    var numberOfRows = trigger.find(".ds-menu-content-row").length;
    if (numberOfRows <= 1){
        return false;
    } else {
        return trigger.removeRowByHeight(100/(numberOfRows-1)); 
    }
};
jQuery.fn.addRowByHeight = function(newRowHeight){
    var trigger = jQuery(this).find(".ds-menu-main");
    trigger.find(".ds-menu-content-row").each(function(){
        jQuery(this).css("height", newRowHeight + "%");
    });
    var clonedRow = jQuery(".ds-menu-content-row").last().clone();
    clonedRow.find(".ds-menu-content-main").text(ds_translation.stringMenu);
    clonedRow.find(".ds-menu-content-other").text(ds_translation.stringPrice);
    clonedRow.appendTo(trigger);
};
jQuery.fn.removeRowByHeight = function(newRowHeight){
    var trigger = jQuery(this).find(".ds-menu-main");
    trigger.find(".ds-menu-content-row").each(function(){
        jQuery(this).css("height", newRowHeight + "%");
    });
    trigger.find(".ds-menu-content-row").last().remove();
};
jQuery.fn.showModalContainerWeb = function(createNewContainer){
    var currentUrl = "http://";
    jQuery("#ds-playlist-selector").val("empty");
    jQuery("#ds_web_playlist_selected").addClass("ds_display_none");
    if (createNewContainer === true){
        jQuery("#ds-editor-modal-web-input-1").val(currentUrl);
        jQuery("#ds-editor-modal-web").addClass("ds-container-create-new");
        jQuery("#ds-editor-modal-web").modal("show");
        return;
    } else {
        jQuery("#ds-editor-modal-web").removeClass("ds-container-create-new");
    }
    if (jQuery.settings.selectedContainerId === jQuery.fn.getDefaultContainerName() + "0"){
        return;
    }
    if (jQuery("#" + jQuery.settings.selectedContainerId + " .ds-web-container-1").length > 0 &&
        jQuery("#" + jQuery.settings.selectedContainerId + " embed").attr("src").length > 0){
        currentUrl = jQuery("#" + jQuery.settings.selectedContainerId + " embed").attr("src");
    }
    if (jQuery("#" + jQuery.settings.selectedContainerId + " .ds-web-container-1").hasClass("ds-web-container-pip")){
        jQuery("#ds-editor-modal-web-input-1").val("");
        jQuery("#ds_generated_playlist_url").val(currentUrl);
        var firstIndex = currentUrl.indexOf("program=") + 8;
        var playlistId=currentUrl.substring(firstIndex);
        if (jQuery("#ds-playlist-selector option[value='" + playlistId + "']").length){
            jQuery("#ds-playlist-selector").val(playlistId);
            jQuery("#ds_web_playlist_selected").removeClass("ds_display_none");
        } else {
            jQuery("#ds-playlist-selector").val("empty");
            jQuery("#ds_web_playlist_selected").addClass("ds_display_none");
        }
    } else {
    jQuery("#ds-editor-modal-web-input-1").val(currentUrl);
        jQuery("#ds_generated_playlist_url").val("");
        jQuery("#ds_web_playlist_selected").addClass("ds_display_none");
    }
    jQuery("#ds-editor-modal-web").modal("show");
};
jQuery.fn.showModalContainerVid = function(createNewContainer){
    jQuery.fn.handleHiddenVidInput(1, false);
    jQuery.fn.handleHiddenVidInput(2, false);
    var currentUrl1 = "http://";
    jQuery("#ds-editor-modal-vid-input-1").val(currentUrl1);
    jQuery("#ds-editor-modal-vid-input-2").val(currentUrl1);
    jQuery("#ds-editor-modal-vid-input-3").val(currentUrl1);
    if (createNewContainer === true){
        jQuery("#ds-editor-modal-vid").addClass("ds-container-create-new");
        jQuery("#ds-editor-modal-vid").modal("show");
        return;
    } else {
        jQuery("#ds-editor-modal-vid").removeClass("ds-container-create-new");
    }
    if (jQuery.settings.selectedContainerId === jQuery.fn.getDefaultContainerName() + "0"){
        return;
    }
    if (jQuery("#" + jQuery.settings.selectedContainerId + " .ds-vid-container-1").length > 0 &&
        jQuery("#" + jQuery.settings.selectedContainerId + " embed").attr("src").length > 0){
        currentUrl1 = jQuery("#" + jQuery.settings.selectedContainerId + " embed").attr("src");
    } else if (jQuery("#" + jQuery.settings.selectedContainerId + " .ds-vid-container-2").length > 0){
        var numberOfSources = jQuery("#" + jQuery.settings.selectedContainerId + " source").length;
        var currentUrl2 = null;
        var currentUrl3 = null;
        switch (numberOfSources){
            default:
            case 0:
                jQuery("#ds-editor-modal-vid-input-1").val(currentUrl1);
                jQuery("#ds-editor-modal-vid-input-2").val(currentUrl1);
                jQuery("#ds-editor-modal-vid-input-3").val(currentUrl1);
                break;
            case 1:
                currentUrl1 = jQuery("#" + jQuery.settings.selectedContainerId + " source")
                        .attr("src");
                jQuery("#ds-editor-modal-vid-input-1").val(currentUrl1);
                jQuery.fn.handleHiddenVidInput(1, true);
                break;
            case 2:
                currentUrl1 = jQuery("#" + jQuery.settings.selectedContainerId + " source")
                        .eq(0).attr("src");
                currentUrl2 = jQuery("#" + jQuery.settings.selectedContainerId + " source")
                        .eq(1).attr("src");
                jQuery("#ds-editor-modal-vid-input-1").val(currentUrl1);
                jQuery("#ds-editor-modal-vid-input-2").val(currentUrl2);
                jQuery.fn.handleHiddenVidInput(1, true);
                jQuery.fn.handleHiddenVidInput(2, true);
                break;
            case 3:
                currentUrl1 = jQuery("#" + jQuery.settings.selectedContainerId + " source")
                        .eq(0).attr("src");
                currentUrl2 = jQuery("#" + jQuery.settings.selectedContainerId + " source")
                        .eq(1).attr("src");
                currentUrl3 = jQuery("#" + jQuery.settings.selectedContainerId + " source")
                        .eq(2).attr("src");
                jQuery("#ds-editor-modal-vid-input-1").val(currentUrl1);
                jQuery("#ds-editor-modal-vid-input-2").val(currentUrl2);
                jQuery("#ds-editor-modal-vid-input-3").val(currentUrl3);
                jQuery.fn.handleHiddenVidInput(1, true);
                jQuery.fn.handleHiddenVidInput(2, true);
                break;
        }
    }
    jQuery("#ds-editor-modal-vid-input-1").val(currentUrl1);
    jQuery("#ds-editor-modal-vid").modal("show");
};
jQuery.fn.showModalEditorHtml = function(){
    var currentData;
    var target = jQuery("#" + jQuery.settings.selectedContainerId + " .ds-html-dynamic-content");
    if (target.length > 0 && target.data("original-html-data") !== undefined){
        currentData = target.data("original-html-data");
    } else {
        currentData = jQuery("#" + jQuery.settings.selectedContainerId + " .ds-html-result").html();
    }
    jQuery("#ds-editor-modal-html-textarea-1").val(currentData);
    jQuery("#ds-editor-modal-html").modal("show");
};
jQuery.fn.showModalPadding = function(){
    if (jQuery("#" + jQuery.settings.selectedContainerId)
            .find(".ds-text-container-1").length > 0){
        jQuery.fn.handleHiddenPaddingInput(1, true);
        jQuery("#ds-input-padding-target-text-1").prop("checked", true);
    } else {
        jQuery.fn.handleHiddenPaddingInput(1, false);
        jQuery("#ds-input-padding-target-container").prop("checked", true);
    }
    var currentValue = "";
    var outerPaddingContainer = jQuery("#" + jQuery.settings.selectedContainerId)
            .find(".ds-padding");
    if (outerPaddingContainer.length > 0){
        var tempValue = parseFloat(outerPaddingContainer.get(0).style.padding);
        if (!isNaN(tempValue)){
            currentValue = tempValue;
        }
    }
    jQuery("#ds-editor-modal-padding-input-1").val(currentValue);
    jQuery("#ds-editor-modal-padding").modal("show");
};
jQuery.fn.showModalContainerSlideshow = function(createNewContainer){
    jQuery("#ds-modal-slideshow-table tbody tr:not(:first)").remove();
    jQuery("#ds-editor-modal-slideshow [class^=modal-slideshow-transition-]").removeClass("modal-slideshow-radiogroup-selected");
    jQuery("#ds-editor-modal-slideshow .modal-slideshow-url").val("http://");
    jQuery("#ds-editor-modal-slideshow .modal-slideshow-duration").val("10");
    jQuery("#ds-editor-modal-slideshow .modal-slideshow-radiogroup input:checked").prop("checked", false);
    jQuery("#ds-editor-modal-slideshow .modal-slideshow-radiogroup label").removeClass("modal-slideshow-radiogroup-selected");
    jQuery("#ds-editor-modal-slideshow .modal-slideshow-radiogroup input:first").prop("checked", true);
    jQuery("#ds-editor-modal-slideshow .modal-slideshow-radiogroup label:first").addClass("modal-slideshow-radiogroup-selected");
    if (createNewContainer === true){
        jQuery("#ds-editor-modal-slideshow").addClass("ds-container-create-new");
        jQuery("#ds-editor-modal-slideshow").modal("show");
        return;
    } else {
        jQuery("#ds-editor-modal-slideshow").removeClass("ds-container-create-new");
    }
    if (jQuery.settings.selectedContainerId === jQuery.fn.getDefaultContainerName() + "0"){
        return;
    }
    if (jQuery("#" + jQuery.settings.selectedContainerId + " .ds-slideshow-container-1").length > 0){
        var slideshowContainer = jQuery("#" + jQuery.settings.selectedContainerId + " .ds-slideshow-container-1");
        var numberOfEntries = slideshowContainer.find(".ds-slideshow-element").length;
        var currentElement = slideshowContainer.find(".ds-slideshow-element-0");
        var currentRow = null;
        var transition = null;
        var index;
        for (index=1; index <= numberOfEntries; index++){
            currentElement = slideshowContainer.find(".ds-slideshow-element-" + index);
            if (index === 1){
                currentRow = jQuery("#ds-modal-slideshow-table .ds-modal-slideshow-row").last();
                currentRow.find(".modal-slideshow-title").text("Image #" + index);
                currentRow.find(".modal-slideshow-url").val(currentElement.find("img").prop("src"));
                currentRow.find(".modal-slideshow-duration").val(currentElement.find(".ds-slideshow-data-duration").val());
                transition = currentElement.find(".ds-slideshow-data-transition").val();
                currentRow.find(".modal-slideshow-radiogroup [value=" + transition + "]").prop("checked", true);
                currentRow.find(".modal-slideshow-radiogroup label").removeClass("modal-slideshow-radiogroup-selected");
                currentRow.find(".modal-slideshow-radiogroup [value=" + transition + "]").parent().addClass("modal-slideshow-radiogroup-selected");
            } else {
                currentRow = jQuery("#ds-modal-slideshow-table .ds-modal-slideshow-row").last().clone();
                currentRow.find(".modal-slideshow-title").text("Image #" + index);
                currentRow.find(".modal-slideshow-url").val(currentElement.find("img").prop("src"));
                currentRow.find(".modal-slideshow-duration").val(currentElement.find(".ds-slideshow-data-duration").val());
                transition = currentElement.find(".ds-slideshow-data-transition").val();
                currentRow.find(".modal-slideshow-radiogroup [value=" + transition + "]").prop("checked", true);
                currentRow.find(".modal-slideshow-radiogroup [class^=modal-slideshow-transition-]").removeClass("modal-slideshow-radiogroup-selected");
                currentRow.find(".modal-slideshow-radiogroup [value=" + transition + "]").parent().addClass("modal-slideshow-radiogroup-selected");
                jQuery("#ds-modal-slideshow-table tbody tr:nth-last-child(1)").after(currentRow);
            }
        }
    }
    jQuery("#ds-editor-modal-slideshow").modal("show");
};
function handleModalWebTrigger(buttonId){
    switch (buttonId){
        default:
            break;
        case 0:
            break;
        case 1:
            var enteredUrl = jQuery("#ds-editor-modal-web-input-1").val();
            var generatedPlaylistUrl = jQuery("#ds_generated_playlist_url").val();
            var createNew = jQuery("#ds-editor-modal-web").hasClass("ds-container-create-new");
            if (generatedPlaylistUrl && generatedPlaylistUrl.length > 1){
                jQuery.fn.handleNewWebContainer(generatedPlaylistUrl, createNew, true);
            } else {
                jQuery.fn.handleNewWebContainer(enteredUrl, createNew, false);
            }
            jQuery("#ds-editor-modal-web-input-1").val("");
            break;
    }
};
function handleModalVidTrigger(buttonId){
    switch (buttonId){
        default:
            break;
        case 0:
            break;
        case 1:
            var urlArray = new Array();
            urlArray.push(jQuery("#ds-editor-modal-vid-input-1").val());
            urlArray.push(jQuery("#ds-editor-modal-vid-input-2").val());
            urlArray.push(jQuery("#ds-editor-modal-vid-input-3").val());
            var createNew = jQuery("#ds-editor-modal-vid").hasClass("ds-container-create-new");
            jQuery.fn.handleNewVidContainer(urlArray, createNew);
            jQuery("#ds-editor-modal-vid-input-1").val("");
            jQuery("#ds-editor-modal-vid-input-2").val("");
            jQuery("#ds-editor-modal-vid-input-3").val("");
            break;
    }
};
function handleModalHtmlTrigger(buttonId){
    switch (buttonId){
        default:
            break;
        case 0:
            break;
        case 1:
            var enteredData = jQuery("#ds-editor-modal-html-textarea-1").val();
            jQuery("#" + jQuery.settings.selectedContainerId +
                    " .ds-html-result").html(enteredData);
            var isDynamicContent = true;
            if (isDynamicContent === true){
                var target = jQuery("#" + jQuery.settings.selectedContainerId + " .ds-html-result");
                target.addClass("ds-html-dynamic-content");
                target.data("original-html-data", enteredData);
            } else {
                var target = jQuery("#" + jQuery.settings.selectedContainerId + " .ds-html-result");
                target.removeClass("ds-html-dynamic-content");
                target.removeData("original-html-data");
            }
            break;
    }
};
function handleModalPaddingTrigger(buttonId){
    switch (buttonId){
        default:
            break;
        case 0:
            break;
        case 1:
            var paddingWidth = jQuery("#ds-editor-modal-padding-input-1").val();
            var paddingTarget = jQuery("[name=paddingTarget]:checked").val();
            if (paddingTarget === null || paddingTarget === undefined){
                paddingTarget = "ds-content";
            }
            if (!isNaN(paddingWidth) && paddingWidth.length > 0){
                jQuery("#" + jQuery.settings.selectedContainerId)
                    .handleContainerPadding(paddingWidth, paddingTarget);
            }
            jQuery("#ds-editor-modal-padding-input-1").val("cleared");
            break;
    }
};
function handleModalSlideshowTrigger(buttonId){
    switch (buttonId){
        default:
            break;
        case 0:
            break;
        case 1:
            var createNew = jQuery("#ds-editor-modal-slideshow").hasClass("ds-container-create-new");
            var dataArray = new Array();
            jQuery(".ds-modal-slideshow-row").each(function(){
                var slideshowObject = new Object();
                var imageUrl = jQuery(this).find(".modal-slideshow-url").val();
                var displayDuration = jQuery(this).find(".modal-slideshow-duration").val();
                var transitionInt = jQuery(this).find("input[type='radio']:checked").val();
                if (imageUrl === null || imageUrl === undefined || imageUrl.length === 0 ||
                        imageUrl === "http://"){
                    slideshowObject.url = null;
                } else {
                    slideshowObject.url = imageUrl;
                }
                if (displayDuration === null || displayDuration === undefined || displayDuration.length === 0){
                    slideshowObject.duration = "10";
                } else {
                    slideshowObject.duration = displayDuration;
                }
                if (transitionInt === null || transitionInt === undefined || transitionInt.length === 0){
                    slideshowObject.transition = "0";
                } else {
                    slideshowObject.transition = transitionInt;
                }
               dataArray.push(slideshowObject);
            });
            if (dataArray.length > 0){
                jQuery.fn.handleNewSlideshowContainer(dataArray, createNew);
            }
            break;
    }
};
jQuery.fn.handleHiddenVidInput = function(inputIndex, showInput){
    switch (inputIndex){
        default:
            break;
        case 1:
            if (showInput === true){
                jQuery("#ds-editor-modal-vid-hidden-0").removeClass("ds-element-hide");
                jQuery("#ds-editor-modal-vid-hidden-1").removeClass("ds-element-hide");
            } else {
                jQuery("#ds-editor-modal-vid-hidden-0").addClass("ds-element-hide");
                jQuery("#ds-editor-modal-vid-hidden-1").addClass("ds-element-hide");
            }
            break;
        case 2:
            if (showInput === true){
                jQuery("#ds-editor-modal-vid-hidden-2").removeClass("ds-element-hide");
            } else {
                jQuery("#ds-editor-modal-vid-hidden-2").addClass("ds-element-hide");
            }
            break;
    }
};
jQuery.fn.setVidUrlToModal = function(inputIndex, vidUrl){
    if (inputIndex === null || inputIndex === undefined ||
            inputIndex < 1 || inputIndex > 3){
        return;
    }
    jQuery("#" + "ds-editor-modal-vid-input-" + inputIndex).focus().val(vidUrl).change();
};
jQuery.fn.useLibraryForVideo = function(buttonIndex){
    jQuery.settings.vidUploaderCalledBy = buttonIndex;
    if (typeof(wp) === "undefined"){
        alert(ds_translation.stringWordpressFreeEnvironmentError+" (wp undefined)");
        return;
    }
    if (custom_vid_uploader) {
        custom_vid_uploader.open();
        return;
    } else {
        custom_vid_uploader = wp.media.frames.file_frame = wp.media({
            title: ds_translation.stringChooseVideo,
            library : { type : "video"},
            button: {
                text: ds_translation.stringChooseVideo
            },
            multiple: false
        });
        custom_vid_uploader.on("select", function() {
            var selectedItem = custom_vid_uploader.state().get("selection").first().toJSON();
            var vidUrl = selectedItem.url;
            jQuery.fn.setVidUrlToModal(jQuery.settings.vidUploaderCalledBy, vidUrl);
        });
        custom_vid_uploader.open();
    }
};
jQuery.fn.setSlideshowUrlToModal = function(index, url){
    if (index === null || index === undefined || index < 0){
        return;
    }
    jQuery("#ds-modal-slideshow-table tr:nth-child(" + (index + 1) +") .modal-slideshow-url").focus().val(url).change();
};
jQuery.fn.useLibraryForSlideshow = function(index){
    jQuery.settings.slideshowUploaderCalledBy = index;
    if (typeof(wp) === "undefined"){
        alert(ds_translation.stringWordpressFreeEnvironmentError+" (wp undefined)");
        return;
    }
    if (custom_slideshow_uploader) {
        custom_slideshow_uploader.open();
        return;
    } else {
        custom_slideshow_uploader = wp.media.frames.file_frame = wp.media({
            title: ds_translation.stringChooseImage,
            library : { type : "image"},
            button: {
                text: ds_translation.stringChooseImage
            },
            multiple: false
        });
        custom_slideshow_uploader.on("select", function() {
            var selectedItem = custom_slideshow_uploader.state().get("selection").first().toJSON();
            var url = selectedItem.url;

            jQuery.fn.setSlideshowUrlToModal(jQuery.settings.slideshowUploaderCalledBy, url);

        });
        custom_slideshow_uploader.open();
    }
};
jQuery.fn.handleHiddenPaddingInput = function(inputIndex, showInput){
    switch (inputIndex){
        default:
            break;
        case 1:
            if (showInput === true){
                jQuery("#ds-editor-modal-padding-group-radio").removeClass("ds-element-hide");
            } else {
                jQuery("#ds-editor-modal-padding-group-radio").addClass("ds-element-hide");
            }
            break;
    }
};
jQuery.fn.handleSlideshowContainerHelper = function(activateHelpers){
    var trigger = jQuery(this);
    if (activateHelpers === false){
        trigger.find(".ds-helper-cluster").remove();
    } else if (activateHelpers === true){
        trigger.find(".ds-helper-cluster").remove();
        var divContainer = jQuery("<div></div>", {
            class: "ds-helper-cluster"
        });
        var startButton = jQuery("<div></div>", {
            class: "ds-container-helper ds-slideshow-start disable-select",
            title: ds_translation.stringStartSlideshow
        });
        var stopButton = jQuery("<div></div>", {
            class: "ds-container-helper ds-slideshow-stop disable-select",
            title: ds_translation.stringStopSlideshow
        });
        startButton.appendTo(divContainer);
        stopButton.appendTo(divContainer);
        divContainer.appendTo(trigger);
    }
};
jQuery.fn.prepareSlideshowContainer = function(dataArray){
    var trigger = jQuery(this).find(".ds-slideshow-container-1");
    var elementDiv;
    var durationInput;
    var transitionInput;
    var image;
    jQuery.each(dataArray, function(index, value){
        elementDiv = jQuery("<div></div>", {
            class: "bgimage ds-slideshow-element ds-slideshow-element-" + (index + 1),
            style: "position:absolute; top:0%;left:0%;"
        });
        durationInput = jQuery("<input>", {
            type: "hidden",
            class: "ds-slideshow-data-duration",
            value: value.duration
        });
        transitionInput = jQuery("<input>", {
            type: "hidden",
            class: "ds-slideshow-data-transition",
            value: value.transition
        });
        image = jQuery("<img>", {
            class: "ds-slideshow-data-image",
            src: value.url
        });
        image.appendTo(elementDiv);
        durationInput.appendTo(elementDiv);
        transitionInput.appendTo(elementDiv);
        elementDiv.appendTo(trigger);
    });
    getSize();
};
jQuery.fn.handleFreeMove = function(){
    jQuery("#" + jQuery.settings.selectedContainerId).handleContainerFreeMove("ds-content");
};
jQuery.fn.handleOverlayFreemoveBlockade = function(setOverlay){
    var trigger = jQuery(this);
    if (trigger === undefined || trigger === null || trigger.length <= 0){
        return;
    }
    if (setOverlay === true){
        window.setTimeout(function(){
            clearSelection();
        }, 50);
        if (trigger.find(".ds-overlay-selection").length > 0){
            trigger.find(".ds-overlay-selection").remove();
        }
        jQuery("<div></div>", {
            class: "ds-overlay-selection ds-overlay-freemove-blockade ds-delete-this",
            style: "width:100%; height:100%;"
        })
        .appendTo(trigger);
        trigger.closest("[id^=" + jQuery.fn.getDefaultContainerName() + "]").addClass("ds-block-access");
    } else if (setOverlay === false){
        trigger.find(".ds-overlay-freemove-blockade").remove();
        trigger.closest("[id^=" + jQuery.fn.getDefaultContainerName() + "]").removeClass("ds-block-access");
    }
};
jQuery.fn.generateFreeMoveDragLines = function(color){
    var trigger = jQuery(this).find(".ds-freemove");
    var container = jQuery(this);
    if (trigger === null || trigger === undefined || trigger.length <= 0){
        return;
    }
    if (color === undefined || color === null){
        color = "#0a0";
    }
    var dragLine = jQuery("<div></div>", {
            "class": "drag-line drag_line_freemove",
            style: "outline-color: " + color +
                    "; opacity: " + 0
            });
    var mainContainer = jQuery("#myDSX");
    var top1 = container.position().top + 
            trigger.position().top + 'px';
    var top2 = container.position().top + trigger.position().top + trigger.outerHeight() + 'px';
    var left1 = container.position().left + 
            trigger.position().left + 'px';
    var left2 = container.position().left + trigger.position().left + trigger.outerWidth() + 'px';
    dragLine.clone().css({top: 0, left: left1, height: mainContainer.height()}).appendTo(mainContainer);
    dragLine.clone().css({top: 0, left: left2, height: mainContainer.height()}).appendTo(mainContainer);
    dragLine.clone().css({top: top1, left: 0, width: mainContainer.width()}).appendTo(mainContainer);
    dragLine.clone().css({top: top2, left: 0, width: mainContainer.width()}).appendTo(mainContainer);
};
jQuery.fn.handleFreeMoveContainerHelper = function(activateHelpers){
    var trigger = jQuery(this);
    if (activateHelpers === false){
        trigger.children(".ds-helper-cluster").remove();
    } else if (activateHelpers === true){
        trigger.children(".ds-helper-cluster").remove();
        var divContainer = jQuery("<div></div>", {
            class: "ds-helper-cluster ds-element-hide"
        });
        var buttonText;
        if (trigger.hasClass("ds-freemove-on")){
            buttonText = "On";
        } else {
            buttonText = "Off";
        }
        var switchButton = jQuery("<div></div>", {
                class: "ds-container-helper ds-switch-freemove disable-select",
                text: buttonText,
                title: "Enable/Disable freemove functionality"
            });
        switchButton.appendTo(divContainer);
        divContainer.appendTo(trigger);
    }
};
jQuery.fn.handleFreeMoveState = function(enforceBoolean){
    var trigger = jQuery(this).closest(".ds-freemove");
    if (enforceBoolean === true){
        if (!trigger.hasClass("ds-freemove-on")){
            trigger.addFreeMoveDraggable();
            trigger.addFreeMoveResizable();
            trigger.handleOverlayFreemoveBlockade(true);
            trigger.addClass("ds-freemove-on");
        }
        return;
    } else if (enforceBoolean === false){
        if (trigger.hasClass("ds-freemove-on")){
            trigger.removeDraggable();
            trigger.removeFreeMoveResizable();
            trigger.handleOverlayFreemoveBlockade(false);
            trigger.removeClass("ds-freemove-on");
        }
        return;
    }
    if (trigger.hasClass("ds-freemove-on")){
        trigger.removeDraggable();
        trigger.removeFreeMoveResizable();
        trigger.handleOverlayFreemoveBlockade(false);
        trigger.removeClass("ds-freemove-on");
    } else {
        trigger.addFreeMoveDraggable();
        trigger.addFreeMoveResizable();
        trigger.handleOverlayFreemoveBlockade(true);
        trigger.addClass("ds-freemove-on");
    }
};
jQuery.fn.addFreeMoveResizable = function(){
    var trigger = jQuery(this);
    if (trigger.prop("activeResizable")){
        return;
    }
    jQuery("<div/>", {
        id: 'free_nwgrip',
        class: 'ui-resizable-handle ui-resizable-nw ds-freemove-handle'
    })
    .appendTo(trigger);
    jQuery("<div/>", {
        id: 'free_negrip',
        class: 'ui-resizable-handle ui-resizable-ne  ds-freemove-handle'
    })
    .appendTo(trigger);
    jQuery("<div/>", {
        id: 'free_swgrip',
        class: 'ui-resizable-handle ui-resizable-sw  ds-freemove-handle'
    })
    .appendTo(trigger);
    jQuery("<div/>", {
        id: 'free_segrip',
        class: 'ui-resizable-handle ui-resizable-se  ds-freemove-handle'
    })
    .appendTo(trigger);
    trigger.handleResizableProp(true);
    trigger.resizable({
        containment: "parent",
        helper: false,
        snapTolerance: 5,
        snapMode: "inner",
        handles: {
        'nw': '#free_nwgrip',
        'ne': '#free_negrip',
        'sw': '#free_swgrip',
        'se': '#free_segrip'
        },
        resize: function(event, ui){
        },
        stop: function(event, ui) {
            if (jQuery.settings.snapToleranceX > 0){
                var tempElem2 = jQuery(this);
                var correctedWidth = 
                        Math.max(0, tempElem2.outerWidth() - 
                        tempElem2.outerWidth() % jQuery.fn.getCellSizeX());
                var correctedHeight = 
                        Math.max(0, tempElem2.outerHeight() - 
                        tempElem2.outerHeight() % jQuery.fn.getCellSizeY());
                tempElem2.outerWidth(correctedWidth);
                tempElem2.outerHeight(correctedHeight);
            }
            jQuery(this).convertPositionToPercentage(true);
            jQuery.fn.updateDragLines();
            myresizer();
        }
    });
};
jQuery.fn.removeFreeMoveResizable = function(){
    var trigger = jQuery(this);
    if(trigger.prop("activeResizable")){
        jQuery("#free_nwgrip").remove();
        jQuery("#free_negrip").remove();
        jQuery("#free_swgrip").remove();
        jQuery("#free_segrip").remove();
        trigger.handleResizableProp(false);
        trigger.resizable("destroy");
    }
};
jQuery.fn.addFreeMoveDraggable = function(){
    var trigger = jQuery(this);
    if (trigger.hasClass("ui-draggable")){
        return trigger;
    }
    var startPosition;
    trigger.draggable({
        distance: 0,
        containment: "parent",
        cancel: ".ds-container-helper, .ds-prevent-drag, video",
        snap: ".ds-container, .drag-line",
        snapTolerance: jQuery.settings.magneticDocking,
        start: function(event, ui){
            startPosition = ui.position;
        },
        drag: function(event, ui){
            if (jQuery(this).data("ui-draggable") === undefined ||
                    jQuery(this).data("ui-draggable") === null){
            } else {
                var snapCandidates = jQuery(this).data("ui-draggable").snapElements;
                var snappedToElements = jQuery.map(snapCandidates, function(element) {
                    return element.snapping ? element.item : null;
                });
                jQuery.each(snapCandidates, function(index, element){
                    if (jQuery(element.item).hasClass("drag-line")){
                        jQuery(element.item).css({opacity: 0});
                    }
                });
                if (snappedToElements.length > 0){
                    jQuery.each(snappedToElements, function(){
                        if (jQuery(this).hasClass("drag-line")){
                            jQuery(this).css("opacity", 1);
                        }
                    });
                }
            }
        },
        stop: function(event, ui){
            jQuery.fn.updateDragLines();
            jQuery(this).convertPositionToPercentage(true);
        }
    });
    return jQuery(this);
};
jQuery.fn.handleContainerFreeMove = function(targetClass){
    var trigger = jQuery(this);
    if (trigger.find("." + targetClass).parent().hasClass("ds-freemove")){
        trigger.removeFreeMoveContainer(targetClass);
        return;
    }
    var outerContainer = null;
    var innerContainer = null;
    if (targetClass === undefined || targetClass === null || targetClass === "ds-content"){
        targetClass = "ds-content";
        outerContainer = trigger.find("." + targetClass + "-freemove");
        innerContainer = trigger.find("." + targetClass);
        if (outerContainer.length <= 0){
            if (trigger.createFreeMoveContainer("ds-content")){
                outerContainer = trigger.find("." + targetClass + "-freemove");
                outerContainer.addClass("ds-freemove");
            } else {
                return;
            }
        }
    } else if (targetClass === "ds-text-container-1"){
        if (trigger.find(".ds-freemove").hasClass("ds-content-freemove")){
            trigger.removeFreeMoveContainer("ds-content");
        }
        outerContainer = trigger.find("." + targetClass + "-freemove");
        innerContainer = trigger.find("." + targetClass);
        if (outerContainer.length <= 0){
            if (trigger.createFreeMoveContainer(targetClass)){
                outerContainer = trigger.find("." + targetClass + "-freemove");
                outerContainer.addClass("ds-freemove");
            } else {
                return;
            }
        }
    }
};
jQuery.fn.createFreeMoveContainer = function(targetClass){
    var trigger = jQuery(this);
    if (trigger === undefined || trigger === null || trigger.length <= 0){
        return false;
    }
    var innerContainer = trigger.find("." + targetClass);
    if (innerContainer.length <= 0){
        return false;
    }
    var outerContainer = jQuery("<div></div>", {
       class: targetClass + "-freemove" 
    });
    switch (targetClass){
        default:
            innerContainer.parent().append(outerContainer);
            break;
        case "ds-content":
            innerContainer.parent().prepend(outerContainer);
            break;
    }
    outerContainer.append(innerContainer);
    window.setTimeout(function(){
        trigger.selectContainer(outerContainer[0]);
        jQuery.fn.updateDragLines();
    }, 50);
    return true;
};
jQuery.fn.removeFreeMoveContainer = function(targetClass){
    var trigger = jQuery(this);
    if (trigger === undefined || trigger === null || trigger.length <= 0){
        return false;
    }
    var innerContainer = trigger.find("." + targetClass);
    if (innerContainer.length <= 0){
        return false;
    }
    var outerContainer = trigger.find("." + targetClass + "-freemove");
    if (outerContainer.length <= 0){
        return true;
    }
    switch (targetClass){
        default:
            outerContainer.parent().append(innerContainer);
            break;
        case "ds-content":
            outerContainer.parent().prepend(innerContainer);
            break;
    }
    outerContainer.handleFreeMoveContainerHelper(false);
    outerContainer.removeDraggable();
    outerContainer.removeFreeMoveResizable();
    outerContainer.handleOverlayFreemoveBlockade(false);
    outerContainer.remove();
    jQuery.fn.updateDragLines();
    trigger.deselectContainer();
    trigger.selectContainer();
    return true;
};
var supportedTextProperties = ["color", "font-family", "font-size"];
var supportedClassProperties = ["bold", "italic", "underline"];
jQuery(document).on("keyup", "div[contenteditable=true]", function(){
    var content = jQuery(this).get(0).innerText || jQuery(this).get(0).innerHTML;
    content = content.replace(/\s/g, "");
    if (content.length <= 0){
        jQuery(this).find("span").remove();
    }
});
jQuery.fn.setTextProperty = function(attribute, valueString){
    var className = "ds_rangy_" + attribute;
    jQuery.fn.convertToNewStyle();
    if (supportedTextProperties.indexOf(attribute) < 0){
        return;
    }
    var applier, applierTarget, subClassName;
    switch (attribute){
        case "font-family":
            subClassName = className + "_" + valueString.replace(/ /ig, "-");
            applierTarget = {type: "class", target: className};
            applier = rangy.createClassApplier(className, {
                applyToEditableOnly: true,
                elementTagName: "span",
                normalize: true,
                useExistingElements: true
            });
            break;
        case "font-size":
            subClassName = className + "_" + valueString;
            applierTarget = {type: "class", target: className};
            applier = rangy.createClassApplier(className, {
                applyToEditableOnly: true,
                elementTagName: "span",
                normalize: true,
                useExistingElements: true
            });
            break;
        case "color":
            applierTarget = {type: "style", target: attribute};
            applier = rangy.createClassApplier(className, {
                applyToEditableOnly: true,
                elementTagName: "span",
                normalize: true,
                useExistingElements: true
            });
            break;
    }
    applier.undoToSelectionStyle(undefined, applierTarget);
    applier.applyToSelection();
    jQuery.each(jQuery.fn.getContainerWithTextSelection().find("span[class*='" + className + "']"), function(){
        if (!subClassName && !jQuery(this).hasInlineStyle(attribute)){
            jQuery(this).css(attribute, valueString);
        }
        if (subClassName && !jQuery(this).hasClassWildcard(className)){
            jQuery(this).addClass(subClassName);
        }
    });
};
jQuery.fn.toggleTextClassProperty = function(attribute){
    var className = "ds_rangy_" + attribute;
    if (jQuery.fn.getContainerWithTextSelection().find("b, strong, i, u").length > 0){
        if (document.queryCommandState){
            if (!document.queryCommandState(attribute)){
                document.execCommand(attribute, false, null);
            }
            document.execCommand(attribute, false, null);
        }
    }
    if (supportedClassProperties.indexOf(attribute) < 0){
        return;
    }
    var applier = rangy.createClassApplier(className, {
        applyToEditableOnly: true,
        elementTagName: "span",
        normalize: true,
        useExistingElements: true
    });
    applier.toggleSelection();
};
jQuery.fn.removeTextProperty = function(attribute){
    var applier, applierTarget, attrArray, className, index;
    if (attribute === undefined){
        attrArray = supportedTextProperties;
    } else {
        if (supportedTextProperties.indexOf(attribute) < 0){
            return;
        }
        attrArray = [attribute];
    }
    for (index = 0; index < attrArray.length; index++){
        className = "ds_rangy_" + attrArray[index];
        applier = rangy.createClassApplier(className, {
            applyToEditableOnly: true,
            elementTagName: "span",
            normalize: true,
            useExistingElements: true
        });
        if (attrArray[index] === "font-family" || attrArray[index] === "font-size"){
            applierTarget = {type: "class", target: className};
        } else {
            applierTarget = {type: "style", target: attrArray[index]};
        }
        applier.undoToSelectionStyle(undefined, applierTarget);
    }
};
jQuery.fn.removeAllFormatting = function(){
    jQuery.fn.removeTextProperty();
    var applier, className, index;
    for (index = 0; index < supportedClassProperties.length; index++){
        className = "ds_rangy_" + supportedClassProperties[index];
        applier = rangy.createClassApplier(className, {
            applyToEditableOnly: true,
            elementTagName: "span",
            normalize: true,
            useExistingElements: true
        });
        applier.undoToSelection();
    }
};
jQuery.fn.hasClassWildcard = function(className){
    var classList = jQuery(this).prop("class");
    var result = (classList.match(new RegExp(className + "\\S+", "g")) || []).length > 0;
    return result;
};
jQuery.fn.hasInlineStyle = function (prop) {
    return (jQuery(this).prop("style")[jQuery.camelCase(prop)] !== "");
};
jQuery.fn.getContainerWithTextSelection = function(){
    var selection = rangy.getSelection();
    var result = jQuery(selection.anchorNode.parentElement)
            .closest("[id^=" + jQuery.fn.getDefaultContainerName() + "]");
    if (result.length <= 0){
        result = jQuery("#myDSX");
    }
    return result;
};
jQuery.fn.convertToNewStyle = function(){
    var foundFontTags = jQuery(jQuery.fn.getContainerWithTextSelection()).find("font");
    if (foundFontTags.length <= 0){
        return;
    }
    jQuery.each(foundFontTags, function(index, element){
        var classes = "";
        var styles = "";
        var trigger = jQuery(this);
        if (trigger.attr("color")){
            classes += " ds_rangy_color";
            styles = ' style="color:' + trigger.attr("color") + ';"';
        }
        if (trigger.attr("face")){
            classes += " ds_rangy_font-family ds_rangy_font-family_" + trigger.attr("face").replace(/ /ig, "-");
        }
        if (trigger.attr("size")){
            classes += " ds_rangy_font-size ds_rangy_font-size_" + trigger.attr("size");
        }
        trigger.replaceWith('<span class="' + classes.trim() + '"' + styles + '>' + trigger.html() + '</span>');
    });
};
jQuery(document).on("click", "#ds_pip_selection_container", function(){
});
jQuery(document).on("change", "#ds-playlist-selector", function(){
    var playlistBaseUrl = jQuery("#load_form #playlist_base_url").text();
    var webInputField = jQuery("#ds-editor-modal-web-input-1");
    var generatedPlaylistUrl = jQuery("#ds_generated_playlist_url");
    var selectedValue = jQuery(this).find("option:selected").attr("value");
    switch(selectedValue){
        case "empty":
            webInputField.val("http://");
            generatedPlaylistUrl.val("");
            jQuery("#ds_web_playlist_selected").addClass("ds_display_none");
            break;
        default:
            webInputField.val("");
            generatedPlaylistUrl.val(playlistBaseUrl.replace("PLAYLISTID", selectedValue));
            jQuery("#ds_web_playlist_selected").removeClass("ds_display_none");
            break;
    }
});
jQuery(document).on("paste change input", "#ds-editor-modal-web-input-1", function(){
    jQuery("#ds-playlist-selector").val("empty");
    jQuery("#ds_generated_playlist_url").val("");
    jQuery("#ds_web_playlist_selected").addClass("ds_display_none");
});
jQuery(document).on("hidden.bs.modal", "#ds-editor-modal-html", function(){
    jQuery("#selection-html-quick-templates").val("empty");
    jQuery("#ds-editor-modal-html-quick-template-input").val("");
    jQuery("#ds-editor-modal-html-quick-template-input").prop("placeholder", ds_translation.stringQTPlaceholderDefault);
    jQuery("#ds-editor-modal-html .ds-quick-template-container-main").addClass("ds-element-hide");
});
jQuery(document).on("change", ".ds-quick-template-selectmenu", function(){
    var selectedOption = jQuery(this).find("option:selected").attr("value");
    var inputContainer = jQuery("#ds-editor-modal-html-quick-template-input");
    switch(selectedOption){
        case "twitter":
            inputContainer.prop("placeholder", ds_translation.stringQTPlaceholderTwitter);
            break;
        case "facebook":
            inputContainer.prop("placeholder", ds_translation.stringQTPlaceholderFacebook);
            break;
        case "empty":
        default:
            inputContainer.prop("placeholder", ds_translation.stringQTPlaceholderDefault);
            break;
    }
});
jQuery(document).on("click", "#ds-editor-modal-html-quick-template-generate", function(){
    var templateType = jQuery("#selection-html-quick-templates option:selected").attr("value");
    var textValue = jQuery("#ds-editor-modal-html-quick-template-input").val();
    if (textValue && templateType !== "empty"){
        jQuery.fn.setQuickTemplate(textValue, templateType);
    }
});
jQuery(document).on("click", "#ds-quick-template-description", function(){
    jQuery("#ds-editor-modal-html .ds-quick-template-container-main").toggleClass("ds-element-hide");
});
jQuery.fn.setQuickTemplate = function(textValue, templateType){
    var templateData;
    switch (templateType){
        case "twitter":
            if (textValue.startsWith("#")){
            } else {
                templateData = '<a class="twitter-timeline" href="https://twitter.com/' + textValue + 
                        '">Tweets by ' + textValue + '</a> '+
                        '<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
            }
            break;
        case "facebook":
            templateData = 
                    '<div id="fb-root"></div>' +
                    '<script>(function(d, s, id) {' +
                    'var js, fjs = d.getElementsByTagName(s)[0];' +
                    'if (d.getElementById(id)) return;' +
                    'js = d.createElement(s); js.id = id;' +
                    'js.src = "//connect.facebook.net/de_DE/sdk.js#xfbml=1&version=v2.6";' +
                    'fjs.parentNode.insertBefore(js, fjs);' +
                    '}(document, "script", "facebook-jssdk"));</script>' +
                    
                    '<div class="fb-page" ' +
                    'data-href="https://www.facebook.com/' + textValue + '" ' +
                    'data-tabs="timeline" ' +
                    'data-small-header="false" ' +
                    'data-adapt-container-width="true" ' +
                    'data-hide-cover="false" ' +
                    'data-show-facepile="true">' +
                    '<blockquote cite="https://www.facebook.com/' + textValue + '" class="fb-xfbml-parse-ignore">' +
                    '<a href="https://www.facebook.com/' + textValue + '">' + textValue + '</a></blockquote></div>';
            break;
    }
    if (templateData){
        jQuery("#ds-editor-modal-html-textarea-1").val(templateData);
    }
};
function getViewportWidth() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}
jQuery.fn.debugDisplayTemplateData = function(){
    var numberOfScreensLoad = jQuery("#load_nrOfScreens").length <= 0 ?
    "-1" : jQuery("#load_nrOfScreens").val();
    var screenIdsLoad = new Array();
    jQuery("[id^=load_myDSSID]").length <= 0 ?
    screenIdsLoad.push("NO_IDS") : jQuery("[id^=load_myDSSID]").each(function(){
        screenIdsLoad.push(jQuery(this).val());
    });
    var numberOfScreensSave = jQuery("#save_nrOfScreens").length <= 0 ?
    "-1" : jQuery("#save_nrOfScreens").val();
    var screenIdsSave = new Array();
    jQuery("[id^=save_myDSSID]").length <= 0 ?
    screenIdsSave.push("NO_IDS") : jQuery("[id^=save_myDSSID]").each(function(){
        screenIdsSave.push(jQuery(this).val());
    });
    alert(
        "###LOAD_FORM###\n" + 
        "Number of Screens: " + numberOfScreensLoad +
        "\nScreenIds: " + screenIdsLoad.toString() +
        "\n\n###SAVE_FORM###\n" + 
        "Number of Screens: " + numberOfScreensSave +
        "\nScreenIds: " + screenIdsSave.toString() +
        "\n\n###CURRENT###\n" + 
        "Screen Id: " + formData.screenId +
        "\nTemplateId: " + formData.templateId + 
        "\nCustomTemplateId: " + formData.customTemplateId + 
        "\nSelectedContainer: " + jQuery.settings.selectedContainerId +
        "\n\n###OTHER###\n" + 
        "DefaultContainerName: " + jQuery.fn.getDefaultContainerName()
    );
};
jQuery.fn.debugCreateSlideshowContainer = function(){
    var dataArray = new Array();
    var slideshowObject1 = new Object();
    slideshowObject1.url = "http://dummyimage.com/600x400/000/fff&text=1";
    slideshowObject1.duration = "4";
    slideshowObject1.transition = "0";
    dataArray.push(slideshowObject1);
    var slideshowObject2 = new Object();
    slideshowObject2.url = "http://dummyimage.com/600x400/4c52a6/ff006f&text=2";
    slideshowObject2.duration = "4";
    slideshowObject2.transition = "1";
    dataArray.push(slideshowObject2);
    var slideshowObject3 = new Object();
    slideshowObject3.url = "http://dummyimage.com/600x400/947246/261e0c&text=3";
    slideshowObject3.duration = "4";
    slideshowObject3.transition = "2";
    dataArray.push(slideshowObject3);
    var slideshowObject4 = new Object();
    slideshowObject4.url = "http://dummyimage.com/600x400/aaacd1/261e0c&text=4";
    slideshowObject4.duration = "4";
    slideshowObject4.transition = "3";
    dataArray.push(slideshowObject4);
    var slideshowObject5 = new Object();
    slideshowObject5.url = "http://dummyimage.com/600x400/974426/261e0c&text=5";
    slideshowObject5.duration = "4";
    slideshowObject5.transition = "4";
    dataArray.push(slideshowObject5);
    jQuery.fn.handleNewSlideshowContainer(dataArray, false);
};
jQuery.fn.newScreenGenerated = function(){
    jQuery("#workbench-area").empty();
};
jQuery.fn.modifyVideoLink = function(targetLink){
    var tempLink = targetLink;
    var somethingFailed = false;
    var linkSource = "UNKNOWN";
    if (tempLink.indexOf("<iframe") > -1){
        if (tempLink.match(/http(.*?)(?=["'])/igm) !== null){
            tempLink = tempLink.match(/http(.*?)(?=["'])/igm)[0];
        }
    }
    if (tempLink.indexOf("<embed") > -1){
        if (tempLink.match(/http(.*?)(?=["'])/igm) !== null){
            tempLink = tempLink.match(/http(.*?)(?=["'])/igm)[0];
        }
    }
    if (tempLink.indexOf("https://www.youtube.com/") > -1){
        if (tempLink.indexOf("watch") > -1){
            linkSource = "YT-WATCH";
        } else if (tempLink.indexOf("embed") > -1){
            linkSource = "YT-EMBED";
        }
    } else if (tempLink.indexOf("https://youtu.be/") > -1){
        linkSource = "YT-TUBE";
    } else if (tempLink.indexOf("https://w.soundcloud.com/") > -1){
        linkSource = "SOUNDCLOUD";
    } else if (tempLink.indexOf("http://cache.vevo.com/") > -1){
        linkSource = "VEVO";
    } else if (tempLink.indexOf("https://player.vimeo.com/") > -1){
        linkSource = "VIMEO";
    } else if (tempLink.indexOf("http://www.dailymotion.com/") > -1){
        linkSource = "DAILYMOTION";
    } else if (tempLink.indexOf("http://player.youku.com/") > -1 || 
            tempLink.indexOf("http://v.youku.com/") > -1){
        linkSource = "YOUKU";
    }
    var codeYoutube = "?autoplay=0&loop=1&controls=0&modestbranding=1&showinfo=0&playlist=";
    var codeSoundcloud = "&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;visual=true";
    var codeVevo = "&autoplay=0&loop=1";
    var codeVimeo = "?autoplay=0&loop=1";
    var codeDailymotion = "?autoplay=0&loop=1&controls=0&quality=auto";
    var codeYouku = "?autoplay=0&loop=1";
    switch(linkSource){
        case "YOUKU":
            if (tempLink.indexOf("?") > -1){
                tempLink = tempLink.substring(0, tempLink.indexOf("?"));
            }
            if (tempLink.indexOf("=") > -1){
                tempLink = tempLink.substring(0, tempLink.indexOf("="));
            }
            var videoId = "";
            if (tempLink.lastIndexOf("embed/") > -1){
                videoId = tempLink.substring(tempLink.lastIndexOf("embed/") + 6);
            } else if (tempLink.lastIndexOf("sid/") > -1){
                videoId = tempLink.substring(tempLink.lastIndexOf("sid/") + 4);
            } else if (tempLink.lastIndexOf("v_show/id_") > -1){
                videoId = tempLink.substring(tempLink.lastIndexOf("v_show/id_") + 10);
            } else{
                somethingFailed = true;
            }
            var tempLink = "http://player.youku.com/embed/" + videoId + codeYouku;
            break;
        case "VIMEO":
            if (tempLink.indexOf("?") > -1){
                tempLink = tempLink.substring(0, tempLink.indexOf("?"));
            }
            var videoId = "";
            if (tempLink.lastIndexOf("video/") > -1){
                videoId = tempLink.substring(tempLink.lastIndexOf("video/") + 6);
            } else {
                somethingFailed = true;
            }
            var tempLink = "https://player.vimeo.com/video/" + videoId + codeVimeo;
            break;
        case "DAILYMOTION":
            if (tempLink.indexOf("?") > -1){
                tempLink = tempLink.substring(0, tempLink.indexOf("?"));
            }
            var videoId = "";
            if (tempLink.lastIndexOf("video/") > -1){
                videoId = tempLink.substring(tempLink.lastIndexOf("video/") + 6);
            } else {
                somethingFailed = true;
            }
            var tempLink = "http://www.dailymotion.com/embed/video/" + videoId + codeDailymotion;
            break;
        case "SOUNDCLOUD":
            if (tempLink.indexOf("&") > -1){
                tempLink = tempLink.substring(0, tempLink.indexOf("&"));
            }
            var videoId = "";
            if (tempLink.lastIndexOf("api.soundcloud.com/") > -1){
                videoId = tempLink.substring(tempLink.lastIndexOf("api.soundcloud.com/") + 19);
            } else {
                somethingFailed = true;
            }
            var tempLink = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/" + videoId + codeSoundcloud;
            break;
        case "VEVO":
            if (tempLink.indexOf("&") > -1){
                tempLink = tempLink.substring(0, tempLink.indexOf("&"));
            }
            var videoId = "";
            if (tempLink.lastIndexOf("?video=") > -1){
                videoId = tempLink.substring(tempLink.lastIndexOf("?video=") + 7);
            } else {
                somethingFailed = true;
            }
            var tempLink = "http://cache.vevo.com/assets/html/embed.html?video=" + videoId + codeVevo;
            break;
        case "YT-EMBED":
            if (tempLink.indexOf("?") > -1){
                tempLink = tempLink.substring(0, tempLink.indexOf("?"));
            }
            var videoId = "";
            if (tempLink.lastIndexOf("/") > -1){
                videoId = tempLink.substring(tempLink.lastIndexOf("/") + 1);
            } else {
                somethingFailed = true;
            }
            var tempLink = "https://www.youtube.com/embed/" + videoId + codeYoutube + videoId;
            break;
        case "YT-WATCH":
            var videoId = "";
            if (tempLink.indexOf("v=") > -1){
                videoId = tempLink.substring(
                        tempLink.indexOf("v=") + 2,
                
                        tempLink.indexOf("&") < 0 ?
                            tempLink.length :
                            tempLink.indexOf("&")
                            );
            } else {
                somethingFailed = true;
            }
            var tempLink = "https://www.youtube.com/embed/" + videoId + codeYoutube + videoId;
            break;
        case "YT-TUBE":
            if (tempLink.indexOf("?") > -1){
                tempLink = tempLink.substring(0, tempLink.indexOf("?"));
            }
            var videoId = "";
            if (tempLink.lastIndexOf("/") > -1){
                videoId = tempLink.substring(tempLink.lastIndexOf("/") + 1);
            } else {
                somethingFailed = true;
            }
            var tempLink = "https://www.youtube.com/embed/" + videoId + codeYoutube + videoId;
            break;
        default:
        case "UNKNOWN":
            break;
    }
    if (!somethingFailed){
        return tempLink;
    } else {
        return targetLink;
    }
};
jQuery.fn.setMenuCardTemplate = function(){
    jQuery(".dsmenucard").each(function(){
        var index = jQuery(this).getContainerElementId();
        if (jQuery("#" + jQuery.fn.getDefaultContainerName() + index).find(".ds-menu-container-1").length > 0){
            return;
        } else {
            if (jQuery("#" + jQuery.fn.getDefaultContainerName() + index)
                    .find(".ds-content-padding").length > 0){
                jQuery("#" + jQuery.fn.getDefaultContainerName() + index)
                        .find(".ds-content-padding").remove();
            } else if (jQuery("#" + jQuery.fn.getDefaultContainerName() + index)
                    .find(".ds-content-freemove").length > 0){
                jQuery("#" + jQuery.fn.getDefaultContainerName() + index)
                        .find(".ds-content-freemove").remove();
            } else {
                jQuery("#" + jQuery.fn.getDefaultContainerName() + index)
                        .find(".ds-content").remove();
            }
        }
        var numberOfRows = 4;
        if (jQuery(this).hasClass("dsmenucard_row1")){
            numberOfRows = 1;
        } else if (jQuery(this).hasClass("dsmenucard_row2")){
            numberOfRows = 2;
        } else if (jQuery(this).hasClass("dsmenucard_row3")){
            numberOfRows = 3;
        } else if (jQuery(this).hasClass("dsmenucard_row4")){
            numberOfRows = 4;
        } else if (jQuery(this).hasClass("dsmenucard_row5")){
            numberOfRows = 5;
        } else if (jQuery(this).hasClass("dsmenucard_row6")){
            numberOfRows = 6;
        } else if (jQuery(this).hasClass("dsmenucard_row7")){
            numberOfRows = 7;
        } else if (jQuery(this).hasClass("dsmenucard_row8")){
            numberOfRows = 8;
        } else if (jQuery(this).hasClass("dsmenucard_row9")){
            numberOfRows = 9;
        } else if (jQuery(this).hasClass("dsmenucard_row10")){
            numberOfRows = 10;
        } else if (jQuery(this).hasClass("dsmenucard_row11")){
            numberOfRows = 11;
        } else if (jQuery(this).hasClass("dsmenucard_row12")){
            numberOfRows = 12;
        }
        jQuery("#" + jQuery.fn.getDefaultContainerName() + index)
                .handleNewMenuContainer(numberOfRows);
        jQuery("#" + jQuery.fn.getDefaultContainerName() + index).find(".ds-menu-container-1")
                .handleGenericTemplate(true);
    });
};
jQuery.fn.handleGenericTemplate = function(setAsGeneric){
    var trigger = jQuery(this);
    if (setAsGeneric === true){
        trigger.addClass("ds-template-generic");
    } else if (setAsGeneric === false){
        trigger.removeClass("ds-template-generic");
    }
};
jQuery.fn.handleTextSelectionRestoration = function(event){
    var clickTarget = jQuery(event.target);
    if (jQuery.textSelection.currentFocusObject === null){
        return;
    }
    if (clickTarget.closest(".sp-container").length > 0 && !clickTarget.hasClass("sp-input")){
        jQuery("#editor-content").on("mouseup", function(event){
            if (jQuery.textSelection.currentTextSelection !== null){
                restoreSelection(jQuery.textSelection.currentTextSelection);
            }
            if (jQuery.textSelection.currentFocusObject !== null){
            }
            jQuery("#editor-content").off("mouseup");
        });
    } else {
        if (clickTarget.hasClass("ds-editor-button-topic-text")){
        } else if (clickTarget.closest(".sp-replacer").length > 0 ||
                clickTarget.closest(".sp-container").length > 0){
        } else {
            jQuery.textSelection.currentFocusObject = null;
            jQuery.textSelection.currentTextSelection = null;
            jQuery("#editor-content").off("mouseup");
        }
    }
};
function setImageWithCorrectAspectRatio(id, posArray, imageUrl) {
    var data = new FormData();
    data.append('action', 'signage_img_info_ajax');
    data.append('imageUrl', imageUrl);
    jQuery.ajax({
            url:uploadUrl,
            data:data,
            dataType: "json",
            type:"POST",
            contentType: false,
            processData: false,
            cache:false
    }).done (function(response) {
        if (response.success === false){
            jQuery.fn.createContainer2(id, posArray).createImageContainer(imageUrl);
            return;
        }
        if (response.width <= 0 || response.height <= 0){
            jQuery.fn.createContainer2(id, posArray).createImageContainer(imageUrl);
            return;
        }
        var sizeArray = new Array();
        if (response.width > response.height){
            sizeArray["width"] = "20";
            var pixelLargerValue = (jQuery("#workbench-area").width() / 100) * sizeArray["width"];
            var pixelSmallerValue = pixelLargerValue * (response.height/response.width);
            var percentageValue = (pixelSmallerValue / jQuery("#workbench-area").height()) * 100;
            sizeArray["height"] = percentageValue.toString(10);
        } else {
            sizeArray["height"] = "20";
            var pixelLargerValue = (jQuery("#workbench-area").height() / 100) * sizeArray["height"];
            var pixelSmallerValue = pixelLargerValue * (response.width/response.height);
            var percentageValue = (pixelSmallerValue / jQuery("#workbench-area").width()) * 100;
            sizeArray["width"] = percentageValue.toString(10);
        }
        jQuery.fn.createContainer2(id, posArray, sizeArray).createImageContainer(imageUrl);
    });
}
jQuery.fn.testfunction = function(){
    var booleanBold = document.queryCommandState("bold");
    var booleanItalic = document.queryCommandState("italic");
    var booleanUnderline = document.queryCommandState("underline");
    booleanBold === true ?
        jQuery("[id^=btn-text-style-bold]").addClass("ds-editor-button-enabled") :
        jQuery("[id^=btn-text-style-bold]").removeClass("ds-editor-button-enabled");
    booleanItalic === true ?
        jQuery("[id^=btn-text-style-italic]").addClass("ds-editor-button-enabled") :
        jQuery("[id^=btn-text-style-italic]").removeClass("ds-editor-button-enabled");
    booleanUnderline === true ?
        jQuery("[id^=btn-text-style-underline]").addClass("ds-editor-button-enabled") :
        jQuery("[id^=btn-text-style-underline]").removeClass("ds-editor-button-enabled");
    var booleanAlignLeft = document.queryCommandState("justifyLeft");
    var booleanAlignCenter = document.queryCommandState("justifyCenter");
    var booleanAlignRight = document.queryCommandState("justifyRight");
    var booleanAlignFull = document.queryCommandState("justifyFull");
    booleanAlignLeft === true ?
        jQuery("[id^=btn-text-orientation-left]").addClass("ds-editor-button-enabled") :
        jQuery("[id^=btn-text-orientation-left]").removeClass("ds-editor-button-enabled");
    booleanAlignCenter === true ?
        jQuery("[id^=btn-text-orientation-center]").addClass("ds-editor-button-enabled") :
        jQuery("[id^=btn-text-orientation-center]").removeClass("ds-editor-button-enabled");
    booleanAlignRight === true ?
        jQuery("[id^=btn-text-orientation-right]").addClass("ds-editor-button-enabled") :
        jQuery("[id^=btn-text-orientation-right]").removeClass("ds-editor-button-enabled");
    booleanAlignFull === true ?
        jQuery("[id^=btn-text-orientation-full]").addClass("ds-editor-button-enabled") :
        jQuery("[id^=btn-text-orientation-full]").removeClass("ds-editor-button-enabled");
    var valueFontColor = document.queryCommandValue("ForeColor");
    jQuery("[id^=btn-text-font-forecolor]").spectrum("set", valueFontColor);
    var valueFontFamily = document.queryCommandValue("fontName");
};
jQuery.fn.showModalContainerTwitter = function(createNewContainer){
    alert("NOTHING TO SEE YET");
};
jQuery.fn.showModalContainerTime = function(createNewContainer){
    alert("NOTHING TO SEE YET");
};
jQuery.fn.prepareForExport = function(){
    jQuery.fn.deselectContainer();
    jQuery('.drag-line').remove();
    jQuery('.ds-container').removeClass("ds-container-editmode");
    jQuery('.ds-container').removeClass("ui-draggable ui-draggable-handle");
};
jQuery.fn.exportHtml = function(){
    jQuery.fn.triggerNormalFormUpdate();
};
jQuery.fn.importHtml = function(templateFormat, templateArrayIndex, suppliedContentArray){
    alert("importHtml(format, arrayIndex, contentArray) is no longer used.\n\
            Use changeDisplayedTemplate(isCustomTemplate, templateId, templateName, htmlContent) instead.");
    formData.screenFormat = templateFormat;
    if (templateArrayIndex === undefined || templateArrayIndex === null 
            || templateArrayIndex < 0 || templateArrayIndex.length === 0){
        jQuery.fn.emptyWorkbench();
        formData.templateId = "-1";
        return;
    } else {
        formData.templateId = templateArrayIndex;
    }
    if (wordPressTemplateArray.length === 0){
        return;
    }
    if (typeof wordPressTemplateArray[templateArrayIndex] === "undefined"){
        return;
    }
    var sanitizedHtmlString = jQuery.fn.sanitizeTemplateHtmlCode(wordPressTemplateArray[templateArrayIndex]);
    jQuery("#workbench-area").html(sanitizedHtmlString);
    if (suppliedContentArray === undefined || suppliedContentArray === null 
            || suppliedContentArray.length === 0){
    } else {
        if (suppliedContentArray.length > 0){
            jQuery("[id^=" + jQuery.fn.getDefaultContainerName() + "]").each(function(){
                var index = jQuery(this).getContainerElementId();
                if (!(typeof suppliedContentArray[index] === "undefined")){
                    jQuery(this).html(jQuery.fn.sanitizeContentHtmlCode(suppliedContentArray[index]));
                }
            });
        }
    }
};

jQuery.fn.setJustify = function(alignment, setJustify){
    if (setJustify){
    } else {
    }
};
jQuery.fn.customIESpectrum = function(){
    jQuery(".sp-replacer, .sp-preview, .sp-preview-inner").each(function(){
        jQuery(this).attr("unselectable", "on");
    });
    jQuery(".sp-container, .sp-palette-container, .sp-cf, .sp-thumb-el, .sp-thumb-inner, .sp-picker-container, .sp-input").each(function(){
        jQuery(this).attr("unselectable", "on");
    });
};
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}
jQuery(function(){
    jQuery.extend(jQuery.ui.resizable.prototype.options, { snapTolerance: 20, snapMode: 'both' });
    jQuery.ui.plugin.add('resizable', 'snap', {
        start: function () {
            var thisVar = jQuery(this), inst = thisVar.data('ui-resizable'), snap = inst.options.snap;
            inst.ow = inst.helper.outerWidth() - inst.size.width;
            inst.oh = inst.helper.outerHeight() - inst.size.height;
            inst.lm = getLm(thisVar);
            inst.tm = getTm(thisVar);
            inst.coords = [];
            inst.snapElements = [];
            jQuery(typeof snap === 'string' ? snap : ':data(ui-resizable)').each(function () {
                if (this === inst.element[0] || this === inst.helper[0]) return;
                var el = jQuery(this), p = el.position(), 
                        l = p.left + getLm(el), t = p.top + getTm(el);
                inst.coords.push({ 
                    l: l, t: t, 
                    r: l + el.outerWidth(), b: t + el.outerHeight()
                });
                inst.snapElements.push({
                    item: this,
                    width: el.outerWidth(), height: el.outerHeight(),
                    top: el.offset().top, left: el.offset().left
                });
            });
        },
        resize: function () {
            var ls = [], ts = [], ws = [], hs = [],
                inst = jQuery(this).data('ui-resizable'),
                axes = inst.axis.split(''),
                st = inst.options.snapTolerance,
                md = inst.options.snapMode,
                l = inst.position.left + inst.lm, _l = l - st,
                t = inst.position.top + inst.tm, _t = t - st,
                r = l + inst.size.width + inst.ow, _r = r + st,
                b = t + inst.size.height + inst.oh, _b = b + st;
            jQuery.each(inst.coords, function () {
                var coords = this,
                    w = Math.min(_r, coords.r) - Math.max(_l, coords.l),
                    h = Math.min(_b, coords.b) - Math.max(_t, coords.t);
                if (w < 0 || h < 0) return;
                jQuery.each(axes, function (k, axis) {
                    if (md === 'outer') {
                        switch (axis) {
                            case 'w': case 'e': if (w > st * 2) return; break;
                            case 'n': case 's': if (h > st * 2) return;
                        }
                    } else if (md === 'inner') {
                        switch (axis) {
                            case 'w': case 'e': if (w < st * 2) return; break;
                            case 'n': case 's': if (h < st * 2) return;
                        }
                    }
                    switch (axis) {
                        case 'w': ls.push(getC(l - coords.l, l - coords.r, st)); break;
                        case 'n': ts.push(getC(t - coords.t, t - coords.b, st)); break;
                        case 'e': ws.push(getC(r - coords.l, r - coords.r, st)); break;
                        case 's': hs.push(getC(b - coords.t, b - coords.b, st));
                    }
                });
            });
            if (hs.length) {
                inst.size.height += getN(hs);
            }
            if (ws.length) {
                inst.size.width += getN(ws);
            }
            if (ls.length) {
                var n = getN(ls);
                inst.position.left += n;
                inst.size.width -= n;
            } 
            if (ts.length) {
                var n = getN(ts);
                inst.position.top += n;
                inst.size.height -= n;
            }
        }
    });
    function getC(lt, rb, st) {
            return Math.abs(lt) < st ? -lt : Math.abs(rb) < st ? -rb : 0;
    }
    function getN(ar) {
            return ar.sort(function (a, b) { return !a ? 1 : !b ? -1 : Math.abs(a) - Math.abs(b); })[0];
    }
    function getLm(el) {
            return parseInt(el.css('margin-left'), 10) || 0;
    }
    function getTm(el) {
            return parseInt(el.css('margin-top'), 10) || 0;
    }
    function patch(func, afterFunc, beforeFunc) {
            var fn = jQuery.ui.resizable.prototype[func];
            jQuery.ui.resizable.prototype[func] = function () {
                    if (beforeFunc) beforeFunc.apply(this, arguments);
                    fn.apply(this, arguments);
                    if (afterFunc) afterFunc.apply(this, arguments);
            };
    }
    patch('_mouseStop', null, function () {
            if (this._helper) {
                    this.position = { left: parseInt(this.helper.css('left'), 10) || 0.1, top: parseInt(this.helper.css('top'), 10) || 0.1 };
                    this.size = { width: this.helper.outerWidth(), height: this.helper.outerHeight() };
            }
    });
    patch('_mouseStart', function () {
            if (this._helper) {
                    this.size = { 
                            width: this.size.width - (this.helper.outerWidth() - this.helper.width()), 
                            height: this.size.height - (this.helper.outerHeight() - this.helper.height()) 
                    };
                    this.originalSize = { width: this.size.width, height: this.size.height };
            }
    });
    patch('_renderProxy', function () {
            if (this._helper) {
                    this.helper.css({
                            left: this.elementOffset.left,
                            top: this.elementOffset.top,
                            width: this.element.outerWidth(),
                            height: this.element.outerHeight()
                    });
            }	
    });
    var p = jQuery.ui.resizable.prototype.plugins.resize;
    jQuery.each(p, function (k, v) {
            if (v[0] === 'ghost') {
                    p.splice(k, 1);
                    return false;
            }
    });
    jQuery.each(jQuery.ui.resizable.prototype.plugins.start, function (k, v) {
            if (v[0] === 'ghost') {
                    var fn = v[1];
                    v[1] = function () {
                            fn.apply(this, arguments);
                            jQuery(this).data('ui-resizable').ghost.css({ width: '100%', height: '100%' });
                    };
                    return false;
            }
    });
    });
