VideoPlayerApp.controller('VideoPlayerController', function ($scope, $http,$sce, $rootScope, $location, $timeout) {
    /*Youtube video for review*/
    $scope.uploadingVideo = false;
    $scope.downloadingVideo = true;
    $scope.uploadSuccess = false;
    $scope.userToken = localStorage.getItem('token');
    $scope.youtubeKeyword = "";
    $scope.maxResults = 12;

    $scope.searchVideo = function () {
      $scope.maxResults = 12;
      $scope.loadVideofromYT();
    };
    $scope.seemoreVideo = function () {
        $scope.maxResults += 8;
        $scope.loadVideofromYT();
    };
    $scope.getTopTrendingForSlideShow = function () {
        $http({
            method: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=3&regionCode=VN&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M'
        }).then(function successCallback(response) {
            $scope.topTrendingVideos = response.data.items;
        }, function errorCallback(reponse) {
            console.log(reponse);
        })
    };
    $scope.loadVideofromYT = function () {
        $scope.downloadingVideo = true;
        $http({
            method: 'GET',
            url: 'https://content.googleapis.com/youtube/v3/search?q=' + $scope.youtubeKeyword + '&videoEmbeddable=true&maxResults=' + $scope.maxResults + '&type=video&videoSyndicated=true&part=snippet&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M'
        }).then(function successCallBack(response) {
            var videosArray = new Array();
            for (var i=0; i<response.data.items.length; i++) {
                var video = {
                    'attributes': {
                        'description': response.data.items[i].snippet.description,
                        'youtubeId': response.data.items[i].id.videoId,
                        'name': response.data.items[i].snippet.title,
                        'thumbnail': response.data.items[i].snippet.thumbnails.medium.url,
                        'createdTimeMLS': new Date(response.data.items[i].snippet.publishedAt).toLocaleDateString()
                    }
                };
                videosArray.push(video);
            }
            $timeout(function () {
                $scope.downloadingVideo = false;
                $scope.videosArray = videosArray;
            }, 1000);
        }, function errorCallback(response) {
            console.log(response);
        });
    };
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
                        $scope.playlistArray.push(response.data.data[i]);
                    }
                }
            }, function errorCallBack(response) {
                console.log(response);
            });
        }

    };

// Play video and change the object to quick upload in the Modal
    $scope.embedUrl = "";
    $scope.playVideo = function (youtubeId, name, description, thumbnail) {
        $scope.embedUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + youtubeId);
        $scope.videoName = name;
        $scope.videoDataToSend = {
            "data":{
                "type":"Video",
                "attributes":{
                    "youtubeId": youtubeId,
                    "name": name,
                    "description": description,
                    "playlistId": "",
                    "thumbnail": thumbnail
                }
            }
        };
        if ($scope.userToken !== null) {
            $scope.quickAddPlaylistName = $scope.playlistArray[0].attributes.name;
            $scope.videoDataToSend.data.attributes.playlistId = $scope.playlistArray[0].id
        }
    };

// Change the playlist in quick access Modal
    $scope.chooseThePlaylist = function (plId, plName) {
      $scope.videoDataToSend.data.attributes.playlistId = plId;
      $scope.quickAddPlaylistName = plName;
    };
// Quick access in the Modal
    $scope.quickAccessVideo = function () {
        $scope.uploadingVideo = true;
        $http ({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            url: videoApi,
            data: $scope.videoDataToSend
        }).then(function successCallback(response) {
            $scope.uploadingVideo = false;
            $scope.uploadSuccess = true;
            $timeout (function () {
                $scope.uploadSuccess = false;
            }, 2000);
        }).then(function errorCallback(response) {
            $scope.uploadingVideo = false;
            console.log(response);
        })
    };

    $scope.clearModal = function () {
        $scope.VideoID = '';
        $scope.videoName = '';
        $scope.embedUrl = '';
    };
    $scope.deletePlaylist = function(id){
        $http({
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            url: playlistApi + '/' + id,
        }).then(function successCallback(response) {
            $scope.loadUserPlaylist();
        }, function errorCallback(errorResponse) {
            console.log(errorResponse);
        });
    };
    $scope.createPlaylistDataToSend = function () {
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
    };
    /* Hidden the alert */
    $scope.addPlaylistSuccess = false;
    // Submit the new playlist
    $scope.resetForm = function () {
        angular.copy({}, $scope.playlistData);
        $scope.addPlaylistSuccess=false;
    };
    $scope.submitNewPlaylist = function(){
        $http({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            url: playlistApi,
            data: $scope.playlistData
        }).then(function successCallback(response) {
            $scope.addPlaylistSuccess = true;
            $timeout (function () {
                $("#createPlaylistModal").modal("hide");
                $scope.resetForm();
            }, 1000);
            $scope.loadUserPlaylist();
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.loadnewUploadVideo = function () {
        if (localStorage.getItem('token') !== null) {
            $http({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                url: videoApi + '?page=1&limit=3'
            }).then(function successCallback(response) {
                $scope.yourNewVideo = response.data.data;
                for (var i=0; i<$scope.yourNewVideo.length; i++) {
                    $scope.yourNewVideo[i].attributes.createdTimeMLS = new Date($scope.yourNewVideo[i].attributes.createdTimeMLS).toLocaleDateString();
                }
            }, function errorCallback(response) {
                console.log(response);
            });
        }
       
    };
});