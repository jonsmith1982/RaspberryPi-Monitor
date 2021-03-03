// processors.js

class Processors {
  
  name = 'processors';
  settings = {
    status: true,
    label: 'Processors Graph',
    title: 'Processors',
    timeout: 2000,
    row: 1
  };
  options = {
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
      max: historyCount - 2
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
  
  constructor(s = null) {
    if (s !== null) Object.assign(this.settings, s);
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/cpu.png" alt="" /> ' + this.settings.title + '</h2><div id="processors_graphs" style="min-height:150px;"></div><hr /></section>');
  }
  
  initialise() {
    for (const x of Array(os.cpus().length).keys()) {
      this.#corePercent(x, this.settings.timeout, this.reinitialise.bind(this));
    }
    this.graph = $.plot("#processors_graphs", this.#graphData(), this.options);
    this.#updateGraph();
  }
  
  reinitialise(percent, seconds, coreIndex) {
    const cpuPercent = Math.ceil(percent);
    processStorage('cpu_stats_' + coreIndex, cpuPercent);
    this.#corePercent(coreIndex, this.settings.timeout, this.reinitialise.bind(this));
  }
  
  graphResize() {
    this.graph = $.plot("#processors_graphs", this.#graphData(), this.options);
  }
  
  #updateGraph() {
    this.graph.setData(this.#graphData());
    this.graph.draw();
    setTimeout(this.#updateGraph.bind(this), this.settings.timeout);
  }
  
  #graphData() {
    let data = [];
    for (const x of Array(os.cpus().length).keys()) {
      data.push(graphStorage('cpu_stats_' + x));
    }
    return(data);
  }
  
  #corePercent(coreIndex, sampleMs, cb) {
    let timeUsed0 = 0, timeUsed1 = 0, timeIdle0 = 0, timeIdle1 = 0;
    const cpu0 = os.cpus();
    const time = process.hrtime();
    setTimeout(function() {
      const cpu1 = os.cpus();
      const diff = process.hrtime(time);
      const diffSeconds = diff[0] + diff[1] * 1e-9;
      timeUsed1 += cpu1[coreIndex].times.user;
      timeUsed1 += cpu1[coreIndex].times.nice;
      timeUsed1 += cpu1[coreIndex].times.sys;
      timeIdle1 += cpu1[coreIndex].times.idle;
      timeUsed0 += cpu0[coreIndex].times.user;
      timeUsed0 += cpu0[coreIndex].times.nice;
      timeUsed0 += cpu0[coreIndex].times.sys;
      timeIdle0 += cpu0[coreIndex].times.idle;
      const timeUsed = timeUsed1 - timeUsed0;
      const timeIdle = timeIdle1 - timeIdle0;
      const percent = (timeUsed / (timeUsed + timeIdle)) * 100;
      return(cb(percent, diffSeconds, coreIndex));
    }, sampleMs);
  }
}

module.exports.piModules.push(Processors);
