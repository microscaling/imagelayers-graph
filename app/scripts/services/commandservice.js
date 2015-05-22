(function() {
  'use strict';

  angular.module('iLayers')
    .factory('commandService', CommandService);

  CommandService.$inject = ['$rootScope'];

  function CommandService($rootScope) {
    var locked;

    return {
        highlight: function (layers, force) {
          /*jshint camelcase: false */
          var cmds = [];
          for(var i=0; i < layers.length; i++) {
            var cmd = layers[i].container_config.Cmd,
                size = layers[i].Size || 0,
                txt = (cmd) ? cmd.join(' ') : null;
              cmds.push(this.constructCommand(txt, size));
          }

          if (locked === undefined || force === true) {
            $rootScope.$broadcast('command-change', { 'commands': cmds });
          }
        },

        constructCommand: function (cmd, size) {
          var nop = '(nop) ';

          if (cmd === null || cmd == '') { // jshint ignore:line
            if (size > 0) {
              cmd = 'unknown instruction';
            } else {
              cmd = 'FROM scratch';
            }
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
  }
})();
