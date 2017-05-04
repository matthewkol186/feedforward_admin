'use strict';

app.factory('Sites', function ($firebaseArray, $firebaseObject) {
	var sitesRef = firebase.database().ref().child("sites");
	return {
		getAllSites: function getAllSites() {
			return $firebaseArray(sitesRef);
		},

		runSurveyAtSite(site_id, survey_id) {
			for (var index in sites) {
				if (sites[index].id === site_id) {
					sites[index].surveys.push(survey_id);
				}
			}
		}, 
		
		getNameOfSite(site_id) {
			console.log(site_id);
			return $firebaseObject(sitesRef.child(site_id).child("metadata").child("name"));
		}
	};
});