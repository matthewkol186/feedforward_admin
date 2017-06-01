'use strict';

app.factory('Nutrition', function ($firebaseArray, $firebaseObject, Sites) {

	var nutritions = firebase.database().ref().child("nutritionInfo");
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
		
		removeActiveNutrition: function removeActiveNutrition(id, deckID) {
			activeNutrition.child(id).remove();
			nutritions.child(deckID).update({"/active": false});
		},
		
		getActiveNutrition: function getActiveNutrition() {
			return $firebaseArray(activeNutrition);
		},
		
		getNutritionSites: function getNutritionSites(nutritionID) {
			return $firebaseArray(nutritions.child(nutritionID).child("sitesDeployed"));
		},
		
		addNutritionSite: function addNutritionSite(nutritionID, siteID) {
			var siteDeckID = Sites.sendDeckToSite(nutritionID, siteID);
			var nameOfSite = Sites.getNameOfSite(siteID);
			nameOfSite.$loaded(function(data) {
				console.log(data.$value);
				nutritions.child(nutritionID).child("sitesDeployed").push({nutritionSiteID: siteDeckID, siteID: siteID, name: data.$value});
			});
		},
		
		removeNutritionSite: function removeNutritionSite(nutritionID, siteID, siteDeckID, siteObjID) {
			Sites.removeDeckFromSite(nutritionID, siteID, siteDeckID);
			nutritions.child(nutritionID).child("sitesDeployed").child(siteObjID).remove();
		},
		
		addActiveNutrition: function addActiveNutrition(id, name) {
			activeNutrition.push({id: id, name: name});
			nutritions.child(id).update({"/active": true});
		},
	};
});