const gauges = require('./assets/js/gauge.min.js');
const cpuStats = require('./assets/js/cpu_stats.js');
const cpuCores = cpuStats.totalCores();
const piMonitor = require('./assets/js/raspberrypi_monitor.js');

let timeOut = 1000;
let historyCount = 100;

const sessionStorage = window.sessionStorage;

function processStorage(key, value) {
  let storage = sessionStorage.getItem(key) ? sessionStorage.getItem(key) : '';
  storage = !Array.isArray(storage) ? storage.split(',') : storage;
  storage.push(value);
  if (storage.length >= historyCount)
    storage.shift();
  sessionStorage.setItem(key, storage);
}

const ceil = (integer) => {return Math.ceil(integer)}
const round = (integer) => {return Math.round(integer)}

function cpuUsage(err, percent, seconds, coreIndex) {
  if (err) {
    return console.log(err);
  }
  let cpuPercent = ceil(percent);
  processStorage('cpu_stats_' + coreIndex, cpuPercent);
  document.gauges[coreIndex].value = percent;
  cpuStats.usagePercent({coreIndex: coreIndex, sampleMs: timeOut}, cpuUsage);
}

function memoryStatistics() {
  let statistics = piMonitor.memoryStatistics();
  ['mem', 'swap'].forEach(function (t) {
    let usedPercent = ceil(statistics[`${t}UsedPercent`]);
    let usedGB = round((statistics[`${t}Total`] * (statistics[`${t}UsedPercent`] / 100)) * 100) / 100;
    let freeGB = round(statistics[`${t}Free`] * 100) / 100;
    let totalGB = round(statistics[`${t}Total`] * 100) / 100;
    $("#" + t + "_label").html(`<strong>Used:</strong> ${usedGB}GiB <strong>Available:</strong> ${freeGB}GiB of ${totalGB}GiB`);
    processStorage(t + '_stats', usedPercent);
    $("#" + t + "_gauge").css("width", usedPercent + "%");
    $("#" + t + "_gauge").text(usedPercent + "%");
    $("#" + t + "_gauge").attr("aria-valuenow", usedPercent);
  });
  setTimeout(memoryStatistics, timeOut);
}

function cpuTemperature() {
  let temperature = piMonitor.cpuTemp();
  processStorage('cpu_temp', temperature);
  document.gauges[cpuCores].value = temperature;
  setTimeout(cpuTemperature, timeOut);
}

$(document).ready(function() {

  for (const x of Array(cpuCores).keys()) {
    let cpuGaugeOptions = piMonitor.gaugeOptions;
    cpuGaugeOptions.title = 'CPU' + x;
    cpuGaugeOptions.renderTo = 'cpu_gauge_' + x;
    $('#cpu_graphs').append('<div class="col-3 col-md-6 col-lg-3 text-center"><canvas id="cpu_gauge_' + x + '" ></canvas></div>');
    new gauges.RadialGauge(cpuGaugeOptions).draw(); 
    cpuStats.usagePercent({coreIndex: x, sampleMs: timeOut}, cpuUsage);
  }
  
  let tempGaugeOptions = piMonitor.gaugeOptions;
  tempGaugeOptions.width = 120;
  tempGaugeOptions.height = 120;
  tempGaugeOptions.maxValue = 80;
  tempGaugeOptions.title = 'CPU Temp';
  tempGaugeOptions.renderTo = 'temp_gauge';
  tempGaugeOptions.colorBarProgress = 'rgba(255,0,0,.5)';
  new gauges.RadialGauge(tempGaugeOptions).draw(); 
  cpuTemperature();
  
  memoryStatistics();
  
});
