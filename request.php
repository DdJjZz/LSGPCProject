<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/4/15
 * Time: 11:33
 */
header("content-type:text/html;charset=utf-8");
date_default_timezone_set("Asia/Shanghai");
$request_body = file_get_contents('php://input');
$payload = json_decode($request_body, true);
$key = $payload["action"];
switch ($key) {

    case "getUserInfoIWDP":
        $body = $payload["body"];
        $session = $body['session'];
        if ($session == "123456") {
            $uname = 'admin';
            $type = "government";
            $admin = 'true';
            $info = "true";
            $status = "true";
            $msg = "信息获取成功";
        } else if ($session == "234567") {
            $uname = 'admin1';
            $type = "government";
            $admin = 'false';
            $info = "true";
            $status = "true";
            $msg = "信息获取成功";
        } else if ($session == '345678') {
            $uname = 'admin2';
            $type = "company";
            $admin = 'true';
            $info = "true";
            $status = "true";
            $msg = "信息获取成功";
        } else if ($session == '456789') {
            $uname = 'admin3';
            $type = "company";
            $admin = 'false';
            $info = "true";
            $status = "true";
            $msg = "信息获取成功";
        } else {
            $uname = '';
            $type = "";
            $admin = 'false';
            $info = "false";
            $status = "false";
            $msg = "用户信息获取失败，请重试";
        }
        $resp = array("name" => $uname, 'type' => $type, 'admin' => $admin, 'status' => $status, 'auth' => "true", 'info' => $info);
        $result = array("status" => 'true', 'data' => $resp, 'msg' => $msg);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getThreeRegions";
        $body = $payload["body"];
        $area = $body['area'];
        $resp = array();
        $NameArray = array("福泉地区", "开阳地区", "瓮安地区");
        $TypeArray = array("add", "reduce");
        for ($i = 0; $i < 3; $i++) {
            $regions = array();
            for ($j = 0; $j < 2; $j++) {
                if ($j == 0) {
                    $name = "新增量";
                } else {
                    $name = "消耗量";
                }
                $regions_data = array(
                    "name" => $name,
                    "data" => rand(1000, 99999),
                    'percentage' => (rand(0, 1000) / 10) . "%",
                    "type" => $TypeArray[rand(0, 1)]);
                array_push($regions, $regions_data);
            }
            $data = array(
                "name" => $NameArray[$i],
                "regions_data" => $regions
            );
            array_push($resp, $data);
        }
        $result = array("status" => 'true', 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getTaskNumber":
        $body = $payload["body"];
        $startDate = $body["startDate"];
        $endDate = $body['endDate'];
        $area = $body['area'];
        $resp = array("detail" => "今日运输车次：" . rand(1000, 99999));
        $result = array("status" => 'true', 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getTaskTable":
        $body = $payload["body"];
        $startDate = $body["startDate"];
        $endDate = $body['endDate'];
        $sessionId = $body['sessionId'];
        $count_array = array('户头1', '户头2', '户头3', '户头4', '户头5', '户头6', '户头7', '户头8', '户头9', '户头10', '户头11', '户头12',);
        $task = array();
        $ColumnName = array();
        $TableData = array();
        array_push($ColumnName, "日期");
        array_push($ColumnName, "交货人");
        array_push($ColumnName, "收货人");
        array_push($ColumnName, "车牌号");
        array_push($ColumnName, "重量");
        for ($i = 0; $i < 9; $i++) {
            $detail = array();
            array_push($detail, "TID" . date("YmdHis") . rand(100, 999));
            array_push($detail, date("Y/m/d"));
            array_push($detail, $count_array[rand(0, 11)]);
            array_push($detail, $count_array[rand(0, 11)]);
            array_push($detail, "沪A" . str_pad(rand(1, 10000), 5, "0", STR_PAD_LEFT));
            array_push($detail, rand(100, 1000) / 10);
            array_push($TableData, $detail);
        }
        $resp = array("ColumnName" => $ColumnName, 'TableData' => $TableData);
        $result = array("status" => 'true', 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getTaskDetailPage":
        $body = $payload["body"];
        $taskid = $body["taskid"];
        $info = array();
        $route = array();
        $longitude = 0;
        $latitude = 0;
        $start = array("longitude" => rand(12116000, 12128000) / 100000, "latitude" => rand(31053, 31653) / 1000);
        $end = array("longitude" => rand(12116000, 12128000) / 100000, "latitude" => rand(31053, 31653) / 1000);
        $info_detail = array('key' => "运输货品", 'value' => "商品" . rand(1, 10));
        array_push($info, $info_detail);
        $info_detail = array('key' => "装货时间", 'value' => date("Y-m-d H:i:s"));
        array_push($info, $info_detail);
        $info_detail = array('key' => "装货地点", 'value' => "金海路XXXXXXX号" . rand(1, 10));
        array_push($info, $info_detail);
        $info_detail = array('key' => "卸货地点", 'value' => "金海路XXXXXXX号" . rand(1, 10));
        array_push($info, $info_detail);
        $info_detail = array('key' => "装货户头", 'value' => "户头" . rand(1, 10));
        array_push($info, $info_detail);
        $info_detail = array('key' => "卸货户头", 'value' => "户头" . rand(1, 10));
        array_push($info, $info_detail);
        $info_detail = array('key' => "单价(元/吨)", 'value' => rand(10, 100));
        array_push($info, $info_detail);
        $info_detail = array('key' => "车牌号", 'value' => "沪A" . rand(10000, 99999));
        array_push($info, $info_detail);
        for ($i = 0; $i < rand(10, 40); $i++) {
            $route_detail = array("longitude" => rand(12126000, 12128000) / 100000, "latitude" => rand(31053, 31653) / 1000);
            array_push($route, $route_detail);
        }
        $resp = array("info" => $info, "route" => $route, "start" => $start, "end" => $end);
        $result = array("status" => 'true', 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getAllTaskPage":
        $body = $payload["body"];
        $DateNow = $body["dateNow"];
        $route = array();
        for ($i = 0; $i < rand(10, 50); $i++) {
            $start = array("longitude" => rand(12116000, 12128000) / 100000, "latitude" => rand(31053, 31653) / 1000);
            $end = array("longitude" => rand(12116000, 12128000) / 100000, "latitude" => rand(31053, 31653) / 1000);
            $route_detail = array("start" => $start, "end" => $end, 'taskid' => "TID" . date("YmdHis") . rand(100, 999));
            array_push($route, $route_detail);
        }
        $result = array("status" => 'true', 'data' => $route, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getPoundData":
        $body = $payload["body"];
        $poundDate = $body["poundDate"];
        $pound = array();
        $type = array("type", "今日数据", "昨日数据");
        array_push($pound, $type);
        $today_add = rand(0, 1000) / 10;
        $today_delete = rand(0, 1000) / 10;
        $yestaday_add = rand(0, 1000) / 10;
        $yestaday_delete = rand(0, 1000) / 10;
        array_push($pound, array("新增量", $today_add, $yestaday_add));
        array_push($pound, array("消耗量", $today_delete, $yestaday_delete));
        $result = array("status" => 'true', 'data' => $pound, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getCompanyPound":
        $body = $payload["body"];
        $companyDate = $body["companyDate"];
        $companyData = array();
        $month = array();
        $company = array();
        $title = date("Y") . "年总消耗量" . rand(100, 20000) . "吨";
        for ($i = 0; $i < 4; $i++) {
            array_push($company, "公司" . $i);
        }
        for ($i = 0; $i < 6; $i++) {
            array_push($month, date("Y-m", mktime(0, 0, 0, date("m") - $i - 1, 1, date("Y"))));
        }
        for ($i = 0; $i < count($company); $i++) {
            $company_detail = array();
            for ($j = 0; $j < count($month); $j++) {
                array_push($company_detail, rand(10, 9999) / 10);
            }
            array_push($companyData, $company_detail);
        }
        $resp = array("company" => $company, "month" => $month, "companyData" => $companyData, "title" => $title);
        $result = array("status" => 'true', 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getTrainNumber":
        $body = $payload["body"];
        $startTime = $body["startTime"];
        $dateTime = date("H:i", time());
        $trainNumber = rand(0, 10);
        $pound = 0;
        for ($i = 0; $i < $trainNumber; $i++) {
            $pound = $pound + rand(40, 200) / 10;
        }
        $resp = array('DateTime' => $dateTime, 'Number' => $trainNumber, 'Pound' => $pound);
        $result = array("status" => 'true', 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getTop7Company":
        $body = $payload["body"];
        $startTime = $body["startTime"];
//        $dateTime=date("H:i",time());
        $resp = array();
        array_push($resp, array("pound", "name"));
        for ($i = 0; $i < 7; $i++) {
            array_push($resp, array(rand(200, 1000), "公司" . ($i + 1)));
        }
        $max = 0;
        for ($i = 1; $i < count($resp); $i++) {
            if ($max < $resp[$i][0]) {
                $max = $resp[$i][0];
            }
        }
        $result = array("status" => 'true', 'data' => $resp, "max" => $max, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getCompanyName":
        $body = $payload["body"];
        $session = $body["session"];
        $company = array();
        for ($i = 0; $i < rand(10, 20); $i++) {
            $detail = array("name" => '公司' . $i, 'companyid' => "CID" . rand(10000, 99999));
            array_push($company, $detail);
        }
        $result = array("status" => 'true', "auth" => "true", 'data' => $company, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getGoodsName":
        $body = $payload["body"];
        $session = $body["session"];
        $company = array();
        for ($i = 0; $i < rand(10, 20); $i++) {
            $detail = array("name" => '种类' . $i);
            array_push($company, $detail);
        }
        $result = array("status" => 'true', "auth" => "true", 'data' => $company, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getCityData":
        $body = $payload["body"];
        $session = $body["session"];
        $type = $body["type"];
        $city_data = array();
        $type_data = array("新增量", "消耗量");
        if ($type == "company") {
            $title = "XX公司各区县统计";
        } else {
            $title = "贵州省各区县统计";
        }
        $data = array();
        for ($i = 0; $i < rand(20, 100); $i++) {
            array_push($city_data, "区县" . $i);
        }
        for ($i = 0; $i < count($type_data); $i++) {
            $data_detail = array();
            for ($j = 0; $j < count($city_data); $j++) {
                array_push($data_detail, rand(100, 20000));
            }
            array_push($data, $data_detail);
        }
        $resp = array("title" => $title, 'city' => $city_data, 'type' => $type_data, 'data' => $data);
        $result = array("status" => 'true', "auth" => "true", 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getCompanyData":
        $body = $payload["body"];
        $session = $body["session"];
        $company = $body["company"];
        $startTime = $body["startTime"];
        $endTime = $body["endTime"];
        $title = "XX公司" . $startTime . "至" . $endTime . "货物统计图";
        $type_data = array();
        $data = array();
        for ($i = 0; $i < 8; $i++) {
            array_push($type_data, "类型" . ($i + 1));
        }
        for ($i = 0; $i < count($type_data); $i++) {
            array_push($data, rand(40, 1000));
        }
        $resp = array("title" => $title, 'type' => $type_data, 'data' => $data);
        $result = array("status" => 'true', "auth" => "true", 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getWayBillTable":
        $body = $payload["body"];
        $session = $body["session"];
        $type = $body["type"];
        $company = $body["company"];
        $startTime = $body["startTime"];
        $endTime = $body["endTime"];
        if ($type == "driver") {
            $title = "XX司机" . $startTime . "至" . $endTime . "运单详情";
        } else {
            $title = "XX公司" . $startTime . "至" . $endTime . "运单详情";
        }
        $ColumnName = array();
        $TableData = array();
        array_push($ColumnName, "车牌号");
        array_push($ColumnName, "装货户头");
        array_push($ColumnName, "卸货户头");
        for ($i = 0; $i < rand(80, 1000); $i++) {
            $TableDetail = array();
            array_push($TableDetail, "TID" . rand(10000, 99999));
            array_push($TableDetail, "沪A" . rand(10000, 99999));
            array_push($TableDetail, "户头" . rand(10000, 99999));
            array_push($TableDetail, "户头" . rand(10000, 99999));
            array_push($TableData, $TableDetail);
        }
        $resp = array("Title" => $title, 'Column' => $ColumnName, 'Table' => $TableData);
        $result = array("status" => 'true', "auth" => "true", 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getDonePound":
        $body = $payload["body"];
        $session = $body["session"];
        $data = "&nbsp今年已完成吨数：" . rand(1000, 20000) . "吨&nbsp";
        $result = array("status" => 'true', "auth" => "true", 'data' => $data, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "WayBillTable":
        $body = $payload["body"];
        $session = $body["session"];
        $company = $body["company"];
        $goods = $body["goods"];
        $start = $body["start"];
        $end = $body["end"];
        $wayBillTable = array();
        $ColumnName = array();
        $TableData = array();
        $status = array("待接受", "进行中", "已完成", "已拒绝");
        array_push($ColumnName, "任务编号");
        array_push($ColumnName, "车牌号");
        array_push($ColumnName, "运输公司");
        array_push($ColumnName, "装货户头");
        array_push($ColumnName, "卸货户头");
        array_push($ColumnName, "装货时间");
        array_push($ColumnName, "卸货时间");
        array_push($ColumnName, "状态");
        for ($i = 0; $i < rand(100, 2000); $i++) {
            $waybillDetail = array();
            array_push($waybillDetail, "TID" . rand(10000, 99999));
            array_push($waybillDetail, "浙A" . rand(10000, 99999));
            array_push($waybillDetail, "运输公司" . rand(1, 20));
            array_push($waybillDetail, "装货户头" . rand(1, 20));
            array_push($waybillDetail, "卸货户头" . rand(1, 20));
            array_push($waybillDetail, date("Y-m-d H:i:s", time()));
            array_push($waybillDetail, date("Y-m-d H:i:s", time()));
            array_push($waybillDetail, $status[rand(0, 3)]);
            array_push($TableData, $waybillDetail);
        }
        $resp = array("ColumnName" => $ColumnName, "TableData" => $TableData);
        $result = array("status" => 'true', "auth" => "true", 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "TaskDetailPage":
        $body = $payload["body"];
        $taskid = $body["taskid"];
        $detail = array();
        $status = array("待接受", "进行中", "已完成", "已拒绝");
        $state_index = rand(0, 3);
        $video_list = array();
        if ($state_index == 0) {
            array_push($detail, array("type" => 'info', "key" => "车牌号", "value" => ""));
            array_push($detail, array("type" => 'info', "key" => "运输公司", "value" => "运输公司" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "装货户头", "value" => "装货户头" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "卸货户头", "value" => "卸货户头" . rand(10000, 99999)));
            array_push($detail, array("type" => 'pic', "key" => "装货时间", "value" => "", 'taskid' => "", 'pictype' => ''));
            array_push($detail, array("type" => 'pic', "key" => "卸货时间", "value" => "", 'taskid' => "", 'pictype' => ''));
            array_push($detail, array("type" => 'info', "key" => "发货地址", "value" => "XXXXXXXXXXXXXXXXXXXXXXXXX" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "收货地址", "value" => "XXXXXXXXXXXXXXXXXXXXXXXXX" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "状态", "value" => $status[$state_index]));
        } elseif ($state_index == 1) {
            $s = rand(0, 2);
            array_push($detail, array("type" => 'info', "key" => "车牌号", "value" => "浙A" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "运输公司", "value" => "运输公司" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "装货户头", "value" => "装货户头" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "卸货户头", "value" => "卸货户头" . rand(10000, 99999)));
            if ($s == 0) {
                array_push($detail, array("type" => 'pic', "key" => "装货时间", "value" => "", 'src' => ''));
                array_push($detail, array("type" => 'pic', "key" => "卸货时间", "value" => "", 'src' => ''));
            } elseif ($s == 1) {
                array_push($detail, array("type" => 'pic', "key" => "装货时间", "value" => date("Y-m-d H:i:s", time()), 'taskid' => $taskid, 'pictype' => 'upload'));
                array_push($detail, array("type" => 'pic', "key" => "卸货时间", "value" => "", 'src' => ''));
            } else {
                array_push($detail, array("type" => 'pic', "key" => "装货时间", "value" => date("Y-m-d H:i:s", time()), 'taskid' => $taskid, 'pictype' => 'upload'));
                array_push($detail, array("type" => 'pic', "key" => "卸货时间", "value" => date("Y-m-d H:i:s", time()), 'taskid' => $taskid, 'pictype' => 'unload'));
            }
            array_push($detail, array("type" => 'info', "key" => "发货地址", "value" => "XXXXXXXXXXXXXXXXXXXXXXXXX" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "收货地址", "value" => "XXXXXXXXXXXXXXXXXXXXXXXXX" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "状态", "value" => $status[$state_index]));
            $video_tail = rand(0, 1);
            if ($video_tail == 0) {
            } else {
                for ($i = 0; $i < rand(4, 10); $i++) {
                    if (rand(0, 1) == 0) {
                        $video = array("type" => 'info', "name" => '视频' . ($i + 1) . "(装货视频)", "src" => "http://www.hkrob.com/video/123.mp4");
                        array_push($video_list, $video);
                    } else {
                        $video = array("type" => 'info', "name" => '视频' . ($i + 1) . "(卸货视频)", "src" => "http://www.hkrob.com/video/123.mp4");
                        array_push($video_list, $video);
                    }
                }
            }
        } elseif ($state_index == 2) {
            array_push($detail, array("type" => 'info', "key" => "车牌号", "value" => "浙A" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "运输公司", "value" => "运输公司" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "装货户头", "value" => "装货户头" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "卸货户头", "value" => "卸货户头" . rand(10000, 99999)));
            array_push($detail, array("type" => 'pic', "key" => "装货时间", "value" => date("Y-m-d H:i:s", time()), 'taskid' => $taskid, 'pictype' => 'upload'));
            array_push($detail, array("type" => 'pic', "key" => "卸货时间", "value" => date("Y-m-d H:i:s", time()), 'taskid' => $taskid, 'pictype' => 'unload'));
            array_push($detail, array("type" => 'info', "key" => "发货地址", "value" => "XXXXXXXXXXXXXXXXXXXXXXXXX" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "收货地址", "value" => "XXXXXXXXXXXXXXXXXXXXXXXXX" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "状态", "value" => $status[$state_index]));
            $video_tail = rand(0, 1);
            if ($video_tail == 0) {
            } else {
                for ($i = 0; $i < rand(4, 10); $i++) {
                    if (rand(0, 1) == 0) {
                        $video = array("type" => 'info', "name" => '视频' . ($i + 1) . "(装货视频)", "src" => "http://www.hkrob.com/video/123.mp4");
                        array_push($video_list, $video);
                    } else {
                        $video = array("type" => 'info', "name" => '视频' . ($i + 1) . "(卸货视频)", "src" => "http://www.hkrob.com/video/123.mp4");
                        array_push($video_list, $video);
                    }
                }
            }
        } else {
            array_push($detail, array("type" => 'info', "key" => "车牌号", "value" => ""));
            array_push($detail, array("type" => 'info', "key" => "运输公司", "value" => "运输公司" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "装货户头", "value" => "装货户头" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "卸货户头", "value" => "卸货户头" . rand(10000, 99999)));
            array_push($detail, array("type" => 'pic', "key" => "装货时间", "value" => "", 'taskid' => "", 'pictype' => ''));
            array_push($detail, array("type" => 'pic', "key" => "卸货时间", "value" => "", 'taskid' => "", 'pictype' => ''));
            array_push($detail, array("type" => 'info', "key" => "发货地址", "value" => "XXXXXXXXXXXXXXXXXXXXXXXXX" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "收货地址", "value" => "XXXXXXXXXXXXXXXXXXXXXXXXX" . rand(10000, 99999)));
            array_push($detail, array("type" => 'info', "key" => "状态", "value" => $status[$state_index]));
        }
        $resp = array("taskid" => $taskid, "video" => $video_list, "detail" => $detail);
        $result = array("status" => 'true', "auth" => "true", 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "ManageUserTable":
        $body = $payload["body"];
        $session = $body["session"];
        $wayBillTable = array();
        $ColumnName = array();
        $TableData = array();
        $status = array("待接受", "进行中", "已完成", "已拒绝");
        array_push($ColumnName, "Column1");
        array_push($ColumnName, "Column2");
        array_push($ColumnName, "Column3");
        array_push($ColumnName, "Column4");
        array_push($ColumnName, "Column5");
        array_push($ColumnName, "Column6");
        array_push($ColumnName, "Column7");
        array_push($ColumnName, "Column8");
        for ($i = 0; $i < rand(100, 2000); $i++) {
            $UserDetail = array();
            array_push($UserDetail, "UID" . rand(10000, 99999));
            array_push($UserDetail, "Value" . rand(100, 999));
            array_push($UserDetail, "Value" . rand(100, 999));
            array_push($UserDetail, "Value" . rand(100, 999));
            array_push($UserDetail, "Value" . rand(100, 999));
            array_push($UserDetail, "Value" . rand(100, 999));
            array_push($UserDetail, "Value" . rand(100, 999));
            array_push($UserDetail, "Value" . rand(100, 999));
            array_push($UserDetail, "Value" . rand(100, 999));
            array_push($TableData, $UserDetail);
        }
        $resp = array("ColumnName" => $ColumnName, "TableData" => $TableData);
        $result = array("status" => 'true', "auth" => "true", 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "ManageUserDelete":
        $body = $payload["body"];
        $userid = $body["userid"];
        $result = array("status" => 'true', "auth" => "true", 'msg' => "用户已删除");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getDriverName":
        $body = $payload["body"];
        $session = $body["session"];
        $driver = array();
        for ($i = 0; $i < rand(10, 20); $i++) {
            $detail = array("name" => '司机' . ($i + 1), 'driverid' => "UID" . rand(10000, 99999));
            array_push($driver, $detail);
        }
        $result = array("status" => 'true', "auth" => "true", 'data' => $driver, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "getDriverData":
        $body = $payload["body"];
        $session = $body["session"];
        $driver = $body["driver"];
        $startTime = $body["startTime"];
        $endTime = $body["endTime"];
        $title = "XX司机" . $startTime . "至" . $endTime . "货物统计图";
        $type_data = array();
        $data = array();
        for ($i = 0; $i < 8; $i++) {
            array_push($type_data, "类型" . ($i + 1));
        }
        for ($i = 0; $i < count($type_data); $i++) {
            array_push($data, rand(40, 1000));
        }
        $resp = array("title" => $title, 'type' => $type_data, 'data' => $data);
        $result = array("status" => 'true', "auth" => "true", 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "CompanyWayBillTable":
        $body = $payload["body"];
        $session = $body["session"];
        $status = $body["status"];
        $driver = $body["driver"];
        $start = $body["start"];
        $end = $body["end"];
        $address = $body["address"];
        $wayBillTable = array();
        $ColumnName = array();
        $TableData = array();
        $statusArray = array("待接受", "进行中", "已完成", "已拒绝");
        array_push($ColumnName, "任务编码");
        array_push($ColumnName, "车牌号");
        array_push($ColumnName, "司机姓名");
        array_push($ColumnName, "装货地点");
        array_push($ColumnName, "卸货地点");
        array_push($ColumnName, "装货户头");
        array_push($ColumnName, "卸货户头");
        array_push($ColumnName, "任务状态");
        array_push($ColumnName, "操作");
        $driver_name = "司机A";
        for ($i = 0; $i < rand(0, 2000); $i++) {
            $UserDetail = array();
            $status_index = rand(0, 3);
            array_push($UserDetail, "TID" . rand(10000, 99999));
            array_push($UserDetail, "沪A" . rand(10000, 99999));
            if ($driver == "all") {
                array_push($UserDetail, "司机姓名" . rand(1000, 9999));
            } else {
                array_push($UserDetail, $driver_name);
            }
            if ($address == "") {
                array_push($UserDetail, "地址" . rand(1000, 9999));
                array_push($UserDetail, "地址" . rand(1000, 9999));
            } else {
                array_push($UserDetail, $address);
                array_push($UserDetail, $address);
            }
            array_push($UserDetail, "Value" . rand(100, 999));
            array_push($UserDetail, "Value" . rand(100, 999));
            if ($status == "all") {
                array_push($UserDetail, $statusArray[$status_index]);
            } else {
                array_push($UserDetail, $statusArray[$status]);
            }
            array_push($UserDetail, $status_index + 1);
            array_push($TableData, $UserDetail);
        }
        $resp = array("ColumnName" => $ColumnName, "TableData" => $TableData);
        $result = array("status" => 'true', "auth" => "true", 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "DeleteTask":
        $body = $payload["body"];
        $session = $body["session"];
        $taskid = $body["taskid"];
        $result = array("status" => 'true', "auth" => "true", 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "GetPlateList":
        $body = $payload["body"];
        $session = $body["session"];
        $plateList = array();
        for ($i = 0; $i < rand(10, 20); $i++) {
            array_push($plateList, "浙A" . rand(10000, 99999));
        }
        $result = array("status" => 'true', "data" => $plateList, "auth" => "true", 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "ReDistributeTask":
        $body = $payload["body"];
        $session = $body["session"];
        $plate = $body["plate"];
        $taskid = $body["taskid"];
        $result = array("status" => 'true', "auth" => "true", 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "GetFreeDriverPage":
        $body = $payload["body"];
        $session = $body["session"];
        $driver = $body["driver"];
        $driver_list = array();
        $TableData = array();
        $ColumnName = array();
        $type_array = array("内部司机", '外部司机');
        array_push($ColumnName, "序号");
        array_push($ColumnName, "司机编号");
        array_push($ColumnName, "姓名");
        array_push($ColumnName, "类型");
        array_push($ColumnName, "驾驶证件号");
        array_push($ColumnName, "操作");
        for ($i = 0; $i < rand(10, 300); $i++) {
            $UserDetail = array();
            $DriverID = "UID" . rand(10000, 99999);
            $type_index = rand(0, 1);
            array_push($UserDetail, $DriverID);
            array_push($UserDetail, $i + 1);
            array_push($UserDetail, $DriverID);
            if ($driver == "all") {
                array_push($UserDetail, "司机姓名" . rand(1000, 9999));
            } else {
                array_push($UserDetail, $driver);
            }
            array_push($UserDetail, $type_array[$type_index]);
            array_push($UserDetail, rand(1000000, 9999999) . rand(1000000, 9999999));
            array_push($TableData, $UserDetail);
        }
        $resp = array("ColumnName" => $ColumnName, "TableData" => $TableData);
        $result = array("status" => 'true', "auth" => "true", 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "GetDriverDetail":
        $driver_detail = array();
        $body = $payload["body"];
        $session = $body["session"];
        $driver = $body["driver"];
        $imgArray = array();
        $img_type = array("身份证国徽面", "身份证人像面", "行驶证信息", "驾驶证信息");
        $image_array = array("http://www.hkrob.com/pic/9.jpg", "http://www.hkrob.com/pic/12.jpg", "http://www.hkrob.com/pic/123.jpg", "http://www.hkrob.com/pic/1234.png");
        $imgArray_detail = array("src" => $image_array[rand(0, 3)], "value" => "身份证国徽面");
        array_push($imgArray, $imgArray_detail);
        $imgArray_detail = array("src" => $image_array[rand(0, 3)], "value" => "身份证人像面");
        array_push($imgArray, $imgArray_detail);
        $imgArray_detail = array("src" => $image_array[rand(0, 3)], "value" => "驾驶证信息");
        array_push($imgArray, $imgArray_detail);
        for ($i = 0; $i < rand(1, 10); $i++) {
            $imgArray_detail = array("src" => $image_array[rand(0, 3)], "value" => "行驶证信息");
            array_push($imgArray, $imgArray_detail);
        }
        $detail = array("key" => "司机姓名", "value" => "姓名" . rand(10, 200));
        array_push($driver_detail, $detail);
        $detail = array("key" => "类型", "value" => "类型" . rand(10, 200));
        array_push($driver_detail, $detail);
        $detail = array("key" => "驾驶证件号", "value" => "驾驶证件号" . rand(10, 200));
        array_push($driver_detail, $detail);
        $detail = array("key" => "身份证件号", "value" => "身份证件号" . rand(10, 200));
        array_push($driver_detail, $detail);
        $detail = array("key" => "车头行驶证件号", "value" => "车头行驶证件号" . rand(10, 200));
        array_push($driver_detail, $detail);
        $detail = array("key" => "挂车行驶证件号", "value" => "挂车行驶证件号" . rand(10, 200));
        array_push($driver_detail, $detail);
        $resp = array("driverid" => $driver, "img" => $imgArray, "driver" => $driver_detail);
        $result = array("status" => 'true', "auth" => "true", 'data' => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "GetDistributeInfo":
        $body = $payload["body"];
        $session = $body["session"];
        $driver = $body["driver"];
        $info = array();
        $plate = array();
        $goods = array();
        $account = array();
        for ($i = 0; $i < rand(2, 10); $i++) {
            array_push($plate, "沪A" . rand(10000, 99999));
        }
        for ($i = 0; $i < rand(2, 10); $i++) {
            array_push($goods, "商品" . rand(10000, 99999));
        }
        for ($i = 0; $i < rand(2, 10); $i++) {
            array_push($account, "户头" . rand(10000, 99999));
        }
        $info = array("plate" => $plate, 'goods' => $goods, 'account' => $account);
        $result = array("status" => 'true', "auth" => "true", 'data' => $info, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "DistributeTask":
        $body = $payload["body"];
        $session = $body["session"];
        $Driver = $body["Driver"];
        $Plate = $body["Plate"];
        $StartTime = $body["StartTime"];
        $Goods = $body["Goods"];
        $StartProvince = $body["StartProvince"];
        $StartCity = $body["StartCity"];
        $StartDistrict = $body["StartDistrict"];
        $StartAddress = $body["StartAddress"];
        $EndProvince = $body["EndProvince"];
        $EndCity = $body["EndCity"];
        $EndDistrict = $body["EndDistrict"];
        $EndAddress = $body["EndAddress"];
        $LoadAccountValue = $body["LoadAccountValue"];
        $UnloadAccountValue = $body["UnloadAccountValue"];
        $PoundValue = $body["PoundValue"];
        $PoundPrice = $body["PoundPrice"];
        $result = array("status" => 'true', "auth" => "true", 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "GetFreeDriver":
        $body = $payload["body"];
        $session = $body["session"];
        $driver = array();
        for ($i = 0; $i < rand(10, 20); $i++) {
            $driver_detail = array("longitude" => rand(12116000, 12128000) / 100000, "latitude" => rand(31053, 31653) / 1000, "driver" => "UID" . rand(10000, 99999));
            array_push($driver, $driver_detail);
        }
        $result = array("status" => 'true', "auth" => "true", "data" => $driver, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "AllDriver":
        $body = $payload["body"];
        $session = $body["session"];
        $driver = array();
        $ColumnName = array();
        $TableData = array();
        $type_array = array("内部司机", '外部司机');
        $status_array = array("待审核", '已审核', '待注销');
        array_push($ColumnName, "序号");
        array_push($ColumnName, "司机姓名");
        array_push($ColumnName, "司机类型");
        array_push($ColumnName, "手机号");
        array_push($ColumnName, "身份证号");
        array_push($ColumnName, "状态");
        array_push($ColumnName, "操作");
        for ($i = 0; $i < rand(50, 200); $i++) {
            $table_detail = array();
            $type = rand(0, 1);
            $status = rand(0, 2);
            array_push($table_detail, 'UID' . rand(10000, 99999));
            array_push($table_detail, $type);
            array_push($table_detail, $status);
            array_push($table_detail, $i + 1);
            array_push($table_detail, '姓名' . rand(10000, 99999));
            array_push($table_detail, $type_array[$type]);
            array_push($table_detail, rand(158001, 158999) . rand(10000, 99999));
            array_push($table_detail, rand(158001, 158999) . rand(10000, 99999) . rand(1510000, 1599999));
            array_push($table_detail, $status_array[$status]);
            array_push($TableData, $table_detail);
        }
        $resp = array("Column" => $ColumnName, "Table" => $TableData);
        $result = array("status" => 'true', "auth" => "true", "data" => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "AgreeDriverApply":
        $body = $payload["body"];
        $session = $body["session"];
        $driver = $body["driver"];
        $result = array("status" => 'true', "auth" => "true", 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "DeleteDriverApply":
        $body = $payload["body"];
        $session = $body["session"];
        $driver = $body["driver"];
        $result = array("status" => 'true', "auth" => "true", 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "GetManageTable":
        $body = $payload["body"];
        $session = $body["session"];
        $uname = $body["uname"];
        $ColumnName = array();
        $TableData = array();
        $type_array = array("app", 'pc');
        array_push($ColumnName, "序号");
        array_push($ColumnName, "用户编码");
        array_push($ColumnName, "登录名");
        array_push($ColumnName, "真实姓名");
        array_push($ColumnName, "电话号码");
        array_push($ColumnName, "身份证号");
        array_push($ColumnName, "邮箱地址");
        array_push($ColumnName, "用户类型");
        array_push($ColumnName, "操作");
        for ($i = 0; $i < rand(50, 200); $i++) {
            $type = rand(0, 1);
            $manage_detail = array();
            if ($type == 0) {
                array_push($manage_detail, $type_array[$type]);
                array_push($manage_detail, $i + 1);
                array_push($manage_detail, "UID" . rand(10000, 99999));
                array_push($manage_detail, "");
                if ($uname == "") {
                    array_push($manage_detail, "UNAME" . rand(10000, 99999));
                } else {
                    array_push($manage_detail, $uname);
                }
                array_push($manage_detail, rand(158001, 158999) . rand(10000, 99999));
                array_push($manage_detail, rand(158001, 158999) . rand(10000, 99999) . rand(1510000, 1599999));
                array_push($manage_detail, "");
                array_push($manage_detail, $type_array[$type]);
            } else {
                array_push($manage_detail, $type_array[$type]);
                array_push($manage_detail, $i + 1);
                array_push($manage_detail, "UID" . rand(10000, 99999));
                array_push($manage_detail, "LNAME" . rand(10000, 99999));
                if ($uname == "") {
                    array_push($manage_detail, "UNAME" . rand(10000, 99999));
                } else {
                    array_push($manage_detail, $uname);
                }
                array_push($manage_detail, rand(158001, 158999) . rand(10000, 99999));
                array_push($manage_detail, rand(158001, 158999) . rand(10000, 99999) . rand(1510000, 1599999));
                array_push($manage_detail, "UEMAIL" . rand(100, 999) . "@163.com");
                array_push($manage_detail, $type_array[$type]);
            }
            array_push($TableData, $manage_detail);
        }
        $resp = array("Column" => $ColumnName, 'Table' => $TableData);
        $result = array("status" => 'true', "auth" => "true", "data" => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "GetCompanyManageInfo":
        $body = $payload["body"];
        $session = $body["session"];
        $uid = $body["uid"];
        $resp = array(
            "LoginName" => "LNAME" . rand(10000, 99999),
            "Password" => rand(10000, 99999),
            "TrueName" => "UNAME" . rand(10000, 99999),
            "Email" => "UEMAIL" . rand(100, 999) . "@163.com",
            "ID" => rand(158001, 158999) . rand(10000, 99999) . rand(1510000, 1599999),
            "Telphone" => rand(158001, 158999) . rand(10000, 99999),
        );
        $result = array("status" => 'true', "auth" => "true", "data" => $resp, 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    case "AddNewManage":
        $body = $payload["body"];
        $session = $body["session"];
        $LoginName = $body["LoginName"];
        $Password = $body["Password"];
        $TrueName = $body["TrueName"];
        $Email = $body["Email"];
        $ID = $body["ID"];
        $Telephone = $body["Telephone"];
        $result = array("status" => 'true', "auth" => "true", 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "UpdateManage":
        $body = $payload["body"];
        $session = $body["session"];
        $LoginName = $body["LoginName"];
        $Password = $body["Password"];
        $TrueName = $body["TrueName"];
        $Email = $body["Email"];
        $ID = $body["ID"];
        $Telephone = $body["Telephone"];
        $uid = $body["uid"];
        $result = array("status" => 'true', "auth" => "true", 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "DeleteManage":
        $body = $payload["body"];
        $session = $body["session"];
        $uid = $body["uid"];
        $result = array("status" => 'true', "auth" => "true", 'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "UserLogin":
        $body = $payload["body"];
        $uname = $body["uname"];
        $password = $body["password"];
        if ($uname == "admin") {
            $session = '123456';
            $type = 'government';
            $status = 'true';
            $msg = '用户登录成功';
        } elseif ($uname == 'admin1') {
            $session = '234567';
            $type = 'government';
            $status = 'true';
            $msg = '用户登录成功';
        } elseif ($uname == 'admin2') {
            $session = '345678';
            $type = 'company';
            $status = 'true';
            $msg = '用户登录成功';
        } elseif ($uname == 'admin3') {
            $session = '456789';
            $type = 'company';
            $status = 'true';
            $msg = '用户登录成功';
        } else {
            $session = '';
            $type = '';
            $status = 'false';
            $msg = '用户名或密码错误,请重新填写';
        }
        $resp = array('session' => $session, "type" => $type);
        $result = array("status" => $status, 'data' => $resp, "auth" => "true", 'msg' => $msg);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    case "getTaskPic":
        $body = $payload["body"];
        $taskid = $body["taskid"];
        $type = $body["type"];
        if($type=="upload"){
            $title="装货图片";
            $picArray=array();
            for($i=0;$i<rand(1,10);$i++){
                if(rand(0,1)==0){
                    array_push($picArray,'http://www.hkrob.com/pic/9.jpg');
                }
                else{
                    array_push($picArray,'http://www.hkrob.com/pic/1234.png');
                }
            }
            $status='true';
            $auth='true';
        }
        elseif($type=="unload"){
            $title="卸货图片";
            $picArray=array();
            for($i=0;$i<rand(1,10);$i++){
                if(rand(0,1)==0){
                    array_push($picArray,'http://www.hkrob.com/pic/9.jpg');
                }
                else{
                    array_push($picArray,'http://www.hkrob.com/pic/1234.png');
                }
            }
            $status='true';
            $auth='true';
        }
        else{
            $title="未知类型的图片";
            $picArray=array();
            $status='false';
            $auth='false';
        }
        $result = array("status" => $status, "auth" => $auth,'title'=>$title,'pic'=>$picArray,'msg' => "信息获取成功");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
    default:
        $result = array("status" => 'false', "auth" => "false", 'msg' => "非合法操作");
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
}
?>