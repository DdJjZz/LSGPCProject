var request_url = getRelativeURL() + "/request.php";
var wait_time_short = 500;
var mapGoverment = new BMap.Map('allmap');
var mapCompany = new BMap.Map('allmap1');
var mapDistribute = new BMap.Map('distribute_map');
var sessionid = getQueryString("session");
var company_id = "";
var driver_id = "";
var task = new Object();

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

$(document).ready(function () {
    if (sessionid == null || sessionid == "") {
        window.location.href = "login.html";
        return;
    }
    else {
        var height = document.documentElement.clientHeight;
        var width = document.documentElement.clientWidth;
        draw_block_height_weight(height, width);
        get_user_info();
    }
});

window.onresize = function () {
    var height = document.documentElement.clientHeight;
    var width = document.documentElement.clientWidth;
    draw_block_height_weight(height, width);
};

function draw_block_height_weight(height, width) {
    var default_height = 8;
    $("#panel-map").css("height", height * 0.89 - default_height + "px");
    $("#panel-map").css("padding-top", default_height + "px");
}

window.onload = function () {
    var done_pound = setInterval(function () {
        get_all_done_pound();
    }, 60000);

    $("#Route").on('click', function () {
        $("#Route").addClass("active");
        $("#WayBill").removeClass("active");
        $("#UserManage").removeClass("active");
        $("#RoutePage").css("display", "block");
        $("#WayBillPage").css("display", "none");
        $("#UserManagePage").css("display", "none");
        window.clearInterval(done_pound);
        get_all_company_name_and_companyid();
        get_all_done_pound();
        done_pound = setInterval(function () {
            get_all_done_pound();
        }, 60000);
        get_city_region_data_chart();
    });

    $("#WayBill").on('click', function () {
        window.clearInterval(done_pound);
        get_waybill_table("all", "all", get_now_date(new Date() - 1000 * 60 * 60 * 24 * 15), get_now_date(new Date()));
        waybill_all_company_name_and_companyid();
        waybill_all_goods_name();
        $("#Route").removeClass("active");
        $("#WayBill").addClass("active");
        $("#UserManage").removeClass("active");
        $("#RoutePage").css("display", "none");
        $("#WayBillPage").css("display", "block");
        $("#UserManagePage").css("display", "none");
    });

    $("#UserManage").on('click', function () {
        window.clearInterval(done_pound);
        $("#Route").removeClass("active");
        $("#WayBill").removeClass("active");
        $("#UserManage").addClass("active");
        $("#RoutePage").css("display", "none");
        $("#WayBillPage").css("display", "none");
        $("#UserManagePage").css("display", "block");
        get_user_table();
    });

    $("#CompanyRoute").on('click', function () {
        window.clearInterval(done_pound);
        get_all_driver_name_and_driverid();
        get_company_city_region_data_chart();
        $("#CompanyRoute").addClass("active");
        $("#CompanyWayBill").removeClass("active");
        $("#CompanyDispatch").removeClass("active");
        $("#CompanyDriverManage").removeClass("active");
        $("#CompanyUserManage").removeClass("active");
        $("#CompanyMap1").css("display", "block");
        $("#CompanyWayBill1").css("display", "none");
        $("#CompanyDispatch1").css("display", "none");
        $("#CompanyDriver1").css("display", "none");
        $("#CompanyUser1").css("display", "none");
    });

    $("#CompanyWayBill").on('click', function () {
        window.clearInterval(done_pound);
        get_all_driver_name_and_driverid();
        get_company_waybill_table();
        $("#CompanyRoute").removeClass("active");
        $("#CompanyWayBill").addClass("active");
        $("#CompanyDispatch").removeClass("active");
        $("#CompanyDriverManage").removeClass("active");
        $("#CompanyUserManage").removeClass("active");
        $("#CompanyMap1").css("display", "none");
        $("#CompanyWayBill1").css("display", "block");
        $("#CompanyDispatch1").css("display", "none");
        $("#CompanyDriver1").css("display", "none");
        $("#CompanyUser1").css("display", "none");
    });

    $("#CompanyDispatch").on('click', function () {
        window.clearInterval(done_pound);
        get_free_driver_list("all");
        $("#FreeDriverName").val("");
        $("#CompanyRoute").removeClass("active");
        $("#CompanyWayBill").removeClass("active");
        $("#CompanyDispatch").addClass("active");
        $("#CompanyDriverManage").removeClass("active");
        $("#CompanyUserManage").removeClass("active");
        $("#CompanyMap1").css("display", "none");
        $("#CompanyWayBill1").css("display", "none");
        $("#CompanyDispatch1").css("display", "block");
        $("#CompanyDriver1").css("display", "none");
        $("#CompanyUser1").css("display", "none");
    });

    $("#CompanyDriverManage").on('click', function () {
        window.clearInterval(done_pound);
        all_driver_table_show();
        $("#CompanyRoute").removeClass("active");
        $("#CompanyWayBill").removeClass("active");
        $("#CompanyDispatch").removeClass("active");
        $("#CompanyDriverManage").addClass("active");
        $("#CompanyUserManage").removeClass("active");
        $("#CompanyMap1").css("display", "none");
        $("#CompanyWayBill1").css("display", "none");
        $("#CompanyDispatch1").css("display", "none");
        $("#CompanyDriver1").css("display", "block");
        $("#CompanyUser1").css("display", "none");
    });

    $("#CompanyUserManage").on('click', function () {
        window.clearInterval(done_pound);
        company_manage_table("");
        $("#CompanyRoute").removeClass("active");
        $("#CompanyWayBill").removeClass("active");
        $("#CompanyDispatch").removeClass("active");
        $("#CompanyDriverManage").removeClass("active");
        $("#CompanyUserManage").addClass("active");
        $("#CompanyMap1").css("display", "none");
        $("#CompanyWayBill1").css("display", "none");
        $("#CompanyDispatch1").css("display", "none");
        $("#CompanyDriver1").css("display", "none");
        $("#CompanyUser1").css("display", "block");
    });
};

function get_user_info() {
    var map = {
        action: "getUserInfoIWDP",
        body: {
            session: sessionid
        },
        type: "query"
    };

    function show_user_page(res) {
        var data = res.data;
        if (data.info == 'false') {
            window.location.href = "login.html";
            return;
        }
        else {
            $("#username").html("欢迎您：" + data.name);
            if (data.type == "government") {
                show_map(mapGoverment, 116.404, 39.915);
                get_user_loaction(mapGoverment);
                get_all_company_name_and_companyid();
                get_all_done_pound();
                get_city_region_data_chart();
                $("#GovernmentBar").css("display", "block");
                $("#CompanyBar").css("display", "none");
                $("#Government").css("display", "block");
                $("#Company").css("display", "none");
                if (data.admin == "true") {
                    $("#UserManage").css("display", "block")
                }
                else {
                    $("#UserManage").css("display", "none")
                }
            }
            else {
                company_show_map(mapCompany, 116.404, 39.915);
                get_user_loaction(mapCompany);
                company_show_map(mapDistribute, 116.404, 39.915);
                get_user_loaction(mapDistribute);
                get_all_driver_name_and_driverid();
                get_company_city_region_data_chart();
                $("#GovernmentBar").css("display", "none");
                $("#CompanyBar").css("display", "block");
                $("#Government").css("display", "none");
                $("#Company").css("display", "block");
                if (data.admin == "true") {
                    $("#CompanyUserManage").css("display", "block")
                }
                else {
                    $("#CompanyUserManage").css("display", "none")
                }
            }
        }
    }

    JQ_post(request_url, JSON.stringify(map), show_user_page);
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

function get_now_date(TimesStamp) {
    var now = new Date(TimesStamp);
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var now_time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
    return now_time;
}

function timeString2TimeStamp(time) {
    var date = time;
    date = date.substring(0, 19);
    date = date.replace(/-/g, '/');
    var timestamp = new Date(date).getTime();
    return timestamp
}

function get_user_loaction(map) {

    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            show_map(map, r.point.lng, r.point.lat);
            company_show_map(map, r.point.lng, r.point.lat);
        }
    }, {enableHighAccuracy: true})
}

function show_map(map, longitude, latitude) {
    map.centerAndZoom(new BMap.Point(longitude, latitude), 13);
    map.addControl(new BMap.OverviewMapControl());       //添加缩略地图控件
    map.enableScrollWheelZoom();                         //启用滚轮放大缩小
}

laydate.render({
    elem: '#searchStartDateRoute',
    type: 'date',
    range: '至',
    format: 'yyyy-MM-dd',
    value: get_now_date(new Date() - 1000 * 60 * 60 * 24 * 15) + " 至 " + get_now_date(new Date()),
});

