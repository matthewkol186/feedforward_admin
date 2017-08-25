'use strict';

app.controller('MainController', ['$scope', '$resource', '$rootScope', '$location', '$http', 'Surveys', 'Sites', 'Auth',
    function ($scope, $resource, $rootScope, $location, $http, Surveys, Sites, Auth) {
		$scope.main = {};
		$scope.main.loggedIn = false; // TESTING
		$scope.main.title = 'Users';
		$scope.main.checkedLogIn = false;
		var Logout = $resource('admin/logout');
		var AuthStatus = $resource('user/loggedin');
		var Activity = $resource('registerActivity');

		$rootScope.$on("$routeChangeStart", function (event, next, current) {
      Auth.$onAuthStateChanged(function(authData) {
        if (authData) {
          $scope.main.loggedIn = true;
        } else {
          $location.path('/login');
          $scope.main.loggedIn = false;
        }
      });
			// if (!$scope.main.checkedLogIn) {
      //   var authobj = Auth;
      //   console.log(authobj.$getAuth());
      //   if (Auth.$getAuth()) {
      //     $scope.main.loggedIn = true;
      //   } else {
      //     $location.path('/login');
      //     $scope.main.loggedIn = false;
      //   }
			// } else {
			// 	if (!$scope.main.loggedIn) {
			// 		// no logged user, redirect to /login-register unless already there
			// 		if (next.templateUrl !== "components/auth/authTemplate.html") {
      //       $scope.main.checkedLogIn = true;
			// 			$location.path("/login");
			// 		}
			// 	}
			// }
		});

		$rootScope.$on('$routeChangeSuccess', function (event, current, from) {
			if(!(current.$$route && current.$$route.originalPath) || current.$$route.originalPath.includes("nutrition")) {
				$scope.currentNavItem = "nutritionlist";
			} else if (current.$$route.originalPath.includes("feedback")){
				$scope.currentNavItem = "feedback";
			} else if (current.$$route.originalPath.includes("perminfo")){
				$scope.currentNavItem = "perminfo";
			} else if (current.$$route.originalPath.includes("questions")){
				$scope.currentNavItem = "questions";
			}
		});


		$scope.logout = function () {
      Auth.$signOut();
      $scope.main.loggedIn = false;
      $scope.main.checkedLogIn = true;
      $location.path("/login");
		};

}]);
