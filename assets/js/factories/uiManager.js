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

    Manager.prototype.changeRow = function(someNumber){
      var self = this;
      var altered;

      var i = $q.defer();

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

      uiGames
      .extend([newTopRow,oldTopRow])
      .then(function(uiGames){
        console.log('uiGames now:',uiGames);
        return i.resolve(uiGames);
      });

      return i.promise;
    };

    Manager.prototype.changeCol = function(someNumber){
      var self = this;
      var altered;

      var i = $q.defer();

      var oldFirstRow = uiGames[0];
      oldFirstRow.games[0].toggleSelected();

      if (someNumber > 0){
        oldFirstRow.games.push(oldFirstRow.games.shift());
      }
      else if (someNumber < 0){
        oldFirstRow.games.unshift(oldFirstRow.games.pop());
      }

      oldFirstRow.games[0].toggleSelected();

      uiGames
      .extend([oldFirstRow])
      .then(function(uiGames){
        console.log('uiGames now:',uiGames);
        return i.resolve(uiGames);
      });

      return i.promise;
    };


    Manager.prototype.processKeypress = function(someKey){
      var self = this;

      console.log('Someone pressed the key called:',someKey);
      console.log(typeof this.setup);

      var equivalentValue = _.reduce(_.keys(keyEquivalents),function(winner,oneKeyName){
        if (!winner && keyEquivalents[oneKeyName].indexOf(someKey) > -1){
          return oneKeyName;
        }
        return undefined;
      },undefined);

      switch (someKey){
        case 'up':

          var selectedRow = _.find(uiGames,{selected:true}) || uiGames[0];
          $('#row-'+selectedRow.id).removeClass('game-row-selected');
          $('#row-'+selectedRow.id).addClass('animated bounceOutLeft');
          $('#row-'+selectedRow.id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){

            $('#row-'+selectedRow.id).removeClass('animated bounceOutLeft');

            self
            .changeRow(-1)
            .then(function(uiGames){
              console.log('updated uiGames after hitting up',_.where(uiGames,{selected:true}).length,'categories selected.');
            });

          });

        break;
        case 'down':

          var selectedRow = _.find(uiGames,{selected:true}) || uiGames[0];
            // $('#row-'+oldRow).css({'border':'5px solid purple'});
            $('#row-'+selectedRow.id).removeClass('game-row-selected');
            $('#row-'+selectedRow.id).addClass('animated bounceOutLeft');
            $('#row-'+selectedRow.id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){

              $('#row-'+selectedRow.id).removeClass('animated bounceOutLeft');

              self
              .changeRow(1)
              .then(function(uiGames){
                console.log('updated uiGames after hitting down',uiGames,_.where(uiGames,{selected:true}).length,'categories selected.');
              });

            });

        break;
        case 'left':
          var selectedCol = _.find(uiGames[0].games,{selected:true}) || uiGames[0].games[0];
            $('#col-'+selectedCol.id).addClass('animated bounceOutLeft');
            $('#col-'+selectedCol.id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){

              $('#col-'+selectedCol.id).removeClass('animated bounceOutLeft');

              self
              .changeCol(-1)
              .then(function(uiGames){
                console.log('updated uiGames after hitting left',uiGames,_.where(uiGames,{selected:true}).length,'categories selected.');
              });

            });

        break;
        case 'right':
          var selectedCol = _.find(uiGames[0].games,{selected:true}) || uiGames[0].games[0];
            $('#col-'+selectedCol.id).addClass('animated bounceOutLeft');
            $('#col-'+selectedCol.id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){

              $('#col-'+selectedCol.id).removeClass('animated bounceOutLeft');

              self
              .changeCol(1)
              .then(function(uiGames){
                console.log('updated uiGames after hitting right',uiGames,_.where(uiGames,{selected:true}).length,'categories selected.');
              });

            });

        break;
        case '1':

          var gameToLaunch = _.find(uiGames[0].games,{selected:true}) || uiGames[0].games[0];
          gameToLaunch.launch(console.log);

        break;
        default: break;
      }

    };

    Manager.prototype.setup = function(){
      var self = this;

      _.flatten(_.values(keyEquivalents)).forEach(function(oneKeyName){
        self.listener.simple_combo(oneKeyName, _.bind(self.processKeypress,self,oneKeyName));
      });

      return $q.when('im resolved!');
    };

    // window.bunish = new Manager();

    return new Manager();

  }]);