function get_city_region_data_chart() {
    var dom = document.getElementById("CityChart");
    var myChart = echarts.init(dom, 'infographic');
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    myChart.showLoading({
        text: '正在加载数据'
    });  //增加提示
    var option = {
        title: {
            text: '初始数据',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['2011年', '2012年'],
            right: '15px'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: ['初始数据', '初始数据', '初始数据', '初始数据', '初始数据', '初始数据']
        },
        dataZoom: [
            {
                show: true,
                yAxisIndex: 0,
                // start: 0,
                // end: 100,
                filterMode: 'empty',
                width: 20,
                height: '80%',
                showDataShadow: false,
                left: '93%'
            }
        ],
        series: [
            {
                name: '2011年',
                type: 'bar',
                data: [1, 1, 1, 1, 1, 1]
            },
            {
                name: '2012年',
                type: 'bar',
                data: [1, 1, 1, 1, 1, 1]
            }
        ]
    };

    setTimeout(function () {
        var map = {
            action: "getCityData",
            body: {
                session: sessionid,
                type: "government"
            },
            type: "query"
        };
        var draw_city_page_chart = function (res) {
            myChart.hideLoading();
            var data = res.data;
            var title = data.title;
            var city_data = data.data;
            var type = data.type;
            var city = data.city;
            option.title.text = title;
            option.legend.data = type;
            option.yAxis.data = city;
            var series = [];
            for (var i = 0; i < city_data.length; i++) {
                var serise_detail = {
                    name: type[i],
                    type: 'bar',
                    data: city_data[i]
                };
                series.push(serise_detail)
            }
            option.series = series;
            console.log(option.series);
            myChart.setOption(option);
        };
        JQ_post(request_url, JSON.stringify(map), draw_city_page_chart)
    }, 1000);

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function get_company_data_chart(companyId, startTime, endTime) {
    var dom = document.getElementById("CompanyChart");
    var myChart = echarts.init(dom, 'infographic');
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    myChart.showLoading({
        text: '正在加载数据'
    });  //增加提示
    var option = {
        title: {
            text: '初始数据',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLabel: {
                interval: 0,
                rotate: 40
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
        }]
    };
    setTimeout(function () {
        var map = {
            action: "getCompanyData",
            body: {
                session: sessionid,
                company: companyId,
                startTime: startTime,
                endTime: endTime,
            },
            type: "query"
        };

        function draw_company_data_chart(res) {
            myChart.hideLoading();
            var data = res.data;
            var title = data.title;
            var company_data = data.data;
            var type = data.type;
            option.title.text = title;
            option.xAxis.data = type;
            option.series[0].data = company_data;
            myChart.setOption(option);
        }

        JQ_post(request_url, JSON.stringify(map), draw_company_data_chart)
    }, 1000);
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function get_all_company_name_and_companyid() {
    var map = {
        action: "getCompanyName",
        body: {
            session: sessionid
        },
        type: "query"
    };
    var get_all_company_name = function (res) {
        var data = res.data;
        var txt = '';
        for (var i = 0; i < data.length; i++) {
            txt = txt + "<li data-id='" + data[i].companyid + "' class='company' style='cursor: pointer'>" + data[i].name + "</li>"
        }
        $("#searchCompanyName").val(data[0].name);
        // $("#searchCompanyName").attr("data-id",data[0].companyid);
        $("#companyName").empty();
        $("#companyName").append(txt);
        user_select_company();
        var timeValue = $("#searchStartDateRoute").val();
        var timeArray = timeValue.split(" 至 ");
        var startTime = timeArray[0];
        var endTime = timeArray[1];
        company_id = data[0].companyid;
        get_company_data_chart(data[0].companyid, startTime, endTime);
        get_comapny_waybill_table(company_id)
    };
    JQ_post(request_url, JSON.stringify(map), get_all_company_name)
}

function user_select_company() {
    $("#companyName li").on("click", function () {
        var companyID = this.dataset.id;
        var company_name = this.innerHTML;
        company_id = companyID;
        $("#searchCompanyName").val(company_name);
    });
}

$("#selectCompanyData").on("click", function () {
    var timeValue = $("#searchStartDateRoute").val();
    var timeArray = timeValue.split(" 至 ");
    var startTime = timeArray[0];
    var endTime = timeArray[1];
    get_company_data_chart(company_id, startTime, endTime);
    get_comapny_waybill_table(company_id)
});

function get_comapny_waybill_table(company_id) {
    var timeValue = $("#searchStartDateRoute").val();
    var timeArray = timeValue.split(" 至 ");
    var startTime = timeArray[0];
    var endTime = timeArray[1];
    var map = {
        action: "getWayBillTable",
        body: {
            session: sessionid,
            type: 'company',
            company: company_id,
            startTime: startTime,
            endTime: endTime
        }
    };
    var draw_waybill_table_page = function (res) {
        $("#companyTable").dataTable().fnDestroy();
        var data = res.data;
        var ColumnName = data.Column;
        var TableData = data.Table;
        var Title = data.Title;
        $("#TableTitle").html(Title);
        var txt = "<thead><tr>";
        for (var i = 0; i < ColumnName.length; i++) {
            txt = txt + "<th>" + ColumnName[i] + "</th>"
        }
        txt = txt + "</tr></thead><tbody style='cursor: pointer'>";
        for (var i = 0; i < TableData.length; i++) {
            txt = txt + "<tr data-taskid='" + TableData[i][0] + "'>";
            for (var j = 1; j < TableData[i].length; j++) {
                txt = txt + "<td>" + TableData[i][j] + "</td>"
            }
            txt = txt + "</tr>"
        }
        txt = txt + "</tbody>";
        $("#companyTable").empty();
        $("#companyTable").append(txt);
        $('#companyTable').dataTable({
            "bFilter": false,
            "bLengthChange": false,
            "autoWidth": false,
            "paginationType": "simple",
            "ordering": false,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉， 没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
            }
        });
        waybill_table_detail_click();
    }
    JQ_post(request_url, JSON.stringify(map), draw_waybill_table_page);
}

function waybill_table_detail_click() {
    $("#companyTable tbody tr").on("click", function () {
        var taskid = this.dataset.taskid;
        var data = {
            action: "getTaskDetailPage",
            body: {
                taskid: taskid,
            },
            type: "query",
        };

        var draw_task_route_page = function (res) {
            mapGoverment.clearOverlays();
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
            var driving = new BMap.DrivingRoute(mapGoverment, {
                renderOptions: {map: mapGoverment, autoViewport: true},
                onPolylinesSet: function (routes) {
                    searchRoute = routes[0].getPolyline();//导航路线
                    mapGoverment.addOverlay(searchRoute);
                },
                onMarkersSet: function (routes) {
                    console.log(routes[0].marker.point);
                    for (var m = 1; m < routes.length - 1; m++) {
                        var mm = routes[m].Nm;
                        mapGoverment.removeOverlay(mm)
                    }
                    mapGoverment.removeOverlay(routes[0].marker); //删除起点
                    mapGoverment.removeOverlay(routes[routes.length - 1].marker); //删除起点
                    var opts = {
                        imageSize: new BMap.Size(36, 36)
                    };
                    var myIcon_start = new BMap.Icon("image/position_start.png", new BMap.Size(36, 36), opts);
                    var myIcon_end = new BMap.Icon("image/position_end.png", new BMap.Size(36, 36), opts);
                    // var markerstart = new BMap.Marker(routes[0].marker.point ,{icon:myIcon_start}); // 创建点
                    // var markerend = new BMap.Marker(routes[routes.length-1].marker.point ,{icon:myIcon_end}); // 创建点
                    var markerstart = new BMap.Marker(routes[0].marker.point, {icon: myIcon_start}); // 创建点
                    var markerend = new BMap.Marker(routes[routes.length - 1].marker.point, {icon: myIcon_end}); // 创建点
                    mapGoverment.addOverlay(markerstart);
                    mapGoverment.addOverlay(markerend);
                    map_show_information_windows(routes[0].marker.point, info);
                    markerstart.addEventListener("click", function () {
                        map_show_information_windows(markerstart.point, info)
                    });
                },
            });
            driving.search(start_point, end_point, {waypoints: waypoints});//waypoints表示途经点
        }
        JQ_post(request_url, JSON.stringify(data), draw_task_route_page);
    });
}

function map_show_information_windows(points, info) {
    mapGoverment.centerAndZoom(points, 12);
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
    mapGoverment.openInfoWindow(infoWindow, points); //开启信息窗口
}

function get_all_done_pound() {
    var data = {
        action: "getDonePound",
        body: {
            session: sessionid,
        },
        type: "query",
    };

    var draw_all_done_pound = function (res) {
        var data = res.data;
        $("#DonePound").html(data)
    };
    JQ_post(request_url, JSON.stringify(data), draw_all_done_pound);
}

$("#SelectWayBillTable").on("click", function () {
    var company_name = $("#searchCompanyName").val();
    var goods_name = $("#searchWayBillGood").val();
    var time_val = $("#WayBillTime").val();
    var time_array = time_val.split(" 至 ");
    var start_time = time_array[0];
    var end_time = time_array[1];
    get_waybill_table(company_name, goods_name, start_time, end_time)
});

function get_waybill_table(company, goods, start, end) {
    var map = {
        action: "WayBillTable",
        body: {
            company: company,
            goods: goods,
            start: start,
            end: end,
            session: sessionid,
        },
        type: "query"
    };
    var draw_waybill_table = function (res) {
        $("#waybillTable").dataTable().fnDestroy();
        var data = res.data;
        var ColumnName = data.ColumnName;
        var TableData = data.TableData;
        var txt = "<thead><tr>";
        for (var i = 0; i < ColumnName.length; i++) {
            txt = txt + "<th>" + ColumnName[i] + "</th>";
        }
        txt = txt + "</tr></thead><tbody style='cursor: pointer'>";
        for (var i = 0; i < TableData.length; i++) {
            txt = txt + "<tr data-id='" + TableData[i][0] + "'>";
            for (var j = 0; j < TableData[i].length; j++) {
                txt = txt + "<td>" + TableData[i][j] + "</td>"
            }
            txt = txt + "</tr>"
        }
        txt = txt + "</tbody>";
        $("#waybillTable").empty();
        $("#waybillTable").append(txt);
        $('#waybillTable').dataTable({
            "bFilter": false,
            "bLengthChange": false,
            "autoWidth": false,
            "paginationType": "simple",
            // "ordering": false,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉，没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
            },
            "pageLength": 18,
            "dom": 'Bfrtip',
            "buttons": [
                {
                    extend: 'excel',//使用 excel扩展
                    text: '导出为Excel',// 显示文字
                    exportOptions: {}
                }
            ]
        });
        task_table_row_click();
    };
    JQ_post(request_url, JSON.stringify(map), draw_waybill_table)
}

