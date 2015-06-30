'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'flow'
]).
config([
  '$routeProvider', 'flowFactoryProvider', 
  function($routeProvider, flowFactoryProvider) {

  flowFactoryProvider.defaults = {
    target: 'http://flowjs.github.io/ng-flow/',
    method: 'octet',
    permanentErrors: [404, 500, 501],
    maxChunkRetries: 1,
    chunkRetryInterval: 5000,
    simultaneousUploads: 4
  };
  flowFactoryProvider.on('catchAll', function (event) {
    console.log('catchAll', arguments);
  });

  flowFactoryProvider.on('fileAdded', function(file, event){
    console.log('fileAdded', file, event);
    
    // Initiate Upload
    var initXhr = new XMLHttpRequest();
    var initUrl = '/rest/folders/65/actions/initiateUpload';
    var initData = JSON.stringify({filename: file.name, totalSize: file.size, totalChunks: file.chunks.length});
    initXhr.open('POST', initUrl, true);
    initXhr.send(initData);

    // Get Upload URL
    var uploadXhr = new XMLHttpRequest();
    var uploadUrl = '/rest/uploads/93';
    uploadXhr.open('GET', uploadUrl, true);
    uploadXhr.send(JSON.stringify({}));
    var uploadLocation = uploadXhr.getResponseHeader('x-accellion-location');

    // Upload File Chunk
    file.flowObj.defaults.target = '/hey/hey/hey';
    console.log('UPLOAD', file);
  });

  $routeProvider.when(
    '/upload', 
    {
      templateUrl: 'views/upload/index.html'
    }
  );
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
