var ds_lastXSetBox = 0;
var randColor = ["#1783C6"];
if (!lmzcal) {
	randColor = ["#1783C6","#3CB371","#20B2AA","#DDA0DD","#FFDAB9","#CD5C5C","#CD853F","#DB7093","#D2B48C","#BC8F8F","#4169E1","#808000","#1E90FF","#A0522D","#A9A9A9","#BDB76B"];
}
function loadCalendar() {
	var myDSIdtemp = jQuery("#currentShowedDSId").val();
	createUpdateSaveForm(myDSIdtemp, "permanent", 0);
	if (lmzcal) return;
	var currentlyClickedWd= "";
        var eventtodelete = [];
        var lasteventid = ""; 
	jQuery('#calendar').fullCalendar({
                defaultDate: moment(),
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
                defaultView: 'month',
		eventColor: '#1783C6',
		editable: true,
		resizable: true,
		timezone: 'local',
		timeFormat: 'HH(:mm)',
		forceEventDuration: '06:00:00',
		defaultTimedEventDuration: '06:00:00',
		slotDuration: '00:30:00',
		droppable: true,
		drop: function(date) {
			var myDSId = jQuery("#currentShowedDSId").val();
			counterWd  = jQuery.fn.getMaxBoxId();
			counterWd++;
			var originalEventObject = jQuery(this).data('eventObject');
			var copiedEventObject = jQuery.extend({}, originalEventObject);
			if (jQuery('#calendar').fullCalendar('getView').name == 'month'){
				copiedEventObject.start = new Date(date.utc() + (1000 * 60 * (new Date()).getTimezoneOffset()));
				var startdate = parseInt(date.utc().format('X')) + ( 60 * (new Date()).getTimezoneOffset());
				var enddate = parseInt(startdate) ;
				enddate += 86400;
				copiedEventObject.allDay = true;
			} else {
				copiedEventObject.start = new Date(date.utc());
				var startdate = parseInt(date.utc().format('X'));
				var enddate = parseInt(startdate) ;
			}
			copiedEventObject.className = originalEventObject.className+' '+'wd'+counterWd+' DS_active';
			var eventID = copiedEventObject.id;
			var tabID = originalEventObject.className.slice(7,8);

			jQuery('#calendar').fullCalendar('renderEvent', copiedEventObject, false);
				jQuery('.side-panel').css('overflow-y','auto');
				jQuery("#save_myDS_form").append(
				'<input type="hidden" id="save_myDS'+ myDSId +'wd'+counterWd+'id" name="save_myDS'+ myDSId +'wd'+counterWd+'id" value="-1">',
				'<input type="hidden" id="save_myDS'+myDSId+'wd'+counterWd+'startd" value="'+startdate+'" name="save_myDS'+ myDSId +'wd'+counterWd+'startd">',
				'<input type="hidden" id="save_myDS'+myDSId+'wd'+counterWd+'endd" value="'+enddate+'" name="save_myDS'+ myDSId +'wd'+counterWd+'endd">');
				jQuery("#eventID").val(eventID);
		},
		eventDrop: function (event) {
			var myDSId = jQuery("#currentShowedDSId").val();
			var dragID = event.className[1];
			if (( jQuery('#calendar').fullCalendar('getView').name == 'agendaWeek' || jQuery('#calendar').fullCalendar('getView').name == 'agendaDay' || jQuery('#calendar').fullCalendar('getView').name == 'month')  && event.allDay == true){
				var myEndTime = event.end;
				var endds= new Date(myEndTime + (60 * 1000 * (new Date()).getTimezoneOffset()) );
				if (event.allDay == true && endds.getHours() == 0 && endds.getMinutes() == 0 && endds.getSeconds() == 0){
					endds = new Date(endds.getTime() -1000);
				}
				jQuery('input[id^="save_myDS'+myDSId+dragID+'startd"]').val( parseInt(event.start.format('X'))  + ( 60 * (new Date()).getTimezoneOffset())  );
				jQuery('input[id^="save_myDS'+myDSId+dragID+'endd"]').val( parseInt(endds.getTime() /1000)  );
			} else if ((jQuery('#calendar').fullCalendar('getView').name == 'month' && event.allDay == true) || (jQuery('#calendar').fullCalendar('getView').name != 'month' && event.allDay == true)){
				jQuery('input[id^="save_myDS'+myDSId+dragID+'startd"]').val(parseInt(event.start.format('X')));
				jQuery('input[id^="save_myDS'+myDSId+dragID+'endd"]').val(parseInt(event.end.format('X')));
			} else {
				jQuery('input[id^="save_myDS'+myDSId+dragID+'startd"]').val(parseInt(event.start.format('X')));
				jQuery('input[id^="save_myDS'+myDSId+dragID+'endd"]').val(parseInt(event.end.format('X')));
			}
		},
		eventResize: function (event) {
			var myDSId = jQuery("#currentShowedDSId").val();
			var dragID = event.className[1];
			if (( jQuery('#calendar').fullCalendar('getView').name == 'agendaWeek' || jQuery('#calendar').fullCalendar('getView').name == 'agendaDay' || jQuery('#calendar').fullCalendar('getView').name == 'month')  && event.allDay == true){
				var myEndTime = event.end;
				var endds= new Date(myEndTime + (60 * 1000 * (new Date()).getTimezoneOffset()) );
				if (event.allDay == true && endds.getHours() == 0 && endds.getMinutes() == 0 && endds.getSeconds() == 0){
					endds = new Date(endds.getTime() -1000);
				}				
				jQuery('input[id^="save_myDS'+myDSId+dragID+'startd"]').val( parseInt(event.start.format('X'))  + ( 60 * (new Date()).getTimezoneOffset())  ); 
				jQuery('input[id^="save_myDS'+myDSId+dragID+'endd"]').val( parseInt(endds.getTime() /1000)  ); 
			} else if ((jQuery('#calendar').fullCalendar('getView').name == 'month' && event.allDay == true) || (jQuery('#calendar').fullCalendar('getView').name != 'month' && event.allDay == true)){
				jQuery('input[id^="save_myDS'+myDSId+dragID+'startd"]').val(parseInt(event.start.format('X')));
				jQuery('input[id^="save_myDS'+myDSId+dragID+'endd"]').val(parseInt(event.end.format('X')));
			} else {
				jQuery('input[id^="save_myDS'+myDSId+dragID+'startd"]').val(parseInt(event.start.format('X')));
				jQuery('input[id^="save_myDS'+myDSId+dragID+'endd"]').val(parseInt(event.end.format('X')));
			}
		},
		eventClick: function(event) {
			var tabID = event.className[0];
			var tabid = tabID.replace('tabhead','');
			var wdID = event.className[1];
			var myDSId = jQuery("#currentShowedDSId").val();
			currentlyClickedWd = wdID;
			jQuery('#timepicker1').remove();
			jQuery('#timepicker2').remove();
				jQuery('#eventID').val(parseInt(tabid,10));
				if (tabscr[tabid] != jQuery("#currentShowedDSId").val()){
					ds_switchTab(parseInt(tabid,10));
					ds_unhideTab(parseInt(tabid,10));
					return;
		    		}
				jQuery( "#startd" ).datepicker({
					  dateFormat: "yy-mm-dd",
						yearRange: '2016:2100',
						minDate: new Date(2016, 6 - 1, 1),
						maxDate: '+30Y'
				});
				jQuery( "#endd" ).datepicker({
						dateFormat: "yy-mm-dd",
						yearRange: '2016:2100',
						minDate: new Date(2016, 6 - 1, 1),
						maxDate: '+30Y'
				});
				jQuery('#fullCalModal .button').on("click",function(){
					if (tabscr[tabid] == jQuery("#currentShowedDSId").val() && wdID == currentlyClickedWd ){
						var startd = jQuery( "#startd" ).datepicker( "getDate" ).getTime()/1000;
						var endd = jQuery( "#endd" ).datepicker( "getDate" ).getTime()/1000;
						endd += 86400;
						var d = new Date();
						var timepicker1 = jQuery('#timepicker1').val();
						var hourAr = timepicker1.split(":");
						var datepicker1 = jQuery('#startd').val();
						var dateAr = datepicker1.split("-");
						var newDate1 = new Date(parseInt(dateAr[0]), (parseInt(dateAr[1]) -1 ), parseInt(dateAr[2]), parseInt(hourAr[0]), parseInt(hourAr[1]), 0, 0);
						var newTime1 = (newDate1.getTime()/1000);
						var timepicker2 = jQuery('#timepicker2').val();
						var hourAr2 = timepicker2.split(":");
						var datepicker2 = jQuery('#endd').val();
						var dateAr2 = datepicker2.split("-");
						var esec = 0;
						if (parseInt(hourAr2[1]) == 59) esec = 59;
						var newDate2 = new Date(parseInt(dateAr2[0]), (parseInt(dateAr2[1]) -1 ), parseInt(dateAr2[2]),
								parseInt(hourAr2[0]), parseInt(hourAr2[1]), esec, 0);
						var newTime2 = (newDate2.getTime()/1000);
						if ( (parseInt(hourAr[0]) == 0 && parseInt(hourAr[1]) == 0 ) &&
						 	( (parseInt(hourAr2[0])==0 && parseInt(hourAr2[1])==0 ) || (parseInt(hourAr2[0]) ==23 && parseInt(hourAr2[1])==59 ) ) ){
							allDayVar = true;
						} else {
							allDayVar = false;
						}
						event.allDay = allDayVar;
						event.start = (parseInt(newTime1)*1000);
						event.end  = (parseInt(newTime2)*1000);
						if (allDayVar == true){
							event.end  = (parseInt(newTime2)*1000) + 86400000 ;
						}
						jQuery('input[id^="save_myDS'+myDSId+wdID+'startd"]').val(newTime1);
						jQuery('input[id^="save_myDS'+myDSId+wdID+'endd"]').val(newTime2);
						jQuery('#fullCalModal').modal('hide');
						jQuery('#calendar').fullCalendar('updateEvent', event);
					}
				});
				jQuery('#modalTitle').html(event.title);
				var myStartTime = event.start;
				var myEndTime = event.end;
				var endds;
				if (event.end){
					endds= new Date(myEndTime);
					if (event.allDay == true){
						myStartTime += (60 * 1000 * (new Date()).getTimezoneOffset() );
						endds= new Date((myEndTime += (60 * 1000 * (new Date()).getTimezoneOffset() ) ));
					}
					if (event.allDay == true && endds.getHours() == 0 && endds.getMinutes() == 0 && endds.getSeconds() == 0){
						endds = new Date(myEndTime -1000);
					}
				} else {
					if (event.allDay == true){
						myStartTime += (60 * 1000* (new Date()).getTimezoneOffset() );
						endds = new Date((myStartTime + (86400*1000))-1000);
					}
				}
				var oldHtml = jQuery(".timepickerc1").html();
				var newHtml = '<input id="timepicker1" type="text" class=" form-control input-small " style="width: 50px;">' + oldHtml;
				jQuery(".timepickerc1").html(newHtml);
				var oldHtml2 = jQuery(".timepickerc2").html();
				var newHtml2 = '<input id="timepicker2" type="text" class=" form-control input-small " style="width: 50px;">' + oldHtml;
				jQuery(".timepickerc2").html(newHtml2);
				var startds= new Date(myStartTime);
				var sday1 = startds.getDate();
        			var smonth1 =startds.getMonth() + 1;
				var shour1 = startds.getHours();
				var smin1 = startds.getMinutes();
				var ssec1 = startds.getSeconds();
       	 			var syear1 = startds.getFullYear();
				if(sday1 < 10) sday1 = "0"+sday1;
				if(smonth1 < 10) smonth1 = "0"+smonth1;
        			var sfullDate = syear1 + "-" + smonth1 + "-" + sday1;
				if(smin1 < 10) smin1 = "0"+smin1;
				var sfullTime = shour1 + ":"+smin1;
				jQuery('#startd').val(sfullDate);
				jQuery('#timepicker1').val(sfullTime);
				jQuery('.timepickerc1 .input-group-addon').on("click", function(){
				});
				var eday1 = endds.getDate();
        			var emonth1 =endds.getMonth() + 1;
				var ehour1 = endds.getHours();
				var emin1 = endds.getMinutes();
				var esec1 = endds.getSeconds();
        			var eyear1 = endds.getFullYear();
				if(emonth1 < 10) emonth1 = "0"+emonth1;
				if(eday1 < 10) eday1 = "0"+eday1;
       		 		var efullDate = eyear1 + "-" + emonth1 + "-" + eday1;
				if(emin1 < 10) emin1 = "0"+emin1;
				var efullTime = ehour1 + ":"+emin1;
				jQuery('#endd').val(efullDate );
				jQuery('#timepicker2').val(efullTime);
				jQuery('.timepickerc2 .input-group-addon').on("click", function(){
				});
				jQuery('#fullCalModal').modal();
				var mytimepicker1 = jQuery('#timepicker1').timepicker({
					appendWidgetTo: '.timepickerc1',
					minuteStep: 1,
					showMeridian: false,
					defaultTime: false});
				var mytimepicker2 = jQuery('#timepicker2').timepicker({
					appendWidgetTo: '.timepickerc2',
					minuteStep: 1,
					showMeridian: false,
					defaultTime: false});
				jQuery('#timepicker1').timepicker().on('hide.timepicker', function(e) {
				  });
				jQuery(".close").click(function(){
				});
		},
		eventRender: function(event, element) {
			var dragID = event.className[2];
			if(dragID == 'DS_active') {
		element.append( "<span class='closeon'>X</span>" );
		element.find(".closeon").click(function() {
		jQuery('#calendar').fullCalendar('removeEvents',event._id);
		var myDSId = jQuery("#currentShowedDSId").val();
		var dragID = event.className[1];
		jQuery("#save_myDS"+ myDSId +dragID+"id").remove();
		jQuery("#save_myDS"+ myDSId +dragID+"startd").remove();
		jQuery("#save_myDS"+ myDSId +dragID+"endd").remove();
		});
		}
		}
	});
	jQuery("#calendar").append('<input type="hidden" id="eventID" value="0">');
}
function loadEventCal(wdID,title,start,end) {
	var events = [];
	var eventID = jQuery("#eventID").val() % randColor.length;
	var startO = new Date(parseInt(start)*1000);
	var endO = new Date(parseInt(end)*1000);
	startd = startO.toISOString();
	endd = endO.toISOString();
	var allDayVar = false;
	var shours = startO.getHours();
	var sminutes = startO.getMinutes();
	var sseconds = startO.getSeconds();
	var ehours = endO.getHours();
	var eminutes = endO.getMinutes();
	var eseconds = endO.getSeconds();
	if ( (shours == 0 && sminutes == 0 && sseconds == 0) &&
	 	( (ehours==0 && eminutes==0 && eseconds==0 ) || (ehours==23 && eminutes==59 && eseconds==59) ) ){
		allDayVar = true;
	}
	var endEvent = endd;
	if ((endO.getTime()/1000) - (startO.getTime()/1000) > 86400 && allDayVar == true){
		endEvent = new Date((endO.getTime() + 86400000)).toISOString();
	}
	events.push({
		title: title,
		start: startd,
		end: endEvent,
		className: 'tabhead'+eventID+' wd'+wdID+' DS_active',
		allDay: allDayVar,
		color: randColor[eventID]
	});
	if (!lmzcal) jQuery('#calendar').fullCalendar( 'addEventSource', events );
}
function loadEventCal2(dSId,dsfield,title,start,end) {
	var events = [];
	var startO = new Date(parseInt(start)*1000);
	var endO = new Date(parseInt(end)*1000);
	start = startO.toISOString();
	end = endO.toISOString();
	var allDayVar = false;
	var shours = startO.getHours();
	var sminutes = startO.getMinutes();
	var sseconds = startO.getSeconds();
	var ehours = endO.getHours();
	var eminutes = endO.getMinutes();
	var eseconds = endO.getSeconds();
	if ( (shours == 0 && sminutes == 0 && sseconds == 0) &&
		( (ehours==0 && eminutes==0 && eseconds==0 ) || (ehours==23 && eminutes==59 && eseconds==59) ) ){
		allDayVar = true;
	}
	var endEvent = end;
	if ((endO.getTime()/1000) - (startO.getTime()/1000) > 86400 && allDayVar == true){
		endEvent = new Date((endO.getTime() + 86400000)).toISOString();
	}
	var founditem = false;
 jQuery('form#save_myDS_form input[id^="save_myDSSID"]').each(function() {
	var val = jQuery(this).val();
	if (val == dSId) {
		founditem = true;
		var idx = jQuery(this).attr('id');
		var temp = idx.replace('save_myDSSID', '');
		var finalId = parseInt(temp, 10)-1;
		events.push({
			title: title,
			start: start,
			end: endEvent,
			editable: false,
			allDay: allDayVar,
			className: 'tabhead'+finalId,
			color: '#CCCCCC'
		});
	}
	});
if (founditem == false){
  jQuery('div#load_form input[id^="load_myDSSID"]').each(function() {
	var val = jQuery(this).val();
	if (val == dSId) {
		var idx = jQuery(this).attr('id');
		var temp = idx.replace('load_myDSSID', '');
		var finalId = parseInt(temp, 10)-1;
		events.push({
					 title: title,
					 start: start,
					 end: endEvent,
					 editable: false,
					 allDay: allDayVar,
					 className: 'tabhead'+finalId,
					 color: '#CCCCCC'
		});
	}
	});
}
	if (!lmzcal) jQuery('#calendar').fullCalendar( 'addEventSource', events );
}