function waybill_all_company_name_and_companyid() {
    var map = {
        action: "getCompanyName",
        body: {
            session: sessionid
        },
        type: "query"
    };
    var waybill_get_all_company_name = function (res) {
        var data = res.data;
        var txt = "<li class='company' style='cursor: pointer'><a data-id='all'>全部</a></li>";
        for (var i = 0; i < data.length; i++) {
            txt = txt + "<li class='company' style='cursor: pointer'><a data-id='" + data[i].companyid + "'>" + data[i].name + "</a></li>"
        }
        $("#searchWayBillCompany").val("全部");
        $("#WayBillCompany").empty();
        $("#WayBillCompany").append(txt);
        waybill_user_select_company();
        var timeValue = $("#searchStartDateRoute").val();
        var timeArray = timeValue.split(" 至 ");
        var startTime = timeArray[0];
        var endTime = timeArray[1];
        company_id = data[0].companyid;
        get_comapny_waybill_table(company_id)
    };
    JQ_post(request_url, JSON.stringify(map), waybill_get_all_company_name)
}

function waybill_user_select_company() {
    $("#WayBillCompany li a").on("click", function () {
        var companyID = this.dataset.id;
        var company_name = this.innerHTML;
        company_id = companyID;
        $("#searchWayBillCompany").val(company_name);
    });
}

function waybill_all_goods_name() {
    var map = {
        action: "getGoodsName",
        body: {
            session: sessionid
        },
        type: "query"
    };
    var waybill_get_all_goods_name = function (res) {
        var data = res.data;
        var txt = "<li style='cursor: pointer'><a data-id='all'>全部</a></li>";
        for (var i = 0; i < data.length; i++) {
            txt = txt + "<li style='cursor: pointer'><a>" + data[i].name + "</a></li>"
        }
        $("#searchWayBillGood").val("全部");
        $("#WayBillGood").empty();
        $("#WayBillGood").append(txt);
        waybill_user_select_goods();
    };
    JQ_post(request_url, JSON.stringify(map), waybill_get_all_goods_name)
}

function waybill_user_select_goods() {
    $("#WayBillGood li a").on("click", function () {
        var goods_name = this.innerHTML;
        $("#searchWayBillGood").val(goods_name);
    });
}

laydate.render({
    elem: '#WayBillTime',
    type: 'date',
    range: '至',
    format: 'yyyy-MM-dd',
    value: get_now_date(new Date() - 1000 * 60 * 60 * 24 * 15) + " 至 " + get_now_date(new Date()),
});

function task_table_row_click() {
    $("#waybillTable tbody tr").on("click", function () {
        var taskid = this.dataset.id;
        var map = {
            action: "TaskDetailPage",
            body: {
                taskid: taskid
            },
            type: "query"
        };
        var draw_task_detail_panel = function (res) {
            var data = res.data;
            var task_id = data.taskid;
            var detail = data.detail;
            var video_list = data.video;
            console.log(video_list);
            var txt = "<div class='panel-heading'><h3 class='panel-title'>" + task_id + "</h3></div><ul class='list-group'>";
            for (var i = 0; i < detail.length; i++) {
                txt = txt + "<li class='list-group-item'><span class='pull-right'>" + detail[i].value + "</span>" + detail[i].key + "</li>";
            }
            $("#TaskDetail").empty();
            $("#TaskDetail").append(txt);
            if (video_list.length == 0) {
                $("#VideoName").val("");
                $("#VideoList").empty();
                $("#Video").attr("src", "");
            }
            else {
                var video_txt = "";
                $("#VideoName").val(video_list[0].name);
                $("#Video").attr("src", video_list[0].src);
                for (var i = 0; i < video_list.length; i++) {
                    video_txt = video_txt + "<li><a data-src='" + video_list[i].src + "'>" + video_list[i].name + "</a></li>"
                }
                $("#VideoList").empty();
                $("#VideoList").append(video_txt);
            }
            video_list_click_action();
        };
        JQ_post(request_url, JSON.stringify(map), draw_task_detail_panel)
    })
}

function video_list_click_action() {
    $("#VideoList li a").on("click", function () {
        $("#VideoName").val(this.innerHTML);
        $("#Video").attr("src", this.dataset.src);
    })
}

function get_user_table() {
    var map = {
        action: "ManageUserTable",
        body: {
            session: sessionid
        },
        type: "query"
    };
    var draw_manage_user_table = function (res) {
        var data = res.data;
        $("#UserTable").dataTable().fnDestroy();
        var ColumnName = data.ColumnName;
        var TableData = data.TableData;
        var txt = "<thead><tr>";
        for (var i = 0; i < ColumnName.length; i++) {
            txt = txt + "<th>" + ColumnName[i] + "</th>"
        }
        txt = txt + "<th>操作</th></tr></thead><tbody>";
        for (var i = 0; i < TableData.length; i++) {
            txt = txt + "<tr>";
            for (var j = 1; j < TableData[i].length; j++) {
                txt = txt + "<td>" + TableData[i][j] + "</td>"
            }
            txt = txt + "<td><button class='btn btn-danger' data-uid='" + TableData[i][0] + "'>删除</button></td></tr>"
        }
        txt = txt + "</tbody>";
        $("#UserTable").empty();
        $("#UserTable").append(txt);
        manage_user_table_delete();
        $('#UserTable').dataTable({
            "bFilter": false,
            "bLengthChange": false,
            "autoWidth": false,
            "paginationType": "simple",
            // "ordering": false,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉，没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
            },
            "pageLength": 13,
            "dom": 'Bfrtip',
            "buttons": [
                {
                    extend: 'excel',//使用 excel扩展
                    text: '导出为Excel',// 显示文字
                    exportOptions: {}
                }
            ]
        });
    };
    JQ_post(request_url, JSON.stringify(map), draw_manage_user_table)
}

function manage_user_table_delete() {
    $("#UserTable tbody tr td button").on("click", function () {
        $("#DeleteManageModal").modal("show");
        $("#DeleteManageBtnSure").attr("data-userid",this.dataset.uid);
        // var userid = this.dataset.uid;
        // var map = {
        //     action: "ManageUserDelete",
        //     body: {
        //         session:sessionid,
        //         userid: userid
        //     },
        //     type: "delete"
        // };
        // var delete_manage_user_table = function (res) {
        //     get_user_table()
        // };
        // JQ_post(request_url, JSON.stringify(map), delete_manage_user_table)
    })
}

$("#DeleteManageBtnSure").on("click",function () {
    var userid = $("#DeleteManageBtnSure").attr("data-userid");
    var map = {
        action: "ManageUserDelete",
        body: {
            session:sessionid,
            userid: userid
        },
        type: "delete"
    };
    var delete_manage_user_table = function (res) {
        get_user_table()
    };
    JQ_post(request_url, JSON.stringify(map), delete_manage_user_table)
});

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

function company_show_map(map, longitude, latitude) {
    map.centerAndZoom(new BMap.Point(longitude, latitude), 13);
    map.addControl(new BMap.OverviewMapControl());       //添加缩略地图控件
    map.enableScrollWheelZoom();                         //启用滚轮放大缩小
}

laydate.render({
    elem: '#searchRouteDate',
    type: 'date',
    range: '至',
    format: 'yyyy-MM-dd',
    value: get_now_date(new Date() - 1000 * 60 * 60 * 24 * 15) + " 至 " + get_now_date(new Date())
});

