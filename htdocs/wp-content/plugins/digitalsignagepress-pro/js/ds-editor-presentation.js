jQuery.fn.handleSlideshowPlayback = function(screenId){
    var targetTemplateContainer = null;
    if (screenId.indexOf("myDSX") > -1 || screenId.indexOf("X") > -1){
        targetTemplateContainer = jQuery("#myDSX");
    } else if (screenId.indexOf("myDS") > -1){
        targetTemplateContainer = jQuery("#" + screenId);
    } else {
        targetTemplateContainer = jQuery("#myDS" + screenId);
    }
    if (targetTemplateContainer.length <= 0){
        return;
    } else {
        targetTemplateContainer.startScreenSlideshows();
    }
};
jQuery.fn.startScreenSlideshows = function(){
    var templateContainer = jQuery(this);
    var slideshowContainerArray = templateContainer.find(".ds-slideshow-container-1");
    if (slideshowContainerArray.length <= 0){
        return;
    }
    slideshowContainerArray.each(function(){
        var slideshowContainer = jQuery(this);
        if (!slideshowContainer.initialCheckSuccessful()){
            return;
        }
        if (slideshowContainer.data("slideshowStep") !== undefined){
            slideshowContainer.stopSingleSlideshow();
        }
        slideshowContainer.slideshowProgress(null, null);
    });
};
jQuery.fn.startSingleSlideshow = function(){
    var slideshowContainer = jQuery(this);
    if (!slideshowContainer.initialCheckSuccessful()){
        return;
    }
    if (slideshowContainer.data("slideshowStep") !== undefined){
        slideshowContainer.stopSingleSlideshow();
    }
    slideshowContainer.slideshowProgress(null, null);
};
jQuery.fn.stopSingleSlideshow = function(){
    var slideshowContainer = jQuery(this);
    if (slideshowContainer.data("slideshowStep") !== undefined){
        clearTimeout(slideshowContainer.data("slideshowStep"));
        slideshowContainer.removeData("slideshowStep");
    }
    slideshowContainer.find(".ds-slideshow-element").each(function(){
        var element = jQuery(this);
        element.css("z-index", "");
        element.css("visibility", "");
        element.removeClass("ds-slideshow-transition-center");
        element.removeClass("ds-slideshow-transition-left");
        element.removeClass("ds-slideshow-transition-right");
        element.removeClass("ds-slideshow-transition-top");
        element.removeClass("ds-slideshow-transition-bottom");
    });
};
jQuery.fn.checkTemplateVisibility = function(){
    var trigger = jQuery(this).parents(".FullWidthRow, .ds-custom-template").first();
    if (trigger.length <= 0){
        return false;
    }
    if (trigger.css("display") === "none"){
        return false;
    } else {
        return true;
    }
};
jQuery.fn.getDisplayDurationFromElement = function(){
    var result = jQuery(this).find(".ds-slideshow-data-duration").val();
    if (result === undefined || result === null || result.length === 0 || result < 0){
        return 0;
    } else {
        return result;
    }
};
jQuery.fn.getTransitionFromElement = function(){
    var result = jQuery(this).find(".ds-slideshow-data-transition").val();
    if (result === undefined || result === null || result.length === 0 || result < 0){
        return 0;
    } else {
        return result;
    }
};
jQuery.fn.getNextIndex = function(currentIndex){
    var trigger = jQuery(this);
    if (currentIndex === undefined || currentIndex === null || currentIndex < 0){
        currentIndex = 1;
    }
    if (trigger.find(".ds-slideshow-element-" + (currentIndex + 1)).length > 0){
        return (currentIndex + 1);
    } else {
        return 1;
    }
};
jQuery.fn.initialCheckSuccessful = function(){
    var trigger = jQuery(this);
    var foundLegalUrl = false;
    trigger.find("img").each(function(){
       if (jQuery(this).prop("src") !== null){
           foundLegalUrl = true;
       } 
    });
    var foundLegalDuration = false;
    trigger.find(".ds-slideshow-data-duration").each(function(){
        if (jQuery(this).val() > 0){
            foundLegalDuration = true;
        }
    });
    if (foundLegalUrl && foundLegalDuration){
        return true;
    } else {
        return false;
    }
};
jQuery.fn.showSlideshowElement = function(previousIndex, displayIndex, transitionType){
    var trigger = jQuery(this);
    var allExceptPrevious = trigger.find(".ds-slideshow-element:not(.ds-slideshow-element-" + previousIndex + ")");
    allExceptPrevious.css("visibility", "hidden");
    allExceptPrevious.css("z-index", "1");
    allExceptPrevious.removeClass("ds-slideshow-transition-center-disappear");
    var previousDisplay = trigger.find(".ds-slideshow-element-" + previousIndex);
    previousDisplay.css("visibility", "hidden");
    previousDisplay.css("z-index", "10");
    previousDisplay.addClass("ds-slideshow-transition-center-disappear");
    previousDisplay.handleSlideshowTransition(false);
    var currentDisplay = trigger.find(".ds-slideshow-element-" + displayIndex);
    currentDisplay.css("visibility", "visible");
    currentDisplay.css("z-index", "11");
    currentDisplay.handleSlideshowTransition(true, transitionType);
};
jQuery.fn.handleSlideshowTransition = function(setTransition, transitionType){
    var trigger = jQuery(this);
    if (setTransition === true){
        switch (parseInt(transitionType, 10)){
            default:
            case 0:
                trigger.addClass("ds-slideshow-transition-center");
                break;
            case 1:
                trigger.addClass("ds-slideshow-transition-left");
                break;
            case 2:
                trigger.addClass("ds-slideshow-transition-right");
                break;
            case 3:
                trigger.addClass("ds-slideshow-transition-top");
                break;
            case 4:
                trigger.addClass("ds-slideshow-transition-bottom");
                break;
        }
    } else if (setTransition === false){
        trigger.removeClass("ds-slideshow-transition-center");
        trigger.removeClass("ds-slideshow-transition-left");
        trigger.removeClass("ds-slideshow-transition-right");
        trigger.removeClass("ds-slideshow-transition-top");
        trigger.removeClass("ds-slideshow-transition-bottom");
        
    } else {
    }
};
jQuery.fn.slideshowProgress = function(previousIndex, displayIndex){
    var trigger = jQuery(this);
    if (!trigger.checkTemplateVisibility()){
        trigger.stopSingleSlideshow();
        return;
    }
    var delay = null;
    var timedFunctionCall = null;
    if (displayIndex === null){
        delay = 1000 * trigger.find(".ds-slideshow-element-1").getDisplayDurationFromElement();
        trigger.showSlideshowElement(null, 1, trigger.find(".ds-slideshow-element-1").getTransitionFromElement());
        timedFunctionCall = window.setTimeout(function(){
        trigger.slideshowProgress(1, trigger.getNextIndex(1));
        }, delay);
    } else {
        delay = 1000 * trigger.find(".ds-slideshow-element-" + displayIndex).getDisplayDurationFromElement();
        trigger.showSlideshowElement(previousIndex, displayIndex, 
            trigger.find(".ds-slideshow-element-" + displayIndex).getTransitionFromElement());
        timedFunctionCall = window.setTimeout(function(){
        trigger.slideshowProgress(displayIndex, trigger.getNextIndex(displayIndex));
        }, delay);
    }
    trigger.data("slideshowStep", timedFunctionCall);
};
