function GenreController($scope, $http){
    console.log("GenreController");
        
    var config = {
        headers: {
          'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
          'Accept': 'application/json;odata=verbose',
          "JWT": localStorage.getItem('user')
        }
      };
   
    function getUsers() {
        $http.get('rest/v1/users', config).then(function (response) {
          $scope.users = response.data

        })
      }
     getUsers();

     $scope.genreIncludes = [];

     $scope.includeGenre = function(genre) {
       var i = $.inArray(genre, $scope.genreIncludes);
       if (i > -1) {
           $scope.genreIncludes.splice(i, 1);
       } else {
           $scope.genreIncludes.push(genre);
       }
   }
   
     $scope.genreFilter = function(users) {
       if ($scope.genreIncludes.length > 0) {
           if ($.inArray(users.genre, $scope.genreIncludes) < 0)
               return;
       }
       
       return users;
   }
}