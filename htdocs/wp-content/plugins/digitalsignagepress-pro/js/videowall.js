var currServerTime = 0;
var currServerTimeDetermined = 0;
var currServerTimeRequestDuration = 50000;
var currslide = -1;
var vwScreen = [];
var curJobActive = false;
function checkVideoWall(startReqTime, data) {
    var nowTime = (new Date()).getTime();
    var requestDuration = parseInt((nowTime - startReqTime), 10);
    if (requestDuration <= currServerTimeRequestDuration) {
        setServerTime((parseInt(data) + requestDuration/2 ), nowTime - (requestDuration/2), requestDuration);
    }
    var divServerServerTime = (getCurrentServerTime() - (parseInt(data) + (requestDuration / 2)));
}
function setServerTime(servertime, timeWhenServerTimeWasSet, requestDuration) {
    currServerTime = servertime;
    currServerTimeDetermined = timeWhenServerTimeWasSet;
    currServerTimeRequestDuration = requestDuration;
}
function getCurrentServerTime() {
    var nowTime = (new Date()).getTime();
    var diffToStart = nowTime - currServerTimeDetermined;
    var newServTime = currServerTime + diffToStart;
    return newServTime;
}
function switchScreen(currslide) {
    var start = (new Date()).getTime();
    var curServTime = getCurrentServerTime();
    document.getElementById('currentShowedDivVariable').value = currslide;
    enableDIV("myDS"+document.getElementById('currentShowedDivVariable').value, vwScreen);
    curJobActive = false;
}
function checkScreenToPlay(startReqTime, data) {
    var split = data.split(",");
    var screenNumber = parseInt(split[0]);
    var duration = Number(split[1]);
    duration = duration - getCurrentServerTime();
    var currentScreenNumber = document.getElementById('currentShowedDivVariable').value;
    if(!isNaN(screenNumber) && screenNumber != currentScreenNumber) {
        document.getElementById('currentShowedDivVariable').value = screenNumber;
        if (currentScreenNumber == 0) {
            switchScreen(screenNumber);
        }
        window.setTimeout(function(){switchScreen(screenNumber);} , duration);
    }
    var randomSleep = Math.floor((Math.random() * 50) + 1);
    var contentRefresh = duration - randomSleep;
    window.clearTimeout(fetch_slide_var);
    fetch_slide_var = window.setTimeout(function(){ds_fetch_next_slide();} , contentRefresh);
}
function checkServerSync() {
    var nowTime = (new Date()).getTime();
    if ((nowTime - currServerTimeDetermined) > 120000) {
        var newCurrServerTimeRequestDuration = (currServerTimeRequestDuration * 1.15);
        currServerTimeRequestDuration = newCurrServerTimeRequestDuration;
    }
}
function fillvwScreen(){
    jQuery("#allDSScreens").find("div").each(function () {
        if (/^(myDS[0-9]{1,})$/.test(this.id)) {
            vwScreen.push(this.id);
        }
    });
}
jQuery(document).ready(function () {
    window.setInterval(function () {
        checkServerSync();
    }, 60000);
});
window.onload = function () {
    fillvwScreen();
    getSize();
    myresizer();
};	
