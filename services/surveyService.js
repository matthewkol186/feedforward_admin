'use strict';

app.factory('Surveys', function () {
	var surveyInstances = {
		'1': {
			id: '1',
			siteId: '1',
			date: 'a valid date string',
			questions: [
				{
					question: 'Did you use the butternut squash recipe from last month?',
					answerOptions: [
						{
							display: 'Yes',
							count: 4,
							client_ids: [14, 15, 16, 17]
					},
						{
							display: 'No',
							count: 0,
							client_ids: []
					}
          ]
        }
      ]
		}
	};

	var surveys = {
		'1': {
			name: 'Butternut Squash Survey',
			id: '1',
			date: 1492360579158,
			questions: [
				{
					question: 'Did you use the butternut squash recipe from last month?',
					answerOptions: [
						{
							display: 'Yes',
							count: 0,
							client_ids: []
						},
						{
							display: 'No',
							count: 0,
							client_ids: []
						}
							]
						}
					],
			instances: ['1'], // id's of survey instances
		}
	};

	return {
		getAllSurveys: function getAllSurveys() {
			return Object.values(surveys);
		},
		
		addNewSurvey: function addNewSurvey(id, newSurvey) {
			surveys[id] = newSurvey;
		},

		getSurveyById: function getSurveyByID(id) {
			return surveys[id];
		},

		getSurveyInstance: function getSurveyInstance(id) {
			return surveyInstances[id];
		},

	};
});