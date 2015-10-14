var spawn = require('child_process').spawn;
var fs = require('fs');
var async = require('async');
var _= require('lodash');

var romDescriptions = require(process.cwd()+'/romDescriptions.js');

module.exports = function(){

	var gameService = {};

	var extendGameService = function() {

		var syncGames = function(){
			async.auto({
				'getLocal': [function(next,results){
					Game
					.find()
					.exec(function(err,allGames){
						return next(err,allGames);
					});
				}],
				'readGames': ['getLocal',function(next,results){
					var allRoms = [];

					async.each(sails.config.mame.romdirs,function(oneDir,go){
						try {
							fs.readdir(oneDir, function(err,files){
								if (err){
									console.log('Error reading dir:',err);						
									return go();
								}

								var mappedWithPath = _.compact(_.map(files,function(oneFile){
									return oneDir+'/'+oneFile;
								}));

								allRoms = allRoms.concat(mappedWithPath);
								return go();
							});
						}
						catch (openErr){
							console.log('Cant open ROM directory:',oneDir);
							return go();
						}
					},function allDone(err){
						return next(err,_.unique(allRoms));
					});
				}],
				'makeRecords': ['readGames',function(next,results){

					var creates = [];

					results.readGames = _.reject(results.readGames,function(oneGame){
						var grabGame = _.find(results.getLocal,{filename:oneGame});
						if (grabGame){

							return true;
						}
						else {
							return false;
						}
					});

					_.each(results.readGames,function(oneGame){
						var splitName=oneGame.split('.');
						splitName=splitName.slice(0,splitName.length-1).join('.');
						splitName=splitName.split('/');

						var romName = splitName[splitName.length-1];

						var createThis = {
							// Chop off the file extension
							name: romName,
							filename: oneGame,
							description: romDescriptions[romName] !== undefined ? romDescriptions[romName] : romName
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

			console.log('Launching mame with game:',gameObject.name,'using command:','mame '+gameObject.filename);

			var ls = spawn('mame', [''+gameObject.filename]);
			ls.stderr.setEncoding('utf8');

			ls.stderr.on('data', function(data) {
				console.log('stderr:',data);
			});

			ls.on('exit', function(code) {
				console.log('child process exited with code ' + code);
			});
			// ls.kill()

			return callback(null,true);

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