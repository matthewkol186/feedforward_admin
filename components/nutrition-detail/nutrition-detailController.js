'use strict';

app.controller('NutritionDetailController', ['$scope', '$resource', '$routeParams', '$location', 'Nutrition', 'Sites', 'Feedback', '$firebaseArray',
    function ($scope, $resource, $routeParams, $location, Nutrition, Sites, Feedback, $firebaseArray) {
		$scope.main.title = 'FeedForward | Nutrition';

		var nutritionID = $routeParams.id;
		$scope.nutrition = Nutrition.getNutritionById(nutritionID);
		$scope.images = Nutrition.getImagesById(nutritionID);
		$scope.sites = Sites.getAllSites();

		$scope.assignSite = {};
		$scope.assignToNewSite = function () {
			console.log($scope.assignSite.new.$id, nutritionID);
			Sites.sendDeckToSite(nutritionID, $scope.assignSite.new.$id);
			//$scope.instancesToShow.push(true);
			Feedback.addNewNutrition(nutritionID, $scope.assignSite.new.$id);
			$scope.assignSite = {};
		}

}]);