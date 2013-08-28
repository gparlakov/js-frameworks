/// <reference path="lib/require.js" />
/// <reference path="lib/sammy-0.7.4.js" />
/// <reference path="lib/jquery-2.0.3.js" />
/// <reference path="lib/everlive.all.min.js" />


;(function () {    
    require.config({
        paths: {
            "class": "lib/class",
            "everlive": "lib/everlive.all.min",
            "errorHandler": "app/errorHandler",
            "controls": "app/controls",
            "data": "app/data",
            "controller": "app/controller",
            "sammy": "lib/sammy-0.7.4",
            "underscore": "lib/underscore",
            "mustache": "lib/mustache",
            "rsvp":"lib/rsvp.min"
        }
    });

    require(["errorHandler", "everlive", "controller", "sammy", "underscore"],    
        function ( handler, persister, controller, sammy) {
            var errorHandler = handler.getErrorHandler("message-display-element");

            var mainController = new controller("main-content", "oJBOmifHcu3At1cv", errorHandler);
            
            var forumApp = sammy("#main-content", function () {
                this.get("#/", function () {
                    this.load("partialHtml/loginRegisterForm.html").swap();
                });

                this.get("#/home", function () {
                    open("#/", "_self");
                });

                this.get("#/posts", function () {
                    //errorHandler.displayErrorText("Posts!")
                    this.load("partialHtml/postsPartial.html").swap().then(function () {
                        mainController.renderPost();
                    })
                })

                this.get("#/about", function () {
                    errorHandler.displayErrorText("About!")
                })

                this.get("#/posts/:id", function (id) {
                    errorHandler.displayErrorText("get by id" + id);
                })

            });

            if (mainController.persister.isUserLogged()) {
                mainController.renderUserSection();
                forumApp.run("#/posts");
            } else {
                forumApp.run("#/");
            }
            

        }, function (err) {
            prompt("An error occured! Check Console!");
            console.log(err);
        });
})()
