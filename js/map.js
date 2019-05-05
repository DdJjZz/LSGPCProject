// 百度地图API功能
var request_url = getRelativeURL() + "/request.php";
var wait_time_short = 500;
var map = new BMap.Map('allmap');

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

function JQ_post(url, request, callback) {
    jQuery.post(url, request, function (data) {
        // log(data);
        var result = JSON.parse(data);
        if (result.status == "false") {
            show_alarm_module(true, result.msg, null);
            return;
        }
        if (result.auth == "false") {
            show_alarm_module(true, "您没有进行此操作的权限：" + result.msg, null);
            return;
        }
        callback(result);
    });
}

function show_alarm_module(ifalarm, text, callback) {
    if (ifalarm) {
        $("#UserAlertModalLabel").text("警告");
        $("#UserAlertModalContent").empty();
        $("#UserAlertModalContent").append("<strong>警告！</strong>" + text);
    } else {
        $("#UserAlertModalLabel").text("通知");
        $("#UserAlertModalContent").empty();
        $("#UserAlertModalContent").append("<strong>通知：</strong>" + text);
    }
    modal_middle($('#UserAlarm'));
    $('#UserAlarm').modal('show');
    if (callback === null) {
        emptyfunction = function () {
        };
        $('#UserAlarm').on('hide.bs.modal', emptyfunction);
    } else {
        //console.log("hide.bs.modal");
        var countevent = 0;
        $('#UserAlarm').on('hide.bs.modal', function () {
            if (++countevent == 1) {
                setTimeout(callback, 500);
            }
        });
    }
}

function modal_middle(modal) {

    setTimeout(function () {
        var _modal = $(modal).find(".modal-dialog");
        if (parseInt(($(window).height() - _modal.height()) / 2) > 0) {

            _modal.animate({'margin-top': parseInt(($(window).height() - _modal.height()) / 2)}, 300);
        }
    }, wait_time_short);
}

$(document).ready(function () {
    console.log(request_url);
    show_map(map, 116.404, 39.915);
    get_user_loaction();
    get_the_three_regions_largest_consumption();
    get_today_task_number();
    get_new_task_table();
    // get_today_all_task_route();
    var height = document.body.clientHeight;
    var width = document.body.clientWidth;
    draw_block_height_weight(height, width);
    setInterval(function () {
        $("#PageNowTime").empty();
        $("#PageNowTime").append(get_now_time());
    }, 500);

    setTimeout(function () {
        get_today_all_task_route();
    }, 6000);

    setInterval(function () {
        get_the_three_regions_largest_consumption();
    }, 60000);
    setInterval(function () {
        get_today_task_number();
    }, 60100);
    setInterval(function () {
        get_new_task_table();
    }, 60200);
    setInterval(function () {
        get_today_all_task_route();
    }, 1800000);

});

window.onload = function () {
    PieForPhosAll();
    HistogramForYear();
    MixedChartForMounth();
    TransverseBarChart();
};

window.onresize = function () {
    var height = document.body.clientHeight;
    var width = document.body.clientWidth;
    draw_block_height_weight(height, width);
};

function draw_block_height_weight(height, width) {
    var default_value = 60;
    $("#block_1").css("top", default_value + "px");
    $("#block_1").css("height", height * 0.09 + "px");
    $("#block_2").css("top", default_value + height * 0.09 + "px");
    $("#block_2").css("height", height * 0.09 + "px");
    $("#block_3").css("top", default_value + height * 0.18 + "px");
    $("#block_3").css("height", height * 0.09 + "px");
    $("#block_4").css("top", default_value + 2 + height * 0.27 + "px");
    $("#block_4").css("height", height * 0.4 + "px");
    $("#block_5").css("top", default_value + 4 + height * 0.67 + "px");
    $("#block_5").css("height", height - default_value - 4 - height * 0.67 + "px");
    $("#block_6").css("height", height - default_value - 4 - height * 0.67 + "px");
    $("#block_6").css("left", width * 0.24 + 2 + "px");
    $("#block_7").css("height", height - default_value - 4 - height * 0.67 + "px");
    $("#block_7").css("left", width * 0.49 + 2 + "px");
    $("#block_8").css("height", height - default_value - 4 - height * 0.67 + "px");
    $("#block_8").css("left", width * 0.74 + 2 + "px");
}

