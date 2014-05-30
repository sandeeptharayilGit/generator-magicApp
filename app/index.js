'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var AngulGenerator = yeoman.generators.Base.extend({
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
    this.log(yosay('Welcome to the marvelous Angul generator!'));

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
    this.mkdir("app/images");
    this.mkdir("build");


    this.copy("_gruntfile.js", "Gruntfile.js");
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');

    var context = { 
          app_name: this.appName 
        };
    this.template("_bower.json", "bower.json", context);
    this.template("_package.json", "package.json", context);

    var context = { 
          proxy: this.proxy?',\n    "proxy": "'+this.proxy+'",\n    "https-proxy": "'+this.proxy+'",\n    "strict-ssl": false':''
        };
     this.template('_.bowerrc', '.bowerrc',context);
   
  },

  projectfiles: function () {


    this.copy("_main.css", "app/css/main.css");    
    this.copy("_footer.html", "app/footer.html");
    var context = { 
      site_name: this.appName 
    };

    this.template("_header.html", "app/header.html", context);
  },
  generateDemoSection: function(){
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
  },
  runNpm: function(){
    var done = this.async();
    this.npmInstall("", function(){
      console.log("\nEverything Setup !!!\n");
      done();
    });
  }
});

module.exports = AngulGenerator;