function get_all_driver_name_and_driverid() {
    var map = {
        action: "getDriverName",
        body: {
            session: sessionid
        },
        type: "query"
    };
    var get_all_driver_name = function (res) {
        var data = res.data;
        var txt = '<li data-id="all" style="cursor: pointer"><a>全部</a></li>';
        for (var i = 0; i < data.length; i++) {
            txt = txt + "<li style='cursor: pointer'><a data-id='" + data[i].driverid + "'>" + data[i].name + "</a></li>"
        }
        $("#searchDriverName").val("全部");
        $("#DriverName").empty();
        $("#DriverName").append(txt);
        $("#searchDriver").val("全部");
        $("#searchDriver").attr("data-driverid", "all");
        $("#DriverList").empty();
        $("#DriverList").append(txt);
        user_select_driver();
        var timeValue = $("#searchRouteDate").val();
        var timeArray = timeValue.split(" 至 ");
        var startTime = timeArray[0];
        var endTime = timeArray[1];
        driver_id = "all";
        get_driver_data_chart(data[0].driverid, startTime, endTime);
        get_driver_waybill_table(driver_id)
    };
    JQ_post(request_url, JSON.stringify(map), get_all_driver_name)
}

function user_select_driver() {
    $("#DriverName li a").on("click", function () {
        var driverID = this.dataset.id;
        var driver_name = this.innerHTML;
        driver_id = driverID;
        $("#searchDriverName").val(driver_name);
    });

    $("#DriverList li a").on("click", function () {
        var driverID = this.dataset.id;
        var driver_name = this.innerHTML;
        $("#searchDriver").val(driver_name);
        $("#searchDriver").removeAttr("data-driverid");
        $("#searchDriver").attr("data-driverid", driverID)
    });
}

function get_driver_data_chart(driverId, startTime, endTime) {
    var dom = document.getElementById("DriverChart");
    var myChart = echarts.init(dom, 'infographic');
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    myChart.showLoading({
        text: '正在加载数据'
    });  //增加提示
    var option = {
        title: {
            text: '初始数据',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLabel: {
                interval: 0,
                rotate: 40
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
        }]
    };
    setTimeout(function () {
        var map = {
            action: "getDriverData",
            body: {
                session: sessionid,
                driver: driverId,
                startTime: startTime,
                endTime: endTime,
            },
            type: "query"
        };

        function draw_driver_data_chart(res) {
            myChart.hideLoading();
            var data = res.data;
            var title = data.title;
            var company_data = data.data;
            var type = data.type;
            option.title.text = title;
            option.xAxis.data = type;
            option.series[0].data = company_data;
            myChart.setOption(option);
        }

        JQ_post(request_url, JSON.stringify(map), draw_driver_data_chart)
    }, 1000);
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function get_driver_waybill_table(driverid) {
    var timeValue = $("#searchStartDateRoute").val();
    var timeArray = timeValue.split(" 至 ");
    var startTime = timeArray[0];
    var endTime = timeArray[1];
    var map = {
        action: "getWayBillTable",
        body: {
            session: sessionid,
            type: 'driver',
            company: driverid,
            startTime: startTime,
            endTime: endTime
        }
    };
    var draw_waybill_table_page = function (res) {
        $("#DriverTable").dataTable().fnDestroy();
        var data = res.data;
        var ColumnName = data.Column;
        var TableData = data.Table;
        var Title = data.Title;
        $("#DriverTableTitle").html(Title);
        var txt = "<thead><tr>";
        for (var i = 0; i < ColumnName.length; i++) {
            txt = txt + "<th>" + ColumnName[i] + "</th>"
        }
        txt = txt + "</tr></thead><tbody style='cursor: pointer'>";
        for (var i = 0; i < TableData.length; i++) {
            txt = txt + "<tr data-taskid='" + TableData[i][0] + "'>";
            for (var j = 1; j < TableData[i].length; j++) {
                txt = txt + "<td>" + TableData[i][j] + "</td>"
            }
            txt = txt + "</tr>"
        }
        txt = txt + "</tbody>";
        $("#DriverTable").empty();
        $("#DriverTable").append(txt);
        $('#DriverTable').dataTable({
            "bFilter": false,
            "bLengthChange": false,
            "autoWidth": false,
            "paginationType": "simple",
            "ordering": false,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉， 没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
            }
        });
        company_waybill_table_detail_click();
    };
    JQ_post(request_url, JSON.stringify(map), draw_waybill_table_page);
}

function company_waybill_table_detail_click() {
    $("#DriverTable tbody tr").on("click", function () {
        var taskid = this.dataset.taskid;
        var data = {
            action: "getTaskDetailPage",
            body: {
                taskid: taskid,
            },
            type: "query",
        };

        var draw_task_route_page = function (res) {
            mapCompany.clearOverlays();
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
            var driving = new BMap.DrivingRoute(mapCompany, {
                renderOptions: {map: mapCompany, autoViewport: true},
                onPolylinesSet: function (routes) {
                    searchRoute = routes[0].getPolyline();//导航路线
                    mapCompany.addOverlay(searchRoute);
                },
                onMarkersSet: function (routes) {
                    console.log(routes[0].marker.point);
                    for (var m = 1; m < routes.length - 1; m++) {
                        var mm = routes[m].Nm;
                        mapCompany.removeOverlay(mm)
                    }
                    mapCompany.removeOverlay(routes[0].marker); //删除起点
                    mapCompany.removeOverlay(routes[routes.length - 1].marker); //删除起点
                    var opts = {
                        imageSize: new BMap.Size(36, 36)
                    };
                    var myIcon_start = new BMap.Icon("image/position_start.png", new BMap.Size(36, 36), opts);
                    var myIcon_end = new BMap.Icon("image/position_end.png", new BMap.Size(36, 36), opts);
                    // var markerstart = new BMap.Marker(routes[0].marker.point ,{icon:myIcon_start}); // 创建点
                    // var markerend = new BMap.Marker(routes[routes.length-1].marker.point ,{icon:myIcon_end}); // 创建点
                    var markerstart = new BMap.Marker(routes[0].marker.point, {icon: myIcon_start}); // 创建点
                    var markerend = new BMap.Marker(routes[routes.length - 1].marker.point, {icon: myIcon_end}); // 创建点
                    mapCompany.addOverlay(markerstart);
                    mapCompany.addOverlay(markerend);
                    company_map_show_information_windows(routes[0].marker.point, info);
                    markerstart.addEventListener("click", function () {
                        company_map_show_information_windows(markerstart.point, info)
                    });
                },
            });
            driving.search(start_point, end_point, {waypoints: waypoints});//waypoints表示途经点
        }
        JQ_post(request_url, JSON.stringify(data), draw_task_route_page);
    });
}

function company_map_show_information_windows(points, info) {
    mapCompany.centerAndZoom(points, 12);
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
    mapCompany.openInfoWindow(infoWindow, points); //开启信息窗口
}

$("#selectDriverData").on("click", function () {
    // driverId, startTime, endTime;
    var timeValue = $("#searchRouteDate").val();
    var timeArray = timeValue.split(" 至 ");
    var startTime = timeArray[0];
    var endTime = timeArray[1];
    get_driver_data_chart(driver_id, startTime, endTime);
});

