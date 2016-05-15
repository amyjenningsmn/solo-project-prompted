var app = angular.module('promptedApp', ['ngRoute', 'summernote', 'ngSanitize']);


app.config(['$routeProvider', '$locationProvider', '$sanitizeProvider',function($routeProvider, $locationProvider, $sanitizeProvider){
  $routeProvider
    .when('/home', {
      templateUrl: 'views/choose.html', // a 'partial' is just grabbing html elements, not a full file.
      // controller: 'ChooseController',
      // controllerAs: 'choose' the controller that will control the content grabbed
    })
    .when('/write', {
      templateUrl: 'views/write.html',
      controller: 'WriteController',
      controllerAs: 'write'
    })
    .when('/library', {
      templateUrl: 'views/library.html',
      controller: 'LibraryController',
      controllerAs: 'library'
    })
    .when('/view', {
      templateUrl: 'views/view.html',
      controller: 'ViewController',
      controllerAs: 'view'
    })
    .when('/edit', {
      templateUrl: 'views/edit.html',
      controller: 'EditController',
      controllerAs: 'edit'
    })


    $locationProvider.html5Mode(true); //this allows us to take out the # in our html, need to add a companion 'base href' in the index.html for it to function


// end app.config
}])

// [[[[[[[[[[[[[[  Controllers  ]]]]]]]]]]]]]]

