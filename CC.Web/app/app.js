(function () {
    'use strict';
    
    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions
        'breeze.angular',

        // 3rd Party Modules
        'breeze.directives',
        'ui.bootstrap'      // ui-bootstrap (ex: carousel, pagination, dialog)
    ]);
    
    // Handle routing errors and success events
    app.run(['$route', '$rootScope', '$q', 'breeze', 'datacontext', 'routemediator',
        function ($route, $rootScope, $q, breeze, datacontext, routemediator) {
            // Include $route to kick start the router.
            routemediator.setRoutingHandlers();
        }]);        
})();