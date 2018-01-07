angular.module('starter.controllers', ['ngCordova','papa-promise'])


  .controller('ListCtrl', function ($scope,$ionicPlatform, $state, CompetitionDataService, $ionicModal, $ionicPopup) {
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


    $ionicModal.fromTemplateUrl('templates/trainingModalForm.html',
    {
      scope: $scope,
      animation: 'slide-in-up'
    }).then( function( modal ) {
      $scope.loginModal = modal;
      console.info('ok');
    });

    $scope.openModalTrainingWithData = function(trainingID) {
      $scope.loginModal.show();

      if(trainingID){
        CompetitionDataService.getTrainingById(trainingID, function(item){
          $scope.trainingForm = item
        })
      } else {
        $scope.trainingForm = {};
        $scope.trainingForm.date = new Date();
        $scope.trainingForm.date.setHours(9);
        $scope.trainingForm.date.setMinutes(30);
        $scope.trainingForm.date.setSeconds(0);
        currentDate.setMilliseconds(0);
        $scope.trainingForm.content="";
      }
    };


    $ionicModal.fromTemplateUrl('templates/competitionModalForm.html',
    {
      scope: $scope,
      animation: 'slide-in-up'
    }).then( function( modal ) {
      $scope.competitionModal = modal;
      console.info('ok');
    });

    $scope.openModalCompetitionWithData = function(competition) {
      console.info('openModalCompetitionWithData');
      $scope.competitionModal.show();

      $scope.sportType = 'triathlon';
      if(competition){
          $scope.competitionForm = competition;
          $scope.competitionForm.date = new Date(competition.activityDate);

          CompetitionDataService.getSportName($scope.competitionForm.sport_id, function(sportName){
            $scope.sportType = sportName.name
          })
      } else {
        $scope.competitionForm = {};
        $scope.competitionForm.date = new Date();
        $scope.competitionForm.content="";
      }

    };


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

    $scope.showKeyboard = function($event) {
      $scope.keyboardVisible = true;
    }

  })

  .controller('listCompetitionCtrl', function ($scope,$ionicPlatform, $state, CompetitionDataService, $ionicModal, $ionicPopup) {
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


    $ionicModal.fromTemplateUrl('templates/competitionModalForm.html',
    {
      scope: $scope,
      animation: 'slide-in-up'
    }).then( function( modal ) {
      $scope.competitionModal = modal;
      console.info('ok');
    });

    $scope.openModalCompetitionWithData = function(competition) {
      console.info('openModalCompetitionWithData');
      $scope.competitionModal.show();

      $scope.sportType = 'triathlon';
      if(competition){
          $scope.competitionForm = competition;
          $scope.competitionForm.date = new Date(competition.activityDate);

          CompetitionDataService.getSportName($scope.competitionForm.sport_id, function(sportName){
            $scope.sportType = sportName.name
          })
      } else {
        $scope.competitionForm = {};
        $scope.competitionForm.date = new Date();
        $scope.competitionForm.date.setHours(9);
        $scope.competitionForm.date.setMinutes(30);
        $scope.competitionForm.date.setSeconds(0);
        currentDate.setMilliseconds(0);
        $scope.competitionForm.content="";
      }

    };

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

  .controller('listTrainingCtrl', function ($scope,$ionicPlatform, $state, CompetitionDataService, $ionicModal, $ionicPopup, Papa, $cordovaFile) {
    $scope.$on('$ionicView.enter', function(e) {
        CompetitionDataService.getAllTrainings(function(data){
          $scope.trainingList = data
          $scope.displayWeekCalendar();
        })
        CompetitionDataService.getAllSports(function(dataSports){
          $scope.sportList = dataSports
        })


    })

    $scope.openTrainingList = function(){

      $state.go('listCompetition');
    }

    $scope.gotoEdit = function(idNote){
      $state.go('form', {id: idNote})
    }

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
                newTraining.date.setHours(9);
                newTraining.date.setMinutes(30);
                newTraining.date.setSeconds(0);
                newTraining.date.setMilliseconds(0);
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

    $ionicModal.fromTemplateUrl('templates/trainingModalForm.html',
    {
      scope: $scope,
      animation: 'slide-in-up'
    }).then( function( modal ) {
      $scope.loginModal = modal;
      console.info('ok');
    });

    $scope.openModalTrainingWithData = function(training) {
      console.info('openModalTrainingWithData');
      $scope.loginModal.show();

      $scope.sportType = $scope.sportList[0];
      if(training){
          $scope.trainingForm = training;
          $scope.trainingForm.date = new Date(training.trainingDate);

          CompetitionDataService.getSportName($scope.trainingForm.sport_id, function(sportName){
            $scope.sportType = sportName
          })
      } else {
        $scope.trainingForm = {};
        $scope.trainingForm.date = new Date();
        $scope.trainingForm.date.setHours(9);
        $scope.trainingForm.date.setMinutes(30);
        $scope.trainingForm.date.setSeconds(0);
        $scope.trainingForm.date.setMilliseconds(0);
        $scope.trainingForm.content="";
        $scope.trainingForm.distance=10;
        $scope.trainingForm.duration=60;
      }

    };

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
                    startDay = new Date(selectedYear, selectedMonth, 1).getDay();

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
              currentDate.setHours(9);
              currentDate.setMinutes(30);
              currentDate.setSeconds(0);
              currentDate.setMilliseconds(0);
              $scope.getDayTraining(currentDate, callback) ;
            }

            $scope.getDayTraining = function(currentDay, callback) {
              listOfTrainingForThisDay = [];
              nextPos = 0;

              trainings = $scope.trainingList.get( currentDay.getTime() );
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
                  realDate.setHours(9);
                  realDate.setMinutes(30);
                  realDate.setSeconds(0);
                  realDate.setMilliseconds(0);
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
                      $scope.weekDaysEvents [dayIt][0] = {"img" : "" ,"duration":"","date":fullDate.format('DD'),"id":""};
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
        $scope.competitionForm.myDate.setHours(9);
        $scope.competitionForm.myDate.setMinutes(30);
        $scope.competitionForm.myDate.setSeconds(0);
        $scope.competitionForm.myDate.setMilliseconds(0);
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
        $scope.sportType = dataSports[0];
        if( $scope.trainingForm ){
          $scope.trainingForm.title = dataSports[0].name;
          $scope.trainingForm.maxDistance   = dataSports[0].maxDistance;
          $scope.trainingForm.stepDistance  = dataSports[0].stepDistance;
          $scope.trainingForm.maxTime       = dataSports[0].maxTime;
          $scope.trainingForm.stepTime      = dataSports[0].stepTime;
          $scope.trainingForm.distance      = $scope.trainingForm.maxDistance/2 ;
          $scope.trainingForm.duration      = $scope.trainingForm.maxTime/2;
        }
        CompetitionDataService.getSportImgUrl(dataSports[0].id, function(imgUrl){
          $scope.trainingForm.imgUrl  = imgUrl.logoURL
        })

      })


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
        })

      } else {
        $scope.trainingForm = {};
        if($stateParams.date){
          $scope.trainingForm.date = $stateParams.date;
        }
        else{
          $scope.trainingForm.date = new Date();
        }

        $scope.trainingForm.date.setHours(9);
        $scope.trainingForm.date.setMinutes(30);
        $scope.trainingForm.date.setSeconds(0);
        $scope.trainingForm.date.setMilliseconds(0);

        $scope.trainingForm.content="";
        $scope.trainingForm.distance=10;
        $scope.trainingForm.duration=60;
        $scope.trainingForm.title = "running";
        $scope.trainingForm.sport_id = 1 ;
        $scope.trainingForm.disableDuration = false;
        $scope.trainingForm.disableDistance= false;
        $scope.trainingForm.maxDistance   = 60;
        $scope.trainingForm.stepDistance  = 1;
        $scope.trainingForm.maxTime       = 120;
        $scope.trainingForm.stepTime      = 10;
        $scope.trainingForm.conent      = "";
      }
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
        CompetitionDataService.createTraining($scope.trainingForm).then(onSaveSuccess)
      } else {
        CompetitionDataService.updateTraining($scope.trainingForm).then(onSaveSuccess)
      }
      CompetitionDataService.addTrainingNotification($scope.trainingForm);
    }






    $scope.confirmDelete = function(idTraining) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Remove a training',
        template: 'Are you sure you want to remove this event ?'
      })

      confirmPopup.then(function(res) {
        if(res) {
          CompetitionDataService.deleteTraining(idTraining).then(onSaveSuccess)
        }
      })
    }

  })


  .controller('trainingModalFormCtrl', function ($scope, $stateParams, $ionicPopup, $state, CompetitionDataService, $ionicTabsDelegate, $timeout) {
    $scope.$on('$ionicView.enter', function(e) {
      initForm()

    })

    function initForm(){
      if($stateParams.id){
        CompetitionDataService.getTrainingById($stateParams.id, function(item){
          $scope.trainingForm = item
        })
      } else {
        $scope.trainingForm = {};
        $scope.trainingForm.date = new Date();
      }
    }

    $scope.sportChange = function(item) {
      console.log("Sport is :", item.id);
      $scope.trainingForm.sport_id = item.id;
      $scope.trainingForm.title = item.name;
      CompetitionDataService.getSportImgUrl(item.id, function(imgUrl){
        $scope.trainingForm.imgUrl  = imgUrl.logoURL
      })
    }

    function onSaveSuccess(){
      $state.go('list');
    }

      $scope.saveTraining = function(){

        if(!$scope.trainingForm.id){
          CompetitionDataService.createTraining($scope.trainingForm).then(onSaveSuccess)
        } else {
          CompetitionDataService.updateTraining($scope.trainingForm).then(onSaveSuccess)
        }
      }
        $scope.closeModal = function() {
          $ionicTabsDelegate.select(0); //by pass pour avoir la premiere tab sélectionnée par defaut
          $scope.loginModal.hide();
        };

        $scope.saveModal = function() {
          $scope.saveTraining();
          $ionicTabsDelegate.select(0); //by pass pour avoir la premiere tab sélectionnée par defaut
          CompetitionDataService.getAllTrainings(function(data){
            $scope.itemsList = data
          })

          $scope.loginModal.hide();
          $state.reload();
        };
  })


  .controller('competitionModalFormCtrl', function ($scope, $stateParams, $ionicPopup, $state, CompetitionDataService, $ionicTabsDelegate, $timeout) {
    $scope.$on('$ionicView.enter', function(e) {
      $ionicTabsDelegate.select(1);
    })

    $scope.sportChange = function(item) {
      console.log("Sport is :", item.id);
      $scope.competitionForm.sport_id = item.id;
      CompetitionDataService.getSportImgUrl(item.id, function(imgUrl){
        $scope.competitionForm.imgUrl  = imgUrl.logoURL
      })

/*
      CompetitionDataService.getAll(function(data){
        $scope.itemsList = data
      })*/

        $timeout(function(){
        $ionicTabsDelegate.select(1);
      }, 700);

    }

    $scope.numbers = '';
    $scope.keyboardVisible = true;
  	$scope.keyboardSettings = {
  		action: function(number) {
        $scope.numbers += number
  		},
      leftButton: {
			html: '<i class="icon ion-backspace"></i>',
			action: function() {
				$scope.numbers = $scope.numbers.slice(0, -1);
			}
		},
		rightButton: {
			html: '<i class="icon ion-checkmark-circled"></i>',
			action: function() {
				// Submit stuff
        $scope.competitionForm.distance = $scope.number;
        $timeout(function(){
        $ionicTabsDelegate.select(2);
      }, 700);
			}
		}

  	}

    function onSaveSuccess(){
      $state.go('list');
    }

    $scope.saveCompetition = function(){

      if(!$scope.competitionForm.id){
        CompetitionDataService.createCompetition($scope.competitionForm)
      } else {
        CompetitionDataService.updateCompetition($scope.competitionForm)
      }

      $scope.competitionForm.activityDate = new Date( $scope.competitionForm.date )

      onSaveSuccess();

    }



    $scope.closeModal = function() {
      $ionicTabsDelegate.select(0); //by pass pour avoir la premiere tab sélectionnée par defaut
      $scope.competitionModal.hide();
    };

    $scope.saveModal = function() {
      $scope.saveCompetition();
      $ionicTabsDelegate.select(0); //by pass pour avoir la premiere tab sélectionnée par defaut
      CompetitionDataService.getAll(function(data){
        $scope.itemsList = data
      })

      $scope.competitionModal.hide();
      $state.reload();
    };



  })
