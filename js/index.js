var request_url = getRelativeURL() + "/request.php";
var wait_time_short = 500;
var mapGoverment = new BMap.Map('allmap');
var mapCompany = new BMap.Map('allmap1');
var sessionid = getQueryString("session");
var company_id = "";
var driver_id = "";

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
    get_user_info();
});

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
                type:"government"
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
            type:'company',
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
    };
    JQ_post(request_url, JSON.stringify(map), draw_manage_user_table)
}

function manage_user_table_delete() {
    $("#UserTable tbody tr td button").on("click", function () {
        var userid = this.dataset.uid;
        var map = {
            action: "ManageUserDelete",
            body: {
                userid: userid
            },
            type: "delete"
        };
        var delete_manage_user_table = function (res) {
            get_user_table()
        };
        JQ_post(request_url, JSON.stringify(map), delete_manage_user_table)
    })
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
            txt = txt + "<li data-id='" + data[i].driverid + "' style='cursor: pointer'><a>" + data[i].name + "</a></li>"
        }
        $("#searchDriverName").val("全部");
        $("#DriverName").empty();
        $("#DriverName").append(txt);
        $("#searchDriver").val("全部");
        $("#searchDriver").attr("data-driverid","all");
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
        $("#searchDriver").attr("data-driverid",driverID)
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
            type:'driver',
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
                type:"company"
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

$("#StatusList li a").on("click",function () {
    var statusid = this.dataset.id;
    var status_name = this.innerHTML;
    $("#searchStatus").val(status_name);
    $("#searchStatus").removeAttr("data-status");
    $("#searchStatus").attr("data-status",statusid);
});

laydate.render({
    elem: '#RangeTime',
    type: 'date',
    range: '至',
    format: 'yyyy-MM-dd',
    value: get_now_date(new Date() - 1000 * 60 * 60 * 24 * 15) + " 至 " + get_now_date(new Date())
});

$("#SearchWayBillTable").on("click",function () {
    var status_id=$("#searchStatus").data("status");
    var driver_id=$("#searchDriver").data("driverid");
    var time_strimg=$("#RangeTime").val();
    var time_array=time_strimg.split(" 至 ");
    var start_time=time_array[0];
    var end_time=time_array[1];
    var address=$("#Address").val();
    var map={
        action:"CompanyWayBillTable",
        body:{
            status:status_id,
            driver:driver_id,
            start:start_time,
            end:end_time,
            address:address
        },
        type:'query'
    };
    var draw_waybill_table=function (res) {
        console.log(res);
    };
    JQ_post(request_url,JSON.stringify(map),draw_waybill_table)
});