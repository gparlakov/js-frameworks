/// <reference path="../lib/everlive.all.min.js" />
var bank = bank || {};

bank.dataPersister = (function () {
    var principalId;
    var accessToken;
    var saveUserData = function(response){
        localStorage.setItem("principal_id", response.result.principal_id);
        principalId = response.result.principal_id;

        localStorage.setItem("access_token", response.result.access_token);
        accessToken = response.result.access_token;
    }

    var clearUserData = function () {
        localStorage.removeItem("principal_id");
        principalId = "";

        localStorage.removeItem("access_token");
        accessToken = "";
    }

    var isUserLogged = function () {
        if (localStorage.getItem("principal_id")) {
            return true;
        }

        return false;
    }
        
    var Data = Class.create({
        init: function (apiKey) {
            this.apiKey = apiKey;

            this.elContext = new Everlive({
                apiKey: apiKey
            });

            if (isUserLogged()) {
                this.elContext.setup.token = localStorage.getItem("access_token");
                this.elContext.setup.tokenType = "bearer";


            }
            
            this.users = new UsersPersister(this.elContext);

            this.accounts = new AccountsPersister(this.elContext);
        },
        isUserLogged: function () {
            return isUserLogged();
        }
    });

    var UsersPersister = Class.create({
        context: "",
        init: function (context) {
            this.context = context;
        },
        login: function (user) {
            return this.context.Users
                .login(user.username, user.password)
                .then(function (response) {
                    saveUserData(response)
                });
        },
        register: function (user) {
            return this.context.Users
                .register(user.username, user.password, user.diplayName)
                .then(function (response) {
                    saveUserData(response)
                });
        },
        logout: function () {
            var self = this;
            return new RSVP.Promise(function (resolve, reject) {
                self.context.Users.logout(function (response) {
                    clearUserData();
                    resolve(response);
                }, function (err) {
                    reject(err);
                });
            });
        },
        getUser: function (userId) {
            //return this.context.Users
        },
        getCurrentUser: function () {
            return this.context.Users.currentUser()
        }
    });

    var AccountsPersister = Class.create({
        init: function (context) {
            this.accounts = context.data("Account");
        },
        getAll: function () {
            return this.accounts.get();
        },
        create: function (account) {
            account.AccountOwner = principalId;
            return this.accounts.create(account);
        },
        getTags: function () {
            var self = this;

            return new RSVP.Promise(function (resolve, reject) {
                self.posts.get().then(function (response) {
                    var tagsHash = {};

                    var posts = response.result;

                    for (var i = 0; i < posts.length; i++) {
                        var tags = posts[i].Tags;

                        for (var j = 0; j < tags.length; j++) {
                            var tag = tags[j];
                            if (!tagsHash[tag]) {
                                tagsHash[tag] = 1;
                            }
                            else {
                                tagsHash[tag]++;
                            }
                        }
                    }

                    resolve(tagsHash);
                }, function (err) {
                    reject(err);
                })
            });
        }
    });

    return {
        get: function (apiKey) {
            return new Data(apiKey);
        }
    }
}());