var path = require('path'),
	fs = require('fs'),
	gulp = require('gulp'),
	rmdir = require('rmdir'),
	merge = require('merge2'),
	gulpLoadPlugins = require('gulp-load-plugins');

var plugins = gulpLoadPlugins();

var config = {
	src: './src',
	dist: './dist'
};

gulp.task('clean', function() {
	return new Promise(function(resolve, reject) {
		try {
			if(fs.existsSync(config.dist)) {
				rmdir(config.dist, resolve);
			} else {
				resolve();
			}
		} catch(e) {
			reject(e);
		}
	});
});

gulp.task('typescript', function() {

	var tsResult = gulp.src(path.join(config.src, '*.ts'))
	.pipe(plugins.typescript({
		declaration: true
	}));

	return merge([
		tsResult.dts.pipe(gulp.dest(config.dist)),
		tsResult.js.pipe(gulp.dest(config.dist))
	]);

});

gulp.task('default', ['clean', 'typescript']);
