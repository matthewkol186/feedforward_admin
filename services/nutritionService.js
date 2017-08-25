'use strict';

app.factory('Nutrition', function ($firebaseArray, $firebaseObject, Sites) {

	var nutritions = firebase.database().ref().child("nutritionInfo");
	var activeNutrition = firebase.database().ref().child("activeNutrition");

	return {
		getAllNutritions: function getAllNutritions() {
			return $firebaseArray(nutritions);
		},

		removeNutrition: function removeNutrition(nutritionId) {
			// remove nutrition from the site objects where it is deployed
			$firebaseArray(nutritions.child(nutritionId).child("sitesDeployed")).$loaded().then(function(data){
				for(var i = 0; i < data.length; i++) {
					Sites.removeDeckFromSite(data[i].siteID, data[i].nutritionSiteID);
				}
				nutritions.child(nutritionId).remove();
			});
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

		getNutritionSites: function getNutritionSites(nutritionID, callback) {
			nutritions.child(nutritionID).child("sitesDeployed").on('value', callback); // safer w/ Firebase index bug
		},

		detectActiveNutrition: function detectActiveNutrition(nutritionID, callback) {
			$firebaseArray(activeNutrition).$loaded().then(function(data){
				for(var i = 0; i < data.length; i++) {
					if(data[i].id === nutritionID) {
						callback(true);
						return;
					}
				}
				callback(false);
			});
		},

		addNutritionSite: function addNutritionSite(nutritionID, siteID) {
			var siteDeckID = Sites.sendDeckToSite(nutritionID, siteID);
			var nameOfSite = Sites.getNameOfSite(siteID);
			nameOfSite.$loaded(function(data) {
				nutritions.child(nutritionID).child("sitesDeployed").push({nutritionSiteID: siteDeckID, siteID: siteID, name: data.$value});
			});
		},

		removeNutritionSite: function removeNutritionSite(nutritionID, siteID, siteDeckID, siteObjID) {
			Sites.removeDeckFromSite(siteID, siteDeckID);
			console.log(nutritionID, siteID, siteDeckID, siteObjID);
			nutritions.child(nutritionID).child("sitesDeployed").child(siteObjID).remove();
		},

		addActiveNutrition: function addActiveNutrition(deck) {
			var id = deck.$id;
			var name = deck.name;
			activeNutrition.push({id: id, name: name});
			nutritions.child(id).update({"/active": true});
			// if the site is currently deployed at a specific site, undeploy it from all sites
			var sitesDeployed = deck.sitesDeployed;
			Object.keys(sitesDeployed).forEach(function(key, index){
				var siteID = sitesDeployed[key].siteID;
				var siteDeckID = sitesDeployed[key].nutritionSiteID;
				Sites.removeDeckFromSite(siteID, siteDeckID);
			});
			nutritions.child(id).child("sitesDeployed").remove();
		},
	};
});
