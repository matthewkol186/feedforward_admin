'use strict';

app.factory('Nutrition', function ($firebaseArray, $firebaseObject) {

	var nutritions = firebase.database().ref().child("nutrition_info");
	var activeNutrition = firebase.database().ref().child("activeNutrition");

	return {
		getAllNutritions: function getAllNutritions() {
			return $firebaseArray(nutritions);
		},

		removeNutrition: function removeNutrition(nutritionId) {
			nutritions.child(nutritionId).remove();
		},
		
		getNutritionById: function getNutritionById(id) {
			return $firebaseObject(nutritions.child(id));
		},
		
		getImagesById: function getImagesById(id) {
			return $firebaseArray(nutritions.child(id).child("images"));
		},
		
		addNutritionCard: function addNutritionCard(nutritionID, newNutrition) {
			$firebaseArray(nutritions.child(nutritionID).child("images")).$add(newNutrition);
		},
		
		addNutrition: function addNutrition(newNutrition) {
			$firebaseArray(nutritions).$add(newNutrition);
		},
		
		removeActiveNutrition: function removeActiveNutrition() {
			($firebaseObject(activeNutrition)).active = false;
		},
		
		getActiveNutrition: function getActiveNutrition() {
			return $firebaseObject(activeNutrition);
		},
		
		setActiveNutrition: function setActiveNutrition(id, name) {
			activeNutrition.update({id: id, active: true, name: name});
		},
	};
});