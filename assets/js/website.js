
var cpuStats = require('./assets/js/cpu_stats.js');
var cpuCores = cpuStats.totalCores();
var memStats = require('./assets/js/mem_stats.js');

const fs = require('fs');

var timeOut = 1000;
var historyCount = 100;

var sessionStorage = window.sessionStorage;

const ceil = (integer) => {return Math.ceil(integer)}

function cpuUsage(err, percent, seconds, coreIndex) {
  if (err) {
    return console.log(err);
  }
  
  // Store data for each cpu here so we can show it in a large line graph 
  let cpuPercent = Math.ceil(percent);
  let coreStats = sessionStorage.getItem("cpu_stats_" + coreIndex) ? 
    sessionStorage.getItem("cpu_stats_" + coreIndex) : '';
  coreStats = !Array.isArray(coreStats) ? coreStats.split(',') : coreStats;
  // Find out how many stats to hold for each core and clean up excess data as we go along.
  coreStats.push(cpuPercent);
  if (coreStats.length >= historyCount)
    coreStats.shift();
  sessionStorage.setItem("cpu_stats_" + coreIndex, coreStats);
  $(".gauge_" + coreIndex + " .value").text(cpuPercent + "%");
  $(".gauge_" + coreIndex).css({ "--rotation": 180 * (cpuPercent / 100) + "deg"});
 cpuStats.usagePercent({coreIndex: coreIndex, sampleMs: timeOut}, cpuUsage);
}

function memUsage(previousPercent = null) {
  let memStatsAll = memStats.allStats("GiB");
  let usedPercent = ceil(memStatsAll.usedPercent);
  let ramStats = sessionStorage.getItem("mem_stats") ? 
    sessionStorage.getItem("mem_stats") : '';
  ramStats = !Array.isArray(ramStats) ? ramStats.split(',') : ramStats;
  // Find out how many stats to hold for ram clean up excess data as we go along.
  ramStats.push(usedPercent);
  if (ramStats.length >= historyCount)
    ramStats.shift();
  sessionStorage.setItem("mem_stats", ramStats);
  if (previousPercent === null || previousPercent !== usedPercent) {
    $("meter#memory").val(usedPercent);
  }
  setTimeout(memUsage, timeOut, usedPercent); // issue here memory seems to be going up gradually (maybe?)
}


function cpuTemperature() {
  fs.readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8' , (err, data) => {
    if (err) {
      return console.log(err);
    }
  
    let temperature = data/1000;
    let cpuTemp = sessionStorage.getItem("cpu_temp") ? 
      sessionStorage.getItem("cpu_temp") : '';
    cpuTemp = !Array.isArray(cpuTemp) ? cpuTemp.split(',') : cpuTemp;
    // Find out how many stats to hold for cpu temp clean up excess data as we go along.
    cpuTemp.push(temperature);
    if (cpuTemp.length >= historyCount)
      cpuTemp.shift();
    sessionStorage.setItem("cpu_temp", cpuTemp);
  
    console.log(temperature + ' degrees Celcius');
  });
  setTimeout(cpuTemperature, timeOut);
}

$(document).ready(function() {
    
  for (const x of Array(cpuCores).keys()) {
    $(".gauge.template").clone().appendTo("#cpu_stats");
    $("#cpu_stats .gauge:last-child").removeClass("template");
    $("#cpu_stats .gauge:last-child").addClass("gauge_" + x + " col-xs");
    $("#cpu_stats .gauge:last-child").show();
    cpuStats.usagePercent({coreIndex: x, sampleMs: timeOut}, cpuUsage);
  }
  
  memUsage();
  cpuTemperature();
  
});