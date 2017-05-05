'use strict';

app.controller('SurveyNewController', ['$scope', '$location', '$resource', '$rootScope', 'Surveys',
  function ($scope, $location, $resource, $rootScope, Surveys) {
		$scope.survey = {};
		$scope.survey.questions = [{
			question: '',
			answerOptions: [{
				display: '',
				refcount: 0,
				client_ids: []
			}, ],
		}]; // start out with one empty question
		
		$scope.go = function(path) {
			$location.path(path);
		};

		$scope.submitSurvey = function () {
			$scope.survey.date = (new Date()).getTime();
			$scope.survey.sites = [];
			Surveys.addNewSurvey($scope.survey);
			$scope.go('/surveys');
		}
}]);