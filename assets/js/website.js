
var cpuStats = require('./assets/js/cpu_stats.js');
var cpuCores = cpuStats.totalCores();

function cpuUsage(err, percent, seconds, coreIndex) {
  if (err) {
    return console.log(err);
  }

  console.log(coreIndex);
  console.log(percent);
  console.log(seconds);
  $(".gauge_" + coreIndex + " .value").text(Math.ceil(percent) + "%");
  cpuStats.usagePercent({coreIndex: coreIndex, sampleMs: 2000}, cpuUsage);
}



$(document).ready(function() {
  //console.log( "ready!" );
    
  for (const x of Array(cpuCores).keys()) {
    $(".gauge.template").clone().appendTo("#cpu_stats");
    $("#cpu_stats .gauge:last-child").removeClass("template");
    $("#cpu_stats .gauge:last-child").addClass("gauge_" + x);
//     $("#cpu_stats .gauge:last-child").addClass("col-sm");
    $("#cpu_stats .gauge:last-child").show();
    cpuStats.usagePercent({coreIndex: x, sampleMs: 2000}, cpuUsage);
  }
    
});