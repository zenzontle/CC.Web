(function () {
    'use strict';

    var controllerId = 'wip';

    angular.module('app').controller(controllerId, ['$location', '$scope', 'bootstrap.dialog', 'common', 'config', 'datacontext', wip]);

    function wip($location, $scope, bsDialog, common, config, datacontext) {
        var vm = this;

        vm.cancelAllWip = cancelAllWip;
        vm.predicate = '';
        vm.gotoWip = gotoWip;
        vm.reverse = false;
        vm.setSort = setSort;
        vm.title = 'Work in Progress';
        vm.wip = [];

        activate();

        function activate() {
            common.activateController([getWipSummary()], controllerId);

            $scope.$on(config.events.storage.wipChanged, function (event, data) {
                vm.wip = data;
            });
        }

        function cancelAllWip() {
            return bsDialog.deleteDialog('Work in Progress')
                .then(confirmDelete);

            function confirmDelete() {
                datacontext.zStorageWip.clearAllWip();
            }
        }

        function getWipSummary() {
            vm.wip = datacontext.zStorageWip.getWipSummary();
        }

        function gotoWip(wipData) {
            $location.path('/' + wipData.routeState + '/' + wipData.key);
        }

        function setSort(property) {
            vm.predicate = property;
            vm.reverse = !vm.reverse;
        }
    }
})();
