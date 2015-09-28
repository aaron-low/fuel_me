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
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var wiredep = require('wiredep').stream;
var del = require('del');
var zip = require('gulp-zip');

var bower_src_dir = 'client/bower_components';

var filePath = {
    build: {
        dest: './dist',
        bowerDest: './dist/bower_components',
        css: './dist/css',
        templatesDest: './dist/templates'
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

gulp.task('clean', function () {
    return del([
        'dist'
    ]);
});

// Imagemin images and ouput them in dist
gulp.task('images', function () {
    return gulp.src(['client/images/**/*.png', 'client/images/**/*.gif'], {base: 'client/images'})
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('less', function () {
    return gulp.src('./client/less/main.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest(filePath.build.css));
});

gulp.task('bower', function () {
    return gulp.src('./client/index.html')
        .pipe(wiredep({}))
        .pipe(gulp.dest(filePath.build.dest));
});

gulp.task('copy-templates', function() {
    return gulp.src('./client/templates/**/*.*')
        .pipe(gulp.dest(filePath.build.templatesDest));
});

gulp.task("bower-files", function () {
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(gulp.dest(filePath.build.bowerDest));
});

function bundle(prod) {
    // Single entry point to browserify
    var stream = gulp.src('client/app.js')
        .pipe(browserify({
            shim: {
                leaflet_google: {
                    path: bower_src_dir + '/leaflet-plugins/layer/tile/Google.js',
                    exports: 'leaflet_google'
                },
                leaflet_marker_text: {
                    path: bower_src_dir + '/leaflet-plugins/layer/Marker.Text.js',
                    exports: 'leaflet_marker_text'
                },
                leaflet_markercluster: {
                    path: bower_src_dir + '/leaflet.markercluster/dist/leaflet.markercluster.js',
                    exports: 'leaflet_markercluster'
                }
            },
            transform: ['debowerify'],
            insertGlobals: true,
            debug: !prod
        }))
        .pipe(rename('bundle.js'));
    if (prod) {
        stream = stream.pipe(uglify());
    }
    return stream.pipe(gulp.dest(filePath.build.dest));
}

// Basic usage
gulp.task('bundle-dev', function () {
    return bundle(false);
});

gulp.task('bundle-prod', function () {
    return bundle(true);
});

gulp.task('test-client', function () {
    return mochify('./client/**/*spec.js', {
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
    gulp.watch(['client/**/*.js', '!client/bower_components'], ['bundle-dev']);
    gulp.watch(['client/bower_components'], ['bower-files', 'bower']);
    gulp.watch('client/index.html', ['bower']);
    gulp.watch('client/**/*.less', ['less']);
    gulp.watch('client/images/**', ['images']);
    console.log('Watching...');
});

gulp.task('js-dev', function () {
    runSequence('bower', 'bower-files', 'copy-templates', 'images', 'bundle-dev', 'less', 'watch');
});

gulp.task('run-server', function () {
    // Start the server at the beginning of the task
    server.run(['server/server.js']);
    return gulp.watch(['server/**/*.js'], server.run);
});

gulp.task('zip-artifact', function () {
    return gulp.src([
        'dist/**/*',
        'server/**/*',
        'package.json'
    ], {base: "."})
        .pipe(zip('fuel_me.zip'))
        .pipe(gulp.dest('deploy'));

});

gulp.task('deploy', function () {
    return runSequence('clean', 'bower', 'bower-files', 'copy-templates', 'images', 'bundle-prod', 'less', 'zip-artifact');
});
