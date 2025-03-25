/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';

(function () {
  angular
    .module('cybersponse')
    .factory('customTagsService', customTagsService);

    customTagsService.$inject = ['API', 'connectorService', '$resource', 'Query' , '$q', '$http'];

  function customTagsService(API, connectorService, $resource, Query, $q, $http) {
    var service;

    service = {
      executeAction: executeAction,
      getTagsQuery: getTagsQuery
    };

    //execute connection action
    function executeAction(connector_name, connector_action, payload) {
      return $resource(API.INTEGRATIONS + 'connectors/?name=' + connector_name)
          .get()
          .$promise
          .then(function (connectorMetaDataForVersion) {
              let defaultConfig = connectorMetaDataForVersion.data[0].configuration.filter(item => item.default);
              if (defaultConfig) {
                  var config_id = defaultConfig[0]['config_id'];
              }
              else {
                  toaster.error({ body: 'Default configuration not present.' });
              }
              return connectorService.executeConnectorAction(connector_name, connectorMetaDataForVersion.data[0].version, connector_action, config_id, payload);
          })
          .catch(function (error) {
              console.error('Error:', error);
              throw error; // Rethrow the error to be handled by the caller
          });
    }

    //to fetch modules data through API query
    function getTagsQuery(_tags, _module) {
      var defer = $q.defer();
      var queryObject = {
        "filters": [
          {
            "sort": [],
            "limit": 30,
            "logic": "AND",
            "filters": [{
              "field": "recordTags.uuid",
              "operator": "like",
              "value": "%" + _tags + "%",
              "type": "primitive"
            }]
          }
        ],
      };
      var _queryObj = new Query(queryObject);
      $http.post(API.QUERY + _module, _queryObj.getQuery(true)).then(function (response) {
          defer.resolve(response);
      }, function (error) {
          defer.reject(error);
      });
      return defer.promise;
  }

  return service;
  }
})();
