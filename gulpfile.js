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

// var replace_content = "C:/wamp/www/dist_1/usr_img/";
var replace_install = "/dist_1";
var option = {
    buildPath: "C:/wamp/www/dist_1"
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
    gulp.src("./js/theams/*")
        .pipe(gulp.dest(option.buildPath+"/js/theams/"));
    gulp.src("./js/echarts.min.js")
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src("./resource/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/"));
    gulp.src("./laydate/**/*")
        .pipe(gulp.dest(option.buildPath+"/laydate/"));
    gulp.src("./datetimePicker/**/*")
        .pipe(gulp.dest(option.buildPath+"/datetimePicker/"));
    gulp.src("./js/theams/*")
        .pipe(gulp.dest(option.buildPath+"/js/theams/"));
    gulp.src("./json/*")
        .pipe(gulp.dest(option.buildPath+"/json/"));
    gulp.src("./svg/**/*")
        .pipe(gulp.dest(option.buildPath+"/svg/"));
    gulp.src("./request.php")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./*.ico")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./*.js")
        .pipe(gulp.dest(option.buildPath+"/"));
});

gulp.task('scripts', function() {
    gulp.src('./js/hcu_util.js')
        .pipe(concat('hcu_util.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('hcu_util.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./js/index.js')
        .pipe(concat('index.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./js/login.js')
        .pipe(concat('login.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('login.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./js/map.js')
        .pipe(concat('map.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('map.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./css/index.css')
    // .pipe(concat('scope.css'))
        .pipe(rename('index.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(option.buildPath+"/css/"));
    gulp.src('./css/login.css')
    // .pipe(concat('scope.css'))
        .pipe(rename('login.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(option.buildPath+"/css/"));
    gulp.src('./css/map.css')
    // .pipe(concat('scope.css'))
        .pipe(rename('map.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(option.buildPath+"/css/"));
    gulp.src('./index.html')
        .pipe(rename("index.html"))
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./map.html')
        .pipe(rename("map.html"))
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./login.html')
        .pipe(rename("login.html"))
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
});
gulp.task('default',['clean'], function(){
    gulp.run('lint', 'scripts','resourcecopy');
});
