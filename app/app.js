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
    target: 'upload.php',
    permanentErrors: [404, 500, 501],
    maxChunkRetries: 1,
    chunkRetryInterval: 5000,
    simultaneousUploads: 4
  };
  flowFactoryProvider.on('catchAll', function (event) {
    console.log('catchAll', arguments);
  });

  $routeProvider.when(
    '/upload', 
    {
      templateUrl: 'views/upload/index.html'
    }
  );
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
