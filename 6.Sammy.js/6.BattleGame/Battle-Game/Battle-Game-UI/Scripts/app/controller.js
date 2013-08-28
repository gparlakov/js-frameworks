/// <reference path="../lib/require.js" />
/// <reference path="../lib/jquery-2.0.3.js" />
/// <reference path="../lib/class.js" />
/// <reference path="../lib/underscore.js" />

define("controller",

    ["jquery", "class", "persister", "sha1", "mustache", "underscore"],

    function ($, Class, dataPersister, sha1, mustache) {
        var errorFunc = function (error) {
            if (error.statusText == "Created" || error.statusText == "OK" || error.status >=200 && error.status < 300) {
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
                    var selected = $(".selected");
                    var selectedGameId = selected.data("created-game-id");

                    if (selected.length == 0 || !selectedGameId) {
                        showErrorText("Select a game to start", this);
                        return;
                    }

                    self.persister.game.start(selectedGameId).then(function () {
                        selected.html("Started!");

                        setTimeout(function () {
                            selected.remove();
                        }, 3000);

                    }, errorFunc);
                });

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

                /******** gop to selected game *****/
                wrapper.on("click", "#go-to-selected-game-button", function () {
                    var selected = $(".selected");
                    if (selected.length == 0) {
                        showErrorText("Select game to go to!", this);
                        return;
                    }

                    var selectedGameId = selected.data("joined-game-id");

                    self.persister.game.goToGame(selectedGameId).then(function (data) {
                        //console.log(data);

                        var field = self.createField(data);

                        var grid = {
                            title: data.title,
                            blueNickname: data.blue.nickname,
                            redNickname: data.red.nickname,
                            turn: data.turn,
                            inTurn: data.inTurnf,
                            field: field
                        };

                        var battleFieldTemplate = mustache.compile($("#battle-field-template").html());

                        var battleFieldHtml = battleFieldTemplate(grid);

                        $("#battle-field").html(battleFieldHtml);
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

                //this.persister.get
            },
            renderBattleInGame: function () {
                var nickname = localStorage.getItem("nickname");
                if (!nickname) {
                    $("#battle-in-game-wrapper").html("Please login!");
                    return;
                }

                var joinedGamesTemplate = mustache.compile($("#joined-games-template").html());

                var self = this;

                this.persister.game.getMy()
                    .then(function (data) {
                        var htmlJoined = joinedGamesTemplate(data);
                        $("#joined-games").html(htmlJoined);
                    }, errorFunc);
            },
            renderBattleField: function () {
                
            },
            putUnitsInField: function (units, field) {
                for (var i = 0; i < units.length; i++) {
                    var unit = units[i];
                    var x = unit.position.x;
                    var y = unit.position.y;
                    field[x][y] = unit;
                }

                return field;
            },
            createField: function (data) {
                var field = [];

                var redUnits = data.red.units;
                var blueUnits = data.blue.units;

                for (var x = 0; x < 9; x++) {
                    field[x] = [];
                    for (var y = 0; y < 9; y++) {
                        field[x].push(null);
                    }
                }

                field = this.putUnitsInField(redUnits, field);
                field = this.putUnitsInField(blueUnits, field);

                return field;
            }
            
        });

        return Controller;
    
    });