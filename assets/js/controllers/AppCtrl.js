angular.module('baconpriest')
.controller('AppCtrl', [
        '$scope', '$rootScope', '$state', '$q','uiGames',
function($scope, $rootScope, $state, $q, uiGames) {

  $scope.allGames = [];
  $rootScope.allGames = [];
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

    viewReady.resolve();

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
