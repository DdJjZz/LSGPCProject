/**
 * Created by hyj on 2016/7/25.
 */
var gulp=require('gulp');

var jshint = require('gulp-jshint');
var minifycss = require("gulp-minify-css");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var mkdirp = require('mkdirp');
var replace = require('gulp-replace');

// var replace_content = "D:/webrd/www/dist/usr_img/";
// var replace_install = "/dist";
// var option = {
//     buildPath: "../www/dist"
// }

var replace_content = "C:/wamp/www/dist/usr_img/";
var replace_install = "/dist";
var option = {
    buildPath: "C:/wamp/www/dist"
};

var option_html = {
    collapseWhitespace:true,
    collapseBooleanAttributes:true,
    removeComments:true,
    removeEmptyAttributes:true,
    removeStyleLinkTypeAttributes:true,
    minifyJS:true,
    minifyCSS:true
};

gulp.task('lint', function() {
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
gulp.task('clean',function(){
    return gulp.src(option.buildPath,{
        read:false
    }).pipe(clean({force:true}));
});

gulp.task("resourcecopy",function(){
    gulp.src("./image/*")
        .pipe(gulp.dest(option.buildPath+"/image/"));
    gulp.src("./imageshow/**/*")
        .pipe(gulp.dest(option.buildPath+"/imageshow/"));
    gulp.src("./img/*")
        .pipe(gulp.dest(option.buildPath+"/img/"));
    gulp.src("./resource/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/"));
    gulp.src("./php/*")
        .pipe(gulp.dest(option.buildPath+"/php/"));
    gulp.src("./ejs/*")
        .pipe(gulp.dest(option.buildPath+"/ejs/"));
    gulp.src("./svg/**/*")
        .pipe(gulp.dest(option.buildPath+"/svg/"));
    gulp.src("./swf/*")
        .pipe(gulp.dest(option.buildPath+"/swf/"));
    gulp.src("./video/**/*")
        .pipe(gulp.dest(option.buildPath+"/video/"));
    gulp.src("./screensaver/**/*")
        .pipe(gulp.dest(option.buildPath+"/screensaver/"));
    mkdirp.sync(option.buildPath+"/upload/");
    mkdirp.sync(option.buildPath+"/usr_img/");
    gulp.src("./jump.php")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./request.php")
        .pipe(replace(/_INSTALL_PATH_/,replace_install))
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./upload.php")
        .pipe(replace(/_UPLOAD_PATH_/,replace_content))
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./*.ico")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./*.js")
        .pipe(gulp.dest(option.buildPath+"/"));
    //gulp.src("./*.html")
    //   .pipe(gulp.dest(option.buildPath+"/"));
});

gulp.task('scripts', function() {
    // gulp.src('./js/comm_value.js')
    //     .pipe(concat('comm_value.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('comm_value.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/getLocation_js.js')
    //     .pipe(concat('getLocation_js.js'))
    //     // .pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('getLocation_js.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/menu_clear.js')
    //     .pipe(concat('menu_clear.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('menu_clear.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/DataExport.js')
    //     .pipe(concat('DataExport.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('DataExport.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/menu_show_js.js')
    //     .pipe(concat('menu_show_js.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('menu_show_js.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/UserFresh.js')
    //     .pipe(concat('UserFresh.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('UserFresh.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/UserDetail.js')
    //     .pipe(concat('UserDetail.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('UserDetail.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/UserNew.js')
    //     .pipe(concat('UserNew.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('UserNew.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/UserMod.js')
    //     .pipe(concat('UserMod.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('UserMod.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/UserDel.js')
    //     .pipe(concat('UserDel.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('UserDel.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/PGFresh.js')
    //     .pipe(concat('PGFresh.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('PGFresh.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/PGDetail.js')
    //     .pipe(concat('PGDetail.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('PGDetail.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/PGNew.js')
    //     .pipe(concat('PGNew.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('PGNew.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/PGMod.js')
    //     .pipe(concat('PGMod.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('PGMod.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/PGDel.js')
    //     .pipe(concat('PGDel.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('PGDel.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/ProjFresh.js')
    //     .pipe(concat('ProjFresh.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('ProjFresh.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/ProjDetail.js')
    //     .pipe(concat('ProjDetail.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('ProjDetail.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/ProjNew.js')
    //     .pipe(concat('ProjNew.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('ProjNew.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/ProjMod.js')
    //     .pipe(concat('ProjMod.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('ProjMod.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/ProjDel.js')
    //     .pipe(concat('ProjDel.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('ProjDel.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/PointFresh.js')
    //     .pipe(concat('PointFresh.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('PointFresh.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/PointDetail.js')
    //     .pipe(concat('PointDetail.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('PointDetail.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/PointPicture.js')
    //     .pipe(concat('PointPicture.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('PointPicture.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/PointDel.js')
    //     .pipe(concat('PointDel.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('PointDel.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/PointMod.js')
    //     .pipe(concat('PointMod.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('PointMod.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/PointNew.js')
    //     .pipe(concat('PointNew.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('PointNew.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    //
    // gulp.src('./js/DevFresh.js')
    //     .pipe(concat('DevFresh.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('DevFresh.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/DevDetail.js')
    //     .pipe(concat('DevDetail.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('DevDetail.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/DevNew.js')
    //     .pipe(concat('DevNew.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('DevNew.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/DevMod.js')
    //     .pipe(concat('DevMod.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('DevMod.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/DevDel.js')
    //     .pipe(concat('DevDel.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('DevDel.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    //
    // gulp.src('./js/DevAlarm.js')
    //     .pipe(concat('DevAlarm.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('DevAlarm.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/WarningQuery.js')
    //     .pipe(concat('WarningQuery.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('WarningQuery.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/AlarmCycle.js')
    //     .pipe(concat('AlarmCycle.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('AlarmCycle.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/MomitorCycle.js')
    //     .pipe(concat('MomitorCycle.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('MomitorCycle.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/ready_js.js')
    //     .pipe(concat('ready_js.js'))
    //     // .pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('ready_js.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/app.js')
    //     .pipe(concat('app.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('app.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/loginout.js')
    //     .pipe(concat('loginout.js'))
    //     // .pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('loginout.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    //
    //
    // gulp.src('./js/hcu_util.js')
    //     .pipe(concat('hcu_util.js'))
    //     //.pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('hcu_util.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/login.js')
    //     .pipe(concat('login.js'))
    //     // .pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('login.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./js/nprogress.js')
    //     .pipe(concat('nprogress.js'))
    //     // .pipe(gulp.dest('./dist/js'))
    //     .pipe(rename('nprogress.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest(option.buildPath+"/js/"));
    // gulp.src('./css/Login.css')
    // // .pipe(concat('Login.css'))
    //     .pipe(rename('Login.css'))
    //     .pipe(minifycss())
    //     .pipe(gulp.dest(option.buildPath+"/css/"));
    // gulp.src('./css/login_other.css')
    // // .pipe(concat('Login.css'))
    //     .pipe(rename('login_other.css'))
    //     .pipe(minifycss())
    //     .pipe(gulp.dest(option.buildPath+"/css/"));
    // gulp.src('./css/nprogress.css')
    // // .pipe(concat('nprogress.css'))
    //     .pipe(rename('nprogress.css'))
    //     .pipe(minifycss())
    //     .pipe(gulp.dest(option.buildPath+"/css/"));
    // gulp.src('./css/scope.css')
    // // .pipe(concat('scope.css'))
    //     .pipe(rename('scope.css'))
    //     .pipe(minifycss())
    //     .pipe(gulp.dest(option.buildPath+"/css/"));
    // gulp.src('./css/style.css')
    // // .pipe(concat('scope.css'))
    //     .pipe(rename('style.css'))
    //     .pipe(minifycss())
    //     .pipe(gulp.dest(option.buildPath+"/css/"));
    gulp.src('./index.html')
        .pipe(rename("index.html"))
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./map.html')
        .pipe(rename("map.html"))
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
});
gulp.task('default',['clean'], function(){
    gulp.run('lint', 'scripts','resourcecopy');
});
