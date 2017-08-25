'use strict';

app.controller('NutritionListController', ['$scope', '$resource', '$location', 'Nutrition', '$firebaseObject', '$firebaseArray', '$firebaseStorage', 'SweetAlert',
    function ($scope, $resource, $location, Nutrition, $firebaseObject, $firebaseArray, $firebaseStorage, SweetAlert) {
		$scope.main.title = 'FeedForward | Nutrition';

		$scope.nutritions = Nutrition.getAllNutritions();
		$scope.activeNutrition = Nutrition.getActiveNutrition();

		$scope.go = function (path) {
			$location.path(path);
		};

		$scope.removeDeck = function (nutrition) {
			if(nutrition.active) {
				Nutrition.removeActiveNutrition(nutrition.$id, nutrition.id);
			}
			Nutrition.removeNutrition(nutrition.$id);
		};

		$scope.setActive = function (deck) {
			SweetAlert.swal("Successfully changed!", deck.name + " is now active.", "success");
			Nutrition.addActiveNutrition(deck);
		};

		$scope.removeActive = function (deck) {
			Nutrition.removeActiveNutrition(deck.$id, deck.id);
			$scope.activeNutrition = Nutrition.getActiveNutrition();
		}

    var randomString = function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

		$scope.uploadNutrition = function () {
      var storageRef = firebase.storage().ref(randomString(20)); // for uploading
			var uploadTask = ($firebaseStorage(storageRef)).$put($scope.files[0].lfFile);
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
