'use strict';

app.factory('Sites', function () {
	var sites = {
		'1': {
			id: '1',
			metadata: {
				name: 'Site 1',
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
			surveys: ['1', '2', '3', '4']
		},
		'2': {
			id: '2',
			metadata: {
				name: 'Site 2',
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
			surveys: ['1', '4', '5']
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
		}
	};
});