/// <reference path="../lib/jquery-2.0.3.js" />

define("errorHandler", ["class"], function (Class) {
    var ErrorHandler = Class.create({
        init: function (element) {
            var selectedElement = $(element);
            if (selectedElement.length == 0) {
                selectedElement = $("#" + element);
            }
            if (selectedElement.length == 0) {
                throw {
                    message: "No such element"
                }
            }

            this.messageElement = selectedElement;
            
        },
        handleError: function (error) {
            //if (error.statusText == "Created" || error.statusText == "OK") {               
            //    ErrorHandler.messageElement.html("Done!");
            //    setTimeout(function () { messageHolder.html("") }, 5000);
            //    return;
            //}

            if (error.message) {
                this.displayErrorText(error.message);
                return;
            }

            if (error.responseText) {
                var message = JSON.parse(error.responseText);

                if (message && message.Message) {
                    this.displayErrorText(message.Message);
                    return;
                }
            }

            prompt("An error occured - check console!");
            console.log(error);
        },
        displayErrorText: function (errorMessage) {
            var alert = $("<p class='error'/>").html(errorMessage);
            this.messageElement.prepend(alert);

            setTimeout(function () {
                alert.slideToggle(400).remove();
            }, 2000);
        }
    });

    return {
        getErrorHandler: function(element){
            return new ErrorHandler(element);
        }
    }
});