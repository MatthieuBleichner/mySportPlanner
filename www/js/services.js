angular.module('starter.services', ['ngCordova'])
  .factory('CompetitionDataService', function ($cordovaSQLite, $ionicPlatform) {
    var db, dbName = "competition107.db", trainingsCache, buildTrainingCache = true, sportsCache, buildSportCache = true, competitionsCache, buildCompetitionCache = true

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
      $cordovaSQLite.execute(db, 'INSERT INTO T_SPORT ( name, isDistanceAvailable, isTimeAvailable, isOccurenceAvailable, logoURL, maxDistance, stepDistance, maxTime, stepTime ) VALUES( "running" , "true" , "true" , "false", "img/run.svg", 40, 2, 120, 5 )');
      $cordovaSQLite.execute(db, 'INSERT INTO T_SPORT ( name, isDistanceAvailable, isTimeAvailable, isOccurenceAvailable, logoURL, maxDistance, stepDistance, maxTime, stepTime ) VALUES( "cycling" , "true" , "true" , "false" , "img/bike.svg", 100, 10, 360, 15 )');
      $cordovaSQLite.execute(db, 'INSERT INTO T_SPORT ( name, isDistanceAvailable, isTimeAvailable, isOccurenceAvailable, logoURL, maxDistance, stepDistance, maxTime, stepTime ) VALUES( "swimming" , "true" , "true", "false" , "img/swim.svg", 6, 0.2, 60, 5 )');
      $cordovaSQLite.execute(db, 'INSERT INTO T_SPORT ( name, isDistanceAvailable, isTimeAvailable, isOccurenceAvailable, logoURL, maxDistance, stepDistance, maxTime, stepTime ) VALUES( "tennis" , "false" , "true" , "false", "img/tennis.svg", 0, 0, 120, 10 )');
      $cordovaSQLite.execute(db, 'INSERT INTO T_SPORT ( name, isDistanceAvailable, isTimeAvailable, isOccurenceAvailable, logoURL, maxDistance, stepDistance, maxTime, stepTime ) VALUES( "triathlon" , "false" , "false" , "false", "img/triathlon.svg", 0, 0, 0, 0 )');
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

      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS T_TRAINING (id integer primary key, sport_id, duration, distance, trainingDate date, imgUrl, title)')
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
      createTraining: function (training) {
      console.info('create training')
      buildTrainingCache = true;
        return $cordovaSQLite.execute(db, 'INSERT INTO T_TRAINING (sport_id, duration, distance, trainingDate, imgUrl, title) VALUES( ? , ? , ? , ? , ? , ?)', [training.sport_id, training.duration, training.distance,training.date.toISOString(),training.imgUrl, training.title]).then(function(res){
        }, onErrorQuery)
      },
      updateTraining: function(training){
        return $cordovaSQLite.execute(db, 'UPDATE T_TRAINING set sport_id = ?, duration = ?, distance = ?, trainingDate = ?, imgUrl = ?, title = ? where id = ?', [training.sport_id, training.duration, training.distance, training.date, training.imgUrl, training.title, training.id])
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
                var key = new Date(trainingData[trainingIt].trainingDate).getTime();
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
          $cordovaSQLite.execute(db, 'SELECT * FROM T_TRAINING WHERE DATE(trainingDate)>=DATE("now") ORDER BY DATE(trainingDate) asc LIMIT 3').then(function (results) {
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



    }
  })
