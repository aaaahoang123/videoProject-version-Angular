VideoPlayerApp.controller('VideoPlayerController', function ($scope, $http,$sce) {
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

        console.log(response);
    }, function errorCallBack(response) {

    });
    $scope.thelink = "";
    $scope.playVideo = function (youtubeId, name, id) {
        $scope.embedUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + youtubeId);
        $scope.videoName = name;
        $scope.videoId = id;
    };

    $scope.clearModal = function () {
        $scope.VideoID = '';
        $scope.videoName = '';
        $scope.embedUrl = '';
    }
});