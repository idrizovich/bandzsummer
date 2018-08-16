function MainController($scope, $rootScope, $http, toastr) {
  $scope.user_type = localStorage.getItem('type');

  var config = {
    headers: {
      'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
      'Accept': 'application/json;odata=verbose',
      "JWT": localStorage.getItem('user')
    }
  };

  function getEvent() {
    $http.get('rest/v1/events', config).then(function (response) {
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
    $http.post('rest/v1/event', $scope.event, config).then(function (response) {
      toastr.success("Event added successfully");
      getEvent();
    })
  }

  $scope.deleteEvent = function (id) {
    $http.delete('rest/v1/events/' + id, config).then(function (data) {
      getEvent()
      toastr.success("You have successfully deleted an event!");
    });
  }

  $scope.openEditEvent = function (event_id) {
    $http.get('rest/v1/events/' + event_id, config).then(function (response) {
      console.log(response);
      $scope.event = response.data;
    });
  }

  $scope.editEvent = function (event) {
    $http.put('rest/v1/events', event, config).then(function (response) {
      getEvent();
      toastr.info('You have successfully updated band!');
    }, function (error) {
      console.log(error);
    });
  }

  getEvent()
}