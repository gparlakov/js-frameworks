/// <reference path="lib/angular.js" />
angular.module('forum', []).
  config(['$routeProvider', function ($routeProvider) {
      $routeProvider
          .when('/home', { templateUrl: 'js/partial/allPostsPartial.html', controller: PostsController })
          .when('/posts/create', {templateUrl:'js/partial/leavePost.html', controller: LeavePostController})
          .otherwise({ redirectTo: '/home' });
  }]);