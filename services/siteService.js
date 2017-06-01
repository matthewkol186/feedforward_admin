'use strict';

app.factory('Sites', function ($firebaseArray, $firebaseObject) {
	var sitesRef = firebase.database().ref().child("sites");
	return {
		getAllSites: function getAllSites() {
			return $firebaseArray(sitesRef);
		},

		runSurveyAtSite(siteId, instanceId) {
			sitesRef.child(siteId).child("surveys").push(instanceId);
		}, 
		
		getNameOfSite(site_id) {
			return $firebaseObject(sitesRef.child(site_id).child("metadata").child("name"));
		},
		
		sendDeckToSite(nutritionID, siteID) {
			return sitesRef.child(siteID).child("currNutrition").push({id: nutritionID}).key;
		},
		
		removeDeckFromSite(nutritionID, siteID, siteDeckID) {
			return sitesRef.child(siteID).child("currNutrition").child(siteDeckID).remove();
		},
	};
});