function caldragstart(){
		jQuery('#titletabs > li').each(function(i) {
			var bgcolor = jQuery('#tabhead'+i).css('background-color');
			var eventObject = {
				className: 'tabhead'+i,
				title: jQuery('#tabtitle'+i).text(),
				color: ''+bgcolor+'',
    				textColor: 'white',
			};
			var sliderTab = jQuery("#tabhead"+i).data('eventObject', eventObject);
		});
}
var last_showDrop = 0;
function ds_showDrop(ev, day) {
	var time = Math.floor(Date.now() / 1);
	if (time - last_showDrop < 70) {
		return;
	}
	last_showDrop = time;
	if (jQuery('#drag-clone').length > 0 && day > 0) {
		ds_allowDrop(ev, day);
	}
}
function ds_allowDrop(ev, day) {
    ev.preventDefault();
    var offset = jQuery('.day_box').offset();
	var x = Math.round(ev.pageX - offset.left);
    if (jQuery('#calendar').find("#box9999").length == 0  && x > 1){
    	jQuery.fn.createBoxSimulate("day"+day);
    	jQuery("#box9999").css("left", x+"px");
    	ds_lastXSetBox = x;
    } else {
    	if (x > 1){
	    	var ds_changedBox = false;
	    	var resSim = jQuery('#calendar').find("#box9999").parent().attr("class");
	    	var resSimAr = resSim.split(" ");
	    	for (var i=0; i < resSimAr.length ; i++){
	    		if (resSimAr[i].startsWith("day")){
	    			var curNr = resSimAr[i].substring(3, resSimAr[i].length);
	    			if (curNr != day){
	    				jQuery("#box9999").remove();
	    				jQuery.fn.createBoxSimulate("day"+day);
	    				jQuery("#box9999").css("left", x+"px");
	    				ds_lastXSetBox = x;
	    				ds_changedBox = true;
	    			}
	    		}
	    	}
	    	if (!ds_changedBox && x > 0 && ((ds_lastXSetBox - x) > 4 || (ds_lastXSetBox - x) < -4)){
	    		jQuery("#box9999").css("left", x+"px");
	    		ds_lastXSetBox = x;
	    	}
    	} else {
    		jQuery("#box9999").remove();
    	}
    }
}
function ds_drag(dragTabNr) {
    if (tabscr[dragTabNr] != jQuery("#currentShowedDSId").val()){
    	ds_switchTab(dragTabNr);
	if (!lmzcal) jQuery("#dragID").val('');
    }
}
function ds_drop(ev, day) {
	ev.preventDefault();
	try {
		jQuery("#box9999").remove();
		if (jQuery(ev.target).hasClass('ui-sortable-handle')) {
			var newBoxId = jQuery.fn.createBox("day"+day);
			var offset = jQuery('.day_box').offset();
			var x = Math.round(parseInt(ev.pageX - offset.left));
			jQuery(newBoxId).css("left", (x-(x%4))+"px");
			jQuery.fn.ResizeDayBox(newBoxId);
		}
	} catch (e) {
	}
}
function ds_call_hideportrait() {
	if (jQuery("#save_nrOfScreens").length == 0 || jQuery("#save_nrOfScreens").val() < 2) {
		ds_hideportrait();
	} else {
		document.getElementById('pageorientationmodal_content').innerHTML = ds_translation.stringSwitchLandscape;
		document.getElementById('pageorientationmodal_proceed').setAttribute('onclick', 'ds_hideportrait();');
		jQuery('#pageorientationmodal').modal('show');
	}
	if (typeof(check_fav) == "function") check_fav(1);
}
function ds_call_hidelandscape() {
	if (jQuery("#save_nrOfScreens").length == 0 || jQuery("#save_nrOfScreens").val() < 2) {
		ds_hidelandscape();
	} else {
		document.getElementById('pageorientationmodal_content').innerHTML = ds_translation.stringSwitchPortrait;
		document.getElementById('pageorientationmodal_proceed').setAttribute('onclick', 'ds_hidelandscape();');
		jQuery('#pageorientationmodal').modal('show');
	}
	if (typeof(check_fav) == "function") check_fav(2);
}
function ds_hideportrait() {
	jQuery(".owl-carousel1").owlCarousel({
		items: 7,
		navigation:true,
		navigationText: [
			"<i class='fa-chevron-left icon-white'><</i>",
			"<i class='fa-chevron-right icon-white'>></i>"
		]
	 });
	document.getElementById("themeportraitpreview").style.display="none";
	document.getElementById("themelandscapepreview").style.display="";
	document.getElementById("selector_landscape").className="selected_layout";
	document.getElementById("selector_portrait").className="";
	jQuery("#btn-format-landscape-original").trigger("click");
	updateFormatSaveForm(1);
}
function ds_hidelandscape() {
	jQuery(".owl-carousel2").owlCarousel({
		items: 14,
		navigation:true,
		navigationText: [
			"<i class='icon-chevron-left icon-white'><</i>",
			"<i class='icon-chevron-right icon-white'>></i>"
		]
	});
	document.getElementById("themeportraitpreview").style.display="";
	document.getElementById("themelandscapepreview").style.display="none";
	document.getElementById("selector_landscape").className="";
	document.getElementById("selector_portrait").className="selected_layout";
	jQuery("#btn-format-portrait-original").trigger("click");
	updateFormatSaveForm(2);
}
function updateFormatSaveForm(ft) {
	var screens = (jQuery('#save_nrOfScreens').length > 0 ? jQuery('#save_nrOfScreens').val() : (jQuery('#load_nrOfScreens').length > 0 ? jQuery('#load_nrOfScreens').val() : 0));
	for (var i = 1; i <= screens; i++) {
		var curDSId = (jQuery('#save_myDSSID'+i).length > 0 ? jQuery('#save_myDSSID'+i).val() : (jQuery('#load_myDSSID'+i).length > 0 ? jQuery('#load_myDSSID'+i).val() : ""));
		if (curDSId != "") {
			createUpdateSaveForm(curDSId, "Format", ft);
		}
	}
}
var maxTab=1;
var tabscr = [];
function ds_updateTitle(number) {
	var title = document.getElementById("screen-title_"+number).value;
	if (title != "") {
		var elem = document.getElementById("tabtitle"+number);
		if (elem == null) {
			ds_createNewSlide();
			var elem = document.getElementById("tabtitle"+number);
		}
		document.getElementById("tabtitle"+number).innerHTML = title;
		ds_updateScreenName(tabscr[number], title);
		ds_checkEditField(number);
	}
	ds_updateScheduleTitle(number);
}
function ds_updatePlayduration(number){
	var playdur = document.getElementById("playduration"+number).value;
	if (playdur != "") {
		var DSId = tabscr[number];
		if (jQuery("#save_myDS"+ DSId +"playduration").length == 0){
			var newinputName = "<input type=\"hidden\" id=\"save_myDS"+ DSId +"playduration\" name=\"save_myDS"+ DSId +"playduration\" value=\""+ playdur +"\">";
			jQuery("#save_myDS_form").append(newinputName);
		} else {
			jQuery("#save_myDS"+ DSId +"playduration").val(playdur);
		}
	}
}
function ds_updateScheduleTitle(number) {
	var title = document.getElementById("screen-title_"+number).value;
				if (title != "") {
		document.getElementById("schedule_slidetitle").innerHTML = title;
	} else {
		document.getElementById("schedule_slidetitle").innerHTML = document.getElementById("tabtitle"+number).innerHTML;
	}
}
function ds_callModal(number) {
	var text = document.getElementById("screen-title_"+number).value;
	if (text == "") {
		text = ds_translation.stringNewSlide+" "+(number+1);
	}
	document.getElementById("screen-title_"+(number)).value = text;
}
function ds_checkEditField(number) {
 	if (!document.getElementById("tab"+(number+1))){
		var modal = document.createElement("div");
		modal.id='modal'+(number+1);
		modal.className='modal fade';
		modal.role='dialog';
		modal.innerHTML='<div class="modal-dialog"><div class="modal-content"><div class="modal-body"><button type="button" class="close" data-dismiss="modal">&times;</button><div id="tab'+(number+1)+'" class="step-content-title cannotbeempty"><div id="tabcontent" class="titles active">'+ ds_translation.stringSlideName +'<input id="screen-title_'+(number+1)+'" type="text" autofocus="" value="" maxlength="50" autocomplete="off" onkeyup="ds_updateTitle('+(number+1)+')" onchange="ds_updateTitle('+(number+1)+')"><input id="save'+(number+1)+'" class="big-btn lead-button-big" type="button" onclick="ds_updateTitle('+(number+1)+')" data-dismiss="modal" value="'+ds_translation.stringChange+'"></input><input class="big-btn lead-button-big" type="button" data-dismiss="modal" value="'+ ds_translation.stringClose +'"></input></div></div></div></div></div>';
		document.getElementById("titlecontent").appendChild(modal);
	}
}
var ccounter=1%randColor.length;
var dsLoadState = 0;
function ds_createNewSlide() {
	window.scrollTo(0, 0);
	var temp = document.getElementById("screen-list");
	if (temp.style.display == "none") {
		temp.style.display = "";
		document.getElementById("screen-list_label").style.display = "";
		document.getElementById("screen-list_spacer").style.display = "";
		document.getElementById('box-bg-overlay1').style.display="none";
		ds_updateScheduleTitle(0);
		return;
	}
	var titletabs = document.getElementById("titletabs");
	if (jQuery('.tabheads').length > 0) {
		var number = -1;
		jQuery('.tabheads').each(function() {
			var tnumber = parseInt(this.id.replace("tabhead", ""), 10);
			if (tnumber > number) {
				number = tnumber;
			}
		});
	} else {
		var number = -1;
	}
	maxTab = number+1;
	if (tabscr.length <= maxTab) {
		var highestXVal = 0;
		for (var z=0; z < tabscr.length; z++) {
			var curVal = tabscr[z];
			if ((curVal+"").substr(0,1) == "X") {
				curValInt = (curVal+"").substr(1, curVal.length);
				if (parseInt(curValInt,10) > parseInt(highestXVal, 10)) highestXVal = curValInt;
			}
		}
		highestXVal++;
		tabscr.push("X"+highestXVal);
		ds_addNewScreenToProgram(highestXVal);
	}
	var lielem=document.createElement("li");
	lielem.id='tabhead'+(number+1);
	lielem.className='tabheads';
	if (lmzcal) {
		lielem.setAttribute("draggable", "true");
		lielem.setAttribute("ondragstart", "ds_drag("+(number+1)+")");
		lielem.setAttribute("onclick", "ds_switchTab("+(number+1)+");ds_unhideTab("+(number+1)+")");
	} else {
		lielem.setAttribute("onMouseDown", "jQuery('#eventID').val('" +(number+1) + "'); ds_drag(" +(number+1) + "); ds_unhideTab("+(number+1)+");");
	}
	lielem.style.display = "block";

	var color = randColor[ccounter];
 	lielem.style.cssText = "padding-bottom: 1px; background-color: "+color+"";
	ccounter = (ccounter+1) % randColor.length;
	var aelem=document.createElement("a");
	aelem.id='tabtitle'+(number+1);
	aelem.className="screen-list-button";
	aelem.setAttribute("data-toggle", "tab");
	aelem.style.display = "block";
	aelem.innerHTML = ds_translation.stringNewSlide+" "+(number + 2);
	var divelem = document.createElement("div");
	divelem.className="screen-quick-menu";
	var ulelem = document.createElement("ul");
	ulelem.className="screen-submenu";
	var imgtemp = document.createElement("img");
	imgtemp.src = "";
	imgtemp.id = "tabheadsimg"+(number+1);
	imgtemp.className = "tabheadsimg";
	imgtemp.style.cssText = "margin-left: auto; margin-right: auto; height: 124px; display: none; max-width: 100%;";
	var playdurelem = document.createElement("div");
	playdurelem.style.cssText = "display: block; margin-bottom: 12px;";
	var pdD = "<div id=\"tabheadsdplayd"+(number+1)+"\" class=\"lable text-left\" style=\"margin-top: 7px; margin-left: 1px;\">"+ ds_translation.stringSlideduration +"</div>";
	var pdI = "<input placeholder=\"0\" type=\"number\" id=\"playduration"+(number+1)+"\" name=\"playduration"+(number+1)+"\" onkeyup=\"ds_updatePlayduration("+(number+1)+")\" onchange=\"ds_updatePlayduration("+(number+1)+")\" style=\"position: absolute; right: 32px; bottom: 6px; width: 7em;\" length=\"5\" maxlength=\"5\" min=\"0\" max=\"99999\" value=\"\" class=\"ds-input-check-value\">";
	var pdS = "<span style=\"position: absolute; right: 3px; bottom: 12px; color: white;\"> "+ ds_translation.stringSec +". </span>";
	playdurelem.innerHTML = pdD+ pdI+ pdS;
	if (maxTab > 1){
		jQuery("#tabheadsdplayd0").css("display", "block");
	}
	var li1elem = document.createElement("li");
	li1elem.id='litabswitch'+(number+1);
	li1elem.innerHTML='<a id="litabmodal'+(number+1)+'" class="screen-edit" onclick="ds_callModal('+(number+1)+');" data-toggle="modal" data-target="#modal'+(number+1)+'"></a>';
	var li3elem = document.createElement("li");
	li3elem.id='litabdelete'+(number+1);
	li3elem.setAttribute("onclick", "ds_deleteTab(event, " +(number+1) + ")");
	var li3aelem = document.createElement("a");
	li3aelem.className="screen-delete";
	titletabs.appendChild(lielem);
	lielem.appendChild(aelem);
	lielem.appendChild(divelem);
	lielem.appendChild(imgtemp);
	lielem.appendChild(playdurelem);
	divelem.appendChild(ulelem);
	ulelem.appendChild(li3elem);
	ulelem.appendChild(li1elem);
	li3elem.appendChild(li3aelem);
	ds_checkEditField(number);
	ds_updateTitle((number+1));
	var screenId = tabscr[0];
	var screenFormat2 = jQuery("#save_myDS" + screenId + "Format");
	if (screenFormat2.length <= 0) {
		screenFormat2 = jQuery("#load_myDS" + screenId + "Format");
	}
	if (screenFormat2.val() == 1){
		ds_hideportrait();
	} else {
		ds_hidelandscape();
	}
	ds_switchTab(number+1);
	ds_unhideTab(number+1);
	caldragstart();
	if (dsLoadState > 0) {
		ds_reload_draggable();
	}
}
function ds_unhideTab(number) {
	document.getElementById('box-bg-overlay1').style.display="none";
	var cur_id = document.getElementById("save_myDSSID"+(number+1));
	if (cur_id == null) {
		cur_id = document.getElementById("load_myDSSID"+(number+1));
	}
	if (document.getElementById('check_myDS'+cur_id.value) != null) {
		if (document.getElementById('check_myDS'+cur_id.value).value > 0) {
			document.getElementById('box-bg-overlay2').style.display="none";
			document.getElementById('box-bg-overlay3').style.display="none";
			return;
		}
	} else {
		var newinput = document.createElement("input");
		newinput.id = 'check_myDS'+cur_id.value;
		newinput.name = 'check_myDS'+cur_id.value;
		newinput.type = 'hidden';
		newinput.value = '0';
		document.getElementById("load_form").appendChild(newinput);
	}
	document.getElementById('box-bg-overlay2').style.display="";
	document.getElementById('box-bg-overlay3').style.display="";
}
function ds_switchTab(number) {
	if (number>=maxTab) {
		maxTab=number+1;
	}
	jQuery('.titles').removeClass('active');
	var screenId = tabscr[number];
	for (a = 0; a <= maxTab; a++) {
		if (document.getElementById("tab"+a)) {
			if (a==number) {
				document.getElementById("tab"+number).style.display = "block";
			} else {
				document.getElementById("tab"+a).style.display = "none";
			}
		}
		if (document.getElementById("tabheadsimg"+a)) {
			if (a==number) {
				document.getElementById("tabheadsimg"+number).style.maxWidth = "100%";
			} else {
				document.getElementById("tabheadsimg"+a).style.maxWidth = "100%";
			}
		}
		if (document.getElementById("tabtitle"+a)) {
			if (a == number) {
				document.getElementById("tabtitle"+number).className="screen-list-button-active";
				var playdurload = jQuery("#save_myDS" + screenId + "playduration");
				if (playdurload.length <= 0) {
					playdurload = jQuery("#load_myDS" + screenId + "playduration");
				}
				document.getElementById("playduration"+number).value = playdurload.val();
				var templateId2 = jQuery("#save_myDS" + screenId + "TemplateId");
				if (templateId2.length <= 0) {
					templateId2 = jQuery("#load_myDS" + screenId + "TemplateId");
				}
				var screenFormat2 = jQuery("#save_myDS" + screenId + "Format");
				if (screenFormat2.length <= 0) {
					screenFormat2 = jQuery("#load_myDS" + screenId + "Format");
				}
				var pictPath = wordPressTemplateIconArray[templateId2.val()];
				if (templateId2.val() == -1 && screenFormat2.val() == 1){
					pictPath = jQuery("#layout-custom-landscape").find("#plandscape").attr('src');
				} else if (templateId2.val() == -1 && screenFormat2.val() == 2){
					pictPath = jQuery("#layout-custom-portrait").find("#pportrait").attr('src');
				}
				document.getElementById("tabheadsimg"+number).src= pictPath;
				if (tabscr.length > 1){
					jQuery("#tabheadsdplayd"+number).css("display", "block");
				}
				if (tabscr.length > 1){
					jQuery("#tabheadsdplayd0").css("display", "block");
				}
			} else {
				document.getElementById("tabtitle"+a).className="screen-list-button";
			}
		}
	}
	if (tabscr.length <= number) {
		var highestXVal = 0;
		for (var z=0; z < tabscr.length; z++) {
			var curVal = tabscr[z];
			if ((curVal+"").substr(0,1) == "X") {
				curValInt = (curVal+"").substr(1, curVal.length);
				if (parseInt(curValInt,10) > parseInt(highestXVal, 10)) highestXVal = curValInt;
			}
		}
		highestXVal++;
		tabscr.push("X"+highestXVal);
		ds_addNewScreenToProgram(highestXVal);
	}
	jQuery.fn.triggerFullFormUpdate();
	jQuery.fn.displayScreen(tabscr[number]);
	setCurrentScreen(tabscr[number]);
	jQuery('.tabheads').removeClass('active');
	jQuery('.tabheads').css("border","2px solid white");
	jQuery('.tabheadsimg').css("margin-left","auto");
	jQuery('.tabheadsimg').css("margin-right","auto");
	jQuery('.tabheadsimg').css("height","124px");
	jQuery("#tabhead"+number).addClass("active");
	if (document.getElementById("tabheadsimg"+number).style.display != 'none') {
		jQuery('#tabhead'+number).css("border", "2px solid #"+bcolor);
	}
	jQuery('#tabhead'+number).find(".tabheadsimg").css("margin-left","auto");
	jQuery('#tabhead'+number).find(".tabheadsimg").css("margin-right","auto");
	jQuery('#tabhead'+number).find(".tabheadsimg").css("height","122px");
	updateDate();
	var templateElemId = "#pportrait";
	var templateId = jQuery("#save_myDS" + screenId + "TemplateId");
	if (templateId.length <= 0) {
		templateId = jQuery("#load_myDS" + screenId + "TemplateId");
	}
	var screenFormat = jQuery("#save_myDS" + screenId + "Format");
	if (screenFormat.length <= 0) {
		screenFormat = jQuery("#load_myDS" + screenId + "Format");
	}
	if (templateId.val() === undefined || templateId.val() < 0) {
		if (screenFormat.val() === undefined || screenFormat.val() < 2) {
			var templateElemId = "#plandscape";
		}
	} else {
		var templateElemId = ".template"+templateId.val();
	}
	jQuery(".owlselected").removeClass("owlselected");
	jQuery(templateElemId).addClass("owlselected");
	if (screenFormat.val() === undefined || screenFormat.val() < 2) {
		ds_hideportrait();
	} else {
		ds_hidelandscape();
	}
	var temAr = jQuery(templateElemId);
	if (temAr.length > 0) {
		var temEl = temAr[0];
		var query = ".owl-carousel2";
		if (temEl.id == "plandscape") {
			query = ".owl-carousel1";
		}
		query += " .owl-wrapper-outer .owl-wrapper div.owl-item";
			var x = jQuery(query).children(":visible").index(jQuery(templateElemId).parent());
			if (x > -1) {
				if (temEl.id == "plandscape") {
					jQuery(".owl-carousel1").trigger('owl.goTo', x);
				} else {
					jQuery(".owl-carousel2").trigger('owl.goTo', x);
				}
			}
	}
	ds_updateScheduleTitle(number);
	ds_checkDisplayScheduling(screenId);
}
function ds_checkDisplayScheduling(screenId){
	var haveSchedValues = false;
	for (var g=0; g<=70;g++){
		if (jQuery("#save_myDS"+screenId+"wd"+g+"startd").length > 0){
			haveSchedValues = true;
			break;
		}
	}
	if (!haveSchedValues && (jQuery("#save_myDS"+screenId+"startdate").val() > 0 || jQuery("#save_myDS"+screenId+"enddate").val() > 0)){
		haveSchedValues = true;
	}
	if (!haveSchedValues && (jQuery("#save_myDS"+screenId+"dayofmonthstart").val() > 0 || jQuery("#save_myDS"+screenId+"dayofmonthend").val() > 0)){
		haveSchedValues = true;
	}
	if (haveSchedValues){
		jQuery('.collapse_scheduling').css('visibility', 'visible');
		jQuery('#sched_rad_1').prop('checked',false);
		jQuery('#sched_rad_2').prop('checked',true);
		jQuery('.collapse_scheduling').css('height', '100%');
	} else {
		jQuery('.collapse_scheduling').css('visibility', 'hidden');
		jQuery('#sched_rad_1').prop('checked',true);
		jQuery('#sched_rad_2').prop('checked',false);
		jQuery('.collapse_scheduling').css('height', '0px');

	}
}
function ds_deleteAllScheduling(){
	var screenId = jQuery("#currentShowedDSId").val();
	for (var g=0; g<=70;g++){
		jQuery("#save_myDS"+screenId+"wd"+g+"id").remove();
		jQuery("#save_myDS"+screenId+"wd"+g+"startd").remove();
		jQuery("#save_myDS"+screenId+"wd"+g+"starth").remove();
		jQuery("#save_myDS"+screenId+"wd"+g+"startm").remove();
		jQuery("#save_myDS"+screenId+"wd"+g+"endd").remove();
		jQuery("#save_myDS"+screenId+"wd"+g+"endh").remove();
		jQuery("#save_myDS"+screenId+"wd"+g+"endm").remove();
	}
	if (!lmzcal) jQuery('#calendar').fullCalendar('removeEvents');
	createUpdateSaveForm(screenId, "permanent", 1);
	jQuery("#save_myDS"+screenId+"startdate").val(0);
	jQuery("#save_myDS"+screenId+"enddate").val(0);
	jQuery("#save_myDS"+screenId+"active_show_by_date").val("false");
	jQuery("#cb_active_show_by_date").prop( "checked", false );
	jQuery("#cb_startdate").val(0);
	jQuery("#cb_enddate").val(0);
	jQuery("#startdate").val(0);
	jQuery("#enddate").val(0);
	jQuery("#active_show_by_date").val(0);
	jQuery("#save_myDS"+screenId+"dayofmonthstart").val(0);
	jQuery("#save_myDS"+screenId+"dayofmonthend").val(0);
	jQuery("#save_myDS"+screenId+"active_show_by_day_of_month").val("false");
	jQuery("#cb_active_show_by_day_of_month").prop( "checked", false );
	jQuery("#dayofmonthstart").val("0");
	jQuery("#dayofmonthend").val("0");
	jQuery("#active_show_by_day_of_month").val("0");
	ds_programmodified |= 1;
	jQuery('.collapse_scheduling').css('visibility', 'hidden');
	jQuery('.collapse_scheduling').css('height', '0px');
}
function ds_updateTemplateBorder(event) {
	ds_programmodified |= 2;
	jQuery(".owlselected").removeClass("owlselected");
	jQuery(event.target).addClass("owlselected");
	var elem = jQuery(".screen-list-button-active").get(0);
	if (elem != null) {
		var number = parseInt(elem.id.replace("tabtitle", ""), 10);
		jQuery("#tabheadsimg"+number).css("display", "block");
		jQuery('#tabhead'+number).css("border", "2px solid #"+bcolor);
		var cur_id = document.getElementById("save_myDSSID"+(number+1));
		if (cur_id == null) {
			cur_id = document.getElementById("load_myDSSID"+(number+1));
		}
		var allClasses = jQuery(event.target).attr('class');
		var allClassesAr = allClasses.split(" ");
		var templId = -1;
		for (var i = 0; i < allClassesAr.length; i++) {
		    if (allClassesAr[i].startsWith("template")){
		    	templId = parseInt(allClassesAr[i].substring(8, allClassesAr[i].length));
		    }
		}
		var formatNr = 2;
		for (var i = 0; i < allClassesAr.length; i++) {
		    if (allClassesAr[i].startsWith("pict-")){
		    	if ( allClassesAr[i].substring(5, allClassesAr[i].length) == 'l') formatNr = 1;
		    }
		}
		var pictPath = wordPressTemplateIconArray[templId];
		if (templId == -1 && formatNr == 1){
			pictPath = jQuery("#layout-custom-landscape").find("#plandscape").attr('src');
		} else if (templId == -1 && formatNr == 2){
			pictPath = jQuery("#layout-custom-portrait").find("#pportrait").attr('src');
		} else {
			jQuery("#plandscapetext").css("padding-left", "17px");
		}
		jQuery("#tabheadsimg"+number).attr("src", pictPath );
		jQuery("#tabheadsimg"+number).css("display", "block");
		if (tabscr.length > 1){
			jQuery("#tabheadsdplayd0").css("display", "block");
		}
		if (document.getElementById('check_myDS'+cur_id.value) == null) {
			var newinput = document.createElement("input");
			newinput.id = 'check_myDS'+cur_id.value;
			newinput.name = 'check_myDS'+cur_id.value;
			newinput.type = 'hidden';
			newinput.value = '3';
			document.getElementById("load_form").appendChild(newinput);
		} else if (document.getElementById('check_myDS'+cur_id.value).value == 0) {
			document.getElementById('check_myDS'+cur_id.value).value = 3;
		}
	}
	document.getElementById('box-bg-overlay2').style.display="none";
	document.getElementById('box-bg-overlay3').style.display="none";
}
function ds_deleteTab(event, number) {
	var name = document.getElementById("screen-title_"+number).value;
	if (name == "") {
		name = document.getElementById("tabtitle"+number).innerHTML;
	}
	document.getElementById("deletecontent").innerHTML = ds_translation.stringSlideDelete.replace("FILENAME", name)+"?";
	document.getElementById("deleteanyway").setAttribute("onclick", "ds_trueDeleteTab("+number+");");
	jQuery('#modaldelete').modal('show');
	if (event.stopPropagation) {
		event.stopPropagation();
	} else {
		event.cancelBubble = true;
	}
}
function ds_trueDeleteTab(number) {
	ds_programmodified |= 2;
	var tabcont=document.getElementById("tab"+number);
	var tab=document.getElementById("tabhead"+number);
	var selectedTab = parseInt(jQuery('.screen-list-button-active').attr('id').replace("tabtitle", ""), 10);
	var lastSlide = (number==0 && !document.getElementById("tabhead1"));
	tab.remove();
	var found=false;
	var newTabscr = [];
	var newTPrev = 0;
	var newTAfter = number;
	if (maxTab < tabscr.length) {
		maxTab = tabscr.length;
	}
	for (i=0; i<maxTab; i++) {
		if (!document.getElementById("tabhead"+i)) {
			found=true;
			ds_deleteScreen(tabscr[i]);
			newTAfter = i;
		} else if (found) {
			document.getElementById("save_myDSSID"+(i+1)).name="save_myDSSID"+i;
			document.getElementById("save_myDSSID"+(i+1)).id="save_myDSSID"+i;
			document.getElementById("tabhead"+i).id="tabhead"+(i-1);
			document.getElementById("tabtitle"+i).id="tabtitle"+(i-1);
			document.getElementById("litabswitch"+i).id="litabswitch"+(i-1);
			document.getElementById("litabdelete"+i).id="litabdelete"+(i-1);
			document.getElementById("tabheadsimg"+i).name="tabheadsimg"+(i-1);
			document.getElementById("tabheadsimg"+i).id="tabheadsimg"+(i-1);
			document.getElementById("tabheadsdplayd"+i).name="tabheadsdplayd"+(i-1);
			document.getElementById("tabheadsdplayd"+i).id="tabheadsdplayd"+(i-1);
			document.getElementById("playduration"+i).name="playduration"+(i-1);
			document.getElementById("playduration"+i).id="playduration"+(i-1);
			document.getElementById("tabhead"+(i-1)).setAttribute("onclick", "ds_switchTab("+(i-1)+");ds_unhideTab("+(i-1)+");");
			if (lmzcal) {
				document.getElementById("tabhead"+(i-1)).setAttribute("onclick", "ds_drag("+(i-1)+");");
				document.getElementById("tabhead"+(i-1)).setAttribute("ondragstart", "ds_drag("+(i-1)+");");
			} else {
				document.getElementById("tabhead"+(i-1)).setAttribute("onmousedown", "jQuery('#eventID').val('"+(i-1)+"'); ds_drag("+(i-1)+"); ds_unhideTab("+(i-1)+");");
			}
			document.getElementById("tabtitle"+(i-1)).setAttribute("onclick", "ds_drag("+(i-1)+");ds_unhideTab("+(i-1)+");");
			document.getElementById("litabswitch"+(i-1)).innerHTML='<a id="litabmodal'+(i-1)+'" class="screen-edit" data-toggle="modal" data-target="#modal'+(i-1)+'"></a>';
			document.getElementById("litabdelete"+(i-1)).setAttribute("onclick", "ds_deleteTab(event, "+(i-1)+")");
			document.getElementById("playduration"+(i-1)).setAttribute("onkeyup", "ds_updatePlayduration("+(i-1)+")");
			document.getElementById("playduration"+(i-1)).setAttribute("onchange", "ds_updatePlayduration("+(i-1)+")");
			var elem = document.getElementById("screen-title_"+i);
			if (elem != null) {
				document.getElementById("screen-title_"+(i-1)).value = elem.value;
			} else {
				document.getElementById("screen-title_"+(i-1)).value = "";
			}
			newTabscr.push(tabscr[i]);
		} else {
			newTabscr.push(tabscr[i]);
		}
		if (!found) newTPrev = i;
	}
	document.getElementById("screen-title_"+(maxTab-1)).value = "";
	tabscr = newTabscr;
	maxTab = tabscr.length;
	if (lastSlide) {
		ds_createNewSlide();
		document.getElementById("screen-title_0").value = ds_translation.stringNewSlide+" 1";
		ds_updateTitle(0);
	}
	if (selectedTab == number || selectedTab >= maxTab) {
		if (newTAfter >= maxTab){
			newTAfter = maxTab-1;
		}
		jQuery("#tabhead"+newTAfter).addClass("active");
		document.getElementById("tab"+ newTAfter).style.display="block";
		if (lastSlide) {
			jQuery('input[id^=save_myDS'+tabscr[newTAfter]+']').remove();
			jQuery.fn.displayScreen(tabscr[newTAfter]);
		}
		ds_switchTab(newTAfter);
		ds_unhideTab(newTAfter);
	}
	if (lastSlide) {
		document.getElementById("screen-list").style.display = "none";
		document.getElementById("screen-list_label").style.display = "none";
		document.getElementById("screen-list_spacer").style.display = "none";
		document.getElementById('box-bg-overlay1').style.display="";
		document.getElementById('box-bg-overlay2').style.display="";
		document.getElementById('box-bg-overlay3').style.display="";
	}
}
ds_hideportrait();
function ds_reload_draggable() {
	jQuery('#titletabs').sortable("refresh");
}
function ds_make_draggable() {
	jQuery('#titletabs').sortable({
		revert:false,
		tolerance:"pointer",
		scroll: false,
		forcePlaceholderSize: true,
		cursor:"move",
		placeholder: "uploadAreaS",
		start: function(event,ui) {
			jQuery(document).mousemove(function(e){
				jQuery('#drag-clone').css({left:e.pageX-110, top:e.pageY+2});
			});
			jQuery(ui.helper).clone().prop('id','drag-clone').appendTo('body');
			jQuery('#sched_rad_2').prop('checked',true);
			jQuery('.collapse_scheduling').css('visibility', 'visible');
			jQuery('.collapse_scheduling').css('height', '100%');
			jQuery('#titletabs_placeholder').css('margin-top', 0);
			loadCalendar();
		},
		out: function(event, ui) {
			if (!event.originalEvent.isOnBeforeStop) {
				jQuery('html, body').animate({
					scrollTop: jQuery("#calendar").offset().top-50
				}, 500);
			}
		},
		beforeStop: function(event, ui) {
			event.originalEvent.isOnBeforeStop = true;
		},
		stop: function(event, ui) {
			reset_tab_order();
			jQuery('#drag-clone').remove();
			jQuery(document).mousemove(function(){return false;});
		},
	});
}
var ds_programmodified = 0;
window.onload = function() {
	if (!lmzcal) loadCalendar();
        if (jQuery("#load_nrOfScreens").length == 0 || jQuery("#load_nrOfScreens").val() == 0 ){
                tabscr.push("X1");
                jQuery("#save_myDS_form").append('<input type="hidden" id="save_myDSCID" name="save_myDSCID" value="-1">');
                jQuery("#save_myDS_form").append('<input type="hidden" id="save_myDSCName" name="save_myDSCName" value="">');
                jQuery("#save_myDS_form").append('<input type="hidden" id="save_myDSCDesc1" name="save_myDSCDesc1" value="">');
                jQuery("#save_myDS_form").append('<input type="hidden" id="save_myDSCDesc2" name="save_myDSCDesc2" value="">');
                jQuery("#save_myDS_form").append('<input type="hidden" id="save_myDSCStreet" name="save_myDSCStreet" value="">');
                jQuery("#save_myDS_form").append('<input type="hidden" id="save_myDSCHNr" name="save_myDSCHNr" value="">');
                jQuery("#save_myDS_form").append('<input type="hidden" id="save_myDSCZip" name="save_myDSCZip" value="">');
                jQuery("#save_myDS_form").append('<input type="hidden" id="save_myDSCCity" name="save_myDSCCity" value="">');
                jQuery("#save_myDS_form").append('<input type="hidden" id="save_myDSCCountry" name="save_myDSCCountry" value="">');
                if (jQuery("#save_nrOfScreens").length == 0){
                        jQuery("#save_myDS_form").append("<input type=\"hidden\" id=\"save_nrOfScreens\" name=\"save_nrOfScreens\" value=\""+ 0 +"\">");
                } else {
                        jQuery("#save_nrOfScreens").val(0);
                }
                ds_addNewScreenToProgram(1);
                setCurrentScreen("X1");
                if (document.getElementById("load_myDSPName") != null) {
                        jQuery("#signage-title").val(jQuery("#load_myDSPName").val());
                }
        } else {
                document.getElementById("screen-list").style.display = "";
                document.getElementById("screen-list_label").style.display = "";
                document.getElementById("screen-list_spacer").style.display = "";
                document.getElementById('box-bg-overlay1').style.display="none";
                var nrScreens = jQuery("#load_nrOfScreens").val();
                jQuery("#signage-title").val(jQuery("#load_myDSPName").val());
                if (jQuery("#save_nrOfScreens").length == 0){
                        jQuery("#save_myDS_form").append("<input type=\"hidden\" id=\"save_nrOfScreens\" name=\"save_nrOfScreens\" value=\""+ nrScreens +"\">");
                } else {
                        jQuery("#save_nrOfScreens").val(nrScreens);
                }
                var preloadId = 0;
                var preloadElem = document.getElementById('load_preloadScreenID');
                if (preloadElem != null) {
                        preloadId = preloadElem.value;
                }
                var preloadNumber = 0;
                var firstDSId = "";
                for (var ii = 1; ii <= nrScreens; ii++){
                        var dsId = jQuery("#load_myDSSID"+ii).val();
                        if (dsId == preloadId) preloadNumber = ii-1;
                        if (ii == 1) firstDSId = dsId;
                        tabscr.push(dsId);
                        var titlename = "Slide";
                        if (jQuery("#load_myDS"+ dsId+"Name").length && jQuery("#load_myDS"+ dsId+"Name").val().length > 0) {
                                titlename = jQuery("#load_myDS"+ dsId+"Name").val();
                        }
                        jQuery("#screen-title_"+(ii-1)).val(titlename);
                        ds_updateTitle( (ii - 1) );
                        ds_updatePlayduration( (ii - 1) );
                        jQuery("#save_myDS_form").append("<input type=\"hidden\" id=\"save_myDSSID"+ii+"\" name=\"save_myDSSID"+ii+"\" value=\""+ dsId +"\">");
                        ds_switchTab( (ii - 1) );
                        loadSchedulingValuesToPageAndSaveForm(dsId);
			if (document.getElementById('tabheadsimg'+(ii-1))) {
				document.getElementById('tabheadsimg'+(ii-1)).style.display = 'block';
			}
                }
                ds_switchTab(preloadNumber);
                ds_unhideTab(preloadNumber);
        }
                jQuery('.dateinput').datepicker({
			dateFormat: "yy-mm-dd",
			dayNames: [ds_translation.dateSunday,ds_translation.dateMonday,ds_translation.dateTuesday,ds_translation.dateWednesday,ds_translation.dateThursday,ds_translation.dateFriday,ds_translation.dateSaturday],
			dayNamesMin: [ds_translation.dateSu,ds_translation.dateMo,ds_translation.dateTu,ds_translation.dateWe,ds_translation.dateTh,ds_translation.dateFr,ds_translation.dateSa],
			dayNamesShort: [ds_translation.dateSu,ds_translation.dateMo,ds_translation.dateTu,ds_translation.dateWe,ds_translation.dateTh,ds_translation.dateFr,ds_translation.dateSa],
			monthNames: [ds_translation.dateJanuary,ds_translation.dateFebruary,ds_translation.dateMarch,ds_translation.dateApril,ds_translation.dateMay,ds_translation.dateJune,ds_translation.dateJuly,ds_translation.dateAugust,ds_translation.dateSeptember,ds_translation.dateOctober,ds_translation.dateNovember,ds_translation.dateDecember],
			monthNamesShort: [ds_translation.dateJan,ds_translation.dateFeb,ds_translation.dateMar,ds_translation.dateApr,ds_translation.dateMay,ds_translation.dateJun,ds_translation.dateJul,ds_translation.dateAug,ds_translation.dateSep,ds_translation.dateOct,ds_translation.dateNov,ds_translation.dateDec]
		});
	if (typeof(toggle_favbar) == "function") toggle_favbar(1);
	jQuery('#previewmodal').on('hidden.bs.modal', function () {
		ds_stoppreview();
		jQuery('#allDSScreens').html("");
		currentShowedDivIndex = -1;
	});
	ds_make_draggable();
	caldragstart();
	var origoffset = jQuery(window).scrollTop();
	jQuery('#loading_anim').css('display','none');
	dsLoadState = 1;
 };
