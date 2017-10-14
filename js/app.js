var videoApi = 'https://youtube-api-challenger2.appspot.com/videos';
var membersApi = 'https://youtube-api-challenger2.appspot.com/members';
var authenticationApi = 'https://youtube-api-challenger2.appspot.com/authentication';
var playlistApi = 'https://youtube-api-challenger2.appspot.com/playlists';

var VideoPlayerApp = angular.module('VideoPlayerApp', ["ngRoute"]);

VideoPlayerApp.directive("compareTo", function ()
{
    return {
        require: "ngModel",
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var notConfirm = (viewValue !== scope.signupForm.password.$viewValue);
                ctrl.$setValidity('notConfirm', !notConfirm);
                return viewValue;
            })
        }
    };
});
/*Close all Modal when change view*/
VideoPlayerApp.run(["$rootScope","$http","$location",
    function($rootScope,$http,$location){

        $rootScope.$on('$routeChangeStart', function() {
            $('.modal').modal('hide');
        })

    }]);

VideoPlayerApp.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'pages/home.htm',
            controller: 'VideoPlayerController'
        }).
        when('/uploadForm', {
            templateUrl: 'pages/uploadForm.htm',
            controller: 'UploadFormController'
        }).
        when('/signup', {
            templateUrl: 'pages/signUp.htm',
            controller: 'signupController'
         
        }).
        when('/playlist', {
            templateUrl: 'pages/playlist.htm',
            controller: 'playlistUploadController'
        }).
        when('/watch', {
            templateUrl: 'pages/watch.htm',
            controller: 'watchPageController'
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);

