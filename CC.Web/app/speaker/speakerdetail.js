(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'speakerdetail';

    angular.module('app').controller(controllerId,
        ['$routeParams', 'common', 'datacontext', speakerdetail]);

    function speakerdetail($routeParams, common, datacontext) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.activate = activate;
        vm.getTitle = getTitle;
        vm.speaker = undefined;
        vm.speakerIdParameter = $routeParams.id;

        activate();

        function activate() {
            common.activateController([getRequestedSpeaker()], controllerId);
        }

        function getRequestedSpeaker() {
            var val = $routeParams.id;

            //TODO: write the geyById
            return datacontext.speaker.getById(val)
                .then(function (data) {
                    vm.speaker = data;
                }, function (error) {
                    logError('Unable to get speaker ' + val);
                });
        }

        function getTitle() {
            return 'Edit ' + ((vm.speaker && vm.speaker.fullName) || '');
        }
    }
})();
