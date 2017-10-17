VideoPlayerApp.controller('watchPageController', function ($scope, $rootScope, $http, $location, $sce, $timeout, $route) {
    $scope.isErrorVideo = false;
    $scope.editSucess = false;
    $scope.editError = false;
    $scope.completeLoadingVideoData = false;
    var id = $location.search().id;
    $scope.editData = {
        "data":{
            "type":"Video",
            "attributes":{
                "youtubeId": "",
                "name": "",
                "description": "",
                "keywords": "",
                "playlistId": "",
                "thumbnail": ""
            }
        }
    };

    /*Get video Data*/
    $http({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        url: videoApi + '/' + id
    }).then(function successCallBack(response) {
        $scope.videoData = response.data.data;
        $scope.videoData.attributes.createdTimeMLS = new Date($scope.videoData.attributes.createdTimeMLS).toLocaleDateString();
        $scope.srcLink = 'https://www.youtube.com/embed/' + $scope.videoData.attributes.youtubeId + '?autoplay=1';
        $scope.srcLink = $sce.trustAsResourceUrl($scope.srcLink);
        $scope.videoData.attributes.keywords = $scope.videoData.attributes.keywords.replace('[', '');
        $scope.videoData.attributes.keywords = $scope.videoData.attributes.keywords.replace(']', '');
        /*Now, the editData*/
        $scope.editData = {
            'data': {
                'attributes': {
                    'playlistId': $scope.videoData.attributes.playlistId,
                    'youtubeId': $scope.videoData.attributes.youtubeId,
                    'name': $scope.videoData.attributes.name,
                    'description': $scope.videoData.attributes.description,
                    'keywords': $scope.videoData.attributes.keywords,
                    'thumbnail': $scope.videoData.attributes.thumbnail
                }
            }
        };
        $scope.completeLoadingVideoData = true;
    }, function errorCallBack(response) {
        $scope.alertError = response.data.errors[0];
        $scope.isErrorVideo = true;
    });

    /*Get all the video for right side*/
    $http({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        url: videoApi
    }).then(function successCallback(response) {
        $scope.videosArray = response.data.data;
        $scope.videosArray = $scope.videosArray.filter(function (t) {
            return t.id !== $location.search().id;
        });
        for (var i=0; i<$scope.videosArray.length; i++) {
            $scope.videosArray[i].attributes.createdTimeMLS = new Date($scope.videosArray[i].attributes.createdTimeMLS).toLocaleDateString();
        }
    }, function errorCallback(response) {
        console.log('Error: ' + response.data.errors[0].code + ' ' + response.data.errors[0].title + ' ' + response.data.errors[0].detail);
    });
/*Get all the playlist for edit*/
    $http({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        url: playlistApi
    }).then(function successCallback(response) {
        $scope.playlistArray = response.data.data
    }, function errorCallback(response) {
        console.log('Error: ' + response.data.errors[0].code + ' ' + response.data.errors[0].title + ' ' + response.data.errors[0].detail);
    });

    /*Edit Function*/
// Edit
    $scope.editVideo = function () {
        if ($scope.editData.data.attributes.thumbnail === "") {
            $scope.editData.data.attributes.thumbnail = 'https://i.ytimg.com/vi/' + $scope.editData.data.attributes.youtubeId + '/mqdefault.jpg';
        }
        $http({
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            url: videoApi + '/' + id,
            data: $scope.editData
        }).then(function successCallback(response) {
            $scope.editSuccess = true;
            $timeout(function () {
                $route.reload();
            }, 1000);
        }, function errorCallback(response) {
            $scope.editError = true;
            $scope.responseEditError = response;
        });
    };
// Reset
    $scope.resetEditForm = function () {
        $scope.editData = {
          'data': {
              'attributes': {
                  'playlistId': $scope.videoData.attributes.playlistId,
                  'youtubeId': $scope.videoData.attributes.youtubeId,
                  'name': $scope.videoData.attributes.name,
                  'description': $scope.videoData.attributes.description,
                  'keywords': $scope.videoData.attributes.keywords,
                  'thumbnail': $scope.videoData.attributes.thumbnail
              }
          }
        };

    };
// Delete
    $scope.deleteVideo = function () {
        $http({
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            url: videoApi + '/' + id
        }).then(function successCallback(response) {
            $timeout(function () {
                $location.path('/');
            }, 1000);
        }, function errorCallback(response) {
            $scope.responseEditError = response;
        });
    };

// Auto Complete
    $scope.autoComplete = function () {
        var videoId = $scope.editData.data.attributes.youtubeId;
        var youtubeApi = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id='+ videoId + '&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';
        $http({
            method: 'GET',
            url: youtubeApi
        }).then(function successCallback(response) {
            $scope.editData = {
                'data': {
                    'attributes': {
                        'playlistId': $scope.videoData.attributes.playlistId,
                        'youtubeId': $scope.videoData.attributes.youtubeId,
                        'name': response.data.items[0].snippet.title,
                        'description': response.data.items[0].snippet.description,
                        'keywords': angular.toJson(response.data.items[0].snippet.tags, 3),
                        'thumbnail': response.data.items[0].snippet.thumbnails.medium.url
                    }
                }
            };
        }, function errorCallback(response) {
            console.log(response);
        })
    };

    $rootScope.choosenPlaylist = {
        attributes: {
            playlistId: '',
            name: ''
        }
    };
    $scope.linkToPlaylist = function (plId) {
        $rootScope.page = 'choosenPlaylistPage';
        $rootScope.choosenPlaylist.attributes.playlistId = plId;
        $rootScope.choosenPlaylist.attributes.name = plId;
        $timeout(function () {
            $location.path('/playlist');
        }, 200);
    }

});