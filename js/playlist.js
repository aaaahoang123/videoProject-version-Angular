VideoPlayerApp.controller('playlistUploadController', function ($scope, $http, $rootScope) {
    /*Get the video of choosen Playlist*/
    $scope.getVideoByPlaylistId = function(playlistId, playlistName) {
        $scope.page = 'choosenPlaylistPage'; /*Open the switch of choosen playlist*/
        $scope.playlistName = playlistName;
        $rootScope.choosenPlaylist.attributes.playlistId = playlistId;
        $http({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            url: videoApi + '?playlist=' + playlistId + '&page=1&limit=100'
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
        }, function errorCallBack(response) {
            alert('Tải video thất bại');
        });
    };

    /* The status of side bar */
  

    $scope.page = "playlist";
    if ($rootScope.page !== undefined) {
        $scope.page = $rootScope.page;
        $scope.getVideoByPlaylistId($rootScope.choosenPlaylist.attributes.playlistId, $rootScope.choosenPlaylist.attributes.name);
    }
    $scope.switchPage = function (pageName) {
      $scope.page = pageName;
      if (pageName === 'playlist') {
          $scope.videosArray = [];
          $rootScope.choosenPlaylist.attributes.playlistId = "";
      }
    };
    $scope.isActivePlaylistSidebar = function (switchName) {
        return (switchName === $scope.page);
    };
    /* Filter the Playlist to display && Take the playlist Id to upload Video*/
    if ($rootScope.choosenPlaylist === undefined) {
        $rootScope.choosenPlaylist = {
            'attributes': {
                'playlistId': "",
                'name': ""
            }
        };
    }
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
    /*Get all the play list*/
    $scope.getAllPlaylist = function () {
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
    };


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
            $scope.page = 'playlist';
            $scope.getAllPlaylist();
            $scope.resetForm();
        }, function errorCallback(errorResponse) {
            console.log(errorResponse);
        });
    };
    /*Delete Playlist*/
    $scope.deletePlaylist = function(id){
        $http({
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            url: playlistApi + '/' + id,
        }).then(function successCallback(response) {
            $scope.getAllPlaylist();
        }, function errorCallback(errorResponse) {
            console.log(errorResponse);
        });
    };
    /*Reset Form*/
    $scope.resetForm = function () {
        angular.copy({}, $scope.playlistData);
    };

    // Delete video
    $scope.deleteVideo = function (id) {
        $http({
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            url: videoApi + '/' + id
        }).then(function successCallback(response) {
            $scope.getVideoByPlaylistId($rootScope.choosenPlaylist.attributes.playlistId, $scope.playlistName); /*Get video again after delete*/
        }, function errorCallback(response) {
            $scope.responseEditError = response;
        });
    };
});