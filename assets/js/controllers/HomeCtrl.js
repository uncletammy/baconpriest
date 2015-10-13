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

angular
.module('baconpriest')
.controller('HomeCtrl', [
	'$scope', '$rootScope', '$state', '$timeout',
function($scope, $rootScope, $state, $timeout) {

  $rootScope.appReady.then(function onReady(){
	$scope.thing = "biggcatontelevision";
	$scope.allGames = $rootScope.allGames;

	window.buttgames = $rootScope.allGames;

  });

	$scope.intent = angular.extend($scope.intent||{}, {

	});

}]);
