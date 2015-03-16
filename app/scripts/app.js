'use strict';

angular
  .module('iLayers', [
    'ngRoute',
    'ngAnimate',
    'ngDialog',
    'MassAutoComplete',
    'luegg.directives',
    'config'
  ])
  .config(['$httpProvider', '$locationProvider', '$routeProvider',
    function($httpProvider, $locationProvider, $routeProvider) {
      $httpProvider.defaults.withCredentials = false;

      $locationProvider.html5Mode(false);

      $routeProvider
      .when ('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'

      })
      .otherwise ({
        redirectTo: '/'
      });

  }]);
