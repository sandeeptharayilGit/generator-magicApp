'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var rimraf= require('rimraf');
var framework='angular';
var filePathArr={ html:"/htmls/",js:"/js/",css:"/css/",json:"/json/",gif:"/images/"};

var getFilePath=function getFilePath(file){

  var arr=file.split(".");

  var filePath=filePathArr.hasOwnProperty(arr[arr.length-1])?filePathArr[arr[arr.length-1]]:"/misc/";

  return framework+filePath+file;

}

var magicAppGenerator = yeoman.generators.Base.extend({


  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
     /* if (!this.options['skip-install']) {
        this.installDependencies();
      }*/

      this.installDependencies({
        skipInstall: this.options['skip-install'],
        callback: function() {
                // Emit a new event - dependencies installed
                this.emit('dependenciesInstalled');
              }.bind(this)
            });
    });

    // Now you can bind to the dependencies installed event
    this.on('dependenciesInstalled', function() {
      this.spawnCommand('grunt', ['build','serve']);
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
      this.log(yosay('Thanks for your inputs. Now we will start building your application! wait n see'));
      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir("app");
    this.mkdir("app/styles");
    this.mkdir("app/scripts");
    this.mkdir("app/views");
    this.mkdir("app/scripts/controllers");
    this.mkdir("app/scripts/services");
    this.mkdir("app/scripts/directives");
    this.mkdir("app/scripts/filters");
    this.mkdir("app/images");
    this.mkdir("build");
    this.mkdir("tmp");
    this.mkdir("logs");

  },

  templateFiles:function(){
   var context = { 
    site_name: this.appName , 
    proxy: this.proxy?',\n    "proxy": "'+this.proxy+'",\n    "https-proxy": "'+this.proxy+'",\n    "strict-ssl": false':'',
    app_name: this._.underscored(this.appName)+'App'
  };



  this.template(getFilePath("_bower.json"), "bower.json", context);
  this.template(getFilePath("_package.json"), "package.json", context);
  this.template(getFilePath("_log4js_configuration.json"), "log4js_configuration.json", context);
  this.copy(getFilePath("_app.json"), "logs/"+context.app_name+".log");
  this.template(getFilePath('_.bowerrc'), '.bowerrc',context);

  this.template(getFilePath("_header.html"), "tmp/header.html", context);
  this.template(getFilePath("_body.html"), "tmp/body.html", context);
  
  this.template(getFilePath("_app.js"), "app/scripts/app.js", context);
  this.template(getFilePath("_errorHandler.js"), "app/scripts/services/errorHandler.js", context);
  this.template(getFilePath("_interceptor.js"), "app/scripts/services/interceptor.js", context);
  this.template(getFilePath("_commonServices.js"), "app/scripts/services/commonServices.js", context);
  this.template(getFilePath("_mainController.js"), "app/scripts/controllers/mainController.js", context);

  

  context.defaultView_name="login";
  context.view_name=context.defaultView_name;
  context.action=context.defaultView_name;
  context.actionUrl=context.defaultView_name+'/Action'
  context.actionMethod="POST"

  this.template(getFilePath("_config.json"), "app/scripts/config.json", context);
  this.template(getFilePath("_Controller.js"), "app/scripts/controllers/"+context.view_name+"Controller.js", context);
  this.template(getFilePath("_view.html"), "app/views/"+context.view_name+".html", context);

},

copyFiles:function(){
  this.copy(getFilePath('_gruntfile.js'), 'Gruntfile.js');
  this.copy(getFilePath('editorconfig'), '.editorconfig');
  this.copy(getFilePath('favicon.ico'), 'app/favicon.ico');
  this.copy(getFilePath('jshintrc'), '.jshintrc');
  this.copy(getFilePath("_main.css"), "app/styles/main.css");
  this.copy(getFilePath("_loader.gif"), "app/images/loader.gif");
  this.copy(getFilePath("_footer.html"), "tmp/footer.html");

  



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
 
  runNpm: function(){
    var done = this.async();
    this.npmInstall("", function(){
      console.log("\nEverything Setup !!!\n");
      done();
    });
  }
});

module.exports = magicAppGenerator;
