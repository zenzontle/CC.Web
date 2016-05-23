(function () {
    'use strict';

    var controllerId = 'attendees';

    angular.module('app').controller(controllerId, ['common', 'datacontext', speakers]);

    function speakers(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.refresh = refresh;
        vm.attendees = [];
        vm.title = 'Attendees';

        activate();

        function activate() {
            common.activateController([getAttendees()], controllerId)
                .then(function () { log('Activated Attendees View'); });
        }

        function getAttendees(forceRefresh) {
            return datacontext.getAttendees(forceRefresh).then(function (data) {
                return vm.attendees = data;
            });
        }

        function refresh() {
            getAttendees(true);
        }
    }
})();
