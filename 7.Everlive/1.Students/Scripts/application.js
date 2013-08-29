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
                    this.load("partialHtml/loginRegisterForm.html").swap()
                        .then(function () {
                            mainController.renderTags();
                        }
                    );
                });

                this.get("#/home", function () {
                    open("#/", "_self");
                });

                this.get("#/posts", function () {
                    //errorHandler.displayErrorText("Posts!")
                    this.load("partialHtml/postsPartial.html").swap()
                        .then(function () {
                            mainController.renderPost();
                        }, function (err) {
                            mainController.errorHandler.handleError(err);
                        }
                    )
                })

                this.get("#/about", function () {
                    this.load("partialHtml/aboutPartial.html").swap()
                        .then(null,
                        function (err) {
                            mainController.errorHandler.handleError(err);
                        }
                    );
                })

                this.get("#/posts/create", function (context) {

                    //main = $("#main-content");
                    //var oldmarkup = main.html();
                    this.load("partialHtml/newPostFormPartial.html")
                        .then(function (partialHtml) {
                            //main.html(oldmarkup);
                            $("#new-post-form-holder").html(partialHtml);
                        }, function (err) {
                            mainController.errorHandler.handleError(err);
                        }
                    );
                })

                this.get("#/posts/:id/comment", function (context) {
                    var postId = context.params.id;
                    this.load("partialHtml/commentFormPartial.html")
                        .then(function (partialHtml) {
                            $("#comment-form-holder").html(partialHtml);
                        }, function (err) {
                            mainController.errorHandler.handleError(err);
                        }
                    )
                })

                this.get("#/posts/:id", function (context) {
                    var id = context.params.id;
                    this.load("partialHtml/postDetailsPartial.html").swap()
                        .then(function () {
                            mainController.renderPostDetails(id);
                        }, function (err) {
                            mainController.errorHandler.handleError(err);
                        }
                    )
                })

                this.get("#/posts/:id/comment", function (context) {
                    var postId = context.params.id;
                });
                
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
