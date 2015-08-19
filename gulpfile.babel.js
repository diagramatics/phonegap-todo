'use strict';

import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Lint JavaScript
gulp.task('jshint', () => {
  return gulp.src('app/js/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'app/scss/**/*.scss',
    'app/css/**/*.css'
  ])
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/css'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('www/css'))
    .pipe($.size({title: 'styles'}));
});

gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['material.min.css']
    }))
    .pipe(gulp.dest('app'));

  gulp.src('app/scss/style.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('app/scss'));
});

gulp.task('fonts', () => {
  return gulp.src('app/fonts/*')
    .pipe(gulp.dest('www/fonts'));
});

gulp.task('html', () => {
  const assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('app/**/*.html')
    .pipe(assets)

    // Concatenate and minify styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.if('*.js', $.uglify()))
    .pipe(assets.restore())
    .pipe($.useref())

    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output files
    .pipe(gulp.dest('www'))
    .pipe($.size({title: 'html'}));
});

gulp.task('clean', cb => del(['.tmp', 'www/*'], {dot: true}, cb));

gulp.task('default', () => {

});

// Watch files for changes & reload
gulp.task('serve', ['styles'], () => {
  browserSync({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app']
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/{scss,css}/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['app/js/**/*.js'], ['jshint']);
  gulp.watch(['app/img/**/*'], reload);
  gulp.watch(['bower.json'], ['wiredep', reload]);
});

gulp.task('build', ['styles', 'fonts', 'html']);
