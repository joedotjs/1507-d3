var gulp = require('gulp');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');

gulp.task('build', function () {
    return gulp.src('./main.js')
        .pipe(babel())
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./'))
        .pipe(livereload());
});

gulp.task('default', function () {
    livereload.listen();
    gulp.watch('./main.js', ['build']);
});