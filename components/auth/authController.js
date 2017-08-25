'use strict';

app.controller('AuthController', ['$scope', '$resource', '$routeParams', '$location', 'Auth',
    function ($scope, $resource, $routeParams, $location, Auth) {
		$scope.main.title = 'FeedForward | Login';

    $scope.signIn = function() {
      Auth.$signInWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser) {
        $scope.main.user = firebaseUser;
        $location.path("/nutrition");
      }).catch(function(error) {
        $scope.loginFailed = true;
      });
    };
}]);
