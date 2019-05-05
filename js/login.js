var request_url = getRelativeURL() + "/request.php";

function getRelativeURL() {
    var url = document.location.toString();
    var arrUrl = url.split("://");
    var start = arrUrl[0].indexOf("/");
    var reUrl = arrUrl[1].substring(start);
    if (reUrl.indexOf("?") != -1) {
        reUrl = reUrl.split("?")[0];
    }
    var end = reUrl.lastIndexOf("/");
    reUrl = reUrl.substring(0, end);
    reUrl = reUrl.replaceAll(/\/\/*/, "/");
    return arrUrl[0] + "://" + reUrl;
}

$("#LoginBtn").on("click", function () {
    console.log('sssssssss');
    if ($("#UserName").val() == "") {
        $("#WarningModal .modal-body").html("用户名不可为空");
        $('#WarningModal').modal('show');
        $("#UserName").focus();

        return;
    }
    if ($("#PassWord").val() == "") {
        $("#WarningModal .modal-body").html("密码不能为空");
        $('#WarningModal').modal('show');
        $("#PassWord").focus();
        return;
    }
    else {
        var map = {
            action: 'UserLogin',
            body: {
                uname: $("#UserName").val(),
                password: b64_sha1($("#PassWord").val()),
            },
            type: 'query'
        };
        var jump_to_other_page = function (res) {
            var resp = res.data;
            var status = res.status;
            if (status == 'false') {
                $("#WarningModal .modal-body").html(res.msg);
                $('#WarningModal').modal('show');
                return;
            }
            else {
                if (resp.type == "company") {
                    window.location.href = "index.html?session=" + resp.session;
                }
                else {
                    window.open("map.html");
                    window.location.href = "index.html?session=" + resp.session;
                }
            }
        };
        JQ_post(request_url, JSON.stringify(map), jump_to_other_page);
    }
});

function JQ_post(url, request, callback) {
    jQuery.post(url, request, function (data) {
        var result = JSON.parse(data);
        callback(result);
    });
}