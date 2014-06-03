'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var rimraf= require('rimraf');
var framework='angular';
var filePathArr={ html:"/htmls/",js:"/js/",css:"/css/",json:"/json/",gif:"/images/"};
var chalk = require('chalk');
var getRoute=function(context){
	return{
   "settings": {
     "templateUrl": "views/"+context.view_name+".html",
     "controller": context.app_name+"-"+context.view_name+"Cntrl"
   },
   "config": {
     "header": "",
     "bodyColor": "gray"
   }
 }
};
var getFilePath=function getFilePath(file){

  var arr=file.split(".");

  var filePath=filePathArr.hasOwnProperty(arr[arr.length-1])?filePathArr[arr[arr.length-1]]:"/misc/";

  return framework+filePath+file;

};

var ViewGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    console.log('You called the view subgenerator with the argument ' + this.name + '.');
  this.on('end', function () {
     this.log();this.log();
     this.log(chalk.green.bold('Html and conntroller created for the view : '+this.context.view_name));
     this.log(chalk.green.bold('Updated routes in config.json for the app '+this.context.app_name ));
      this.log();
     this.log(chalk.cyan.bgRed.bold('Take a grunt build and run your app'));

    });


  },

  files: function () {
   var done = this.async();
   var packageObj=this.readFileAsString('package.json');
   //console.log('packageObj',packageObj);
   packageObj=JSON.parse(packageObj);
   this.context = { 
      app_name: this._.underscored(packageObj.name)+'App',
      view_name:this.name
    };

    var configObj=this.readFileAsString('app/scripts/config.json');
    configObj=JSON.parse(configObj);
    configObj.Global.Routes['/'+this.name]=getRoute(this.context)
    var self=this;
    rimraf('app/scripts/config.json', function () {
      self.log.info('Updating config.json');
      done();
    });

    this.write('app/scripts/config.json', JSON.stringify(configObj,null,'\t'));


    this.template(getFilePath("_Controller.js"), "app/scripts/controllers/"+this.context.view_name+"Controller.js", this.context);
    this.template(getFilePath("_view.html"), "app/views/"+this.context.view_name+".html", this.context);
  }
});

module.exports = ViewGenerator;