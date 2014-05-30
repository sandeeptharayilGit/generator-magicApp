'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var rimraf= require('rimraf');

var magicAppGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Angular web application generator!'));


    var prompts = [{
      name: 'appName',
      message: 'What is your application\'s name ?'
    },{
      type: 'confirm',
      name: 'bootstrap',
      message: 'Would you like to include bootstrap in your project ?',
      default: true
    },
    {
      name: 'proxy',
      message: 'Please provide proxy url if you are under any proxy network? (press Enter if not)'
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.bootstrap = props.bootstrap;
      this.proxy = props.proxy;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir("app");
    this.mkdir("app/styles");
    this.mkdir("app/scripts");
    this.mkdir("app/scripts/controllers");
    this.mkdir("app/scripts/services");
    this.mkdir("app/scripts/directives");
    this.mkdir("app/scripts/filters");
    this.mkdir("app/images");
    this.mkdir("build");
    this.mkdir("tmp");

  },

  templateFiles:function(){
   var context = { 
            site_name: this.appName , 
            proxy: this.proxy?',\n    "proxy": "'+this.proxy+'",\n    "https-proxy": "'+this.proxy+'",\n    "strict-ssl": false':'',
            app_name: this._.underscored(this.appName)+'App'
          };
      this.template("_bower.json", "bower.json", context);
      this.template("_package.json", "package.json", context);
      this.template('_.bowerrc', '.bowerrc',context);
      this.template("_header.html", "tmp/header.html", context);
      this.template("_body.html", "tmp/body.html", context);
      this.template("_app.js", "app/scripts/app.js", context);
      this.template("_errorHandler.js", "app/scripts/services/errorHandler.js", context);
      this.template("_config.json", "app/scripts/config.json", context);
      this.template("_interceptor.js", "app/scripts/services/interceptor.js", context);
      this.template("_mainController.js", "app/scripts/controllers/mainController.js", context);
  
  },

  copyFiles:function(){
    this.copy("_gruntfile.js", "Gruntfile.js");
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy("_main.css", "app/styles/main.css");
    this.copy("_loader.gif", "app/images/loader.gif");
    this.copy("_footer.html", "tmp/footer.html");

  },

  concatFiles: function () {

    var done = this.async();
    
    var finalFile='',partialFiles= ["tmp/header.html","tmp/body.html","tmp/footer.html"];

    for (var i = 0; i < partialFiles.length; i++) {
     finalFile+=this.readFileAsString(partialFiles[i]);
    };
    this.write('app/index.html', finalFile);
    var self=this;
    rimraf('tmp', function () {
        self.log.info('Removing temp directory');
      done();
    });
   

  },
 /* generateDemoSection: function(){
    if (this.addDemoSection) {
      var context = {
        content: "Demo Section",
        id: this._.classify("Demo Section")
      }

      var fileBase = Date.now() + "_" + this._.underscored("Demo Section");
      var htmlFile = "app/sections/" + fileBase + ".html";
      var cssFile  = "app/css/" + fileBase + ".css"; 

      this.template("_section.html", htmlFile, context);
      this.template("_section.css", cssFile, context);
    }
  },
  generateMenu: function(){
    var menu = this.read("_menu.html");

    var t = '<a><%= name %></a>';
    var files = this.expand("app/sections/*.html");

    for (var i = 0; i < files.length; i++) {
      var name = this._.chain(files[i]).strRight("_").strLeftBack(".html").humanize().value();

      var context = {
        name: name,
        id: this._.classify(name)
      };

      var link = this.engine(t, context);
      menu = this.append(menu, "div.menu", link);
    }

    this.write("app/menu.html", menu);
  },*/
  runNpm: function(){
    var done = this.async();
    this.npmInstall("", function(){
      console.log("\nEverything Setup !!!\n");
      done();
    });
  }
});

module.exports = magicAppGenerator;
