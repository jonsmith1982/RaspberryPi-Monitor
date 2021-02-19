const gauges = require('../assets/js/gauge.min.js');

$(document).ready(function() {
  
  for(const moduleName of Object.keys(jsClasses)) {
    const column = settings.overview[moduleName].column;
    const row = settings.overview[moduleName].row;
    if (row === 1) {
      $(".sortable-column:nth-child(" + column + ")").prepend(jsClasses[moduleName].placeholder());
    } else if (row > 1 && row <= $(".sortable-column:nth-child(" + column + ") section").length) {
      $(".sortable-column:nth-child(" + column + ") section:nth-child(" + row + ")").before(jsClasses[moduleName].placeholder());
    } else {
      $(".sortable-column:nth-child(" + column + ")").append(jsClasses[moduleName].placeholder());
    }
    if ('deps' in jsClasses[moduleName].settings) {
      if (jsClasses[moduleName].settings.deps === 'gauges')
        jsClasses[moduleName].dependencies('gauges', gauges);
    }
    jsClasses[moduleName].initialise();
  }
  
  $(".sortable-column").sortable({
    connectWith: ['.sortable-column'],
    tolerance: 'intersect',
    revert: true,
    item: 'section',
    cursor: 'move',
    forceHelperSize: true,
    stop: function(event, ui) {
      $(".sortable-column").each(function(ia) {
        $(this).children('section').each(function(ib) {
          settings.overview[this.id].column = ia + 1;
          settings.overview[this.id].row = ib + 1;
        });
      });
      settings = updateSettings(settings);
    }
  });
});
