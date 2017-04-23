'use strict';

app.factory('Sites', function () {
	var sites = {
		'1': {
			id: '1',
			metadata: {
				name: 'Church',
				languages: ['Spanish', 'Vietnamese'],
				clients: [
					{
						name: 'Client 1',
						id: '1'
						},
					{
						name: 'Client 2',
						id: '2'
						},
					{
						name: 'Client 3',
						id: '3'
						}
					]
			},
			surveys: ['1']
		},
		'2': {
			id: '2',
			metadata: {
				name: 'School',
				languages: ['Chinese', 'Vietnamese'],
				clients: [
					{
						name: 'Client 11',
						id: '11'
						},
					{
						name: 'Client 22',
						id: '22'
						},
					{
						name: 'Client 3_3',
						id: '33'
						}
					]
			},
			surveys: ['2']
		},
		
		'3': {
			id: '3',
			metadata: {
				name: 'Sad Site',
				languages: ['Chinese', 'Vietnamese'],
				clients: [
					{
						name: 'Client 11',
						id: '11'
						},
					{
						name: 'Client 22',
						id: '22'
						},
					{
						name: 'Client 3_3',
						id: '33'
						}
					]
			},
			surveys: []
		}
	};
	return {
		getAllSites: function getAllSites() {
			return Object.values(sites);
		},

		runSurveyAtSite(site_id, survey_id) {
			for (var index in sites) {
				if (sites[index].id === site_id) {
					sites[index].surveys.push(survey_id);
				}
			}
		}, 
		
		getNameOfSite(site_id) {
			return sites[site_id].metadata.name;
		}
	};
});