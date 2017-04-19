'use strict';

app.controller('SiteListController', ['$scope', '$resource', '$location', 'Sites',
    function ($scope, $resource, $location, Sites) {
		$scope.main.title = 'Users';

		$scope.sites = Sites.getAllSites();
		$scope.sitesToShow = Array($scope.sites.length).fill(true);
}]);