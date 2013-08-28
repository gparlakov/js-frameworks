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
            "sha1":             "lib/sha1",
            "errorHandler":     "app/errorHandler"
        }   
    });

    require(["jquery", "errorHandler", "persister", "controller","sammy", "underscore",],
        function ($, handler, persister, controller, sammy) {
            var errorHandler = handler.getErrorHandler("error-holder-child");

            var mainController = new controller("http://localhost:22954/api/", "main-content");
            
            var battleGameApp = sammy("#main-content", function () {

                this.get("#/", function () {
                    this.load("partialHtmls/loginRegisterForm.html").swap().then(function () {
                        
                    }, errorHandler.handleError);
                });

                this.get("#/active", function (context) {
                    this.load("partialHtmls/activeGamesPartial.html").swap()
                        .then(function () {
                            mainController.initActiveGames();                            
                        }, errorHandler.handleError);
                        
                });

                this.get("#/my", function () {
                    this.load("partialHtmls/myGamesPartial.html").swap().then(function () {
                        mainController.initMyGames();
                    }, errorHandler.handleError);
                });

                this.get("#/create-game", function () {
                    this.load("partialHtmls/createGamePartial.html").swap();
                }, errorHandler.handleError);

                this.get("#/battle-in-game", function () {
                    this.load("partialHtmls/battleInGamePartial.html").swap()
                        .then(function () {
                            mainController.renderBattleInGame();
                        });
                }, errorHandler.handleError)
            });

            if (mainController.persister.isUserLogged) {
                battleGameApp.run("#/active");                
            }
            else {
                battleGameApp.run("#/");
            }
        }, function (err) {
            prompt("An error occured! Check Console!");
            console.log(err);
        });
})()
