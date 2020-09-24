'use strict';
const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
// const imageminWebp = require('imagemin-webp');
const browserSync = require('browser-sync').create();
const del = require('del');
const gcmq = require('gulp-group-css-media-queries');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const include = require('gulp-include');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');

// const imgExtencions = 'png,jpg,jpeg,PNG,JPG,JPEG,svg,gif,webp';
// const fontExtencions = 'otf,ttf,woff,woff2,eot,svg';
// const projTypes = [
//     'landing',
//     'shop'
// ];
// const projectType = projTypes[0];

const libsArrayFromModules = [];

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
/* set NODE_ENV=production&&gulp styles */

function prepareWoff() {
    return gulp.src('./_source/assets/fonts/**/*.ttf')
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Prepare woff',
                    message: err.message
                }
            })
        }))
        .pipe(ttf2woff())
        // .pipe(ttf2woff2())
        .pipe(gulp.dest('./_source/assets/fonts/'));
}
function prepareWoff2() {
    return gulp.src('./_source/assets/fonts/**/*.ttf')
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Prepare woff2',
                    message: err.message
                }
            })
        }))
        // .pipe(ttf2woff())
        .pipe(ttf2woff2())
        .pipe(gulp.dest('./_source/assets/fonts/'));
}
function prepareWebp() {
    return gulp.src('./_source/assets/img/**/*.*')
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Prepare webp',
                    message: err.message
                }
            })
        }))
        .pipe(webp({
            quality: 60
        }))
        .pipe(gulp.dest('./_source/assets/img/'));
}
function prepareLibs() {
    return gulp.src(libsArrayFromModules)
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Prepare libs',
                    message: err.message
                }
            })
        }))
        .pipe(gulp.dest('./_source/assets/libs/'));
}
if (libsArrayFromModules.length > 0) {
    gulp.task('prepare', gulp.parallel(prepareWoff, prepareWoff2, prepareWebp, prepareLibs));
} else {
    gulp.task('prepare', gulp.parallel(prepareWoff, prepareWoff2, prepareWebp));
}

function pages() {
    return gulp.src('./_source/pug/*.pug')
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Pages',
                    message: err.message
                }
            })
        }))
        // .pipe(gulpIf(isDevelopment, pug({
        //     pretty: true
        // })))
        // .pipe(gulpIf(!isDevelopment, pug()))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./public/'))
}

function styles() {
    return gulp.src('./_source/assets/scss/**/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Styles',
                    message: err.message
                }
            })
        }))
        // .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(sourcemaps.init())
        .pipe(gulpIf(isDevelopment, sass({
            errLogToConsole: true,
            outputStyle: "expanded"
        })))
        .pipe(gulpIf(!isDevelopment, sass({
            errLogToConsole: true,
            outputStyle: "compressed"
        })))
        .pipe(autoprefixer(['last 10 versions', '> 0.1%'], { cascade: false }))
        .pipe(gcmq())
        .pipe(rename({suffix: '.min'}))
        // .pipe(gulpIf(isDevelopment, sourcemaps.write('./maps/')))
        .pipe(sourcemaps.write('./maps/'))
        .pipe(gulp.dest('./public/assets/css/'))
        .pipe(browserSync.stream());
}

function images() {
    return gulp.src(`./_source/assets/img/**/*.*`)
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Images',
                    message: err.message
                }
            })
        }))
        // .pipe(imagemin(imgPlugins, imgOptions))
        .pipe(imagemin([
            imagemin.gifsicle(),
            imagemin.svgo(),
            imageminMozjpeg({
                quality: 70,
                progressive: true
            }), 
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ], {
            verbose: true
        }))
        .pipe(gulp.dest('./public/assets/img/'));
}

function exportFonts() {
    return gulp.src(`./_source/assets/fonts/**/*.*`)
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Fonts',
                    message: err.message
                }
            })
        }))
        .pipe(gulp.dest('./public/assets/fonts/'));
}

function js() {
    return gulp.src('_source/assets/js/*.js')
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'JavaScript',
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(include({
            extensions: 'js'
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulpIf(!isDevelopment, babel({
            presets: ['@babel/env']
        })))
        .pipe(gulpIf(!isDevelopment, uglify()))
        .pipe(sourcemaps.write('./maps/'))
        .pipe(gulp.dest('./public/assets/js/'));
};

function exportLibs() {
    return gulp.src('./_source/assets/libs/**/*.*')
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Libs',
                    message: err.message
                }
            })
        }))
        .pipe(gulp.dest('./public/assets/libs/'));
};

function exportOther() {
    return gulp.src('./_source/assets/other/**/*.*')
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Other',
                    message: err.message
                }
            })
        }))
        .pipe(gulp.dest('./public/assets/other/'));
};

function clean() {
    return del('public');
};

gulp.task('watch', function() {
    gulp.watch('_source/pug/**/*.pug', gulp.series(pages));
    gulp.watch('_source/assets/scss/**/*.scss', gulp.series(styles));
    gulp.watch(`_source/assets/img/**/*.*`, gulp.series(images));
    // gulp.watch(`_source/assets/img/**/*.{${imgExtencions}}`, gulp.series(imagesWebp));
    gulp.watch('_source/assets/js/**/*.*', gulp.series(js));
    gulp.watch(`_source/assets/fonts/**/*.*`, gulp.series(exportFonts));
    gulp.watch('_source/assets/libs/**/*.*', gulp.series(exportLibs));
    gulp.watch('_source/assets/other/**/*.*', gulp.series(exportOther));
});

gulp.task('build', 
    gulp.series(clean, 
        gulp.parallel(exportLibs, exportFonts, exportOther, js, images, pages, styles)));


gulp.task('sync', function() {
    browserSync.init({
        server: {
            baseDir: './public'
        },
        port: 3000
    });
    browserSync.watch('public/**/*.*').on('change', browserSync.reload)
});

gulp.task('dev', 
    gulp.series('build', gulp.parallel('watch', 'sync'))
);

exports.pages = pages;
exports.styles = styles;
exports.images = images;
exports.js = js;
exports.fonts = exportFonts;
exports.libs = exportLibs;
exports.other = exportOther;