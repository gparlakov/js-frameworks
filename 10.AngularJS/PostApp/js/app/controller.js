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
                }
            }, function (err) {

            })

        $scope.posts = [];

        //$scope.start = function () {
        //    $scope.tests[0] = "start";
        //}
    }

    var loginRegisterController = function ($scope) {
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
                    open("#/posts", "_self");

                }, function (err) {
                    alert(err.message);
                }) 
        };        
    }

    return {
        postsListController: postsListController,
        loginRegisterController: loginRegisterController
    }
}());
