'use strict';

app.controller('SiteListController', ['$scope', '$resource', '$location', 'Sites', 'firebaseArray',
    function ($scope, $resource, $location, Sites, $firebaseArray) {
		$scope.main.title = 'Users';
		
		$scope.sites = Sites.getAllSites();
		$scope.sites.$loaded(function (sites) {
			$scope.sitesToShow = Array(sites.length).fill(true);
		});

}]);