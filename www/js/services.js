angular.module('starter.services', ['ngCordova'])
  .factory('CompetitionDataService', function ($cordovaSQLite, $ionicPlatform, $cordovaLocalNotification) {
    var db, dbName = "competition109.db", trainingsCache, buildTrainingCache = true, sportsCache, buildSportCache = true, competitionsCache, buildCompetitionCache = true

    function useWebSql() {
      db = window.openDatabase(dbName, "1.0", "Note database", 200000)
      console.info('Using webSql')
    }

    function useSqlLite() {
      db = $cordovaSQLite.openDB({name: dbName, location : 1})
      console.info('Using SQLITE')
    }

    function initSportDB() {
            console.info('initSportDB')
      $cordovaSQLite.execute(db, 'INSERT INTO T_SPORT ( name, isDistanceAvailable, isTimeAvailable, isOccurenceAvailable, logoURL, maxDistance, stepDistance, maxTime, stepTime ) VALUES( "Course à pied" , "false" , "true" , "false", "img/run.svg", 40000, 2, 120, 5 )');
      $cordovaSQLite.execute(db, 'INSERT INTO T_SPORT ( name, isDistanceAvailable, isTimeAvailable, isOccurenceAvailable, logoURL, maxDistance, stepDistance, maxTime, stepTime ) VALUES( "Cyclisme" , "false" , "true" , "false" , "img/bike.svg", 100000, 10, 360, 15 )');
      $cordovaSQLite.execute(db, 'INSERT INTO T_SPORT ( name, isDistanceAvailable, isTimeAvailable, isOccurenceAvailable, logoURL, maxDistance, stepDistance, maxTime, stepTime ) VALUES( "Natation" , "true" , "false", "false" , "img/swim.svg", 3000, 50, 60, 5 )');
      $cordovaSQLite.execute(db, 'INSERT INTO T_SPORT ( name, isDistanceAvailable, isTimeAvailable, isOccurenceAvailable, logoURL, maxDistance, stepDistance, maxTime, stepTime ) VALUES( "Tennis" , "false" , "true" , "false", "img/tennis.svg", 0, 0, 120, 10 )');
      $cordovaSQLite.execute(db, 'INSERT INTO T_SPORT ( name, isDistanceAvailable, isTimeAvailable, isOccurenceAvailable, logoURL, maxDistance, stepDistance, maxTime, stepTime ) VALUES( "Triathlon" , "false" , "true" , "false", "img/triathlon.svg", 0, 0, 180, 10 )');
      $cordovaSQLite.execute(db, 'INSERT INTO T_SPORT ( name, isDistanceAvailable, isTimeAvailable, isOccurenceAvailable, logoURL, maxDistance, stepDistance, maxTime, stepTime ) VALUES( "Crossfit" , "false" , "true" , "false", "img/muscu.svg", 0, 0, 120, 5 )');
    }

    function initDatabase(){
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS T_COMPETITION (id integer primary key, title, content, activityDate date, sport_id, imgUrl)')
        .then(function(res){
        }, onErrorQuery)


      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS T_SPORT (id integer primary key, name, isDistanceAvailable, isTimeAvailable, isOccurenceAvailable, logoURL, maxDistance, stepDistance, maxTime, stepTime, UNIQUE(name))')
        .then(function(res){
        }, onErrorQuery)



/*
$cordovaSQLite.execute(db, 'DELETE FROM T_SPORT WHERE id=1');
$cordovaSQLite.execute(db, 'DELETE FROM T_SPORT WHERE id=2');
$cordovaSQLite.execute(db, 'DELETE FROM T_SPORT WHERE id=3');
$cordovaSQLite.execute(db, 'DELETE FROM T_SPORT WHERE id=4');
$cordovaSQLite.execute(db, 'DELETE FROM T_SPORT WHERE id=5');
$cordovaSQLite.execute(db, 'DELETE FROM T_SPORT WHERE id=6');
*/
        initSportDB();


      /*  $cordovaSQLite.execute(db, 'DELETE FROM T_PLAN WHERE id=1');
        $cordovaSQLite.execute(db, 'DELETE FROM T_PLAN WHERE id=2');
        $cordovaSQLite.execute(db, 'DELETE FROM T_PLAN WHERE id=3');
        $cordovaSQLite.execute(db, 'DELETE FROM T_PLAN WHERE id=4');
        $cordovaSQLite.execute(db, 'DELETE FROM T_PLAN WHERE id=5');

        $cordovaSQLite.execute(db, 'DROP TABLE T_PLAN');
*/
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS T_PLAN (id integer primary key, name, sport_id, imgUrl, distance, occurence, weekDuration, file,  UNIQUE(file))')
          .then(function(res){
          }, onErrorQuery)


      //  $cordovaSQLite.execute(db, 'DROP TABLE T_TRAINING');
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS T_TRAINING (id integer primary key, sport_id, duration, distance, trainingDate date, imgUrl, title, content)')
        .then(function(res){
        }, onErrorQuery)
    }

    $ionicPlatform.ready(function () {
      if(window.cordova){
        useSqlLite()
      } else {
        useWebSql()
      }

      initDatabase()
    })

    function onErrorQuery(err){
      console.error(err)
    }

    return {

      //Competitions
      createCompetition: function (competition) {
        buildCompetitionCache = true;
        return $cordovaSQLite.execute(db, 'INSERT INTO T_COMPETITION (title, content, activityDate, sport_id, imgUrl) VALUES(?, ?, ?, ?, ?)', [competition.title, competition.content, competition.myDate.toISOString(), competition.sport_id, competition.imgUrl ])
        .then(function(res){
        }, onErrorQuery)
      },

      updateCompetition: function(competition){

        return $cordovaSQLite.execute(db, 'UPDATE T_COMPETITION set title = ?, content = ?, activityDate = ?, sport_id = ?, imgUrl = ? where id = ?', [competition.title, competition.content, competition.myDate.toISOString(), competition.sport_id, competition.imgUrl, competition.id ])
        .then(function(res){
        }, onErrorQuery)
      },

      getSportImgUrl: function(id, callback){
        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, 'SELECT logoURL FROM T_SPORT where id = ?', [id]).then(function (results) {
            var res = results.rows.item(0);
            callback(res);
          })
        })
      },
      getSportById: function(id, callback){
        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, 'SELECT * FROM T_SPORT where id = ?', [id]).then(function (results) {
            var res = results.rows.item(0);
            callback(res);
          })
        })
      },
      /*
      getSportImgUrl: function(sport_id, callback){
        var imgURL="img/run.svg";
                $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db, 'SELECT * FROM T_COMPETITION ORDER BY activityDate').then(function (results) {
          var data = []

          for (i = 0, max = results.rows.length; i < max; i++) {
            data.push(results.rowdatedatedates.item(i))
          }
          //imgURL = data[0];
          callback(imgURL);
          }, onErrorQuery)
        })

          $cordovaSQLite.execute(db, 'SELECT * FROM T_COMPETITION ORDER BY activityDate').then(function (results) {
            var data = []

            for (i = 0, max = results.rows.length; i < max; i++) {
              data.push(results.rows.item(i))
            }

            callback(data)
          }, onErrorQuery)
        },
*/
      getAll: function(callback){
          $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, 'SELECT * FROM T_COMPETITION ORDER BY activityDate').then(function (results) {
              var data = []

              for (i = 0, max = results.rows.length; i < max; i++) {
                data.push(results.rows.item(i))
              }
              callback(data)
            }, onErrorQuery)
          })

      },
      getNext3Competitions: function(callback){
        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, 'SELECT * FROM T_COMPETITION WHERE DATE(activityDate) >= DATE("now") ORDER BY DATE(activityDate) LIMIT 3').then(function (results) {
            var data = []

            for (i = 0, max = results.rows.length; i < max; i++) {
              data.push(results.rows.item(i))
            }
            callback(data)
          }, onErrorQuery)
        })
      },
      getFutureCompetitions: function(callback){
        if( 'undefined'==competitionsCache ||  true==buildCompetitionCache ){
          $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, 'SELECT * FROM T_COMPETITION WHERE DATE(activityDate) >= DATE("now") ORDER BY DATE(activityDate) ').then(function (results) {
              var data = []

              for (i = 0, max = results.rows.length; i < max; i++) {
                data.push(results.rows.item(i))
              }
              competitionsCache = data;
              buildCompetitionCache = false;
              callback(data)
            }, onErrorQuery)
          })
        }
        else{
          callback( competitionsCache );
        }
      },
      getCompetitionsFromDate: function(_date, callback){
        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, 'SELECT * FROM T_COMPETITION WHERE DATE(activityDate) >= DATE(?) ORDER BY DATE(activityDate) ', [_date.toISOString()]).then(function (results) {
            var data = []

            for (i = 0, max = results.rows.length; i < max; i++) {
              data.push(results.rows.item(i))
            }

            callback(data)
          }, onErrorQuery)
        })
      },
      getDate: function(id){
          return $cordovaSQLite.execute(db, 'SELECT activityDate FROM T_COMPETITION where id = ?', [id])
      },

      deleteCompetition: function(id){
        buildCompetitionCache = true;
        return $cordovaSQLite.execute(db, 'DELETE FROM T_COMPETITION where id = ?', [id])
      },

      getById: function(id, callback){
        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, 'SELECT * FROM T_COMPETITION where id = ?', [id]).then(function (results) {
            callback(results.rows.item(0))
          })
        })
      },

      //TRainings
      createTraining: function (training, callback ) {
      console.info('create training')
      buildTrainingCache = true;
        $cordovaSQLite.execute(db, 'INSERT INTO T_TRAINING (sport_id, duration, distance, trainingDate, imgUrl, title, content) VALUES( ? , ? , ? , ? , ? , ?, ?)', [training.sport_id, training.duration, training.distance,training.date.toISOString(),training.imgUrl, training.title, training.content]).then(function(res){
          callback( res.insertId, training );
        }, onErrorQuery)

      },
      updateTraining: function(training){
        buildTrainingCache = true;
        return $cordovaSQLite.execute(db, 'UPDATE T_TRAINING set sport_id = ?, duration = ?, distance = ?, trainingDate = ?, imgUrl = ?, title = ?, content = ? where id = ?', [training.sport_id, training.duration, training.distance, training.date.toISOString(), training.imgUrl, training.title, training.content, training.id])
      },
      getAllTrainings: function(callback){
        if( true==buildTrainingCache || 'undefined'== trainingsCache){
          $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, 'SELECT * FROM T_TRAINING ORDER BY trainingDate').then(function (results) {
              var trainingData = []

              for (i = 0, max = results.rows.length; i < max; i++) {
                trainingData.push(results.rows.item(i))
              }

              var trainingMap = new Map();
              for(trainingIt=0;trainingIt<trainingData.length;trainingIt++)
              {
                var key = new Date(trainingData[trainingIt].trainingDate).toLocaleDateString();
                var value = trainingMap.get( key ) ;
                if( value ){
                  value.push( trainingData[trainingIt] );
                }else{
                  value = [ trainingData[trainingIt] ];
                }
                trainingMap.set( key, value );
              }

              buildTrainingCache = false;
              trainingsCache = trainingMap;
              callback(trainingMap)
            }, onErrorQuery)
          })
        }
        else{
          callback( trainingsCache )
        }
      },
      getNext3Trainings: function(callback){
        $ionicPlatform.ready(function () {
          //< '2013-01-01 00:00:00'
          $cordovaSQLite.execute(db, 'SELECT * FROM T_TRAINING WHERE DATE(trainingDate,"localtime")>=DATE("now") ORDER BY DATE(trainingDate) asc LIMIT 3').then(function (results) {
            var trainingData = []

            for (i = 0, max = results.rows.length; i < max; i++) {
              trainingData.push(results.rows.item(i))
            }

            callback(trainingData)
          }, onErrorQuery)
        })
      },

      getTrainingDate: function(id){
          return $cordovaSQLite.execute(db, 'SELECT activityDate FROM T_TRAINING where id = ?', [id])
      },
      getTrainingsByDate: function(callback){
        if( true==buildTrainingCache || 'undefined'== trainingsCache){
          $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, 'SELECT * FROM T_TRAINING').then(function (results) {
              var trainingData = []

              for (i = 0, max = results.rows.length; i < max; i++) {
                trainingData.push(results.rows.item(i))
              }
              trainingCache = trainingData;
              buildTrainingCache = false;
              callback(trainingData)
            }, onErrorQuery)
            })
          }
          else{
            callback(trainingsCache)
          }
      },

      deleteTraining: function(id){
        buildTrainingCache = true;
        return $cordovaSQLite.execute(db, 'DELETE FROM T_TRAINING where id = ?', [id])
      },

      getTrainingById: function(id, callback){
        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, 'SELECT * FROM T_TRAINING where id = ?', [id]).then(function (results) {
            callback(results.rows.item(0))
          })
        })
      },


      //sport
      getAllSports: function(callback){
        if( 'undefined'==sportsCache ||  true==buildSportCache ){
          $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, 'SELECT * FROM T_SPORT').then(function (results) {
              var sportData = []

              for (i = 0, max = results.rows.length; i < max; i++) {
                sportData.push(results.rows.item(i))
              }
              sportsCache = sportData;
              buildSportCache = false;
              callback(sportData)
            }, onErrorQuery)
          })
        }
        else{
          callback( sportsCache );
        }
      },

