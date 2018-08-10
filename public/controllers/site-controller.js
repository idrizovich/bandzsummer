console.log ("dinche kontrolira");

/*function sitecontroller($scope,$http) 
{
console.log("Hello rom angular controller");

var refresh = function () {
  $http.get('/badz').success(function(respnse){
    console.log('i got data from server');
    $scope.Bands_list = resopnse;
    $scpe.Bands = "";
  })
};
refresh();

$scope.add_Bands = function (){
  console.log($scope.Bands);
  $http.post('/Bands', $scope.Bands).success(function(response){
    console.log(response);
    refresh();
  });
}
}*/

// Code goes here
var myApp = angular.module('myApp', []);
myApp.controller('myController', ['$scope', '$http', function($scope, $http) {


  //Getting Users List
  //$http GET function
  $http({
    method: 'GET',
    url: '/badz'

  }).then(function successCallback(response) {

    $scope.badz = response.data;

  }, function errorCallback(response) {

    alert("Error. Try Again!");

  });
}]);