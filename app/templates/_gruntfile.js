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

grunt.registerTask('serve', ['connect']);
grunt.registerTask('build', ['concat', 'cssmin']);
grunt.registerTask('default', ['build']);
};