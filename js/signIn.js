VideoPlayerApp.controller('signInController', function($scope, $timeout, $http, $location) {
    $scope.createSigninData = function () {
        $scope.signingIn = false;
        $scope.signinSucces = false;
        $scope.signinData = {
            "data": {
                "type": "MemberLogin",
                "attributes": {
                    "username": "",
                    "password": ""
                }
            }
        }
    };
    $scope.signin = function () {
        $scope.signingIn = true;
        $timeout(function () {
            $http({
                method: 'POST',
                url: authenticationApi,
                data: $scope.signinData
            }).then(function successCallback(response) {
                $scope.signingIn = false;
                localStorage.setItem('username', response.config.data.data.attributes.username);
                localStorage.setItem('token', response.data.data.attributes.secretToken);
                var signinTime = new Date(response.data.data.attributes.createdTimeMLS).toLocaleDateString();
                var expireTime = new Date(response.data.data.attributes.expiredTimeMLS).toLocaleDateString();
                localStorage.setItem('signinTime', signinTime);
                localStorage.setItem('expireTime', expireTime);
                $scope.signinSucces = true;
                $timeout(function () {
                    $location.path('/');
                    location.reload();
                }, 500);
            }, function errorCallback(response) {

            });
        }, 300);

    }
});