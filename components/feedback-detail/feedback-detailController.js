'use strict';

app.controller('FeedbackDetailController', ['$scope', '$resource', '$routeParams', '$location', 'Sites', 'Nutrition', 'Feedback',
    function ($scope, $resource, $routeParams, $location, Sites, Nutrition, Feedback, $firebaseObject) {
		$scope.main.title = 'FeedForward | Feedback Detail';
			
		$scope.siteSelected = false;
			
		$scope.sites = Sites.getAllSites();	
		$scope.selectSite = function(site) {
			$scope.nutritionInfo = [];
			$scope.siteSelected = true;
			$scope.currentSite = site;
			$scope.siteFeedback = Feedback.getFeedbackById(site.feedbackObj);
			$scope.siteFeedback.$loaded(function(data) {
				console.log(data);
				for(var n in data.nutrition) {
					console.log(n, data.nutrition[n]);
					$scope.nutritionInfo.push(Nutrition.getNutritionById(data.nutrition[n].infoID));
				}
			});
		}
}]);