'use strict';

cs142App.controller('FavoritePhotosController', ['$scope', '$routeParams', '$resource', '$location', '$mdDialog',
  function ($scope, $routeParams, $resource, $location, $mdDialog) {
		/*
		 * Since the route is specified as '/photos/:userId' in $routeProvider config the
		 * $routeParams  should have the userId property set with the path from the URL.
		 */
		var userId = $routeParams.userId;

		var User = $resource('user/loggedIn');
		var Favorites = $resource('favoritedBy');
		var Unfavorite = $resource('unfavoritedBy');
		$scope.user = User.get(function (success) {
			$scope.main.title = "Favorites of " + success.first_name;
		});

		$scope.favorites = Favorites.query(function () {});

		$scope.unfavorite = function (photo) {
			Unfavorite.save({
				"photo_id": photo._id
			}, function (newFavList) {
				$scope.favorites = Favorites.query(function () {});
			});
		};

		$scope.showAdvanced = function (ev, photo) {
			$mdDialog.show({
					locals: {
						dataToPass: photo
					},
					controller: DialogController,
					templateUrl: '/templates/modal.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true,
				})
				.then(function () {
					$scope.status = 'You cancelled the dialog.';
				});
		};

		function DialogController($scope, dataToPass) {
			$scope.photo = dataToPass;
			$scope.hide = function () {
				$mdDialog.hide();
			};

			$scope.cancel = function () {
				$mdDialog.cancel();
			};

			$scope.answer = function (answer) {
				$mdDialog.hide(answer);
			};
		}

		$scope.go = function (path) {
			$location.path(path);
		};
  }]);