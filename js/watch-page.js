VideoPlayerApp.controller('watchPageController', function ($scope, $http, $location, $sce, $timeout, $route) {
    $scope.isErrorVideo = false;
    $scope.editSucess = false;
    $scope.editError = false;
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

    /* Get the array Playlist for Edit*/
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
        console.log('Error: ' + response.data.errors[0].code + ' ' + response.data.errors[0].title + ' ' + response.data.errors[0].detail);
    });


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
        $scope.srcLink = 'https://www.youtube.com/embed/' + $scope.videoData.attributes.youtubeId;
        $scope.srcLink = $sce.trustAsResourceUrl($scope.srcLink);
        $scope.videoData.attributes.keywords = $scope.videoData.attributes.keywords.replace('[', '');
        $scope.videoData.attributes.keywords = $scope.videoData.attributes.keywords.replace(']', '');
        /*Now, the editData*/
        $scope.editData.data.attributes.playlistId = response.data.data.attributes.playlistId;
        $scope.editData.data.attributes.youtubeId = response.data.data.attributes.youtubeId;
        $scope.editData.data.attributes.name = response.data.data.attributes.name;
        $scope.editData.data.attributes.description = response.data.data.attributes.description;
        $scope.editData.data.attributes.keywords = response.data.data.attributes.keywords;
        $scope.editData.data.attributes.thumbnail = response.data.data.attributes.thumbnail;
    }, function errorCallBack(response) {
        $scope.alertError = response.data.errors[0];
        $scope.isErrorVideo = true;
    });

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
        console.log($scope.videosArray);
    }, function errorCallback(response) {
        console.log('Error: ' + response.data.errors[0].code + ' ' + response.data.errors[0].title + ' ' + response.data.errors[0].detail);
    });
    /*Edit Function*/

    $scope.editVideo = function () {
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

    $scope.resetEditForm = function () {
        angular.copy({}, $scope.editData.attributes);
        $scope.editData.attributes = {
          youtubeId: $scope.videoData.attributes.youtubeId
        };

        console.log($scope.editData.attributes.youtubeId);
    }



});