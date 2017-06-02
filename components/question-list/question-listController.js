'use strict';

app.controller('QuestionListController', ['$scope', '$resource', '$location', 'Questions', '$firebaseObject', '$firebaseArray', '$firebaseStorage', 'SweetAlert',
    function ($scope, $resource, $location, Questions, $firebaseObject, $firebaseArray, $firebaseStorage, SweetAlert) {
		$scope.main.title = 'FeedForward | Questions';

		$scope.questions = Questions.getAllQuestions();
		$scope.activeQuestions = Questions.getActiveQuestions();
			
		$scope.removeActive = function (question) {
			Questions.removeActiveQuestion(question.$id, question.id);
			$scope.activeQuestions = Questions.getActiveQuestions();
		}
		
		$scope.setActive = function (question) {
			SweetAlert.swal("Successfully activated!", "", "success");
			Questions.addActiveQuestion(question.$id, question.question);
		};
		
		$scope.go = function (path) {
			$location.path(path);
		};
			
		$scope.uploadQuestion = function() {
			Questions.addQuestion($scope.newQuestionText);
			$scope.newQuestionText = "";
		}
		
		$scope.removeQuestion = function (question) {
			if(question.active) {
				Questions.removeActiveQuestion(question.$id, question.id);
				$scope.activeQuestions = Questions.getActiveQuestions();
			}
			Questions.removeQuestion(question.$id);
		};
}]);