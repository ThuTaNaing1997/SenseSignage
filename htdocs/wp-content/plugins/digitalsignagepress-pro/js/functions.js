var tempWidth = 0;
var tempHeight = 0;
var getSize = function(){
    jQuery('.bgimage').each(function() {
	jQuery(this).parent().width("100%");
	jQuery(this).parent().height("100%");
 	jQuery(this).width("100%");
	jQuery(this).height("100%");

    });
    myresizer();
};
var myresizer = function(){
    jQuery('.bgimage:visible').each(function() {
		var bg = jQuery(this),
		bgImg = jQuery(this).children("img");
		bgImgWidth = bgImg.prop("width");
		bgImgHeight = bgImg.prop("height");
		bgWidth = bg.width();
		bgHeight = bg.height();
		bgRatio = (bgWidth / bgHeight);
		imgRatio =  (bgImgWidth / bgImgHeight);
    var imageResize = function(){
        if(bgRatio > 1) {
            if (imgRatio > 1) {
                bgImg.addClass('imgWidth');
                bgImg.removeClass('imgHeight');
                var newBgImgHeight = bgImg.prop("height");
                if(newBgImgHeight < bgHeight){
                    if ((newBgImgHeight + 1) >= bgHeight){
                    }
                    bgImg.addClass('imgHeight');
                    bgImg.removeClass('imgWidth');
                }
            }
            else {
                bgImg.addClass('imgWidth');
                bgImg.removeClass('imgHeight');
            }
        } else{
            if(imgRatio > 1){
                bgImg.addClass('imgHeight');
                bgImg.removeClass('imgWidth');
            } else{
                bgImg.addClass('imgWidth');
                bgImg.removeClass('imgHeight');
                var newBgImgHeight = bgImg.prop("height");
                if(newBgImgHeight < bgHeight){
                    if ((newBgImgHeight + 1) >= bgHeight){
                    }
                    bgImg.addClass('imgHeight');
                    bgImg.removeClass('imgWidth');
                }  
            }
        }
    };
imageResize();
    });
    pictureResizeFinished = true;
};
jQuery(window).load(function(event){
    myresizer();
});
jQuery(window).resize(function(event){
    if (event.target.tagName === "DIV" || event.target.tagName === "div"){
        return;
    }
    myresizer();
});
