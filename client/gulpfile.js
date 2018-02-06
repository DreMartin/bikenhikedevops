var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var javascripFiles = [
    './app.js',
    './workouts/define.js',
    './workouts/log.js',
    './user/auth.js'
];

gulp.task('bundle', function(){
    return gulp.src(javascripFiles)
    .pipe(concat('bundle.js')) //squish all files together into one file
    // .pipe(uglify())
    .pipe(gulp.dest("./dist")); //save the bundle.js
});

//default task when 'gulp' runs: bundle, starts web server, then watches for changes

gulp.task('default', ['bundle']);
