﻿(function () {
    'use strict';

    var controllerId = 'sessiondetail';

    angular.module('app').controller(controllerId,
        ['$location', '$scope', '$routeParams', '$window', 'common', 'config', 'datacontext', sessiondetail]);

    function sessiondetail($location, $scope, $routeParams, $window, common, config, datacontext) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var $q = common.$q;

        vm.activate = activate;
        vm.cancel = cancel;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.rooms = [];
        vm.save = save;
        vm.session = undefined;
        vm.speakers = [];
        vm.timeslots = [];
        vm.tracks = [];

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });
        function canSave() { return vm.hasChanges && !vm.isSaving; }

        activate();

        function activate() {
            initLookups();
            onDestroy();
            onHasChanges();
            common.activateController([getRequestedSession()], controllerId);
        }

        function cancel() {
            datacontext.cancel();
            if (vm.session.entityAspect.entityState.isDetached()) {
                gotoSessions();
            }
        }

        function gotoSessions() { $location.path('/sessions'); }
        
        function initLookups() {
            var lookup = datacontext.lookup.lookupCachedData;
            vm.rooms = lookup.rooms;
            vm.timeslots = lookup.timeslots;
            vm.tracks = lookup.tracks;

            vm.speakers = datacontext.speaker.getAllLocal(true);
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

        function getRequestedSession() {
            var val = $routeParams.id;

            if (val === 'new') {
                vm.session = datacontext.session.create();
                return vm.session;
            }

            return datacontext.session.getById(val)
                .then(function (data) {
                    vm.session = data;
                }, function (error) {
                    logError('Unable to get session ' + val);
                });
        }

        function goBack() { $window.history.back(); }

        function save() {
            if (!canSave()) { return $q.when(null); } //Must return a promise

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