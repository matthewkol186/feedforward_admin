'use strict';

app.controller('SurveyDetailController', ['$scope', '$resource', '$routeParams', '$location', 'Surveys', 'Sites',
    function ($scope, $resource, $routeParams, $location, Surveys, Sites) {
		$scope.main.title = 'Users';

		$scope.surveyId = $routeParams.surveyId;

		$scope.survey = Surveys.getSurveyById($scope.surveyId);
		$scope.surveyInstances = Surveys.getSurveyInstances($scope.surveyId);
		$scope.instancesToShow = Array($scope.surveyInstances.length).fill(true);

		$scope.aggregateData = Surveys.getAggregateData($scope.surveyId, $scope.instancesToShow);
		$scope.updateData = function() {
			$scope.aggregateData = Surveys.getAggregateData($scope.surveyId, $scope.instancesToShow);
		}

		$scope.options = {
			chart: {
				type: 'pieChart',
				height: 300,
				x: function (d) {
					return d.answer;
				},
				y: function (d) {
					return d.count;
				},
				showLabels: true,
				duration: 500,
				labelThreshold: 0.01,
				labelSunbeamLayout: true,
				legend: {
					margin: {
						top: 5,
						right: 35,
						bottom: 5,
						left: 0
					}
				}
			}
		};

		$scope.getNameOfSite = function(site_id) {
			return Sites.getNameOfSite(site_id);
		}
}]);