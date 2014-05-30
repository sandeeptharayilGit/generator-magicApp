module.exports = function(grunt) {
	grunt.initConfig({
		distFolder: 'build',
 		srcFolder: 'app',
		concat: {
 			app: {
 				src: ['<%= srcFolder %>/scripts/*.js', '<%= srcFolder %>/scripts/**/*.js'],
 				dest: '<%= distFolder %>/scripts/app.js'
 			}
 		},
 		ngmin: {
 			min: {
 				src: ['<%= distFolder %>/scripts/app.js'],
 				dest: '<%= distFolder %>/scripts/app.js'
 			}
 		},
		cssmin: {
			css: {
				files: {
					"build/styles/main.css": ["app/styles/*.css"]
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
		copy: {
 			main: {
 				files: [
 					{
 						expand: true,
 						cwd: '<%= srcFolder %>/',
 						src: ['images/**', 'views/**', 'scripts/json/**', 'index.html','scripts/config.json'],
 						dest: '<%= distFolder %>/'
 					}
 				]
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
							console.log("Requesting... "+req.url);
						//if (req.url !== "/") return next();

							//res.setHeader("Content-type", "text/html");

							if (req.url == "/") {
								res.end(grunt.file.read("build/index.html"));
							}else{
								res.end(grunt.file.read("build"+req.url));
							}
						//return next();

							
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
grunt.loadNpmTasks('grunt-ngmin');
grunt.loadNpmTasks('grunt-contrib-copy');

grunt.registerTask('serve', ['connect']);
grunt.registerTask('build', ['concat','ngmin','copy','cssmin','wiredep']);
grunt.registerTask('default', ['build']);
};