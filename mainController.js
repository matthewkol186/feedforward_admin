'use strict';

app.controller('MainController', ['$scope', '$resource', '$rootScope', '$location', '$http', 'Surveys', 'Sites',
    function ($scope, $resource, $rootScope, $location, $http, Surveys, Sites) {
		$scope.main = {};
		$scope.main.loggedIn = true; // TESTING
		$scope.main.title = 'Users';
		$scope.main.checkedLogIn = false;
		var TestInfo = $resource('test/info');
		var Logout = $resource('admin/logout');
		var AuthStatus = $resource('user/loggedin');
		var Activity = $resource('registerActivity');

		$scope.version = TestInfo.get();
		$rootScope.$on("$routeChangeStart", function (event, next, current) {
			if (!$scope.main.checkedLogIn) {
				AuthStatus.get(function (success) {
					$scope.main.checkedLogIn = true;
					if (success.notLoggedIn) {
						// no logged user, redirect to /login-register unless already there
						if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
							$location.path("/login-register");
						}
					} else {
						$scope.main.user = success;
						$scope.main.loggedIn = true;
					}
				});
			} else {
				if (!$scope.main.loggedIn) {
					// no logged user, redirect to /login-register unless already there
					if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
						$location.path("/login-register");
					}
				}
			}
		});

		$scope.logout = function () {
			Activity.save({
				"action": "logged out"
			}, function () {
				$rootScope.$broadcast("NewActivity");
			});
			Logout.save({}, function (success) {
				$scope.main.loggedIn = false;
				$scope.main.user = {};
				$location.path('/login-register');
			});
		};

}]);