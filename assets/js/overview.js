let dependencies = {};
dependencies['gauges'] = require('../assets/js/gauge.min.js');

$(document).ready(function() {
  
  for(const moduleSorted of modulesSort) {
    const moduleName = moduleSorted[0];
    const column = settings.overview[moduleName].column;
    $(".sortable-column:nth-child(" + column + ")").append(jsClasses[moduleName].placeholder());
    if ('deps' in jsClasses[moduleName].settings) {
      const dep =jsClasses[moduleName].settings.deps;
      jsClasses[moduleName].dependencies(dep, dependencies[dep]);
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
