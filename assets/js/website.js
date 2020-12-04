
var cpuStats = require('./assets/js/cpu_stats.js');
var cpuCores = cpuStats.totalCores();

function cpuUsage(err, percent, seconds, coreIndex) {
  if (err) {
    return console.log(err);
  }
  
  // Store data for each cpu here so we can show it in a large line graph 
  let cpuPercent = Math.ceil(percent);
  $(".gauge_" + coreIndex + " .value").text(cpuPercent + "%");
  $(".gauge_" + coreIndex).css({ "--rotation": 180 * (cpuPercent / 100) + "deg"});
  cpuStats.usagePercent({coreIndex: coreIndex, sampleMs: 2000}, cpuUsage);
}

$(document).ready(function() {
    
  for (const x of Array(cpuCores).keys()) {
    $(".gauge.template").clone().appendTo("#cpu_stats");
    $("#cpu_stats .gauge:last-child").removeClass("template");
    $("#cpu_stats .gauge:last-child").addClass("gauge_" + x + " col-xs");
    $("#cpu_stats .gauge:last-child").show();
    cpuStats.usagePercent({coreIndex: x, sampleMs: 1000}, cpuUsage);
  }
    
});