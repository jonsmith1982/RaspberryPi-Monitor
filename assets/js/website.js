var gauges = require('./assets/js/gauge.min.js');
var cpuStats = require('./assets/js/cpu_stats.js');
var cpuCores = cpuStats.totalCores();
var memInfo = require('./assets/js/memory_statistics.js');
var piRevisions = require('./assets/js/raspberrypi-revisions.js');

const fs = require('fs');

var timeOut = 1000;
var historyCount = 100;

var sessionStorage = window.sessionStorage;

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

var cpuGaugeOptions = {
  width: 75,
  height: 75,
  units: null,
  startAngle: 60,
  ticksAngle: 240,
  value: 0,
  minValue: 0,
  maxValue: 100,
  colorTitle: '#333',
  colorPlate: 'transparent',
  colorMajorTicks: 'transparent',
  colorMinorTicks: 'transparent',
  colorNumbers: 'transparent',
  colorValueBoxBackground: 'transparent',
  colorBarStroke: '#eee',
  barStrokeWidth: 1,
  highlights: [],
  valueBox: true,
  valueBoxStroke: 0,
  valueTextShadow: false,
  borders: false,
  needle: false,
  barWidth: 35,
  barShadow: 0,
  colorBarProgress: 'rgba(50,200,50,.75)',
  animationRule: 'quad',
  animationDuration: 500
};

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
  let statistics = memInfo.statistics("GiB");
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
  let data = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp');
  let temperature = data/1000;
  processStorage('cpu_temp', temperature);
  document.gauges[cpuCores].value = temperature;
  setTimeout(cpuTemperature, timeOut);
}

$(document).ready(function() {

  for (const x of Array(cpuCores).keys()) {
    gaugeOptions = cpuGaugeOptions;
    gaugeOptions.title = 'CPU' + x;
    gaugeOptions.renderTo = 'cpu_gauge_' + x;
    $('#cpu_graphs').append('<div class="col-3 col-md-6 col-lg-3 text-center"><canvas id="cpu_gauge_' + x + '" ></canvas></div>');
    new gauges.RadialGauge(gaugeOptions).draw(); 
    cpuStats.usagePercent({coreIndex: x, sampleMs: timeOut}, cpuUsage);
  }
  
  tempGaugeOptions = cpuGaugeOptions;
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
