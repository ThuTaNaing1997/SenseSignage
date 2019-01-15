function enableDIV(usedID, IDs) {
    jQuery("#" + usedID).css("visibility", "visible");
    jQuery("#" + usedID).css("display", "block");
    jQuery.fn.handleSlideshowPlayback(usedID);
    startVideosWithMyDSId(usedID);
    for (var ii = 0; ii < IDs.length; ii++) {
        if (IDs[ii] != usedID) {
            jQuery("#" + IDs[ii]).css("display", "none");		
            stopVideosWithMyDSId(IDs[ii]);   	
        }
    }
}
function startVideosWithMyDSId(usedMyDsId) {
    jQuery("#" + usedMyDsId).find("iframe").each(function () {
        if (this.src.indexOf("autoplay=") > -1) {
            var newSrc = jQuery(this).attr('src').replace('autoplay=0', 'autoplay=1');
            jQuery(this).attr('src', newSrc);
            try {
                jQuery(this).contentWindow.reload(true);
            } catch (err) {
            }
        }
    });
    jQuery("#" + usedMyDsId).find("source").each(function () {
        if (jQuery(this).parent().prop("autoplay") > -1) {
            jQuery(this).parent()[0].play();
        }
    });
}
function stopVideosWithMyDSId(usedMyDsId) {
    jQuery("#" + usedMyDsId).find("iframe").each(function () {
        if (this.src.indexOf("autoplay=") > -1) {
            var newSrc = jQuery(this).attr('src').replace('autoplay=1', 'autoplay=0');
            jQuery(this).attr('src', newSrc);
            try {
                jQuery(this).contentWindow.reload(true);
            } catch (err) {
            }
        }
    });
    jQuery("#" + usedMyDsId).find("source").each(function () {
        if (jQuery(this).parent().prop("autoplay") > -1) {
            jQuery(this).parent()[0].pause();
        }
    });
}
