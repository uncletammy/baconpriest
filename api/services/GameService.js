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

					var mameDbNormalize = function(name) {
						return name.replace(/ua$/,'').replace(/ub$/,'').replace(/2p$/,'');
					};
					_.each(results.readGames,function(oneGame){
						var splitName=oneGame.split('.');
						splitName=splitName.slice(0,splitName.length-1).join('.');
						splitName=splitName.split('/');
						var romName = splitName.pop();
						var savePath =  splitName.join('/');

						var createThis = {
							// Chop off the file extension
							name: romName,
							filename: oneGame,
							path:savePath,
							description: romDescriptions[romName] !== undefined ? romDescriptions[romName] : romName,
							image: 'https://edgeemu.net/screenshots/mame/Named_Titles/'+mameDbNormalize(romName)+'.png'
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

		// In addition to calling every 10 seconds, also call it on startup
		syncGames.call();

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

			try {
				process.chdir(sails.config.mame.mamepath);
				console.log('Changed CWD to:' + process.cwd());
			}
				catch (err) {
				console.log('Error changing CWD to',sails.config.mame.mamepath,'.  Some Roms may not fire.' + err);
			}

		};

		var launchChromeTimeout = setTimeout(launchChrome,4000);


		var launchGame = function(gameObject,callback){

			console.log('Launching mame with game:',gameObject.name,'using command:','mame -rompath '+gameObject.path+' '+gameObject.name,'from system path',process.env.PATH);
			console.log('Full Env:',process.env);
			try {
				var ls = spawn('mame', ['-rompath',gameObject.path,gameObject.name]);
				ls.stderr.setEncoding('utf8');

				ls.stderr.on('data', function(data) {
					console.log('stderr:',data);
				});

				ls.on('error', function(data) {
					console.log('Mame error:',data);
				});

				ls.on('exit', function(code) {
					console.log('child process exited with code ' + code);
				});
				return callback(null,true);
			}
				catch (err) {
				console.log('Could not launch game:',err);
				return callback(null,false);
			}

		};

		_.extend(gameService,{
			sync: syncGames,
			syncGamesInterval: syncGamesInterval,
			launch: launchGame
		});

	}

	sails.on('hook:orm:loaded', function(){

		async.auto({
			'deleteGames': function(next){
				Game
				.destroy()
				.exec(function(err,deadGames){
					if (err){
						console.log('Error deleting games:',err);
					}
					return next();
				});
			},
			'buildGames': ['deleteGames',function(next){
				extendGameService.call();
				return next();
			}]
		},function(err,results){
			console.log('All done!');
		});

	});

	return gameService;

}();