var spawn = require('child_process').spawn;
var fs = require('fs');
var async = require('async');
var _= require('lodash');

module.exports = function(){

	var gameService = {};


	var extendGameService = function() {

		var syncGames = function(){
			console.log('Syncing games');

			async.auto({
				'deleteRecords': [function(next,results){
					Game
					.destroy()
					.exec(function(err,deadGames){
						console.log('deleted',err,deadGames);
						return next(err,deadGames);
					});
				}],
				'readGames': ['deleteRecords',function(next,results){
					fs.readdir(sails.config.mame.romdir, function(err,files){
						if (err){
							console.log('Error reading dir:',err);						
						}

						console.log('Got games:',files);
						return next(err,files);
					});
				}],
				'makeRecords': ['readGames',function(next,results){

					var creates = [];

					_.each(results.readGames,function(oneGame){

						var splitName=oneGame.split('.');

						var createThis = {
							// Chop off the file extension
							name: splitName.slice(0,splitName.length-1).join('.'),
							filename: oneGame
						};

						creates.push(createThis);

					});

					var createResults = {
						success:[],
						fail:[]
					};

					async.eachSeries(creates,function(oneGame,go){
						Game
						.create(oneGame)
						.exec(function(err,created){
							if (err){
								createResults.fail.push(oneGame);
							}
							else {
								createResults.success.push(created);
							}
							return go();
						});
					},function allDone(err){
						if (err){
							return next(err);
						}
						return next(null,createResults);
					});

				}]
			},function(err,results){
				if (err){
					console.log('Error!',err);
					return;
				}

				else {
					return;
				}

			});

		};
		var syncGamesInterval = setInterval(syncGames,10000);


		var launchChrome = function(){

			console.log('Launching Chrome!');

			var ls = spawn('chromium', ['--app=http://localhost:1337','--start-fullscreen']);
			ls.stderr.setEncoding('utf8');

			ls.stderr.on('data', function(data) {
				console.log('stderr:',data);
			});

			ls.on('exit', function(code) {
				console.log('child process exited with code ' + code);
			});
			// ls.kill()


			// chromium --app=http://www.google.com --start-fullscreen
		};

		var launchChromeTimeout = setTimeout(launchChrome,15000);


		var launchGame = function(gameObject,callback){

			console.log('Launching mame with game:',gameObject.name);

			var ls = spawn('mame', [''+gameObject.name]);
			ls.stderr.setEncoding('utf8');

			ls.stderr.on('data', function(data) {
				console.log('stderr:',data);
			});

			ls.on('exit', function(code) {
				console.log('child process exited with code ' + code);
			});
			// ls.kill()

			return callback(null,ls);

			// chromium --app=http://www.google.com --start-fullscreen
		};

		_.extend(gameService,{
			sync: syncGames,
			syncGamesInterval: syncGamesInterval,
			launch: launchGame
		});

	}

	sails.on('hook:orm:loaded', extendGameService);

	return gameService;

}();