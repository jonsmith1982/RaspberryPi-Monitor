var gauges = require('./assets/js/gauge.min.js');
var cpuStats = require('./assets/js/cpu_stats.js');
var cpuCores = cpuStats.totalCores();
var memStats = require('./assets/js/mem_stats.js');
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

function memUsage(previousPercent = null) {
  let memStatsAll = memStats.allStats("GiB");
  let usedPercent = ceil(memStatsAll.usedPercent);
  let usedGB = round((memStatsAll.total * (memStatsAll.usedPercent / 100)) * 100) / 100;
  let freeGB = round(memStatsAll.free * 100) / 100;
  let totalGB = round(memStatsAll.total * 100) / 100;
  $("#mem_label").html("<strong>Used:</strong> " + usedGB + "GiB <strong>Available:</strong> " + freeGB + "GiB of " + totalGB + "GiB");
  $("#swap_label").html("<strong>Used:</strong> " + usedGB + "GiB <strong>Available:</strong> " + freeGB + "GiB of " + totalGB + "GiB");
  processStorage('mem_stats', usedPercent);
  if (previousPercent === null || previousPercent !== usedPercent) {
    $("#mem_gauge").css("width", usedPercent + "%");
    $("#mem_gauge").text(usedPercent + "%");
    $("#mem_gauge").attr("aria-valuenow", usedPercent);
    $("#swap_gauge").css("width", usedPercent + "%");
    $("#swap_gauge").text(usedPercent + "%");
    $("#swap_gauge").attr("aria-valuenow", usedPercent);
  }
  setTimeout(memUsage, timeOut, usedPercent);
}

function cpuTemperature() {
  fs.readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8' , (err, data) => {
    if (err) {
      return console.log(err);
    }
    let temperature = data/1000;
    processStorage('cpu_temp', temperature);
    document.gauges[cpuCores].value = temperature;
  });
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
  
  memUsage();
  
});
