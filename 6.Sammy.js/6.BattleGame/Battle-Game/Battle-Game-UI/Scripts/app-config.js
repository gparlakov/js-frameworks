/// <reference path="lib/require.js" />
/// <reference path="lib/jquery-2.0.3.js" />
/// <reference path="lib/jquery-2.0.3.intellisense.js" />
/// <reference path="lib/http-requester.js" />
/// <reference path="lib/class.js" />
/// <reference path="lib/mustache.js" />
/// <reference path="lib/underscore.js" />
/// <reference path="lib/rsvp.min.js" />
/// <reference path="lib/jquery-2.0.3.js" />
/// <reference path="app/views.js" />

/// <reference path="app/controller.js" />
/// <reference path="lib/sammy-0.7.4.js" />

;(function () {
    require.config({
        paths: {
            "jquery":           "lib/jquery-2.0.3",           
            "class":            "lib/class",
            "mustache":         "lib/mustache",
            "rsvp":             "lib/rsvp.min",
            "http-requester":   "lib/http-requester",
            "persister":        "app/data-persister",
            "view":             "app/view",
            "underscore":       "lib/underscore",
            "controller":       "app/controller",
            "sammy":            "lib/sammy-0.7.4",
            "sha1":             "lib/sha1"
        }
    });

    require(["jquery", "persister", "controller","sammy", "underscore"],

        

        function ($, persister, controller, sammy) {

            var mainController = new controller("http://localhost:22954/api/", "main-content");
            
            var battleGameApp = sammy("#main-content", function () {

                this.get("#/", function () {
                    this.load("partialHtmls/loginRegisterForm.html").swap();
                });

                this.get("#/active", function (context) {
                    this.load("partialHtmls/activeGamesPartial.html").swap()
                        .then(function () {
                            mainController.initActiveGames();                            
                        }, function (err) {
                            console.log(err);
                        });
                        
                });

                this.get("#/my", function () {
                    this.load("partialHtmls/myGamesPartial.html").swap().then(function () {
                        mainController.initMyGames();
                    });
                });

                this.get("#/create-game", function () {
                    this.load("partialHtmls/createGamePartial.html").swap();
                });
            });

            if (mainController.persister.isUserLogged) {
                battleGameApp.run("#/active");                
            }
            else {
                battleGameApp.run("#/");
            }
        },

        // on require error
        function onErr(err) {
            alert("A require.js error occured - check console for more info.");
            console.log(err);
        }
    );
})()
