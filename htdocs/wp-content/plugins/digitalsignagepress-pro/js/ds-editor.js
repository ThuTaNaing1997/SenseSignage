jQuery.settings = new Object();
jQuery.settings.selectedContainerId = null;
jQuery.settings.containerIdBase = "myDS";
jQuery.settings.containerIdSuffix = "XE";
jQuery.settings.maxContainerElems = 99;
jQuery.settings.selectedGridClass = "grid-100-50";
jQuery.settings.selectedGridCellWidth = 100;
jQuery.settings.selectedGridCellHeight = 50;
jQuery.settings.snapToleranceX = 0;
jQuery.settings.snapToleranceY = 0;
jQuery.settings.magneticDocking = 0;
jQuery.settings.useDragLines = 1;
jQuery.settings.imageUploaderCalledBy = null;
jQuery.settings.createNewVidContainer = false;
jQuery.settings.vidUploaderCalledBy = null;
jQuery.settings.slideshowUploaderCalledBy = null;
var formData = new Array();
formData.screenId = "X1";
formData.screenRatio = "1.77777777";
formData.screenFormat = "1";
formData.templateId = "-1";
formData.customTemplateId = "0";
formData.customTemplateName = "";
var lastFormUpdate = 0;
var localHeight = 720;
jQuery.textSelection = new Object();
jQuery.textSelection.focusInContentEditable = false;
jQuery.textSelection.currentTextSelection = null;
jQuery.textSelection.currentFocusObject = null;
jQuery.noConflict();
jQuery("#workbench-area").attr("spellcheck", false);
jQuery(document).on("ready", function(){
    jQuery("#load_form #ds-playlist-selector").appendTo("#ds-editor-modal-web #ds_select_insert_marker");
    jQuery.fn.initiateAllEventListeners();
    jQuery.fn.loadTemplates();
    jQuery.fn.emptyWorkbench();
    jQuery.fn.toggleMagneticDock();
    jQuery.fn.toggleDeleteButton();
    jQuery.fn.setAspectRatioInput();
    jQuery("[id^=btn-container-colorpicker-container]").spectrum("disable");
    jQuery.fn.updateContainerColorPreview();
    jQuery.fn.handleMediaButtonState();
    jQuery.fn.handleTopicTextButtonState();
    jQuery.fn.customIESpectrum();
});
jQuery.fn.initiateAllEventListeners = function(){
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
if (MutationObserver === undefined){
    jQuery("#workbench-area").bind("DOMSubtreeModified", function(){
        if (jQuery.now() - lastFormUpdate < 500){
            return;
        } else {
            jQuery.fn.triggerNormalFormUpdate();
            lastFormUpdate = jQuery.now();
        }
    });
    
} else {
    function mutationHandler(mutationList){
        if (jQuery.now() - lastFormUpdate < 500){
            return;
        } else {
            jQuery.fn.triggerNormalFormUpdate();
            lastFormUpdate = jQuery.now();
        }
    }
    var observer = new MutationObserver (mutationHandler);
    var options = {subtree: true, childList: true, characterData: true, attributes: true};
    observer.observe(jQuery("#workbench-area")[0], options);
}
jQuery("[id^=btn-text-font-forecolor]").spectrum({
    showInitial: true,
    showInput: true,
    clickoutFiresChange: false,
    hideAfterPaletteSelect:true,
    preferredFormat: "hex3",
    chooseText: ds_translation.stringChoose,
    cancelText: ds_translation.stringCancel,
    showPalette:true,
    palette: [
        ["black"],
        ["gray"],
        ["white"],
        ["red"],
        ["saddlebrown"],
        ["orange"],
        ["yellow"],
        ["lime"],
        ["aqua"],
        ["blue"],
        ["fuchsia"]
    ],
    showSelectionPalette: false,
    change: function(color) {
        jQuery.fn.setTextProperty("color", color.toHexString());
        }
});
jQuery("[id^=btn-container-colorpicker-bg]").spectrum({
    showInitial: true,
    showInput: true,
    clickoutFiresChange: false,
    hideAfterPaletteSelect:true,
    allowEmpty:true,
    preferredFormat: "hex8",
    chooseText: ds_translation.stringChoose,
    cancelText: ds_translation.stringCancel,
    showPalette:true,
    palette: [
        ["black"],
        ["gray"],
        ["white"],
        ["red"],
        ["saddlebrown"],
        ["orange"],
        ["yellow"],
        ["lime"],
        ["aqua"],
        ["blue"],
        ["fuchsia"]
    ],
    showSelectionPalette: false,
    change: function(color) {
        var returnValue = color !== null ? color.toRgbString() : "rgb(255,255,255)";
        jQuery.fn.changeContainerBgColor(jQuery.fn.getDefaultContainerName() + "0", returnValue);
    }
});
jQuery("[id^=btn-container-colorpicker-container]").spectrum({
    showInitial: true,
    showInput: true,
    showAlpha: true,
    clickoutFiresChange: false,
    hideAfterPaletteSelect:true,
    allowEmpty:true,
    preferredFormat: "hex8",
    chooseText: ds_translation.stringChoose,
    cancelText: ds_translation.stringCancel,
    showPalette:true,
    palette: [
        ["black"],
        ["gray"],
        ["white"],
        ["red"],
        ["saddlebrown"],
        ["orange"],
        ["yellow"],
        ["lime"],
        ["aqua"],
        ["blue"],
        ["fuchsia"]
    ],
    showSelectionPalette: false,
    change: function(color) {
        var returnValue = color !== null ? color.toRgbString() : "";
        if (jQuery(this).attr("id") === "btn-container-colorpicker-bg-original"){
            jQuery.fn.changeContainerBgColor(jQuery.fn.getDefaultContainerName() + "0", returnValue);
        } else {
            jQuery.fn.changeContainerBgColor(jQuery.settings.selectedContainerId, returnValue);
        }
    }
});
jQuery(document).on("show.spectrum", function(){
    jQuery.fn.customIESpectrum();
});
jQuery("[id^=selection-container-new]").buttonset();
jQuery(document).on("change", ".ds-editor-selectmenu", function(){
    var selectedOption = jQuery(this).find("option:selected").attr("value");
    var unknownSelect = false;
    if (selectedOption === "empty"){
        return;
    }
    switch (jQuery(this).attr("id")){
        default:
            unknownSelect = true;
            break;
        case "selection-text-font-family-original":
            jQuery.fn.setTextProperty("font-family", selectedOption);
            break;
        case "selection-text-font-size-original":
            jQuery.fn.setTextProperty("font-size", selectedOption);
            break;
        case "selection-text-insert-html-original":
            var optgroup = jQuery(this).find("option:selected").closest("optgroup").prop("label");
            if (optgroup === "Headings"){
                if (!document.execCommand("formatBlock", false, selectedOption)){
                    document.execCommand("formatBlock", false, "<" + selectedOption + ">");
                };
            } else {
                insertHTML(selectedOption);
            }
            break;
        case "selection-container-create-new-original":
            if (formData.templateId >= 0){
                jQuery(this).val("empty");
                return;
            }
            switch(selectedOption){
                default:
                case "empty":
                    break;
                case "img":
                    jQuery.settings.imageUploaderCalledBy = "btn-container-new-img";
                    jQuery.fn.handleNewImgContainer(true);
                    break;
                case "text":
                    jQuery.fn.handleNewTextContainer(1, true);
                    break;
                case "web":
                    jQuery.fn.showModalContainerWeb(true);
                    break;
                case "vid":
                    jQuery.fn.showModalContainerVid(true);
                    break;
                case "html":
                    jQuery.fn.handleNewHtmlContainer(true);
                    break;
                case "twitter":
                    jQuery.fn.showModalContainerTwitter(true);
                    break;  
                case "time":
                    jQuery.fn.showModalContainerTime(true);
                    break;
                case "menu":
                    jQuery.fn.handleNewMenuContainer(6, true);
                    break;  
                case "slideshow":
                    jQuery.fn.showModalContainerSlideshow(true);
                    break;
            }
            break;
    }
    if (unknownSelect){
        return;
    } else {
        jQuery(this).val("empty");
    }
});
jQuery("[id^=btn-text-style-bold]").click(function() {
    jQuery.fn.toggleTextClassProperty("bold");
});
jQuery("[id^=btn-text-style-italic]").click(function() {
    jQuery.fn.toggleTextClassProperty("italic");
});
jQuery("[id^=btn-text-style-underline]").click(function() {
    jQuery.fn.toggleTextClassProperty("underline");
});
jQuery("[id^=btn-text-orientation-left]").click(function() {
  document.execCommand('justifyLeft', false, null);
});
jQuery("[id^=btn-text-orientation-center]").click(function() {
  document.execCommand('justifyCenter', false, null);
});
jQuery("[id^=btn-text-orientation-right]").click(function() {
  document.execCommand('justifyRight', false, null);
});
jQuery("[id^=btn-text-orientation-full]").click(function() {
  document.execCommand('justifyFull', false, null);
});
jQuery("[id^=btn-format-landscape]").click(function(){
    formData.screenRatio = parseFloat(jQuery("#input-aspect-ratio").val());
    jQuery.fn.updateWorkbenchSize((localHeight * formData.screenRatio), localHeight);
    formData.screenFormat = 1;
});
jQuery("[id^=btn-format-portrait]").click(function(){
    formData.screenRatio = parseFloat(jQuery("#input-aspect-ratio").val());
    jQuery.fn.updateWorkbenchSize(localHeight, (localHeight * formData.screenRatio));
    formData.screenFormat = 2;
});
jQuery("[id^=btn-workbench-empty]").click(function(){
    jQuery.fn.emptyWorkbench();
});
jQuery("[id^=btn-import-html]").click(function(){
    jQuery.settings.selectedContainerId = null;
    jQuery.fn.triggerFullFormUpdate();
    jQuery.fn.importFixTemplate(jQuery("#input-load-array-index").val(),
    jQuery.fn.prepareContentDataForDisplay());
});
jQuery("[id^=btn-export-html]").click(function(){
    jQuery.fn.exportHtml();
});
jQuery("[id^=btn-editor-toggle-grid]").click(function(){
    jQuery(this).toggleGrid();
});
jQuery("[id^=btn-editor-toggle-magnet]").click(function(){
    jQuery(this).toggleMagneticDock();
});
jQuery("[id^=btn-workbench-edit]").click(function(){
    jQuery(this).displayHoverMenu();
});
jQuery("[id^=btn-container-remove]").click(function(){
    jQuery.fn.removeContainer();
});
jQuery("[id^=btn-container-clear]").click(function(){
    jQuery.fn.clearContainer();
});
jQuery("[id^=btn-container-delete]").click(function() {
    jQuery.fn.handleContainerDelete();
});
jQuery("#btn-delete-bg-image").click(function(){
  jQuery("#myDSXE0 .ds-image-container-1").remove();
  jQuery("#myDSXE0 .ds-content").remove();
  jQuery.fn.deleteContainerBgFormEntries();
  jQuery.fn.changeContainerBgColor("myDSXE0", "rgb(255,255,255)");
  jQuery.fn.updateContainerColorPreview();
});
jQuery("[id^=btn-container-duplicate]").click(function() {
    jQuery.fn.handleContainerDuplicate();
});
jQuery("[id^=btn-container-padding]").click(function() {
    jQuery.fn.showModalPadding();
});
jQuery("input[name=radio-container]").on("click", function(){
    jQuery(this).handleContainerRadioClick();
});
jQuery("[id^=btn-container-new-img]").click(function() {
    jQuery.settings.imageUploaderCalledBy = "btn-container-new-img";
    jQuery.fn.handleNewImgContainer();
});
jQuery("[id^=btn-container-set-img]").click(function() {
    if (jQuery(this).attr("id") === "btn-container-set-img-bg-original"){
        jQuery.fn.setBackgroundImage(jQuery.fn.getDefaultContainerName() + "0");
    } else {
        if (jQuery.settings.selectedContainerId === jQuery.fn.getDefaultContainerName() + "0"){
            return;
        }
        jQuery.fn.setBackgroundImage(jQuery.settings.selectedContainerId);
    }
});
jQuery("[id^=btn-container-set-text]").click(function(){
    jQuery.fn.handleNewTextContainer(1);
});
jQuery("[id^=btn-container-new-web]").click(function() {
    jQuery.fn.showModalContainerWeb();
});
jQuery("[id^=btn-container-new-vid]").click(function() {
    jQuery.fn.showModalContainerVid();
});
jQuery("[id^=btn-container-new-html]").click(function() {
    jQuery.fn.handleNewHtmlContainer();
});
jQuery("[id^=btn-container-set-twitter]").click(function() {
    jQuery.fn.showModalContainerTwitter();
});
jQuery("[id^=btn-container-set-time]").click(function() {
    jQuery.fn.showModalContainerTime();
});
jQuery("[id^=btn-container-set-menu]").click(function() {
    jQuery.fn.handleNewMenuContainer(6);
});
jQuery("[id^=btn-container-set-slideshow]").click(function() {
    jQuery.fn.showModalContainerSlideshow();
});
jQuery("[id^=btn-container-freemove]").click(function() {
    jQuery.fn.handleFreeMove();
});
jQuery(document).on("change input paste keyup", ".ds-input-check-value", function(){
    jQuery(this).checkInputValue();
});
jQuery("#workbench-area").on("focusout", function(event){
    if (jQuery(event.target).prop("contenteditable") === "true"){
        jQuery.textSelection.currentTextSelection = saveSelection();
        jQuery.textSelection.currentFocusObject = jQuery(event.target);
    } else {
        jQuery.textSelection.currentTextSelection = null;
        jQuery.textSelection.currentFocusObject = null;
    }
});
jQuery(document).on("mousedown", function(event){
    jQuery.fn.handleTextSelectionRestoration(event);
});
jQuery(document).on("keydown", ".ds-editor-modal-input", function(event){
    var keyCode = event.keyCode || event.which;
    if (keyCode !== 13){
        return;
    }
    switch (jQuery(this).attr("id")){
        default:
            break;
        case "ds-editor-modal-web-input-1":
            jQuery("#ds-editor-modal-web-save").trigger("click");
            break;
        case "ds-editor-modal-vid-input-1":
        case "ds-editor-modal-vid-input-2":
        case "ds-editor-modal-vid-input-3":
            jQuery("#ds-editor-modal-vid-save").trigger("click");
            break;
        case "ds-editor-modal-padding-input-1":
            jQuery("#ds-editor-modal-padding-save").trigger("click");
            break;
    }
});
jQuery(document).on("shown.bs.modal", ".ds-editor-modal-window", function () {
    var tempData = null;
    switch (jQuery(this).attr("id")){
        default:
            break;
        case "ds-editor-modal-web":
            tempData= jQuery("#ds-editor-modal-web-input-1").focus().val();
            jQuery("#ds-editor-modal-web-input-1").val("").val(tempData);
            break;
        case "ds-editor-modal-vid":
            tempData= jQuery("#ds-editor-modal-vid-input-1").focus().val();
            jQuery("#ds-editor-modal-vid-input-1").val("").val(tempData);
            break;
        case "ds-editor-modal-html":
            tempData= jQuery("#ds-editor-modal-html-textarea-1").focus().val();
            break;
        case "ds-editor-modal-padding":
            tempData= jQuery("#ds-editor-modal-padding-input-1").focus().val();
            jQuery("#ds-editor-modal-padding-input-1").val("").val(tempData);
            break;
        case "ds-editor-modal-slideshow":
            tempData= jQuery("#ds-editor-modal-padding-input-1").focus().val();
            jQuery("#ds-editor-modal-padding-input-1").val("").val(tempData);
            break;
    }
});
jQuery(document).on("change input paste keyup", ".ds-editor-modal-input", function(){
    switch (jQuery(this).attr("id")){
        default:
            break;
        case "ds-editor-modal-vid-input-1":
            if (isFileUrl(jQuery(this).val())){
                jQuery.fn.handleHiddenVidInput(1, true);
            }
            break;
        case "ds-editor-modal-vid-input-2":
            if (isFileUrl(jQuery(this).val())){
                jQuery.fn.handleHiddenVidInput(2, true);
            }
            break;
   }
});
jQuery("#ds-editor-modal-vid-library-1").on("click", function(){
    jQuery.fn.useLibraryForVideo(1);
});
jQuery("#ds-editor-modal-vid-library-2").on("click", function(){
    jQuery.fn.useLibraryForVideo(2);
});
jQuery("#ds-editor-modal-vid-library-3").on("click", function(){
    jQuery.fn.useLibraryForVideo(3);
});
jQuery(document).on("click", "#ds-modal-slideshow-add", function(){
    var clonedRow = jQuery(".ds-modal-slideshow-row").last().clone();
    var numberOfEntries = jQuery("#ds-modal-slideshow-table .ds-modal-slideshow-row").length;
    clonedRow.find(".modal-slideshow-title").text("Image #" + (numberOfEntries + 1));
    clonedRow.find(".modal-slideshow-url").val("http://");
    clonedRow.find(".modal-slideshow-duration").val("10");
    clonedRow.find("input:checked").prop("checked", false);
    clonedRow.find("label").removeClass("modal-slideshow-radiogroup-selected");
    clonedRow.find("input:first").prop("checked", true);
    clonedRow.find("label:first").addClass("modal-slideshow-radiogroup-selected");
    jQuery("#ds-modal-slideshow-table tbody tr:nth-last-child(1)").after(clonedRow);
});
jQuery(document).on("click", "#ds-modal-slideshow-remove", function(){
    if (jQuery("#ds-modal-slideshow-table tbody tr").length <= 1){
        return;
    }
    jQuery("#ds-modal-slideshow-table tbody tr:nth-last-child(1)").remove();
});
jQuery(document).on("click", "#ds-editor-modal-slideshow .ds-modal-media-library", function(){
    var trRow = jQuery(this).parents("tr").first().index();
    jQuery.fn.useLibraryForSlideshow(trRow);
});
jQuery(document).on("click", "[class^=modal-slideshow-transition-]", function(event){
    if (jQuery(event.target).prop("tagName") === "label" || 
            jQuery(event.target).prop("tagName") === "LABEL"){
        jQuery(this).siblings().removeClass("modal-slideshow-radiogroup-selected");
        jQuery(this).addClass("modal-slideshow-radiogroup-selected");
    }
});
jQuery("#toolbar-main-main").on("mouseover", ".ds-editor-button-img", function(){
    jQuery(this).addClass("ds-editor-button-highlight");
});
jQuery("#toolbar-main-main").on("mouseleave", ".ds-editor-button-img", function(){
    jQuery(this).removeClass("ds-editor-button-highlight");
});
jQuery("#workbench-area").on("mouseover", "[id^=" + jQuery.settings.containerIdBase + "]", function(event){
    jQuery(this).handleContainerMouseOver();
});
jQuery("#workbench-area").on("mouseleave", "[id^=" + jQuery.settings.containerIdBase + "]", function(event){
    jQuery(this).handleContainerMouseLeave();
});
jQuery("#workbench-area").on("mouseover", ".ds-freemove", function(){
    if (!jQuery(this).hasClass("ui-draggable") && 
            !jQuery(this).closest("[id^=" + jQuery.fn.getDefaultContainerName() + "]")
            .hasClass("ds-container-editmode")){
        jQuery(this).addFreeMoveDraggable();
    }
});
jQuery("#workbench-area").on("mousedown", "[id^=" + jQuery.settings.containerIdBase + "]", function(event){
    jQuery(this).selectContainer(event.target);
});
jQuery("#workbench-area").on("dblclick", ".ds-container, .ds-container-selected, .ds-container-highlight", function(){
    jQuery(this).handleEditMode(true);
});
jQuery("#workbench-area").on("click", function(event){
    if (event.target.id === "workbench-area"){
        jQuery.fn.deselectContainer();
        return;
    }
});
jQuery(document).on("keydown", ".ds-text-col, .ds-textarea", function(event){
    var keyCode = event.keyCode || event.which;
    switch (keyCode){
        default:
            break;
        case 9:
            if (jQuery(this).hasClass("ds-textarea")){
                event.preventDefault();
                var textarea = jQuery(this);
                var value = textarea.val();
                var start = this.selectionStart;
                var end = this.selectionEnd;
                textarea.val(value.substring(0, start)
                            + "\t"
                            + value.substring(end));
                this.selectionStart = this.selectionEnd = start + 1;
            } else if (jQuery(this).hasClass("ds-text-col")){
                if (formData.templateId >= 0){
                    event.preventDefault();
                    document.execCommand("InsertHTML", false, "&#09;");
                } else {
                    if (jQuery(this).parents(".ds-container").hasClass("ds-container-editmode")){
                        event.preventDefault();
                        document.execCommand("InsertHTML", false, "&#09;");
                    }
                }
            } else {
            }
            break;
    }
});
jQuery(document).on("focusin", ".ds-text-col", function(event){
    if (formData.customTemplateId >= 0){
        jQuery(event.target).parents(".ds-container").selectContainer();
        jQuery(event.target).parents(".ds-container").handleEditMode(true);
    }
});
jQuery("#workbench-area").mousedown(function(event){
    jQuery.fn.produceContainerStep1(event);
});
jQuery("#workbench-area").mousemove(function(event){
   jQuery.fn.produceContainerStep2(event);
});
jQuery("#workbench-area").mouseup(function(event){
    jQuery.fn.produceContainerStep3(event);
});
jQuery("#workbench-area").on("mouseover", ".ds-container-helper", function(event){
    if (jQuery(event.target).hasClass("ds-container-helper")){
        jQuery(event.target).addClass("ds-container-helper-highlight");
    }
});
jQuery("#workbench-area").on("mouseleave", ".ds-container-helper", function(event){
    if (jQuery(event.target).hasClass("ds-container-helper")){
        jQuery(event.target).removeClass("ds-container-helper-highlight");
    }
});
jQuery("#workbench-area").on("click", ".ds-container-helper", function(event){
    jQuery.fn.handleContainerHelperClick(event);
});
jQuery(document).on("click", ".ds-switch-freemove", function(){
    jQuery(this).handleFreeMoveState();
});
jQuery("#btn-debug-1-dev").text("Template Data");
jQuery("#btn-debug-1-dev").click(function(){
    jQuery.fn.debugDisplayTemplateData();
});
jQuery("#btn-debug-2-dev").text("Generic Slideshow");
jQuery("#btn-debug-2-dev").click(function(){
    jQuery.fn.debugCreateSlideshowContainer();
});
jQuery("#btn-text-1-dev").text("Remove Format");
jQuery("#btn-text-1-dev").click(function(){
    document.execCommand("removeFormat", false, null);
});
jQuery(document).on("keyup", ".ds-template-generic", function(event){
    jQuery(event.target).parents(".ds-template-generic").first().handleGenericTemplate(false);
});
jQuery("#workbench-area").on("paste", "[contenteditable='true']", function(event){
    var pastedData = (event.originalEvent || event).clipboardData.getData("text/plain");
    if (pastedData === undefined || pastedData === null || pastedData.length === 0){
        event.preventDefault();
        alert("Only plain text paste is supported");
    } else {
        event.preventDefault();
        document.execCommand("inserttext", false, pastedData);
    }
});
};
