angular.module('baconpriest').factory('uiManager', [
  '$rootScope',
  '$timeout',
  '$q',
  'uiGames',
  function ($rootScope, $timeout, $q, uiGames){

    // See docs at URL below
    // https://dmauro.github.io/Keypress/

    var keyEquivalents = {
      'up': ['up'],
      'down': ['down'],
      'left': ['left','backspace'],
      'right': ['right'],
      '1': ['1','2']
    };

    function Manager(){
      this.listener = new window.keypress.Listener();
      return this;
    };

    Manager.prototype.changeRow = async function(someNumber){
      var altered;

      var oldTopRow = uiGames[0];
      oldTopRow.selected = false;
      _.each(oldTopRow.games,function(oneGame){
        if (oneGame.selected){
          return oneGame.toggleSelected();
        }
      });

      if (someNumber > 0){
        uiGames.push(uiGames.shift());
      }
      else if (someNumber < 0){
        uiGames.unshift(uiGames.pop());
      }

      var newTopRow = uiGames[0];
      newTopRow.selected = true;
      newTopRow.games[0].toggleSelected();

      try {
        await uiGames.extend([newTopRow,oldTopRow]);
      }
      catch(nope) {
        console.log('no worky',nope);
      }

      return uiGames;
    };

    Manager.prototype.changeCol = async function(someNumber){
      var altered;
      console.log('changing col to:', someNumber);

      var oldFirstRow = uiGames[0];
      console.log('toggling', oldFirstRow.games[0].name);
      oldFirstRow.games[0].toggleSelected();

      if (someNumber > 0){
        oldFirstRow.games.push(oldFirstRow.games.shift());
      }
      else if (someNumber < 0){
        oldFirstRow.games.unshift(oldFirstRow.games.pop());
      }
      console.log('Now toggling', oldFirstRow.games[0].name);

      oldFirstRow.games[0].toggleSelected();

      try {
        await uiGames.extend([oldFirstRow]);
      }
      catch(nope) {
        console.log('no worky',nope);
      }

      return uiGames;
    };


    Manager.prototype.processKeypress = function(someKey){
      console.log('Someone pressed the key called:',someKey);
      // var equivalentValue = _.reduce(_.keys(keyEquivalents),function(winner,oneKeyName){
      //   if (!winner && keyEquivalents[oneKeyName].indexOf(someKey) > -1){
      //     return oneKeyName;
      //   }
      //   return undefined;
      // }, undefined);

      switch (someKey){
        case 'up':

          var selectedRow = _.find(uiGames,{selected:true}) || uiGames[0];
          $('#row-'+selectedRow.id).removeClass('game-row-selected');

          return this
          .changeRow(-1)
          .then(function(uiGames){
            console.log('updated uiGames after hitting',someKey,_.where(uiGames,{selected:true}).length,'categories selected.');
          });

        break;
        case 'down':

          var selectedRow = _.find(uiGames,{selected:true}) || uiGames[0];
          $('#row-'+selectedRow.id).removeClass('game-row-selected');

          return this
          .changeRow(1)
          .then(function(uiGames){

            console.log('updated uiGames after hitting',someKey, uiGames,_.where(uiGames,{selected:true}).length,'categories selected.');
          });

        break;
        case 'left':
          var selectedCol = _.find(uiGames[0].games,{selected:true}) || uiGames[0].games[0];

          return this
          .changeCol(-1)
          .then(function(uiGames){
            console.log('updated uiGames after hitting',someKey, uiGames,_.where(uiGames,{selected:true}).length,'categories selected.');
          });

        break;
        case 'right':
          var selectedCol = _.find(uiGames[0].games,{selected:true}) || uiGames[0].games[0];

          return this
          .changeCol(1)
          .then(function(uiGames){
            console.log('updated uiGames after hitting',someKey, uiGames,_.where(uiGames,{selected:true}).length,'categories selected.');
          });

        break;
        case '1':
          var gameToLaunch = _.find(uiGames[0].games,{selected:true}) || uiGames[0].games[0];
          console.log('launching', gameToLaunch.name);
          gameToLaunch.launch(console.log);

        break;
        default: break;
      }

    };

    Manager.prototype.setup = function(){

      _.flatten(_.values(keyEquivalents)).forEach((oneKeyName) => {
        this.listener.simple_combo(oneKeyName, _.bind(this.processKeypress,this,oneKeyName));
      });

      return $q.when('im resolved!');
    };

window.uiGames=uiGames;
window.uiManager = new Manager();

    return window.uiManager;

  }]);