// Main Controller:
app.controller('MainController', ['UserTrackService', '$scope', '$http', function(UserTrackService, $scope, $http){
  // this calls the service right away so we always have our user available.
  UserTrackService.getUserData();
  $scope.user = UserTrackService.user;

  // Trying to be able to capitalize 1st letter of every user.
  // Not working yet, won't use in MVP
  // $scope.result = UserTrackService.user;
  // console.log('$scope.result'. $scope.result);
  // $scope.info = $scope.result['info'];
  // console.log('$scope.info', $scope.info);
  // $scope.username = $scope.info['username'];
  // $scope.user = capitalize($scope.username);

  // Not sure if this works, based on 2nd function below::
  // $scope.capitalize = function(input){
  //   input = input.toLowerCase();
  //   return input.substring(0,1).toUpperCase()+input.substring(1);
  // }
  // }]);

//  Function I found online:
//   app.filter('capitalize', function() {
//   return function(input, scope) {
//     if (input!=null)
//     input = input.toLowerCase();
//     return input.substring(0,1).toUpperCase()+input.substring(1);
//   }
// });



// Write Controller:
app.controller('WriteController', ['$scope', '$http', function($scope, $http){

  $scope.prompt = {};

  $scope.getPrompt = function() {
  $http.get('http://www.ineedaprompt.com/dictionary/default/prompt?q=noun+verb+noun').then(function(response){
          console.log(response);
          $scope.prompt.title = response.data.english;
          console.log('$scope.prompt:', $scope.prompt);
        })
      }

  $scope.addWritingEntry = function(){
    console.log('addWritingEntry will add this entry:', $scope.prompt);
    $http.post('/store', $scope.prompt).then(function(serverResponse){
      console.log('added this entry to db:', serverResponse);
    })
  }

}]);


// View Controller:
app.controller('ViewController', ['GetSingleViewService','DeleteSelectedWriting','$scope', '$sce', '$http', function(GetSingleViewService, DeleteSelectedWriting, $scope, $sce, $http){

    var vm = this;
    vm.data = GetSingleViewService.view;
    console.log('vm.data.info:', vm.data.info);

    vm.getInfo = vm.data.info;
    console.log('vm.getInfo:', vm.getInfo);

    vm.justObject = vm.getInfo[0];
    console.log('vm.justObject:', vm.justObject);
    // ^^ Is there a more concise way to get this?

    vm.justContent = vm.justObject['entryContent'];
    console.log('vm.justContent:', vm.justContent);
    // the string of html is: vm.justObject.entryContent

    vm.snippet = vm.justContent;
    vm.deliberatelyTrustDangerousSnippet = function() {
      return $sce.trustAsHtml(vm.snippet);
    };
    // ^^^ example of how it works at angular $sanitize doc

    vm.deleteSelection = function(writing){
      console.log('view controller:', writing);
      DeleteSelectedWriting.deleteOne(writing);
    }

}]);

// Library Controller:
app.controller('LibraryController', ['GetSingleViewService','$scope', '$http', function(GetSingleViewService, $scope, $http){
    var vm = this;
    vm.writingList = [];

    //Do this in my view controller:
    vm.data = GetSingleViewService.view;

    //NOT THIS:
    // vm.info = GetSingleViewService.view.info;

    vm.sendSingleView = function(writing){
      console.log('Controller', writing);
      GetSingleViewService.singleView(writing);
    }

    var getAllWritings = function() {
      $http.get('/library/allFromUser').then(function(serverResponse){
        console.log('Server response from getAllWritings', serverResponse);
        $scope.writingList = serverResponse.data;
      })
    }

    // put all on-load functions to run inside this function
    var init = function(){
      getAllWritings();
    }

    init();
}]);

app.controller('EditController', ['GetSingleViewService','DeleteSelectedWriting','$scope', '$sce', '$http', function(GetSingleViewService, DeleteSelectedWriting, $scope, $sce, $http){

    var vm = this;
    vm.data = GetSingleViewService.view;
    console.log('vm.data.info:', vm.data.info);

    vm.getInfo = vm.data.info;
    console.log('vm.getInfo:', vm.getInfo);

    vm.justObject = vm.getInfo[0];
    console.log('vm.justObject:', vm.justObject);
    // ^^ Is there a more concise way to get this?

    vm.justContent = vm.justObject['entryContent'];
    console.log('vm.justContent:', vm.justContent);
    // the string of html is: vm.justObject.entryContent

    vm.snippet = vm.justContent;
    vm.deliberatelyTrustDangerousSnippet = function() {
      return $sce.trustAsHtml(vm.snippet);
    };
    // ^^^ example of how it works at angular $sanitize doc

  // this is to save to db below:
  // $scope.prompt = {};
  //
  // $scope.addWritingEntry = function(){
  //   console.log('addWritingEntry will add this entry:', $scope.prompt);
  //   $http.post('/store', $scope.prompt).then(function(serverResponse){
  //     console.log('added this entry to db:', serverResponse);
  //   })
  // }

}]);




// [[[[[[[[[[[[[[[[[[[[ Factories ]]]]]]]]]]]]]]]]]]]]

// Captures my logged in user to be used across application:
angular.module('promptedApp').factory('UserTrackService', ['$http', function($http){

    var user = {};

    var getUserData = function() {
      $http.get('/auth').then(function(response){
        console.log(response);
        user.info = response.data;
        // setting this dynamically into the logged in 'user' object
        console.log('Logged in user is:', user.info.username);
      });
    };

      return {
        user: user,
        getUserData: getUserData
      };

}]);

// Captures a single writing from a user in one page and displays in another
angular.module('promptedApp').factory('GetSingleViewService', ['$http', '$location', function($http, $location){

    var view = {};

    var singleView = function(writing) {
      console.log('Button has been clicked, writing object grabbed:', writing);
      $http.get('/library/singleView/' + writing._id).then(function(response){
        console.log('Server response from singleView', response);
        view.info = response.data;
        $location.path('/view');
        console.log(view);
      })
    };

    return {
        view: view,
        singleView: singleView
      };
}]);

// Deletes a selected writing from the database
angular.module('promptedApp').factory('DeleteSelectedWriting', ['$http', '$location', '$window', function($http, $location, $window){

      var single = {};

      var deleteOne = function(writing) {
        var answer = $window.confirm('Are you sure you want to delete selection?');
        if (answer == true){
          console.log('Button has been clicked, writing object grabbed', writing);
          $http.delete('/library/deleteOne/' + writing._id).then(function(response){
            console.log('Delete call response:', response);
            single.info = response.data;
            console.log('single object:', single);
            $location.path('/library');
            });
          } else {
            return false;
          }
        };

      return {
        single: single,
        deleteOne: deleteOne
      };
}]);
