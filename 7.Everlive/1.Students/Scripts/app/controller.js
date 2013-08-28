/// <reference path="../lib/everlive.all.min.js" />
/// <reference path="../lib/rsvp.min.js" />

define("controller",
    ["data", "mustache", "class", "underscore"],
    function (data, mustache, Class, uderscore) {
        
        var Controller = Class.create({
            mainContent: {},
            persister: {},
            /*mainContent is */
            init: function (mainContentId, apiKey, errorHandler) {
                this.mainContent = $("#" + mainContentId);

                this.errorHandler = errorHandler;

                this.persister = new data(apiKey);

                this.initEvents();

                this.userSection = $("#user-holder");
            },            
            initEvents: function () {
                var self = this;
                var wrapper = this.mainContent;

                var toggleForms = function () {
                    $("#login-form").toggle();
                    $("#register-form").toggle();
                }

                wrapper.on("click", "#login-register-toggle-button", toggleForms);

                wrapper.on("click", "#login-button", function () {
                    var username = $("#username-login").val();
                    var pass = $("#password-login").val();
                    //var authCode = CryptoJS.SHA1(username + pass).toString();

                    var user = {
                        username: username,
                        password: pass
                    }

                    self.persister.users.login(user)
                        .then(function (response) {
                            self.renderUserSection();
                            open("#/posts", "_self");
                        }, 
                        function (err) {
                            self.errorHandler.handleError(err);
                        });
                });

                wrapper.on("click", "#register-button", function () {
                    var username = $("#username-register").val();
                    var pass = $("#password-register").val();
                    //var authCode = CryptoJS.SHA1(username + pass).toString();

                    var nickName = $("#nickname-register").val();

                    var user = {
                        username: username,
                        password: pass,
                        dispayName: nickName
                    }

                    self.persister.users.register(user)
                        .then(function (response) {
                            self.renderUserSection();
                            open("#/posts","_self");
                        }, function (err) {
                             self.errorHandler.handleError(err);
                        });
                });

                $("#logout-button").click(function () {
                    self.persister.users.logout()
                        .then(function () {
                            self.errorHandler.displayErrorText("User is logged out!");
                            open("#/", "_self");
                        }, function (err) {
                            self.errorHandler.handleError(err);
                        });
                    self.hideUserSection();
                });

                wrapper.on("click", "#create-post-button", function () {
                    var form = $("#create-post-form");

                    var title = form.find("#title-input").val();
                    var content = form.find("#content-input").val();

                    if (!title || !content || title.length < 5 || content.length < 10) {
                        self.errorHandler.displayErrorText("Title must by at least 5 and content at least 10 symbols!");
                        return;
                    }
                    

                    var tags = form.find("#tags-input").val().split(',');
                    tags.push(title.split(' '));

                    var post = {
                        Title: title,
                        Content: content,
                        Tags: tags
                     };

                    self.persister.posts
                        .create(post)
                        .then(function (result) {
                            alert(JSON.stringify(result));
                        }, function (err) {
                            self.errorHandler.handleError(err);
                        });

                })

            },
            renderUserSection: function () {
                var self = this;
                this.persister.users.getCurrentUser()
                    .then(function (response) {
                        self.userSection.find("#nickname").html("Hello, " + response.result.Username);
                    }, function (err) {
                        self.errorHandler.handleError(err);
                    });

                this.userSection.show();
            },
            hideUserSection: function () {
                this.userSection.find("#nickname").html();
                this.userSection.hide();
            },
            renderPost: function () {
                var self = this;
                this.persister.posts.getAll().then(function (response) {
                    var postsListTemplate = mustache.compile($("#posts-list-template").html());

                    var html = postsListTemplate(response);
                    self.mainContent.find("#posts-wrapper").html(html);

                }, function (err) {
                    self.errorHandler.handleError(err);
                });
            }
        });
        
        return function (mainContentId, apiKey, errorHandler) {
            return new Controller(mainContentId, apiKey, errorHandler)
        }
    
    });