function get_user_loaction() {
    // 百度地图API功能
    // var map = new BMap.Map("allmap");
    // var point = new BMap.Point(116.331398, 39.897445);
    // map.centerAndZoom(point, 12);
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            console.log(r.point);
            // var mk = new BMap.Marker(r.point);
            // map.addOverlay(mk);
            show_map(map, r.point.lng, r.point.lat);
            // map.panTo(r.point);
        }
    }, {enableHighAccuracy: true});
}

function show_map(map, longithde, lagitude) {
    // var map = new BMap.Map('allmap');
    map.centerAndZoom(new BMap.Point(longithde, lagitude), 13);
    // map.addControl(new BMap.NavigationControl());        // 添加平移缩放控件
    // map.addControl(new BMap.ScaleControl());             // 添加比例尺控件
    map.addControl(new BMap.OverviewMapControl());       //添加缩略地图控件
    map.enableScrollWheelZoom();                         //启用滚轮放大缩小

    var styleJson = [
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": "#021019"
            }
        },
        {
            "featureType": "highway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "highway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#147a92"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#0b3d51"
            }
        },
        {
            "featureType": "local",
            "elementType": "geometry",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#08304b"
            }
        },
        {
            "featureType": "railway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "railway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#08304b"
            }
        },
        {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
                "lightness": -70
            }
        },
        {
            "featureType": "building",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#857f7f"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "building",
            "elementType": "geometry",
            "stylers": {
                "color": "#022338"
            }
        },
        {
            "featureType": "green",
            "elementType": "geometry",
            "stylers": {
                "color": "#062032"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": "#1e1c1c"
            }
        },
        {
            "featureType": "manmade",
            "elementType": "geometry",
            "stylers": {
                "color": "#022338"
            }
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#2da0c6",
                "visibility": "on"
            }
        }
    ];
    // maphandler = new BMap.Map("ArmyMap");

    // var styleJson = [{
    //     "featureType": "background",
    //     "elementType": "geometry",
    //     "stylers": {
    //         "color": "#9b9b9bff"
    //     }
    // }, {
    //     "featureType": "land",
    //     "elementType": "geometry",
    //     "stylers": {
    //         "color": "#9b9b9bff"
    //     }
    // }, {
    //     "featureType": "water",
    //     "elementType": "geometry",
    //     "stylers": {
    //         "color": "#ecececff"
    //     }
    // }, {
    //     "featureType": "subwaystation",
    //     "elementType": "geometry",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "subway",
    //     "elementType": "geometry",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "subwaylabel",
    //     "elementType": "labels",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "subwaylabel",
    //     "elementType": "labels.icon",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "local",
    //     "elementType": "labels",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "local",
    //     "elementType": "labels.icon",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "local",
    //     "elementType": "geometry",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "governmentlabel",
    //     "elementType": "labels",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "governmentlabel",
    //     "elementType": "labels.icon",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "airportlabel",
    //     "elementType": "labels",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "airportlabel",
    //     "elementType": "labels.icon",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "road",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "8"
    //     }
    // }, {
    //     "featureType": "road",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "9"
    //     }
    // }, {
    //     "featureType": "road",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "10"
    //     }
    // }, {
    //     "featureType": "road",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "11"
    //     }
    // }, {
    //     "featureType": "road",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "12"
    //     }
    // }, {
    //     "featureType": "road",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "13"
    //     }
    // }, {
    //     "featureType": "road",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "14"
    //     }
    // }, {
    //     "featureType": "road",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "15"
    //     }
    // }, {
    //     "featureType": "road",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "16"
    //     }
    // }, {
    //     "featureType": "road",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "17"
    //     }
    // }, {
    //     "featureType": "road",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "18"
    //     }
    // }, {
    //     "featureType": "road",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "19"
    //     }
    // }, {
    //     "featureType": "highway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "8"
    //     }
    // }, {
    //     "featureType": "highway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "9"
    //     }
    // }, {
    //     "featureType": "highway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "10"
    //     }
    // }, {
    //     "featureType": "highway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "11"
    //     }
    // }, {
    //     "featureType": "highway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "12"
    //     }
    // }, {
    //     "featureType": "highway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "13"
    //     }
    // }, {
    //     "featureType": "highway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "14"
    //     }
    // }, {
    //     "featureType": "highway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "15"
    //     }
    // }, {
    //     "featureType": "highway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "16"
    //     }
    // }, {
    //     "featureType": "highway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "17"
    //     }
    // }, {
    //     "featureType": "highway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "18"
    //     }
    // }, {
    //     "featureType": "highway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "19"
    //     }
    // }, {
    //     "featureType": "nationalway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "8"
    //     }
    // }, {
    //     "featureType": "nationalway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "9"
    //     }
    // }, {
    //     "featureType": "nationalway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "10"
    //     }
    // }, {
    //     "featureType": "nationalway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "11"
    //     }
    // }, {
    //     "featureType": "nationalway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "12"
    //     }
    // }, {
    //     "featureType": "nationalway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "13"
    //     }
    // }, {
    //     "featureType": "nationalway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "14"
    //     }
    // }, {
    //     "featureType": "nationalway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "15"
    //     }
    // }, {
    //     "featureType": "nationalway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "16"
    //     }
    // }, {
    //     "featureType": "nationalway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "17"
    //     }
    // }, {
    //     "featureType": "nationalway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "18"
    //     }
    // }, {
    //     "featureType": "nationalway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "8,19",
    //         "level": "19"
    //     }
    // }, {
    //     "featureType": "provincialway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "9,19",
    //         "level": "9"
    //     }
    // }, {
    //     "featureType": "provincialway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "9,19",
    //         "level": "10"
    //     }
    // }, {
    //     "featureType": "provincialway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "9,19",
    //         "level": "11"
    //     }
    // }, {
    //     "featureType": "provincialway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "9,19",
    //         "level": "12"
    //     }
    // }, {
    //     "featureType": "provincialway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "9,19",
    //         "level": "13"
    //     }
    // }, {
    //     "featureType": "provincialway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "9,19",
    //         "level": "14"
    //     }
    // }, {
    //     "featureType": "provincialway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "9,19",
    //         "level": "15"
    //     }
    // }, {
    //     "featureType": "provincialway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "9,19",
    //         "level": "16"
    //     }
    // }, {
    //     "featureType": "provincialway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "9,19",
    //         "level": "17"
    //     }
    // }, {
    //     "featureType": "provincialway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "9,19",
    //         "level": "18"
    //     }
    // }, {
    //     "featureType": "provincialway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "9,19",
    //         "level": "19"
    //     }
    // }, {
    //     "featureType": "cityhighway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "11"
    //     }
    // }, {
    //     "featureType": "cityhighway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "12"
    //     }
    // }, {
    //     "featureType": "cityhighway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "13"
    //     }
    // }, {
    //     "featureType": "cityhighway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "14"
    //     }
    // }, {
    //     "featureType": "cityhighway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "15"
    //     }
    // }, {
    //     "featureType": "cityhighway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "16"
    //     }
    // }, {
    //     "featureType": "cityhighway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "17"
    //     }
    // }, {
    //     "featureType": "cityhighway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "18"
    //     }
    // }, {
    //     "featureType": "cityhighway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "19"
    //     }
    // }, {
    //     "featureType": "arterial",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "11"
    //     }
    // }, {
    //     "featureType": "arterial",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "12"
    //     }
    // }, {
    //     "featureType": "arterial",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "13"
    //     }
    // }, {
    //     "featureType": "arterial",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "14"
    //     }
    // }, {
    //     "featureType": "arterial",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "15"
    //     }
    // }, {
    //     "featureType": "arterial",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "16"
    //     }
    // }, {
    //     "featureType": "arterial",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "17"
    //     }
    // }, {
    //     "featureType": "arterial",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "18"
    //     }
    // }, {
    //     "featureType": "arterial",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "11,19",
    //         "level": "19"
    //     }
    // }, {
    //     "featureType": "tertiaryway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "13,19",
    //         "level": "13"
    //     }
    // }, {
    //     "featureType": "tertiaryway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "13,19",
    //         "level": "14"
    //     }
    // }, {
    //     "featureType": "tertiaryway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "13,19",
    //         "level": "15"
    //     }
    // }, {
    //     "featureType": "tertiaryway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "13,19",
    //         "level": "16"
    //     }
    // }, {
    //     "featureType": "tertiaryway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "13,19",
    //         "level": "17"
    //     }
    // }, {
    //     "featureType": "tertiaryway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "13,19",
    //         "level": "18"
    //     }
    // }, {
    //     "featureType": "tertiaryway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "13,19",
    //         "level": "19"
    //     }
    // }, {
    //     "featureType": "fourlevelway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "14,19",
    //         "level": "14"
    //     }
    // }, {
    //     "featureType": "fourlevelway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "14,19",
    //         "level": "15"
    //     }
    // }, {
    //     "featureType": "fourlevelway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "14,19",
    //         "level": "16"
    //     }
    // }, {
    //     "featureType": "fourlevelway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "14,19",
    //         "level": "17"
    //     }
    // }, {
    //     "featureType": "fourlevelway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "14,19",
    //         "level": "18"
    //     }
    // }, {
    //     "featureType": "fourlevelway",
    //     "stylers": {
    //         "curZoomRegionId": "0",
    //         "curZoomRegion": "14,19",
    //         "level": "19"
    //     }
    // }, {
    //     "featureType": "scenicspotsway",
    //     "elementType": "geometry",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "vacationway",
    //     "elementType": "geometry",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "lifeservicelabel",
    //     "elementType": "labels",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "lifeservicelabel",
    //     "elementType": "labels.icon",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "transportationlabel",
    //     "elementType": "labels",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "transportationlabel",
    //     "elementType": "labels.icon",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "financelabel",
    //     "elementType": "labels.icon",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "financelabel",
    //     "elementType": "labels",
    //     "stylers": {
    //         "visibility": "off"
    //     }
    // }, {
    //     "featureType": "road",
    //     "elementType": "geometry.fill",
    //     "stylers": {
    //         "color": "#ffffffff"
    //     }
    // }, {
    //     "featureType": "road",
    //     "elementType": "geometry.stroke",
    //     "stylers": {
    //         "color": "#ffffffff"
    //     }
    // },
    //     {
    //         "featureType": "road",
    //         "elementType": "geometry.stroke",
    //         "stylers": {
    //             "color": "#ffffffff"
    //         }
    //     }
    // ];
    map.setMapStyle({styleJson: styleJson});
}

