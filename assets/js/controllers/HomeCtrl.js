/**
* HomeCtrl
*
* @type {angular.controller}
* @module  baconpriest
* @description  The UI controller for the homepage
*
*               ## Primary responsibilities:
*               Homepage data handling
*
*/

window.launchGame = function(someGame){
  someGame.launch(function(){
    console.log('Launched Game!',arguments);
  });
};
window.allGames;

angular
.module('baconpriest')
.controller('HomeCtrl', [
  '$scope', '$rootScope', '$state', '$timeout', 'uiGames','uiManager',
function($scope, $rootScope, $state, $timeout, uiGames, uiManager) {


  $scope.getTags = function(someElement){
    return _.uniq(_.flatten(_.pluck(uiGames,'tags')));
  };

  $scope.getCategories = function(){
    return uiGames;
  };

  $scope.launchGame = window.launchGame;

  uiGames
  .fetch()
  .then(function(){
    console.log('Got Games now!');
    console.log(uiGames);

    uiManager
    .setup()
    .then(function(){
      console.log('Keypress events registered');
    });

  });


  // $rootScope.viewReady.then(function onReady(){


  // });

  $scope.intent = angular.extend($scope.intent||{}, {

  });

}]);
