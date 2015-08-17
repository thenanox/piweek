'use strict';

var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  through = require('through'),
  gutil = require('gulp-util'),
  plugins = gulpLoadPlugins(),
  paths = {
    js: ['./*.js', 'config/**/*.js', 'gulp/**/*.js', 'tools/**/*.js', 'public/**/*.js', '!public/lib/**/*.js'],
    html: ['public/**/*.html', '!public/lib/**/*.html'],
    css: ['public/**/*.css', '!public/lib/**/*.css'],
    less: ['public/**/*.less', '!public/lib/**/*.less'],
    sass: ['public/**/*.scss', '!public/lib/**/*.scss']
  };

/*var defaultTasks = ['clean', 'jshint', 'less', 'csslint', 'devServe', 'watch'];*/
var defaultTasks = ['clean', 'less', 'csslint', 'devServe', 'watch'];

gulp.task('env:development', function () {
  process.env.NODE_ENV = 'development';
});

gulp.task('jshint', function () {
  return gulp.src(paths.js)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(count('jshint', 'files lint free')
    .pipe(plugins.livereload()));
});

gulp.task('csslint', function () {
  return gulp.src(paths.css)
    .pipe(plugins.csslint('.csslintrc'))
    .pipe(plugins.csslint.reporter())
    .pipe(count('csslint', 'files lint free')
    .pipe(plugins.livereload()));
});

gulp.task('less', function() {
  return gulp.src(paths.less)
    .pipe(plugins.less())
    .pipe(gulp.dest(function (vinylFile) {
      return vinylFile.cwd;
    })
    .pipe(plugins.livereload()));
});

gulp.task('devServe', ['env:development'], function () {

  plugins.nodemon({
    script: 'server.js',
    ext: 'html js',
    env: { 'NODE_ENV': 'development' } ,
    ignore: ['node_modules/', 'bower_components/', 'logs/', '.DS_Store', '**/.DS_Store', '.bower-*', '**/.bower-*', 'public/**/*.js', 'public/**/*.html', 'public/**/*.css'],
    nodeArgs: ['--debug'],
    stdout: false
  }).on('readable', function() {
    this.stdout.on('data', function(chunk) {
      if(/REAN/.test(chunk)) {
        setTimeout(function() { plugins.livereload.reload(); }, 500);
      }
      process.stdout.write(chunk);
    });
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('watch', function () {
  plugins.livereload.listen({interval:500});

  gulp.watch(paths.js, ['jshint']);
  gulp.watch(paths.css, ['csslint']);
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.html, ['jshint']);
});

function count(taskName, message) {
  var fileCount = 0;

  function countFiles(file) {
    fileCount++; // jshint ignore:line
  }

  function endStream() {
    gutil.log(gutil.colors.cyan(taskName + ': ') + fileCount + ' ' + message || 'files processed.');
    this.emit('end'); // jshint ignore:line
  }
  return through(countFiles, endStream);
}

gulp.task('development', defaultTasks);