function get_company_city_region_data_chart() {
    var dom = document.getElementById("CompanyCityChart");
    var myChart = echarts.init(dom, 'infographic');
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    myChart.showLoading({
        text: '正在加载数据'
    });  //增加提示
    var option = {
        title: {
            text: '初始数据',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['2011年', '2012年'],
            right: '15px'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: ['初始数据', '初始数据', '初始数据', '初始数据', '初始数据', '初始数据']
        },
        dataZoom: [
            {
                show: true,
                yAxisIndex: 0,
                // start: 0,
                // end: 100,
                filterMode: 'empty',
                width: 20,
                height: '80%',
                showDataShadow: false,
                left: '93%'
            }
        ],
        series: [
            {
                name: '2011年',
                type: 'bar',
                data: [1, 1, 1, 1, 1, 1]
            },
            {
                name: '2012年',
                type: 'bar',
                data: [1, 1, 1, 1, 1, 1]
            }
        ]
    };

    setTimeout(function () {
        var map = {
            action: "getCityData",
            body: {
                session: sessionid,
                type: "company"
            },
            type: "query"
        }
        var draw_city_page_chart = function (res) {
            myChart.hideLoading();
            var data = res.data;
            var title = data.title;
            var city_data = data.data;
            var type = data.type;
            var city = data.city;
            option.title.text = title;
            option.legend.data = type;
            option.yAxis.data = city;
            var series = [];
            for (var i = 0; i < city_data.length; i++) {
                var serise_detail = {
                    name: type[i],
                    type: 'bar',
                    data: city_data[i]
                };
                series.push(serise_detail)
            }
            option.series = series;
            console.log(option.series);
            myChart.setOption(option);
        };
        JQ_post(request_url, JSON.stringify(map), draw_city_page_chart)
    }, 1000);

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

$("#StatusList li a").on("click", function () {
    var status = this.dataset.status;
    var status_name = this.innerHTML;
    $("#searchStatus").val(status_name);
    $("#searchStatus").removeAttr("data-status");
    $("#searchStatus").attr("data-status", status);
});

laydate.render({
    elem: '#RangeTime',
    type: 'date',
    range: '至',
    format: 'yyyy-MM-dd',
    value: get_now_date(new Date() - 1000 * 60 * 60 * 24 * 15) + " 至 " + get_now_date(new Date())
});

$("#SearchWayBillTable").on("click", function () {
    get_company_waybill_table();
});

function get_company_waybill_table() {
    var status_id = $("#searchStatus").attr("data-status");
    var driver_id = $("#searchDriver").attr("data-driverid");
    var time_string = $("#RangeTime").val();
    var time_array = time_string.split(" 至 ");
    var start_time = time_array[0];
    var end_time = time_array[1];
    var address = $("#Address").val();
    var map = {
        action: "CompanyWayBillTable",
        body: {
            status: status_id,
            driver: driver_id,
            start: start_time,
            end: end_time,
            address: address,
            session: sessionid,
        },
        type: 'query'
    };
    var draw_waybill_table = function (res) {
        var data = res.data;
        $('#CompanyWayTable').dataTable().fnDestroy();
        var ColumnName = data.ColumnName;
        var TableData = data.TableData;
        var txt = "<thead><tr>";
        for (var i = 0; i < ColumnName.length; i++) {
            txt = txt + "<th>" + ColumnName[i] + "</th>"
        }
        txt = txt + "</tr></thead><tbody style='cursor: pointer'>";
        for (var i = 0; i < TableData.length; i++) {
            txt = txt + "<tr data-taskid='" + TableData[i][0] + "'>";
            for (var j = 0; j < TableData[i].length; j++) {
                if (j == TableData[i].length - 1) {
                    if (TableData[i][j] == 4) {
                        txt = txt + "<td><button data-toggle='modal' href='#ChangeModal' data-type='distribute' class='btn btn-primary'  data-taskid='" + TableData[i][0] + "'>派发</button>" +
                            "&nbsp&nbsp<button data-toggle='modal' href='#DeleteModal' data-type='delete' class='btn btn-danger' data-taskid='" + TableData[i][0] + "'>删除</button></td>"
                    }
                    else {
                        txt = txt + "<td></td>";
                    }
                }
                else {
                    txt = txt + "<td>" + TableData[i][j] + "</td>";
                }
            }
            txt = txt + "</tr>"
        }
        txt = txt + "</tbody>";
        $("#CompanyWayTable").empty();
        $("#CompanyWayTable").append(txt);
        $('#CompanyWayTable').dataTable({
            "bFilter": false,
            "bLengthChange": false,
            "autoWidth": false,
            "paginationType": "simple",
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉， 没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
            },
            "pageLength": 15,
            "dom": 'Bfrtip',
            "buttons": [
                {
                    extend: 'excel',//使用 excel扩展
                    text: '导出为Excel',// 显示文字
                    exportOptions: {}
                }
            ]
        });
        company_waybill_table_click();
        company_waybill_table_button_click();
    };
    JQ_post(request_url, JSON.stringify(map), draw_waybill_table)
}

function company_waybill_table_click() {
    $("#CompanyWayTable tbody tr").on("click", function () {
        var taskid = this.dataset.taskid;
        var map = {
            action: "TaskDetailPage",
            body: {
                taskid: taskid
            },
            type: "query"
        };
        var draw_task_detail_panel = function (res) {
            var data = res.data;
            var task_id = data.taskid;
            var detail = data.detail;
            var video_list = data.video;
            var txt = "<div class='panel-heading'><h3 class='panel-title'>" + task_id + "</h3></div><ul class='list-group'>";
            for (var i = 0; i < detail.length; i++) {
                txt = txt + "<li class='list-group-item'><span class='pull-right'>" + detail[i].value + "</span>" + detail[i].key + "</li>";
            }
            $("#WayBillTaskDetail").empty();
            $("#WayBillTaskDetail").append(txt);
            if (video_list.length == 0) {
                $("#WayBillVideoName").val("");
                $("#VideoList").empty();
                $("#WayBillList").attr("src", "");
            }
            else {
                var video_txt = "";
                $("#WayBillVideoName").val(video_list[0].name);
                $("#WayBillVideo").attr("src", video_list[0].src);
                for (var i = 0; i < video_list.length; i++) {
                    video_txt = video_txt + "<li><a data-src='" + video_list[i].src + "'>" + video_list[i].name + "</a></li>"
                }
                $("#WayBillList").empty();
                $("#WayBillList").append(video_txt);
            }
            waybill_video_list_click_action();
        };
        JQ_post(request_url, JSON.stringify(map), draw_task_detail_panel)
    });
}

function company_waybill_table_button_click() {
    $("#CompanyWayTable tbody tr td button").on("click", function () {
        task.taskid = this.dataset.taskid;
        if (this.dataset.type == "distribute") {
            var map = {
                action: 'GetPlateList',
                body: {
                    session: sessionid,
                },
                type: 'query'
            };
            var draw_plate_list_view = function (res) {
                var data = res.data;
                $("#PlateWayValue").val(data[0]);
                var txt = "";
                for (var i = 0; i < data.length; i++) {
                    txt = txt + "<li><a>" + data[i] + "</a></li>"
                }
                $("#PlateWayList").empty();
                $("#PlateWayList").append(txt);
                $("#PlateWayList li a").on("click", function () {
                    $("#PlateWayValue").val(this.innerHTML);
                });
            };
            JQ_post(request_url, JSON.stringify(map), draw_plate_list_view)
        }
    });
}

$("#DeleteBtnSure").on("click", function () {
    var map = {
        action: 'DeleteTask',
        body: {
            taskid: task.taskid,
            session: sessionid,
        },
        type: 'query'
    };
    var reflash_table_page = function () {
        get_company_waybill_table();
    };
    JQ_post(request_url, JSON.stringify(map), reflash_table_page)
});

$("#ChangeBtnSure").on("click", function () {
    var map = {
        action: 'ReDistributeTask',
        body: {
            taskid: task.taskid,
            plate: $("#PlateWayValue").val(),
            session: sessionid,
        },
        type: 'update'
    };
    var reflash_table_page = function () {
        get_company_waybill_table();
    };
    JQ_post(request_url, JSON.stringify(map), reflash_table_page)
});

function waybill_video_list_click_action() {
    $("#WayBillList li a").on("click", function () {
        $("#WayBillVideoName").val(this.innerHTML);
        $("#WayBillVideo").attr("src", this.dataset.src);
    })
};

$("[href='#panel-map']").on("click", function () {
    draw_distribute_map_page();
    setInterval(function () {
        var classString = $("#panel-map").prop("class");
        if (classString.indexOf("active") >= 0) {
            console.log("draw_distribute_map_page");
            draw_distribute_map_page();
        }
    }, 60000)
});

function get_free_driver_list(driver) {
    var map = {
        action: 'GetFreeDriverPage',
        body: {
            session: sessionid,
            driver: driver,
        },
        type: 'query'
    };
    var draw_free_driver_table = function (res) {
        $('#FreeDriverTable').dataTable().fnDestroy();
        var data = res.data;
        var txt = "<thead><tr>";
        var Column = data.ColumnName;
        var Table = data.TableData;
        for (var i = 0; i < Column.length; i++) {
            txt = txt + "<th>" + Column[i] + "</th>"
        }
        txt = txt + "</tr></thead><tbody style='cursor: pointer'>";
        for (var i = 0; i < Table.length; i++) {
            txt = txt + "<tr data-driver='" + Table[i][0] + "'>";
            for (var j = 1; j <= Table[i].length; j++) {
                if (j == Table[i].length) {
                    txt = txt + "<td><button class='btn btn-primary' data-toggle='modal' href='#DistributeModal' data-driver='" + Table[i][0] + "'>任务派发</button></td>";
                }
                else {
                    txt = txt + "<td>" + Table[i][j] + "</td>"
                }
            }
            txt = txt + "</tr>"
        }
        txt = txt + "</tbody>";
        $("#FreeDriverTable").empty();
        $("#FreeDriverTable").append(txt);
        free_driver_table_click();
        $("#FreeDriverTable tbody tr td button").on("click", function () {
            free_driver_table_button_click(this.dataset.driver);
        });
        // free_driver_table_button_click();
        $('#FreeDriverTable').dataTable({
            "bFilter": false,
            "bLengthChange": false,
            "autoWidth": false,
            "paginationType": "simple",
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉， 没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
            },
            "pageLength": 7,
        });
    };
    JQ_post(request_url, JSON.stringify(map), draw_free_driver_table)
}

$("#SearchFreeDriver").on("click", function () {
    get_free_driver_list($("#FreeDriverName").val());
});

