'use strict';

var app = angular.module('FeedForwardAdmin', ['ngRoute', 'ngMaterial', 'ngResource', 'nvd3', 'firebase']);

app.config(['$routeProvider',
    function ($routeProvider) {
		$routeProvider.
		when('/login-register', {
			templateUrl: 'components/login-register/login-registerTemplate.html',
			controller: 'LoginRegisterController'
		}).
		when('/sites', {
			templateUrl: 'components/site-list/site-listTemplate.html',
			controller: 'SiteListController'
		}).
		when('/surveys', {
			templateUrl: 'components/survey-list/survey-listTemplate.html',
			controller: 'SurveyListController'
		}).
		when('/survey/new', {
			templateUrl: 'components/survey-new/survey-newTemplate.html',
			controller: 'SurveyNewController'
		}).
		when('/surveys/:surveyId', {
			templateUrl: 'components/survey-detail/survey-detailTemplate.html',
			controller: 'SurveyDetailController'
		}).
		otherwise({
			redirectTo: '/surveys'
		});
}]);