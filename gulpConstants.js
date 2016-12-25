module.exports = function(historyApiFallback, compression) {
	var gulpConstants = {
		basePath: 'dist/',
		style: {
			src: 'www/css/*.css',
			ouput: 'main.css',
			dest: 'style'
		},
		image: {
			src: 'www/img/*.*',
			dest: 'img'
		},
		font: {
			src: 'www/font/*.*',
			dest: 'font'
		},
		html: {
			index: 'www/index.html',
			src: ['www/src/**/*.html'],
			dest: 'src'
		},
		json: {
			src:['www/json/*.json', 'www/json/**/*.json'],
			dest: 'json'
		},
		js: {
			src: ['www/src/*.js', 'www/src/**/*.js'],
			dest: 'src'
		},
		components: {
			src: ['www/lib/**'],
			dest: 'lib/'
		},
		browser: {
			server: {
				baseDir: 'dist',
				middleware: [historyApiFallback(), compression()]
			},
			host: 'localhost',
			port: 3000,
			https: undefined,
			logPrefix: 'BS'
		},
		minify: {
			js: '-m toplevel',
			html: {
				collapseBooleanAttributes: true,
				collapseWhitespace: true
			},
			css: {
				compatibility: 'ie8',
				keepSpecialComments: 0
			}
		}
	};
	return gulpConstants;
};

