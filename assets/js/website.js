
var cpuStats = require('./assets/js/cpu_stats.js');
var cpuCores = cpuStats.totalCores();

var sessionStorage = window.sessionStorage;

function cpuUsage(err, percent, seconds, coreIndex) {
  if (err) {
    return console.log(err);
  }
  
  // Store data for each cpu here so we can show it in a large line graph 
  let cpuPercent = Math.ceil(percent);
  let coreStats = sessionStorage.getItem("cpu_stats_" + coreIndex);
  coreStats = !Array.isArray(coreStats) ? [coreStats] : coreStats;
  // Find out how many stats to hold for each core and clean up excess data as we go along.
  coreStats.push(cpuPercent);
  sessionStorage.setItem("cpu_stats_" + coreIndex, coreStats);
  $(".gauge_" + coreIndex + " .value").text(cpuPercent + "%");
  $(".gauge_" + coreIndex).css({ "--rotation": 180 * (cpuPercent / 100) + "deg"});
  cpuStats.usagePercent({coreIndex: coreIndex, sampleMs: 1000}, cpuUsage);
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