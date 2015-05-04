(function() {
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
    .config(configure);
  
    configure.$inject = ['$httpProvider', '$locationProvider', '$routeProvider', 'uiZeroclipConfigProvider'];

    function configure($httpProvider, $locationProvider, $routeProvider, uiZeroclipConfigProvider) {
      $httpProvider.interceptors.push('errorInterceptor');
      $httpProvider.defaults.withCredentials = false;

      $locationProvider.html5Mode(true);

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
    }
})();