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

      var errorInterceptor = function($q) {
        return {
          response: function(response) {
            return response;
          },
          responseError: function(response) {
            console.log(response);
            return $q.reject(response);
          }
        };
      };

      $httpProvider.interceptors.push(errorInterceptor);
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
