		var IDs = [];			
		var pDIDs = [];	
		var currentShowedDivIndex = -1;
		var currentShowedDiv = "";
		var firstplayback = true;
		var ds_stopPlayback = false;
		function activateNextDiv(){
			if (ds_stopPlayback) {
				return;
			}
			var possibleNextShownDivIndex = currentShowedDivIndex;
			var foundScreenToPlay = false;
			var possibleToPlayIDs = [];
			var possibleToPlayIDsPlayDur = [];
			var posscreen = Math.max(0, currentShowedDivIndex);
			var foundPlayDurHigherZero = false;
			var foundPlayDurationEqualsZero = false;
			var playDurAvg = 0;
			for(var h=0; h<IDs.length; h++){
				if (checkStartDate(posscreen)){
					possibleToPlayIDs.push(posscreen);
					var playDur = jQuery("#"+ IDs[ posscreen ] +"playduration").val();
					possibleToPlayIDsPlayDur.push( playDur );
					if (playDur > 0) foundPlayDurHigherZero = true;
					if (playDur == 0) foundPlayDurationEqualsZero = true;
					foundScreenToPlay = true;
				}
				posscreen = ((posscreen +1) % IDs.length);
			}
			if (!foundPlayDurHigherZero && possibleToPlayIDs.length > 1){
				var nowD = new Date();
				for (var k=0; k<possibleToPlayIDs.length; k++){
					var possId = possibleToPlayIDs[k];
					var dsId = IDs[ possId ];
					var doMS = jQuery("#"+ IDs[ possId ] +"dayofmonthstart").val();
					if (nowD.getDay == doMS){
						possibleNextShownDivIndex = possId;
						break;
					} else {
						if (isWeekDayStartToday(possId)){
							possibleNextShownDivIndex = possId;
							break;
						}
					}
				}
			} else if (!foundPlayDurHigherZero && possibleToPlayIDs.length == 1){
				possibleNextShownDivIndex = possibleToPlayIDs[0];
			} else if (foundPlayDurHigherZero && foundPlayDurationEqualsZero && possibleToPlayIDs.length > 1){
				var toPlayIDsIxStart = -1;
				for(var h=currentShowedDivIndex; h < (currentShowedDivIndex + IDs.length); h++){
					var curix = (h + IDs.length) % IDs.length;
					for (var g=0; g<possibleToPlayIDs.length; g++){
						if (possibleToPlayIDs[g] == curix){
							toPlayIDsIxStart = possibleToPlayIDs[ ((g+1) % possibleToPlayIDs.length) ];
							break;
						}
					}
					if (toPlayIDsIxStart > -1) break;
				}
				if (jQuery("#"+ IDs[ toPlayIDsIxStart ] +"playduration").val() == 0){
					var ctrpdhz = 0;
					var sumpdhz = 0;
					for (var r=0; r<possibleToPlayIDs.length; r++){
						var cDur = possibleToPlayIDsPlayDur[r];
						if (cDur > 0){
							ctrpdhz++;
							sumpdhz += parseInt(cDur);
						}
					}
					playDurAvg = Math.floor(sumpdhz / ctrpdhz);
				}
				possibleNextShownDivIndex = toPlayIDsIxStart;
			} else if (possibleToPlayIDsPlayDur.length > 0){
				var toPlayIDsIxStart = -1;
				for(var h=currentShowedDivIndex; h < (currentShowedDivIndex + IDs.length); h++){
					var curix = (h + IDs.length) % IDs.length;
					for (var g=0; g<possibleToPlayIDs.length; g++){
						if (possibleToPlayIDs[g] == curix){
							toPlayIDsIxStart = possibleToPlayIDs[ ((g+1) % possibleToPlayIDs.length) ];
							break;
						}
					}
					if (toPlayIDsIxStart > -1) break;
				}
				possibleNextShownDivIndex = toPlayIDsIxStart;
			}	
			if (firstplayback && !foundScreenToPlay){
					possibleNextShownDivIndex = 0;
			}		
			if (firstplayback) firstplayback = false;
			if (possibleNextShownDivIndex != currentShowedDivIndex){
				currentShowedDivIndex = possibleNextShownDivIndex;
				enableDIV(IDs[currentShowedDivIndex], IDs);
                                currentShowedDiv = IDs[currentShowedDivIndex];
			}
			if (IDs == null || IDs.length <= 1){
				return ;
			}
			var playdur = Math.max(3, Math.max( pDIDs[currentShowedDivIndex], playDurAvg));
			window.setTimeout( function(){ activateNextDiv();} , ( playdur * 1000));
		}
		
		function checkStartDate( usedIDindex ){
			var dsId = IDs[usedIDindex];
			var dnow = new Date();
			var dnowmil = dnow.getTime()/1000;
			var ddayofmonthnow = dnow.getDate();
			var sperm = jQuery("#"+ dsId +"permanent").val();
			var sstart = jQuery("#"+ dsId +"startdate").val();
			var send = jQuery("#"+ dsId +"enddate").val();
			if (send > 0) {
				send += 1000*60*60*24;
			}
			var sdayofmonthstart = jQuery("#"+ dsId +"dayofmonthstart").val();
			var sdayofmonthend = jQuery("#"+ dsId +"dayofmonthend").val();
			if (sperm == 1) return true;
			if (sstart < dnowmil && (send > dnowmil || send == 0) ){
				if (sdayofmonthstart <= ddayofmonthnow && (sdayofmonthend >= ddayofmonthnow || sdayofmonthend == 0) ){
					if (checkWeekday( usedIDindex )){
						return true;		
					}
				}
			}			
			return false;
		}
		function checkWeekday( usedIDindex ){
			var dsId = IDs[usedIDindex];
			var dnow = new Date();
			var dnowd = dnow.getDay()+1;
			var dnowh = dnow.getHours();
			var dnowm = dnow.getMinutes();
                        var dnowY = dnow.getFullYear();
                        var dnowM = dnow.getMonth();
                        var dnowD = dnow.getDay();
			var dnowMS = dnow.getTime() / 1000 | 0;
			if (jQuery("#"+ dsId +"wd1startd").val()){
				for (var r=1; r <= 70 ;r++){
					if (jQuery("#"+ dsId +"wd"+r+"startd").val()){
						var wdstartd = jQuery("#"+ dsId +"wd"+r+"startd").val();
						var wdstarth = jQuery("#"+ dsId +"wd"+r+"starth").val();
						var wdstartm = jQuery("#"+ dsId +"wd"+r+"startm").val();
						var wdendd = jQuery("#"+ dsId +"wd"+r+"endd").val();
						var wdendh = jQuery("#"+ dsId +"wd"+r+"endh").val();
						var wdendm = jQuery("#"+ dsId +"wd"+r+"endm").val();
						if ( wdstartd  == 0 ) return true;
                                                if ( wdstartd > 7 && wdendd > 7){
                                                    if (wdstartd == wdendd){
                                                        var dnows = new Date((wdstartd*1000));
                                                        var dnowsY = dnows.getFullYear();
                                                        var dnowsM = dnows.getMonth();
                                                        var dnowsD = dnows.getDay();
                                                        if ( dnowY == dnowsY && dnowM == dnowsM && dnowD == dnowsD ){
                                                            return true;
                                                        }
                                                    } else if (wdstartd <= dnowMS && wdendd >= dnowMS){
                                                        return true;
                                                    }
                                                    
                                                } else if (dnowd >= wdstartd && dnowd <= wdendd){
							if ((dnowh > wdstarth || dnowh == wdstarth && dnowm >= wdstartm) && (dnowh < wdendh || dnowh == wdendh && dnowm < wdendm) ){
								return true;
							}
						}
					}
				}
				return false;
			} else {
				return true;
			}	
		}
		function isWeekDayStartToday( usedIDindex ){
			var dsId = IDs[usedIDindex];
			var dnow = new Date();
			var dnowd = dnow.getDay();
			var dnowh = dnow.getHours();
			var dnowm = dnow.getMinutes();
			if (jQuery("#"+ dsId +"wd1startd").val()){
				for (var r=1; r <= 70 ;r++){
					if (jQuery("#"+ dsId +"wd"+r+"startd").val()){
						var wdstartd = jQuery("#"+ dsId +"wd"+r+"startd").val();
						var wdendd   = jQuery("#"+ dsId +"wd"+r+"endd").val();
						var wdstarth = jQuery("#"+ dsId +"wd"+r+"starth").val();
						var wdstartm = jQuery("#"+ dsId +"wd"+r+"startm").val();
						if ( (dnowd >= wdstartd && dnowd <= wdendd) && dnowh == wdstarth && dnowm == wdstartm){
								return true;
						}
					}
				}
				return false;
			} else {
				return true;
			}	
		}
		function startVideosWithMyDSId(usedMyDsId){
      		jQuery("#"+ usedMyDsId).find("iframe").each( function(){ 
      			if ( this.src.indexOf("autoplay=") > -1) {
      				var newSrc = jQuery(this).attr('src').replace('autoplay=0', 'autoplay=1');
      				jQuery(this).attr('src', newSrc);
      				try{
      					jQuery(this).contentWindow.reload(true);
      				}catch(err){
                                }
      			} 
      		});
		jQuery("#"+ usedMyDsId).find("source").each( function(){ 
      			if (jQuery(this).parent().prop("autoplay") > -1) {
				jQuery(this).parent()[0].play();
      			} 
      		});
      }
      function stopVideosWithMyDSId(usedMyDsId){
		jQuery("#"+ usedMyDsId).find("iframe").each( function(){ 
      			if ( this.src.indexOf("autoplay=") > -1) {
      				var newSrc = jQuery(this).attr('src').replace('autoplay=1', 'autoplay=0');
      				jQuery(this).attr('src', newSrc);
      				try{
      					jQuery(this).contentWindow.reload(true);
      				}catch(err){
                                }
      			} 
      		});
		jQuery("#"+ usedMyDsId).find("source").each( function(){ 
      			if (jQuery(this).parent().prop("autoplay") > -1) {
				jQuery(this).parent()[0].pause();
      			} 
      		});
      }
		var pictureResizeFinished = false;
		function startSlideShowWaiter(){
			if (pictureResizeFinished){
				if (IDs == null || IDs.length == 0){
					return ;
				}
				if (pDIDs == null || pDIDs.length == 0){
					return ;
				}
				
				if (pDIDs[currentShowedDivIndex] != null) {
					window.setTimeout( function(){ activateNextDiv();} , (Math.max(3, pDIDs[currentShowedDivIndex]) * 1000));
				} else {
					window.setTimeout( function(){ activateNextDiv();} , 10);
				}
			} else {
				window.setTimeout( function(){ startSlideShowWaiter(); } ,  500);
			}
		}
	function startScheduling(){
		IDs = [];
		jQuery("#allDSScreens").find("div").each(function(){
                    if ( /^(myDS[X]?[0-9]{1,})$/.test(this.id) ) {
                        IDs.push( this.id); 
                    } });
		pDIDs = [];
		jQuery("#allDSScreens").find("input").each(function(){
                    if ( /^(myDS[X]?[0-9]{1,}playduration)$/.test(this.id) ) {
                        pDIDs.push( this.value); 
                    } });
		
		
		ds_stopPlayback = false;
		getSize(); 
		myresizer(); 
		
		startSlideShowWaiter(); 
	}
		window.onload = function() { 
			startScheduling();
		};
