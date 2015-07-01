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
    testMethod: false,
    chunkSize: 3 * 1024 * 1024,
    forceChunkSize: true
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
    var mainHeaders = {'x-xsrf-token': '47b3bfd9176426902eeec515cae8cf39ff56e327'};
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
  };

  $scope.uploadStart = function(file, event, flow) {
    console.log('uploadStart', flow.defaults);
  };

  $scope.complete = function (file, event, flow) {
    console.log('COMPLETE');
  };
}]);;
