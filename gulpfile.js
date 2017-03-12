// https://gist.github.com/danharper/3ca2273125f500429945

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

const outputPath = 'src/';

function compile(watch) {
    var bundler = watchify(browserify('src/index.js', { debug: true })
        .transform(babel.configure({
            // Use all of the ES2015 spec
            presets: ["es2015"]
        })));

    function rebundle() {
        bundler.bundle()
            .on('error', function (err) { console.error(err); this.emit('end'); })
            .pipe(source('build.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build'));
    }

    if (watch) {
        bundler.on('update', function () {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle();
}

function watch() {
    return compile(true);
};

function tscCompile() {
    var tsProject = ts.createProject('tsconfig.json', {/*override options*/ });
    var tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest("./"))
}


gulp.task('sass', function () {
    return gulp.src('./styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./styles/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./styles/**/*.scss', ['sass']);
});

gulp.task('build', ["tsc-compile"], function () { return compile(); });
gulp.task('watch', ["tsc-compile"], function () { return watch(); });
gulp.task('tsc-compile', function () { return tscCompile(); });

// gulp.task('tsc-compile', function () { return });
gulp.task('connect', function () { connect.server({ port: 8081 }) });
gulp.task('default', ['tsc-compile', 'watch', 'connect', 'sass']);