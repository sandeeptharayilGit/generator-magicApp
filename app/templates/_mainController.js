document.addEventListener('touchmove', function(e){
	"use strict";
	e.preventDefault();
});

<%= app_name %>controllers.controller('<%= app_name %>-mainCntrl',['$scope','$rootScope','AppConstants','SelectView', 'SessionManager', '$location',
                                                       function mainController ( $scope, $rootScope, AppConstants,SelectView,SessionMngr, $location ) {
	"use strict";

	var log = loggerService('<%= app_name %>-cartCntrl');

	log.log("Inside <%= app_name %>-mainCntrl");
	log.info("Inside <%= app_name %>-mainCntrl");
	log.warn("Inside <%= app_name %>-mainCntrl");
	log.error("Inside <%= app_name %>-mainCntrl");
	

}]);

