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
			function guid() { // random for now
				function s4() {
					return Math.floor((1 + Math.random()) * 0x10000)
						.toString(16)
						.substring(1);
				}
				return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
					s4() + '-' + s4() + s4() + s4();
			}

			var id = guid();
			$scope.survey.id = id;
			$scope.survey.date = (new Date()).getTime();
			Surveys.addNewSurvey(id, $scope.survey);
			$scope.go('/surveys');
		}
}]);