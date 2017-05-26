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
			SweetAlert.swal("Successfully changed!", deck.name + " is now active.", "success");
			Nutrition.setActiveNutrition(deck.$id, deck.name);
		};

		$scope.removeActive = function () {
			SweetAlert.swal({
					title: "Are you sure?",
					text: "Confirm deactivation of " + $scope.activeNutrition.name,
					type: "info",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, deactivate it!",
					closeOnConfirm: false
				},
				function () {
					Nutrition.removeActiveNutrition();
					SweetAlert.swal("Successfully deactivated!", "", "success");
				});
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