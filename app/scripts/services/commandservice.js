'use strict';

angular.module('iLayers')
  .factory('commandService', ['$rootScope',
    function($rootScope) {
      var locked = undefined;
    
      return {
          highlight: function (layers, force) {
            var cmds = []
            for(var i=0; i < layers.length; i++) {
              var cmd = layers[i].container_config.Cmd,
                  txt = (cmd) ? cmd[cmd.length-1] : null;
              
                cmds.push(this.constructCommand(txt));
            }
            
            if (locked === undefined || force === true) {
              $rootScope.$broadcast('command-change', { 'commands': cmds });
            }
          },

          constructCommand: function (cmd) {
            var nop = '(nop) ';

            if (cmd === null || cmd == '') {
              cmd = 'FROM scratch';
            }

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
          
          locked: function() {
            return locked;
          },
        
          lock: function(image) {
            if (image !== undefined) {
              locked = image;
            }
            
            $rootScope.$broadcast('lock-image', { 'image': locked });
            return locked; 
          },
        
          release: function() {
            locked = undefined;
            $rootScope.$broadcast('lock-image', { 'image': locked });
          }
      };
  }]);
