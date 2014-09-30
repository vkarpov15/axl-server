var angular = require('angular');
var _ = require('underscore');
require('./angular-route')(angular);

if (typeof window !== 'undefined') {
  window.mongoose = require('mongoose');
  window.schemas = {
    Project: require('../../models/project')
  };
}

var module = angular.module('axl.ui', ['ngRoute']);

var controllers = require('./controllers');
_.each(controllers, function(factory, name) {
  module.controller(name, factory);
});

var services = require('./services');
_.each(services, function(service, name) {
  module.factory(name, service);
});

var directives = require('./directives');
_.each(directives, function(directive, name) {
  module.directive(name, directive);
});

module.config(function($routeProvider) {
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
    when('/', {
      templateUrl: '/templates/index.html'
    });
});

module.config(function($rootScopeProvider) {
  var oldGet = $rootScopeProvider.$get;

  $rootScopeProvider.$get = function($injector) {
    var rootScope = $injector.invoke(oldGet);

    rootScope.encodeURIComponent = encodeURIComponent;
    return rootScope;
  };
});