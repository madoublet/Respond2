const gulp = require('gulp');
const gutil = require('gulp-util');
const zip = require('gulp-zip');
const sourcemaps  = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const minify = require('gulp-minify');

const php = require('gulp-connect-php');
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

// copy node modules (no longer needed with new build)
gulp.task('copy-nm', function() {

    var src, dest;

    src = 'node_modules/**/*';
    dest = 'public/';

    return gulp.src(src, {base:"."})
        .pipe(gulp.dest(dest));
});

// create a zip for the release
gulp.task('create-zip', function() {

    var bundlePaths = [
      'app/**/*',
      'bootstrap/**/*',
      'database/**/*',
      'design/**/*',
      'public/app/**/*',
      'public/i18n/**/*',
      'public/themes/bootstrap/**/*',
      'public/themes/foundation/**/*',
      'public/themes/material/**/*',
      'public/.htaccess',
      'public/index.html',
      'public/index.php',
      'resources/emails/**/*',
      'resources/views/**/*',
      'storage/**/*',
      'tests/**/*',
      'typings/**/*',
      'vendor/**/*',
      '.env.example',
      'artisan',
      'LICENSE'
    ];

    return gulp.src(bundlePaths, {base: './', follow: true})
  		.pipe(zip('release.zip'))
  		.pipe(gulp.dest('./dist'));

});

// copy dependencies
gulp.task('copy-libs', function() {

  // copy folders
  var libs = [
      'node_modules/rxjs/**/*',
      'node_modules/angular2-in-memory-web-api/**/*',
      'node_modules/@angular/**/*',
      'node_modules/ng2-translate/**/*'
      ];

    return gulp.src(libs, {base: './node_modules/'})
  		.pipe(gulp.dest('public/dev/libs'));

});

// copy js
gulp.task('copy-files', function() {

  return gulp.src([])
    .pipe(gulp.dest('public/dev/libs/'));
});

// copy folders
gulp.task('copy-folders', function() {

  // copy folders
  var libs = [
      'node_modules/hashedit/**/*'
      ];

    return gulp.src(libs, {base: './node_modules/'})
  		.pipe(gulp.dest('public/app/libs'));

});

// copy js
gulp.task('copy-js', function() {

  return gulp.src([
      'node_modules/moment/min/moment-with-locales.min.js',
      'node_modules/dropzone/dist/min/dropzone.min.js'
    ])
    .pipe(gulp.dest('public/app/libs/'));
});


// copy static files
gulp.task('copy-css', function() {

    return gulp.src([
      'node_modules/dropzone/dist/min/dropzone.min.css',
      'node_modules/hashedit/dist/hashedit-min.css'
      ])
  		.pipe(gulp.dest('public/app/libs/'));

});

// copy static files
gulp.task('copy-static', function() {

    var bundlePaths = [
      'public/src/**/*.js',
      'public/src/**/*.css',
      'public/src/**/*.png'
    ];

    return gulp.src(bundlePaths, {base: 'public/src'})
  		.pipe(gulp.dest('public/app'));

});

gulp.task('webpack:build', function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err)
            throw new gutil.PluginError('webpack:build', err);
        callback();
    });
});

gulp.task('serve', function() {
    php.server({
        base: './public'
    });
});

// copy
gulp.task('default', gulp.series(['copy-libs', 'copy-folders', 'copy-js', 'copy-css', 'copy-static', 'webpack:build']));

// dev-build
gulp.task('dev-build', gulp.series(['copy-static', 'webpack:build']));

// build
gulp.task('build', gulp.series(['copy-static', 'webpack:build']));

// create a zip file for the project in dist/release.zip
gulp.task('zip', gulp.series(['create-zip']));