var gulp = require('gulp');

var jshint    = require('gulp-jshint'),
    concat    = require('gulp-concat'),
    wrap      = require("gulp-wrap"),
    uglify    = require('gulp-uglify'),
    rename    = require('gulp-rename'),
    webserver = require('gulp-webserver'),
    rm        = require('gulp-rm'),
    expect    = require('gulp-expect-file'),
    zip       = require('gulp-zip');

var zebkitFiles = [
    'src/easyoop.js',
    'src/layout.js',
    'src/util.js',
    'src/io.js',
    'src/data.js',
    'src/web.js',
    'src/ui.webstuff.js',
    'src/ui.webpointer.js',
    'src/ui.webkey.js',
    'src/ui.views.js',
    'src/ui.core.js',
    'src/ui.html.js',
    'src/ui.js',
    'src/ui.field.js',
    'src/ui.list.js',
    'src/ui.window.js',
    'src/ui.grid.js',
    'src/ui.tree.js',
    'src/ui.designer.js',
    'src/ui.bootstrap.js'
];

var runtimeFiles =[ 'zebkit.min.js',
                    'zebkit.js',
                    'zebkit.png',
                    'zebkit.json',
                    'ui.vk.min.js',
                    'ui.vk.json',
                    'ui.vk.hindi.json',
                    'ui.date.min.js',
                    'ui.date.json'   ];

gulp.task('http', function() {
    gulp.src('.')
        .pipe(webserver({
            port: 8090,
            host: "localhost",
            directoryListing: true,
            open: false
        }));
});

gulp.task('lint', function() {
    return gulp.src(zebkitFiles)
          .pipe(expect(zebkitFiles))
          .pipe(jshint({ eqnull : true }))
          .pipe(jshint.reporter('default'));
});

gulp.task('copy', function() {
    return gulp.src([ "src/zebkit.json",
                      "src/zebkit.png",
                      "src/ui.date.json",
                      "src/ui.vk.json",
                      "src/ui.vk.hindi.json"])
          .pipe(gulp.dest("."));
});

gulp.task('easyoopscript', function() {
    return gulp.src("src/easyoop.js")
          .pipe(rename('easyoop.min.js'))
          .pipe(uglify({ compress: false, mangle: false }))
          .pipe(gulp.dest("."));
});

gulp.task('datescript', function() {
    return gulp.src("src/ui.date.js")
          .pipe(rename('ui.date.min.js'))
          .pipe(uglify({ compress: false, mangle: false }))
          .pipe(gulp.dest("."));
});

gulp.task('vkscript', function() {
    return gulp.src("src/ui.vk.js")
          .pipe(rename('ui.vk.min.js'))
          .pipe(uglify({ compress: false, mangle: false }))
          .pipe(gulp.dest("."));
});

gulp.task('zebkitscript', function() {
    return gulp.src(zebkitFiles)
          .pipe(expect(zebkitFiles))
          .pipe(concat('zebkit.js'))
          .pipe(gulp.dest("."))
          .pipe(rename('zebkit.min.js'))
          .pipe(uglify({ compress: false, mangle: false }))
          .pipe(gulp.dest("."))
});


gulp.task('runtime', [ "scripts" ], function () {
    return gulp.src(runtimeFiles)
           .pipe(expect(runtimeFiles))
           .pipe(zip('zebkit.runtime.zip'))
           .pipe(gulp.dest("."))
});

gulp.task('removejs', ["runtime"], function() {
    return gulp.src([ 'ui.vk.min.js',
                      'ui.vk.json',
                      'ui.vk.hindi.json',
                      'ui.date.min.js',
                      'ui.date.json' ], { read: false })
           .pipe(rm());
});

gulp.task('watch', function() {
    gulp.watch(zebkitFiles, ['zebkitscript']);
});

gulp.task('scripts', [ "zebkitscript", 'datescript', 'vkscript', 'copy']);
gulp.task('default', [ 'removejs' ]);
