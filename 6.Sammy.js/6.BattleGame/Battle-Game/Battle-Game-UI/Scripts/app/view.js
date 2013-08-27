/// <reference path="../lib/jquery-2.0.3.js" />

define(["jquery","class"], function ($, Class) {    

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

            if (len === 0) {
                return "<h1>Empty students list recieved from server. Refresh</h1>";
            }

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
    
    var ListView = Class.create({
        init: function (itemsSource) {
            if (!(itemsSource instanceof Array)) {
                throw "The itemsSource of a ListView must be an array!";
            }
            this.itemsSource = itemsSource;
        },
        render: function (template) {

            if (this.itemsSource.length === 0) {
                return "<h1>Empty students list recieved from server. Refresh</h1>";
            }

            var list = document.createElement("ul");
            for (var i = 0; i < this.itemsSource.length; i++) {
                var listItem = document.createElement("li");
                var item = this.itemsSource[i];
                listItem.innerHTML = template(item);
                list.appendChild(listItem);
            }
            return list.outerHTML;
        }
    });

    //<div id="combo-box">
    //    <div id="content"></div>
    //    <div id="arrow-down"></div>
    //    <div id="other-elements"></div>
    //</div>
    var ComboBoxView = Class.create({
        itemsSource: {},
        container: {},
        content: {},
        init: function (container, itemsSource) {
            if (!(itemsSource instanceof Array)) {
                throw "The itemsSource of a ListView must be an array!";
            }
            this.container = $(container);
            this.itemsSource = itemsSource;
        },
        render: function (template) {
            if (this.itemsSource.length === 0) {
                this.container.html("<h1>Empty students list recieved from server. Refresh. Start the server from task 1.</h1>");
                return;
            }

            this.content = $("<div id='combo-box-content'/>");
            //this.content.id = "";
            this.hiddenItems = $("<div id='hidden-items'/>").hide();
            //this.hiddenItems.id = "";

            var firstStudentHtml = template(this.itemsSource[0])
            this.content.html(firstStudentHtml);

            var hiddenItems = "";
            for (var i = 0; i < this.itemsSource.length; i++) {
                hiddenItems += "<div class='combo-box-element'>" + template(this.itemsSource[i]) + "</div>";
            }

            if (!this.hiddenItems) {
                this.hiddenItems = $("#hidden-items")
            }

            this.hiddenItems.html(hiddenItems);
            this.container.append(this.content)
                .append("<div id='open-hidden-items-button'><img src='images/heroAccent.png'/></div>")
                .append(this.hiddenItems);

            this.initEvents();
        },
        initEvents: function () {
            var self = this;

            this.container.on("mouseout", "#open-hidden-items-button", function () {
                $(this).animate({ "padding-top": "5px" }).animate({ "padding-top": "0px" });
            });

            this.container.on("click", "#open-hidden-items-button", function () {
                self.hiddenItems.toggle("slow");
            });

            this.container.on("click", ".combo-box-element", function () {
                self.content.html($(this).html());
                self.hiddenItems.toggle("slow");
            });
        }
    });

    // gets an itemSource(array) and optional settings Object
    return {
        getTableView: function (itemsSource, settings) {
            return new TableView(itemsSource, settings);
        },
        getListView: function (itemsSource) {
            return new ListView(itemsSource);
        },
        getComboBoxView: function (container, itemsSource) {
            return new ComboBoxView(container, itemsSource);
        }
    }
});