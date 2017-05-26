'use strict';

app.controller('NutritionListController', ['$scope', '$resource', '$location', 'Nutrition', '$firebaseArray',
    function ($scope, $resource, $location, Nutrition, $firebaseArray) {
		$scope.main.title = 'FeedForward | Nutrition';

		$scope.nutritions = Nutrition.getAllNutritions();

		$scope.go = function (path) {
			$location.path(path);
		};
}]);