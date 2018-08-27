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
          $http.get('bandcount', config).then(function (bandcnt) {
            $scope.bandcount = bandcnt.data            
          });

        })
      }

      getUsers();
      
      get_rock_count();
      get_jazz_count();
      get_rap_count();
      get_blues_count();
      get_pop_count();

     function get_rock_count(){
        $http.get('/count/Rock').then(function(res){
          $scope.count_rock = res.data.bands_count;
        }), function(res){
          alert(res.status);
        }
      }
      function get_jazz_count(){
        $http.get('/count/Jazz').then(function(res){
          $scope.count_jazz = res.data.bands_count;
        }), function(res){
          alert(res.status);
        }
      }
      function get_blues_count(){
        $http.get('/count/Blues').then(function(res){
          $scope.count_blues = res.data.bands_count;
        }), function(res){
          alert(res.status);
        }
      }
      function get_pop_count(){
        $http.get('/count/Pop').then(function(res){
          $scope.count_pop = res.data.bands_count;
        }), function(res){
          alert(res.status);
        }
      }
      function get_rap_count(){
        $http.get('/count/Rap').then(function(res){
          $scope.count_rap = res.data.bands_count;
        }), function(res){
          alert(res.status);
        }
      }

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