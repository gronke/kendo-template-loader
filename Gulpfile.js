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
	return Promise.all([
		new Promise(function(resolve, reject) {
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
		}),
		new Promise(function(resolve, reject) {
			var dir = path.join(config.test, 'test/mocks/dist');
			function done() {
				mkdirp(dir);
				resolve();
			}
			try {
				if(fs.existsSync(dir)) {
					rmdir(config.dist, done);
				} else {
					done();
				}
			} catch(e) {
				reject(e);
			}
		})
	]);
});

gulp.task('typescript:test', function() {

	var tsResult = gulp.src(path.join(config.test, 'mocks/src/*.ts'))
	.pipe(plugins.typescript({
		declaration: true
	}));

	var dest = gulp.dest(path.join(config.test, 'mocks/dist'));

	return merge([
		tsResult.dts.pipe(dest),
		tsResult.js.pipe(dest)
	]);

});

gulp.task('typescript:assets', function() {

	var tsResult = gulp.src(path.join(config.src, 'kendo-template-loader.ts'))
	.pipe(plugins.typescript({
		declaration: true
	}));

	return merge([
		tsResult.dts.pipe(gulp.dest(config.dist)),
		tsResult.js.pipe(gulp.dest(config.dist))
	]);

});

gulp.task('typescript', ['typescript:test', 'typescript:assets']);

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
	return runSequence('build', 'typescript:test', 'mocha', cb);
});
gulp.task('build', function(cb) {
	return runSequence('clean', 'typescript:assets', cb);
});
gulp.task('default', ['build']);
