'use strict';

app.controller('PermanentInfoDetailController', ['$scope', '$resource', '$location', '$routeParams', 'PermanentInfo', '$firebaseObject', '$firebaseArray', '$firebaseStorage', 'SweetAlert',
    function ($scope, $resource, $location, $routeParams, PermanentInfo, $firebaseObject, $firebaseArray, $firebaseStorage, SweetAlert) {
		$scope.main.title = 'FeedForward | PermanentInfo';

		$scope.infoItem = PermanentInfo.getPermInfoByID($routeParams.id);
		$scope.sections = PermanentInfo.getPermInfoSectionsByID($routeParams.id);

		$scope.saveChanges = function (index) {
			SweetAlert.swal("Successfully saved!", "", "success");
			$scope.sections.$save(index);
		}

		$scope.removeSection = function (sectionID) {
			SweetAlert.swal({
					title: "Are you sure?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, delete it!",
					closeOnConfirm: false
				},
				function () {
					console.log(sectionID);
					console.log($scope.infoItem);
					PermanentInfo.removeSectionByID($routeParams.id, sectionID);
					SweetAlert.swal("Done!");
				});
		}

		$scope.addSection = function () {
			if ($scope.newTitle) {
				PermanentInfo.addNewPermInfoSection($routeParams.id, $scope.newTitle);
				$scope.newTitle = "";
			}
		};
}]);