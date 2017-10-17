VideoPlayerApp.controller('VideoPlayerController', function ($scope, $http,$sce, $rootScope, $location, $timeout) {
/*All Videos*/
    $http({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        url: videoApi + '?page=1&limit=50'
    }).then(function successCallBack(response) {
        $scope.videosArray = response.data.data;
        if ($scope.videosArray !== undefined) {
            for (var i = 0; i < $scope.videosArray.length; i++) {
                if ($scope.videosArray[i].attributes.thumbnail === "") {
                    $scope.videosArray[i].attributes.thumbnail = 'https://i.ytimg.com/vi/' + $scope.videosArray[i].attributes.youtubeId + '/mqdefault.jpg';
                }
                $scope.videosArray[i].attributes.createdTimeMLS = new Date($scope.videosArray[i].attributes.createdTimeMLS).toLocaleDateString();
            }
        }
        $http({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            url: playlistApi
        }).then(function successCallBack(response) {
            $scope.playlistArray = response.data.data;
        }, function errorCallBack(response) {
            console.log(response);
        });
    }, function errorCallBack(response) {
        console.log(response);
    });
    /*Filter video for Playlist*/
    $scope.filterVideoForPlaylist = function (playlist) {
      var videos = [];
      for (var i=0; i < $scope.videosArray.length; i++) {
            if ($scope.videosArray[i].attributes.playlistId == playlist.id) {
                videos.push($scope.videosArray[i]);
            }
      }
      return videos;
    };
/* Just display the defined playlists! Call by ng-repeat of the playlist Display */
    $scope.filterPlaylistNotUndefined = function (playlistArray) {
        var plArrayToDisplay = [];
        if ($scope.videosArray !== undefined && playlistArray !== undefined) {
            for (var i=0; i<playlistArray.length; i++) {
                for (var j=0; j<$scope.videosArray.length; j++) {
                    if ($scope.videosArray[j].attributes.playlistId == playlistArray[i].id) {
                        plArrayToDisplay.push(playlistArray[i]);
                        break;
                    }
                }
            }
        }
        return plArrayToDisplay;
    };
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
    $rootScope.choosenPlaylist = {
        attributes: {
            playlistId: '',
            name: ''
        }
    };
    $scope.linkToPlaylist = function (plId, plName) {
        $rootScope.page = 'choosenPlaylistPage';
        $rootScope.choosenPlaylist.attributes.playlistId = plId;
        $rootScope.choosenPlaylist.attributes.name = plName;
        $timeout(function () {
            $location.path('/playlist');
        }, 200);
    }
});