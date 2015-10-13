angular.module('baconpriest')
.controller('AppCtrl', [
        '$scope', '$rootScope', '$state', '$q',
function($scope, $rootScope, $state, $q) {

  window.rootScope = $rootScope;

  $scope.allGames = $rootScope.allGames;
  $rootScope.allGames = [];
  $scope.allGames = [];

  // Create promise for app ready state
  var appReady = $q.defer();
  var viewReady = $q.defer();
  $rootScope.appReady = appReady.promise;
  $rootScope.viewReady = viewReady.promise;

  $rootScope.appReady.then(function onReady(){

  })
  .catch(function onError(err){

  })
  .finally(function eitherWay(){

      io.socket.get('/games',function(serverResponse){
        console.log('Got games:',serverResponse);
        _.each(serverResponse,function(oneGame){
          console.log('pushing:',oneGame.name);
          $scope.allGames.push(oneGame);
        });
        viewReady.resolve();
      });
  });

  appReady.resolve();

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // DOM Events
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    console.log('We goin\' somewhere or somethin')
  });

  $scope.intent = angular.extend($scope.intent||{}, {

  });

}]);