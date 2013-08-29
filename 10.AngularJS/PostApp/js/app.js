/// <reference path="lib/angular.js" />
angular.module('forum', []).
  config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/home', { templateUrl: 'js/partial/allPostsPartial.html', controller: PostsController }).
          otherwise({ redirectTo: '/home' });
  }]);