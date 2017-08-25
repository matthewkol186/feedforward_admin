'use strict';

app.controller('PermanentInfoController', ['$scope', '$resource', '$location', 'PermanentInfo', '$firebaseObject', '$firebaseArray', '$firebaseStorage', 'SweetAlert',
    function ($scope, $resource, $location, PermanentInfo, $firebaseObject, $firebaseArray, $firebaseStorage, SweetAlert) {
		$scope.main.title = 'FeedForward | PermanentInfo';

		$scope.permanentInfo = PermanentInfo.getAllPermInfo();

		$scope.addNewPermInfo = function () {
			if ($scope.newTitle) {
				PermanentInfo.addNewPermInfo($scope.newTitle);
				$scope.newTitle = "";
			}
		};

		$scope.removeInfo = function (info) {
			$scope.permanentInfo.$remove(info);
		};

		$scope.go = function (path) {
			$location.path(path);
		};

}]);