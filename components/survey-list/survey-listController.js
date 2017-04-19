'use strict';

app.controller('SurveyListController', ['$scope', '$resource', '$location', 'Surveys', 'Sites',
    function ($scope, $resource, $location, Surveys, Sites) {
		$scope.main.title = 'Users';

		$scope.surveys = Surveys.getAllSurveys();
		$scope.surveyOptions = ['Delete', 'Copy'];

		$scope.sites = Sites.getAllSites();
		$scope.sitesToShow = Array($scope.sites.length).fill(true);
}]);