window.onbeforeunload = function(e) {
        var changed = false;
        var one_content_element = false;
        if (ds_programmodified != null && ds_programmodified & 2) {
                changed = true;
                one_content_element = true;
        }
        if (!changed && ds_programmodified != null && ds_programmodified & 1) {
                jQuery.fn.triggerFullFormUpdate();
                checkPage();
                var save_form = document.getElementById('save_myDS_form');
                if (save_form != null) {
                        var save_forms = save_form.childNodes;
                        for(i=0; i<save_forms.length; i++) {
                                if (save_forms[i].id && save_forms[i].id.indexOf("save_myDS") > -1 && save_forms[i].id.indexOf("save_myDSC") == -1) {
                                        var load_id = save_forms[i].id.replace("save_", "load_");
                                        if (document.getElementById("load_form").childNodes.length > 0) {
                                                one_content_element = true;
                                        }
                                        var load_form = document.getElementById(load_id);
                                        if (load_form != null) {
                                                if (load_form.value != save_forms[i].value) {
                                                        changed = true;
                                                        if (one_content_element) {
                                                                break;
                                                        }
                                                }
                                        } else {
                                                changed = true;
                                                if (one_content_element) {
                                                        break;
                                                }
                                        }
                                }
                        }
                }
        }
        if (changed && one_content_element) {
                return ds_translation.stringNotSavedChanges;
        }
};
function ds_addNewScreenToProgram(newScreenNumber){
        var curv = jQuery("#save_nrOfScreens").val();
        curv++;
        jQuery("#save_nrOfScreens").val(curv);
        var newinputScreen = "<input type=\"hidden\" id=\"save_myDSSID"+ curv +"\" name=\"save_myDSSID"+ curv +"\" value=\"X"+ newScreenNumber +"\">";
        jQuery("#save_myDS_form").append(newinputScreen);
	var dSId = "X"+newScreenNumber;
	createUpdateSaveForm(dSId, "Ratio", "1.77777777");
	createUpdateSaveForm(dSId, "Format", "1");
	createUpdateSaveForm(dSId, "Name", ds_translation.stringNewSlide+" "+(curv));
	createUpdateSaveForm(dSId, "screenorder", newScreenNumber);
}
function ds_updateScreenName( DSId, myDSName){
        if (jQuery("#save_myDS"+ DSId +"Name").length == 0) {
                var newinputName = "<input type=\"hidden\" id=\"save_myDS"+ DSId +"Name\" name=\"save_myDS"+ DSId +"Name\" value=\""+ myDSName +"\">";
                jQuery("#save_myDS_form").append(newinputName);
        } else {
                jQuery("#save_myDS"+ DSId +"Name").val(myDSName);
        }
}
function ds_deleteScreen( toDelDSId ){
        jQuery.fn.deleteAllFormFieldsOfScreenId(toDelDSId, true, true);
        var oldNrSc = jQuery("#load_nrOfScreens").val();
        var newNrSc = parseInt(oldNrSc) - 1;
        jQuery("#load_nrOfScreens").val(newNrSc);
        var oldNrSc = jQuery("#save_nrOfScreens").val();
        var newNrSc = parseInt(oldNrSc) - 1;
        jQuery("#save_nrOfScreens").val(newNrSc);
        for (var g=1; g<=100;g++){
                if (jQuery("#save_myDSSID"+g).length > 0){
                        if ( jQuery("#save_myDSSID"+g).val() == toDelDSId){
                                jQuery("#save_myDSSID"+g).remove();
                        }
                }
        }
        for (var g=1; g<=100;g++){
                if (jQuery("#load_myDSSID"+g).length > 0){
                        if ( jQuery("#load_myDSSID"+g).val() == toDelDSId){
                                jQuery("#load_myDSSID"+g).remove();
                        }
                }
        }
	jQuery('#check_myDS'+toDelDSId).val(0);
}
function ds_updateProgramTitle(){
        ds_programmodified |= 1;
        var myDSPName = jQuery("#signage-title").val();
        if (jQuery("#save_myDSPName").length == 0){
                var newinputName = "<input type=\"hidden\" id=\"save_myDSPName\" name=\"save_myDSPName\" value=\""+ myDSPName +"\">";
                jQuery("#save_myDS_form").append(newinputName);
        } else {
                jQuery("#save_myDSPName").val(myDSPName);
        }
}
function checkPage(){
        saveSchedulingValues();
	reset_tab_order();
}
function setCurrentScreen( newDSId ){
        if (jQuery("#currentShowedDSId").length == 0  ){
                jQuery("#save_myDS_form").append("<input type=\"hidden\" id=\"currentShowedDSId\" name=\"currentShowedDSId\" value=\""+ newDSId +"\">");
                setSchedulingValues(newDSId);
        } else {
                setSchedulingValues(newDSId);
                jQuery("#currentShowedDSId").val( newDSId );
        }
}
function loadSchedulingValuesToPageAndSaveForm( dsId ){
        loadSchedulingValueToPageAndSaveForm(dsId, "scheduleid", "scheduleid");
        loadSchedulingValueToPageAndSaveForm(dsId, "permanent", "permanent");
        loadSchedulingValueToPageAndSaveForm(dsId, "playduration", "playduration");
        loadSchedulingValueToPageAndSaveForm(dsId, "startdate", "startdate");
        loadSchedulingValueToPageAndSaveForm(dsId, "enddate", "enddate");
        loadSchedulingValueToPageAndSaveForm(dsId, "active_show_by_date", "active_show_by_date");
        loadSchedulingValueToPageAndSaveForm(dsId, "active_show_by_day_of_month", "active_show_by_day_of_month");
        loadSchedulingValueToPageAndSaveForm(dsId, "dayofmonthstart", "dayofmonthstart");
        loadSchedulingValueToPageAndSaveForm(dsId, "dayofmonthend", "dayofmonthend");
        jQuery.fn.DelCalendarBoxes();
	if (!lmzcal) jQuery("#calendar").fullCalendar('removeEvents');

        for (var t=1; t<=70 ;t++){
                loadSchedulingValueToPageAndSaveForm(dsId, "wd"+t, "wd"+t);
        }
}
function loadSchedulingValueToSaveForm( dSId, dsfield, pagefieldId ){
        var cVal = jQuery("#load_myDS"+ dSId +""+ dsfield).val();
        if (jQuery("#save_myDS"+ dSId + dsfield).length == 0  ){
                jQuery("#save_myDS_form").append("<input type=\"hidden\" id=\"save_myDS"+ dSId + dsfield +"\" name=\"save_myDS"+ dSId + dsfield+"\" value=\""+ cVal +"\">");
        } else {
                jQuery("#save_myDS"+ dSId + dsfield ).val( cVal );
        }
}
function loadSchedulingValueToPageAndSaveForm( dSId, dsfield, pagefieldId ){
        if (jQuery("#load_myDS"+ dSId +""+ dsfield).length > 0  ){
                var cVal = jQuery("#load_myDS"+ dSId +""+ dsfield).val();
                loadSchedulingValueToSaveForm( dSId, dsfield, pagefieldId );
                jQuery("#"+ pagefieldId).val(cVal);
        }
        if(dsfield.startsWith('wd')){
                if (jQuery("#load_myDS"+ dSId +""+ dsfield+"startd").length > 0  ){
                        var cwdId = jQuery("#load_myDS"+ dSId +""+ dsfield+"id").val();
                        var cstartd = jQuery("#load_myDS"+ dSId +""+ dsfield+"startd").val();
                        var cstarth = jQuery("#load_myDS"+ dSId +""+ dsfield+"starth").val();
                        var cstartm = jQuery("#load_myDS"+ dSId +""+ dsfield+"startm").val();
                        var cendd = jQuery("#load_myDS"+ dSId +""+ dsfield+"endd").val();
                        var cendh = jQuery("#load_myDS"+ dSId +""+ dsfield+"endh").val();
                        var cendm = jQuery("#load_myDS"+ dSId +""+ dsfield+"endm").val();
                        var cName = jQuery("#load_myDS"+ dSId +"Name").val();
                        loadSchedulingValueToSaveForm( dSId, dsfield+"id", pagefieldId+"id" );
                        loadSchedulingValueToSaveForm( dSId, dsfield+"startd", pagefieldId+"startd" );
                        loadSchedulingValueToSaveForm( dSId, dsfield+"starth", pagefieldId+"starth" );
                        loadSchedulingValueToSaveForm( dSId, dsfield+"startm", pagefieldId+"startm" );
                        loadSchedulingValueToSaveForm( dSId, dsfield+"endd", pagefieldId+"endd" );
                        loadSchedulingValueToSaveForm( dSId, dsfield+"endh", pagefieldId+"endh" );
                        loadSchedulingValueToSaveForm( dSId, dsfield+"endm", pagefieldId+"endm" );
			loadEventCal(dsfield.substring(2, dsfield.length),cName,cstartd,cendd);
                        if (lmzcal) jQuery.fn.LoadBox(dsfield.substring(2, dsfield.length), cName, cstartd, cstarth, cstartm, cendd , cendh, cendm );
                }
        }
}
function saveSchedulingValues(){
        var curDSId = jQuery("#currentShowedDSId").val();
	if (jQuery("#save_myDS"+curDSId+"permanent").length == 0) createUpdateSaveForm(curDSId, "permanent", 1);
        if (jQuery("#startdate").length > 0) {
        	createUpdateSaveForm(curDSId, "startdate", jQuery("#startdate").val() );
        	createUpdateSaveForm(curDSId, "enddate", jQuery("#enddate").val() );
		createUpdateSaveForm(curDSId, "active_show_by_date", jQuery("#active_show_by_date").val() );
		createUpdateSaveForm(curDSId, "active_show_by_day_of_month", jQuery("#active_show_by_day_of_month").val() );
		createUpdateSaveForm(curDSId, "dayofmonthstart", jQuery("#dayofmonthstart").val() );
		createUpdateSaveForm(curDSId, "dayofmonthend", jQuery("#dayofmonthend").val() );
	} else {
        	createUpdateSaveForm(curDSId, "startdate", 0);
        	createUpdateSaveForm(curDSId, "enddate", 0);
	}
}
function setSchedulingValues(newDSId){
        saveSchedulingValues();
        jQuery.fn.DelCalendarBoxes();
        if (!lmzcal) jQuery("#calendar").fullCalendar('removeEvents');
        createSaveForm(newDSId, "permanent", 1);
        createSaveForm(newDSId, "playduration", 0);
        createSaveForm(newDSId, "startdate", 0);
        createSaveForm(newDSId, "enddate", 0);
        createSaveForm(newDSId, "active_show_by_date", 0);
        createSaveForm(newDSId, "active_show_by_day_of_month", 0);
        createSaveForm(newDSId, "dayofmonthstart", 0);
        createSaveForm(newDSId, "dayofmonthend", 0);
        readSaveFormValues(newDSId, "permanent", "permanent");
        readSaveFormValues(newDSId, "playduration", "playduration");
        readSaveFormValues(newDSId, "startdate", "startdate");
        readSaveFormValues(newDSId, "enddate", "enddate");
        readSaveFormValues(newDSId, "active_show_by_date", "active_show_by_date");
        readSaveFormValues(newDSId, "active_show_by_day_of_month", "active_show_by_day_of_month");
        readSaveFormValues(newDSId, "dayofmonthstart", "dayofmonthstart");
        readSaveFormValues(newDSId, "dayofmonthend", "dayofmonthend");
        for (var t=1; t<=70 ;t++){
                readSaveFormValues(newDSId, "wd"+t, "wd"+t);
        }
        readSaveFormValuesExceptGivenDSId(newDSId);
}
function createSaveForm(dSId, dsfield, dsfieldValue){
        if ( jQuery("#save_myDS"+ dSId +""+ dsfield).length == 0 ){
                if ( jQuery("#load_myDS"+ dSId +""+ dsfield).length == 0 || (jQuery("#load_myDS"+ dSId +""+ dsfield).val() !=  dsfieldValue)) {
                        jQuery("#save_myDS_form").append("<input type=\"hidden\" id=\"save_myDS"+ dSId + dsfield +"\" name=\"save_myDS"+ dSId + dsfield+"\" value=\""+ dsfieldValue +"\">");
                }
        }
}
function createUpdateSaveForm(dSId, dsfield, dsfieldValue){
        if ( jQuery("#save_myDS"+ dSId +""+ dsfield).length == 0 && (jQuery("#load_myDS"+ dSId +""+ dsfield).length == 0 || (jQuery("#load_myDS"+ dSId +""+ dsfield).val() !=  dsfieldValue ))){
		createSaveForm(dSId, dsfield, dsfieldValue);
        } else {
                jQuery("#save_myDS"+ dSId + dsfield).val( dsfieldValue );
        }
}
function readSaveFormValues(dSId, dsfield, pagefieldId){
        if (jQuery("#save_myDS"+ dSId +""+ dsfield).length == 0  ){
                jQuery("#"+ pagefieldId).val('');
        } else {
                jQuery("#"+ pagefieldId).val( jQuery("#save_myDS"+ dSId + dsfield).val() );
        }
        if(dsfield.startsWith('wd')){
                if (jQuery("#save_myDS"+ dSId +""+ dsfield+"startd").length > 0  ){
                        var cstartd = jQuery("#save_myDS"+ dSId +""+ dsfield+"startd").val();
                        var cstarth = jQuery("#save_myDS"+ dSId +""+ dsfield+"starth").val();
                        var cstartm = jQuery("#save_myDS"+ dSId +""+ dsfield+"startm").val();
                        var cendd = jQuery("#save_myDS"+ dSId +""+ dsfield+"endd").val();
                        var cendh = jQuery("#save_myDS"+ dSId +""+ dsfield+"endh").val();
                        var cendm = jQuery("#save_myDS"+ dSId +""+ dsfield+"endm").val();
                        var cName = jQuery("#save_myDS"+ dSId +"Name").val();
			loadEventCal(dsfield.substring(2, dsfield.length),cName,cstartd,cendd);
                        if (lmzcal) jQuery.fn.LoadBox(dsfield.substring(2, dsfield.length), cName, cstartd, cstarth, cstartm, cendd , cendh, cendm );
                }
        }
}
function readSaveFormValuesExceptGivenDSId( toExcludeDSId ){
        var IDs = [];
        jQuery("#save_myDS_form").find("input").each(function(){
		if ( /^(save_myDS[X?0-9]{1,}wd[0-9]{1,}id)$/.test(this.id)) {
			if ((this.id).substring(0, (this.id).indexOf('wd') ) != "save_myDS"+toExcludeDSId) {
				IDs.push( this.id);
			}
		}
	});
        for ( var i=0; i<IDs.length; i++){
                var dSId = IDs[i].substring(9, IDs[i].indexOf("wd"));
                var dsfield = IDs[i].substring(IDs[i].indexOf("wd"), IDs[i].indexOf("id"));
                if (jQuery("#save_myDS"+ dSId +""+ dsfield+"startd").length > 0  ){
                        var cstartd = jQuery("#save_myDS"+ dSId +""+ dsfield+"startd").val();
                        var cstarth = jQuery("#save_myDS"+ dSId +""+ dsfield+"starth").val();
                        var cstartm = jQuery("#save_myDS"+ dSId +""+ dsfield+"startm").val();
                        var cendd = jQuery("#save_myDS"+ dSId +""+ dsfield+"endd").val();
                        var cendh = jQuery("#save_myDS"+ dSId +""+ dsfield+"endh").val();
                        var cendm = jQuery("#save_myDS"+ dSId +""+ dsfield+"endm").val();
                        var cName = jQuery("#save_myDS"+ dSId +"Name").val();
                        loadEventCal2(dSId,dsfield,cName,cstartd,cendd);
			if (lmzcal) jQuery.fn.SavedBox(dSId +""+ dsfield, cName , cstartd, cstarth, cstartm, cendd , cendh, cendm );
                }
        }
}
function carousel_nav(dir) {
        if (dir) {
                if (jQuery("#themelandscapepreview").css("display") != "none") {
                        jQuery("#themelandscapepreview .owl-next").mouseup();
                }
                if (jQuery("#themeportraitpreview").css("display") != "none") {
                        jQuery("#themeportraitpreview .owl-next").mouseup();
                }
        } else {
                if (jQuery("#themelandscapepreview").css("display") != "none") {
                        jQuery("#themelandscapepreview .owl-prev").mouseup();
                }
                if (jQuery("#themeportraitpreview").css("display") != "none") {
                        jQuery("#themeportraitpreview .owl-prev").mouseup();
                }
        }
}
jQuery(document).on("shown.bs.modal", "#previewmodal", function () {
        getSize();
        myresizer();
        startScheduling();
});
function previewds() {
        jQuery.fn.triggerFullFormUpdate();
        checkPage();
        generatePreview();
        sw = "1280px";
        sh = "720px";
        var dsFormat = jQuery("#save_myDS"+tabscr[0]+"Format").val();
        if (jQuery("#save_myDS"+tabscr[0]+"Format").length > 0){
                dsFormat = jQuery("#save_myDS"+tabscr[0]+"Format").val();
        } else {
                dsFormat = jQuery("#load_myDS"+tabscr[0]+"Format").val();
        }
        if (dsFormat == "2"){
                sw = "433px";
                sh = "770px";
                jQuery('#previewmodal').find(".modal-content").css("width", "477px");
                jQuery('#allDSScreens').css("width", "433px");
                jQuery('#allDSScreens').css("height", "770px");
        }
        jQuery('#previewmodal').css("width", jQuery(window).width());
        jQuery('#previewmodal').css("height", jQuery(window).height());
        jQuery("#previewmodal").find(".FullWidthRow").css('height', sh);
        jQuery("#previewmodal").find(".FullWidthRow").css('width', sw);
        jQuery("#previewmodal").find(".ds-custom-template").css('height', sh);
        jQuery("#previewmodal").find(".ds-custom-template").css('width', sw);
        jQuery("#previewmodal").find('[id^="myDS"][id$="E0"]').find('.ds-content').css('width', sw);
        jQuery("#previewmodal").find('[id^="myDS"][id$="E0"]').find('.ds-content').css('height', sh);
        jQuery('#previewmodal').modal('show');
}
function saveinput() {
	jQuery("#myDSX").removeAttr("style");
        jQuery.fn.triggerFullFormUpdate();
        checkPage();
        var warn_text = '';
        var warning = false;
        var now = parseInt(new Date().getTime()/1000, 10);
        var one_screen_now_or_later = false;
        var playtime_greater_zero = false;
        var screens = parseInt(document.getElementById('save_nrOfScreens').value, 10);
        var ep = (24*60*60-1) ;
        for (var i = 1; i <= screens; i++) {
                var screen_id = document.getElementById('save_myDSSID'+i).value;
                var playtime = document.getElementById('save_myDS'+screen_id+'playduration').value;
                if (playtime.length > 0 && playtime != "0" && playtime != "") {
                        var playtime_greater_zero = true;
                }
                if (document.getElementById('save_myDS'+screen_id+'active_show_by_date').value != "true") {
                        var one_screen_now_or_later = true;
                } else {
                        var startdate = document.getElementById('save_myDS'+screen_id+'startdate').value;
                        var enddate = document.getElementById('save_myDS'+screen_id+'enddate').value;
                        if (enddate == 0 || enddate+ep > now) {
                                var one_screen_now_or_later = true;
                        } else if (enddate > 0 && enddate+ep < now) {
                                var warning = true;
                                warn_text += '<div>'+document.getElementById('save_myDS'+screen_id+'Name').value+' '+ ds_translation.stringCanNeverByPlayed +'</div>';
                        }
                        if (startdate > 0 && startdate > enddate+ep) {
                                var warning = true;
                                warn_text += '<div>'+document.getElementById('save_myDS'+screen_id+'Name').value+' '+ ds_translation.stringStartAfterEnd +'</div>';
                        }
                }
                if (document.getElementById('save_myDS'+screen_id+'active_show_by_day_of_month').value == "true") {
                        var startdate = document.getElementById('save_myDS'+screen_id+'dayofmonthstart').value;
                        var enddate = document.getElementById('save_myDS'+screen_id+'dayofmonthend').value;
                        if (startdate > enddate && startdate > 0 && enddate > 0) {
                                var warning = true;
                                warn_text += '<div>'+document.getElementById('save_myDS'+screen_id+'Name').value+' '+ ds_translation.stringStartAfterEndMonth +'</div>';
                        }
                }
        }
        if (!one_screen_now_or_later) {
                var warning = true;
                warn_text += '<div>'+ ds_translation.stringNoPlayableSlide +'</div>';
        }
        if (!playtime_greater_zero && screens > 1) {
                var warning = true;
                warn_text += '<div>'+ ds_translation.stringZeroDurations +' > 0.</div>';
        }
        if (warning) {
                document.getElementById('warncontent').innerHTML = warn_text;
                jQuery('#modalwarn').modal('show');
        } else {
                ds_programmodified = 0;
                document.save_myDS_form.submit();
        }
}
function updateTime() {
        var startDate = jQuery( "#cb_startdate" ).datepicker( "getDate" );
        if (startDate != null) {
                document.getElementById("startdate").value = (startDate.getTime()/1000);
        } else {
                document.getElementById("startdate").value = 0;
        }
        var endDate = jQuery( "#cb_enddate" ).datepicker( "getDate" );
        if (endDate != null) {
                document.getElementById("enddate").value = (endDate.getTime()/1000);
        } else {
                document.getElementById("enddate").value = 0;
        }
        document.getElementById("active_show_by_date").value = document.getElementById("cb_active_show_by_date").checked;
        ds_programmodified |= 1;
}
function updateDayOfMonth() {
        document.getElementById("active_show_by_day_of_month").value = document.getElementById("cb_active_show_by_day_of_month").checked;
}
function updateDate() {
	var start_elem = document.getElementById("startdate"); 
	if (!start_elem) {
		return;
	}
        var starttime = document.getElementById("startdate").value;
        if (starttime != 0 && starttime != "") {
                var startdate = new Date(starttime*1000);
                jQuery( "#cb_startdate" ).datepicker( "setDate", startdate );
                var year = startdate.getUTCFullYear();
                var month = startdate.getMonth()+1;
                if (month < 10) {
                        var month = "0"+month;
                }
                var day = startdate.getDate();
                if (day < 10) {
                        var day = "0"+day;
                }
                document.getElementById("cb_startdate").value = year+"-"+month+"-"+day;
        } else {
                document.getElementById("cb_startdate").value = "";
        }
        var endtime = document.getElementById("enddate").value;
        if (endtime != 0 && endtime != "") {
                var enddate = new Date(endtime*1000);
                jQuery( "#cb_enddate" ).datepicker( "setDate", enddate );
                var year = enddate.getUTCFullYear();
                var month = enddate.getMonth()+1;
                if (month < 10) {
                        var month = "0"+month;
                }
                var day = enddate.getDate();
                if (day < 10) {
                        var day = "0"+day;
                }
                document.getElementById("cb_enddate").value = year+"-"+month+"-"+day;
        } else {
                document.getElementById("cb_enddate").value = "";
        }
        document.getElementById("cb_active_show_by_date").checked = (document.getElementById("active_show_by_date").value == "true");
        document.getElementById("cb_active_show_by_day_of_month").checked = (document.getElementById("active_show_by_day_of_month").value == "true");
        ds_programmodified |= 1;
}
function ds_stoppreview() {
	ds_stopPlayback = true;
	enableDIV("-1");
}
function reset_tab_order() {
	var num = 1;
	jQuery('#screen-list #titletabs .tabheads').each(function() {
		var elem_id = this.id;
		elem_id = parseInt(elem_id.replace('tabhead',''), 10)+1;
		var ssid = jQuery('#load_myDSSID'+elem_id).val();
		if (ssid == null || ssid <= 0 || ssid == 'undefined') {
			ssid = jQuery('#save_myDSSID'+elem_id).val();
		}
		createUpdateSaveForm(ssid, 'screenorder', num++);
	});
}
