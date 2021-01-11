const gauges = require('./assets/js/gauge.min.js');
const piMonitor = require('./assets/js/raspberrypi_monitor.js');
const cpuCores = piMonitor.totalCores();

let timeOut = 1000;
let historyCount = 100;

function cpuUsage(percent, seconds, coreIndex) {
  let cpuPercent = Math.ceil(percent);
  piMonitor.processStorage('cpu_stats_' + coreIndex, cpuPercent);
  document.gauges[coreIndex].value = percent;
  piMonitor.corePercent(coreIndex, timeOut, cpuUsage);
}

function memoryStatistics() {
  let statistics = piMonitor.memoryStatistics();
  ['mem', 'swap'].forEach(function (t) {
    let usedPercent = Math.ceil(statistics[`${t}UsedPercent`]);
    let usedGB = Math.round((statistics[`${t}Total`] * (statistics[`${t}UsedPercent`] / 100)) * 100) / 100;
    let freeGB = Math.round(statistics[`${t}Free`] * 100) / 100;
    let totalGB = Math.round(statistics[`${t}Total`] * 100) / 100;
    $("#" + t + "_label").html(`<strong>Used:</strong> ${usedGB}GiB <strong>Available:</strong> ${freeGB}GiB of ${totalGB}GiB`);
    piMonitor.processStorage(t + '_stats', usedPercent);
    $("#" + t + "_gauge").css("width", usedPercent + "%");
    $("#" + t + "_gauge").text(usedPercent + "%");
    $("#" + t + "_gauge").attr("aria-valuenow", usedPercent);
  });
  setTimeout(memoryStatistics, timeOut);
}

function cpuTemperature() {
  let temperature = piMonitor.cpuTemp();
  piMonitor.processStorage('cpu_temp', temperature);
  document.gauges[cpuCores].value = temperature;
  setTimeout(cpuTemperature, timeOut);
}

function versionInfo() {
  let hInfo = piMonitor.hardwareInfo();
  let li = function(label, value) {return(`<li class="list-group-item"><strong>${label}:</strong> ${value}</li>`)};
  $("#version_info").append(li('Chipset', hInfo.hardware));
  if (hInfo.revision in piMonitor.revisions) {
    let rInfo = piMonitor.revisions[hInfo.revision];
    $("#version_info").append(li('Manufacturer', rInfo[4]));
    $("#version_info").append(li('Model', rInfo[1] + ' (' + rInfo[3] + ')'));
    $("#version_info").append(li('Revision', rInfo[2]));
  }
  //$("#version_info").append(li('Serial No', hInfo.serial));
  $("#version_info").append(li('Serial No', '0000000000000'));
}

function uptimeInfo() {
  let uptime = piMonitor.uptimeInfo();
  $("#uptime").html('<li class="list-group-item">' + uptime + '</li>');
  setTimeout(uptimeInfo, timeOut);
}

function networkInfo() {
  const netInfo = piMonitor.networkInfo();
  const iFaces = Object.keys(netInfo);
  for (const x of iFaces) {
    if ($("#iface_" + x).length) {
      let iFace = '<li class="list-group-item"><strong>Sent:</strong> ' + netInfo[x].bytes.transmit + '</li><li class="list-group-item"><strong>Received:</strong> ' + netInfo[x].bytes.receive + '</li>';
      $("#iface_" + x).html(iFace);
    } else {
      let iFace = '<h3>' + x + '</h3><ul id="iface_' + x + '" class="list-group tiny mb-3"><li class="list-group-item"><strong>Sent:</strong> ' + netInfo[x].bytes.transmit + '</li><li class="list-group-item"><strong>Received:</strong> ' + netInfo[x].bytes.receive + '</li></ul>';
      $("#network").append(iFace);
    }
  }
  setTimeout(networkInfo, timeOut);
}

$(document).ready(function() {
  
  versionInfo();
  uptimeInfo();
  networkInfo();

  for (const x of Array(cpuCores).keys()) {
    let cpuGaugeOptions = piMonitor.gaugeOptions;
    cpuGaugeOptions.title = 'CPU' + x;
    cpuGaugeOptions.renderTo = 'cpu_gauge_' + x;
    $('#cpu_graphs').append('<div class="col-3 col-md-6 col-lg-3 text-center"><canvas id="cpu_gauge_' + x + '" ></canvas></div>');
    new gauges.RadialGauge(cpuGaugeOptions).draw(); 
    piMonitor.corePercent(x, timeOut, cpuUsage);
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
