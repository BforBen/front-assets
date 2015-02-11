var gulp = require('gulp'),
		csslint = require('gulp-csslint'),
        del = require('del'),
		gutil = require('gulp-util'),
		less = require('gulp-less'),
        minifyCSS = require('gulp-minify-css'),
        sourcemaps = require('gulp-sourcemaps');
 
 var customReporter = function(file) {
  gutil.log(gutil.colors.cyan(file.csslint.errorCount)+' errors in '+gutil.colors.magenta(file.relative));

  file.csslint.results.forEach(function(result) {
    gutil.log(result.error.message+' on line '+result.error.line);
  });
};
 
 gulp.task('build-less', function(){
  gulp.src('./less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/'));
});
 
 gulp.task('copy:images', function(){
  gulp.src(['./images/*.gif', './images/*.jpg', './images/*.png'])
    .pipe(gulp.dest('./dist/'));
});

gulp.task('lint:css', function() {
  gulp.src('./css/*.css')
    .pipe(csslint())
    .pipe(csslint.reporter(customReporter));
});
 
gulp.task('minify:css', ['clean:dist'], function() {
  gulp.src('./css/*.css')
    //.pipe(sourcemaps.init())
    .pipe(minifyCSS())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('clean:dist', function (cb) {
  del([
    'dist/*'
  ], cb);
});


gulp.task('default', ['copy:images', 'minify:css']);