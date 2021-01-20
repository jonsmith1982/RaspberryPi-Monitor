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
    show: false,
    autoScale: "none",
    min: 0,
    max: piMonitor.historyCount - 2
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

function cpuUsage(percent, seconds, coreIndex) {
  let cpuPercent = Math.ceil(percent);
  piMonitor.processStorage('cpu_stats_' + coreIndex, cpuPercent);
  piMonitor.corePercent(coreIndex, piMonitor.timeOut, cpuUsage);
}

function memoryStatistics() {
  let statistics = piMonitor.memoryStatistics();
  ['mem', 'swap'].forEach(function (t) {
    let percent = Math.ceil(statistics[`${t}UsedPercent`]);
    piMonitor.processStorage(t + '_stats', percent);
  });
  setTimeout(memoryStatistics, piMonitor.timeOut);
}

function cpuTemperature() {
  let temperature = piMonitor.cpuTemp();
  piMonitor.processStorage('cpu_temp', temperature);
  setTimeout(cpuTemperature, piMonitor.timeOut);
}

$(document).ready(function() {
  
  for (const x of Array(cpuCores).keys()) {
    piMonitor.corePercent(x, piMonitor.timeOut, cpuUsage);
  }
  let cpuGraph = $.plot("#cpu_usage_graph", cpuGraphData(), options);
  cpuGraphUpdate();
  function cpuGraphUpdate() {
    cpuGraph.setData(cpuGraphData());
    cpuGraph.draw();
    setTimeout(cpuGraphUpdate, piMonitor.timeOut);
  }
  
  cpuTemperature();
  let tempGraph = $.plot("#cpu_temp_graph", tempGraphData(), options);
  tempGraphUpdate();
  function tempGraphUpdate() {
    tempGraph.setData(tempGraphData());
    tempGraph.draw();
    setTimeout(tempGraphUpdate, piMonitor.timeOut);
  }
  
  memoryStatistics();
  let memGraph = $.plot("#mem_usage_graph", memGraphData(), options);
  memGraphUpdate();
  function memGraphUpdate() {
    memGraph.setData(memGraphData());
    memGraph.draw();
    setTimeout(memGraphUpdate, piMonitor.timeOut);
  }
  
  $(window).resize(function() {
    cpuGraph = $.plot("#cpu_usage_graph", cpuGraphData(), options);
    tempGraph = $.plot("#cpu_temp_graph", tempGraphData(), options);
    memGraph = $.plot("#mem_usage_graph", memGraphData(), options);
  });
  
});
