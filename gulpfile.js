const	gulp			= require('gulp'),
		autoprefixer	= require('autoprefixer'),
		bourbon			= require('bourbon').includePaths,
		cssnano			= require('cssnano'),
		del				= require('del'),
		imagemin		= require('gulp-imagemin'),
		postcss			= require('gulp-postcss'),
		pug				= require('gulp-pug'),
		sass			= require('gulp-sass')(require('sass')),
		sourcemaps		= require('gulp-sourcemaps'),
		browsersync		= require('browser-sync').create();


/*----- directories -----------------------------------------------*/
const dir = {
	src:	'./_src/',		// where our source files live
	dest:	'./_site/',		// where we build our files to
};


/*----- clobber the build directory -------------------------------*/
function clean() {
	return del(
		dir.dest,
	);
}


/*----- compile Pug files to html ---------------------------------*/
const htmlConfig = {
	src:	dir.src		+ '_pug/**/*.pug',
	watch:	dir.src		+ '_pug/**/*.pug',
	dest:	dir.dest,
};

function html() {
	return gulp.src(htmlConfig.src)
		.pipe(pug())
		.pipe(gulp.dest(htmlConfig.dest))
	;
}

/*----- compile SASS to CSS ---------------------------------------*/
const cssConfig = {
	src:	dir.src		+ '_assets/_sass/main.sass',
	watch:	dir.src		+ '_assets/_sass/**/*.{css,sass,scss}',
	dist:	dir.dest + 'assets/css/',

	postCSS: [
		autoprefixer(), // browser options moved to package.json
		// cssnano()
	]
};

function css() {
	return gulp.src(cssConfig.src)
		// we include node_modules so we can @import normalize.css installed by npm
		.pipe(sass({includePaths: ['node_modules', bourbon]}).on('error', sass.logError))
		// pass it through autoprefixer (with sourcemap)
		.pipe(sourcemaps.init())
		.pipe(postcss(cssConfig.postCSS))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(cssConfig.dist))
		.pipe(browsersync.stream())
	;
}





const jsConfig = {
	src:	dir.src		+ '_assets/_js/**/*.js',
	watch:	dir.src		+ '_assets/_js/**/*.js',
	dest:	dir.dest + 'assets/js/',
};


function js() {
	return gulp.src(jsConfig.src)
		// .pipe(minify({
		// 	minify: false,
		// 	minifyJS: {
		// 		sourceMap: true
		// 	},
		// 	getKeptComment: function (content, filePath) {
		// 		var m = content.match(/\/\*![\s\S]*?\*\//img);
		// 		return m && m.join('\n') + '\n' || '';
		// 	}
		// }))
		.pipe(gulp.dest(jsConfig.dest))
}



/*----- process images --------------------------------------------*/
const imgConfig = {
	src:	dir.src		+ '_assets/images/**/*',
	watch:	dir.src		+ '_assets/images/**/*',
	dist:	dir.dest	+ 'assets/images/',

	plugins: [
		imagemin.gifsicle({interlaced: true}),
		imagemin.mozjpeg({progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{
					removeViewBox: false,
					removeDoctype: false,
					collapseGroups: false,
				}
			]
		})
	]
};

function images() {
	return gulp.src(imgConfig.src)
		// .pipe(imagemin(imgConfig.plugins))
		.pipe(gulp.dest(imgConfig.dist))
		.pipe(browsersync.stream())
	;
}


/*----- browserSync -----------------------------------------------*/
function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: dir.dest,
		},
		notify:	false,
	});
	done();
}

// browserSync Reload
function browserSyncReload(done) {
	browsersync.reload();
	done();
}


/*----- watch tasks -----------------------------------------------*/
function watchFiles() {
	gulp.watch(cssConfig.watch, css);
	gulp.watch(htmlConfig.watch, html);
	gulp.watch(jsConfig.watch, js);
	gulp.watch(
		[
			dir.src + '_parts/**/*.pug',
		], html);

	gulp.watch(
		[
			dir.src + '_assets/_js/**/*.js',

		// ], gulp.dest(dir.dest + 'assets/js/'));
		], gulp.series(browserSyncReload));

	gulp.watch(
		[
			dir.dest		+ '*.html',
		],
		gulp.series(browserSyncReload)
	);
	gulp.watch(imgConfig.watch, images);
}


/*----- gulp routines ---------------------------------------------*/
const build		= gulp.series(clean, html, gulp.parallel(css, images, js));
const watch		= gulp.parallel(watchFiles, browserSync);


/*----- export tasks ----------------------------------------------*/
exports.clean	= clean;
exports.html	= html;
exports.css		= css;
exports.images	= images;
exports.build	= build;
exports.watch	= watch;
exports.default	= gulp.series(build, watch);


/*-----------------------------------------------------------------*/
/*----- NOTES -----------------------------------------------------*/

