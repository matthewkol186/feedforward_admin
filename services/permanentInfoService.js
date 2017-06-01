'use strict';

app.factory('PermanentInfo', function ($firebaseArray, $firebaseObject) {

	var permInfo = firebase.database().ref().child("permanentInfo");

	return {
		getAllPermInfo: function getAllPermInfo() {
			return $firebaseArray(permInfo);
		},
		
		getPermInfoByID: function getPermInfoByID(id) {
			return $firebaseObject(permInfo.child(id));
		},
		
		getPermInfoSectionsByID: function getPermInfoByID(id) {
			return $firebaseArray(permInfo.child(id).child("sections"));
		},
		
		addNewPermInfo: function addNewPermInfo(title) {
			permInfo.push({title: title, sections: {}});
		},
		
		removeSectionByID: function removeSectionByID(id, sectionID) {
			permInfo.child(id).child("sections").child(sectionID).remove();
		},
		
		addNewPermInfoSection: function addNewPermInfoSection(id, sectionTitle) {
			permInfo.child(id).child("sections").push({header: sectionTitle, text: "Placeholder text"});
		}
	};
});