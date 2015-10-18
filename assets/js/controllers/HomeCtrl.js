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

window.gameInFront = function(someGame){
	console.log('someGame:',someGame);
	if (window.damnCarousel&&window.damnCarousel.items){
		return $($(window.damnCarousel.items[window.damnCarousel.nearestIndex()])[0].element).data()['gameid'] == someGame.id;	
	} else {
		return false;
	}
};

window.allGames;

angular
.module('baconpriest')
.controller('HomeCtrl', [
	'$scope', '$rootScope', '$state', '$timeout',
function($scope, $rootScope, $state, $timeout) {

	$scope.gameInFront = gameInFront;

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
