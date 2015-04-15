'use strict';

angular
  .module('iLayers', [
    'ngRoute',
    'ngAnimate',
    'ngDialog',
    'MassAutoComplete',
    'luegg.directives',
    'config',
    'zeroclipboard'
  ])

  .config(['$httpProvider', '$locationProvider', '$routeProvider',
    function($httpProvider, $locationProvider, $routeProvider) {
      $httpProvider.interceptors.push('errorInterceptor');
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

      uiZeroclipConfigProvider.setZcConf({
        swfPath: 'vendor/ZeroClipboard.swf'
      });
  }]);
