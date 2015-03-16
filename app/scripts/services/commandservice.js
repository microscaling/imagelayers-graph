'use strict';

angular.module('iLayers')
  .factory('commandService', ['$rootScope',
    function($rootScope) {
      return {
          highlight: function (layers) {
            var cmds = [],
                nop = '#(nop) ',
                startsWith = function(text, str) {
                  return text.slice(0, str.length) === str
                };

            for(var i=0; i < layers.length; i++) {
              var command = layers[i].container_config.Cmd;
                if (command !== null) {
                  var cmd = command[command.length -1];
                  if (startsWith(cmd, nop)) {
                    cmds.unshift(cmd.split(nop)[1]);
                  } else {
                    cmds.unshift("RUN " + cmd);
                  }
                } else {
                  cmds.unshift('FROM scratch');
                }
            }

            $rootScope.$broadcast('command-change', { 'commands': cmds });
          },

          clear: function() {
            $rootScope.$broadcast('command-change', { 'commands': [] });
          }
      };
  }]);
