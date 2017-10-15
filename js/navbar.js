VideoPlayerApp.controller('navbarController', function ($scope, $location, $http, $timeout) {
    $scope.loadedLocalStorage = false;
    $scope.signedIn = true;
    $scope.userToken = localStorage.getItem('token');
    /*Control the status of nav bar right*/
    if ($scope.userToken !== null) {
        $scope.signinOrUserName = localStorage.getItem('username');
        $scope.glyphiconSigninOrUserData = 'glyphicon glyphicon-user';
        $scope.signupOrSignout = 'Đăng xuất';
        $scope.glyphiconSignupOrSignout = 'glyphicon glyphicon-log-out';
        $scope.loadedLocalStorage = true;
        $scope.signedIn = true;
    }
    else {
        $scope.signinOrUserName = 'Đăng nhập';
        $scope.glyphiconSigninOrUserData = 'glyphicon glyphicon-log-in';
        $scope.signupOrSignout = 'Đăng ký';
        $scope.glyphiconSignupOrSignout = 'glyphicon glyphicon-user';
        $scope.loadedLocalStorage = true;
        $scope.signedIn = false;
    }
    $scope.signinTime = localStorage.getItem('signinTime');
    $scope.expireTime = localStorage.getItem('expireTime');

    $scope.signOut = function () {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('signinTime');
        localStorage.removeItem('expireTime');
        location.reload();
    };

    $scope.controlSignupOrSignOut = function () {
        if ($scope.userToken !== null) {
            $scope.signOut();
        } /*Sign out when signed in*/
        else {
            $location.path('/signup')
        } /*Sign up when haven't signed in*/
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
            /*Saving in local storage*/
                localStorage.setItem('username', response.config.data.data.attributes.username);
                localStorage.setItem('token', response.data.data.attributes.secretToken);
                var signinTime = new Date(response.data.data.attributes.createdTimeMLS).toLocaleDateString();
                var expireTime = new Date(response.data.data.attributes.expiredTimeMLS).toLocaleDateString();
                localStorage.setItem('signinTime', signinTime);
                localStorage.setItem('expireTime', expireTime);

             /*Set navbar to signed in mode*/
                $scope.signedIn = true;
                $scope.signinOrUserName = $scope.signinData.data.attributes.username;
                $scope.glyphiconSigninOrUserData = 'glyphicon glyphicon-user';
                $scope.signupOrSignout = 'Đăng xuất';
                $scope.glyphiconSignupOrSignout = 'glyphicon glyphicon-log-out';
                $scope.loadedLocalStorage = true;
                $scope.signinTime = signinTime;
                $scope.expireTime = expireTime;
                $scope.controlSignupOrSignOut = function () {
                    $scope.signOut();
                };
                $timeout(function () {
                    $location.path('/');
                }, 500); /*Load the home route*/
        }, function errorCallback(response) {
                $scope.signInResponse = response.data.errors[0].detail;
                $scope.signinResponseIsHided = false;
        });
    }


});


