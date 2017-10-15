VideoPlayerApp.controller('VideoPlayerController', function ($scope, $http,$sce, $rootScope, $location) {
    $http({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        url: playlistApi
    }).then(function successCallBack(response) {
        $scope.playlistArray = response.data.data;
        if (response.data.data === undefined) {
            $("#alertNoPlaylist").modal();
        }
    }, function errorCallBack(response) {
        console.log(response);
    });

    $http({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        url: videoApi
    }).then(function successCallBack(response) {
        $scope.arrayObject = response.data.data;
        if ($scope.arrayObject !== undefined) {
            for (var i = 0; i < $scope.arrayObject.length; i++) {
                if ($scope.arrayObject[i].attributes.thumbnail === "") {
                    $scope.arrayObject[i].attributes.thumbnail = 'https://i.ytimg.com/vi/' + $scope.arrayObject[i].attributes.youtubeId + '/mqdefault.jpg';
                }
                $scope.arrayObject[i].attributes.createdTimeMLS = new Date($scope.arrayObject[i].attributes.createdTimeMLS).toLocaleDateString();
            }
        }
    }, function errorCallBack(response) {
        console.log(response);
    });

    $scope.embedUrl = "";
    $scope.playVideo = function (youtubeId, name, id) {
        $scope.embedUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + youtubeId);
        $scope.videoName = name;
        $scope.videoId = id;
    };

    $scope.clearModal = function () {
        $scope.VideoID = '';
        $scope.videoName = '';
        $scope.embedUrl = '';
    };

    $scope.addPlaylist = function () {
        $location.path('/playlist');
        $rootScope.page = 'addPlaylist';
    }
});