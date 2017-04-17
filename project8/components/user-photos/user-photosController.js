'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', '$resource', 'mentioUtil', '$rootScope',
  function ($scope, $routeParams, $resource, mentioUtil, $rootScope) {
		/*
		 * Since the route is specified as '/photos/:userId' in $routeProvider config the
		 * $routeParams  should have the userId property set with the path from the URL.
		 */
		var userId = $routeParams.userId;

		var User = $resource('user/' + userId);
		var Photos = $resource('photosOfUser/' + userId);
		var FavPhoto = $resource('favoritedBy'); 
		var Activity = $resource('registerActivity');
		
		$scope.user = User.get(function (success) {
			$scope.main.title = "Photos of " + success.first_name + " " + success.last_name;
		});

		$scope.photos = Photos.query(function (photos) {
			if ($routeParams.photoIndex) {
				$scope.main.advanced = true;
				$scope.passedId = $routeParams.photoIndex;
			}
			else {
				if(photos.length > 0) {
					$scope.passedId = photos[0]._id;
				}
			}
		});
		
		$scope.submitComment = function(photo, index) {
			var newComment = photo.newComment;
			photo.newComment = "";
			var NewComment = $resource('commentsOfPhoto/'+photo._id);
			Activity.save({"action": "made a comment"}, function(){
				$rootScope.$broadcast("NewActivity");
			});
			NewComment.save({"comment": newComment}, function(updatedPhoto){
				//console.log(updatedPhoto);
				$scope.photos[index] = updatedPhoto;
			});
		};
		
		$scope.favoritePhoto = function(photo, index) {
			FavPhoto.save({"photo_id": photo._id}, function(newPhoto) {
				$scope.photos[index] = newPhoto;	
			});
		};
		
		$scope.$on('PhotoAdded', function() {
			//query photos again
			$scope.photos = Photos.query(function (photos){});
		});
  }]);