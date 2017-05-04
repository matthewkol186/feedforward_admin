'use strict';

app.controller('SurveyDetailController', ['$scope', '$resource', '$routeParams', '$location', 'Surveys', 'Sites',
    function ($scope, $resource, $routeParams, $location, Surveys, Sites) {
		$scope.main.title = 'FeedForward | Survey Detail';

		$scope.surveyId = $routeParams.surveyId;
			
		$scope.sites = Sites.getAllSites();
		$scope.survey = Surveys.getSurveyById($scope.surveyId);
		$scope.survey.$loaded().then(function(parentSurvey) {
			$scope.surveyInstances = Surveys.getSurveyInstances(parentSurvey.$id);
			$scope.surveyInstances.$loaded().then(function(surveyInstances){
				console.log(surveyInstances);
				$scope.instancesToShow = Array(surveyInstances.length).fill(true);
				//$scope.aggregateData = Surveys.getAggregateData($scope.surveyId, $scope.instancesToShow);
				let data = [];
				for (let questionIndex in parentSurvey.questions) {
					let questionData = [];
					for (let answerIndex in parentSurvey.questions[questionIndex].answerOptions) {
						let aggregateCount = 0;
						for (let index in parentSurvey.instances) {
							for(let instanceIndex in surveyInstances) {
								if ($scope.instancesToShow[instanceIndex] && parentSurvey.instances[index] === surveyInstances[instanceIndex].$id) { //choosing which sites to count or not to count
									aggregateCount += surveyInstances[instanceIndex].questions[questionIndex].answerOptions[answerIndex].count;
								}
							}
						}
						questionData.push({
							answer: parentSurvey.questions[questionIndex].answerOptions[answerIndex].display,
							count: aggregateCount,
						});
					}
					data.push(questionData);
				}
				$scope.aggregateData = data;
				
			});
		});
			
		$scope.assignSite = {};
		$scope.assignToNewSite = function() {
			console.log($scope.assignSite.new.$id, $routeParams.surveyId);
			Surveys.surveyNewSite($routeParams.surveyId, $scope.assignSite.new.$id);
			$scope.instancesToShow.push(true);
			$scope.assignSite = {};
		}
			
		$scope.updateData = function() {
			let data = [];
			for (let questionIndex in $scope.survey.questions) {
				let questionData = [];
				for (let answerIndex in $scope.survey.questions[questionIndex].answerOptions) {
					let aggregateCount = 0;
					for (let index in $scope.survey.instances) {
						if ($scope.instancesToShow[index]) { //choosing which sites to count or not to count
							aggregateCount += $scope.surveyInstances[index].questions[questionIndex].answerOptions[answerIndex].count;
						}
					}
					questionData.push({
						answer: $scope.survey.questions[questionIndex].answerOptions[answerIndex].display,
						count: aggregateCount,
					});
				}
				data.push(questionData);
			}
			$scope.aggregateData = data;
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
				},
				labelType: 'percent',
			}
		};
		
		var idToName = {};
		$scope.getNameOfSite = function(site_id) {
			if(!idToName[site_id])
			{
					idToName[site_id] = Sites.getNameOfSite(site_id);
			}
			return !idToName[site_id];
		}
}]);