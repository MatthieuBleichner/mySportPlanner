angular.module('starter', ['ionic','starter.controllers', 'starter.services', 'starter.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false)
      cordova.plugins.Keyboard.disableScroll(false)
      window.addEventListener('native.keyboardshow', function(){
       document.body.classList.add('keyboard-open');
     });
    }
    if(window.StatusBar) {
      //StatusBar.styleDefault()
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
        id: {value: null}
      },
    })

    .state('trainingForm', {
      url: '/trainingForm/{id}',
      templateUrl: 'templates/trainingForm.html',
      controller: 'TrainingFormCtrl',
      params: {
        id: {value: null},
        date: {value:null},
        training: {value: null}
      },
    })

    .state('planForm', {
      url: '/planForm/{id}',
      templateUrl: 'templates/planForm.html',
      controller: 'PlanFormCtrl',
      params: {
        planData: {value: null}
      },
    })

    .state('plan', {
      url: '/plan/{plan}',
      templateUrl: 'templates/plan.html',
      controller: 'PlanCtrl',
      params: {
        planData: null
      },
    })

    .state('listTraining', {
      url: '/listTraining',
      templateUrl: 'templates/listTraining.html',
      controller: 'listTrainingCtrl'
    })

    .state('listPlan', {
      url: '/listPlan',
      templateUrl: 'templates/listPlan.html',
      controller: 'listPlanCtrl'
    })

  $urlRouterProvider.otherwise('/list')
})
