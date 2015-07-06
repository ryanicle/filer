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
    forceChunkSize: true,
    preprocess: function (chunk) {
      var blob = chunk.fileObj.file.slice(chunk.startByte, chunk.endByte);
      chunk.fileObj.readFile(blob);
      var timer = setInterval(function () {
        if (document.getElementById('fileContent').value) {
          clearInterval(timer);
          chunk.preprocessFinished();
        }
      }, 500);
    }
  };
  flowFactoryProvider.on('catchAll', function (event) {
    // console.log('catchAll', arguments);
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
  $scope.currentFile = '';

  $scope.initUpload = function (file, event, flow) {
    var mainHeaders = {'x-xsrf-token': 'e8ece16f3a66c45719fccf275b6e9554172ddde1'};
    $scope.currentFile = file;
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
        // console.log('final url', data.uri);
        file.target = 'https://ryan-tfa.sd.dev/' + data.uri;
        flow.upload();
      }).error(function(data, status, headers, config) {

      });
    }).error(function(data, status, headers, config) {

    });
  };

  $scope.uploadStart = function(file, event, flow) {
    // console.log('uploadStart', flow.defaults);
  };

  $scope.complete = function (file, event, flow) {
    // console.log('COMPLETE');
    document.getElementById('fileContent').value = '';
  };

  $scope.formatTimeRemaining = function (seconds) {
    if (seconds != Number.POSITIVE_INFINITY) {
      var totalSec = seconds,
          hours = parseInt( totalSec / 3600 ) % 24,
          minutes = parseInt( totalSec / 60 ) % 60,
          seconds = parseInt(totalSec % 60, 10);

      var result = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds  < 10 ? '0' + seconds : seconds);

      return result;
    }
    return '00:00:00';
  };
}]);;
