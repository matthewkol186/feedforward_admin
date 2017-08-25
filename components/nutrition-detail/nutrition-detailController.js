'use strict';

app.controller('NutritionDetailController', ['$scope', '$resource', '$routeParams', '$location', 'Nutrition', 'Sites', 'Feedback', '$firebaseArray', '$firebaseStorage',
    function ($scope, $resource, $routeParams, $location, Nutrition, Sites, Feedback, $firebaseArray, $firebaseStorage) {
		$scope.main.title = 'FeedForward | Nutrition';

		var storageRef = firebase.storage().ref("images/decks"); // for uploading
		$scope.storage = $firebaseStorage(storageRef);

		var nutritionID = $routeParams.id;
		$scope.nutrition = Nutrition.getNutritionById(nutritionID);
		$scope.nutritionSites = [];
    Nutrition.getNutritionSites(nutritionID, function(snap) {
      var tempSites = [];
      snap.forEach(function(item) {
          var site = item.val();
          site.$id = item.key;
          tempSites.push(site);
      });
      $scope.nutritionSites = tempSites;
    });

    Nutrition.detectActiveNutrition(nutritionID, function(bool){
      $scope.isActiveNutrition = bool;
      console.log($scope.isActiveNutrition);
    }); // sets isActiveNutrition

		$scope.images = Nutrition.getImagesById(nutritionID);
		$scope.sites = Sites.getAllSites();

		$scope.assignSite = {};
		$scope.assignToNewSite = function () {
			Nutrition.addNutritionSite(nutritionID, $scope.assignSite.new.$id);
			$scope.assignSite = {};
		}

		$scope.removeActive = function (site) {
      console.log(site);
			Nutrition.removeNutritionSite(nutritionID, site.siteID, site.nutritionSiteID, site.$id);
		}

    var randomString = function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

		// Upload the photo file selected by the user using a post request to the URL /photos/new
		$scope.uploadNutrition = function () {
      var storageRef = firebase.storage().ref("images/"+randomString(20)); // for uploading
			var uploadTask = ($firebaseStorage(storageRef)).$put($scope.files[0].lfFile);
			uploadTask.$complete(function (snapshot) {
				Nutrition.addNutritionCard(nutritionID, {
					url: snapshot.downloadURL,
					text: $scope.newCardText
				});
				$scope.newCardText = "";
				$scope.api.removeAll();
			});

		};

}]);
