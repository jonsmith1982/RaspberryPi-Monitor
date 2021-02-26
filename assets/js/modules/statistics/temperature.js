// temperature.js

class Temperature {
  
  name = 'temperature';
  settings = {
    status: true,
    label: 'Temperature Graph',
    title: 'Temperature',
    row: 3
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
  
  constructor(timeout = 2000) {
    this.settings.timeout = timeout;
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/cpu_temp.png" alt="" /> ' + this.settings.title + '</h2><div id="temperature_graphs" style="min-height:150px;"></div><hr /></section>');
  }
  
  initialise() {
    this.reinitialise();
    this.graph = $.plot("#temperature_graphs", this.#graphData(), this.options);
    this.#updateGraph();
  }
  
  reinitialise() {
    const temperature = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp') / 1000;
    processStorage('cpu_temp', temperature);
    setTimeout(this.reinitialise.bind(this), this.settings.timeout);
  }
  
  graphResize() {
    this.graph = $.plot("#temperature_graphs", this.#graphData(), this.options);
  }
  
  #updateGraph() {
    this.graph.setData(this.#graphData());
    this.graph.draw();
    setTimeout(this.#updateGraph.bind(this), this.settings.timeout);
  }
  
  #graphData() {
    return([graphStorage('cpu_temp')]);
  }
}

module.exports.piModules.push(Temperature);
