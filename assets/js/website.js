var gauges = require('./assets/js/gauge.min.js');
var cpuStats = require('./assets/js/cpu_stats.js');
var cpuCores = cpuStats.totalCores();
var memStats = require('./assets/js/mem_stats.js');

const fs = require('fs');
const os = require('os');

var timeOut = 1000;
var historyCount = 100;

var sessionStorage = window.sessionStorage;

const ceil = (integer) => {return Math.ceil(integer)}

var cpuGaugeOptions = {
  width: 140,
  height: 140,
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
  let cpuPercent = Math.ceil(percent);
  let coreStats = sessionStorage.getItem("cpu_stats_" + coreIndex) ? 
    sessionStorage.getItem("cpu_stats_" + coreIndex) : '';
  coreStats = !Array.isArray(coreStats) ? coreStats.split(',') : coreStats;
  coreStats.push(cpuPercent);
  if (coreStats.length >= historyCount)
    coreStats.shift();
  sessionStorage.setItem("cpu_stats_" + coreIndex, coreStats);
  document.gauges[coreIndex].value = cpuPercent;
  cpuStats.usagePercent({coreIndex: coreIndex, sampleMs: timeOut}, cpuUsage);
}

function memUsage(previousPercent = null) {
  let memStatsAll = memStats.allStats("GiB");
  let usedPercent = ceil(memStatsAll.usedPercent);
  let ramStats = sessionStorage.getItem("mem_stats") ? 
    sessionStorage.getItem("mem_stats") : '';
  ramStats = !Array.isArray(ramStats) ? ramStats.split(',') : ramStats;
  ramStats.push(usedPercent);
  if (ramStats.length >= historyCount)
    ramStats.shift();
  sessionStorage.setItem("mem_stats", ramStats);
  if (previousPercent === null || previousPercent !== usedPercent) {
    $("meter#memory").val(usedPercent);
  }
  setTimeout(memUsage, timeOut, usedPercent);
}

var tempGaugeOptions = {
    renderTo: 'temp_gauge',
    width: 100,
    height: 130,
    minValue: 0,
    startAngle: 90,
    ticksAngle: 180,
    valueBox: false,
    maxValue: 80,
    majorTicks: ["0", "40", "80"],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [],
    colorPlate: "transparent",
    colorBarEnd: '#aaa',
    colorBarStroke: '#eee',
    colorMajorTicks: '#666',
    colorMinorTicks: '#666',
    colorNumbers: '#666',
    borderShadowWidth: 12,
    borders: true,
    needleType: "arrow",
    needleWidth: 2,
    animationDuration: 500,
    animationRule: "quad",
    barWidth: 17,
    barStrokeWidth:/* */1,
    colorBarProgress: 'rgba(50,50,200,0.75)',
    tickSide: "left",
    numberSide: "left",
    needleSide: "left",
    value: 35
};

function cpuTemperature() {
  fs.readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8' , (err, data) => {
    if (err) {
      return console.log(err);
    }
    let temperature = data/1000;
    let cpuTemp = sessionStorage.getItem("cpu_temp") ? 
      sessionStorage.getItem("cpu_temp") : '';
    cpuTemp = !Array.isArray(cpuTemp) ? cpuTemp.split(',') : cpuTemp;
    cpuTemp.push(temperature);
    if (cpuTemp.length >= historyCount)
      cpuTemp.shift();
    sessionStorage.setItem("cpu_temp", cpuTemp);
    document.gauges[cpuCores].value = temperature;
  });
  setTimeout(cpuTemperature, timeOut);
}

$(document).ready(function() {

  for (const x of Array(cpuCores).keys()) {
    let title = 'CPU' + x;
    let renderTo = 'cpu_gauge_' + x;
    gaugeOptions = cpuGaugeOptions;
    gaugeOptions.title = title;
    gaugeOptions.renderTo = renderTo;
    $('#cpu_graphs').append('<canvas id="' + renderTo + '"></canvas>');
    new gauges.RadialGauge(gaugeOptions).draw(); 
    cpuStats.usagePercent({coreIndex: x, sampleMs: timeOut}, cpuUsage);
  }
  
  $("#cpu_graphs").append('<canvas id="temp_gauge"></canvas>');
  new gauges.LinearGauge(tempGaugeOptions).draw();
  cpuTemperature();
  
  memUsage();
  
});
