'use strict';

app.controller('FeedbackDetailController', ['$scope', '$resource', '$routeParams', '$location', 'Sites', 'Nutrition', 'Feedback', 'Questions',
    function ($scope, $resource, $routeParams, $location, Sites, Nutrition, Feedback, Questions, $firebaseObject) {
		$scope.main.title = 'FeedForward | Feedback Detail';

		$scope.siteSelected = false;

		$scope.sites = Sites.getAllSites();
		$scope.selectSite = function (site) {
			$scope.feedbackInfo = [];
			$scope.siteSelected = true;
			$scope.currentSite = site;
			$scope.currentComments = Feedback.getCommentsById(site.$id);
			$scope.siteFeedback = Feedback.getFeedbackById(site.feedbackObj);
			console.log(site.$id, "lol", $scope.siteFeedback);
			$scope.siteFeedback.$loaded(function (data) {
				console.log(data);
				for (var n in data.questions) {
					console.log(n, data.questions[n]);
					$scope.feedbackInfo.push(Questions.getQuestionById(data.questions[n].questionID));
				}
			});
		}
}]);