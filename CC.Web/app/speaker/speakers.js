﻿(function () {
    'use strict';

    var controllerId = 'speakers';

    angular.module('app').controller(controllerId, ['common', 'datacontext', speakers]);

    function speakers(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.refresh = refresh;
        vm.speakers = [];
        vm.title = 'Speakers';

        activate();

        function activate() {
            common.activateController([getSpeakers()], controllerId)
                .then(function () { log('Activated Speakers View'); });
        }

        function getSpeakers(forceRefresh) {
            return datacontext.getSpeakerPartials(forceRefresh).then(function (data) {
                return vm.speakers = data;
            });
        }

        function refresh() {
            getSpeakers(true);
        }
    }
})();
