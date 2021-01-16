const piMonitor = require('../assets/js/raspberrypi_monitor.js');
const cpuCores = piMonitor.totalCores();

function cpuGraphData() {
  let data = [];
  for (const x of Array(cpuCores).keys()) {
    data.push(piMonitor.graphStorage('cpu_stats_' + x));
  }
  return(data);
}

function tempGraphData() {
  let data = [piMonitor.graphStorage('cpu_temp')];
  return(data);
}

function memGraphData() {
  let data = [piMonitor.graphStorage('mem_stats'), piMonitor.graphStorage('swap_stats')];
  return(data);
}

$(document).ready(function() {
  $.plot("#cpu_usage_graph", cpuGraphData());
  $.plot("#cpu_temp_graph", tempGraphData());
  $.plot("#mem_usage_graph", memGraphData());
});
