/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('editCustomTags100Ctrl', editCustomTags100Ctrl);

    editCustomTags100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'widgetUtilityService', '$timeout', 'appModulesService', 'Entity'];

    function editCustomTags100Ctrl($scope, $uibModalInstance, config, widgetUtilityService, $timeout, appModulesService, Entity) {
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.config = config;
        $scope.structureSupported = ['Card','Tag','URL'];

        function _handleTranslations() {
          let widgetNameVersion = widgetUtilityService.getWidgetNameVersion($scope.$resolve.widget, $scope.$resolve.widgetBasePath);
          
          if (widgetNameVersion) {
            widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
              $scope.viewWidgetVars = {
                // Create your translating static string variables here
              };
              loadModules();
            });
          } else {
            $timeout(function() {
              $scope.cancel();
            });
          }
        }

        function loadModules() {
          appModulesService.load(true).then(function (modules) {
            $scope.modules = modules;
            //Create a list of modules with atleast one JSON field
            $scope.modules.forEach((module) => {
              var moduleMetaData = modelMetadatasService.getMetadataByModuleType(module.type);
              for (let fieldIndex = 0; fieldIndex < moduleMetaData.attributes.length; fieldIndex++) {
                //Check If JSON field is present in the module
                if (moduleMetaData.attributes[fieldIndex].type === "object") {
                  $scope.jsonObjModuleList.push(module);
                  break;
                }
              }
            });
          });
          if ($scope.config.resourceModule) {
            $scope.loadAttributes();
          }
        }
    
        $scope.loadAttributes = function() {
          $scope.fields = [];
          $scope.fieldsArray = [];
          $scope.resourceField = [];
          var entity = new Entity($scope.config.resourceModule);
          entity.loadFields().then(function() {
            for (var key in entity.fields) {
              if (entity.fields[key].type === 'datetime') {
                entity.fields[key].type = 'datetime.quick';
              } else if(entity.fields[key].type === 'text'){
                $scope.resourceField.push(entity.fields[key]);
              }
            }
    
            $scope.fields = entity.getFormFields();
            angular.extend($scope.fields, entity.getRelationshipFields());
            $scope.fieldsArray = entity.getFormFieldsArray();
          });
        };

        function init() {
            // To handle backward compatibility for widget
            _handleTranslations();
        }

        init();

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            $uibModalInstance.close($scope.config);
        }

    }
})();
