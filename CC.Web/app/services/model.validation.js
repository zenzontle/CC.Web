(function () {
    'use strict';

    var serviceId = 'model.validation';

    angular.module('app').factory(serviceId, ['common', modelValidation]);

    function modelValidation(common) {
        var entityNames;
        var log = common.logger.getLogFn(serviceId);
        var Validator = breeze.Validator;
        var requireReferenceValidator;
        var service = {
            applyValidators: applyValidators,
            createAndRegister: createAndRegister
        };
        var twitterValidator;

        return service;

        function createAndRegister(eNames) {
            entityNames = eNames;
            // Step 1: create it
            requireReferenceValidator = createRequireReferenceValidator();
            twitterValidator = createTwitterValidator();
            // Step 2: Tell breeze about it
            Validator.register(requireReferenceValidator);
            Validator.register(twitterValidator);
            // Step 3: Later on, we'll apply it
            log('Validators created and registered', null, serviceId, false);
        }

        function applyValidators(metadataStore) {
            applyRequireReferenceValidators(metadataStore);
            applyTwitterValidators(metadataStore);
            applyEmailValidators(metadataStore);
            applyUrlValidators(metadataStore);
            log('Validators applied', null, serviceId);
        }

        function createRequireReferenceValidator() {
            var name = 'requireReferenceEntity';
            var ctx = {
                messageTemplate: 'Missing %displayName%',
                isRequired: true
            };
            var val = new Validator(name, valFunction, ctx);
            return val;

            function valFunction(value) {
                return value ? value.id !== 0 : false;
            }
        }

        function createTwitterValidator() {
            var val = Validator.makeRegExpValidator(
                    'twitter',
                    /^@([a-zA-Z]+)([a-zA-Z0-9_]+)$/,
                    "Invalid Twitter User Name: '%value%'"
                );
            return val;
        }

        function applyEmailValidators(metadataStore) {
            var entityType = metadataStore.getEntityType(entityNames.speaker);
            entityType.getProperty('email').validators.push(Validator.emailAddress());
        }

        function applyRequireReferenceValidators(metadataStore) {
            var navigations = ['room', 'track', 'timeSlot', 'speaker'];
            var entityType = metadataStore.getEntityType(entityNames.session);
            navigations.forEach(function (propertyName) {
                entityType.getProperty(propertyName).validators.push(requireReferenceValidator);
            });
        }

        function applyTwitterValidators(metadataStore) {
            var entityType = metadataStore.getEntityType(entityNames.speaker);
            entityType.getProperty('twitter').validators.push(twitterValidator);
        }

        function applyUrlValidators(metadataStore) {
            var entityType = metadataStore.getEntityType(entityNames.speaker);
            entityType.getProperty('blog').validators.push(Validator.url());
        }
    }
})();