function free_driver_table_click() {
    $("#FreeDriverTable tbody tr").on("click", function () {
        var driver_id = this.dataset.driver;
        var map = {
            action: "GetDriverDetail",
            body: {
                session: sessionid,
                driver: driver_id
            },
            type: "query"
        };
        var draw_driver_detail_page = function (res) {
            var data = res.data;
            var driver = data.driver;
            var img = data.img;
            var driverid = data.driverid;
            var txt = "";
            if (driver.length <= 6) {
                txt = "<div style='float: left;width:33%;height: :310px;padding-right: 20px'>" +
                    "<div class='panel panel-default'><div class='panel-heading'><h3 class='panel-title'>" + driverid + "</h3></div><ul class='list-group'>";
                for (var i = 0; i < driver.length; i++) {
                    txt = txt + "<li class='list-group-item'>" + driver[i].key + "<span class='pull-right'>" + driver[i].value + "</span></li>"
                }
                txt = txt + "</ul></div></div>";
            }
            else {
                txt = "<div style='float: left;width:33%;height: :310px;padding-right: 20px'>" +
                    "<div class='panel panel-default'><div class='panel-heading'><h3 class='panel-title'>"
                    + driverid + "</h3></div><ul class='list-group'>";
                for (var i = 0; i < 6; i++) {
                    txt = txt + "<li class='list-group-item'>" + driver[i].key + "<span class='pull-right'>" + driver[i].value + "</span></li>";
                }
                txt = txt + "</ul></div></div><div style='float: left;width: 33%;height: 310px;padding-right: 20px'><ul class='list-group'>";
                for (var i = 6; i < driver.length; i++) {
                    txt = txt + "<li class='list-group-item'>" + driver[i].key + "<span class='pull-right'>" + driver[i].value + "</span>";
                }
            }
            $("#DriverDetail").empty();
            $("#DriverDetail").append(txt);
            var CarouseTxt = "<ol class='carousel-indicators'>";
            for (var i = 0; i < img.length; i++) {
                if (i == 0) {
                    CarouseTxt = CarouseTxt + "<li data-target='#myCarousel' data-slide-to='" + i + "' class='active'>"
                }
                else {
                    CarouseTxt = CarouseTxt + "<li data-target='#myCarousel' data-slide-to='" + i + "'>"
                }
            }
            CarouseTxt = CarouseTxt + "</ol><div class='carousel-inner' style='text-align: center'>";
            for (var i = 0; i < img.length; i++) {
                if (i == 0) {
                    CarouseTxt = CarouseTxt + "<div class='item active'><img class='img' src='" + img[i].src + "'>" +
                        "<div class='carousel-caption'><h4 style='color: red'>" + img[i].value + "</h4></div></div>"
                }
                else {
                    CarouseTxt = CarouseTxt + "<div class='item'><img class='img' src='" + img[i].src + "'>" +
                        "<div class='carousel-caption'><h4 style='color: red'>" + img[i].value + "</h4></div></div>"
                }
            }
            CarouseTxt = CarouseTxt + "<a class='left carousel-control' href='#myCarousel' role='button' data-slide='prev'>" +
                "<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span><span class='sr-only'>Previous</span></a>";
            CarouseTxt = CarouseTxt + "<a class='right carousel-control' href='#myCarousel' role='button' data-slide='next'>" +
                "<span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span><span class='sr-only'>Next</span></a></div>";
            $("#myCarousel").empty();
            $("#myCarousel").append(CarouseTxt);
        };
        JQ_post(request_url, JSON.stringify(map), draw_driver_detail_page);
    });
}

function free_driver_table_button_click(driver_id) {
    console.log(driver_id);
    $("#DistributeSure").attr("data-driver", driver_id);
    var map_plate = {
        action: "GetDistributeInfo",
        body: {
            session: sessionid,
            driver: driver_id
        },
        type: "query"
    };
    var draw_plate_list_page = function (res) {
        var plate = res.data.plate;
        var goods = res.data.goods;
        var account = res.data.account;
        $("#driverPlateValue").val(plate[0]);
        $("#GoodsValue").val(goods[0]);
        $("#LoadAccountValue").val(account[0]);
        $("#UnloadAccountValue").val(account[0]);
        var plateTxt = "";
        var goodsTxt = "";
        var accountTxt = "";
        for (var i = 0; i < plate.length; i++) {
            plateTxt = plateTxt + "<li><a>" + plate[i] + "</a></li>"
        }
        for (var i = 0; i < goods.length; i++) {
            goodsTxt = goodsTxt + "<li><a>" + goods[i] + "</a></li>"
        }
        for (var i = 0; i < account.length; i++) {
            accountTxt = accountTxt + "<li><a>" + account[i] + "</a></li>"
        }
        $("#driverPlateList").empty();
        $("#driverPlateList").append(plateTxt);
        $("#GoodsList").empty();
        $("#GoodsList").append(goodsTxt);
        $("#LoadAccountList").empty();
        $("#LoadAccountList").append(accountTxt);
        $("#UnloadAccountList").empty();
        $("#UnloadAccountList").append(accountTxt);
        $("#driverPlateList li a").on("click", function () {
            $("#driverPlateValue").val(this.innerHTML)
        });
        $("#GoodsList li a").on("click", function () {
            $("#GoodsValue").val(this.innerHTML)
        });
        $("#LoadAccountList li a").on("click", function () {
            $("#LoadAccountValue").val(this.innerHTML)
        });
        $("#UnloadAccountList li a").on("click", function () {
            $("#UnloadAccountValue").val(this.innerHTML)
        })
    };
    JQ_post(request_url, JSON.stringify(map_plate), draw_plate_list_page);
}

laydate.render({
    elem: '#StartTime',
    type: 'date',
    min: get_now_date(new Date()),
    format: 'yyyy-MM-dd',
    value: get_now_date(new Date()),
});

$('#DistributeSure').on("click", function () {
    if ($("#StartProvince").val() == "") {
        $("#StartProvince").focus();
        return
    }
    else if ($("#StartCity").val() == "") {
        $("#StartCity").focus();
        return
    }
    else if ($("#StartDistrict").val() == "") {
        $("#StartDistrict").focus();
        return
    }
    else if ($("#StartAddress").val() == "") {
        $("#StartAddress").focus();
        return
    }
    else if ($("#EndProvince").val() == "") {
        $("#EndProvince").focus();
        return
    }
    else if ($("#EndCity").val() == "") {
        $("#EndCity").focus();
        return
    }
    else if ($("#EndDistrict").val() == "") {
        $("#EndDistrict").focus();
        return
    }
    else if ($("#EndAddress").val() == "") {
        $("#EndAddress").focus();
        return
    }
    else if ($("#PoundValue").val() == "") {
        $("#PoundValue").focus();
        return
    }
    else if ($("#PoundPrice").val() == "") {
        $("#PoundPrice").focus();
        return
    }
    else {
        $('#DistributeSure').attr("data-dismiss", 'modal');
    }
    var map = {
        action: 'DistributeTask',
        body: {
            session: sessionid,
            Driver: this.dataset.driver,
            Plate: $("#driverPlateValue").val(),
            StartTime: $("#StartTime").val(),
            Goods: $("#GoodsValue").val(),
            StartProvince: $("#StartProvince").val(),
            StartCity: $("#StartCity").val(),
            StartDistrict: $("#StartDistrict").val(),
            StartAddress: $("#StartAddress").val(),
            EndProvince: $("#EndProvince").val(),
            EndCity: $("#EndCity").val(),
            EndDistrict: $("#EndDistrict").val(),
            EndAddress: $("#EndAddress").val(),
            LoadAccountValue: $("#LoadAccountValue").val(),
            UnloadAccountValue: $("#UnloadAccountValue").val(),
            PoundValue: $("#PoundValue").val(),
            PoundPrice: $("#PoundPrice").val(),
        },
        type: 'insert'
    };
    var distribute_driver_success = function (res) {
        $("#driverPlateValue").val("");
        $("#GoodsValue").val("");
        $("#StartProvince").val("");
        $("#StartCity").val("");
        $("#StartDistrict").val("");
        $("#StartAddress").val("");
        $("#EndProvince").val("");
        $("#EndCity").val("");
        $("#EndDistrict").val("");
        $("#EndAddress").val("");
        $("#LoadAccountValue").val("");
        $("#UnloadAccountValue").val("");
        $("#PoundValue").val("");
        $("#PoundPrice").val("");
    };
    JQ_post(request_url, JSON.stringify(map), distribute_driver_success);
});

function draw_distribute_map_page() {
    var data = {
        action: "GetFreeDriver",
        body: {
            session: sessionid,
        },
        type: "query",
    };

    function draw_all_free_driver_page(res) {
        var data = res.data;
        mapDistribute.clearOverlays();
        for (var i = 0; i < data.length; i++) {
            var driver_id = data[i]['driver'];
            var point = new BMap.Point(data[i]['longitude'], data[i]['latitude']);
            var opts = {
                imageSize: new BMap.Size(30, 30)
            };
            var myIcon = new BMap.Icon("svg/position_start.svg", new BMap.Size(30, 30), opts);
            var driver = new BMap.Marker(point, {icon: myIcon});
            mapDistribute.addOverlay(driver);
            var clickFunction = function (driver) {
                return function () {
                    free_driver_map_click(driver)
                }
            }(driver_id, point);
            driver.addEventListener("click", clickFunction);
        }
    }

    JQ_post(request_url, JSON.stringify(data), draw_all_free_driver_page)
}

