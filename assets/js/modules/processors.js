// processors.js

const os = require('os');

class Processors {
  
  name = 'processors';
  settings = {
    status: true,
    label: 'Processors Information',
    title: 'Processors'
  };
  gaugeOptions = {
    width: 75,
    height: 75,
    units: null,
    startAngle: 60,
    ticksAngle: 240,
    value: 0,
    minValue: 0,
    maxValue: 100,
    colorTitle: '#333',
    colorPlate: 'transparent',
    colorMajorTicks: 'transparent',
    colorMinorTicks: 'transparent',
    colorNumbers: 'transparent',
    colorValueBoxBackground: 'transparent',
    colorBarStroke: '#eee',
    barStrokeWidth: 1,
    highlights: [],
    valueBox: true,
    valueBoxStroke: 0,
    valueTextShadow: false,
    borders: false,
    needle: false,
    barWidth: 35,
    barShadow: 0,
    colorBarProgress: 'rgba(50,200,50,.75)',
    animationRule: 'quad',
    animationDuration: 500
  };
    
  constructor(timeout = 2000) {
    this.settings.timeout = timeout;
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/cpu.png" alt="" /> ' + this.settings.title + '</h2><div id="processors_graphs" class="row"></div><hr /></section>');
  }
  
  initialise(gauges) {
    for (const x of Array(os.cpus().length).keys()) {
      let cpuGaugeOptions = this.gaugeOptions;
      cpuGaugeOptions.title = 'CPU' + x;
      cpuGaugeOptions.renderTo = 'cpu_gauge_' + x;
      $('#processors_graphs').append('<div class="col-3 col-md-6 col-lg-3 text-center"><canvas id="cpu_gauge_' + x + '" ></canvas></div>');
      new gauges.RadialGauge(cpuGaugeOptions).draw(); 
      this.#corePercent(x, this.settings.timeout, this.reinitialise);
    }
  }
  
  reinitialise(percent, seconds, coreIndex) {
    const cpuPercent = Math.ceil(percent);
    //piMonitor.processStorage('cpu_stats_' + coreIndex, cpuPercent);
    document.gauges[coreIndex].value = percent;
    this.#corePercent(coreIndex, this.settings.timeout, this.reinitialise.bind(this));
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
