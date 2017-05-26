'use strict';

var app = angular.module('FeedForwardAdmin', ['ngRoute', 'ngMaterial', 'ngResource', 'nvd3', 'firebase', 'lfNgMdFileInput', 'oitozero.ngSweetAlert']);

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
		when('/feedback', {
			templateUrl: 'components/feedback-detail/feedback-detailTemplate.html',
			controller: 'FeedbackDetailController'
		}).
		when('/surveys/:surveyId', {
			templateUrl: 'components/survey-detail/survey-detailTemplate.html',
			controller: 'SurveyDetailController'
		}).
		when('/nutrition', {
			templateUrl: 'components/nutrition-list/nutrition-listTemplate.html',
			controller: 'NutritionListController'
		}).
		when('/nutrition/:id', {
			templateUrl: 'components/nutrition-detail/nutrition-detailTemplate.html',
			controller: 'NutritionDetailController'
		}).
		otherwise({
			redirectTo: '/nutrition'
		});
}])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('amber')
    .accentPalette('orange')
		.warnPalette('teal');
});;