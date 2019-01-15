var options = {
        valueNames:['id','name','program','zip','zipcode','city','street','location','changedate','last_request'],
        searchClass: 'search1',
        plugins: [
                ListPagination({outerWindow:1})
        ]
};
sortList = new List('devices', options);
function update_filter(value) {
        if (document.getElementById('search_filter').style.display != "none") {
                var elem = document.getElementById('search_filter');
                document.getElementById('search_filter2').value = document.getElementById('search_filter').value;
        } else {
                var elem = document.getElementById('search_filter2');
                document.getElementById('search_filter').value = document.getElementById('search_filter2').value;
        }
        var old_val = elem.value;
        sortList.show(0, 99999);
        sortList.search();
        if (value == "all") {
                var options = {
                        valueNames:['name','program','zip','zipcode','city','country','street','location','changedate','last_request','house_number','description','username','fullname'],
                        searchClass: 'search1',
                        plugins: [
                                ListPagination({outerWindow:1})
                        ]
                };
                document.getElementById('search_filter').style.display = "";
                document.getElementById('search_filter2').style.display = "none";
        } else if (value == "not_updated") {
                var options = {
                        valueNames:['up_to_date'],
                        searchClass: 'search1',
                        plugins: [
                                ListPagination({outerWindow:1})
                        ]
                };
                document.getElementById('search_filter').style.display = "none";
                document.getElementById('search_filter2').style.display = "";
                var old_val = 'no';
        } else if (value == "online") {
                var options = {
                        valueNames:['online'],
                        searchClass: 'search1',
                        plugins: [
                                ListPagination({outerWindow:1})
                        ]
                };
                document.getElementById('search_filter').style.display = "none";
                document.getElementById('search_filter2').style.display = "";
                var old_val = 'yes';
        } else if (value == "offline") {
                var options = {
                        valueNames:['online'],
                        searchClass: 'search1',
                        plugins: [
                                ListPagination({outerWindow:1})
                        ]
                };
                document.getElementById('search_filter').style.display = "none";
                document.getElementById('search_filter2').style.display = "";
                var old_val = 'no';
        } else {
                var options = {
                        valueNames:[value],
                        searchClass: 'search1',
                        plugins: [
                                ListPagination({outerWindow:1})
                        ]
                };
                document.getElementById('search_filter').style.display = "";
                document.getElementById('search_filter2').style.display = "none";
        }
	options["valueNames"].push('id');
        sortList = new List('devices', options);
        sortList.search(old_val);
        sortList.show(0, document.getElementById('per_page_filter').value);
}
function update_per_page_view(value) {
        if (value > 0) {
                sortList.show(0, value);
        }
}