function get_now_time() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var h = now.getHours();
    var M = now.getMinutes();
    var s = now.getSeconds();
    var now_time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + (h < 10 ? "0" + h : h) + ":" + (M < 10 ? "0" + M : M) + ":" + (s < 10 ? "0" + s : s);
    return now_time;
}

function get_now_date() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var now_time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
    return now_time;
}

function PieForPhosAll() {
    var dom = document.getElementById("PieForPhosAll");
    var myChart = echarts.init(dom, 'infographic');
    window.addEventListener("resize", function () {
        myChart.resize();
    });

    var option = {
        tooltip: {
            trigger: 'item',
        },
        legend: {
            // orient: 'vertical',
            // x: 'top',
            // data: ['新增量', '消耗量'],
            textStyle: {
                color: '#FFFFFF',
            }
        },
        dataset: {
            source: [
                ['type', '今日数据', '昨日数据'],
                ['新增量', 0, 0],
                ['消耗量', 0, 0]
            ]
        },

        series: [{
            type: 'pie',
            radius: ['40%', '60%'],
            center: ['29%', '50%'],
            label: {            //饼图图形上的文本标签
                normal: {
                    show: true,
                    position: 'center', //标签的位置
                    textStyle: {
                        fontWeight: 300,
                        fontSize: 16,    //文字的字体大小
                        color: '#FFFFFF',
                    },
                    formatter: '今日数据'
                }
            },
            encode: {
                itemName: 'type',
                value: '今日数据'
            }
        }, {
            type: 'pie',
            radius: ['40%', '60%'],
            center: ['73%', '50%'],
            encode: {
                itemName: 'type',
                value: '昨日数据'
            },
            label: {            //饼图图形上的文本标签
                normal: {
                    show: true,
                    position: 'center', //标签的位置
                    textStyle: {
                        fontWeight: 300,
                        fontSize: 16,    //文字的字体大小
                        color: '#FFFFFF',
                    },
                    formatter: '昨日数据'
                }
            },
        }],
    };
    setTimeout(function () {
        var map = {
            action: "getPoundData",
            body: {
                poundDate: get_now_date()
            },
            type: 'query',
        };

        function draw_pound_page_for_pie(res) {
            var data = res.data;
            option.dataset.source = data;
            myChart.setOption(option);
        }

        JQ_post(request_url, JSON.stringify(map), draw_pound_page_for_pie);
    }, 1000);
    setInterval(function () {
        var map = {
            action: "getPoundData",
            body: {
                poundDate: get_now_date()
            },
            type: 'query',
        };

        function draw_pound_page_for_pie(res) {
            var data = res.data;
            option.dataset.source = data;
            myChart.setOption(option);
        }

        JQ_post(request_url, JSON.stringify(map), draw_pound_page_for_pie);
    }, 60000);
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}


