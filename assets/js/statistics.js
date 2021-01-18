const piMonitor = require('../assets/js/raspberrypi_monitor.js');
const cpuCores = piMonitor.totalCores();

let timeOut = 1000;
let historyCount = 60;

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
    max: historyCount
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
  piMonitor.corePercent(coreIndex, timeOut, cpuUsage);
}

function memoryStatistics() {
  let statistics = piMonitor.memoryStatistics();
  ['mem', 'swap'].forEach(function (t) {
    let percent = Math.ceil(statistics[`${t}UsedPercent`]);
    piMonitor.processStorage(t + '_stats', percent);
  });
  setTimeout(memoryStatistics, timeOut);
}

function cpuTemperature() {
  let temperature = piMonitor.cpuTemp();
  piMonitor.processStorage('cpu_temp', temperature);
  setTimeout(cpuTemperature, timeOut);
}

$(document).ready(function() {
  
  for (const x of Array(cpuCores).keys()) {
    piMonitor.corePercent(x, timeOut, cpuUsage);
  }
  let cpuData = cpuGraphData();
  let cpuGraph = $.plot("#cpu_usage_graph", cpuData, options);
  cpuGraphUpdate();
  function cpuGraphUpdate() {
    if (cpuData.length < historyCount) {
      cpuData = cpuGraphData();
      cpuGraph = $.plot("#cpu_usage_graph", cpuData, options);
    } else {
      cpuData = cpuGraphData();
      cpuGraph.setData(cpuData);
      cpuGraph.draw();
    }
    setTimeout(cpuGraphUpdate, timeOut);
  }
  
  cpuTemperature();
  let tempData = tempGraphData();
  let tempGraph = $.plot("#cpu_temp_graph", tempData, options);
  tempGraphUpdate();
  function tempGraphUpdate() {
    if (tempData.length < historyCount) {
      tempData = tempGraphData();
      tempGraph = $.plot("#cpu_temp_graph", tempData, options);
    } else {
      tempData = memGraphData();
      tempGraph.setData(tempData);
      tempGraph.draw();
    }
    setTimeout(tempGraphUpdate, timeOut);
  }
  
  memoryStatistics();
  let memData = memGraphData();
  let memGraph = $.plot("#mem_usage_graph", memData, options);
  memGraphUpdate();
  function memGraphUpdate() {
    if (memData.length < historyCount) {
      memData = memGraphData();
      memGraph = $.plot("#mem_usage_graph", memData, options);
    } else {
      memData = memGraphData();
      memGraph.setData(memData);
      memGraph.draw();
    }
    setTimeout(memGraphUpdate, timeOut);
  }
  
});
