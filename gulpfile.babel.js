import gulp from 'gulp';
import babel from 'gulp-babel';
import umd from 'gulp-umd';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import eslint from 'gulp-eslint';
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano'
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import comments from 'postcss-discard-comments';

let devPath = 'src/',
    distPath = 'dist/';

export function js() {
    return gulp.src(devPath + 'js/**/*.js')

        // Copy plain ES6 version
        .pipe(gulp.dest(distPath))

        // Make ES5 UMD version to support node, amd, and browser environment
        .pipe(babel({
            plugins: ['transform-remove-export']
        }))
        .pipe(umd({
            exports: (file) => 'MiniModal',
            namespace: (file) => 'MiniModal'
        }))
        .pipe(rename({
            suffix: '.umd'
        }))
        .pipe(gulp.dest(distPath))

        // Make minified version
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distPath));
}

export function lint() {
    return gulp.src(devPath + 'js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format());
}

export function style() {
    return gulp.src(devPath + 'scss/**/*.scss')
        .pipe(sass({
            indentWidth: 4,
            outputStyle: 'expanded'
        }))
        .pipe(postcss([autoprefixer({
            browsers: ['last 2 versions', 'ie 11'],
            cascade: false
        }), comments()]))
        .pipe(gulp.dest(distPath))
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distPath));
}

const build = gulp.parallel(
    js, lint, style
);

export {
    build
};

const watch = gulp.series(build, () => {
    gulp.watch(devPath + 'js/**/*.js', gulp.parallel(js, lint));
    gulp.watch(devPath + 'scss/**/*.scss', gulp.parallel(style));
});

export default watch;
