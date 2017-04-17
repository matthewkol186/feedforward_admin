'use strict';

app.controller('UserDetailController', ['$scope', '$routeParams', '$resource', '$location', 
  function ($scope, $routeParams, $resource, $location) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;
	  
		var User = $resource('user/'+userId);
		var MostRecentPhoto = $resource('mostRecentPhoto/'+userId);
		var MostCommentsPhoto = $resource('photoMostComments/'+userId);
		$scope.user = User.get(function(success){
			$scope.main.title = $scope.user.first_name + " " + $scope.user.last_name;
		});
		
		$scope.mostRecentPhoto = MostRecentPhoto.get(function(success) {
			console.log(success);
		});
		
		$scope.mostCommentsPhoto = MostCommentsPhoto.get(function(success) {
			console.log(success);
		});
		
		$scope.go = function(path) {
			$location.path(path);
		};
}]);
