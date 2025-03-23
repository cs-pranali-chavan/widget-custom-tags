/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';
(function () {
    angular
      .module('cybersponse')
      .controller('customTags100Ctrl', customTags100Ctrl);

    customTags100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$state', 'appModulesService'];

    function customTags100Ctrl($scope, widgetUtilityService, $state, appModulesService) {
      $scope.outbreakTags = [{
        key: 'Invanti Cloud Servic Appliance',
        structure: 'link',
        color: 'defaultColor',
        id: '0b5fdc1e-0403-46f7-b311-1014255828c9',
        module: 'outbreak_alerts'
      }];
      
      $scope.customTags = [{
        key: 'CVE-2024-8190',
        structure: 'tags',
        color: 'defaultColor'
      },{
        key: 'CVE-2024-8963',
        structure: 'tags',
        color: 'defaultColor'
      },{
        key: 'CVE-2024-9380',
        structure: 'tags',
        color: 'defaultColor'
      },{
        key: 'CVE-2024-9379',
        structure: 'tags',
        color: 'defaultColor'
      }];

      $scope.navigateToOutbreak = navigateToOutbreak;

      function navigateToOutbreak(_id, module){
        var viewParams = {
          indicator: _id
        };
        var state = appModulesService.getState(module);

        var params = {
          module:  module,
          id: _id,
          viewParams: JSON.stringify(viewParams),
          previousState: $state.current.name,
          previousParams: JSON.stringify($state.params)
        };
        var leavingViewPanel = state.indexOf('viewPanel') === -1 && $state.current.name.indexOf('viewPanel') !== -1;
        if (leavingViewPanel) {
          var url = $state.href(state, params);
          $window.open(url, '_blank');
        } else {
          $state.go(state, params);
        }
      }


      function _handleTranslations() {
        widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
          };
        });
      }

      function init() {
        // To handle backward compatibility for widget
        _handleTranslations();
      }

      init();
    }
})();
