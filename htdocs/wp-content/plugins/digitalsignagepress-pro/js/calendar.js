jQuery( document ).ready(function() {
	var boxID = 0;
	var selectboxID = 0;
	var counterWd = 0;
jQuery.fn.px2time = function (pixel) {
    	hour = Math.floor(pixel/48);
	minutes = Math.floor((pixel / 4) * 5) % 60;
	hour = hour < 10 ? "0" + hour : "" + hour;
	minutes = minutes < 10 ? "0" + minutes : "" + minutes;
	var result = hour +":"+ minutes;
    	return result;
};
jQuery.fn.time2px = function (hour,minutes) {
	hour = hour * 48;
    	minutes = (minutes / 5) * 4;
	var result = hour + minutes;
    	return result;
};
jQuery.fn.totaltime = function (left,width) {
	var totalend = left + width;
	var totalstart = totalend - left;
	var totalminutes = ((totalstart / 4) * 5) % 60;
	var totalhour = Math.trunc(totalstart/48);
	totalhour = totalhour < 10 ? "0" + totalhour : "" + totalhour;
	totalminutes = totalminutes < 10 ? "0" + totalminutes : "" + totalminutes;
	var result = totalhour+":"+totalminutes;
	return result;
};
jQuery.fn.AddResizable = function () {
 var resBox = jQuery(this);
 var wdID = jQuery(this).parent().attr("class").slice(0,4);
 var selectboxID = jQuery(this).attr("id").slice(3,5);
 resBox.resizable({
	 containment: "."+wdID,
	 handles: "w,e",
	 grid: 4,
	 maxWidth: 1152,
	 minWidth: 48,
	 resize: function (event,ui) {
	 	jQuery.fn.ResizeDayBox("#"+resBox.attr('id'));
	 }
	 });
};
jQuery.fn.ResizeDayBox = function (newBoxId) {
	 var resBox = jQuery(newBoxId);
     var wdID = resBox.parent().attr("class").slice(0,4);
     var selectboxID = resBox.attr("id").slice(3,5);
     var left = parseInt(resBox.css("left"));
	 var width = parseInt(resBox.css("width"));
	 var position = left + width;
	 var starttime = jQuery.fn.px2time(left);
	 var endtime = jQuery.fn.px2time(position);
	 jQuery(".starttime", resBox).html(starttime);
	 jQuery(".endtime", resBox).html(endtime);
	if(width <= 75 & width >= 65) {
		 jQuery(".starttime", resBox).css("font-size","15px");
		 jQuery(".endtime", resBox).css("font-size","15px");
		 jQuery(".closeBox", resBox).css("right","-15px");
	} else if(width <= 65 & width >= 55) {
		 jQuery(".starttime", resBox).css("font-size","12px");
		 jQuery(".starttime", resBox).css("padding-left","7px");
		 jQuery(".endtime", resBox).css("font-size","12px");
		 jQuery(".endtime", resBox).css("right","7px");
	} else if(width <= 55) {
		 jQuery(".starttime", resBox).css("font-size","9px");
		 jQuery(".starttime", resBox).css("padding-left","4px");
		 jQuery(".endtime", resBox).css("font-size","9px");
		 jQuery(".endtime", resBox).css("right","4px");
	} else {
		 jQuery(".starttime", resBox).css("font-size","");
		 jQuery(".starttime", resBox).css("padding-left","");
		 jQuery(".endtime", resBox).css("font-size","");
		 jQuery(".endtime", resBox).css("right","");
		 jQuery(".closeBox", resBox).css("right","5px");
	}
	 var myDSId = jQuery("#currentShowedDSId").val();
	 jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"starth").val(starttime.slice(0,2));
	 jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"startm").val(starttime.slice(3,5));
	 jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"endh").val(endtime.slice(0,2));
	 jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"endm").val(endtime.slice(3,5));
};
jQuery.fn.AddDraggable = function () {
	var dragBox = jQuery(this);
	var selectboxID = jQuery(this).attr("id").slice(3,5);
	dragBox.draggable({
		containment: ".day_box ",
		grid: [ 48, 100 ],
		distance: 0,
		stack: "[id^=box]",
		snap: ".day2, .day3, .day4, .day5, .day6, .day7, .day1",
		drag: function (event,ui) {
			var left = ui.position.left;
			var width = jQuery(this).width();
			var position = left + width;
			var starttime = jQuery.fn.px2time(left);
			var endtime = jQuery.fn.px2time(position);
			jQuery(".starttime",this).html(starttime);
			jQuery(".endtime",this).html(endtime);
			var myDSId = jQuery("#currentShowedDSId").val();
			jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"starth").val(starttime.slice(0,2));
			jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"startm").val(starttime.slice(3,5));
			jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"endh").val(endtime.slice(0,2));
			jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"endm").val(endtime.slice(3,5));
		}
	});
};
jQuery.fn.AddDroppable = function () {
	var dropBox = jQuery(this);
	dropBox.droppable({
		tolerance: "pointer",
		over: function (event, ui) {
			if (jQuery(ui.draggable).hasClass('ui-sortable-handle')) {
				var colid = jQuery(this).attr("class").slice(0,4);
				var day = colid.slice(3,5);
				ds_allowDrop(event, day);
			} else {
				jQuery("#box9999").remove();
			}
		},
		out: function (event,ui) {
			var day = 0;
			var classes = jQuery(event.target).attr('class').split(' ');
			for (var i = 0; i < classes.length; i++) {
				if (classes[i].indexOf("day") > -1) {
					day = parseInt(classes[i].replace('day',''), 10);
					break;
				}
			}
			if (day <= 0) {
				jQuery("#box9999").remove();
			}
		},
		drop: function (event,ui) {
			var colid = jQuery(this).attr("class").slice(0,4);
			var colidnr = colid.slice(3,5);
			var myDSId = jQuery("#currentShowedDSId").val();
			var draggable = ui.draggable;
			try {
				jQuery("#box9999").remove();
				if (jQuery(draggable).hasClass('ui-sortable-handle')) {
					var newBoxId = jQuery.fn.createBox("day"+colidnr);
					var offset = jQuery('.day_box').offset();
					var x = Math.round(parseInt(event.pageX - offset.left));
					jQuery(newBoxId).css("left", (x-(x%4))+"px");
					jQuery.fn.ResizeDayBox(newBoxId);
				}
			} catch (e) {
			}
			var offset = draggable.offset();
			draggable.remove();
			draggable.appendTo( this ).offset( offset );
			var selectboxID = ui.draggable.attr("id").slice(3,5);
			var reg = new RegExp("^(day[1-7])$");
			if (reg.test(colid)) {
				jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"startd").val(colidnr);
				jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"endd").val(colidnr);
			}
		}
	});
};
jQuery.fn.getMaxBoxId = function(){
	var myDSId = jQuery("#currentShowedDSId").val();
	var wdNr = [];
	jQuery("#save_myDS_form").find("input").each(function(){
		var filter = new RegExp("save_myDS"+ myDSId +"wd[0-9]{1,}startd");
		if ( (this.id).match(filter) ) {
			wdNr.push( this.id.substring(myDSId.length + 11,  this.id.indexOf("startd")));
		}
	});
	var maxwdId = 0;
	for (var tt=0; tt<wdNr.length ;tt++){
		var curV = parseInt(wdNr[tt]);
		if (curV > maxwdId) maxwdId = curV;
	}
	return 	maxwdId;
};
jQuery.fn.getCountBoxId = function(){
	var myDSId = jQuery("#currentShowedDSId").val();
	var wdNr = [];
	jQuery("#save_myDS_form").find("input").each(function(){
		var filter = new RegExp("save_myDS"+ myDSId +"wd[0-9]{1,}startd");
		if ( (this.id).match(filter) ) {
			wdNr.push( this.id.substring(myDSId.length + 11,  this.id.indexOf("startd")));
		}
	});
	var countBoxes = wdNr.length;
	return countBoxes;
};
jQuery.fn.LoadBox = function (boxID, tplName, startd, starth, startm, endd, endh, endm) {
		counterWd  = jQuery.fn.getMaxBoxId();
		counterWd++;
		var left = jQuery.fn.time2px(starth,startm);
		var width = jQuery.fn.time2px(endh,endm) - left;
		var Box = jQuery("<div></div>", {
					id: "box"+boxID,
					class: "calendarbox",
					style: 'position:absolute;' +
	        			 'left: '+left+'px;' +
	        			 'width: '+width+'px;' +
	        			 'height: 100px;' +
	        			 'outline: none;' +
	        			 'z-index: '+(100+ parseInt(boxID))+';'
			})
		.appendTo(jQuery('.day'+startd));
		jQuery("<div></div>", {
				class: 'box-inner',
				style: 'margin-top: 2px;'+
	        			 'width: 100%;' +
	        			 'height: 95px;' +
	        			 'opacity: 0.8;' +
	        			 'background-color: #1783C6;'
				})
		.appendTo(jQuery('#box'+boxID));
     jQuery("<div></div>", {
			class: 'starttime'
    })
    .appendTo(jQuery('#box'+boxID+' .box-inner'));
		jQuery("<div></div>", {
		 class: 'tplName'
	 })
	 .appendTo(jQuery('#box'+boxID+' .box-inner'));
     jQuery("<div></div>", {
			class: 'endtime'
    })
    .appendTo(jQuery('#box'+boxID+' .box-inner'));
		jQuery("<button></button>", {
		 class: 'closeBox'
	  })
	 .appendTo(jQuery('#box'+boxID+' .box-inner'));
		starth = starth < 10 && starth.length == 1 ? "0" + starth : "" + starth;
		endh = endh < 10 && endh.length == 1 ? "0" + endh : "" + endh;
		startm = startm < 10 && startm.length == 1 ? "0" + startm : "" + startm;
		endm = endm < 10 && endm.length == 1 ? "0" + endm : "" + endm;
    jQuery('#box'+boxID).attr('tabindex', boxID);
    jQuery('#box'+boxID+' .starttime').text(starth+':'+startm);
    jQuery('#box'+boxID+' .endtime').text(endh+':'+endm);
		jQuery('#box'+boxID+' .tplName').text(tplName);
		jQuery('#box'+boxID+' .closeBox').text('X');
};
jQuery.fn.SavedBox = function (boxID, tplName, startd, starth, startm, endd, endh, endm) {
		counterWd  = jQuery.fn.getMaxBoxId();
		counterWd++;
		var left = jQuery.fn.time2px(starth,startm);
		var width = jQuery.fn.time2px(endh,endm) - left;
		var Box = jQuery("<div></div>", {
				id: "savedbox"+boxID,
				class: "calendarsavedbox",
				style: 'position:absolute;' +
					'left: '+left+'px;' +
	        			'width: '+width+'px;' +
					'height: 100px;' +
					'outline: none;'
			})
    .appendTo(jQuery('.day'+startd));
		jQuery("<div></div>", {
				class: 'savedbox-inner',
				style: 'margin-top: 2px;'+
					'width: 100%;' +
					'height: 95px;' +
					'opacity: 0.3;' +
					'background-color: #1783C6;'
				})
		 .appendTo(jQuery('#savedbox'+boxID));
     jQuery("<div></div>", {
			class: 'starttime'
    })
    .appendTo(jQuery('#savedbox'+boxID+' .savedbox-inner'));
     jQuery("<div></div>", {
			class: 'tplName'
    })
    .appendTo(jQuery('#savedbox'+boxID+' .savedbox-inner'));
     jQuery("<div></div>", {
			class: 'endtime'
    })
    .appendTo(jQuery('#savedbox'+boxID+' .savedbox-inner'));
	starth = starth < 10 && starth.length == 1 ? "0" + starth : "" + starth;
	endh = endh < 10 && endh.length == 1 ? "0" + endh : "" + endh;
	startm = startm < 10 && startm.length == 1 ? "0" + startm : "" + startm;
	endm = endm < 10 && endm.length == 1 ? "0" + endm : "" + endm;
    jQuery('#savedbox'+boxID).attr('tabindex', boxID);
    jQuery('#savedbox'+boxID+' .starttime').text(starth+':'+startm);
    jQuery('#savedbox'+boxID+' .endtime').text(endh+':'+endm);
	jQuery('#savedbox'+boxID+' .tplName').text(tplName);
	jQuery('#savedbox'+boxID+' .closeBox').text('X');
};
jQuery.fn.createBox = function(dayID,boxID){
	counterWd  = jQuery.fn.getMaxBoxId();
	var myDSId = jQuery("#currentShowedDSId").val();
	var tplName = jQuery("#save_myDS"+myDSId+"Name").val();
	if ( jQuery.fn.getCountBoxId() >= 70 ) return;
	counterWd++;
	var numdayID = dayID.substring(3, 4);
	var Box = jQuery("<div></div>", {
        id: "box"+counterWd,
        class: "calendarbox",
        style: 'position:absolute;' +
        	'width: 96px;' +
		'height: 100px;' +
		'outline: none;'
    })
    .appendTo(jQuery('.'+dayID));
		jQuery("<div></div>", {
		 class: 'box-inner',
		 style: 'margin-top: 2px;'+
			'width: 100%;' +
			'height: 96px;' +
			'opacity: 0.8;' +
			'background-color: #1783C6;'
		})
		.appendTo(jQuery('#box'+counterWd));
     jQuery("<div></div>", {
			class: 'starttime'
    })
    .appendTo(jQuery('#box'+counterWd+' .box-inner'));
		jQuery("<div></div>", {
		 class: 'tplName'
	 })
	 .appendTo(jQuery('#box'+counterWd+' .box-inner'));
     jQuery("<div></div>", {
			class: 'endtime'
    })
    .appendTo(jQuery('#box'+counterWd+' .box-inner'));
		jQuery("<button></button>", {
		 class: 'closeBox'
	  })
	 .appendTo(jQuery('#box'+counterWd+' .box-inner'));
    jQuery('#box'+counterWd).attr('tabindex', counterWd);
    jQuery('#box'+counterWd).attr('z-index', (100+parseInt(counterWd))+"");
		jQuery("#box"+counterWd+" .starttime").text('00:00');
		jQuery("#box"+counterWd+" .tplName").text(tplName);
	 	jQuery("#box"+counterWd+" .endtime").text('02:00');
		jQuery("#box"+counterWd+" .closeBox").text('X');
		var myDSId = jQuery("#currentShowedDSId").val();
		jQuery("#save_myDS_form").append(
		'<input type="hidden" id="save_myDS'+ myDSId +'wd'+counterWd+'id" name="save_myDS'+ myDSId +'wd'+counterWd+'id" value="-1">' +
		'<input type="hidden" id="save_myDS'+ myDSId +'wd'+counterWd+'startd" name="save_myDS'+ myDSId +'wd'+counterWd+'startd" value="'+ numdayID +'">' +
		'<input type="hidden" id="save_myDS'+ myDSId +'wd'+counterWd+'starth" name="save_myDS'+ myDSId +'wd'+counterWd+'starth" value="0">' +
		'<input type="hidden" id="save_myDS'+ myDSId +'wd'+counterWd+'startm" name="save_myDS'+ myDSId +'wd'+counterWd+'startm" value="0">' +
		'<input type="hidden" id="save_myDS'+ myDSId +'wd'+counterWd+'endd" name="save_myDS'+ myDSId +'wd'+counterWd+'endd" value="'+ numdayID +'">' +
		'<input type="hidden" id="save_myDS'+ myDSId +'wd'+counterWd+'endh" name="save_myDS'+ myDSId +'wd'+counterWd+'endh" value="2">' +
		'<input type="hidden" id="save_myDS'+ myDSId +'wd'+counterWd+'endm" name="save_myDS'+ myDSId +'wd'+counterWd+'endm" value="0">');
		return '#box'+counterWd;
};
jQuery.fn.createBoxSimulate = function(dayID,boxID){
	var counterWd = 9999;
	var Box = jQuery("<div></div>", {
        id: "box"+counterWd,
        class: "calendarbox",
        style: 'position:absolute;' +
        	'width: 96px;' +
               'height: 100px;' +
               'outline: none;'
    })
    .appendTo(jQuery('.'+dayID));
		jQuery("<div></div>", {
		 class: 'box-inner',
		 style: 'margin-top: 2px;'+
		 'width: 100%;' +
		 'height: 96px;' +
		 'opacity: 0.8;' +
		 'background-color: #1783C6;'
		})
		.appendTo(jQuery('#box'+counterWd));
     jQuery("<div></div>", {
			class: 'starttime'
    })
    .appendTo(jQuery('#box'+counterWd+' .box-inner'));
};
jQuery.fn.DelCalendarBoxes = function () {
	jQuery("div.calendarbox").remove();
	jQuery("div.calendarsavedbox").remove();
	counterWd = 0;
};
jQuery.fn.closeBox = function (selectboxID) {
	jQuery(this).on("mousedown", ".closeBox", function(event) {
		if(event.which == 1) {
			jQuery(this).parents(".calendarbox").remove();
			var myDSId = jQuery("#currentShowedDSId").val();
			jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"id").remove();
		 	jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"startd").remove();
		 	jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"starth").remove();
		 	jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"startm").remove();
			jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"endd").remove();
			jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"endh").remove();
			jQuery("#save_myDS"+ myDSId +"wd"+selectboxID+"endm").remove();
		}
	});
};
		jQuery(".create").on("mouseover", function () {
			jQuery(this).css("background-color","#3290C9");
		});
		jQuery(".create").on("mouseout", function () {
			jQuery(this).css("background-color","");
		});
			jQuery(".day2, .day3, .day4, .day5, .day6, .day7, .day1").AddDroppable();
	 		jQuery(".day_box").on("mouseover",".calendarbox", function () {
				var selectboxID = jQuery(this).attr("id").slice(3,5);
				var dayxID = jQuery(this).parent().attr("class").slice(0,4);
				jQuery(".box-inner",this).css("background-color","#3290C9");
				jQuery(".closeBox",this).css("background-color","#3290C9");
				jQuery(".box-inner",this).on("mouseover", ".closeBox", function () {
					jQuery(this).css("color","black");
				});
				jQuery(".box-inner",this).on("mouseout", ".closeBox", function () {
					jQuery(this).css("color","white");
				});
				jQuery(this).AddResizable();
				jQuery(this).AddDraggable();
				jQuery(this).closeBox(selectboxID);
			});
			jQuery(".day_box").on("mouseout", ".calendarbox", function () {
				jQuery(".box-inner",this).css("background-color","#1783C6");
				jQuery(".closeBox",this).css("background-color","#1783C6");
			});
jQuery(".create").on("click", function () {
	var dayID = jQuery(this).attr("id");
	jQuery.fn.createBox(dayID);
});
jQuery("#deleteall").on("click", function () {
	jQuery.fn.DelCalendarBoxes();
});
});
