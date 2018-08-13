app.controller('indexCtrl', function ($scope, $location, $http, toastr) {
    $scope.regType = 'User';
    $scope.onLogin = true;

    $scope.genres = ['Rock', 'Pop', 'Blues', 'Rap', 'Jazz'];

    $scope.switchLogReg = function () {
        console.log($scope.onLogin);
        $scope.onLogin = !$scope.onLogin;
        console.log($scope.onLogin);
    }

    $scope.login = function (credentials) {
        $http.post('/login', credentials).then(function (response) {
            if (response.data.success) {
                localStorage.setItem('user', response.data.token);
                toastr.success('Welcome user.');
            } else {
                toastr.error('Credentials incorrect.');
            }
        }), function (error) {
            console.log(error);
        }
    }

    $scope.register_user = function (user_info) {
        $http.post('/register/user', user_info).then(function (response) {
            if (response.data) {
                toastr.success('You have registered.');
            } else {
                toastr.error('User already exists.');
            }
        }), function (error) {
            console.log(error);
        }
    }

    $scope.register_band = function (user_info) {
        $http.post('/register/band', user_info).then(function (response) {

            if (response.data) {
                toastr.success('Band registered.');
            } else {
                toastr.error('Band already exists.');
            }
        }), function (error) {
            console.log(error);
        }
    }

    $scope.logout = function () {
        if (localStorage.getItem('user')) {
            localStorage.clear();
            toastr.warning('You have been logged out.')
        }
    }

    $scope.check_login = function () {
        if (localStorage.getItem('user')) {
            return true;
        } else {
            return false;
        }
    }

    $scope.openModal = function () {
        $scope.visible = false;
        $scope.visible = $scope.visible = true;
    }

    
    $scope.closeModal = function () {
        $scope.visible = true;
        $scope.visible = $scope.visible = true;
    }
});