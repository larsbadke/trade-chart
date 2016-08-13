var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var notify = require("gulp-notify");
var uglifycss = require('gulp-uglifycss');
var autoprefixer = require('gulp-autoprefixer');
var gulp = require("gulp");
var babel = require("gulp-babel");

// compile scss files
// gulp.task('styles', function() {
//     gulp.src('resources/assets/sass/**/*.scss')
//         .pipe(sass().on('error', sass.logError))
//         .pipe(autoprefixer())
//         .pipe(uglifycss({
//             "maxLineLen": 80,
//             "uglyComments": true
//         }))
//         .pipe(gulp.dest('./public/css/'));
//
// });

// concat js Scripts
gulp.task('scripts', function() {
    return gulp.src(['src/js/*.js', 'src/js/provider/*.js'])
        .pipe(concat('chart.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));

});


//Watch task
gulp.task('default',function() {
    // gulp.watch('resources/assets/sass/**/*.scss',['styles']);
    gulp.watch('src/js/**/*.js',['scripts']);
});
