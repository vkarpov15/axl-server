var angular = require('angular');
var _ = require('underscore');
require('./angular-route')(angular);

var axlUI = angular.module('axl.ui', ['ngRoute']);

if (typeof window !== 'undefined') {
  window.mongoose = require('mongoose');
  window.schemas = {
    Project: require('../../models/Project')
  };
  window.axlUI = axlUI;
}

var controllers = require('./controllers');
_.each(controllers, function(factory, name) {
  axlUI.controller(name, factory);
});

var services = require('./services');
_.each(services, function(service, name) {
  axlUI.factory(name, service);
});

var directives = require('./directives');
_.each(directives, function(directive, name) {
  axlUI.directive(name, directive);
});

axlUI.config(function($routeProvider) {
  $routeProvider.
    when('/projects', {
      templateUrl: window.templateBasePath +
        '/templates/projects.html',
      controller: 'ProjectsController'
    }).
    when('/projects/new', {
      templateUrl: window.templateBasePath +
        '/templates/create_project.html',
      controller: 'CreateProjectController'
    }).
    when('/project', {
      templateUrl: window.templateBasePath +
        '/templates/project.html',
      controller: 'ProjectController'
    }).
    when('/upload', {
      templateUrl: window.templateBasePath +
        '/templates/upload.html',
      controller: 'UploadController'
    }).
    when('/search', {
      templateUrl: window.templateBasePath +
        '/templates/search.html',
      controller: 'SearchController'
    }).
    when('/', {
      templateUrl: window.templateBasePath +
        '/templates/index.html'
    });
});

axlUI.config(function($sceDelegateProvider) {
 $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   // Cloudfront
   'http://*.cloudfront.net/**',
   'https://*.cloudfront.net/**'
   ]);
});

axlUI.config(function($rootScopeProvider) {
  var oldGet = $rootScopeProvider.$get;

  $rootScopeProvider.$get = function($injector) {
    var rootScope = $injector.invoke(oldGet);

    rootScope.encodeURIComponent = encodeURIComponent;
    return rootScope;
  };
});