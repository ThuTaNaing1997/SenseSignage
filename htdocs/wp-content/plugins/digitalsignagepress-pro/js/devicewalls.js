isPortrait = 0;
function  handleRows() {
    var table = document.getElementById('t01');
    var is = table.rows.length;
    var should = parseInt(document.getElementById('device_wall_rows').value, 10);
    if(should <= 0 || isNaN(should)) {
	document.getElementById('device_wall_rows').value = is;
	return;
    }
    if(should > is) {
        for(var index = is; index < should; index++) {
            var newRow = table.insertRow(index);
            for(var i = 0; i < table.rows[is - 1].cells.length; i++) {
                var newCell = newRow.insertCell(i);
                var newText  = document.createTextNode((index + 1) + '/' + (i + 1));
                newCell.appendChild(newText);
            }
        }
    } else if(should < is) {
        for(var index = is; index > should; index--) {
            table.deleteRow(index - 1);
        }
    }
    performGeneralTableLayout(table);
}
function performGeneralTableLayout(table) {
    handleBezelHeight();
    handleBezelWidth();
    if(isPortrait) {
	jQuery('#t01 td').css("height", "4em");
    	jQuery('#t01 td').css("width", "3em");
    } else {
    	jQuery('#t01 td').css("height", "3em");
    	jQuery('#t01 td').css("width", "4em");
    }
    jQuery('#t01 td').css("text-align", "center");
    cksv();
}
function performGeneralLayout(portrait, rows, columns) {
    isPortrait = portrait;
    if(isPortrait == 0) {
        selectLandscape();
    } else {
        selectPortrait();
    }
    if(rows <= 0 || isNaN(rows) || columns <= 0 || isNaN(columns)) {
	return;
    }
    document.getElementById('device_wall_rows').value = rows;
    document.getElementById('device_wall_columns').value = columns;
    handleRows();
    handleColumns();
}
function handleColumns() {
    var table = document.getElementById('t01');
    var is = table.rows[0].cells.length;
    var should = parseInt(document.getElementById('device_wall_columns').value, 10);
    if(should <= 0 || isNaN(should)) {
	document.getElementById('device_wall_columns').value = is;
	return;
    }
    if(should > is) {
        for(var index = is; index < should; index++) {
            for(var i = 0; i < table.rows.length; i++) {
               var newCell = table.rows[i].insertCell(index);
               var newText  = document.createTextNode((i + 1) + '/' + (index + 1));
               newCell.appendChild(newText);
            }
        }
    } else if(should < is) {
       for(var index = is; index > should; index--) {
            for(var i = 0; i < table.rows.length; i++) {
                table.rows[i].deleteCell(index - 1);
            }
        }
    }
    performGeneralTableLayout(table);
}
function handleBezelWidth() {
    var should = parseInt(document.getElementById('device_bezel_compensation_w').value, 10) - 2;
    if(should < 3) should = 3;
    if(should > 10) should = 10;
    jQuery('#t01 td').css("border-left", should + "px solid black");
    jQuery('#t01 td').css("border-right", should + "px solid black");
}
function handleBezelHeight() {
    var should = parseInt(document.getElementById('device_bezel_compensation_h').value, 10) - 2;
    if(should < 3) should = 3;
    if(should > 10) should = 10;
    jQuery('#t01 td').css("border-top", should + "px solid black");
    jQuery('#t01 td').css("border-bottom", should + "px solid black");
}
function selectPortrait() {
    jQuery('#t01 td').css("height", "4em");
    jQuery('#t01 td').css("width", "3em");
    jQuery('#t01 td').css("text-align", "center");
    isPortrait = 1;
    document.getElementById("selector_landscape").className="";
    document.getElementById("selector_portrait").className="selected_layout";
    document.getElementById("device_portrait").value = 1;
}
function selectLandscape() {
    jQuery('#t01 td').css("height", "3em");
    jQuery('#t01 td').css("width", "4em");
    jQuery('#t01 td').css("text-align", "center");
    isPortrait = 0;
    document.getElementById("selector_landscape").className="selected_layout";
    document.getElementById("selector_portrait").className="";
    document.getElementById("device_portrait").value = 0;
}
