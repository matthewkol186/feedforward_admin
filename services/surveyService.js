'use strict';

app.factory('Surveys', function () {
	var surveyInstances = {
		'1': {
			id: '1',
			siteId: '1',
			parentId: '1', // id of parent survey
			date: 1492160579158,
			questions: [
				{
					question: 'Did you use the butternut squash recipe from last month?',
					answerOptions: [
						{
							display: 'Yes',
							count: 43,
							client_ids: [] // will be filled with 43 client ids
					},
						{
							display: 'No',
							count: 18,
							client_ids: [] // will be filled with 18 client ids
					}
          ]
        },
				{
					question: 'Do you like cauliflower or broccoli more?',
					answerOptions: [
						{
							display: 'Cauliflower',
							count: 20,
							client_ids: []
						},
						{
							display: 'Broccoli',
							count: 65,
							client_ids: []
						}
							]
						},
      ]
		},
		'2': {
			id: '2',
			siteId: '2',
			parentId: '1', // id of parent survey
			date: 1492260579158,
			questions: [
				{
					question: 'Did you use the butternut squash recipe from last month?',
					answerOptions: [
						{
							display: 'Yes',
							count: 230,
							client_ids: [] // will be filled with 23 client ids
					},
						{
							display: 'No',
							count: 12,
							client_ids: [] // will be filled with 12 client ids
					}
          ]
        },
				{
					question: 'Do you like cauliflower or broccoli more?',
					answerOptions: [
						{
							display: 'Cauliflower',
							count: 260,
							client_ids: []
						},
						{
							display: 'Broccoli',
							count: 501,
							client_ids: []
						}
							]
						},
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
						},
				{
					question: 'Do you like cauliflower or broccoli more?',
					answerOptions: [
						{
							display: 'Cauliflower',
							count: 0,
							client_ids: []
						},
						{
							display: 'Broccoli',
							count: 0,
							client_ids: []
						}
							]
						},
					],
			instances: ['1', '2'], // id's of survey instances
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

		getSurveyInstanceById: function getSurveyInstance(id) {
			return surveyInstances[id];
		},

		getSurveyInstances: function getSurveyInstances(id) {
			let surveyInstancesArr = [];
			for (let surveyIndex in surveys[id].instances) {
				surveyInstancesArr.push(surveyInstances[surveys[id].instances[surveyIndex]]);
			}
			return surveyInstancesArr;
		},

		getAggregateData: function getAggregateData(id, instancesToShow) {
			let parentSurvey = surveys[id];
			// return [[{answer: '...', count: ...}, ...], ... ]
			let data = [];
			for (let questionIndex in parentSurvey.questions) {
				let questionData = [];
				for (let answerIndex in parentSurvey.questions[questionIndex].answerOptions) {
					let aggregateCount = 0;
					for (let index in parentSurvey.instances) {
						if (instancesToShow[index]) { //choosing which sites to count or not to count
							let instanceQuestions = surveyInstances[parentSurvey.instances[index]].questions;
							aggregateCount += instanceQuestions[questionIndex].answerOptions[answerIndex].count;
						}
					}
					questionData.push({
						answer: parentSurvey.questions[questionIndex].answerOptions[answerIndex].display,
						count: aggregateCount,
					});
				}
				data.push(questionData);
			}
			return data;
		},

	};
});