function HistogramForYear() {
    var dom = document.getElementById("HistogramForYear");
    var myChart = echarts.init(dom, 'infographic');
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    var option = {
        title: {
            left: 'center',
            top: '5px',
            text: '各公司消耗量柱状图',
            textStyle: {
                color: "#FFFFFF"
            }
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['初始数据', '初始数据', '初始数据', '初始数据'],
            bottom: "5px",
            textStyle: {
                color: "#FFFFFF",
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                axisLine: {
                    lineStyle: {
                        color: "#FFFFFF"
                    }
                },
                data: ['初始时间', '初始时间', '初始时间', '初始时间', '初始时间', '初始时间']
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: "#FFFFFF"
                    }
                },
            }
        ],
        series: [
            {
                name: '初始数据',
                type: 'bar',
                data: [1, 1, 1, 1, 1, 1]
            },
            {
                name: '初始数据',
                type: 'bar',
                data: [1, 1, 1, 1, 1, 1]
            },
            {
                name: '初始数据',
                type: 'bar',
                data: [1, 1, 1, 1, 1, 1]
            },
            {
                name: '初始数据',
                type: 'bar',
                data: [1, 1, 1, 1, 1, 1]
            }
        ]
    };
    setTimeout(function () {
        var map = {
            action: "getCompanyPound",
            body: {
                companyDate: get_now_date()
            },
            type: "query"
        };

        function draw_company_data_page(res) {
            var data = res.data;
            var month = data.month;
            var comData = data.companyData;
            var company = data.company;
            option.legend.data = company;
            option.xAxis[0].data = month;
            option.title.text = data.title;
            var series = [];
            for (var i = 0; i < comData.length; i++) {
                series.push({
                    name: company[i],
                    type: 'bar',
                    data: comData[i]
                });
            }
            console.log(series);
            option.series = series;
            myChart.setOption(option);
        }

        JQ_post(request_url, JSON.stringify(map), draw_company_data_page);
    }, 1000);
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function MixedChartForMounth() {
    var dom = document.getElementById("MixedChartForMounth");
    var myChart = echarts.init(dom, 'infographic');
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    var option = {
        title: {
            left: 'left',
            top: '5px',
            text: '磷石膏实时数据(5分钟)',
            textStyle: {
                color: "#FFFFFF"
            }
        },
        tooltip: {
            trigger: 'axis',
        },
        grid: [{
            bottom: '10%',
        }
        ],
        legend: {
            data: ['车次', '吨数'],
            top: "5px",
            right: "10px",
            textStyle: {
                color: "#FFFFFF",
            }
        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisLine: {
                    lineStyle: {
                        color: "#FFFFFF"
                    }
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '车次',
                // interval: 50,
                axisLabel: {
                    formatter: '{value}'
                },
                axisLine: {
                    lineStyle: {
                        color: "#FFFFFF"
                    }
                },
            },
            {
                type: 'value',
                name: '吨数',
                // interval: 5,
                axisLabel: {
                    formatter: '{value}吨',
                },
                axisLine: {
                    lineStyle: {
                        color: "#FFFFFF"
                    }
                },
            }
        ],
        series: [
            {
                name: '车次',
                type: 'bar',
                data: []
            },
            {
                name: '吨数',
                type: 'line',
                yAxisIndex: 1,
                smooth: true,
                data: [],
                lineStyle: {
                    color: "#FFFFFF"
                },
                itemStyle: {
                    color: "#FFFFFF"
                }
            }
        ]

    };
    setInterval(function () {
        var map = {
            action: "getTrainNumber",
            body: {
                startTime: get_now_time()
            },
            type: "query"
        };

        function draw_train_number_pound_page(res) {
            var data = res.data;
            console.log(data);
            var time = data.DateTime;
            var Number = data.Number;
            var Pound = data.Pound;
            if (option.xAxis[0].data.length >= 8) {
                option.xAxis[0].data.shift();
                option.xAxis[0].data.push(time);
                option.series[0].data.shift();
                option.series[0].data.push(Number);
                option.series[1].data.shift();
                option.series[1].data.push(Pound);
            }
            else {
                option.xAxis[0].data.push(time);
                option.series[0].data.push(Number);
                option.series[1].data.push(Pound);
            }
            myChart.setOption(option);
        }

        JQ_post(request_url, JSON.stringify(map), draw_train_number_pound_page);
    }, 300000);
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function TransverseBarChart() {
    var dom = document.getElementById("TransverseBarChart");
    var myChart = echarts.init(dom, 'infographic');
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    var option = {
        dataset: {
            source: [
                ['pound', 'name'],
                [58212, 'Matcha Latte'],
                [78254, 'Milk Tea'],
                [41032, 'Cheese Cocoa'],
                [12755, 'Cheese Brownie'],
                [20145, 'Matcha Cocoa'],
                [79146, 'Tea'],
                [91852, 'Orange Juice']
            ]
        },
        xAxis: {
            // name: 'amount',
            axisLine: {
                lineStyle: {
                    color: "#FFFFFF"
                }
            },
        },
        yAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: "#FFFFFF"
                }
            },
        },
        visualMap: {
            orient: 'horizontal',
            left: 'center',
            min: 0,
            max: 100000,
            text: ['High Score', 'Low Score'],
            dimension: 0,
            inRange: {
                color: ['#D7DA8B', '#E15457']
            },
            itemHeight: 300,
            textStyle: {
                color: "#FFFFFF",
            }
        },
        grid: [{
            top: '0%',
            left: "21%",
            right: "5%"
        }
        ],
        series: [
            {
                type: 'bar',
                encode: {
                    x: 'pound',
                    y: 'name'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
            }
        ]
    };
    setTimeout(function () {
        var map = {
            action: "getTop7Company",
            body: {
                startTime: get_now_time()
            },
            type: "query"
        };

        function draw_top_server_pound_page(res) {
            var data = res.data;
            var max = res.max;
            option.dataset.source = data;
            option.visualMap.max = max;
            myChart.setOption(option);
        }

        JQ_post(request_url, JSON.stringify(map), draw_top_server_pound_page);
    }, 1300);
    setInterval(function () {
        var map = {
            action: "getTop7Company",
            body: {
                startTime: get_now_time()
            },
            type: "query"
        };

        function draw_top_server_pound_page(res) {
            var data = res.data;
            var max = res.max;
            option.dataset.source = data;
            option.visualMap.max = max;
            myChart.setOption(option);
        }

        JQ_post(request_url, JSON.stringify(map), draw_top_server_pound_page);
    }, 30000);
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}
function get_the_three_regions_largest_consumption() {
    var data = {
        action: "getThreeRegions",
        body: {
            area: "贵州省"
        },
        type: "query",
    };
    var draw_three_regions_page = function (data) {
        console.log(data);
        var three_regions_data = data.data;
        // var txt_1='<div class="border-anim-content" style="text-align: center;margin: 0 auto">';
        for (var i = 0; i < three_regions_data.length; i++) {
            var txt_1 = '<div class="border-anim-content" style="text-align: center;margin: 0 auto">';
            var regions_detail = three_regions_data[i].regions_data;
            txt_1 = txt_1 + '<div style="float: left;font-size: 28px;height: 100%;width: 80px;" class="text-left">' + three_regions_data[i].name + '</div>';
            for (var j = 0; j < regions_detail.length; j++) {
                txt_1 = txt_1 + '<div style="float: left;font-size: 28px;height: 50%;width:calc(27% - 16px);color: #F17C02">' + regions_detail[j].name + '</div>';
                txt_1 = txt_1 + '<div style="float: left;font-size: 28px;height: 50%;width:calc(37% - 16px);color: #F17C02">' + regions_detail[j].data + '</div>';
                txt_1 = txt_1 + '<div style="float: left;font-size: 28px;height: 50%;width:calc(20% - 16px);color: #F17C02">' + regions_detail[j].percentage + '</div>';
                if (regions_detail[j].type == "add") {
                    txt_1 = txt_1 + '<div style="float: left;font-size: 28px;height: 50%;width:calc(10% - 16px)">' +
                        '<i class="fa fa-arrow-up" style="color: #F74500"></i></div>';
                }
                else {
                    txt_1 = txt_1 + '<div style="float: left;font-size: 28px;height: 50%;width:calc(10% - 16px)">' +
                        '<i class="fa fa-arrow-down" style="color: #087433"></i></div>';
                }
            }
            $("#block_" + (i + 1)).empty();
            $("#block_" + (i + 1)).append(txt_1);
        }
    };
    JQ_post(request_url, JSON.stringify(data), draw_three_regions_page);
}

