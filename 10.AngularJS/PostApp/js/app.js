/// <reference path="lib/require.js" />
/// <reference path="lib/angular.js" />
(function () {
    angular.module('forum', []).
        config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when("/login", {
                    templateUrl: "partialHtml/loginRegisterForm.html",
                    controller: forum.controllers.loginRegisterController
                })
                .when("/posts/create", {
                    templateUrl: "partialHtml/newPostFormPartial.html",
                    controller: forum.controllers.newPostsController
                })
                .when('/posts', {
                    templateUrl: 'partialHtml/PostsPartial.html',
                    controller: forum.controllers.postsListController
                })
                .when('/about', {
                    templateUrl: 'partialHtml/aboutPartial.html',
                    controller: forum.controllers.postsListController
                })
                .otherwise({ redirectTo: '/login' });
        }]);
}());