var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    eslint = require('gulp-eslint'),
    umd = require('gulp-umd'),
    sass = require('gulp-sass'),
    path = require('path');

var devPath = 'src/',
    distPath = 'dist/',
    examplePath = 'example/';


// dev tasks
gulp.task('js', function(){
    return gulp.src(devPath + 'js/**/*.js')
        .pipe(umd({
            templateName: 'amdCommonWeb',
            exports: function(file) {
                return path.basename(file.path, path.extname(file.path));
            },

            namespace: function(file) {
                return path.basename(file.path, path.extname(file.path));
            }
        }))
        .pipe(gulp.dest(distPath))
        .pipe(gulp.dest(examplePath));
});

gulp.task('lint', function(){
    gulp.src(devPath + 'js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('sass', function(){
    return gulp.src(devPath + 'scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(distPath))
        .pipe(gulp.dest(examplePath));
});

gulp.task('default', ['lint', 'js', 'sass'],function(){
    gulp.watch(devPath + 'js/**/*.js', ['lint', 'js']);
    gulp.watch(devPath + 'scss/**/*.scss', ['sass']);
});


// build tasks
gulp.task('build-js', function(){

});

gulp.task('build-css', function(){

});
gulp.task('build', ['build-js', 'build-css']);