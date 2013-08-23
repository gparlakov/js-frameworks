define(["class"], function (Class) {
    var BaseViewClass = Class.create({
        itemsSource: {},
        init: function (itemsSource) {
            if (!(itemsSource instanceof Array)) {
                throw "The itemsSource of a ListView must be an array!";
            }
            this.itemsSource = itemsSource;
        }
    });

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

    var ComboBoxView = Class.create({
        init: function (itemsSource) {

        }
    });

    // gets an itemSource(array) and optional settings Object
    return {
        getTableView: function (itemsSource, settings) {
            return new TableView(itemsSource, settings);
        },
        getListView: function (itemsSource) {
            return new ListView(itemsSource);
        }
    }
});