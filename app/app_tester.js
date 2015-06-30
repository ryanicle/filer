'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'flow'
]).
config([
  '$routeProvider', 'flowFactoryProvider',
  function($routeProvider, flowFactoryProvider) {

  flowFactoryProvider.defaults = {
    target: 'https://ryan-tfa.sd.dev/rest/',
    method: 'multipart',
    permanentErrors: [404, 500, 501],
    maxChunkRetries: 1,
    chunkRetryInterval: 5000,
    simultaneousUploads: 1,
    testMethod: false
  };
  flowFactoryProvider.on('catchAll', function (event) {
    console.log('catchAll', arguments);
  });

  $routeProvider.when(
    '/upload', 
    {
      templateUrl: '../upload.html'
    }
  );
  $routeProvider.otherwise({redirectTo: '/upload'});
}])
.controller('TestController', ['$scope', '$http', function($scope, $http) {

  $scope.initUpload = function (file, event, flow) {
    console.log('fileAdded2', file, flow);
    var mainHeaders = {'x-xsrf-token': '55f389c9ba1f5f15fd6ead446acdc7f145909e5f'};
    $http({
      method: 'POST',
      url: '/rest/folders/65/actions/initiateUpload',
      headers: mainHeaders,
      data: JSON.stringify({filename: file.name, totalSize: file.size, totalChunks: file.chunks.length})
    }).success(function(data, status, headers, config) {
      $http({
        url: headers('x-accellion-location'),
        method: 'GET',
        headers: mainHeaders
      }).success(function (data, status, headers, config) {
        console.log('final url', data.uri);
        flow.opts.target = 'https://ryan-tfa.sd.dev/' + data.uri;
        flow.upload();
      }).error(function(data, status, headers, config) {

      });
    }).error(function(data, status, headers, config) {

    });
    console.log('fileAdded3', file, flow);
  };

  $scope.uploadStart = function(file, event, flow) {
    console.log('uploadStart', flow.defaults);
  };

  $scope.complete = function (file, event, flow) {
    console.log('COMPLETE');
  };
}]);;
