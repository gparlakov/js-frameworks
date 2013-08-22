/// <reference path="jquery-2.0.3.js" />
/// <reference path="class.js" />
var controls = controls || {};
(function (c) {
    var TableView = Class.create({
        // settings is an object of type {rows:5, cols: 3} || {rows:3} || {cols:4} 
        // if not provided it calculates the rows and cols 
        // if rows provided calculates cols 
        // if cols provided calculates rows
	    init: function (itemsSource, settings) {
	        if (!(itemsSource instanceof Array)) {
	            throw "The itemsSource of a ListView must be an array!";
	        }
	        this.itemsSource = itemsSource;

	        var len = itemsSource.length;
	        var rows = 0;
	        var cols = 0;

	        if (!settings || (!settings.rows && !settings.cols)) {
	            var sqrtLen = Math.sqrt(len);
	            cols = Math.ceil(sqrtLen);
	            rows = Math.floor(sqrtLen);
	        }
	        else if (!settings.cols) {
	            cols = Math.ceil(len / settings.rows);
	        }
	        else {
	            cols = settings.cols;
	        }

	        //this.rows = rows;
	        this.cols = cols;	
		},
		render: function (template) {
		    var table = document.createElement("table");
		    var len = this.itemsSource.length;
		    var tr = "";
		    var elements = 0;
		    for (var i = 0; i < len; i++) { 
		        var item = this.itemsSource[i];
		        tr += "<td>" + template(item); + "</td>";
		        elements++;

		        if (elements == this.cols || i == len - 1) {
		            table.innerHTML += "" + tr;
		            elements = 0;
		            tr = "";
		        }
			} 
			return table.outerHTML;
		}
	});

    // gets an itemSource(array) and optional settings Object
	c.getTableView = function (itemsSource, settings) {
	    return new TableView(itemsSource, settings);
	}
}(controls || {}));