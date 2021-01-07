const fs = require('fs');

const gaugeOptions = {
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
}

const revisions = {
  '0002': ['Model B revision 1.0 256MB, Egoman'],
  '0003': ['Model B revision 1.0 256MB, Egoman'],
  '0004': ['Model B revision 2.0 256MB, Sony UK'],
  '0005': ['Model B revision 2.0 256MB, Qisda'],
  '0006': ['Model B revision 2.0 256MB, Egoman'],
  '0007': ['Model A revision 2.0 256MB, Egoman'],
  '0008': ['Model A revision 2.0 256MB, Sony UK'],
  '0009': ['Model A revision 2.0 256MB, Qisda'],
  '000d': ['Model B revision 2.0 512MB, Egoman'],
  '000e': ['Model B revision 2.0 512MB, Sony UK'],
  '000f': ['Model B revision 2.0 512MB, Egoman'],
  '0010': ['Model B+ revision 1.2 512MB, Sony UK'],
  '0011': ['Model CM1 revision 1.0 512MB, Sony UK'],
  '0012': ['Model A+ revision 1.1 256MB, Sony UK'],
  '0013': ['Model B+ revision 1.2 512MB, Embest'],
  '0014': ['Model CM1 revision 1.0 512MB, Embest'],
  '0015': ['Model A+ revision 1.1 256/512MB, Embest'],
  '900021': ['Model A+ revision 1.1 512MB, Sony UK'],
  '900032': ['Model B+ revision 1.2 512MB, Sony UK'],
  '900092': ['Model Zero revision 1.2 512MB, Sony UK'],
  '900093': ['Model Zero revision 1.3 512MB, Sony UK'],
  '9000c1': ['Model Zero W revision 1.1 512MB, Sony UK'],
  '9020e0': ['Model 3A+ revision 1.0 512MB, Sony UK'],
  '920092': ['Model Zero revision 1.2 512MB, Embest'],
  '920093': ['Model Zero revision 1.3 512MB, Embest'],
  '900061': ['Model CM revision 1.1 512MB, Sony UK'],
  'a01040': ['Model 2B revision 1.0 1GB, Sony UK'],
  'a01041': ['Model 2B revision 1.1 1GB, Sony UK'],
  'a02082': ['Mdel 3B revision 1.2 1GB, Sony UK'],
  'a020a0': ['Model CM revision 1.0 1GB, Sony UK'],
  'a020d3': ['Model 3B+ revision 1.3 1GB, Sony UK'],
  'a02042': ['Model 2B (with BCM2837) revision 1.2 1GB, Sony UK'],
  'a21041': ['Model 2B revision 1.1 1GB, Embest'],
  'a22042': ['Model 2B (with BCM2837) revision 1.2 1GB, Embest'],
  'a22082': ['Model 3B revision 1.2 1GB, Embest'],
  'a220a0': ['Model CM3 revision 1.0 1GB, Embest'],
  'a32082': ['Model 3B revision 1.2 1GB, Sony Japan'],
  'a52082': ['Model 3B revision 1.2 1GB, Stadium'],
  'a22083': ['Model 3B revision 1.3 1GB, Embest'],
  'a02100': ['Model CM3 revision 1.0 1GB, Sony UK'],
  'a03111': ['Model 4B revision 1.1 1GB, Sony UK'],
  'b03111': ['Model 4B revision 1.1 2GB, Sony UK'],
  'b03112': ['Model 4B revision 1.2 2GB, Sony UK'],
  'b03114': ['Model 4B revision 1.4 2GB, Sony UK'],
  'c03111': ['Model 4B revision 1.1 4GB, Sony UK'],
  'c03112': ['Model 4B revision 1.2 4GB, Sony UK'],
  'c03114': ['Model 4B revision 1.4 4GB, Sony UK'],
  'd03114': ['Model 4B revision 1.4 8GB, Sony UK'],
  'c03130': ['Model Pi 400 revision 1.0 4GB, Sony UK']
};

function cpuTemp() {
  let temperature = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp') / 1000;
  return(temperature);
}

module.exports = {
  gaugeOptions: gaugeOptions,
  revisions: revisions,
  cpuTemp: cpuTemp
};
