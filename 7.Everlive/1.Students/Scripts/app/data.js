/// <reference path="../lib/require.js" />
/// <reference path="../lib/everlive.all.min.js" />
/// <reference path="../lib/rsvp.min.js" />

define("data", ["everlive","class", "rsvp"], function (everlive, Class) {

    var access_token, principalId;

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

            this.posts = new PostsPersister(this.elContext);

            //this.tags = new TagsPersister(this.elContext);
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
                .register(user.username, user.password)
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

    var PostsPersister = Class.create({
        init: function (context) {
            this.context = context;
        },
        getAll: function () {
            return this.context.data("Posts").get();
        },
        create: function (post) {
            return this.context.data("Posts").create(post);
        }
    });

    //var TagsPersister = Class.create({
    //    init: function (context) {
    //        this.tags = context.data("Tags");
    //    },
    //    createMultiple: function (tags) {
    //        for (var i = 0; i < tags.length; i++) {
    //            this.createTag(tags[i]);
    //        }
    //    },
    //    createTag: function (tag) {
    //        var sameName = new Everlive.Query()
    //        sameName.where().eq("name", tag.name);


    //        this.tags.get(sameName).then(function (result) {
    //            alert(JSON.stringify(result));

    //            if (result.length == 0) {

    //            }
    //        })
    //    }

    //})

    return function (apiKey) {
        return new Data(apiKey);
    }

});