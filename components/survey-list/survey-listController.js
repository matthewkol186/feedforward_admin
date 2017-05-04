'use strict';

app.controller('SurveyListController', ['$scope', '$resource', '$location', 'Surveys', 'Sites', '$firebaseArray',
    function ($scope, $resource, $location, Surveys, Sites, $firebaseArray) {
		$scope.main.title = 'FeedForward | All Surveys';

		$scope.matchesFilter = function (survey) { // becomes sensical later
			return true;
		}
		$scope.surveys = Surveys.getAllSurveys();
		$scope.surveys.$loaded().then(function(surveys){
			console.log(surveys);
			$scope.sites = Sites.getAllSites();
			$scope.sites.$loaded(function(sites){
				$scope.sitesToShow = Array(sites.length).fill(true);
				$scope.matchesFilter = function (survey) {
					if(!survey || !$scope.sites || !survey.sites) return true;
					let sitesArray = Object.values(survey.sites);
					for(var siteIndex = 0; siteIndex < sitesArray.length; siteIndex++) {
						let siteId = sitesArray[siteIndex];
						for(var i = 0; i < $scope.sites.length; i++) {
							console.log('site id: ', $scope.sites[i].$id);
							if($scope.sites[i].$id === siteId && $scope.sitesToShow[i]){
								return true;
							} 
						}
					};
					return false;
				}
			});
		});
		
		$scope.surveyOptions = ['Delete', 'Copy'];
		
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