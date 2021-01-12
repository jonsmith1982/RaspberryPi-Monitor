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
    const sent = Math.round(piMonitor.bytesTo(netInfo[x].bytes.transmit) * 100) / 100;
    const received = Math.round(piMonitor.bytesTo(netInfo[x].bytes.transmit) * 100) / 100;
    let iFace = '<li class="list-group-item"><strong>Sent:</strong> ' + sent + 'GiB</li><li class="list-group-item"><strong>Received:</strong> ' + received + 'GiB</li>';
    if ($("#iface_" + x).length) {
      $("#iface_" + x).html(iFace);
    } else {
      iFace = '<code>' + x + '</code><ul id="iface_' + x + '" class="list-group tiny mb-3">' + iFace + '</ul>';
      $("#network").append(iFace);
    }
  }
  setTimeout(networkInfo, timeOut);
}

function diskInfo() {
  const disks = piMonitor.diskInfo();
  $("#part_graphs, #hdd_graphs").html('');
  for (const x of Object.keys(disks)) {
    if (disks[x].type === 'disk') {
      let total = Math.round(piMonitor.bytesTo(disks[x].size) * 100) / 100;
      let hd = '<div id="disk_' + x + '"><strong class="tiny">Device:</strong> <code>' + disks[x].path + '</code><label id="' + x + '_label" class="tiny"><strong>Used:</strong> 0GiB <strong>Available:</strong> 0.57GiB of ' + total + 'GiB</label><div class="progress mb-3" style="height:20px;"><div id="' + x + '_gauge" class="progress-bar progress-bar-striped" role="progressbar" style="width: 30%;" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">30%</div></div></div>';
      $("#hdd_graphs").append(hd);
    }
    else if (disks[x].type === 'part') {
      if (disks[x].mountpoint !== '[SWAP]') {
        let total = Math.round(piMonitor.bytesTo(disks[x].size) * 100) / 100;
        let available = Math.round(piMonitor.bytesTo(disks[x].size - disks[x].fsused) * 100) / 100;
        let used = Math.round(piMonitor.bytesTo(disks[x].fsused) * 100) / 100;
        let percent = Math.ceil(((disks[x].size - disks[x].fsused) / disks[x].size) * 100);
        let part = '<div id="part_' + x + '"><strong class="tiny">Mount Point:</strong> <code>' + disks[x].mountpoint + '</code><label id="' + x + '_label" class="tiny"><strong>Used:</strong> ' + used + 'GiB <strong>Available:</strong> ' + available + 'GiB of ' + total + 'GiB</label><div class="progress mb-3" style="height:20px;"><div id="' + x + '_gauge" class="progress-bar progress-bar-striped" role="progressbar" style="width: ' + percent + '%;" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100">' + percent + '%</div></div></div>';
        $("#part_graphs").append(part);
      }
    }
  }
  setTimeout(diskInfo, timeOut);
}

$(document).ready(function() {
  
  versionInfo();
  uptimeInfo();
  networkInfo();
  diskInfo();

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
