'use strict';

app.factory('Surveys', function ($firebaseArray, $firebaseObject, Sites) {
	var surveyInstances = firebase.database().ref().child("surveyInstances");

	var surveys = firebase.database().ref().child("surveys");

	return {
		getAllSurveys: function getAllSurveys() {
			return $firebaseArray(surveys);
		},

		addNewSurvey: function addNewSurvey(newSurvey) {
			$firebaseArray(surveys).$add(newSurvey);
		},
		
		deleteSurvey: function deleteSurvey(surveyId) {
			surveys.child(surveyId).remove();
		},
		
		copySurvey: function copySurvey(surveyId) {
			$firebaseObject(surveys.child(surveyId)).$loaded().then(function(survey){
				let surveyCopy = {};
				surveyCopy.name = survey.name + " Copy";
				surveyCopy.questions = survey.questions;
				surveyCopy.date = Date.now();
				surveys.push(surveyCopy);
			});
		},

		getSurveyById: function getSurveyByID(id) {
			return $firebaseObject(surveys.child(id));
		},

		getSurveyInstanceById: function getSurveyInstance(id) {
			return $firebaseObject(surveyInstances.child(id));
		},

		getSurveyInstances: function getSurveyInstances(id) {
			var surveyInstancesRef = surveyInstances.orderByChild("parentId").equalTo(id);
			return $firebaseArray(surveyInstancesRef);
		},

		surveyNewSite: function surveyNewSite(id, siteId) {
			$firebaseObject(surveys.child(id)).$loaded().then(function(survey){
				let surveyInstance = {};
				surveyInstance.questions = survey.questions;
				surveyInstance.date = Date.now();
				surveyInstance.active = true;
				surveyInstance.parentId = id;
				surveyInstance.siteId = siteId;
				var newPostKey = surveyInstances.push(surveyInstance).key;
				surveys.child(id).child("instances").push(newPostKey);
				console.log(survey.sites);
				if(!survey.sites || Object.values(survey.sites).indexOf(siteId) < 0) {
					surveys.child(id).child("sites").push(siteId);
				}
				Sites.runSurveyAtSite(siteId, newPostKey);
			});
		},

	};
});