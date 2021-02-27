$(document).ready(function() {
  
  for(const moduleSorted of modulesSort) {
    const moduleName = moduleSorted[0];
    $(".sortable-column").append(jsClasses[moduleName].placeholder());
    jsClasses[moduleName].initialise();
  }

  $(window).resize(function() {
    for(const moduleSorted of modulesSort) {
      jsClasses[moduleSorted[0]].graphResize();
    }
  });
  
  $(".sortable-column").sortable({
    tolerance: 'intersect',
    revert: true,
    item: 'section',
    cursor: 'move',
    forceHelperSize: true,
    stop: function(event, ui) {
      $(this).children('section').each(function(ib) {
        settings.statistics[this.id].row = ib + 1;
      });
      settings = updateSettings(settings);
    }
  });
});
