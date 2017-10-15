VideoPlayerApp.controller('playlistUploadController', function ($scope, $http, $rootScope, $route, $timeout) {

    /* The status of side bar */
    $scope.page = "playlist";
    if ($rootScope.page !== undefined) {
        $scope.page = $rootScope.page;
    }
    $scope.switchPage = function (pageName) {
      $scope.page = pageName;
    };
    $scope.isActivePlaylistSidebar = function (switchName) {
        return (switchName === $scope.page);
    };
    /* Filter the Playlist to display && Take the playlist Id to upload Video*/
    if ($rootScope.choosenPlaylist === undefined) {
        $rootScope.choosenPlaylist = {
            'attributes': {
                'playlistId': ""
            }
        };
    }

    $scope.changePageOfPlaylist = function(playlistId) {
        $scope.page = 'choosenPlaylistPage'; /*Open the switch of choosen playlist*/
        $rootScope.choosenPlaylist.attributes.playlistId = playlistId;
    };

    /*Get the video*/
    $http({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        url: videoApi
    }).then(function successCallBack(response) {
        $scope.videosArray = response.data.data;
        if ($scope.videosArray !== undefined) {
            for (var i = 0; i < $scope.videosArray.length; i++) {
                if ($scope.videosArray[i].attributes.thumbnail === "") {
                    $scope.videosArray[i].attributes.thumbnail = 'https://i.ytimg.com/vi/' + $scope.videosArray[i].attributes.youtubeId + '/mqdefault.jpg';
                }
            }
        }

    }, function errorCallBack(response) {
        alert('Tải video thất bại');
    });

    /*Get the play list*/
    $scope.playlistArray = [
        {
            attributes: {
                'thumbnailUrl': '',
                'name': '',
                'description': ''
            }
        }
    ];
    $http({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        url: playlistApi
    }).then(function successCallback(response) {
        $scope.playlistArray = response.data.data;
        if ($scope.playlistArray === undefined) {
            if ($rootScope.page === undefined) {
                $("#alertNoPlaylist").modal(); /* Alert when no playlist exist, and change the switch to addPlaylist */
                $scope.page = 'addPlaylist';
            }
            $scope.playlistArray = [
                {
                    attributes: {
                        'thumbnailUrl': 'img/no-playlist.jpg',
                        'name': 'Chưa có playlist',
                        'description': 'Mời bạn thêm playlist'
                    }
                }
            ];
        }

    }, function errorCallback(response) {
        console.log(response);
    });

    /* Upload a playlist*/
    $scope.playlistData = {
        "data": {
            "type":"Playlist",
            "attributes":{
                "name": "",
                "description": "",
                "thumbnailUrl": ""
            }
        }
    };
    /* Hidden the alert */
    $scope.uploadSuccess = false;
    $scope.doSubmit = function(){
        $http({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            url: playlistApi,
            data: $scope.playlistData
        }).then(function successCallback(response) {
            $scope.uploadSuccess = true;
            $rootScope.page = 'playlist';
            $timeout(function () {
                $route.reload();
            }, 1200);
        }, function errorCallback(errorResponse) {
            console.log(errorResponse);
        });
    };
    /*Reset Form*/
    $scope.resetForm = function () {
        angular.copy({}, $scope.playlistData);
    }
});