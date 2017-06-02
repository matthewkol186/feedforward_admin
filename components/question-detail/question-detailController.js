'use strict';

app.controller('QuestionDetailController', ['$scope', '$resource', '$routeParams', '$location', 'Questions', 'Sites', 'Feedback', '$firebaseArray', '$firebaseStorage',
    function ($scope, $resource, $routeParams, $location, Questions, Sites, Feedback, $firebaseArray, $firebaseStorage) {
		$scope.main.title = 'FeedForward | Questions';
			
		var questionID = $routeParams.id;
		$scope.question = Questions.getQuestionById(questionID);
		$scope.questionSites = Questions.getQuestionSites(questionID);
		$scope.sites = Sites.getAllSites();
		$scope.assignSite = {};
		$scope.assignToNewSite = function () {
			console.log($scope.assignSite.new.$id, questionID);
			Questions.addQuestionSite(questionID, $scope.assignSite.new.$id);
			$scope.questionSites = Questions.getQuestionSites(questionID);
			$scope.assignSite = {};
		}

		$scope.removeActive = function (site) {
			Questions.removeQuestionSite(questionID, site.siteID, site.targetSiteID, site.$id);
		}
}]);