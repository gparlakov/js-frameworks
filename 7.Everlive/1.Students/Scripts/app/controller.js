/// <reference path="../lib/everlive.all.min.js" />
/// <reference path="../lib/rsvp.min.js" />
/// <reference path="../lib/jquery-2.0.3.js" />
/// <reference path="controls.js" />

define("controller",
    ["data", "mustache", "class", "controls","underscore"],
    function (data, mustache, Class, uiControls, uderscore) {
        
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

                var toggleForms = function (event) {
                    event.preventDefault();
                    $("#login-form").toggle();
                    $("#register-form").toggle();
                }
                /******** user actions login register logout ******/
                wrapper.on("click", "#login-register-toggle-button", toggleForms);

                wrapper.on("click", "#login-button", function (e) {
                    e.preventDefault();

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

                wrapper.on("click", "#register-button", function (e) {
                    e.preventDefault();

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

                /****** posts ****/
                wrapper.on("click", "#create-post-button", function (e) {
                    e.preventDefault();
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
                        Tags: tags,
                        AuthorId:"" // needed for cloud code Author
                     };

                    self.persister.posts
                        .create(post)
                        .then(function (result) {
                            var posts = self.mainContent.find("#posts-wrapper")
                                .children().first();

                            var template = mustache.compile($("#post-template").html());

                            post.Author = "This is your new Post";
                            post.CreatedAt = result.result.CreatedAt;

                            var newPostHtml = template(post);

                            posts.append(newPostHtml);

                        }, function (err) {
                            self.errorHandler.handleError(err);
                        });

                })

                /****** comments ****/
                wrapper.on("click", "#leave-comment-button", function (e) {
                    e.preventDefault();
                    var form = $("#leave-comment-form");
                    var comment = form.find("#comment-content-input").val();
                    var postId = $("#post-details").data("post-id");

                    if (comment.length < 5) {
                        self.errorHandler.displayErrorText("Comment must be at least 5 symbols");
                        return;
                    }

                    if (!postId || postId.length < 10) {
                        self.errorHandler.displayErrorText("Wrong credentials - please refresh or login");
                        return;
                    }

                    var comment = {
                        Content: comment,
                        PostId: postId,
                        AuthorId: "" // needed for cloud code Author
                    }

                    self.persister.comments.commentPost(comment)
                        .then(function (response) {
                            comment.Author = "Me,Myself And mee";
                            var commentTemplateCode = $("#comment-template").html();
                            var commentHtml = mustache.render(commentTemplateCode, comment);
                            var ul = self.mainContent.find("#comments-wrapper")
                            ul.append(commentHtml);

                            var result = $("<span>")
                                .html("Success: ")
                                .addClass("done-ok-green");

                            form.prepend(result);
                            form.find("#comment-content-input").val("");

                            setTimeout(function () {
                                result.slideToggle().remove();
                            }, 5000);
                           
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
                    var postsListTemplate = mustache.compile($("#post-template").html());

                    var tableView = uiControls.getListView(response.result);
                    var html = tableView.render(postsListTemplate);

                    self.mainContent.find("#posts-wrapper").html(html);
                }, function (err) {
                    self.errorHandler.handleError(err);
                });
            },
            renderPostDetails: function (id) {
                var self = this;
                this.persister.posts.getById(id)
                    .then(function (response) {
                        var template = mustache.compile(
                            self.mainContent.find("#post-details-template").html());

                        var model = response.result;
                        if (!(model instanceof Array)) {
                            model = [model];
                        }
                        var listView = uiControls.getListView(model);
                        var postDetailsHtml = listView.render(template);

                        var postsDetailsWrapper = self.mainContent.find("#post-details-wrapper");
                        postsDetailsWrapper.html(postDetailsHtml);

                        return self.persister.comments.getByPostId(id);
                    })
                    .then(function (response) {
                        var commentTemplate = mustache.compile(
                            self.mainContent.find("#comment-template").html());

                        var uiControl = uiControls.getListView(response.result, { rows: 1 });

                        var commentsHtml = uiControl.render(commentTemplate);
                        
                        self.mainContent.find("#comments-wrapper").html(commentsHtml);

                    }, function (err) {
                        self.errorHandler.handleError(err);
                    })
            },
            renderTags: function () {

                var self = this;
                this.persister.posts.getTags()
                    .then(function (tags) {
                        
                        var tagsText = "";

                        for (var i in tags) {
                            tagsText += i + ", ";
                        }

                        $("#tags").html("<strong>Tags:</strong><p>" + tagsText + "</p>");
                    },
                    function (err) {
                        self.errorHandler.handleError(err);
                    })
                
            }
        });
        
        return function (mainContentId, apiKey, errorHandler) {
            return new Controller(mainContentId, apiKey, errorHandler)
        }
    
    });