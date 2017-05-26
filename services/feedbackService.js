'use strict';

app.factory('Feedback', function ($firebaseArray, $firebaseObject) {

	var feedbacks = firebase.database().ref().child("feedback");

	return {
		getAllNutritions: function getFeedbacks() {
			return $firebaseArray(feedbacks);
		},

		addNutrition: function addNutrition(newNutrition) {
			$firebaseArray(nutritions).$add(newNutrition);
		},

		deleteNutrition: function deleteNutrition(nutritionId) {
			surveys.child(nutritionId).remove();
		},

		getFeedbackById: function getFeedbackById(id) {
			return $firebaseObject(feedbacks.child(id));
		},

		addNewNutrition: function addNewNutrition(nutritionID, siteID) {
			feedbacks.child(siteID).child("nutrition").push({
				infoID: nutritionID,
				rating: 0,
				totalRatings: 0
			});
		},
	};
});