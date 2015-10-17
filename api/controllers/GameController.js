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
			console.log('Got game spawn:',spawn);
			return res.ok();
		});
	},
	command: function(req,res){
		var phrase = req.param('phrase')&&req.param('phrase').toLowerCase();
		console.log('Got a phrase:',phrase);
		if (!phrase){
			return res.notFound()
		}

		var commands;
		if (/bacon/.test(phrase)){
			commands = ['5','6','7','8'];
		} else if (/horse s\*\*\*/.test(phrase)){
			commands = ['Escape'];
		}
		if (commands){
			sails.services.gameservice.inject(commands);
		}

		return res.ok();

	}
};