function get_today_task_number() {
    var startDate = get_now_date();
    var endDate = get_now_date();
    var data = {
        action: "getTaskNumber",
        body: {
            startDate: startDate,
            endDate: endDate,
            area: "贵州省"
        },
        type: "query",
    };
    var draw_today_task_page = function (data) {
        console.log(data);
        $("#DriverNumber").empty();
        $("#DriverNumber").append(data.data.detail);
    };
    JQ_post(request_url, JSON.stringify(data), draw_today_task_page);
}

function get_new_task_table() {
    var startDate = get_now_time();
    var endDate = get_now_time();
    var data = {
        action: "getTaskTable",
        body: {
            startDate: startDate,
            endDate: endDate,
            sessionId: "UID0000001",
        },
        type: "query",
    };
    var draw_today_task_page = function (data) {
        var task_data = data.data;
        var thead = $('#TableForTask table thead tr');
        var tbody = $('#TableForTask table tbody');
        var column = task_data.ColumnName;
        var task = task_data.TableData;
        var thead_txt = "";
        var tbody_txt = "";
        for (var i = 0; i < column.length; i++) {
            thead_txt = thead_txt + "<th>" + column[i] + "</th>";
        }
        for (i = 0; i < task.length; i++) {
            tbody_txt = tbody_txt + "<tr data-taskid='" + task[i][0] + "'>" +
                "<td>" + task[i][1] + "</td>" +
                "<td>" + task[i][2] + "</td>" +
                "<td>" + task[i][3] + "</td>" +
                "<td>" + task[i][4] + "</td>" +
                "<td>" + task[i][5] + "</td>" +
                "</tr>";
        }
        thead.empty();
        thead.append(thead_txt);
        tbody.empty();
        tbody.append(tbody_txt);
        get_task_detail();
    };
    JQ_post(request_url, JSON.stringify(data), draw_today_task_page);
}

