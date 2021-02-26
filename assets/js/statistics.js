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
  
});
