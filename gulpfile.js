var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require("gulp-jshint");
var sourcemaps = require("gulp-sourcemaps");
var browserSync = require("browser-sync").create();
var autoprefixer = require("gulp-autoprefixer");
var handlebars = require("gulp-compile-handlebars");
var glob = require('glob');

var data = require('./source/data/data.json');

gulp.task('html:ssi', function() {
	gulp.src('./source/**/*.html')
		.pipe(includer())
		.pipe(gulp.dest('./build/'));
});

// Converts object to array
var objToArr = function (obj) {
    var arr = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            arr.push(obj[i]);
        }
    }
    return arr;
};

gulp.task('hbs:compile', function() {
	var sBatchAutoPath = './source/features/**/';

	// Find all subfolders and convert to array
	var aBatchAuto = objToArr(glob.sync(sBatchAutoPath));

	// Remove trailing slash
	aBatchAuto.forEach(function(el, i, arr) {
		arr[i] = arr[i].substring(0, arr[i].length - 1);
	});

	var options = {
		batch: aBatchAuto,
		helpers: {
			ifequal: function(arg1, arg2, opts) {
				if(arg1 == arg2) {
					return opts.fn(this);
				} else {
					return opts.inverse(this);
				}
			},
			ifnotequal: function(arg1, arg2, opts) {
				if(arg1 != arg2) {
					return opts.fn(this);
				} else {
					return opts.inverse(this);
				}
			}
		}
	};
	return gulp.src('./source/*.html')
		.pipe(handlebars(data, options))
		.pipe(gulp.dest('./build'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('html:watch', function() {
	gulp.watch(['./source/**/*.html'], ['hbs:compile']);
}); 

gulp.task('js:copy', function () {
	gulp.src('./source/js/*.js')
		.pipe(jshint())
		.pipe(gulp.dest('build/js'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('js:watch', function () {
	gulp.watch('./source/js/*.js', ['js:copy']);
});

gulp.task('sass:compile', function () {
	gulp.src('./source/scss/master.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded', //compressed
		}).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('sass:watch', function () {
	gulp.watch('./source/**/*.scss', ['sass:compile']);
});

gulp.task('browserSync', function () {
	browserSync.init({
		server: {
			baseDir: './build'
		}
	});
	gulp.watch('./build/**/*.html').on('change', browserSync.reload);
});

gulp.task('default', ["hbs:compile", "html:watch", "sass:compile", "sass:watch", "js:copy", "js:watch", "browserSync"]);
 