function get_task_detail() {
    $("#TableForTask table tbody tr").on('click', function () {
        var taskid = this.dataset.taskid;
        var data = {
            action: "getTaskDetailPage",
            body: {
                taskid: taskid,
            },
            type: "query",
        };

        function draw_task_route_page(res) {
            map.clearOverlays();
            var data = res.data;
            var info = data.info;
            var route = data.route;
            var start_longitude = data.start.longitude;
            var start_latitude = data.start.latitude;
            var end_longitude = data.end.longitude;
            var end_latitude = data.end.latitude;
            var start_point = new BMap.Point(start_longitude, start_latitude);
            var end_point = new BMap.Point(end_longitude, end_latitude);
            // map.enableScrollWheelZoom(true);
            var waypoints = [];
            for (var i = 0; i < route.length; i++) {
                var waypoint = new BMap.Point(route[i].longitude, route[i].latitude);
                waypoints.push(waypoint);
            }
            //
            var driving = new BMap.DrivingRoute(map, {
                renderOptions: {map: map, autoViewport: true},
                onPolylinesSet: function (routes) {
                    searchRoute = routes[0].getPolyline();//导航路线
                    map.addOverlay(searchRoute);
                },
                onMarkersSet: function (routes) {
                    console.log(routes[0].marker.point);
                    for (var m = 1; m < routes.length - 1; m++) {
                        var mm = routes[m].Nm;
                        map.removeOverlay(mm);
                    }
                    map.removeOverlay(routes[0].marker); //删除起点
                    map.removeOverlay(routes[routes.length - 1].marker); //删除起点
                    var opts = {
                        imageSize: new BMap.Size(36, 36)
                    };
                    var myIcon_start = new BMap.Icon("image/position_start.png", new BMap.Size(36, 36), opts);
                    var myIcon_end = new BMap.Icon("image/position_end.png", new BMap.Size(36, 36), opts);
                    // var markerstart = new BMap.Marker(routes[0].marker.point ,{icon:myIcon_start}); // 创建点
                    // var markerend = new BMap.Marker(routes[routes.length-1].marker.point ,{icon:myIcon_end}); // 创建点
                    var markerstart = new BMap.Marker(routes[0].marker.point, {icon: myIcon_start}); // 创建点
                    var markerend = new BMap.Marker(routes[routes.length - 1].marker.point, {icon: myIcon_end}); // 创建点
                    map.addOverlay(markerstart);
                    map.addOverlay(markerend);
                    map_show_information_windows(routes[0].marker.point, info);
                    markerstart.addEventListener("click", function () {
                        map_show_information_windows(markerstart.point, info);
                    });
                },
            });
            driving.search(start_point, end_point, {waypoints: waypoints});//waypoints表示途经点
        }

        JQ_post(request_url, JSON.stringify(data), draw_task_route_page);
    });
}

