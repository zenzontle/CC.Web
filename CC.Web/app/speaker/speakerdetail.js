(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'speakerdetail';

    angular.module('app').controller(controllerId,
        ['$routeParams', '$scope', '$window', 'common', 'config', 'datacontext', speakerdetail]);

    function speakerdetail($routeParams, $scope, $window, common, config, datacontext) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.activate = activate;
        vm.cancel = cancel;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;
        vm.speaker = undefined;
        vm.speakerIdParameter = $routeParams.id;

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });
        function canSave() { return vm.hasChanges && !vm.isSaving; }

        activate();

        function activate() {
            onDestroy();
            onHasChanges();
            common.activateController([getRequestedSpeaker()], controllerId);
        }

        function cancel() {
            datacontext.cancel();
        }

        function onDestroy() {
            $scope.$on('$destroy', function () {
                datacontext.cancel();
            });
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged, function (event, data) {
                vm.hasChanges = data.hasChanges;
            });
        }

        function getRequestedSpeaker() {
            var val = $routeParams.id;

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

        function goBack() { $window.history.back(); }

        function save() {
            vm.isSaving = true;
            return datacontext.save()
                .then(function (saveResult) {
                    vm.isSaving = false;
                }, function (error) {
                    vm.isSaving = false;
                });
        }
    }
})();
