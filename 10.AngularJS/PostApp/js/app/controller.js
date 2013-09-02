/// <reference path="../lib/require.js" />
/// <reference path="data.js" />
/// <reference path="../lib/angular.js" />
var forum = window.forum || {};

forum.controllers = (function () {    
    var data = forum.data().getData("oJBOmifHcu3At1cv");   

    var postsListController = function PostsController($scope) {    
        data.posts.getAll()
            .then(function (response) {
                posts = response.result;
                for (var i = 0; i < posts.length; i++) {
                    $scope.posts.push(posts[i]);
                    $scope.$digest();
                }
            }, function (err) {
                debugger;
            })

        $scope.posts = [];
    }

    var newPostsController = function ($scope) {
        var newPost = {
            Title: "",
            Author: "",
            Content: "",
            Tags: ""
        };

        $scope.newPost = newPost;
        $scope.message = "";
        $scope.addNewPost = function () {
            data.posts.create($scope.newPost)
             .then(function (result) {
                 debugger;

                 $scope.newPost = {
                     Title: "",
                     Author: "",
                     Content: "",
                     Tags: ""
                 }

                 $scope.message = "Created!";
                 setTimeout(function () {
                     $scope.message = "";
                     $scope.$digest();
                 }, 2500);

                 $scope.$digest();
             }, function (err) {
                 debugger;
             });
        };
    }

    var loginRegisterController = function ($scope) {
        var hidden = $(".login");
        if (!data.isUserLogged()) {
            hidden.hide();
            var message = $("<h2>Login to POST</span>");
            $("#navigation").append(message)

            setTimeout(function () {
                message.slideToggle();
            }, 5000);
        }

        var s = $scope;

        s.username = "";
        s.displayName = "";
        s.password = "";

        s.register = function () {
            var user = {
                username: s.username,
                password : s.password,
                displayName: s.displayName
            }

            data.users.regiter(user)
                .then(function (response) {
                    hidden.show();
                    open("#/posts", "_self");

                }, function (err) {
                    alert(err.message);
                })            
        };    

        s.login = function () {
            var user = {
                username: s.username,
                password: s.password,
            }

            data.users.login(user)
                .then(function (response) {
                    hidden.show();
                    open("#/posts", "_self");
                }, function (err) {
                    alert(err.message);
                }) 
        };

        s.loginClass = "";
        s.registerClass = "hidden";

        s.toggleActive = function () {
            var login = s.loginClass;
            var register = s.registerClass;

            s.loginClass = register;
            s.registerClass = login;
        }

        s.logout = function () {
            data.users.logout();
            hidden.hide();
        }
    }

    return {
        postsListController: postsListController,
        loginRegisterController: loginRegisterController,
        newPostsController: newPostsController
    }
}());
