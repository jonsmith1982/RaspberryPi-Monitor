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

let options = {
  yaxis: {
    autoScale: "none",
    min: 0,
    max: 100,
    tickDecimals: 0,
    font: {
      size: 11,
      lineHeight: 13,
      style: "italic",
      weight: "bold",
      family: "sans-serif",
      variant: "small-caps",
      color: "#545454"
    }
  },
  xaxis: {
    show: true
  },
  series: {
    lines: {
      show: true,
      lineWidth: 2,
      fill: false
    },
    points: {
      show: false
    }
  }
};

$(document).ready(function() {
  $.plot("#cpu_usage_graph", cpuGraphData(), options);
  $.plot("#cpu_temp_graph", tempGraphData(), options);
  $.plot("#mem_usage_graph", memGraphData(), options);
});
