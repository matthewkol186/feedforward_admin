'use strict';

app.controller('NutritionListController', ['$scope', '$resource', '$location', 'Nutrition', '$firebaseArray', '$firebaseStorage', 'SweetAlert',
    function ($scope, $resource, $location, Nutrition, $firebaseArray, $firebaseStorage, SweetAlert) {
		$scope.main.title = 'FeedForward | Nutrition';

		$scope.nutritions = Nutrition.getAllNutritions();
		$scope.activeNutrition = Nutrition.getActiveNutrition();
		var storageRef = firebase.storage().ref("images/decks"); // for uploading
		$scope.storage = $firebaseStorage(storageRef);

		$scope.go = function (path) {
			$location.path(path);
		};

		$scope.removeDeck = function (id) {
			Nutrition.removeNutrition(id);
		};

		$scope.setActive = function (deck) {
			SweetAlert.swal("Successfully changed!", deck.name+" is now active.", "success");
			Nutrition.setActiveNutrition(deck.$id, deck.name);
		};

		$scope.uploadNutrition = function () {
			var uploadTask = $scope.storage.$put($scope.files[0].lfFile);
			uploadTask.$complete(function (snapshot) {
				Nutrition.addNutrition({
					url: snapshot.downloadURL,
					name: $scope.newCardName,
					images: {}
				});
				$scope.newCardName = "";
				$scope.api.removeAll();
			});

		};
}]);