jQuery(document).ready(function(){
	ds_update_page();
	setInterval(ds_update_page , 10000);
});
jQuery(window).load(getSize());
jQuery(window).resize(myresizer());
