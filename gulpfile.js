var gulp = require('gulp'),
	csslint = require('gulp-csslint'),
  del = require('del'),
	gutil = require('gulp-util'),
	less = require('gulp-less'),
	mandrill = require('mandrill-api/mandrill'),
  minifyCSS = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps');
 
var customReporter = function(file) {
  var email = gutil.colors.cyan(file.csslint.errorCount)+' errors in '+gutil.colors.magenta(file.relative),
    err = '';

  gutil.log(email);

  file.csslint.results.forEach(function(result) {
    err = result.error.message+' on line '+result.error.line;
    email = email + "\n" + err;
    gutil.log(err);
  });


  if (process.env.APPVEYOR && process.env.APPVEYOR_REPO_COMMIT_AUTHOR_EMAIL && process.env.MANDRILL_API_KEY)
  {
    var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
    var message = {
        "text": email,
        "subject": "CSS Lint",
        "from_email": "development@guildford.gov.uk",
        "from_name": "CSS Lint",
        "to": [{
                "email": "process.env.APPVEYOR_REPO_COMMIT_AUTHOR_EMAIL",
                "name": "process.env.APPVEYOR_REPO_COMMIT_AUTHOR",
            }],
        "track_opens": false,
        "track_clicks": false,
        "auto_html": true,
        "preserve_recipients": true,
        "tags": [
            "appveyor"
        ]
    };
    mandrill_client.messages.send({"message": message});
  }
};
 
gulp.task('build:less', function(){
  gulp.src('./less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy:icons', function(){
  gulp.src(['./icons/*'])
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
 
gulp.task('minify:css', function() {
  gulp.src('./css/*.css')
    //.pipe(sourcemaps.init())
    .pipe(minifyCSS())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('clean:dist', function (cb) {
  del(['dist/*'], cb);
});

gulp.task('default', ['copy:icons', 'copy:images', 'minify:css']);