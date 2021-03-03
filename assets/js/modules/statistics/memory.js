// memory.js

class Memory {
  
  name = 'memory';
  settings = {
    status: true,
    label: 'Memory Graph',
    title: 'Memory',
    timeout: 2000,
    row: 2
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
    return('<section id="' + this.name + '"><h2><img src="../assets/images/memory.png" alt="" /> ' + this.settings.title + '</h2><div id="memory_graphs" style="min-height:150px;"></div><hr /></section>');
  }
  
  initialise() {
    this.reinitialise();
    this.graph = $.plot("#memory_graphs", this.#graphData(), this.options);
    this.#updateGraph();
  }
  
  reinitialise() {
    const memory = this.#memory_statistics(this.#parseProcMeminfo(fs.readFileSync('/proc/meminfo')));
    const statistics = {memFree: memory[0], memTotal: memory[1], memUsedPercent: memory[2]};
    const percent = Math.ceil(statistics.memUsedPercent);
    processStorage('mem_stats', percent);
    setTimeout(this.reinitialise.bind(this), this.settings.timeout);
  }
  
  graphResize() {
    this.graph = $.plot("#memory_graphs", this.#graphData(), this.options);
  }
  
  #updateGraph() {
    this.graph.setData(this.#graphData());
    this.graph.draw();
    setTimeout(this.#updateGraph.bind(this), this.settings.timeout);
  }
  
  #graphData() {
    return([graphStorage('mem_stats')]);
  }
  
  #memory_statistics(meminfo) {
    const memFree = meminfo.memfree;
    const memCached = meminfo.cached;
    const memBuffers = meminfo.buffers;
    const memTotal = meminfo.memtotal;
    const memFreeUnits = this.#bytesTo((memFree + memCached + memBuffers) * 1024);
    const memTotalUnits = this.#bytesTo(memTotal * 1024);
    const memUsedPercent = ((memTotal - (memFree + memCached + memBuffers)) / memTotal) * 100;
    return([memFreeUnits, memTotalUnits, memUsedPercent]);
  }
  
  #parseProcMeminfo(meminfo) {
    let lines = meminfo.toString().split('\n');
    lines.pop();
    const list = ['memfree', 'cached', 'buffers', 'memtotal'];
    let data = {};
    lines.forEach(function(line) {
      const row = line.split(':');
      if (list.includes(row[0].toLowerCase()))
        data[row[0].toLowerCase()] = parseInt(row[1].trim().split(' ')[0]);
    });
    return data;
  }
  
  #bytesTo(bytes) {
    const GiB = 1073741824;
    bytes /= GiB;
    return(bytes);
  }
}

module.exports.piModules.push(Memory);
