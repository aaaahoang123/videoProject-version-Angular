var apiUrl = "https://youtube-video-api-1608.appspot.com/youtube/api";

/* Validate ID*/
function isValidVideoID() {
    var isValid = false;
    var pattern = /[^A-Za-z0-9_-]/;
    var videoId = $("#videoId").val();
    if (videoId.length < 10) {
        $("#alertVideoID").html('<div class="alert alert-warning text-center"><span class="glyphicon glyphicon-warning-sign"></span><strong>  ID video phải dài hơn 10 ký tự!</strong></div>');
        $("#checkRequest").attr("disabled", "true");
        isValid = false;
    }

    else if (pattern.test(videoId)) {
        $("#alertVideoID").html('<div class="alert alert-warning text-center"><span class="glyphicon glyphicon-warning-sign"></span><strong>   ID video không được phép có ký tự đặc biệt</strong></div>');
        $("#checkRequest").attr("disabled", "true");
        isValid = false;

    }
    else {
        $("#alertVideoID").html('<div class="alert alert-info text-center"><span class="glyphicon glyphicon-info-sign"></span><strong>    ID video hợp lệ!</strong> Vui lòng ấn kiểm tra để xác thực</div>');
        $("#checkRequest").removeAttr("disabled");
        isValid = true;
    }
    return isValid;
}

/* API YouTube to validate the ID after local validate*/
function checkIdWithYouTube() {
    var videoId = $("#videoId").val();
    var apiYT = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id='+ videoId + '&key=AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M';

    $.ajax (
        {
            url: apiYT,
            type: 'GET',
            success: function (data) {

                if (data.pageInfo.totalResults != 0) {
                    $("#alertVideoID").html('<div class="alert alert-success text-center"><span class="glyphicon glyphicon-ok-circle"></span><strong>   ID video được xác thực</strong></div>');
                    $("#checkRequest").val("Xác Thực");
                    $("#checkRequest").attr("class", "btn btn-success");
                    $("#checkRequest").attr("disabled", "true");
                    $("#videoId").attr("disabled", "true");
                }
                else {
                    $("#alertVideoID").html('<div class="alert alert-danger text-center"><span class="glyphicon glyphicon-minus-sign"></span><strong>   ID video của bạn không tồn tại</strong></div>');
                    console.log("YouTube ID doesn't exist");
                }
            },
            error: function () {
                console.log('Video ID isn\'t validated');
            }
        }
    );
    /*
    $.get ("https://www.googleapis.com/youtube/v3/videos", {
            part: "contentDetails",
            id: videoId,
            key: "AIzaSyBStdhzhkK8ne1tqsUz4A8j9axNi0NqE_M"
        }, /*get the data from Google API*
        function (data) {
         } */
}


/* Validate video Name*/

function isValidVideoName() {
    var isValid;
    var pattern = /\S/;
    var videoName = $("#video-name").val();

    if (videoName.length < 3) {

        $("#alertVideoName").html('<div class="alert alert-warning text-center"><span class="glyphicon glyphicon-warning-sign"></span><strong>   Tên Video quá ngắn</strong></div>');
        isValid = false;
    }
    else if (videoName.length > 50) {

        $("#alertVideoName").html('<div class="alert alert-warning text-center"><span class="glyphicon glyphicon-warning-sign"></span><strong>   Vui lòng nhập tên video trong khoảng 3 - 50 ký tự</strong></div>');
        isValid = false;
    }
    else if (pattern.test(videoName)) {
        $("#alertVideoName").html('<div class="alert alert-success text-center"><span class="glyphicon glyphicon-ok-circle"></span><strong>   Tên video hợp lệ</strong></div>');
        isValid = true;
    }
    else {
        $("#alertVideoName").html('<div class="alert alert-warning text-center"><span class="glyphicon glyphicon-warning-sign"></span><strong>   Tên video không được để trống</strong></div>');
        isValid = false;
    }

    return isValid;
}



function categoryResult() {
    var category = $(".category");
    var result = "";

    for (var i = 0; i < category.length; i++) {
        if (category[i].checked === true) {
            result += category[i].value + ' ';
        }
    }
    return result;
}




function isValidForm() {
    var validvideoName = isValidVideoName();
    var validvideoID = isValidVideoID();
    var checkRequest = $("checkRequest").val();
    var valid = false;

    if (validvideoID === true && validvideoName === true && checkRequest === "Xác Thực") {
        valid = true;
    }
    return valid;
}

