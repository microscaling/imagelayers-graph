'use strict';

angular.module('iLayers')
  .factory('commandService', ['$rootScope',
    function($rootScope) {
      var locked = undefined;
      
      return {
          highlight: function (layers) {
            var cmds = []
            for(var i=0; i < layers.length; i++) {
              var command = layers[i].cmd || 'FROM scratch';
              cmds.push(command);
            }
            if (locked === undefined) {
              $rootScope.$broadcast('command-change', { 'commands': cmds });
            }
          },

          constructCommand: function (cmd) {
            var nop = '(nop) ';

            if (cmd === null || cmd == '') cmd = 'FROM scratch';

            if (cmd !== undefined) {
              if (cmd.lastIndexOf(nop) > 0) {
                cmd = cmd.split(nop)[1];
              }
              else {
                cmd = cmd.replace(/\/bin\/sh\/*\s-c/g, 'RUN');
              }
              cmd = cmd.replace(/(map|\/tcp:{}|\[|\]'?|\))/g, '').trim();
            }
            else {
              cmd = '';
            }
            return cmd;
          },

          clear: function() {
            $rootScope.$broadcast('command-change', { 'commands': [] });
          },
        
          lock: function(image) {
            if (image !== undefined) {
              locked = image;
            }
            
            $rootScope.$broadcast('lock-image', { 'image': image });
            return locked; 
          },
        
          release: function() {
            locked = undefined;
          }
      };
  }]);
