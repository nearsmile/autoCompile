var fs = require('fs');
var gulp = require('gulp');
var babel = require('gulp-babel');
var  esLint = require('gulp-eslint');
var watch = require('gulp-watch');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify-cli');
var  cleanCSS =require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var compression = require('compression');
var historyApiFallback = require('connect-history-api-fallback');
var browserSync = require('browser-sync').create();
var _ = require('lodash');
var pathExists = require('path-exists');
var constants = require('./gulpConstants')(historyApiFallback, compression);
var argv = require('yargs').argv;

gulp.task('dist', ['style', 'font', 'img', 'html', 'index', 'js', 'json', argv.release ? 'minifyComponents' : 'components']);

gulp.task('style', function() {
	return gulp.src(constants.style.src)
		.pipe(concat(constants.style.ouput))
		.pipe(gulpIf(argv.release, cleanCSS(constants.minify.css)))
		.pipe(gulp.dest(constants.basePath + constants.style.dest));
});

gulp.task('font', function() {
	return gulp.src(constants.font.src)
		.pipe(gulp.dest(constants.basePath + constants.font.dest));
});

gulp.task('img', function() {
	return gulp.src(constants.image.src)
		.pipe(gulpIf(argv.release, imagemin()))
		.pipe(gulp.dest(constants.basePath + constants.image.dest));
});

gulp.task('html', function() {
	return gulp.src(constants.html.src)
		.pipe(htmlmin(constants.minify.html))
		.pipe(gulp.dest(constants.basePath + constants.html.dest));
});


gulp.task('index', function() {
	return gulp.src(constants.html.index)
		.pipe(htmlmin(constants.minify.html))
		.pipe(gulp.dest(constants.basePath));
});

gulp.task('js', function() {
	return gulp.src(constants.js.src)
		.pipe(babel({ babelrc: true }))
		.pipe(gulpIf(argv.release, uglify(constants.minify.js)))
		.pipe(gulp.dest(constants.basePath + constants.js.dest));
});

gulp.task('json', function() {
	return gulp.src(constants.json.src)
		.pipe(gulp.dest(constants.basePath + constants.json.dest));
});

gulp.task('components', function() {
	return gulp.src(constants.components.src)
		.pipe(gulp.dest(function(file) {
			var isBabel = file.base.indexOf(constants.components.babel) >=0;
			return constants.basePath + constants.components.dest + (isBabel ? constants.components.babel : '');
		}));
});

gulp.task('minifyComponents', ['components'], function() {
	return gulp.src(constants.components.minify)
		.pipe(uglify(constants.minify.js))
		.pipe(gulp.dest(function(file) {
			return file.base.replace(__dirname + '\\', '');
		}));
});

gulp.task('styleWatch', ['style'], function() {
	browserSync.reload();
});
gulp.task('imgWatch', ['img'], function() {
	browserSync.reload();
});
gulp.task('fontWatch', ['font'], function() {
	browserSync.reload();
});
gulp.task('htmlWatch', ['html'], function() {
	browserSync.reload();
});
gulp.task('indexWatch', ['index'], function() {
	browserSync.reload();
});
gulp.task('jsWatch', ['js'], function() {
	browserSync.reload();
});
gulp.task('jsonWatch', ['json'], function() {
	browserSync.reload();
});
gulp.task('componentsWatch', ['components'], function() {
	browserSync.reload();
});

/* 在浏览器上运行 */
gulp.task('serve', [argv.release ? 'dist': 'filesWatch'], function() {
	browserSync.init({
		server: constants.browser.server,
		host: constants.browser.host,
		port: argv.port || constants.browser.port,
		https: constants.browser.https,
		ghostMode: false,
		logPrefix: constants.browser.logPrefix,
		open: _.isUndefined(argv.open) ? true : argv.open,
		notify: _.isUndefined(argv.notify) ? true : argv.notify
	});
});


/* 监控服务 */
gulp.task('filesWatch', ['dist'], function() {
	watch(constants.style.src, function() {
		gulp.start('styleWatch');
	});
	watch(constants.image.src, function() {
		gulp.start('imgWatch');
	});
	watch(constants.font.src, function() {
		gulp.start('fontWatch');
	});
	watch(constants.html.src, function() {
		gulp.start('htmlWatch');
	});
	watch(constants.html.index, function() {
		gulp.start('indexWatch');
	});
	watch(constants.js.src, function() {
		gulp.start('jsWatch');
	});
	watch(constants.json.src, function() {
		gulp.start('jsonWatch');
	});
	watch(constants.components.src, function() {
		gulp.start('componentsWatch');
	});
});
















