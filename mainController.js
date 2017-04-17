'use strict';

var app = angular.module('FeedForwardAdmin', ['ngRoute', 'ngMaterial', 'ngResource']);

app.config(['$routeProvider',
    function ($routeProvider) {
    $routeProvider.
    when('/login-register', {
      templateUrl: 'components/login-register/login-registerTemplate.html',
      controller: 'LoginRegisterController'
    }).
		when('/users', {
      templateUrl: 'components/user-list/user-listTemplate.html',
      controller: 'UserListController'
    }).
    when('/users/:userId', {
      templateUrl: 'components/user-detail/user-detailTemplate.html',
      controller: 'UserDetailController'
    }).
    when('/photos/:userId', {
      templateUrl: 'components/user-photos/user-photosTemplate.html',
      controller: 'UserPhotosController'
    }).
    when('/photos/:userId/:photoIndex', {
      templateUrl: 'components/user-photos/user-photosTemplate.html',
      controller: 'UserPhotosController'
    }).
    when('/comments/:userId/', {
      templateUrl: 'components/comments-list/comments-listTemplate.html',
      controller: 'CommentsListController'
    }).
		when('/favorites/', {
      templateUrl: 'components/favorite-photos/favorite-photosTemplate.html',
      controller: 'FavoritePhotosController'
    }).
    otherwise({
      redirectTo: '/users'
    });
    }]);

app.controller('MainController', ['$scope', '$resource', '$rootScope', '$location', '$http', 
    function ($scope, $resource, $rootScope, $location, $http) {
    $scope.main = {};
		$scope.main.loggedIn = false; // stay logged in on refresh!
    $scope.main.title = 'Users';
		$scope.main.checkedLogIn = false;
		var TestInfo = $resource('test/info');
		var Logout = $resource('admin/logout');
		var AuthStatus = $resource('user/loggedin');
		var Activity = $resource('registerActivity');
		$scope.version = TestInfo.get();
		$rootScope.$on( "$routeChangeStart", function(event, next, current) {
			if(!$scope.main.checkedLogIn) {
			  AuthStatus.get(function(success){
					$scope.main.checkedLogIn = true;
					if (success.notLoggedIn) {
						 // no logged user, redirect to /login-register unless already there
						if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
								$location.path("/login-register");
						}
					} else {
						$scope.main.user = success;
						$scope.main.loggedIn = true;
					}
				});
			} else 
				{
					if (!$scope.main.loggedIn) {
						 // no logged user, redirect to /login-register unless already there
						if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
								$location.path("/login-register");
						}
					}
				}
		 });
			
		$scope.logout = function () {
			Activity.save({"action": "logged out"}, function(){
				$rootScope.$broadcast("NewActivity");
			});
			Logout.save({}, function(success){
				$scope.main.loggedIn = false;
				$scope.main.user = {};
				$location.path('/login-register');
			});
		};
		
		var selectedPhotoFile;   // Holds the last file selected by the user

		// Called on file selection - we simply save a reference to the file in selectedPhotoFile
		$scope.inputFileNameChanged = function (element) {
				selectedPhotoFile = element.files[0];
		};

		// Has the user selected a file?
		$scope.inputFileNameSelected = function () {
				return !!selectedPhotoFile;
		};

		// Upload the photo file selected by the user using a post request to the URL /photos/new
		$scope.uploadPhoto = function () {
				if (!$scope.inputFileNameSelected()) {
						console.error("uploadPhoto called will no selected file");
						return;
				}
				console.log('fileSubmitted', selectedPhotoFile);

				// Create a DOM form and add the file to it under the name uploadedphoto
				var domForm = new FormData();
				domForm.append('uploadedphoto', selectedPhotoFile);
				
				Activity.save({"action": "uploaded photo"}, function(){
					$rootScope.$broadcast("NewActivity");
				});
				// Using $http to POST the form
				$http.post('/photos/new', domForm, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined}
				}).success(function(newPhoto){
						$rootScope.$broadcast('PhotoAdded');
				}).error(function(err){
						// Couldn't upload the photo. XXX  - Do whatever you want on failure.
						console.error('ERROR uploading photo', err);
				});

		};
}]);