/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';
(function () {
    angular
      .module('cybersponse')
      .controller('customTags100Ctrl', customTags100Ctrl);

    customTags100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$state', 'appModulesService', 'customTagsService', 'modelMetadatasService', 'localStorageService'];

    function customTags100Ctrl($scope, widgetUtilityService, $state, appModulesService, customTagsService, modelMetadatasService, localStorageService) {
      
      $scope.noData = false;
      
      $scope.customTags = [];

      $scope.navigateToOutbreak = navigateToOutbreak;
      $scope.pageState = $state;
      $scope.processing = true;
      $scope.tooltipErrorMsg = '';


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
          $scope.tagsKey = getDisplayKey($scope.config.resourceField);
          if (response.data[$scope.config.resourceField].length > 0) {
            $scope.noData = false;
            $scope.tooltipErrorMsg = '';
            if ($scope.config.structureSelected !== 'URL') {
              $scope.customTags = response.data[$scope.config.resourceField];
            }
            else {
              changeURLTagsSchema(response.data[$scope.config.resourceField]);
            }
          }
          else{
            $scope.noData = true;
          }
        },function(error){
          $scope.noData = true;
          $scope.tooltipErrorMsg = 'Error while fetching data. Please check connector logs for more info.';
        }).finally(function(){
          $scope.processing = false;
        });;
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
            else { //if API response has no data push only key to display 
              $scope.customTags.push({
                key: tags
              })
            }
          }, function (error) {
            console.log(error);
          }).finally(function(){
            $scope.processing = false;
          });
        });
      }

      function getDisplayKey(_key){
        let _attributes =  loadModuleFromLocalStorage().attributes;
        return _attributes.find(i=> i.name === _key).descriptions.singular
      }

      function loadModuleFromLocalStorage() {
        const _param = 'metadata.' + $scope.config.resourceModule;
        return localStorageService.get(_param);
      }

      function init() {
        // To handle backward compatibility for widget
        _handleTranslations();
      }

      init();
    }
})();
