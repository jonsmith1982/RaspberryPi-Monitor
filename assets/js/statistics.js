const piMonitor = require('../assets/js/raspberrypi_monitor.js');
const cpuCores = piMonitor.totalCores();

function cpuDataSet() {
  let data = [];
  for (const x of Array(cpuCores).keys()) {
    let coreData = piMonitor.graphStorage('cpu_stats_' + x);
    data.push(coreData);
  }
  return(data);
}

function tempDataSet() {
  let data = [piMonitor.graphStorage('cpu_temp')];
  return(data);
}

function memDataSet() {
  let data = [piMonitor.graphStorage('mem_stats'), piMonitor.graphStorage('swap_stats')];
  return(data);
}

$(document).ready(function() {
  $.plot("#cpu_usage_graph", cpuDataSet());
  $.plot("#cpu_temp_graph", tempDataSet());
  $.plot("#mem_usage_graph", memDataSet());
});
