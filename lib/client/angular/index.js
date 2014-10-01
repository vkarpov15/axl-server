var angular = require('angular');
var _ = require('underscore');
require('./angular-route')(angular);

var axlUI = angular.module('axl.ui', ['ngRoute']);

if (typeof window !== 'undefined') {
  window.mongoose = require('mongoose');
  window.schemas = {
    Project: require('../../models/project')
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
      templateUrl: '/templates/projects.html',
      controller: 'ProjectsController'
    }).
    when('/projects/new', {
      templateUrl: '/templates/create_project.html',
      controller: 'CreateProjectController'
    }).
    when('/project', {
      templateUrl: '/templates/project.html',
      controller: 'ProjectController'
    }).
    when('/upload', {
      templateUrl: '/templates/upload.html',
      controller: 'UploadController'
    }).
    when('/search', {
      templateUrl: '/templates/search.html',
      controller: 'SearchController'
    }).
    when('/', {
      templateUrl: '/templates/index.html'
    });
});

axlUI.config(function($rootScopeProvider) {
  var oldGet = $rootScopeProvider.$get;

  $rootScopeProvider.$get = function($injector) {
    var rootScope = $injector.invoke(oldGet);

    rootScope.encodeURIComponent = encodeURIComponent;
    return rootScope;
  };
});