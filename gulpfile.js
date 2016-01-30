var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    umd = require('gulp-umd'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    path = require('path');

var devPath = 'src/',
    distPath = 'dist/';


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
        .pipe(gulp.dest(distPath));
});

gulp.task('lint', function(){
    gulp.src(devPath + 'js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('sass', function(){
    return gulp.src(devPath + 'scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(distPath));
});

gulp.task('default', ['lint', 'js', 'sass'],function(){
    gulp.watch(devPath + 'js/**/*.js', ['lint', 'js']);
    gulp.watch(devPath + 'scss/**/*.scss', ['sass']);
});


// build tasks
gulp.task('build-js', function(){
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
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distPath));
});

gulp.task('build-css', function(){
    return gulp.src(devPath + 'scss/**/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distPath));
});
gulp.task('build', ['build-js', 'build-css']);