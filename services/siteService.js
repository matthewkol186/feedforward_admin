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
			console.log(site_id);
			return $firebaseObject(sitesRef.child(site_id).child("metadata").child("name"));
		},
		
		sendDeckToSite(nutritionID, siteID) {
			sitesRef.child(siteID).update({currFood: nutritionID});
		},
	};
});