function postVideo() {
    var videoId = $('#videoId').val();
    var name = $('#name').val();
    var description = $('#description').val();;
    var keywords = $('#keywords').val();
    var category = categoryResult();
    var genre = $('#genre').val();
    var authorName = $('#authorName').val();
    var authorEmail = $('#authorEmail').val();
    var time = new Date();
    var date = time.getDate();
    if (date < 10) {
        date = '0' + date;
    }
    var month = time.getMonth() + 1;
    var year = time.getFullYear();
    var hour = time.getHours();
    var minute = time.getMinutes();
    var birthday = date + '/' + month + '/' + year + '  ' + hour + ':' + minute;

    var video = {
        "videoId": videoId,
        "name": name,
        "description": description,
        "keywords": keywords,
        "category": category,
        "genre": genre,
        "authorName": authorName,
        "authorEmail": authorEmail,
        "birthday": birthday

    };

    console.log(video);
    $.ajax(
        {
            url: apiUrl, //địa chỉ api
            data: JSON.stringify(video),
            type: 'POST',
            success: function(data, status) {
                $("#alert").html('<div class="alert alert-success"><strong>Thành Công!</strong> Đã lưu Video với tên ' + name + '</div>');
            },
            error: function() {
                $("#alert").html('<div class="alert alert-danger"><strong>Thất Bại!</strong> Xảy ra lỗi khi đăng tải Video</div>');
            }
        })
}

/*Validate and Post the Form*/

function handleForm() {

    var isValid = isValidForm();
    console.log(isValid);
    if (isValid === true)
    {
        postVideo();
    }
}

/*Get the video fom API*/

function getVideo() {
    $.ajax(
        {
            url: apiUrl, //địa chỉ api
            type: 'GET',
            success: function(data, status) {
                console.log(data);
                var appendHTML = '';
                for (var i=0; i < data.length; i++) {


                    var pattern = /['"]/;
                    nameLink = data[i].name.replace(pattern, '\\\''); /* Repalce the special symbol ' and " in the name to put in the function play()*/
                    appendHTML += '<li class="col-lg-3 col-sm-4 col-xs-6">';
                    appendHTML += '<a href="#" title=\'' + data[i].name + '\' data-toggle="modal" data-target="#myModal" onclick="play(\'' + data[i].videoId + '\', \'' + nameLink + '\');">';
                    appendHTML += '<img src="https://i.ytimg.com/vi/' + data[i].videoId + '/hqdefault.jpg" alt=\"' + data[i].videoId + '\" class="img-responsive" height="130px">';
                    appendHTML += '<h2>' + data[i].name + '</h2>';
                    appendHTML += '<span class="glyphicon glyphicon-play-circle"></span>';
                    appendHTML += '</a>';
                    appendHTML += '</li>';



                }

                document.getElementById("alert").innerHTML = '<div class="alert alert-success fade in"><strong>Thành Công!</strong> Đã load xong Video</div>';
                $('#video').html(appendHTML);
            },
            error: function() {

                $("#alert").html('<div class="alert alert-danger"><strong>Thất Bại!</strong> Xảy ra lỗi khi load Video</div>');
            }
        })
}

/*delete video*/

function deleteAjax(id) {
    $.ajax({
        url: 'https://youtube-video-api-1608.appspot.com/youtube/api?id=' + id,
        type: 'DELETE',
        success: function() {
            $("#alertModal").modal();
            $("#alertModalBody").html('<div class="alert alert-success"><strong>Thành Công!</strong> Đã xóa Video</div>');
        },
        error: function() {
            $("#alertModal").modal();
            $("#alertModalBody").html('<div class="alert alert-danger"><strong>Thất Bại!</strong> Video chưa được xóa</div>');
        }
    })
}

/*Play the video*/
function play(id,name) {
    var link = "https://www.youtube.com/embed/" + id + "?autoplay=1";

    document.getElementsByClassName("video-title")[0].innerHTML = name;
    document.getElementsByClassName("video-container")[0].innerHTML = '<iframe class="embed-responsive-item" id="videoEmbed" src=\"' + link + '\" allowfullscreen></iframe>';
    document.getElementById("videoFunction").innerHTML = '<button type="button" class="btn btn-danger" role="button" onclick="deleteAjax(\'' + id + '\'); refreshBtn();"><span class="glyphicon glyphicon-remove"></span> Xóa</button><!--THE TWO BUTTON--><button type="button" class="btn btn-primary" role="button"><span class="glyphicon glyphicon-pencil"></span> Sửa</button>';

}


/*close and clear the modal*/

function clearModal() {
    document.getElementsByClassName("video-container")[0].innerHTML = "";
}

/*reset the Form*/
function resetVideoForm() {
    document.getElementById("alertVideoID").innerHTML = "";
    document.getElementById("alertVideoName").innerHTML = "";
    document.getElementById("videoId").removeAttribute("disabled");
    document.getElementById("checkRequest").className = "btn btn-primary";
    document.getElementById("checkRequest").value = "Kiểm Tra";

}
/*The button that refresh the page*/
function refreshBtn() {
    setTimeout(function() {
        location.reload();
    }, 2000);
}