function free_driver_map_click(driver_id) {
    console.log(driver_id);
    // var driver_id = this.dataset.driver;
    var map = {
        action: "GetDriverDetail",
        body: {
            session: sessionid,
            driver: driver_id
        },
        type: "query"
    };
    var draw_driver_detail_page = function (res) {
        var data = res.data;
        var driver = data.driver;
        var img = data.img;
        var driverid = data.driverid;
        var txt = "<ul class='list-group'>";
        for (var i = 0; i <= driver.length; i++) {
            if (i == driver.length) {
                txt = txt + "<li class='list-group-item new-li'><button class='btn btn-primary btn-block' data-toggle='modal' href='#DistributeModal' data-driver='" + driverid + "'>任务派发</button></li>"
            }
            else {
                txt = txt + "<li class='list-group-item new-li'>" + driver[i].key + "<span class='pull-right'>" + driver[i].value + "</span></li>";
            }
        }
        txt = txt + "</ul>";
        $("#driver_detail").empty();
        $("#driver_detail").append(txt);
        $("#driver_detail ul li button").on('click', function () {
            free_driver_table_button_click(this.dataset.driver)
        });
        var CarouseTxt = "<ol class='carousel-indicators'>";
        for (var i = 0; i < img.length; i++) {
            if (i == 0) {
                CarouseTxt = CarouseTxt + "<li data-target='#myCarouse2' data-slide-to='" + i + "' class='active'>"
            }
            else {
                CarouseTxt = CarouseTxt + "<li data-target='#myCarouse2' data-slide-to='" + i + "'>"
            }
        }
        CarouseTxt = CarouseTxt + "</ol><div class='carousel-inner' style='text-align: center'>";
        for (var i = 0; i < img.length; i++) {
            if (i == 0) {
                CarouseTxt = CarouseTxt + "<div class='item active'><img class='img' src='" + img[i].src + "'>" +
                    "<div class='carousel-caption'><h4 style='color: red'>" + img[i].value + "</h4></div></div>"
            }
            else {
                CarouseTxt = CarouseTxt + "<div class='item'><img class='img' src='" + img[i].src + "'>" +
                    "<div class='carousel-caption'><h4 style='color: red'>" + img[i].value + "</h4></div></div>"
            }
        }
        CarouseTxt = CarouseTxt + "<a class='left carousel-control' href='#myCarouse2' role='button' data-slide='prev'>" +
            "<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span><span class='sr-only'>Previous</span></a>";
        CarouseTxt = CarouseTxt + "<a class='right carousel-control' href='#myCarouse2' role='button' data-slide='next'>" +
            "<span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span><span class='sr-only'>Next</span></a></div>";
        $("#myCarouse2").empty();
        $("#myCarouse2").append(CarouseTxt);
    };
    JQ_post(request_url, JSON.stringify(map), draw_driver_detail_page);
}

function all_driver_table_show() {
    var map = {
        action: "AllDriver",
        body: {
            session: sessionid
        },
        type: 'query'
    };
    var draw_all_driver_table = function (res) {
        $('#AllDriverTable').dataTable().fnDestroy();
        var data = res.data;
        var Column = data.Column;
        var Table = data.Table;
        var txt = "<thead><tr>";
        for (var i = 0; i < Column.length; i++) {
            txt = txt + "<th>" + Column[i] + "</th>"
        }
        txt = txt + "</tr></thead><tbody style='cursor: pointer'>";
        for (var i = 0; i < Table.length; i++) {
            var uid = Table[i][0];
            var type = Table[i][1];
            var status = Table[i][2];
            txt = txt + "<tr data-driver='" + uid + "'>";
            for (var j = 3; j <= Table[i].length; j++) {
                if (j == Table[i].length) {
                    if (type == 0 && status != 1) {
                        txt = txt + "<td><button data-toggle='modal' href='#DriverAgreeModal' class='btn btn-primary btn-sm'  data-driver='" + uid + "' data-type='agree'>同意" +
                            "</button>&nbsp&nbsp<button data-toggle='modal' href='#DriverDeleteModal' class='btn btn-danger btn-sm' data-driver='" + uid + "' data-type='delete'>拒绝</button></td>>"
                    }
                    else {
                        txt = txt + "<td></td>"
                    }
                }
                else {
                    txt = txt + "<td>" + Table[i][j] + "</td>"
                }
            }
            txt = txt + "</tr>"
        }
        txt = txt + "</tbody>";
        $("#AllDriverTable").empty();
        $("#AllDriverTable").append(txt);
        all_driver_table_click();
        all_driver_table_button_click();
        $('#AllDriverTable').dataTable({
            "bFilter": false,
            "bLengthChange": false,
            "autoWidth": false,
            "paginationType": "simple",
            // "ordering": false,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉， 没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
            },
            "pageLength": 10,
            "dom": 'Bfrtip',
            "buttons": [
                {
                    extend: 'excel',//使用 excel扩展
                    text: '导出为Excel',// 显示文字
                    exportOptions: {}
                }
            ]
        });
    };
    JQ_post(request_url, JSON.stringify(map), draw_all_driver_table);
}


function all_driver_table_click() {
    $("#AllDriverTable tbody tr").on('click', function () {
        var driver_id = this.dataset.driver;
        var map = {
            action: "GetDriverDetail",
            body: {
                session: sessionid,
                driver: driver_id
            },
            type: "query"
        };
        var draw_driver_detail_page = function (res) {
            var data = res.data;
            var driver = data.driver;
            var img = data.img;
            var driverid = data.driverid;
            var txt = "";
            if (driver.length <= 6) {
                txt = "<ul class='list-group' style='width: 30%;float: left'>";
                for (var i = 0; i < driver.length; i++) {
                    txt = txt + "<li class='list-group-item new-li'>" + driver[i].key + "<span class='pull-right'>" + driver[i].value + "</span></li>"
                }
                txt = txt + "</ul>";
            }
            else {
                txt = "<ul class='list-group' style='width: 30%;float: left'>";
                for (var i = 0; i < 6; i++) {
                    txt = txt + "<li class='list-group-item'>" + driver[i].key + "<span class='pull-right'>" + driver[i].value + "</span></li>";
                }
                txt = txt + "</ul><ul class='list-group' style='width: 30%;float: left;padding-left: 10px'>";
                for (var i = 6; i < driver.length; i++) {
                    txt = txt + "<li class='list-group-item'>" + driver[i].key + "<span class='pull-right'>" + driver[i].value + "</span>";
                }
                txt = txt + "</ul>";
            }
            $("#AllDriverDetail").empty();
            $("#AllDriverDetail").append(txt);
            var CarouseTxt = "<ol class='carousel-indicators'>";
            for (var i = 0; i < img.length; i++) {
                if (i == 0) {
                    CarouseTxt = CarouseTxt + "<li data-target='#myCarouse3' data-slide-to='" + i + "' class='active'>"
                }
                else {
                    CarouseTxt = CarouseTxt + "<li data-target='#myCarouse3' data-slide-to='" + i + "'>"
                }
            }
            CarouseTxt = CarouseTxt + "</ol><div class='carousel-inner' style='text-align: center'>";
            for (var i = 0; i < img.length; i++) {
                if (i == 0) {
                    CarouseTxt = CarouseTxt + "<div class='item active'><img class='img' src='" + img[i].src + "'>" +
                        "<div class='carousel-caption'><h4 style='color: red'>" + img[i].value + "</h4></div></div>"
                }
                else {
                    CarouseTxt = CarouseTxt + "<div class='item'><img class='img' src='" + img[i].src + "'>" +
                        "<div class='carousel-caption'><h4 style='color: red'>" + img[i].value + "</h4></div></div>"
                }
            }
            CarouseTxt = CarouseTxt + "<a class='left carousel-control' href='#myCarouse3' role='button' data-slide='prev'>" +
                "<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span><span class='sr-only'>Previous</span></a>";
            CarouseTxt = CarouseTxt + "<a class='right carousel-control' href='#myCarouse3' role='button' data-slide='next'>" +
                "<span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span><span class='sr-only'>Next</span></a></div>";
            $("#myCarouse3").empty();
            $("#myCarouse3").append(CarouseTxt);
        };
        JQ_post(request_url, JSON.stringify(map), draw_driver_detail_page);
    });
}

function all_driver_table_button_click() {
    $("#AllDriverTable tbody tr button").on("click", function () {
        if (this.dataset.type == "agree") {
            $("#DriverAgreeBtn").attr('data-driver', this.dataset.driver);
        }
        else {
            $("#DriverDeleteBtn").attr('data-driver', this.dataset.driver);
        }
    });
}

