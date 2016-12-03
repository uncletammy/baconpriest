/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req,res){
		Game
		.find()
		.exec(function(err,games){
			if (err){
				console.log('Horseshit!',err);
				return res.negotiate(err);
			}
			return res.json(games);
		});
	},
	add: function(req,res){

	},
	play: function(req,res){
		var gameToLaunch = req.param('game');
		console.log('trying to launch:',gameToLaunch);
		
		sails.services.gameservice.launch(gameToLaunch,function(err,spawn){
			console.log('Got game spawn:',err,spawn);
			return res.ok();
		});
	}
};

