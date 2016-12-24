//npm install gulp -g              先全局安装
 // npm insatll gulp --save-dev      安装到项目开发依赖
// npm install gulp-stylus --save-dev
//npm install gulp-minify-css --save-dev

//首先引入 gulp 模块
var gulp = require('gulp');
//引入 gulp-stylus 插件
var stylus = require('gulp-stylus');
//引入压缩 css 的文件
var minifycss = require('gulp-minify-css')
//gulp-uglify
var uglify = require('gulp-uglify')

var browserSync = require('browser-sync').create()
var reload = browserSync.reload;
//install gulp-nodemon --save-dev
var nodemon = require('gulp-nodemon')
gulp.task('nodemon', function(ab){
    var ft = false;
    return nodemon({
        script: './app.js'
    }).on('start', function(){
        if(!ft){
            ab();
            ft = true;
        }
    })
});

gulp.task('browserSync', ['nodemon'], function(){
    browserSync.init({
        proxy: {
            target: 'http://127.0.0.1:9978'
        },
        files: ['*'],
        port: 9888,
        open: false
    })
})

//创建一个编译 stylus 的任务
gulp.task('stylus', function(){
    
    return gulp.src('./stylus/**/*.styl')
        //执行 stulus 编译
        .pipe(stylus())
        //输出编译后的文件
        .pipe(gulp.dest('./public/css'))
})


gulp.task('minifycss', ['stylus'], function(){
    return gulp.src('./public/css/**/*.css')
            .pipe(minifycss())
            .pipe(gulp.dest('./public/mincss'))
})

gulp.task('uglify', function(){
    return gulp.src('./public/js/**/*.js')
            .pipe(uglify())
            .pipe(gulp.dest('./public/minjs'))
})

gulp.task('watcher', ['browserSync', 'stylus', 'uglify'], function(){
    gulp.watch('./stylus/**/*.styl', ['stylus'])
    gulp.watch('./public/js/**/*.js', ['uglify'])

    gulp.watch([
            './public/css/**/*.css',  
            './public/minjs/**/*.js'
        ]).on('change', function(){
            reload();
        })
})


//创建一个 default 任务
gulp.task('default', function(){
    console.log('this default')
});


