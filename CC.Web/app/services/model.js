﻿(function () {
    'use strict';

    var serviceId = 'model';

    angular.module('app').factory(serviceId, model);

    function model(config) {
        var service = {
            configureMetadataStore: configureMetadataStore
        };

        return service;

        function configureMetadataStore(metadataStore) {
            //TODO register session - tags
            //TODO register person - fullName
            //TODO register timeslot - name
            registerTimeSlot(metadataStore);
            registerSession(metadataStore);
            registerPerson(metadataStore);
        }

        function registerPerson(metadataStore) {
            metadataStore.registerEntityTypeCtor('Person', Person);

            function Person() { }

            Object.defineProperty(Person.prototype, 'fullName', {
                get: function () {
                    var fn = this.firstName;
                    var ln = this.lastName;
                    return ln ? fn + ' ' + ln : fn;
                }
            })
        }

        function registerSession(metadataStore) {
            metadataStore.registerEntityTypeCtor('Session', Session);

            function Session() { }

            Object.defineProperty(Session.prototype, 'tagsFormatted', {
                get: function () {
                    return this.tags ? this.tags.replace(/\|/g, ', ') : this.tags;
                },
                set: function (value) {
                    this.tags = value.replace(/\, /g, '|');
                }
            })
        }

        function registerTimeSlot(metadataStore) {
            metadataStore.registerEntityTypeCtor('TimeSlot', TimeSlot);

            function TimeSlot() { }

            Object.defineProperty(TimeSlot.prototype, 'name', {
                get: function () {
                    //formatted dates are good!
                    var start = this.start;
                    var value = moment.utc(start).format('ddd hh:mm a');
                    return value;
                }
            })
        }
    }
})();