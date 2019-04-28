angular.module('starter.controllers', ['ngCordova','papa-promise'])


  .controller('ListCtrl', function ($scope,$ionicPlatform, $state, CompetitionDataService, $ionicPopup) {
    $scope.$on('$ionicView.enter', function(e) {
        CompetitionDataService.getNext3Competitions(function(data){
          $scope.itemsList = data
        })
        CompetitionDataService.getNext3Trainings(function(dataTrainings){
          $scope.trainingList = dataTrainings
        })
        CompetitionDataService.get3Plan(function(dataPlans){
          $scope.planList = dataPlans
        })
        CompetitionDataService.getAllSports(function(dataSports){
          $scope.sportList = dataSports
        })
    })

    $scope.gotoEdit = function(idCompetition){
      $state.go('form', {id: idCompetition})
    }

    $scope.gotoEditTraining = function(idTraining){
      $state.go('trainingForm', {id: idTraining})
    }

    $scope.gotoDisplayPlan = function(plan){
      $state.go('plan', {planData: plan})
    }

    $scope.gotoEditPlan = function(){
      $state.go('planForm')
    }


    $scope.confirmDelete = function(idCompetition) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Remove a competition',
        template: 'Are you sure you want to remove this event ?'
      })

      confirmPopup.then(function(res) {
        if(res) {
          CompetitionDataService.deleteCompetition(idCompetition);
          $state.reload();
        }
      })
    }

  })

  .controller('PlanCtrl', function ($scope,$stateParams,$ionicPlatform, $state, CompetitionDataService, Papa, $cordovaFile, $ionicModal, $ionicPopup) {
    $scope.$on('$ionicView.enter', function(e) {


      if($stateParams.planData){
              $scope.currentPlan= $stateParams.planData;
              CompetitionDataService.getSportById( $scope.currentPlan.sport_id, function (sport){
                $scope.currentPlan.sport = sport;
                $scope.displayPlanTrainingsFromJson( $scope.currentPlan );
              })
        }
      })


      $scope.displayPlanTrainingsFromJson = function( _planConfig ) {
          console.log("open file " + _planConfig.file);
          //$scope.planDisplay.plan = true;
          $scope.currentPlan = _planConfig;
          $scope.planCreationPerWeek=[];

          var dirName = "plans";


          if(window.cordova){
            $cordovaFile.checkDir(cordova.file.applicationStorageDirectory, dirName).then(
                function (success) {
                  console.log("dir exists exists");
                  console.log("path is : " + cordova.file.applicationStorageDirectory + dirName);
                  //$cordovaFile.checkFile(cordova.file.applicationStorageDirectory + dirName, _fileName.name).then(
                    //function (success) {
                        console.log("files exists");
                        $cordovaFile.readAsText(cordova.file.applicationStorageDirectory + dirName, _planConfig.file).then(
                            function (data) {
                              console.log("files readed");
                                $scope.planCreationPerWeek = JSON.parse(data);
                                console.log("_planConfig.file" + _planConfig.file);

                                console.log("contains" + $scope.planCreationPerWeek );

                            }, function (error) {
                            });
                //    }, function (error) {
                  //                console.log("no such file");
                    //   }
                  //   )
                   })
        }
        else {
          //fill with fake data
          $scope.addTrainingWeek();
          $scope.addTraining( 0 );
          $scope.addTraining( 0 );
          $scope.addTraining( 0 );
          $scope.addTrainingWeek();
          $scope.addTraining( 1 );
          $scope.addTraining( 1 );
          $scope.addTraining( 1 );
          $scope.addTrainingWeek();
          $scope.addTraining( 2 );
          $scope.addTraining( 2 );
          $scope.addTraining( 2 );
        }


      }


      $scope.addTrainingWeek = function( ) {

        newTraining = {};
        newTraining.sport_id = 1;
        newTraining.duration = 60;
        newTraining.distance = -1;

        newTraining.imgUrl = "img/run.svg"
        newTraining.title = "first training";
        newTraining.content = "my first run";
        newTraining.weekDay = 1;

        iNbWeek = $scope.planCreationPerWeek.length;
        $scope.planCreationPerWeek.push( [] );
        $scope.planCreationPerWeek[iNbWeek].push( newTraining );
      }

      $scope.addTraining = function( iWeekId ) {

        newTraining = {};
        newTraining.sport_id = 1;
        newTraining.duration = 60;
        newTraining.distance = -1;

        newTraining.imgUrl = "img/run.svg"
        iNbTraining = $scope.planCreationPerWeek[iWeekId].length + 1;
        newTraining.title = "training " + iNbTraining;
        newTraining.content = "training " + iNbTraining;
        newTraining.weekDay = 1;

        $scope.planCreationPerWeek[iWeekId].push( newTraining );
      }



      $ionicModal.fromTemplateUrl('templates/modalPlan.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then( function(modal){
        $scope.modalImportPlan = modal;
      });


      $scope.importTraining = function(){
        $scope.modalImportPlan.show();
      }

      $scope.confirmDeletePlan = function( ) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Remove a plan',
          template: 'Are you sure you want to remove this plan ?'
        })

        confirmPopup.then(function(res) {
          if(res) {
            CompetitionDataService.deletePlan( $scope.currentPlan.id );
            $state.go('list');
          }
        })
      }

      $scope.start = function( endDate ){
        var date = moment( endDate );
        var nbWeek = $scope.planCreationPerWeek.length;
        initialDate = moment(date).add( - (nbWeek-1), 'w').isoWeekday(1);
        initialDate.startOf('isoweek');

        for(it=0;it<nbWeek;it++){
          var nbTraining = $scope.planCreationPerWeek[it].length;

          var weekDayTraining=[];
          if( nbTraining == 1){
            weekDayTraining=[6];
          }
          else if( nbTraining == 2){
            weekDayTraining=[4,6];
          }
          else if( nbTraining == 3){
            weekDayTraining=[2,4,6];
          }
          else if( nbTraining == 4){
            weekDayTraining=[2,4,6,7];
          }
          else if( nbTraining == 5){
              weekDayTraining=[2,3,4,6,7];
          }
          else {
            for(jt=0;jt<nbTraining;jt++)
            {
              weekDayTraining.push(3);
            }
          }

          for(jt=0;jt<nbTraining;jt++)
          {
            var training = $scope.planCreationPerWeek[it][jt];
            eventDate = new moment(initialDate).isoWeekday(1);
            eventDate.add(7*(parseInt(it) ) + parseInt( weekDayTraining[jt] -1 ),'day');

            training.date = eventDate.toDate();
            CompetitionDataService.createTraining(training , function (trainingId){
              CompetitionDataService.addTrainingNotification(training, trainingId);
            });
          }
        }
        $scope.modalImportPlan.hide();
        $state.go('list');
      }

      $scope.gotoEditPlan = function(planId){
        $state.go('planForm', {id: planId})
      }

  })


  .controller('PlanFormCtrl', function ($scope,$stateParams,$ionicPlatform, $state, CompetitionDataService, Papa, $cordovaFile, $ionicModal, $ionicPopup) {
    $scope.$on('$ionicView.enter', function(e) {

      CompetitionDataService.getAllPlans(function(data){
        $scope.availablesPlanList = data
      })

      if($stateParams.id){
          CompetitionDataService.getAvailablePlan( $stateParams.id, function ( plan ){
              $scope.currentPlan= plan[0];
              CompetitionDataService.getSportById( $scope.currentPlan.sport_id, function (sport){
                $scope.currentPlan.sport = sport;
                if( !$scope.boolBypasDegeu  ){
                  $scope.displayPlanTrainingsFromJson( $scope.currentPlan );
                }
                boolBypasDegeu = false;
                $scope.planDisplayCreation( $scope.planCreationPerWeek );
              })
          })
          //$scope.planDisplay.plan = true;

        }
        else if($stateParams.planData){
          $scope.currentPlan = $stateParams.planData;
          $scope.planDisplayCreation( $scope.currentPlan );
        }
        else{
          CompetitionDataService.getAllSports(function(dataSports){
            $scope.sportList = dataSports,
            $scope.currentPlan.sport = dataSports[0];
            $scope.currentPlan.sport_id = $scope.currentPlan.sport.id;
            CompetitionDataService.getSportImgUrl($scope.currentPlan.sport.id , function(sportImg){
              $scope.currentPlan.imgUrl = sportImg.logoURL;planCreationPerWeek

                console.log("plan created");
              } );
            });
          $scope.planDisplayCreation();
        }
      })

      $scope.planDisplay = {};
      $scope.planDisplay.plan = false;
      $scope.planDisplay.planCreation = false;
      $scope.currentPlan={};
      $scope.boolBypasDegeu = false;

      $scope.displayPlanTrainingsFromJson = function( _planConfig ) {
          console.log("open file " + _planConfig.file);
          $scope.planDisplay.plan = true;
          $scope.currentPlan = _planConfig;
          $scope.planCreationPerWeek=[];

          var dirName = "plans";

          CompetitionDataService.getAvailablePlan( _planConfig.id, function ( plan ){
              $scope.currentPlan= plan[0];
              CompetitionDataService.getSportById( $scope.currentPlan.sport_id, function (sport){
                $scope.currentPlan.sport = sport;
              })
          })

          if(window.cordova){
            $cordovaFile.checkDir(cordova.file.applicationStorageDirectory, dirName).then(
                function (success) {
                  console.log("dir exists exists");
                  console.log("path is : " + cordova.file.applicationStorageDirectory + dirName);
                  //$cordovaFile.checkFile(cordova.file.applicationStorageDirectory + dirName, _fileName.name).then(
                    //function (success) {
                        console.log("files exists");
                        $cordovaFile.readAsText(cordova.file.applicationStorageDirectory + dirName, _planConfig.file).then(
                            function (data) {
                              console.log("files readed");
                                $scope.planCreationPerWeek = JSON.parse(data);
                                console.log("_planConfig.file" + _planConfig.file);

                                console.log("contains" + $scope.planCreationPerWeek );

                            }, function (error) {
                            });
                //    }, function (error) {
                  //                console.log("no such file");
                    //   }
                  //   )
                   })
        }
        else {
          //fill with fake data
          $scope.addTrainingWeek();
          $scope.addTraining( 0 );
          $scope.addTraining( 0 );
          $scope.addTraining( 0 );
          $scope.addTrainingWeek();
          $scope.addTraining( 1 );
          $scope.addTraining( 1 );
          $scope.addTraining( 1 );
          $scope.addTrainingWeek();
          $scope.addTraining( 2 );
          $scope.addTraining( 2 );
          $scope.addTraining( 2 );
        }


      }

      $scope.planDisplayCreation = function( _plan ) {


        $scope.planDisplay.plan = false;
        $scope.planDisplay.planCreation = true;
        $scope.planCreationPerWeek = [];
        $scope.planDisplay.isEditing = false;
        if( _plan != undefined){
            $scope.planCreationPerWeek = _plan;
            $scope.planDisplay.isEditing = true;
        }
        else{

          $scope.planCreationPerWeek = [];
          $scope.planCreationPerWeek.push( [] );
          newTraining = {};
          newTraining.sport_id = 1;
          newTraining.duration = 60;
          newTraining.distance = -1;

          newTraining.imgUrl = "img/run.svg"
          newTraining.title = "first training";
          newTraining.content = "my first run";
          newTraining.weekDay = 1;
          $scope.planCreationPerWeek[0].push( newTraining );
          $scope.currentPlan.name = "";
        }

        $scope.disableSaveButton = true;

      }

      $scope.trainingPlanNameChanged = function( i_fileName ){
        $scope.disableSaveButton = false;
        if( i_fileName.length == 0 )
          $scope.disableSaveButton = true;
        for( it=0; it<$scope.availablesPlanList.length;it++ ){
          console.log($scope.availablesPlanList[it]);
          if ( $scope.availablesPlanList[it].file == i_fileName ){
                  $scope.disableSaveButton = true;
                  return;
          }
        }
      }

      $scope.addTrainingWeek = function( ) {

        newTraining = {};
        newTraining.sport_id = 1;
        newTraining.duration = 60;
        newTraining.distance = -1;

        newTraining.imgUrl = "img/run.svg"
        newTraining.title = "first training";
        newTraining.content = "my first run";
        newTraining.weekDay = 1;

        iNbWeek = $scope.planCreationPerWeek.length;
        $scope.planCreationPerWeek.push( [] );
        $scope.planCreationPerWeek[iNbWeek].push( newTraining );
      }

      $scope.addTraining = function( iWeekId ) {

        newTraining = {};
        newTraining.sport_id = 1;
        newTraining.duration = 60;
        newTraining.distance = -1;

        newTraining.imgUrl = "img/run.svg"
        iNbTraining = $scope.planCreationPerWeek[iWeekId].length + 1;
        newTraining.title = "training " + iNbTraining;
        newTraining.content = "training " + iNbTraining;
        newTraining.weekDay = 1;

        $scope.planCreationPerWeek[iWeekId].push( newTraining );
      }

      $ionicModal.fromTemplateUrl('templates/modalSavePlan.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then( function(modal){
        $scope.modalSavePlan = modal;
      });

      $ionicModal.fromTemplateUrl('templates/modalPlan.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then( function(modal){
        $scope.modalImportPlan = modal;
      });

      $scope.gotoEditTraining = function( _training ){
        $scope.boolBypasDegeu = true;
        $state.go('trainingForm', {training: _training})
      }

      $scope.saveNewPlan = function(){
        $scope.modalSavePlan.show();
      }

      $scope.importTraining = function(){
        $scope.modalImportPlan.show();
      }

      $scope.saveTrainingPlan = function( i_fileName ){

          console.log("saveTrainingPlan " + i_fileName);
          $scope.currentPlan.file = i_fileName;
        var fileName = i_fileName;
        var dirName = "plans";
        if(window.cordova)
        {
          var dirExists = false;
          $cordovaFile.checkDir(cordova.file.applicationStorageDirectory, dirName).then(
              function (success) {
                console.log("dir exists");
                $cordovaFile.writeFile(cordova.file.applicationStorageDirectory + "/" + dirName, fileName, JSON.stringify($scope.planCreationPerWeek), true).then(
                    function (success) {
                      console.log( fileName + " exported");

                    }, function (error) {
                      console.log("error when exported plan.json exported");
                  });
              }, function (error) {
                console.log("dir doesn't exist");
                $cordovaFile.createDir(cordova.file.applicationStorageDirectory, dirName, true).then(
                    function (success) {
                      console.log("dir created");
                      $cordovaFile.writeFile(cordova.file.applicationStorageDirectory + "/" + dirName, fileName, JSON.stringify($scope.planCreationPerWeek), true).then(
                          function (success) {
                            console.log( fileName + " exported");

                          }, function (error) {
                            console.log("error when exported plan.json exported");
                        });
                    }, function (error) {
                      console.log("dir errror");
                  });
            });

        }

        var nbTraining = 0;
        var nbWeek = $scope.planCreationPerWeek.length;
        for( it=0; it<nbWeek;it++ ){
          nbTraining = nbTraining + $scope.planCreationPerWeek[it].length;
        }

        nbAverageTraining = Math.round( nbTraining / nbWeek );

        newPlan = {};
        newPlan = $scope.currentPlan;
        //newPlan.sport_id = $scope.currentPlan.sport.id;
        //newPlan.imgUrl = $scope.currentPlan.imgUrl;
        //newPlan.distance = -1;
        newPlan.occurence = nbAverageTraining;
        newPlan.weekDuration = nbWeek;
        //newPlan.file = fileName ;
        if( $scope.planDisplay.isEditing )
        {
          newPlan.id = $scope.currentPlan.id;
          CompetitionDataService.updatePlan( newPlan, function (trainingPlanId){

          })
        }
        else {
          CompetitionDataService.createPlan( newPlan, function (trainingPlanId){

          })
        }
        $scope.modalSavePlan.hide();
        $state.go('list');

      }

      $scope.confirmDeletePlan = function( ) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Remove a plan',
          template: 'Are you sure you want to remove this plan ?'
        })

        confirmPopup.then(function(res) {
          if(res) {
            CompetitionDataService.deletePlan( $scope.currentPlan.id );
            $state.go('list');
          }
        })
      }
      $scope.sportChange = function(item) {
        console.log("Sport is :", item.id);
        CompetitionDataService.getSportImgUrl(item.id, function(imgUrl){
          $scope.currentPlan.imgUrl  = imgUrl.logoURL;
          $scope.currentPlan.sport_id  = item.id;
        })
      }

      $scope.start = function( endDate ){
        var date = moment( endDate );
        var nbWeek = $scope.planCreationPerWeek.length;
        initialDate = moment(date).add( - (nbWeek-1), 'w').isoWeekday(1);
        initialDate.startOf('isoweek');

        for(it=0;it<nbWeek;it++){
          var nbTraining = $scope.planCreationPerWeek[it].length;

          var weekDayTraining=[];
          if( nbTraining == 1){
            weekDayTraining=[6];
          }
          else if( nbTraining == 2){
            weekDayTraining=[4,6];
          }
          else if( nbTraining == 3){
            weekDayTraining=[2,4,6];
          }
          else if( nbTraining == 4){
            weekDayTraining=[2,4,6,7];
          }
          else if( nbTraining == 5){
              weekDayTraining=[2,3,4,6,7];
          }
          else {
            for(jt=0;jt<nbTraining;jt++)
            {
              weekDayTraining.push(3);
            }
          }

          for(jt=0;jt<nbTraining;jt++)
          {
            var training = $scope.planCreationPerWeek[it][jt];
            eventDate = new moment(initialDate).isoWeekday(1);
            eventDate.add(7*(parseInt(it) ) + parseInt( weekDayTraining[jt] -1 ),'day');

            training.date = eventDate.toDate();
            CompetitionDataService.createTraining(training , function (trainingId){
              CompetitionDataService.addTrainingNotification(training, trainingId);
            });
          }
        }
        $scope.modalImportPlan.hide();
        $state.go('list');
      }

  })


  .controller('listPlanCtrl', function ($scope,$ionicPlatform, $state, CompetitionDataService, Papa, $cordovaFile, $ionicModal, $ionicPopup) {
    $scope.$on('$ionicView.enter', function(e) {

      $scope.availablesPlanList=[];
      CompetitionDataService.getAllPlans(function(data){
        $scope.availablesPlanList = data
      })
    })

    $scope.gotoDisplayPlan = function(plan){
      $state.go('plan', {planData: plan})
    }



  })


  .controller('listCompetitionCtrl', function ($scope,$ionicPlatform, $state, CompetitionDataService, $ionicPopup) {
    $scope.$on('$ionicView.enter', function(e) {
        CompetitionDataService.getFutureCompetitions(function(data){
          $scope.itemsList = data
        })
        CompetitionDataService.getAllSports(function(dataSports){
          $scope.sportList = dataSports
        })

        $scope.minDate = new Date();
    })

    $scope.openCompetitionList = function(){
      $state.go('listCompetition')
    }

    $scope.gotoEdit = function(idNote){
      $state.go('form', {id: idNote})
    }

    $scope.displayMoreCompetition = function(){
      $scope.minDate.setFullYear( $scope.minDate.getFullYear() - 1 );
      CompetitionDataService.getCompetitionsFromDate($scope.minDate, function(data){
        $scope.itemsList = data
      })

    }

    $scope.confirmDelete = function(idCompetition) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Remove a competition',
        template: 'Are you sure you want to remove this event ?'
      })

      confirmPopup.then(function(res) {
        if(res) {
          CompetitionDataService.deleteCompetition(idCompetition);
          $state.reload();
        }
      })
    }


    $scope.dislayPastEvents = function()
    {
      CompetitionDataService.getAll(function(data){
        $scope.itemsList = data;
      })
    }

  })

  .filter('rangecal', function() {
      return function(input, total) {
          total = parseInt(total);

          for (var i=0; i<total; i++) {
              input.push(i);
          }

          return input;
      };
  })

  .filter('filterDate', function($filter) {
      return function(input, format) {

          var inputDate = new Date(input).toLocaleDateString();
          var today = new Date().toLocaleDateString();
          var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString();
          if( inputDate == today )
          {
            return "Today";
          }
          else if ( inputDate == tomorrow ) {
            return "Tomorrow";
          }
          else{
            return $filter('date')(new Date(input), format);
          }

          return input;
      };
  })

  .filter('minutes2Hours', function() {
      return function(input,format) {
        if( input=="" )
          return input;
        if( input/60 >= 1){
          var minutes = input%60;
          var hours = (input - minutes) / 60;
          if ( minutes != 0){
            return hours + "h" + minutes
          }
          else{
            return hours + "h";
          }
        }
        else{
          return input + format;
        }

      };
  })

  .controller('listTrainingCtrl', function ($scope,$ionicPlatform, $state, CompetitionDataService, $ionicPopup, Papa, $cordovaFile) {
    $scope.$on('$ionicView.enter', function(e) {
        CompetitionDataService.getAllTrainings(function(data){
          $scope.trainingList = data
          $scope.displayWeekCalendar();
        })
        CompetitionDataService.getAllSports(function(dataSports){
          $scope.sportList = dataSports
        })


    })

    $scope.gotoEditTraining = function(idTraining){
      $scope.sportType = 'running';
      $state.go('trainingForm', {id: idTraining, date: new Date(selectedYear,selectedMonth,selectedDate)})
    }

    $scope.confirmDelete = function(idTraining) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Remove a training',
        template: 'Are you sure you want to remove this event ?'
      })

      confirmPopup.then(function(res) {
        if(res) {
          CompetitionDataService.deleteTraining(idTraining);
          $state.reload();
        }
      })
    }



    var calMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // these are the days of the week for each month, in order
    var calDaysForMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var selectedYear, selectedMonth, selectedDate, shortMonth;

    var CurrentDate = new Date();

    $scope.calMonths = [[{'id':0,'name':'Jan'},{'id':1,'name':'Feb'},{'id':2,'name':'Mar'},{'id':3,'name':'Apr'}],[{'id':4,'name':'May'},{'id':5,'name':'Jun'},{'id':6,'name':'Jul'},{'id':7,'name':'Aug'}],[{'id':8,'name':'Sep'},{'id':9,'name':'Oct'},{'id':10,'name':'Nov'},{'id':11,'name':'Dec'}]];

            selectedYear = CurrentDate.getFullYear(),
            selectedMonth = CurrentDate.getMonth(),
            selectedDate = CurrentDate.getDate();
            var selectedWeek = moment(CurrentDate).week();



            $scope.UICalendarDisplay = {};
            $scope.UICalendarDisplay.Week = true;
            $scope.UICalendarDisplay.Date = false;
            $scope.UICalendarDisplay.Month = false;
            $scope.UICalendarDisplay.Year = false;

            $scope.displayCompleteDate = function() {
                var timeStamp = new Date(selectedYear,selectedMonth,selectedDate).getTime();
                if(angular.isUndefined($scope.dateformat)) {
                    var format = "dd - MMM - yy";
                } else {
                    var format = $scope.dateformat;
                }
                $scope.displayWeekDay = moment(timeStamp).format('dddd');
                //$scope.display = $filter('date')(timeStamp, format);
            }

            //Onload Display Current Date
            $scope.displayCompleteDate();

            $scope.UIdisplayDatetoMonth = function() {
                $scope.UICalendarDisplay.Week = false;
                $scope.UICalendarDisplay.Date = false;
                $scope.UICalendarDisplay.Month = true;
                $scope.UICalendarDisplay.Year = false;
            }

            $scope.UIdisplayWeekToDate = function() {
                $scope.UICalendarDisplay.Week = false;
                $scope.UICalendarDisplay.Date = true;
                $scope.UICalendarDisplay.Month = false;
                $scope.UICalendarDisplay.Year = false;
                $scope.displayMonthCalendar(); // uniquement pour week to date car il faut initialiser les données de displayMonthCalendar
            }

            $scope.UIdisplayDateToWeek = function() {
                $scope.UICalendarDisplay.Week = true;
                $scope.UICalendarDisplay.Date = false;
                $scope.UICalendarDisplay.Month = false;
                $scope.UICalendarDisplay.Year = false;
                $scope.displayWeekCalendar(); // uniquement pour week to date car il faut initialiser les données de displayMonthCalendar
            }

            $scope.UIdisplayMonthtoYear = function() {
                $scope.UICalendarDisplay.Week = false;
                $scope.UICalendarDisplay.Date = false;
                $scope.UICalendarDisplay.Month = false;
                $scope.UICalendarDisplay.Year = true;
            }

            $scope.UIdisplayYeartoMonth = function() {
                $scope.UICalendarDisplay.Week = false;
                $scope.UICalendarDisplay.Date = false;
                $scope.UICalendarDisplay.Month = true;
                $scope.UICalendarDisplay.Year = false;
            }
            $scope.UIdisplayMonthtoDate = function() {
                $scope.UICalendarDisplay.Week = false;
                $scope.UICalendarDisplay.Date = true;
                $scope.UICalendarDisplay.Month = false;
                $scope.UICalendarDisplay.Year = false;
            }

            $scope.selectedMonthPrevClick = function() {
                selectedDate = 1;
                if(selectedMonth == 0) {
                    selectedMonth = 11;
                    selectedYear--;
                } else {
                    $scope.displayMonth = selectedMonth--;
                }
                $scope.displayMonthCalendar();
            }

            $scope.selectedMonthNextClick = function() {
                selectedDate = 1;
                if(selectedMonth == 11) {
                    selectedMonth = 0;
                    selectedYear++;
                } else {
                    $scope.displayMonth = selectedMonth++;
                }
                $scope.displayMonthCalendar();
            }

            $scope.selectedWeekPrevClick = function() {


                if(selectedWeek == 1) {
                    selectedWeek = 52;
                    selectedYear--;
                } else {
                    $scope.dislayWeek = selectedWeek--;
                }
                selectedDate = moment().week(selectedWeek).year(selectedYear).isoWeekday(1).date();
                selectedMonth = moment().week(selectedWeek).year(selectedYear).isoWeekday(1).month();

                $scope.displayCompleteDate();
                $scope.displayWeekCalendar();
            }

            $scope.selectedWeekNextClick = function() {

                if(selectedWeek == 52) {
                    selectedWeek = 1;
                    selectedYear++;
                } else {
                    $scope.dislayWeek = selectedWeek++;
                }

                selectedDate = moment().week(selectedWeek).year(selectedYear).isoWeekday(1).date();
                selectedMonth = moment().week(selectedWeek).year(selectedYear).isoWeekday(1).month();
                $scope.displayCompleteDate();
                $scope.displayWeekCalendar();
            }

            $scope.selectedMonthYearPrevClick = function() {
                selectedYear--;
                $scope.displayYear = selectedYear;
                $scope.displayMonthCalendar();
            }

            $scope.selectedMonthYearNextClick = function() {
                selectedYear++;
                $scope.displayYear = selectedYear;
                $scope.displayMonthCalendar();
            }

            $scope.selectedDecadePrevClick = function() {
                selectedYear -= 10;
                $scope.displayMonthCalendar();
            }

            $scope.selectedDecadeNextClick = function() {
                selectedYear += 10;
                $scope.displayMonthCalendar();
            }

            $scope.selectedYearClick = function(year) {
                $scope.displayYear = year;
                selectedYear = year;
                $scope.displayMonthCalendar();
                $scope.UICalendarDisplay.Week = false;
                $scope.UICalendarDisplay.Date = false;
                $scope.UICalendarDisplay.Month = true;
                $scope.UICalendarDisplay.Year = false;
                $scope.displayCompleteDate();
            }

            $scope.selectedMonthClick = function(month) {
                $scope.displayMonth = month;
                selectedMonth = month;
                $scope.displayMonthCalendar();
                $scope.UICalendarDisplay.Week = false;
                $scope.UICalendarDisplay.Date = true;
                $scope.UICalendarDisplay.Month = false;
                $scope.UICalendarDisplay.Year = false;
                $scope.displayCompleteDate();
            }

            $scope.selectedDateClick = function(date) {
                $scope.displayDate = date.date;

                selectedDate = date.date;

                if(date.type == 'newMonth') {
                    var mnthDate = new Date(selectedYear, selectedMonth, 32)
                    selectedMonth = mnthDate.getMonth();
                    selectedYear = mnthDate.getFullYear();
                    $scope.displayMonthCalendar();
                } else if(date.type == 'oldMonth') {
                    var mnthDate = new Date(selectedYear, selectedMonth, 0);
                    selectedMonth = mnthDate.getMonth();
                    selectedYear = mnthDate.getFullYear();
                    $scope.displayMonthCalendar();
                }
                if(date.month != undefined){
                  selectedMonth = date.month;
                  $scope.displayMonth = calMonths[selectedMonth];
                }
                $scope.displayCompleteDate();

                $scope.fullDayEvents = date.event;
            }

            $scope.displayMonthCalendar = function() {

                /*Year Display Start*/
                $scope.startYearDisp = (Math.floor(selectedYear/10)*10) - 1;
                $scope.endYearDisp = (Math.floor(selectedYear/10)*10) + 10;
                /*Year Display End*/


                $scope.datesDisp = [[],[],[],[],[],[]];
                    countDatingStart = 1;

                    if(calMonths[selectedMonth] === 'February') {
                        if(selectedYear%4 === 0) {
                            endingDateLimit = 29;
                        } else {
                            endingDateLimit = 28;
                        }
                    } else {
                        endingDateLimit = calDaysForMonth[selectedMonth];
                    }
                    startDay = new Date(selectedYear, selectedMonth, 1).getDay() ;
                    startDay = ( startDay || 7 ) -1; //make week start on monday

                $scope.displayYear = selectedYear;
                $scope.displayMonth = calMonths[selectedMonth];
                $scope.shortMonth = calMonths[selectedMonth].slice(0,3);

                $scope.displayDate = selectedDate;

                var nextMonthStartDates = 1;
                var prevMonthLastDates = new Date(selectedYear, selectedMonth, 0).getDate();

                for (i=0;i<6;i++) {




                     if (typeof $scope.datesDisp[0][6] === 'undefined') {
                       //premiere ligne du mois
                        for(j=0;j<7;j++) {
                          if(j < startDay) {
                            $scope.datesDisp[i][j] = {"type":"oldMonth","date":(prevMonthLastDates - startDay + 1)+j};
                          } else {
                            $scope.getDayTrainingFromWeekDay( countDatingStart, function(data){
                              $scope.datesDisp[i][j] = {"type":"currentMonth","date":countDatingStart++, "event":data};
                            })
                          }
                        }
                     } else {
                       for(k=0;k<7;k++) {
                          if(countDatingStart <= endingDateLimit) {

                            $scope.getDayTrainingFromWeekDay( countDatingStart, function(data){
                              $scope.datesDisp[i][k] = {"type":"currentMonth","date":countDatingStart++, "event":data};
                            })
                          } else {
                              $scope.datesDisp[i][k] = {"type":"newMonth","date":nextMonthStartDates++};
                          }
                       }
                     }

                }
            }

            $scope.getDayTrainingFromWeekDay = function(currentWeekDay, callback) {
              todayDate = currentWeekDay;
              currentDate = new Date(selectedYear, selectedMonth , todayDate);
              $scope.getDayTraining(currentDate, callback) ;
            }

            $scope.getDayTraining = function(currentDay, callback) {
              listOfTrainingForThisDay = [];
              nextPos = 0;

              trainings = $scope.trainingList.get( currentDay.toLocaleDateString() );
              if( trainings ){
                for(trainingJt=0;trainingJt<trainings.length;trainingJt++)
                {
                    listOfTrainingForThisDay [nextPos] = {"img" : trainings[trainingJt].imgUrl ,"duration":trainings[trainingJt].duration ,"date":fullDate.format('DD') , "training":trainings[trainingJt]};
                    nextPos++;
                }
              }

              callback(listOfTrainingForThisDay)
            }

            $scope.displayWeekCalendar = function() {

                $scope.displayYear = selectedYear;
                $scope.displayWeek = selectedWeek;
                $scope.displayMonth = calMonths[selectedMonth];
                $scope.displayDate = selectedDate;

                $scope.weekDays = [];
                $scope.weekDaysEvents = [ [],[],[],[],[],[],[] ];

                dayOfWeek = moment().week(selectedWeek).year(selectedYear).isoWeekday(1);
                dayOfWeek.startOf('isoweek');
                for(dayIt=0;dayIt<7;dayIt++)
                {
                  fullDate = dayOfWeek;
                  dayString = fullDate.format('ddd');
                  date = fullDate.format('Do');
                  $scope.weekDays[dayIt] = {date,dayString};
                  realDate = fullDate.toDate();
                  dayEvents = [];
                  nextPos = 0;
                  var trainingsForThisDay;
                  $scope.getDayTraining( realDate, function(data){
                    trainingsForThisDay = data
                  })
                  if( trainingsForThisDay.length ){
                    $scope.weekDaysEvents [dayIt] = trainingsForThisDay;
                  }
                  else{
                      $scope.weekDaysEvents [dayIt][0] = {"month":fullDate.month(), "img" : "" ,"duration":"","date":fullDate.format('DD'),"id":""};
                  }
                  fullDate = dayOfWeek.add( 1, 'd' );

                  /*
                   $scope.weekDaysEvents [dayIt][1] = {"type":"currentMonth","date":'a'};
                  $scope.weekDaysEvents [dayIt][1] = {"type":"currentMonth","date":'a'};
                  $scope.weekDaysEvents [dayIt][2] = {"type":"currentMonth","date":'c'};
                  */
                }

            }

            $scope.changeTrainingDisplay = function() {
              if ( $scope.UICalendarDisplay.Week ){
                $scope.UIdisplayWeekToDate();
              }
              else {
                $scope.UIdisplayDateToWeek();
              }
            }


  })

  .controller('FormCtrl', function ($scope, $stateParams, $ionicPopup, $state, CompetitionDataService,$ionicHistory) {
    $scope.$on('$ionicView.enter', function(e) {
      initForm()
    })

    function initForm(){


      CompetitionDataService.getAllSports(function(dataSports){
        $scope.sportList = dataSports;
        $scope.sportType = dataSports[0];
        if ( $scope.competitionForm ){
          $scope.competitionForm.title = dataSports[0].name;
        }

        CompetitionDataService.getSportImgUrl(dataSports[0].id, function(imgUrl){
          $scope.competitionForm.imgUrl  = imgUrl.logoURL
        })

      })


      if($stateParams.id){
        CompetitionDataService.getById($stateParams.id, function(item){
          $scope.competitionForm = item;
          $scope.sportType = $scope.sportList[item.sport_id-1];
          $scope.competitionForm.myDate = new Date(item.activityDate);
        })
      } else {
        $scope.competitionForm = {};
        $scope.competitionForm.myDate = new Date();
        $scope.competitionForm.sport_id = 1;
      }
    }


    $scope.sportChange = function(item) {
      console.log("Sport is :", item.id);
      $scope.competitionForm.sport_id = item.id;
      $scope.competitionForm.title = item.name;
      CompetitionDataService.getSportImgUrl(item.id, function(imgUrl){
        $scope.competitionForm.imgUrl  = imgUrl.logoURL
      })
    }

    function onSaveSuccess(){
      $ionicHistory.goBack();
    }
    $scope.saveCompetition = function(){

      if(!$scope.competitionForm.id){
        CompetitionDataService.createCompetition($scope.competitionForm).then(onSaveSuccess)
      } else {
        CompetitionDataService.updateCompetition($scope.competitionForm).then(onSaveSuccess)
      }
    }

    $scope.getCompetitionDate = function(idCompetition){
        return NotesDataService.getDate(idNote);
    }

    $scope.confirmDelete = function(idCompetition) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Remove a competition',
        template: 'Are you sure you want to remove this event ?'
      })

      confirmPopup.then(function(res) {
        if(res) {
          CompetitionDataService.deleteCompetition(idCompetition).then(onSaveSuccess)
        }
      })
    }

  })


  .controller('TrainingFormCtrl', function ($scope, $stateParams, $ionicPopup, $state, CompetitionDataService, $ionicHistory) {
    $scope.$on('$ionicView.enter', function(e) {
      initForm();
    })

    function initForm(){

      CompetitionDataService.getAllSports(function(dataSports){
        $scope.sportList = dataSports;
        $scope.isInPlan = false;

        if($stateParams.id){
          CompetitionDataService.getTrainingById($stateParams.id, function(item){
            $scope.trainingForm = item;
            $scope.sportType = $scope.sportList[item.sport_id-1];
            $scope.trainingForm.date = new Date(item.trainingDate); //TODO: reprendre la gestion des dates

            if( $scope.sportList[item.sport_id-1].isTimeAvailable == "true" ){
              $scope.trainingForm.disableDuration = false;
            }
            else {
              $scope.trainingForm.disableDuration = true;
            }

            if( $scope.sportList[item.sport_id-1].isDistanceAvailable == "true" ){
              $scope.trainingForm.disableDistance= false;
            }
            else {
              $scope.trainingForm.disableDistance = true;
            }

            $scope.trainingForm.maxDistance   = $scope.sportList[item.sport_id-1].maxDistance;
            $scope.trainingForm.stepDistance  = $scope.sportList[item.sport_id-1].stepDistance;
            $scope.trainingForm.maxTime       = $scope.sportList[item.sport_id-1].maxTime;
            $scope.trainingForm.stepTime      = $scope.sportList[item.sport_id-1].stepTime;
            //$scope.trainingForm.distance      = $scope.trainingForm.maxDistance/2 ;
            //$scope.trainingForm.duration      = $scope.trainingForm.maxTime/2;
                  $scope.show = true; //by pass, pour pas que l'affichage blink
          })

        } else if( $stateParams.training ){
          $scope.trainingForm = $stateParams.training;
          $scope.show = true; //by pass, pour pas que l'affichage blink
          $scope.isInPlan = true;
          $scope.sportType = $scope.sportList[$stateParams.training.sport_id-1];



        }
        else {
          $scope.trainingForm = {};
          if($stateParams.date){
            $scope.trainingForm.date = $stateParams.date;
          }
          else{
            $scope.trainingForm.date = new Date();
          }

          $scope.trainingForm.date.setHours(12,0,0); //avoid potential issues with local time when hours is 00.00


          $scope.sportType = dataSports[0];
          $scope.sportChange( dataSports[0], true );
          $scope.trainingForm.content="";
          $scope.trainingForm.repeat=false;
          $scope.show = true; //by pass, pour pas que l'affichage blink
        }
      })
    }

    $scope.sportChange = function(item, bUpdateTitle) {
      console.log("Sport is :", item.id);
      $scope.trainingForm.sport_id = item.id;
      if( bUpdateTitle === true ){
        $scope.trainingForm.title = item.name;
      }
      CompetitionDataService.getSportImgUrl(item.id, function(imgUrl){
        $scope.trainingForm.imgUrl  = imgUrl.logoURL
      })

      if( item.isTimeAvailable === "true" ){
        $scope.trainingForm.disableDuration = false;
      }
      else {
        $scope.trainingForm.disableDuration = true;
      }

      if( item.isDistanceAvailable === "true" ){
        $scope.trainingForm.disableDistance= false;
      }
      else {
        $scope.trainingForm.disableDistance = true;
      }

      $scope.trainingForm.maxDistance   = item.maxDistance;
      $scope.trainingForm.stepDistance  = item.stepDistance;
      $scope.trainingForm.maxTime       = item.maxTime;
      $scope.trainingForm.stepTime      = item.stepTime;
      $scope.trainingForm.distance      = $scope.trainingForm.maxDistance/2 ;
      if( bUpdateTitle === true ){
        $scope.trainingForm.duration      = $scope.trainingForm.maxTime/2;
      }
    }

    function onSaveSuccess(){
      //$state.go('list')
      $ionicHistory.goBack();
    }
    $scope.saveTraining = function(){


      if( !$scope.isInPlan ){ //do not update db when creating a training for a plan
        if(!$scope.trainingForm.id){
            CompetitionDataService.createTraining($scope.trainingForm, function (trainingId){
              CompetitionDataService.addTrainingNotification($scope.trainingForm, trainingId);
          });
        } else {
          CompetitionDataService.updateTraining($scope.trainingForm)
        }
      }

      if($scope.trainingForm.repeat==true){
          var confirmPopup = $ionicPopup.confirm({
            title: 'Repeat training',
            template: 'Are you sure you want to repeat this event all weeks?'//,
          //  okType: "my-alertOkType",

          })

          confirmPopup.then(function(res) {
            if(res) {
              //only update for next 6 monthes
              for(it=1;it<26;it++){
                var nextTraining = $scope.trainingForm;
                var nextDate = moment($scope.trainingForm.date).add(1,'w');
                nextTraining.date = nextDate.toDate();
                CompetitionDataService.createTraining(nextTraining , function (trainingId){
                  CompetitionDataService.addTrainingNotification(nextTraining, trainingId);
                });
              }
            }
          })
      }

      onSaveSuccess();

    }


    $scope.hideKeyBoard = function( e ) {
      if( cordova.plugins.Keyboard && e.key=="Enter"){
        cordova.plugins.Keyboard.close();
      }
    }


    $scope.confirmDelete = function(idTraining) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Remove a training',
        template: 'Are you sure you want to remove this event ?'
      })

      confirmPopup.then(function(res) {
        if(res) {
          CompetitionDataService.deleteTrainingNotification($scope.trainingForm);
          CompetitionDataService.deleteTraining(idTraining).then(onSaveSuccess)
        }
      })
    }

  })