function map_show_information_windows(points, info) {
    map.centerAndZoom(points, 12);
    var sContent = "<div>" +
        "<div style='width: 100%;height: 20px'></div>" +
        "<div class='panel panel-default'>" +
        "<div class='panel-heading'><h3 class='panel-title'>运单详情" +
        "</h3></div>";
    var index = 0;
    for (var i = 0; i < 4; i++) {
        sContent = sContent + "<div class='panel-body'>";
        for (var j = 0; j < 2; j++) {
            sContent = sContent + "<div style='float: left;width: 20%'>" + info[index].key + "</div>";
            sContent = sContent + "<div style='float: left;width: 30%'>" + info[index].value + "</div>";
            index++;
        }
        sContent = sContent + "</div>";
    }
    sContent = sContent + "</div></div>";
    var opts = {
        width: 600,     // 信息窗口宽度
        height: 310,     // 信息窗口高度
        offset: new BMap.Size(0, -20),
        title: "运单详情",
    };
    var infoWindow = new BMap.InfoWindow(sContent, opts);  // 创建信息窗口对象
    map.openInfoWindow(infoWindow, points); //开启信息窗口
}

function get_today_all_task_route() {
    var data = {
        action: "getAllTaskPage",
        body: {
            dateNow: get_now_date(),
        },
        type: "query",
    };

    function draw_all_task_route_page(res) {
        var data = res.data;
        map.clearOverlays();
        for (var i = 0; i < data.length; i++) {
            var start_point = new BMap.Point(data[i].start.longitude, data[i].start.latitude);
            var end_point = new BMap.Point(data[i].end.longitude, data[i].end.latitude);
            var taskid = data[i].taskid;
            var waypoints = [];
            var driving = new BMap.DrivingRoute(map, {
                renderOptions: {map: map, autoViewport: true},
                onPolylinesSet: function (routes) {
                    searchRoute = routes[0].getPolyline();//导航路线
                    map.addOverlay(searchRoute);
                },
                onMarkersSet: function (routes) {
                    map.removeOverlay(routes[0].marker); //删除起点
                    map.removeOverlay(routes[routes.length - 1].marker); //删除起点
                    var opts = {
                        imageSize: new BMap.Size(36, 36)
                    };
                    var myIcon_start = new BMap.Icon("image/position_start.png", new BMap.Size(36, 36), opts);
                    var myIcon_end = new BMap.Icon("image/position_end.png", new BMap.Size(36, 36), opts);
                    var markerstart = new BMap.Marker(routes[0].marker.point, {icon: myIcon_start}); // 创建点
                    var markerend = new BMap.Marker(routes[routes.length - 1].marker.point, {icon: myIcon_end}); // 创建点
                    map.addOverlay(markerstart);
                    map.addOverlay(markerend);
                },
            });
            driving.search(start_point, end_point, {waypoints: waypoints});//waypoints表示途经点
        }
    }
    JQ_post(request_url, JSON.stringify(data), draw_all_task_route_page);
}