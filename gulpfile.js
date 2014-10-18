var gulp = require('gulp');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var run = require('gulp-run');
var yargs = require('yargs');

gulp.task('lint', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('build', ['build-js', 'build-html', 'build-css']);

gulp.task('build-js', function() {
	return gulp.src('src/js/main.js')
		.pipe(browserify({
			insertGlobals: false,
			debug: !yargs.argv.production
		}))
		//.pipe(uglify())
		.pipe(gulp.dest('./build/js'));
});

gulp.task('build-html', function() {
	return gulp.src('src/index.html')
		.pipe(gulp.dest('./build/'));
});

gulp.task('build-css', function() {
	return gulp.src('src/css/style.css')
		.pipe(gulp.dest('./build/css'));
});

gulp.task('watch', function() {
	gulp.watch('src/**/*', ['lint', 'build']);
});

gulp.task('open-browser', function() {
	return run('cd ./build; ../node_modules/.bin/lute open').exec();
});

gulp.task('default', ['lint', 'build', 'watch', 'open-browser']);

