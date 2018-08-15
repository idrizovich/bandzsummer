function MainController($scope, $rootScope, $http, toastr){
    
  function getEvent() {
    $http.get('/events').then(function (response) {
      $scope.events = response.data
    })
  }
  
  $scope.openModal = function () {
        $scope.visible = false;
        $scope.visible = $scope.visible = true;
      }
    
      $scope.closeModal = function () {
        $scope.visible = true;
        $scope.visible = $scope.visible = false;
      } 

      $scope.addEvent = function () {
        $http.post('/event', $scope.event).then(function (response) {
          toastr.success("Event added successfully");
          getEvent();
        })
      }

      $scope.deleteEvent = function(id){
        $http.delete('/events/'+ id).then(function(data){
          getEvent()
            toastr.success("You have successfully deleted an event!");
        });
    }

  /*   $scope.updateEvent= function(){
      $http.put('/events/'+$scope.events._id, $scope.event).then(function(data){
        getEvent();
        toastr.info('You have successfully updated band!');
        $scope.event = null;
      });
    }    
    $scope.editEvent = function(event){
      $scope.event ={
        _id : event._id,
        eventBandName : event.eventBandName,
        eventLocalName : event.eventLocalName,
        eventLocalInfo : event.eventLocalInfo,
        eventTime : event.eventTime,
      };
  }
 */
$scope.editEvent = function(event){
  $http.put('/events', event).then(function(response){
    getEvent();
    toastr.info('You have successfully updated band!');
  }, function(error){
    console.log(error);
  });
}
      getEvent()
}