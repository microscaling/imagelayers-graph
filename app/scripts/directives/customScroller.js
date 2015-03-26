'use strict';

angular.module('iLayers')
  .directive('customScroller', function () {

    var applyVerticalScrollbar = function(element, theme) {
      var container = null;
      element.mCustomScrollbar({
          theme: theme,
          mouseWheel: false,
          scrollButtons: {
            enable: false
          },
          axis: 'xy',
          setWidth: '100%',
          autoScrollOnFocus: false,
          advanced: {
            autoScrollOnFocus: false,
            autoExpandHorizontalScroll: true,
            updateOnContentResize: true
          },
          callbacks: {
            whileScrolling: function() {
              console.log('scroll: ', this);
            }
          }
       });

       //container = element.children('.mCSB_horizontal').first().children('.mCSB_container');
       //container.css({"position":"absolute","width":"auto"});
       //container.css({"height": "100%"}).children('.mCSB_draggerContainer').css({'margin-top': '0px'});
    };

    var applyScrollbars = function(element) {
        var container = null;
        element.mCustomScrollbar({
           theme: theme,
           mouseWheel: false,
           scrollButtons: {
               enable: false
           },
           autoScrollOnFocus: false,
           horizontalScroll:true,
           advanced: {
                autoScrollOnFocus: false,
                autoExpandHorizontalScroll:false,
                updateOnContentResize: true
           },
           contentTouchScroll: false,
           callbacks: {
               onScroll: function() {
                   console.log('scroll: ', msc);
               }
           }
        });
        container = element.children('.mCSB_horizontal').first().children('.mCSB_container');
        container.css({"position":"absolute","width":"auto"});
        container.css({"height": "100%"}).children('.mCSB_draggerContainer').css({'margin-top': '0px'});
    };

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var theme = (attrs.theme) ? attrs.theme : 'dark';
        //if (attrs.horizontal !== undefined) {
            applyVerticalScrollbar(element, theme);
        //} else {
        //    applyVerticalScrollbar(element);
       // }
      }
    };
  });
