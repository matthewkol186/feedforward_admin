'use strict';

app.controller('NutritionDetailController', ['$scope', '$resource', '$routeParams', '$location', 'Nutrition', 'Sites', 'Feedback', '$firebaseArray', '$firebaseStorage',
    function ($scope, $resource, $routeParams, $location, Nutrition, Sites, Feedback, $firebaseArray, $firebaseStorage) {
		$scope.main.title = 'FeedForward | Nutrition';

		var storageRef = firebase.storage().ref("images/decks"); // for uploading
		$scope.storage = $firebaseStorage(storageRef);

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
		
		// Upload the photo file selected by the user using a post request to the URL /photos/new
		$scope.uploadNutrition = function () {
			var uploadTask = $scope.storage.$put($scope.files[0].lfFile);
			uploadTask.$complete(function (snapshot) {
				Nutrition.addNutritionCard(nutritionID, {url: snapshot.downloadURL, text: $scope.newCardText});
				$scope.newCardText = "";
				$scope.api.removeAll();
			});

		};

}]);