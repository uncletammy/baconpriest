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


	$scope.launchGame = function(someGame){
		someGame.launch(function(){
			console.log('Launched Game!',arguments);
		});
	};

	$rootScope.viewReady.then(function onReady(){
		$scope.thing = "biggcatontelevision";
		$scope.allGames = $rootScope.allGames;
	});

	$scope.intent = angular.extend($scope.intent||{}, {

	});

}]);
