function Game(ting){
    for (var key in ting){
        this[key] = ting[key]
    }

    this.selected = false;
    return this;
}

Game.prototype.toggleSelected = function(){
	this.selected = !!!this.selected;
	return;
};

Game.prototype.launch = function(callback){
    var self = this;

    console.log('Launching game:',this.name);
    io.socket.post('/play',{game:self},function(){
        return callback(arguments);
    });
};
