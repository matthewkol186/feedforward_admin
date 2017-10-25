'use strict';

app.controller('FeedbackDetailController', ['$scope', '$resource', '$routeParams', '$location', 'Sites', 'Nutrition', 'Feedback', 'Questions',
    function ($scope, $resource, $routeParams, $location, Sites, Nutrition, Feedback, Questions, $firebaseObject) {
		$scope.main.title = 'FeedForward | Feedback Detail';

		$scope.siteSelected = false;

		$scope.sites = Sites.getAllSites();
    $scope.nutritions = Nutrition.getAllNutritions();

    $scope.assignDeck = {};
		$scope.assignNewDeck = function () {
      if($scope.currentSite && $scope.assignDeck) {
  			Nutrition.addNutritionSite($scope.assignDeck.new.$id, $scope.currentSite.$id);
        $scope.deployedDecks.push({name: $scope.assignDeck.new.name})
  			$scope.assignDeck = {};
      }
		}

		$scope.selectSite = function (site) {
			$scope.feedbackInfo = [];
			$scope.siteSelected = true;
			$scope.currentSite = site;
      $scope.deployedDecks = []
      $scope.sites.$loaded().then(function(data){
        for(var key in site.currNutrition) {
          $scope.deployedDecks.push(Nutrition.getNutritionById(site.currNutrition[key].id));
        }
      });

			$scope.currentComments = Feedback.getCommentsById(site.$id);
			$scope.siteFeedback = Feedback.getFeedbackById(site.feedbackObj);
			$scope.siteFeedback.$loaded(function (data) {
				for (var n in data.questions) {
					$scope.feedbackInfo.push(Questions.getQuestionById(data.questions[n].questionID));
				}
			});
		}
}]);
