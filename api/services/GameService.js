var fs = require('fs');
var async = require('async');

module.exports = function(){

	console.log('typeof:',typeof Game);

	var syncGames = function(){
		console.log('Syncing games:');

		async.auto({
			'deleteRecords': [function(next,results){
				Game
				.destroy()
				.exec(function(err,deadGames){
					console.log(err,deadGames);
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

					creates.push(creates);

				});

				Game
				.create(creates)
				.exec(function(err,created){
					if (err){
						return next(err);
					}
					console.log('Created:',created.length,'games');

					return next();
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
	var syncGamesInterval = setInterval(syncGames,15000);
	

	var launchGame = function(){
	// chromium --app=http://www.google.com --start-fullscreen
	};

	return {
		sync: syncGames,
		syncGamesInterval: syncGamesInterval
	};

}();