'use strict';

app.factory('Nutrition', function ($firebaseArray, $firebaseObject) {

	var nutritions = firebase.database().ref().child("nutrition_info");

	return {
		getAllNutritions: function getAllNutritions() {
			return $firebaseArray(nutritions);
		},

		addNutrition: function addNutrition(newNutrition) {
			$firebaseArray(nutritions).$add(newNutrition);
		},
		
		deleteNutrition: function deleteNutrition(nutritionId) {
			surveys.child(nutritionId).remove();
		},
		
		getNutritionById: function getNutritionById(id) {
			return $firebaseObject(nutritions.child(id));
		},
		
		getImagesById: function getImagesById(id) {
			return $firebaseArray(nutritions.child(id).child("images"));
		},
	};
});