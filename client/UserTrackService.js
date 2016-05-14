// need to link this up eventually to my home.html. Duh.

angular.module('promptedApp').factory('UserTrackService', ['$http', function($http){

  // Captures my logged in user to be used across application

    var user = {};

    var getUserData = function() {
      $http.get('/auth').then(function(response){
        console.log(response);
        user.info = response.data;
        // setting this dynamically into the loggedInUser object
        console.log('Logged in user is:', user.info);
      });
    };

      return {
        user: user,
        getUserData: getUserData
      };
}]);

  // I need to save writing selections to logged in user objects.
  // What's my model for this? Would I need to create a new model or could I dynamically create
  // a new writing key as I save (yes, but how to track these)?


  // Once I have a way for them to be saved to the database and linked to the user,
  // I need a way to display all the writing selections in the library. (ng-repeat)

  // I also need a way for users to delete their selections (params)
