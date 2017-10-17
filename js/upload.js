VideoPlayerApp.controller('UploadFormController', function ($scope, $http, $rootScope, $location) {
    /*Get the playlist*/
    $scope.choosenPlaylist = $rootScope.choosenPlaylist;
    if ($rootScope.choosenPlaylist === undefined) {
        $scope.choosenPlaylist = {
            attributes: {

            }
        }
    }

    $http({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        url: playlistApi
    }).
    then(function successCallback(response) {
        $scope.playlistArray = response.data.data;
        if ($scope.playlistArray === undefined) {
            $('#alertModal').modal();
        }
        else {
            if ($rootScope.choosenPlaylist !== undefined) {
                $scope.videoData.data.attributes.playlistId = $rootScope.choosenPlaylist.attributes.playlistId;
            }
            else {
                $scope.videoData.data.attributes.playlistId = "0";
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
        var youtubeApi = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id='+ videoId + '&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';
            $http({
                method: 'GET',
                url: youtubeApi
            }).then(function successCallback(response) {
                if (response.data.items.length !== 0) {
                    $scope.existId = true;
                    $scope.ytCallbackData = response.data.items[0];
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
    $scope.urlYoutube = "";
    $scope.convertToId = function() {
        var pattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i;
        var id = $scope.urlYoutube.match(pattern);
        $scope.videoData.data.attributes.youtubeId = id[5];
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
            $scope.videoData.data.attributes.name = $scope.ytCallbackData.snippet.title;
            $scope.videoData.data.attributes.description = $scope.ytCallbackData.snippet.description;
            $scope.videoData.data.attributes.thumbnail = $scope.ytCallbackData.snippet.thumbnails.medium.url;
            $scope.videoData.data.attributes.keywords = angular.toJson($scope.ytCallbackData.snippet.tags, 3);
    };
    $scope.resetForm = function (model) {
        $scope.existId = false;
        $scope.responseIdNotExist = false;
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
        $scope.urlYoutube = "";
    };
    $scope.addPlaylist = function () {
        $location.path('/playlist');
        $rootScope.page = 'addPlaylist';
    }
});