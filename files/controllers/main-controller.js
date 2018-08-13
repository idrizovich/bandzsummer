function MainController($scope, $rootScope, $http, toastr){
    $scope.openModal = function () {
        $scope.visible = false;
        $scope.visible = $scope.visible = true;
      }
    
      $scope.closeModal = function () {
        $scope.visible = true;
        $scope.visible = $scope.visible = false;
      } 

      $scope.addEvent = function () {
        console.log('add event')
        console.log($scope.events)
        $http.post('/event', $scope.events).then(function (response) {
          console.log(response)
          $scope.events.eventBandName = ''
          $scope.events.eventTime = ''
          $scope.events.eventLocalName = ''
          $scope.events.eventLocalInfo = ''
          toastr.success("Event added successfully")
        })
      }
}