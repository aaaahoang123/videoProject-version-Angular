VideoPlayerApp.controller('playlistUploadController', function ($scope, $http, $rootScope, $route, $timeout) {

    /* The status of side bar */
    $scope.page = "playlist";
    $scope.switchPage = function (pageName) {
      $scope.page = pageName;
    };
    $scope.isActivePlaylistSidebar = function (switchName) {
        return (switchName === $scope.page);
    };
    /* Filter the Playlist to display && Take the playlist Id to upload Video*/
    $rootScope.choosenPlaylist = {
        'attributes': {
            'playlistId': ""
        }
    };
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
        for (var i = 0; i < $scope.videosArray.length; i++) {
            if ($scope.videosArray[i].attributes.thumbnail === "") {
                $scope.videosArray[i].attributes.thumbnail = 'https://i.ytimg.com/vi/' + $scope.videosArray[i].attributes.youtubeId + '/mqdefault.jpg';
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
        if (response.data.data === undefined) {
            $scope.playlistArray = [
                {
                    attributes: {
                        'thumbnailUrl': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ2phHv9rCq-Aaq30y4SMD9rMauZinCFIOLlLxq_Pvg_Qcuje9',
                        'name': 'Chưa có playlist',
                        'description': 'Mời bạn thêm playlist'
                    }
                }
            ];
        }
        else {
            $scope.playlistArray = response.data.data;
        }

    }, function errorCallback(response) {
        alert('tải về thất bại');
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