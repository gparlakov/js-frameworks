/// <reference path="lib/require.js" />
/// <reference path="lib/angular.js" />
(function () {
    angular.module('forum', []).
        config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when("/home", {
                    templateUrl: "partialHtml/loginRegisterForm.html",
                    controller: forum.controllers.loginRegisterController
                })
                .when('/posts', {
                    templateUrl: 'partialHtml/PostsPartial.html',
                    controller: forum.controllers.postsListController
                })
                .otherwise({ redirectTo: '/home' });
        }]);
}());