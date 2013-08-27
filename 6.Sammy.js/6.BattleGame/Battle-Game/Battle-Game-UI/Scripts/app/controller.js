/// <reference path="../lib/require.js" />
/// <reference path="../lib/jquery-2.0.3.js" />
/// <reference path="../lib/class.js" />
/// <reference path="../lib/underscore.js" />

define("controller",

    ["jquery", "class", "persister", "sha1", "mustache", "underscore"],

    function ($, Class, dataPersister, sha1, mustache) {
        var errorFunc = function (error) {
            if (error.statusText == "Created" || error.statusText == "OK") {
                var messageHolder = $("#error-holder-child");
                messageHolder.html("Done!");

                setTimeout(function () { messageHolder.html("") }, 5000);

                return;
            }

            var message = JSON.parse(error.responseText);

            if (message && message.Message) {
                showErrorText(message.Message, "#error-holder-child");
                return;
            }

            alert("An error occured - check console!");
            console.log(error);
        }
        
        var showErrorText = function (errorMessage, element) {  
            var alert = $("<p class='error'/>").html(errorMessage);
            $(element).parent().prepend(alert);
            setTimeout(function () {
                alert.slideToggle(1000);
            }, 2000);
        }
        
        var Controller = Class.create({
            mainContent: {},
            persister: {},
            init: function(baseUrl, mainContentId){
                //this.baseUrl = baseUrl;
                this.persister = dataPersister.getPersister(baseUrl);

                this.mainContent = $("#" + mainContentId);
                this.initEvents();
            },
            initEvents: function () {
                var self = this;
                var wrapper = this.mainContent;

                var toggleForms = function () {
                    $("#login-form").toggle();
                    $("#register-form").toggle();
                }
                /*****user buttons*****/
                wrapper.on("click", "#login-register-toggle-button", toggleForms);

                wrapper.on("click", "#login-button", function () {
                    var username = $("#username-login").val();
                    var pass = $("#password-login").val();
                    var authCode = CryptoJS.SHA1(username + pass).toString();

                    var user = {
                        username: username,
                        authCode: authCode
                    }

                    self.persister.users.login(user)
                        .then(function (response) {
                            open("#/active", "_self");
                        }, errorFunc);
                });

                wrapper.on("click", "#register-button", function () {
                    var username = $("#username-register").val();
                    var pass = $("#password-register").val();
                    var authCode = CryptoJS.SHA1(username + pass).toString();

                    var nickName = $("#nickname-register").val();

                    var user = {
                        username: username,
                        authCode: authCode,
                        nickName: nickName
                    }

                    self.persister.users.register(user)
                        .then(function (response) {
                            open("#/active", "_self");
                        }, errorFunc);
                });

                wrapper.on("click", "#logout-button",function () {
                    self.persister.users.logout().then(function () {
                        open("#/", "_self");
                    }, errorFunc);
                });


                /********game buttons ******/
                wrapper.on("click", ".active-game-holder", function () {
                    $(".selected").toggleClass("selected");

                    $(this).toggleClass("selected");
                });

                wrapper.on("click", "#join-game-button", function () {
                    var gameId = $(".selected").data("game-id");
                    if (!gameId) {
                        showErrorText("No selected game!", this);
                        return;
                    }

                    var password = $("#join-game-password").val();
                    if (!password || password == "" ) {
                        password = undefined;
                    }
                    else {
                        password = CryptoJS.SHA1(password).toString();
                    }

                    var gameToJoin = {
                        id: gameId,
                        password: password
                    }

                    self.persister.game.join(gameToJoin).then(function (result) {
                        //console.log(result);
                        var selected = $(".selected").html("<strong>Joined!</strong>");
                        setTimeout(function () {
                            selected.remove();
                        }, 3000);
                    }, errorFunc);
                });

                wrapper.on("click", "#start-selected-game-button", function () {

                })

                /*********** Create game **********/
                wrapper.on("click", "#create-new-game-button", function () {
                    var newGameInput = $("#new-game-title");
                    var newGameTitle = newGameInput.val();
                    if (!newGameTitle || newGameTitle.length < 6) {
                        showErrorText("Titel of game should be at least 6 charachters", this);
                        return;
                    }

                    var password = $("#new-game-password").val();

                    if (password != "") {
                        password = CryptoJS.SHA1(password).toString();
                    }
                    else {
                        password = undefined;
                    }

                    var newGame = {
                        title: newGameTitle,
                        password: password
                    }

                    self.persister.game.create(newGame).then(function () {
                        newGameInput.attr("placeholder", "Created!");
                    }, errorFunc);
                });

            },
            initActiveGames: function () {
                var nickname = localStorage.getItem("nickname");

                if (!nickname) {
                    $("#active-games-wrapper").html("<h2>Please login</h2>");
                    return;                              
                }

                $("#nickname-element").html("Hi, " + nickname);

                var template = mustache.compile($("#active-games-template").html());

                var self = this;

                self.persister.game.getAll()
                    .then(function (data) {
                        $("#active-games").html(template(data));
                    },errorFunc);
            },
            initMyGames: function () {
                var nickname = localStorage.getItem("nickname");

                if (!nickname) {
                    $("#my-games-wrapper").html("<h2>Please login</h2>");
                    return;                              
                }

                this.persister.game.getMy().then(function (data) {
                    var myGames = _.where(data,{creator: nickname});

                    var joinedGames = _.reject(data, function (game) {
                        return game.creator == nickname;
                    });

                    var joinedGamesTemplate = mustache.compile($("#joined-games-template").html());
                    var joinedGameHtml = joinedGamesTemplate(joinedGames);
                    $("#joined-games").html(joinedGameHtml);

                    var myGamesTemplate = mustache.compile($("#created-games-template").html());
                    var myGamesHtml = myGamesTemplate(myGames);                    
                    $("#created-games").html(myGamesHtml);
                });

                this.persister.get
            }
        });

        return Controller;
    
    });