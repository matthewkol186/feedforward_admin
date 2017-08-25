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
			$scope.siteFeedback.$loaded(function (data) {
				for (var n in data.questions) {
					$scope.feedbackInfo.push(Questions.getQuestionById(data.questions[n].questionID));
				}
			});
		}
}]);
