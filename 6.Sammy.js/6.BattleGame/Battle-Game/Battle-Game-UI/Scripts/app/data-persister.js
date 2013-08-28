/// <reference path="../lib/require.js" />
/// <reference path="../lib/http-requester.js" />
/// <reference path="../lib/sha1.js" />
/// <reference path="../lib/class.js" />

define(
    ["http-requester",
    "class"], 

    function (requester, Class) {
        var sessionKey = "";

        var saveUserCredentials = function(userResponse){
            localStorage.setItem("sessionKey", userResponse.sessionKey);
            localStorage.setItem("nickname", userResponse.nickname);
        }

        var Persister = Class.create({            
            init: function(baseUrl){
                this.baseUrl = baseUrl;

                this.users = new UserPersisiter(baseUrl);

                this.game = new GamePersister(baseUrl);

                this.loadCredentials();
            },
            isUserLogged: function () {
                var isLoggedIn = false;

                if (localStorage.getItem("sessionKey")) {
                    isLoggedIn = true;
                }

                return isLoggedIn;
            },
            loadCredentials: function () {
                if (this.isUserLogged()) {
                    sessionKey = localStorage.getItem("sessionKey");
                    //this.users.sessionKey = localStorage.getItem("sessionKey");
                }
            }
        });

        var UserPersisiter = Class.create({
            init: function (baseUrl) {
                this.serviceUrl = baseUrl + "user/";
            },
            login: function (user) {
                var self = this;

                return requester.postJSON(this.serviceUrl + "login", user)
                    .then(function (response) {
                        sessionKey = response.sessionKey;
                        saveUserCredentials(response);
                    });                
            },
            register: function (user) {
                var self = this;

                return requester.postJSON(this.serviceUrl + "register", user)
                    .then(function (response) {
                        sessionKey = response.sessionKey;
                        //self.sessionKey = response.sessionKey;
                        saveUserCredentials(response);
                    });
            },
            logout: function () {
                var self = this;
                return requester.putJSON(this.serviceUrl + "logout/" + sessionKey)
                        .then(function (response) {
                            self.clearUserData();
                        });
            },
            clearUserData: function () {
                localStorage.removeItem("sessionKey");
                localStorage.removeItem("nickname");
            }
        });

        var GamePersister = Class.create({
            servceUrl: "",
            init: function (baseUrl) {
                this.servceUrl = baseUrl + "/game/";
            },
            getAll: function () {
                return requester.getJSON(this.servceUrl + "open/" + sessionKey);
            },
            getMy: function () {
                return requester.getJSON(this.servceUrl + "my-active/" + sessionKey);
            },
            create: function (newGame) { 
                return requester.postJSON(this.servceUrl + "create/" + sessionKey, newGame);
            },
            join: function (gameToJoin) {
                return requester.postJSON(this.servceUrl + "join/" + sessionKey, gameToJoin);
            },
            start: function (gameIdToStart) {
                return requester.putJSON(this.servceUrl + gameIdToStart + "/start/" + sessionKey);
            },
            goToGame: function (gameId) {
                return requester.getJSON(this.servceUrl + gameId + "/field/" + sessionKey);
            }
        });
        
        return {
            getPersister: function (baseUrl) {
                return new Persister(baseUrl);
            }
        };
    });