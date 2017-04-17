'use strict';

cs142App.controller('LoginRegisterController', ['$scope', '$resource', '$location', '$window',
  function ($scope, $resource, $location, $window) {
		
		var Auth = $resource('admin/login');
		var Register = $resource('user');
		var Activity = $resource('registerActivity');
		$scope.main.title = "Please Login";
		
		$scope.login = function() {
			Auth.save({"login_name": $scope.loginName, "password": $scope.password}, function(user){
				Activity.save({"action": "logged in"}, function(){});
				$scope.main.loggedIn = true;
				$scope.main.user = user;
				$location.path('/users/'+user._id);
			});
		};
		
		$scope.registerUser = function() {
			Register.save($scope.register, function (response){
				$scope.register = {};
				$scope.registerMessage = "Congratulations! You have been registered.";
				//$scope.showForm = false;
				$scope.registerForm.$setPristine();
				$scope.registerForm.$setUntouched();
			}, function (response){
				$scope.registerMessage = response.data;
				console.log(response);
			});
		};
}]);
