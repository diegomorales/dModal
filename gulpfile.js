var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    umd = require('gulp-umd'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    comments = require('postcss-discard-comments'),
    path = require('path');

var devPath = 'src/',
    distPath = 'dist/';


// dev tasks
gulp.task('js', function(){
    return gulp.src(devPath + 'js/**/*.js')
        .pipe(umd({
            templateName: 'amdCommonWeb'
        }))
        .pipe(gulp.dest(distPath))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
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
        .pipe(sass({
            indentWidth: 4,
            outputStyle: 'expanded'
        }))
        .pipe(postcss([autoprefixer({
            browsers: ['last 2 versions', 'ie 9'],
            cascade: false
        }), comments()]))
        .pipe(gulp.dest(distPath))
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distPath));
});

gulp.task('default', ['lint', 'js', 'sass'],function(){
    gulp.watch(devPath + 'js/**/*.js', ['lint', 'js']);
    gulp.watch(devPath + 'scss/**/*.scss', ['sass']);
});
