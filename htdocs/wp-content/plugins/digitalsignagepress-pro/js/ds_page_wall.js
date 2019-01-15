jQuery(document).ready(function(){
	window.setInterval(ds_sync_server_time , 2000);
});
jQuery(document).ready(function(){
	fetch_slide_var = window.setTimeout(ds_fetch_next_slide , Math.floor((Math.random() * 50) + 1));
});
