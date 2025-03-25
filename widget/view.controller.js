/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';
(function () {
    angular
      .module('cybersponse')
      .controller('customTags100Ctrl', customTags100Ctrl);

    customTags100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$state', 'appModulesService', 'customTagsService', 'modelMetadatasService'];

    function customTags100Ctrl($scope, widgetUtilityService, $state, appModulesService, customTagsService, modelMetadatasService) {
      
      $scope.noData = false;
      
      $scope.customTags = [];

      $scope.navigateToOutbreak = navigateToOutbreak;
      $scope.pageState = $state;
      $scope.processing = true;

      function navigateToOutbreak(_id){
        let module = $scope.config.navigationModule;
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
        checkCurrentPage($scope.pageState);
      }


      function checkCurrentPage(state){
        if (state.current.name.includes('viewPanel.modulesDetail')) {
          let params = $scope.pageState.current.params;
          $scope.indicator = params.id;
          fetchTagsData();
        }
      }

      function fetchTagsData(){ 
        let moduleMetaData = modelMetadatasService.getMetadataByModuleType($scope.config.resourceModule);
        let _connectorName = moduleMetaData.dataSource.connector;
        let _connectorAction = moduleMetaData.dataSource.operation;
        let payload = { 'indicator': $scope.indicator, 'fields': $scope.config.resourceField };
        customTagsService.executeAction(_connectorName, _connectorAction, payload).then(function(response){
          $scope.tagsKey = $scope.config.resourceField;
          if (response.data[$scope.tagsKey].length > 0) {
            $scope.noData = false;
            $scope.processing = false;
            $scope.tooltipErrorMsg = '';
            if ($scope.config.structureSelected !== 'URL') {
              $scope.customTags = response.data[$scope.tagsKey];
            }
            else {
              changeURLTagsSchema(response.data[$scope.tagsKey]);
            }
          }
          else{
            $scope.noData = true;
          }
        },function(error){
          $scope.processing = false;
          $scope.noData = true;
          $scope.tooltipErrorMsg = 'Error while fetching data. Please check connector logs for more info.';
        });
      }
  
      function changeURLTagsSchema(_tagsData) {
        _tagsData.forEach(tags => {
          customTagsService.getTagsQuery(tags, $scope.config.navigationModule).then(function (response) {
            if (response && response.data['hydra:member'] && response.data['hydra:member'].length > 0) {
              $scope.customTags.push({
                key: tags,
                id: response.data['hydra:member'][0].uuid,
                module: $scope.config.navigationModule
              })
            }
            else { //if API response has no data 
              $scope.processing = false;
              $scope.noData = true;
            }
          }, function (error) {
            console.log(error);
          });
        });
      }

      function init() {
        // To handle backward compatibility for widget
        _handleTranslations();
      }

      init();
    }
})();
