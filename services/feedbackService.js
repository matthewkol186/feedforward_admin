'use strict';

app.factory('Feedback', function ($firebaseArray, $firebaseObject) {

	var feedbacks = firebase.database().ref().child("feedback");

	return {
		getFeedbacks: function getFeedbacks() {
			return $firebaseArray(feedbacks);
		},
		getFeedbackById: function getFeedbackById(id) {
			return $firebaseObject(feedbacks.child(id));
		},

		addNewQuestion: function addNewQuestion(questionID, siteID) {
			return feedbacks.child(siteID).child("questions").push({
				questionID: questionID,
				active: true,
				rating: 0,
				totalRatings: 0,
				comments: [],
			}).key;
		},
		
		removeQuestionSite: function removeQuestionSite(questionID, siteID, targetSiteID) {
			return feedbacks.child(siteID).child("questions").child(targetSiteID).update({"/active": false});
		},
	};
});