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

$(document).ready(function() {
  $.plot("#placeholder", cpuDataSet());
});
