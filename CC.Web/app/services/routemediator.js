(function () {
    'use strict';

    var serviceId = 'routemediator';

    angular.module('app').factory(serviceId, ['$location', '$rootScope', 'config', 'logger', routemediator]);

    routemediator.$inject = ['$http'];

    function routemediator($location, $rootScope, config, logger) {
        var handleRoutChangeError = false;

        var service = {
            setRoutingHandlers: setRoutingHandlers
        };

        return service;

        function setRoutingHandlers() {
            updateDocTitle();
            handleRoutingErrors();
        }

        function updateDocTitle() {
            $rootScope.$on('$routeChangeSuccess', function (event, current, prevous) {
                handleRoutChangeError = false;
                var title = config.docTitle + ' ' + (current.title || '');
                $rootScope.title = title;
            });
        }

        function handleRoutingErrors() {
            $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
                if (handleRoutChangeError) { return; }
                handleRoutChangeError = true;
                var msg = 'Error routing: ' + (current && current.name) + '. ' + (rejection.msg || '');
                logger.logWarning(msg, current, serviceId, true);
                $location.path('/');
            });
        }
    }
})();