/**
* get all training plans for input sport
*
**/

      createPlan: function (plan, callback) {
      console.info('create plan')

        $cordovaSQLite.execute(db, 'INSERT INTO T_PLAN ( name, sport_id, imgUrl, distance, occurence, weekDuration, file ) VALUES( ?, ? , ?, ?, ?, ?, ?)', [plan.name, plan.sport_id, plan.imgUrl, plan.distance, plan.occurence, plan.weekDuration, plan.file]).then(function(res){
          callback( res.insertId );
        }, onErrorQuery)

      },

      updatePlan: function (plan) {
      console.info('update plan')

        $cordovaSQLite.execute(db, 'UPDATE T_PLAN set name = ?, sport_id = ?, imgUrl = ?, distance = ?, occurence = ?, weekDuration = ?, file = ? where id = ?', [plan.name,plan.sport_id, plan.imgUrl, plan.distance, plan.occurence, plan.weekDuration, plan.file, plan.id]).then(function(res){
        }, onErrorQuery)

      },

      deletePlan: function (id) {
        console.info('delete plan')
        return $cordovaSQLite.execute(db, 'DELETE FROM T_PLAN where id = ?', [id]);
      },

      getAllPlans: function( callback ){
          $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, 'SELECT * FROM T_PLAN').then(function (results) {
              var sportPlan = []

              for (i = 0, max = results.rows.length; i < max; i++) {
                sportPlan.push( results.rows.item(i) )
              }
              callback(sportPlan)
            }, onErrorQuery)
          })
      },
      get3Plan: function(callback){
        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, 'SELECT * FROM T_PLAN LIMIT 3').then(function (results) {
            var data = []

            for (i = 0, max = results.rows.length; i < max; i++) {
              data.push(results.rows.item(i))
            }
            callback(data)
          }, onErrorQuery)
        })
      },
      getAvailablePlansDistances: function(_sportID, callback){
          $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, 'SELECT DISTINCT distance FROM T_PLAN where sport_id = ?', [_sportID]).then(function (results) {
              var sportPlan = []

              for (i = 0, max = results.rows.length; i < max; i++) {
                sportPlan.push( results.rows.item(i).distance )
              }
              callback(sportPlan)
            }, onErrorQuery)
          })
      },
      getAvailablePlansSports: function(callback){
          $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, 'SELECT DISTINCT * FROM T_SPORT WHERE id IN ( SELECT DISTINCT sport_id FROM T_PLAN ) ').then(function (results) {

            //$cordovaSQLite.execute(db, 'SELECT DISTINCT sport_id FROM T_PLAN').then(function (results) {
              var sports = []

              for (i = 0, max = results.rows.length; i < max; i++) {
                sports.push( results.rows.item(i) )
              }
              callback(sports)
            }, onErrorQuery)
          })
      },
      getAvailableOccurences: function(_sportID, _distance, callback){
          $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, 'SELECT DISTINCT occurence FROM T_PLAN where sport_id = ? and distance= ?', [_sportID, _distance]).then(function (results) {
              var occ = []

              for (i = 0, max = results.rows.length; i < max; i++) {
                occ.push(results.rows.item(i).occurence)
              }
              callback(occ)
            }, onErrorQuery)
          })
      },
      getAvailableDuration: function(_sportID, _distance, _occurence, callback){
          $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, 'SELECT DISTINCT weekDuration FROM T_PLAN where sport_id = ? and distance = ? and occurence = ?', [_sportID, _distance, _occurence]).then(function (results) {
              var dur = []

              for (i = 0, max = results.rows.length; i < max; i++) {
                dur.push(results.rows.item(i).weekDuration)
              }
              callback(dur)
            }, onErrorQuery)
          })
      },
      getPlanPath: function(_sportID, _distance, _occurence, _weekDuration, callback){
          $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, 'SELECT DISTINCT file FROM T_PLAN where sport_id = ? and distance= ? and occurence= ? and weekDuration = ?', [_sportID, _distance, _occurence, _weekDuration]).then(function (results) {
              var occ = []

              for (i = 0, max = results.rows.length; i < max; i++) {
                occ.push(results.rows.item(i).file)
              }
              callback(occ)
            }, onErrorQuery)
          })
      },
      getAvailablePlan: function( _planId, callback){
          $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, 'SELECT* FROM T_PLAN where id = ?', [_planId]).then(function (results) {
              var sportPlan = []

              for (i = 0, max = results.rows.length; i < max; i++) {
                sportPlan.push( results.rows.item(i) )
              }
              callback(sportPlan)
            }, onErrorQuery)
          })
      },

      addTrainingNotification: function( training ) {
        var notifDate = moment( training.date );
        var today = moment();
        notifDate.add( -1, 'd');
        notifDate.set({hour:21,minute:00,second:0,millisecond:0})

        var alarmTime = notifDate.toDate();
        $ionicPlatform.ready(function() {
          if( window.cordova && window.cordova.plugins.notification && notifDate > today){
            var notifID = training.date.getTime();

            $cordovaLocalNotification.isScheduled(notifID).then(function(isScheduled) {
          //  alert("Notification " + training.date.toISOString() + " Scheduled: " + isScheduled);
              if( isScheduled != true ){
                console.log("The notification not scheduled yet");
                jsonData = [];
                jsonData.push( { "trainingId": training.id , "trainingName" : training.title , "trainingDuration" : training.duration } );

                $cordovaLocalNotification.schedule({
                    id: notifID,
                    firstAt: alarmTime,
                    text: "Tomorrow : " + training.title + " " + training.duration + " min",
                    title: "My sport planner",
                    autoCancel: true,
                    //icon: 'res://drawable-hdpi/icon.png',
                    smallIcon: 'res://drawable-hdpi/icon.png',
                    sound: null,
                    data: jsonData
                }).then(function ( res ) {
                  //  alert("addTrainingNotification ok");
                    console.log("The notification has been set : " + res);
                });
              }else {
                //@todo find a way to update training
                /*
                console.log("The notification is already scheduled => update it");
                //Bypass because getScheduled( notifID ); doesn't return anything, then get all scheduled and find current one
                 $cordovaLocalNotification.get( notifID ).then(
                   function( res ) {
                    var jsonData = [];
                    jsonData= res.data;

                    newText = "Tommorow : " ;
                    varthis = this;

                    var found = false;
                    for(jt=0;jt<jsonData.length;jt++){
                      if( jsonData[jt].trainingId == training.id ){
                        jsonData[jt] = { "trainingId" : training.id ,"trainingName" : training.title , "trainingDuration" : training.duration };
                        found = true;
                      }
                    }

                    if( !found ){
                      jsonData.push( { "trainingId" : training.id ,"trainingName" : training.title , "trainingDuration" : training.duration } );
                    }
                    var it = 0;
                    for(var key in jsonData)
                    {
                      if( it> 0 ){
                        newText += ", "
                      }
                      var jsonTraining = jsonData[key];
                      newText = newText + jsonTraining["trainingName"] + " " + jsonTraining["trainingDuration"] + " min"
                      it++;
                    }

                    $cordovaLocalNotification.update({
                      id: notifID,
                      text: newText,
                      data: jsonData
                    })
                    console.log("notification has been updated");


                    //  alert("addTrainingNotification notification already exist");
                })
                */
          }
        })
      }
    })
      },

      deleteTrainingNotification: function( training ) {
        $ionicPlatform.ready(function() {
          if( window.cordova && window.cordova.plugins.notification ){
            var notifID = training.date.getTime();


            $cordovaLocalNotification.isScheduled(notifID).then(function(isScheduled) {
          //  alert("Notification " + training.date.toISOString() + " Scheduled: " + isScheduled);
              if( isScheduled == true ){
                console.log("The notification has been found => delete it");
                //Bypass because getScheduled( notifID ); doesn't return anything, then get all scheduled and find current one
                $cordovaLocalNotification.get( notifID ).then(
                  function( res ) {

                   var jsonData = [];
                   /*
                   for (var i = 0;i<res.length;i++) {
                     notif = res[i];
                     if (notif.id == notifID ) {
                       jsonData = JSON.parse(notif.data) ;
                       break;
                     }
                   }
                   */
                   /*
                jsonData = res.data ;
                newText = "Tommorow : " ;

                if(jsonData.length > 1)
                {

                  var pos = 0;
                  for(jt=0;jt<jsonData.length;jt++){
                    if( jsonData[jt].trainingId == training.id ){
                      pos = jt;
                    }
                  }
                  jsonData.splice( jt );
                  var it = 0;
                  for(var key in jsonData)
                  {
                    if( it> 0 ){
                      newText += ", "
                    }
                    var jsonTraining = jsonData[key];
                    newText = newText + jsonTraining["trainingName"] + " " + jsonTraining["trainingDuration"] + " min"
                    it++;
                  }

                  $cordovaLocalNotification.update({
                    id: notifID,
                    text: newText,
                    data: jsonData
                  })
                  console.log("Exisiting notification has been updated");
                }
                else
                */
                {
                  $cordovaLocalNotification.cancel(notifID).then(function () {
                    //  alert("addTrainingNotification ok");
                      console.log("The notification has been deleted");
                  });
                }
              })


              }else {
                console.log("this notification doesn't exist");
              //  alert("addTrainingNotification notification already exist");
              }
            })
          }
        })
      }

    }
  })
