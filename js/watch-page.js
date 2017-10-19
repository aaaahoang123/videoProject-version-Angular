VideoPlayerApp.controller('watchPageController', function ($scope, $rootScope, $http, $location, $sce, $timeout, $route) {
    $scope.isErrorVideo = false;
    $scope.editSucess = false;
    $scope.editError = false;
    $scope.completeLoadingVideoData = false;
    $scope.videoIsInPlaylist = false;
    $scope.userToken = localStorage.getItem('token');
    $scope.theId = $location.search().id;
    $scope.theYoutubeId = $location.search().youtubeId;
    $scope.thePlaylisId = $location.search().playlistId;


    $scope.loadUserPlaylist = function () {
        if ($scope.userToken !== null) {
            $http({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': $scope.userToken
                },
                url: playlistApi
            }).then(function successCallBack(response) {
                $scope.playlistArray = [{
                    "attributes": {
                        "name": "Playlist tổng hợp",
                        'thumbnailUrl': "http://www.mulierchile.com/all/all-003.jpg"
                    },
                    "id": "0"
                }];
                if (response.data.data !== undefined) {
                    for (var i=0; i<response.data.data.length; i++) {
                        if (response.data.data[i].id !== $scope.thePlaylisId) {
                            $scope.playlistArray.push(response.data.data[i]);
                        }
                    }
                }
                // Đã có playlist array để gợi ý
            }, function errorCallBack(response) {
                console.log(response);
            });
        }
    };

    $scope.createVideoData = function () {
        $scope.videoData = {
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
        }
    };

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

    // When play video in playlist or play a playlist
    if ($scope.theId !== undefined || $scope.theId === undefined && $scope.thePlaylisId !== undefined && $scope.theYoutubeId === undefined) {
        $scope.videoIsInPlaylist = true;
        /*Get video Data*/
        if ($scope.theId !== undefined) {
            $http({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                url: videoApi + '/' + $scope.theId
            }).then(function successCallBack(response) {
                $scope.videoData = response.data.data;
                $scope.videoData.attributes.createdTimeMLS = new Date($scope.videoData.attributes.createdTimeMLS).toLocaleDateString();
                $scope.srcLink = 'https://www.youtube.com/embed/' + $scope.videoData.attributes.youtubeId + '?autoplay=1';
                $scope.srcLink = $sce.trustAsResourceUrl($scope.srcLink);
                if  ($scope.videoData.attributes.keywords !== undefined) {
                    $scope.videoData.attributes.keywords = $scope.videoData.attributes.keywords.replace('[', '');
                    $scope.videoData.attributes.keywords = $scope.videoData.attributes.keywords.replace(']', '');
                }
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
        }
        // Get the first video if play by playlist
        else {
            $http({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                url: videoApi + '?playlist=' + $scope.thePlaylisId + '&page=1&limit=100'
            }).then(function successCallBack(response) {
                if (response.data.data !== undefined) {
                    $scope.videoData = response.data.data[0];
                    $scope.videoData.attributes.createdTimeMLS = new Date($scope.videoData.attributes.createdTimeMLS).toLocaleDateString();
                    $scope.srcLink = 'https://www.youtube.com/embed/' + $scope.videoData.attributes.youtubeId + '?autoplay=1';
                    $scope.srcLink = $sce.trustAsResourceUrl($scope.srcLink);
                    if  ($scope.videoData.attributes.keywords !== undefined) {
                        $scope.videoData.attributes.keywords = $scope.videoData.attributes.keywords.replace('[', '');
                        $scope.videoData.attributes.keywords = $scope.videoData.attributes.keywords.replace(']', '');
                    }

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
                }
                $scope.completeLoadingVideoData = true;
            }, function errorCallBack(response) {
                $scope.alertError = response.data.errors[0];
                $scope.isErrorVideo = true;
            });
        }


        /*Get all the video in the same playlist*/
        $http({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            url: videoApi + '?playlist=' + $scope.thePlaylisId + '&page=1&limit=30'
        }).then(function successCallback(response) {
            $scope.videosArray = response.data.data;
            if ($scope.videosArray !== undefined) {
                $scope.videosArray = $scope.videosArray.filter(function (t) {
                    return t.id !== $scope.videoData.id;
                });
                for (var i=0; i<$scope.videosArray.length; i++) {
                    $scope.videosArray[i].attributes.createdTimeMLS = new Date($scope.videosArray[i].attributes.createdTimeMLS).toLocaleDateString();
                }
            }
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
                url: videoApi + '/' + $scope.theId,
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
                url: videoApi + '/' + $scope.theId
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
    }

    else if ($scope.theYoutubeId !== undefined) {
        $scope.videoIsInPlaylist = false;
        $http({
            method: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id='+ $scope.theYoutubeId + '&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M'
        }).then(function successCallBack(response) {
            $scope.videoData = {
                    'attributes': {
                        'youtubeId': response.data.items[0].id,
                        'playlistId': "",
                        'createdTimeMLS': response.data.items[0].snippet.publishedAt,
                        'name': response.data.items[0].snippet.title,
                        'description': response.data.items[0].snippet.description,
                        'keywords': angular.toJson(response.data.items[0].snippet.tags, 3),
                        'thumbnail': response.data.items[0].snippet.thumbnails.medium.url
                    }
            };
            $scope.videoData.attributes.createdTimeMLS = new Date($scope.videoData.attributes.createdTimeMLS).toLocaleDateString();
            $scope.srcLink = 'https://www.youtube.com/embed/' + $scope.videoData.attributes.youtubeId + '?autoplay=1';
            $scope.srcLink = $sce.trustAsResourceUrl($scope.srcLink);
            if  ($scope.videoData.attributes.keywords !== undefined) {
                $scope.videoData.attributes.keywords = $scope.videoData.attributes.keywords.replace('[', '');
                $scope.videoData.attributes.keywords = $scope.videoData.attributes.keywords.replace(']', '');
            }
            $scope.editData = {
              'data': $scope.videoData
            };
            //Then get the sub video for this shit a nest HTTP truely
            $http({
                method: 'GET',
                url: 'https://content.googleapis.com/youtube/v3/search?q=' + response.data.items[0].snippet.tags[0] + '&videoEmbeddable=true&maxResults=12&type=video&videoSyndicated=true&part=snippet&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M'
            }).then(function successCallBack(response) {
                $scope.videosArray = new Array();
                for (var i=0; i<response.data.items.length; i++) {
                    var video = {
                        'id': response.data.items[i].id.videoId,
                        'attributes': {
                            'description': response.data.items[i].snippet.description,
                            'youtubeId': response.data.items[i].id.videoId,
                            'name': response.data.items[i].snippet.title,
                            'thumbnail': response.data.items[i].snippet.thumbnails.medium.url,
                            'createdTimeMLS': new Date(response.data.items[i].snippet.publishedAt).toLocaleDateString()
                        }
                    };
                    $scope.videosArray.push(video);
                }
            }, function errorCallback(response) {
                console.log(response);
            });
        }, function errorCallBack(response) {
            console.log(response);
        });

    }
});