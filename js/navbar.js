VideoPlayerApp.controller('navbarController', function ($scope, $location, $http) {
    $scope.signedInStatus = false;

    $scope.userToken = localStorage.getItem('token');
    if ($scope.userToken !== null) {
        $scope.signedInStatus = true; /*return true nếu đã đăng nhập! ng-show form đăng nhập = !signedInStatus = false; ng-show thông tin = signedInStatus = true*/
    }
    $scope.signedInUsername = localStorage.getItem('username');

    $scope.signOut = function () {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        location.reload();
    };

    $scope.signinData = {
        "data": {
            "type": "MemberLogin",
            "attributes": {
                "username": "",
                "password": ""
            }
        }
    };
    $scope.isActivenavbar = function (path) {
        return (path === $location.path());
    };

    /* Hide the alert signin failed*/

    $scope.signinResponseIsHided = true;
    $scope.hideSigninResponse = function () {
        $scope.signinResponseIsHided = true;
    };

    $scope.signin = function () {
        $http({
            method: 'POST',
            url: authenticationApi,
            data: $scope.signinData
        }).then(function successCallback(response) {
                localStorage.setItem('username', response.config.data.data.attributes.username);
                localStorage.setItem('token', response.data.data.attributes.secretToken);
                location.reload();
        }, function errorCallback(response) {
                $scope.signInResponse = response.data.errors[0].detail;
                $scope.signinResponseIsHided = false;
        });
    }
});