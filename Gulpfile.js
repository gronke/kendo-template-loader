var path = require('path'),
	fs = require('fs'),
	gulp = require('gulp'),
	rmdir = require('rmdir'),
	mkdirp = require('mkdirp'),
	merge = require('merge2'),
	runSequence = require('run-sequence'),
	gulpLoadPlugins = require('gulp-load-plugins');

var plugins = gulpLoadPlugins();

var config = {
	src: './src',
	dist: './dist',
	test: './test'
};

gulp.task('clean', function() {
	return new Promise(function(resolve, reject) {
		function done() {
			mkdirp(config.dist);
			resolve();
		}
		try {
			if(fs.existsSync(config.dist)) {
				rmdir(config.dist, done);
			} else {
				done();
			}
		} catch(e) {
			reject(e);
		}
	});
});

gulp.task('typescript', function() {

	var tsResult = gulp.src(path.join(config.src, 'kendo-template-loader.ts'))
	.pipe(plugins.typescript({
		declaration: true
	}));

	return merge([
		tsResult.dts.pipe(gulp.dest(config.dist)),
		tsResult.js.pipe(gulp.dest(config.dist))
	]);

});

gulp.task('mocha', function() {
	return gulp.src(path.join(config.test, 'runner.html'), {
		read: false
	}).pipe(plugins.mochaPhantomjs({
		reporter: 'spec',
		phantomjs: {
			useColors: true
		}
	}));
});

gulp.task('test', function(cb) {
	return runSequence('build', 'mocha', cb);
});
gulp.task('build', function(cb) {
	return runSequence('clean', 'typescript', cb);
});
gulp.task('default', ['build']);
