const gauges = require('../assets/js/gauge.min.js');
const piMonitor = require('../assets/js/raspberrypi_monitor.js');
const cpuCores = piMonitor.totalCores();

const li = function(l, v, c = false) {
  let label = l !== null ? '<strong>' + l + ':</strong> ' : ''
  let value = c ? '<code>' + v + '</code>' : v;
  return('<li class="list-group-item">' + label +  value + '</li>');
};

const progress = function(s, n, l, c, u, a, t, p) {
  let code = c !== null ? '<strong class="tiny">' + l + ':</strong> <code>' + c + '</code>' : '';
  return('<div id="' + s + '_' + n + '">' + code + '<label id="' + n + '_label" class="tiny"><strong>Used:</strong> ' + u + 'GiB <strong>Available:</strong> ' + a + 'GiB of ' + t + 'GiB</label><div class="progress mb-3" style="height:20px;"><div id="' + n + '_gauge" class="progress-bar progress-bar-striped" role="progressbar" style="width: ' + p + '%;" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100">' + p + '%</div></div></div>');
};

function cpuUsage(percent, seconds, coreIndex) {
  let cpuPercent = Math.ceil(percent);
  piMonitor.processStorage('cpu_stats_' + coreIndex, cpuPercent);
  document.gauges[coreIndex].value = percent;
  piMonitor.corePercent(coreIndex, piMonitor.timeOut, cpuUsage);
}

function memoryStatistics() {
  let statistics = piMonitor.memoryStatistics();
  ['mem', 'swap'].forEach(function (t) {
    let percent = Math.ceil(statistics[`${t}UsedPercent`]);
    let used = Math.round((statistics[`${t}Total`] * (statistics[`${t}UsedPercent`] / 100)) * 100) / 100;
    let free = Math.round(statistics[`${t}Free`] * 100) / 100;
    let total = Math.round(statistics[`${t}Total`] * 100) / 100;
    piMonitor.processStorage(t + '_stats', percent);
    $("#" + t + "_graphs").html(progress(t, t, null, null, used, free, total, percent));
  });
  setTimeout(memoryStatistics, piMonitor.timeOut);
}

function cpuTemperature() {
  let temperature = piMonitor.cpuTemp();
  piMonitor.processStorage('cpu_temp', temperature);
  document.gauges[cpuCores].value = temperature;
  setTimeout(cpuTemperature, piMonitor.timeOut);
}

function versionInfo() {
  let hInfo = piMonitor.hardwareInfo();
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
  $("#uptime-info").html(li(null, uptime));
  setTimeout(uptimeInfo, piMonitor.timeOut);
}

function networkInfo() {
  const netInfo = piMonitor.networkInfo();
  const iFaces = Object.keys(netInfo);
  for (const x of iFaces) {
    const sent = Math.round(piMonitor.bytesTo(netInfo[x].bytes.transmit) * 100) / 100;
    const received = Math.round(piMonitor.bytesTo(netInfo[x].bytes.transmit) * 100) / 100;
    let iFace = li('Sent', sent + 'GiB') + li('Received', received + 'GiB');
    if ($("#iface_" + x).length) {
      $("#iface_" + x).html(iFace);
    } else {
      iFace = '<code>' + x + '</code><ul id="iface_' + x + '" class="list-group tiny mb-3">' + iFace + '</ul>';
      $("#network-info").append(iFace);
    }
  }
  setTimeout(networkInfo, piMonitor.timeOut);
}

function diskInfo() {
  const disks = piMonitor.diskInfo();
  $("#part_graphs, #hdd_graphs").html('');
  for (const x of Object.keys(disks)) {
    if (disks[x].type === 'disk') {
      let total = Math.round(piMonitor.bytesTo(disks[x].size) * 100) / 100;
      let html = '<ul id="disk_' + x + '" class="list-group tiny">' + li('Device', disks[x].path, true) + li('Size', total + 'GiB', true) + li('Owner/Group', disks[x].owner + '/' + disks[x].group, true) + '</ul>';
      $("#hdd_graphs").append(html);
    }
    else if (disks[x].type === 'part') {
      if (disks[x].mountpoint !== '[SWAP]') {
        let total = Math.round(piMonitor.bytesTo(disks[x].size) * 100) / 100;
        let available = Math.round(piMonitor.bytesTo(disks[x].size - disks[x].fsused) * 100) / 100;
        let used = Math.round(piMonitor.bytesTo(disks[x].fsused) * 100) / 100;
        let percent = Math.ceil(((disks[x].size - disks[x].fsused) / disks[x].size) * 100);
        let part = progress('part', x, 'Mount Point', disks[x].mountpoint, used, available, total, percent);
        $("#part_graphs").append(part);
      }
    }
  }
  setTimeout(diskInfo, piMonitor.timeOut);
}

function wifiInfo() {
  const conn = piMonitor.wifiInfo();
  const ssid = Object.keys(conn);
  if (ssid.length === 0) {
    $("#wifi_graphs").html('<div class="tiny">No wifi connections in progress</div>');
  } else {
    $("#wifi_graphs").html('<ul class="list-group tiny">' + li(conn[ssid[0]].device, ssid[0], true) + '</ul>');
  }
  setTimeout(wifiInfo, piMonitor.timeOut);
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
    piMonitor.corePercent(x, piMonitor.timeOut, cpuUsage);
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
  diskInfo();
  wifiInfo();
  
  $("section").removeClass('d-none');
  
});
