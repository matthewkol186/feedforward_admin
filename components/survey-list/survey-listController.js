'use strict';

app.controller('SurveyListController', ['$scope', '$resource', '$location', 'Surveys', 'Sites',
    function ($scope, $resource, $location, Surveys, Sites) {
		$scope.main.title = 'Users';

		$scope.surveys = Surveys.getAllSurveys();
		for (var surveyIndex in $scope.surveys) {
			if ($scope.surveys[surveyIndex].instances) {
				$scope.surveys[surveyIndex].siteList = Array.from(new Set($scope.surveys[surveyIndex].instances.map(function (instanceId) {
					return Sites.getNameOfSite(Surveys.getSurveyInstanceById(instanceId).siteId);
				})));
			}
		}
		$scope.surveyOptions = ['Delete', 'Copy'];

		$scope.sites = Sites.getAllSites();
		$scope.sitesToShow = Array($scope.sites.length).fill(true);

		$scope.matchesFilter = function (survey) {
			for (var siteIndex in $scope.sites) {
				if ($scope.sitesToShow[siteIndex]) {
					for (var surveyIndex in $scope.sites[siteIndex].surveys) {
						if (survey.instances.includes($scope.sites[siteIndex].surveys[surveyIndex])) {
							return true;
						}
					}
				}
			}
			return false;
		}

		$scope.go = function (id) {
			$location.path('/surveys/' + id);
		}
}]);