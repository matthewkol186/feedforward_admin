'use strict';

cs142App.controller('CommentsListController', ['$scope', '$routeParams', '$resource', '$location',
  function ($scope, $routeParams, $resource, $location) {
		/*
		 * Since the route is specified as '/photos/:userId' in $routeProvider config the
		 * $routeParams  should have the userId property set with the path from the URL.
		 */
		var userId = $routeParams.userId;

		var User = $resource('user/' + userId);
		var Comments = $resource('commentsBy/' + userId);
		$scope.user = User.get(function (success) {
			$scope.main.title = "Comments of " + success.first_name + " " + success.last_name;
		});

		$scope.photoComments = Comments.query(function () {
			$scope.main.advanced = true;
		});
		
		$scope.go = function(path) {
			$location.path(path);
		};
  }]);