module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			dist: {
				src: ["app/header.html", "app/menu.html", "app/sections/*.html", "app/footer.html"],
				dest: "build/index.html"
			}
		},
		cssmin: {
			css: {
				files: {
					"build/css/main.css": ["app/css/*.css"]
				}
			}
		},
		wiredep: {

		  target: {

		    // Point to the files that should be updated when
		    // you run `grunt wiredep`
		    src: [
		      'build/index.html'   // .html support..
		    ],

		    // Optional:
		    // ---------
		    cwd: '',
		    dependencies: true,
		    devDependencies: false,
		    exclude: [],
		    fileTypes: {},
		    ignorePath: '',
		    overrides: {}
		  }
		},
		connect: {
			server: {
				options: {
					keepalive: true,
					open: true,
					port: 9001,
					base: 'build',
					directory:'build',
					middleware: function(){
						var middleware = [];

						middleware.push(function(req, res, next) {
							if (req.url !== "/") return next();

							res.setHeader("Content-type", "text/html");
							res.end(grunt.file.read("build/index.html"));
						});

						middleware.push(function(req, res, next){
							if (req.url !== "/css/main.css") return next();

							res.setHeader("Content-type", "text/css");
							res.end( grunt.file.read("build/css/main.css"));
						});

						middleware.push(function(req, res){
							res.statusCode = 404;
							res.end("Not Found");
						});

						return middleware;
					}
				}
			}
		},
	});

grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-wiredep');

grunt.registerTask('serve', ['connect']);
grunt.registerTask('build', ['concat', 'cssmin','wiredep']);
grunt.registerTask('default', ['build']);
};