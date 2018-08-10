function getBand($scope, $http){
    http();

    function http(){
        $http.get("/badz").then(function(response){
            $scope.badz = response.data
        });
    }
};