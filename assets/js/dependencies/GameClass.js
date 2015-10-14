function Game(ting){
    for (var key in ting){
        this[key] = ting[key]
    }
    return this;
}

Game.prototype.launch = function(callback){
    var self = this;

    console.log('Launching game:',this.name);
    io.socket.post('/play',{game:self},function(){
        return callback(arguments);
    });
};
