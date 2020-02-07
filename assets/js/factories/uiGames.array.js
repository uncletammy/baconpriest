angular.module('baconpriest').uiArray('uiGames', [

/**
 * Module Dependencies
 */

         '$q',
function($q) {

  return {

    /**
     * Fetch new data from the server.
     *
     * @option {Number} belongingTo
     *                    the id of the user whose items we should fetch
     *                    e.g. 4
     *
     * @return {Promise}
     */
    // [{name:'meat beaters',id:'meatbeaters',games:[{},{}]}]
    fetch: function (options){
      var self = this;

      var i = $q.defer();

      io
      .socket
      .get('/games',function(serverResponse){

        var allCategories = _.uniq(_.flatten(_.pluck(serverResponse,'tags')));

        var returnCategories = _.reduce(allCategories,function(keepers,oneCategoryName){
          var oneCategory = {};
          oneCategory.name = oneCategoryName;
          oneCategory.id = oneCategoryName.replace(/[^a-zA-Z0-9]/g,'');
          oneCategory.selected = false;
          oneCategory.games = _.filter(serverResponse, function(oneGame){
            return (oneGame.tags.indexOf(oneCategoryName) > -1);
          })
          .map(function(oneGame){
            return new Game(oneGame);
          });

          keepers.push(oneCategory);
          return keepers;

        },[]);

        // Set the first category as selected
        // if (return)
        returnCategories[0].selected = true;
        returnCategories[0].games[0].toggleSelected();
        self.replace(returnCategories);

        return i.resolve();
      });

      return i.promise;

    }
  };
}], 'id');

