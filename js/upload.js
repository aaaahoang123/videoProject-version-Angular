VideoPlayerApp.controller('UploadFormController', function ($scope, $http, $rootScope) {
    /*Get the playlist*/
    $scope.choosenPlaylist = $rootScope.choosenPlaylist;
    if ($rootScope.choosenPlaylist === undefined) {
        $scope.choosenPlaylist = {
            attributes: {}
        }
    }
    $http({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        url: playlistApi
    }).then(function successCallback(response) {
        $scope.playlistArray = response.data.data;
        for (var i=0; i<$scope.playlistArray.length; i++) {
            if ($scope.playlistArray[i].id === $scope.choosenPlaylist.attributes.playlistId) {
                $scope.videoData.data.attributes.playlistId = $scope.choosenPlaylist.attributes.playlistId;
            }
        }
    }, function errorCallback(response) {
        console.log(response);
    });


    /*Validate Id with youtube Api*/
    $scope.existId = false;
    $scope.responseIdNotExist = false;

    $scope.validateIdWithYT = function () {
        var videoId = $scope.videoData.data.attributes.youtubeId;
        var youtubeApi = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id='+ videoId + '&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';
            $http({
                method: 'GET',
                url: youtubeApi
            }).then(function successCallback(response) {
                if (response.data.pageInfo.totalResults !== 0) {
                    $scope.existId = true;
                }
                else {
                    $scope.responseIdNotExist = true;
                }
            }, function errorCallback(response) {
                    console.log(response);
            })
    };

    /*Upload the video*/
    $scope.uploadSuccess = false;

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
    };
    $scope.submit = function () {
        if ($scope.videoData.data.attributes.thumbnail === "") {
            $scope.videoData.data.attributes.thumbnail = 'https://i.ytimg.com/vi/' + $scope.videoData.data.attributes.youtubeId + '/hqdefault.jpg';
        }
        $http ({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            url: videoApi,
            data: $scope.videoData
        }).then(function successCallback(response) {
            $scope.uploadSuccess = true;
            console.log(response);
            setTimeout(function () {
                location.reload();
            }, 1000)
        }).then(function errorCallback(response) {
            console.log(response);
        })
    };

    $scope.autoCompleteForm = function () {
        var videoId = $scope.videoData.data.attributes.youtubeId;
        var youtubeApi = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id='+ videoId + '&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';
        $http({
            method: 'GET',
            url: youtubeApi
        }).then(function successCallback(response) {
            console.log(response);
            $scope.videoData.data.attributes.name = response.data.items[0].snippet.title;
            $scope.videoData.data.attributes.description = response.data.items[0].snippet.description;
            $scope.videoData.data.attributes.thumbnail = response.data.items[0].snippet.thumbnails.medium.url;
            $scope.videoData.data.attributes.keywords = angular.toJson(response.data.items[0].snippet.tags, 3);

        }, function errorCallback(response) {
            console.log(response);
        })

    };
    $scope.resetForm = function (model) {
        $scope.existId = false;
        $scope.responseIdNotExist = false;
        angular.copy({}, model);
    }
});