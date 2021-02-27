// temperature.js

class Temperature {
  
  name = 'temperature';
  settings = {
    status: true,
    label: 'Temperature Information',
    title: 'Temperature',
    deps: 'gauges',
    column: 2,
    row: 2
  };
  gaugeOptions = {
    width: 120,
    height: 120,
    units: null,
    title: 'CPU Temp',
    renderTo: 'temperature_gauge',
    startAngle: 60,
    ticksAngle: 240,
    value: 0,
    minValue: 0,
    maxValue: 80,
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
    colorBarProgress: 'rgba(255,0,0,.5)',
    animationRule: 'quad',
    animationDuration: 500
  };
  deps = {};
  
  constructor(timeout = 2000) {
    this.settings.timeout = timeout;
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/cpu_temp.png" alt="" /> ' + this.settings.title + '</h2><div class="text-center"><canvas id="temperature_gauge"></canvas></div><hr /></section>');
  }
  
  dependencies(key, value) {
    this.deps[key] = value;
  }
  
  initialise(gauges) {
    new this.deps.gauges.RadialGauge(this.gaugeOptions).draw(); 
    this.reinitialise();
  }
  
  reinitialise() {
    const temperature = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp') / 1000;
    processStorage('cpu_temp', temperature);
    document.gauges[document.gauges.length - 1].value = temperature;
    setTimeout(this.reinitialise.bind(this), this.settings.timeout);
  }
}

module.exports.piModules.push(Temperature);
