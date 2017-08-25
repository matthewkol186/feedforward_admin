'use strict';

app.factory('Questions', function ($firebaseArray, $firebaseObject, Sites, Feedback) {

	var questions = firebase.database().ref().child("feedbackQuestions");
	var activeQuestions = firebase.database().ref().child("activeQuestions");

	return {
		getAllQuestions: function getAllQuestions() {
			return $firebaseArray(questions);
		},

		removeQuestion: function removeQuestion(questionID) {
			questions.child(questionID).remove();
		},
		
		getQuestionById: function getQuestionById(id) {
			return $firebaseObject(questions.child(id));
		},
		
		getImagesById: function getImagesById(id) {
			return $firebaseArray(nutritions.child(id).child("images"));
		},
		
		addNutritionCard: function addNutritionCard(nutritionID, newNutrition) {
			$firebaseArray(nutritions.child(nutritionID).child("images")).$add(newNutrition);
		},
		
		addQuestion: function addQuestion(questionText) {
			$firebaseArray(questions).$add({active: false, question: questionText, sitesDeployed: []});
		},
		
		removeActiveQuestion: function removeActiveQuestion(id, questionID) {
			activeQuestions.child(id).remove();
			questions.child(questionID).update({"/active": false});
		},
		
		getActiveQuestions: function getActiveQuestions() {
			return $firebaseArray(activeQuestions);
		},
		
		getQuestionSites: function getQuestionSites(questionID) {
			return $firebaseArray(questions.child(questionID).child("sitesDeployed"));
		},
		
		addQuestionSite: function addQuestionSite(questionID, siteID) {
			var siteQuestionID = Feedback.addNewQuestion(questionID, siteID);
			var nameOfSite = Sites.getNameOfSite(siteID);
			nameOfSite.$loaded(function(data) {
				console.log(data);
				questions.child(questionID).child("sitesDeployed").push({targetSiteID: siteQuestionID, siteID: siteID, name: data.$value});
			});
		},
		
		removeQuestionSite: function removeQuestionSite(questionID, siteID, siteQuestionID, siteObjID) {
			Feedback.removeQuestionSite(questionID, siteID, siteQuestionID);
			questions.child(questionID).child("sitesDeployed").child(siteObjID).remove();
		},
		
		addActiveQuestion: function addActiveQuestion(id, text) {
			activeQuestions.push({id: id, text: text});
			questions.child(id).update({"/active": true});
		},
	};
});