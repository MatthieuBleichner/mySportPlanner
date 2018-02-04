angular.module('starter.controllers', ['ngCordova','papa-promise'])


  .controller('ListCtrl', function ($scope,$ionicPlatform, $state, CompetitionDataService, $ionicPopup) {
    $scope.$on('$ionicView.enter', function(e) {
        CompetitionDataService.getNext3Competitions(function(data){
          $scope.itemsList = data
        })
        CompetitionDataService.getNext3Trainings(function(dataTrainings){
          $scope.trainingList = dataTrainings
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

    $scope.importMarathon = function(){

      var filePath = "trainingPlan/marathon.csv";
      var date = new Date();
      var startWeek = moment(date).week();
      initialDate = moment(date).isoWeekday(1);
      initialDate.startOf('isoweek');

          function handleParseResult(result) {
              var nbElem = result.data.length;
              //do not parse first line
              for(it=1;it<nbElem-1;it++){
                //Semaine,jour,titre,durée,extra comments
                //1,1,EF,45,footing de 45 minutes
                var csvItem = result.data[it];
                newTraining = {};
                newTraining.sport_id = 1; //suppose this is a running event
                newTraining.duration = csvItem[3];
                newTraining.distance = -1;

                eventDate = new moment(initialDate).isoWeekday(1);
                eventDate.add(7*(parseInt(csvItem[0])-1 ) + parseInt(csvItem[1])-1,'day');

                newTraining.date = eventDate.toDate();
                newTraining.imgUrl = "img/run.svg"
                newTraining.title = "S" + csvItem[0] + " - " + csvItem[2];
                newTraining.content = csvItem[4];

                CompetitionDataService.createTraining(newTraining);
                CompetitionDataService.addTrainingNotification(newTraining);
              }


          }

          function handleParseError(result) {
              // display error message to the user
          }

          function parsingFinished() {
              // whatever needs to be done after the parsing has finished
          }

      Papa.parse(filePath, {
        download: true,
        header:false,
        complete: function(results) {
          data = results;
        }
      }).then(handleParseResult)
      .catch(handleParseError)
            .finally(parsingFinished)
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

        } else {
          $scope.trainingForm = {};
          if($stateParams.date){
            $scope.trainingForm.date = $stateParams.date;
          }
          else{
            $scope.trainingForm.date = new Date();
          }

          $scope.sportType = dataSports[0];
          $scope.sportChange( dataSports[0] );
          $scope.trainingForm.content="";
          $scope.trainingForm.repeat=false;
          $scope.show = true; //by pass, pour pas que l'affichage blink
        }
      })
    }

    $scope.sportChange = function(item) {
      console.log("Sport is :", item.id);
      $scope.trainingForm.sport_id = item.id;
      $scope.trainingForm.title = item.name;
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
      $scope.trainingForm.duration      = $scope.trainingForm.maxTime/2;
    }

    function onSaveSuccess(){
      //$state.go('list')
      $ionicHistory.goBack();
    }
    $scope.saveTraining = function(){


      if(!$scope.trainingForm.id){
        CompetitionDataService.createTraining($scope.trainingForm);
        CompetitionDataService.addTrainingNotification($scope.trainingForm);
      } else {
        CompetitionDataService.updateTraining($scope.trainingForm)
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
                CompetitionDataService.createTraining(nextTraining);
                CompetitionDataService.addTrainingNotification(nextTraining);
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
