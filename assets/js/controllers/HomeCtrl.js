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
	'$scope', '$rootScope', '$state', '$timeout',
function($scope, $rootScope, $state, $timeout) {


	$scope.launchGame = window.launchGame;

	$rootScope.viewReady.then(function onReady(){
		$scope.allGames = $rootScope.allGames;
		window.allGames = $rootScope.allGames;
		setTimeout(function() {
			$("#carousel").Cloud9Carousel( {
			  buttonLeft: $("#buttons > .left"),
			  buttonRight: $("#buttons > .right"),
			  // autoPlay: 1,
			  bringToFront: true
			} );
		}, 300);
	});

	$scope.intent = angular.extend($scope.intent||{}, {

	});

}]);
