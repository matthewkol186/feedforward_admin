'use strict';

app.controller('SurveyListController', ['$scope', '$resource', '$location', 'Surveys', 'Sites', '$firebaseArray',
    function ($scope, $resource, $location, Surveys, Sites, $firebaseArray) {
		$scope.main.title = 'Users';

		$scope.surveys = Surveys.getAllSurveys();
		
		$scope.surveyOptions = ['Delete', 'Copy'];

		$scope.sites = Sites.getAllSites();
		$scope.sites.$loaded(function(sites){
			$scope.sitesToShow = Array(sites.length).fill(true);
		});

		$scope.matchesFilter = function (survey) {
			if(!survey || !$scope.sites || !survey.sites) return true;
			for(var siteIndex = 0; siteIndex < survey.sites.length; siteIndex++) {
				let siteId = survey.sites[siteIndex];
				for(var i = 0; i < $scope.sites.length; i++) {
					if($scope.sites[i].$id === siteId && $scope.sitesToShow[i]){
						return true;
					} 
				}
			};
			return false;
		}
		
		$scope.siteIdToName = {};
		
		$scope.announceClick = function(index, surveyId) {
			if(index === 0) {
				Surveys.deleteSurvey(surveyId);
			} else {
				Surveys.copySurvey(surveyId)
			}
		}

		$scope.go = function (id) {
			$location.path('/surveys/' + id);
		}
}]);