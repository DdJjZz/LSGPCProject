/**
 * Created by hyj on 2016/5/3.
 */

function log(str){
    console.log("Next Row is Error Log");
    console.log(str);
}
function date_compare_today(date){
    var temp = date.split("-");
    var input = new Date(parseInt(temp[0]),parseInt(temp[1])-1,parseInt(temp[2])-1);
    var today = new Date();

    if(input.getTime()<today.getTime()){
        return date;

    }else{
        return today.Format("yyyy-MM-dd");
    }
}

function date_compare(date1,date2){
    var temp1 = date1.split("-");
    var input1 = new Date(parseInt(temp1[0]),parseInt(temp1[1]),parseInt(temp1[2]));
    var temp2 = date2.split("-");
    var input2 = new Date(parseInt(temp2[0]),parseInt(temp2[1]),parseInt(temp2[2]));
    //var input = new Date().Format(date);
    if(input1.getTime()<input2.getTime()){
        return date1;

    }else{
        return date2;
    }
}

function get_minute_list(date){
    var input = date.split("-");
    var myDate=new Date();
    myDate.setDate(parseInt(input[2]));
    myDate.setMonth(parseInt(input[1])-1);	//set month (0 ~ 11)
    myDate.setFullYear(parseInt(input[0]));	//set year (4 numbers)
    myDate.setHours(0);	//set hour (0 ~ 23)
    myDate.setMinutes(0);	//set minutes(0 ~ 59)
    myDate.setSeconds(0);

    var ret = [];//new Array();

    for(var i=0;i<(24*60);i++){
        if(i>0) myDate.setTime(myDate.getTime()+60000);
        ret.push(myDate.Format("hh:mm"));
    }
    return ret;
}
function get_hour_list(date){
    var input = date.split("-");
    var myDate=new Date();
    myDate.setDate(parseInt(input[2]));
    myDate.setMonth(parseInt(input[1])-1);	
    myDate.setFullYear(parseInt(input[0]));	
    myDate.setHours(0);	
    myDate.setMinutes(0);	
    myDate.setSeconds(0);
    //console.log(myDate.Format("yyyy-MM-dd hh:mm:ss"));
    myDate.setTime(myDate.getTime()-1000*60*60*24*6);
    //console.log(myDate.Format("yyyy-MM-dd hh:mm:ss"));
    var ret = [];//new Array();

    for(var i=0;i<(24*7);i++){
        if(i>0) myDate.setTime(myDate.getTime()+60000*60);
        //var temp = myDate.toTimeString().split(":")
        ret.push(myDate.Format("MM-dd hh:mm"));
    }
    return ret;
}
function get_day_list(date){
    var input = date.split("-");
    var myDate=new Date();
    myDate.setDate(parseInt(input[2]));
    myDate.setMonth(parseInt(input[1])-1);	
    myDate.setFullYear(parseInt(input[0]));	
    myDate.setHours(0);	
    myDate.setMinutes(0);	
    myDate.setSeconds(0);
    myDate.setTime(myDate.getTime()-1000*60*60*24*29);
    var ret = [];//new Array();
    for(var i=0;i<(30);i++){
        if(i>0) myDate.setTime(myDate.getTime()+60000*60*24);
        //var temp = myDate.toTimeString().split(":")
        ret.push(myDate.Format("MM-dd"));
    }
    return ret;
}
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, 
        "d+": this.getDate(), 
        "h+": this.getHours(), 
        "m+": this.getMinutes(), 
        "s+": this.getSeconds(), 
        "q+": Math.floor((this.getMonth() + 3) / 3), 
        "S": this.getMilliseconds() 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
function get_yesterday(){
    var myDate=new Date();
    myDate.setTime(myDate.getTime()-60000*60*24);
    return myDate.Format("yyyy-MM-dd");
}


function getsec(str)
{
    var str1=Number(str.substring(1,str.length));
    var str2=str.substring(0,1);
    if (str2=="s")
    {
        return str1*1000;
    }
    else if (str2=="m")
    {
        return str1*60*1000;
    }
    else if (str2=="h")
    {
        return str1*60*60*1000;
    }
    else if (str2=="d")
    {
        return str1*24*60*60*1000;
    }
}
function setCookie(name,value,time)
{
    var strsec = getsec(time);
    var exp = new Date();
    var expires = exp.getTime() + Number(strsec);
    exp.setTime(exp.getTime() + Number(strsec));
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	arr=document.cookie.match(reg);
    if(arr === true)
        return unescape(arr[2]);
    else
        return null;
}
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!==null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
function touchcookie(){
    setCookie("Environmental.inspection.session",keystr,"m10");
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]); return null;
}
String.prototype.replaceAll = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
};
function getRelativeURL(){
    var url = document.location.toString();
    var arrUrl= url.split("://");
    var start = arrUrl[1].indexOf("/");
    var reUrl=arrUrl[1].substring(start);
    if(reUrl.indexOf("?")!=-1) {
        reUrl = reUrl.split("?")[0];
    }
    var end = reUrl.lastIndexOf("/");
    reUrl=reUrl.substring(0,end);

    reUrl=reUrl.replaceAll(/\/\/*/, "/");
    return url;

}

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1-BETA Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase     */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance  */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode    */
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s) {
    return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
}
function b64_sha1(s) {
    return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
}
function str_sha1(s) {
    return binb2str(core_sha1(str2binb(s), s.length * chrsz));
}
function hex_hmac_sha1(key, data) {
    return binb2hex(core_hmac_sha1(key, data));
}
function b64_hmac_sha1(key, data) {
    return binb2b64(core_hmac_sha1(key, data));
}
function str_hmac_sha1(key, data) {
    return binb2str(core_hmac_sha1(key, data));
}
/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test() {
    return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}
/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;
    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for (var j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);
}
/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}
/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
}
/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data) {
    var bkey = str2binb(key);
    if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);
    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
    return core_sha1(opad.concat(hash), 512 + 160);
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}
/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    return bin;
}
/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz)
        str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
    return str;
}
/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
}
/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}

/*
exports.date_compare_today=date_compare_today;
exports.date_compare=date_compare;
exports.get_minute_list=get_minute_list;
exports.get_hour_list=get_hour_list;
exports.get_day_list=get_day_list;
exports.get_yesterday=get_yesterday;
exports.Date.prototype.Format=Date.prototype.Format;*/
