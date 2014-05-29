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
      name: 'addDemoSection',
      message: 'Would you like to generate a demo section ?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.addDemoSection = props.addDemoSection;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir("app");
    this.mkdir("app/css");
    this.mkdir("app/sections");
    this.mkdir("build");


    this.copy("_gruntfile.js", "Gruntfile.js");
    //this.copy("_package.json", "package.json");
    this.copy('_bower.json', 'bower.json');
    var context = { 
          app_name: this.appName 
        };
this.template("_package.json", "package.json", context);
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('_.bowerrc', '.bowerrc');

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
