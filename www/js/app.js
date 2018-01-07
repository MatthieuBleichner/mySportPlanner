angular.module('starter', ['ionic','starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
      cordova.plugins.Keyboard.disableScroll(true)
    }
    if(window.StatusBar) {
      StatusBar.styleDefault()
    }
  })
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('list', {
      url: '/list',
      templateUrl: 'templates/list.html',
      controller: 'ListCtrl'
    })

    .state('listCompetition', {
      url: '/listCompetition',
      templateUrl: 'templates/listCompetition.html',
      controller: 'listCompetitionCtrl'
    })

    .state('form', {
      url: '/form/{id}',
      templateUrl: 'templates/form.html',
      controller: 'FormCtrl',
      params: {
        id: {value: null},
      },
    })

    .state('trainingForm', {
      url: '/trainingForm/{id}',
      templateUrl: 'templates/trainingForm.html',
      controller: 'TrainingFormCtrl',
      params: {
        id: {value: null},
        date: {value:null},
      },
    })

    .state('competitionModalForm', {
      url: '/competitionModalForm/{id}',
      templateUrl: 'templates/competitionModalForm.html',
      controller: 'competitionModalFormCtrl',
      params: {
        id: {value: null},
      },
    })

    .state('trainingModalForm', {
      url: '/trainingModalForm/{id}',
      templateUrl: 'templates/trainingModalForm.html',
      controller: 'trainingModalFormCtrl',
      params: {
        id: {value: null},
      },
    })

    .state('listTraining', {
      url: '/listTraining',
      templateUrl: 'templates/listTraining.html',
      controller: 'listTrainingCtrl'
    })

  $urlRouterProvider.otherwise('/list')
})
