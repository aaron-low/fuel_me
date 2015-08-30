'use strict';

var gulp = require('gulp');
var mochify = require('mochify');
var browserify = require('gulp-browserify');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');
var mainBowerFiles = require('gulp-main-bower-files');
var less = require('gulp-less');
var path = require('path');
var server = require('gulp-express');
var imagemin = require('gulp-imagemin');
var mocha = require('gulp-mocha');


var wiredep = require('wiredep').stream;

var bower_src_dir = 'client/bower_components';

var filePath = {
    build: {
        dest: './dist',
        bowerDest: './dist/bower_components',
        css: './dist/css'
    },
    browserify: {
        src: './client/app.js',
        watch: [
            '!./bower_components/*.js',
            '!./bower_components/**/*.js',
            '!./client/**/*.spec.js',
            './client/*.js',
            './client/**/*.js',
            '/client/**/*.html'
        ]
    }
};

// Imagemin images and ouput them in dist
gulp.task('images', function () {
    gulp.src('client/images/**/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('less', function () {
    return gulp.src('./client/less/main.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest(filePath.build.css));
});

gulp.task('bower', function () {
    gulp.src('./client/index.html')
        .pipe(wiredep({}))
        .pipe(gulp.dest(filePath.build.dest));
});

gulp.task("bower-files", function () {
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
    .pipe(gulp.dest(filePath.build.bowerDest));
});

// Basic usage
gulp.task('bundle', function () {
    // Single entry point to browserify
    gulp.src('client/app.js')
        .pipe(browserify({
            shim: {
                leaflet: {
                    path: bower_src_dir + '/leaflet/dist/leaflet.js',
                    exports: 'L'
                },
                leaflet_google: {
                    path: bower_src_dir + '/leaflet-plugins/layer/tile/Google.js',
                    exports: 'leaflet_google'
                },
                leaflet_markercluster: {
                    path: bower_src_dir + '/leaflet.markercluster/dist/leaflet.markercluster.js',
                    exports: 'leaflet_markercluster'
                }
            },
            transform: ['debowerify'],
            insertGlobals: true,
            debug: !gulp.env.production
        }))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest(filePath.build.dest));
});

gulp.task('test-client', function () {
    mochify('./client/**/*spec.js', {
        transform: 'debowerify',
        // reporter: 'tap',
        cover: false,
        watch: true
    }).bundle();
});


gulp.task('test-server', function () {
    gulp.watch(['./server/**/*.js'], ['test-server']);
    return gulp.src('./server/**/**spec.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}));
});


gulp.task('watch', function () {
    gulp.watch(['client/**/*.js', '!client/bower_components'], ['bundle']);
    gulp.watch(['client/bower_components'], ['bower-files', 'bower']);
    gulp.watch('client/index.html', ['bower']);
    gulp.watch('client/**/*.less', ['less']);
    gulp.watch('client/images/**', ['images']);
    console.log('Watching...');
});

gulp.task('js-dev', function () {
    runSequence('bower', 'bower-files', 'images', 'bundle', 'less', 'watch')
});

gulp.task('run-server', function () {
    // Start the server at the beginning of the task
    server.run(['server/server.js']);

    gulp.watch(['server/**/*.js'], server.run);
});
