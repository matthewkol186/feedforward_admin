'use strict';

app.controller('UserListController', ['$scope', '$resource', '$location',
    function ($scope, $resource, $location) {
		$scope.main.title = 'Users';

		var User = $resource('user/list');
		$scope.userList = User.query();
		console.log($scope.userList);
		$scope.go = function(path) {
			$location.path(path);
		};
			
		$scope.$on('NewActivity', function(){
			$scope.userList = User.query();
		});
																					 
		$scope.getMostRecentPhoto = function(id) {
			var MostRecentPhoto = $resource('mostRecentPhoto/'+id);
			var mostRecentPhoto = MostRecentPhoto.get(function(success) {
				return 'images/'+success.file_name;
			});
		};
}]);