$("#DriverAgreeBtn").on("click", function () {
    var map = {
        action: "AgreeDriverApply",
        body: {
            session: sessionid,
            driver: this.dataset.driver,
        },
        type: 'update'
    };
    var agress_driver_apply = function (res) {
        all_driver_table_show();
        $("#AllDriverDetail").empty();
        $("#myCarouse3").empty();
    };
    JQ_post(request_url, JSON.stringify(map), agress_driver_apply)
});

$("#DriverDeleteBtn").on("click", function () {
    var map = {
        action: "DeleteDriverApply",
        body: {
            session: sessionid,
            driver: this.dataset.driver,
        },
        type: 'update'
    };
    var agress_driver_apply = function (res) {
        all_driver_table_show();
        $("#AllDriverDetail").empty();
        $("#myCarouse3").empty();
    };
    JQ_post(request_url, JSON.stringify(map), agress_driver_apply)
});

function company_manage_table(uname) {
    var map = {
        action: 'GetManageTable',
        body: {
            session: sessionid,
            uname: uname,
        },
        type: 'query'
    };
    var draw_company_manage_table = function (res) {
        $('#CompanyManegeTable').dataTable().fnDestroy();
        var data = res.data;
        var Column = data.Column;
        var Table = data.Table;
        var txt = "<thead><tr>";
        for (var i = 0; i < Column.length; i++) {
            txt = txt + "<th>" + Column[i] + "</th>"
        }
        txt = txt + "</tr></thead><tbody>";
        for (var i = 0; i < Table.length; i++) {
            var type = Table[i][0];
            txt = txt + "<tr>";
            for (var j = 1; j <= Table[i].length; j++) {
                if (j == Table[i].length) {
                    if (type == 'app') {
                        txt = txt + "<td><button class='btn btn-danger btn-sm' data-type='delete' data-uid='"+Table[i][2]+"'>删除</button></td>"
                    }
                    else {
                        txt = txt + "<td><button class='btn btn-primary btn-sm' data-type='update' data-uid='"+Table[i][2]+"'>修改</button>&nbsp&nbsp<button class='btn btn-danger' data-type='delete' data-uid='"+Table[i][2]+"'>删除</button></td>"
                    }
                }
                else {
                    txt = txt + "<td>" + Table[i][j] + "</td>";
                }
            }
            txt = txt + "</tr>";
        }
        txt = txt + "</tbody>";
        $("#CompanyManegeTable").empty();
        $("#CompanyManegeTable").append(txt);
        company_manage_table_button_click();
        $('#CompanyManegeTable').dataTable({
            "bFilter": false,
            "bLengthChange": false,
            "autoWidth": false,
            "paginationType": "simple",
            // "ordering": false,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉， 没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
            },
            "pageLength": 12,
            "dom": 'Bfrtip',
            "buttons": [
                {
                    extend: 'excel',//使用 excel扩展
                    text: '导出为Excel',// 显示文字
                    exportOptions: {}
                }
            ]
        });
    };
    JQ_post(request_url, JSON.stringify(map), draw_company_manage_table);
}

$("#SearchManageBtn").on("click", function () {
    var uname=$("#ManageName").val();
    company_manage_table(uname);
});

$("#AddManageBtn").on("click",function () {
    add_manage_view_page_show('add',"");
    $("#AddManageBtn").attr("data-toggle",'modal');
    $("#AddManageBtn").attr("href",'#AddManageModal');
});
function company_manage_table_button_click(){
    $("#CompanyManegeTable tbody td button").on("click",function () {
        console.log(this.dataset.type);
        if(this.dataset.type=='update'){
            $("#CompanyManegeTable tbody td button").attr("data-toggle",'modal');
            $("#CompanyManegeTable tbody td button").attr("href",'#AddManageModal');
            add_manage_view_page_show(this.dataset.type,this.dataset.uid)
        }
        else{
            $("#CompanyManegeTable tbody td button").attr("data-toggle",'modal');
            $("#CompanyManegeTable tbody td button").attr("href",'#DeleteUserModal');
            // add_manage_view_page_show(this.dataset.type,this.dataset.uid)
            $("#DeleteUserBtnSure").attr('data-uid',this.dataset.uid);
        }
    });
}


function add_manage_view_page_show(type,uid) {
    console.log(type);
    if(type=='add'){
        $("#AddManageBtnSure").attr("data-type",type);
        $("#AddManageBtnSure").removeAttr("data-uid");
        $("#AddManageBtnSure").removeAttr("data-dismiss");
        $("#AddUserName").removeAttr("readonly");
        $("#AddUserPassword").removeAttr("readonly");
        $("#AddUserPass").removeAttr("readonly");
        $("#AddUserName").val("");
        $("#AddUserPassword").val("");
        $("#AddUserPass").val("");
        $("#AddUserTrue").val("");
        $("#AddUserTelephone").val("");
        $("#AddUserEmail").val("");
        $("#AddUserIDNumber").val("");
    }
    else{
        $("#AddManageBtnSure").attr("data-type",type);
        $("#AddManageBtnSure").attr("data-uid",uid);
        var map={
            action:'GetCompanyManageInfo',
            body:{
                session:sessionid,
                uid:uid
            },
            type:'query'
        };
        var draw_update_manage_view_page=function (res) {
            var data=res.data;
            var LoginName=data.LoginName;
            var Password=data.Password;
            var TrueName=data.TrueName;
            var Email=data.Email;
            var ID=data.ID;
            var Telphone=data.Telphone;
            $("#AddUserName").val(LoginName);
            $("#AddUserName").attr("readonly",true);
            $("#AddUserPassword").val(Password);
            $("#AddUserPassword").attr("readonly",true);
            $("#AddUserPass").val(Password);
            $("#AddUserPass").attr("readonly",true);
            $("#AddUserTrue").val(TrueName);
            $("#AddUserTrue").attr("readonly");
            $("#AddUserTelephone").val(Telphone);
            $("#AddUserTelephone").attr("readonly");
            $("#AddUserEmail").val(Email);
            $("#AddUserEmail").attr("readonly");
            $("#AddUserIDNumber").val(ID);
            $("#AddUserIDNumber").attr("readonly");
        };
        JQ_post(request_url,JSON.stringify(map),draw_update_manage_view_page);
    }
}

$("#AddManageBtnSure").on("click",function () {
    // b64_sha1
    var type=$("#AddManageBtnSure").attr('data-type');
    console.log(type);
    if($("#AddUserName").val()==""){
        $("#AddUserName").focus();
        return;
    }
    else if($("#AddUserPassword").val()==""){
        $("#AddUserPassword").focus();
        return;
    }
    else if($("#AddUserPass").val()==""){
        $("#AddUserPass").focus();
        return;
    }
    else if ($("#AddUserPass").val()!=$("#AddUserPassword").val()){
        $("#AddUserPass").focus();
        $("#AddUserPass").val("");
        $("#AddUserPass").attr("placeholder",'确认密码应与密码保持一致');
        return;
    }
    else if($("#AddUserTrue").val()==""){
        $("#AddUserTrue").focus();
        return;
    }
    else if($("#AddUserTelephone").val()==""){
        $("#AddUserTelephone").focus();
        return;
    }
    else if($("#AddUserEmail").val()==""){
        $("#AddUserEmail").focus();
        return;
    }
    else if($("#AddUserIDNumber").val()==""){
        $("#AddUserIDNumber").focus();
        return;
    }
    else{
        $("#AddManageBtnSure").attr("data-dismiss",'modal');
        if(type=='add'){
            var map={
                action:"AddNewManage",
                body:{
                    LoginName:$("#AddUserName").val(),
                    Password:b64_sha1($("#AddUserPassword").val()),
                    TrueName:$("#AddUserTrue").val(),
                    Email:$("#AddUserEmail").val(),
                    ID:$("#AddUserIDNumber").val(),
                    Telephone:$("#AddUserTelephone").val(),
                    session:sessionid,
                },
                type:'insert'
            }
        }
        else{
            var uid=$("#AddManageBtnSure").attr('data-uid');
            var map={
                action:"UpdateManage",
                body:{
                    session:sessionid,
                    LoginName:$("#AddUserName").val(),
                    Password:b64_sha1($("#AddUserPassword").val()),
                    TrueName:$("#AddUserTrue").val(),
                    Email:$("#AddUserEmail").val(),
                    ID:$("#AddUserIDNumber").val(),
                    Telephone:$("#AddUserTelephone").val(),
                    uid:uid,
                },
                type:'update'
            }
        }
        var draw_new_manage_table=function (res) {
            company_manage_table("");
        };
        JQ_post(request_url,JSON.stringify(map),draw_new_manage_table);
    }
});

$("#DeleteUserBtnSure").on("click",function () {
    // console.log($("#DeleteUserBtnSure").attr("data-uid"));
    var map={
        action:"DeleteManage",
        body:{
            uid:$("#DeleteUserBtnSure").attr("data-uid"),
            session:sessionid,
        },
        type:'delete'
    };
    var draw_new_manage_table=function (res) {
        company_manage_table("");
    };
    JQ_post(request_url,JSON.stringify(map),draw_new_manage_table);
});