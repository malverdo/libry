
var gulp = require('gulp'),
    sass = require('gulp-sass'), 
    concat = require("gulp-concat"), 
    watch = require('gulp-watch'), 
    pug = require('gulp-pug'), 
    prefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    imageminJpegtran = require('imagemin-jpegtran');
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    pngquant = require('imagemin-pngquant'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'), 
    uglify = require('gulp-uglify'),
    browserSync = require("browser-sync");



gulp.task('myFirstTask',function(param){
	console.log('Привет, я твой первый такс');
  param();
});


gulp.task("sass", function(param) {
    return gulp.src("src/style/*.sass")
    	.pipe(sass())
      .pipe(concat('styles.css'))
    	.pipe(prefixer(
        ['last 2 versions'],
        {cascade: false}
      ))
    	.pipe(gulp.dest("dist/css"))
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('dist/css'))
    	.pipe(browserSync.reload({
			  stream: true
		  }));
    param();
});

//pug
gulp.task('pug', function(param){
	return gulp.src('src/*.pug')
		.pipe(pug({pretty: true}))
		.on('error', function(err)  {
			console.log(err);
			this.emit('end');
		})
		.pipe(gulp.dest("dist"))
		.pipe(browserSync.reload({
			stream: true
		}));
    param();
});

//scripts
gulp.task("scripts", function(param) {
  gulp.src([
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/owl.carousel/dist/owl.carousel.min.js"])
    .pipe(gulp.dest("dist/js"));
  return gulp.src("src/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
  param();       
});

//image
gulp.task('images', function (param) {
  return gulp.src('src/images/**/.{jpg,png,jpeg,svg}') 
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({progressive: true}),
        imageminJpegRecompress({
          progressive: true,
          loops: 5,
          min: 70,
          max: 85,
          quality:'medium'
        }),
        imagemin.optipng({optimizationLevel: 3}),
        pngquant({quality: [0.7, 0.85], speed: 5})
      ],{
        verbose: true
      }))
    .pipe(gulp.dest('dist/images')) 
    .pipe(browserSync.reload({stream: true})); 
  param();
});


gulp.task('browser-sync', function (param) {
  var files = [
    'dist/index.html',
    'dist/css/*.css',
    'dist/js/*.js'
  ];  
  browserSync.init(files, {
    server: {
      baseDir: 'dist'
    }
  });
  param();
});


gulp.task('watch', function(param){
	gulp.watch('src/style/*.sass', gulp.series('sass'));
  gulp.watch('src/**/*.pug', gulp.series('pug'));
  gulp.watch('src/js/*.js', gulp.series('scripts'));
  gulp.watch('src/images/**/*', gulp.series('images'));
  param();
});


gulp.task("default", gulp.series('watch', 'browser-sync', 'sass', 'pug', 'scripts', 'images'));