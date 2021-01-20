const fs = require('fs');
const os = require('os');
const execSync = require('child_process').execSync;

let timeOut = 1000;
let historyCount = 60;

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
  '0002': ['Model B revision 1.0 256MB, Egoman', 'B', '1.0', '256MB', 'Egoman'],
  '0003': ['Model B revision 1.0 256MB, Egoman', 'B', '1.0', '256MB', 'Egoman'],
  '0004': ['Model B revision 2.0 256MB, Sony UK', 'B', '2.0', '256MB', 'Sony UK'],
  '0005': ['Model B revision 2.0 256MB, Qisda', 'B', '2.0', '256MB', 'Qisda'],
  '0006': ['Model B revision 2.0 256MB, Egoman', 'B', '2.0', '256MB', 'Egoman'],
  '0007': ['Model A revision 2.0 256MB, Egoman', 'A', '2.0', '256MB', 'Egoman'],
  '0008': ['Model A revision 2.0 256MB, Sony UK', 'A', '2.0', '256MB', 'Sony UK'],
  '0009': ['Model A revision 2.0 256MB, Qisda', 'A', '2.0', '256MB', 'Qisda'],
  '000d': ['Model B revision 2.0 512MB, Egoman', 'B', '2.0', '512MB', 'Egoman'],
  '000e': ['Model B revision 2.0 512MB, Sony UK', 'B', '2.0', '512MB', 'Sony UK'],
  '000f': ['Model B revision 2.0 512MB, Egoman', 'B', '2.0', '512MB', 'Egoman'],
  '0010': ['Model B+ revision 1.2 512MB, Sony UK', 'B+', '1.2', '512MB', 'Sony UK'],
  '0011': ['Model CM1 revision 1.0 512MB, Sony UK', 'CM1', '1.0', '512MB', 'Sony UK'],
  '0012': ['Model A+ revision 1.1 256MB, Sony UK', 'A+', '1.1', '256MB', 'Sony UK'],
  '0013': ['Model B+ revision 1.2 512MB, Embest', 'B+', '1.2', '512MB', 'Embest'],
  '0014': ['Model CM1 revision 1.0 512MB, Embest', 'CM1', '1.0', '512MB', 'Embest'],
  '0015': ['Model A+ revision 1.1 256/512MB, Embest', 'A+', '1.1', '256/512MB', 'Embest'],
  '900021': ['Model A+ revision 1.1 512MB, Sony UK', 'A+', '1.1', '512MB', 'Sony UK'],
  '900032': ['Model B+ revision 1.2 512MB, Sony UK', 'B+', '1.2', '512MB', 'Sony UK'],
  '900092': ['Model Zero revision 1.2 512MB, Sony UK', 'Zero', '1.2', '512MB', 'Sony UK'],
  '900093': ['Model Zero revision 1.3 512MB, Sony UK', 'Zero', '1.3', '512MB', 'Sony UK'],
  '9000c1': ['Model Zero W revision 1.1 512MB, Sony UK', 'Zero W', '1.1', '512MB', 'Sony UK'],
  '9020e0': ['Model 3A+ revision 1.0 512MB, Sony UK', '3A+', '1.0', '512MB', 'Sony UK'],
  '920092': ['Model Zero revision 1.2 512MB, Embest', 'Zero', '1.2', '512MB', 'Embest'],
  '920093': ['Model Zero revision 1.3 512MB, Embest', 'Zero', '1.3', '512MB', 'Embest'],
  '900061': ['Model CM revision 1.1 512MB, Sony UK', 'CM', '1.1', '512MB', 'Sony UK'],
  'a01040': ['Model 2B revision 1.0 1GB, Sony UK', '2B', '1.0', '1GB', 'Sony UK'],
  'a01041': ['Model 2B revision 1.1 1GB, Sony UK', '2B', '1.1', '1GB', 'Sony UK'],
  'a02082': ['Mdel 3B revision 1.2 1GB, Sony UK', '3B', '1.2', '1GB', 'Sony UK'],
  'a020a0': ['Model CM revision 1.0 1GB, Sony UK', 'CM', '1.0', '1GB', 'Sony UK'],
  'a020d3': ['Model 3B+ revision 1.3 1GB, Sony UK', '3B+', '1.3', '1GB', 'Sony UK'],
  'a02042': ['Model 2B (with BCM2837) revision 1.2 1GB, Sony UK', '2B', '1.2', '1GB', 'Sony UK'],
  'a21041': ['Model 2B revision 1.1 1GB, Embest', '2B', '1.1', '1GB', 'Embest'],
  'a22042': ['Model 2B (with BCM2837) revision 1.2 1GB, Embest', '2B', '1.2', '1GB', 'Embest'],
  'a22082': ['Model 3B revision 1.2 1GB, Embest', '3B', '1.2', '1GB', 'Embest'],
  'a220a0': ['Model CM3 revision 1.0 1GB, Embest', 'CM3', '1.0', '1GB', 'Embest'],
  'a32082': ['Model 3B revision 1.2 1GB, Sony Japan', '3B', '1.2', '1GB', 'Sony Japan'],
  'a52082': ['Model 3B revision 1.2 1GB, Stadium', '3B', '1.2', '1GB', 'Stadium'],
  'a22083': ['Model 3B revision 1.3 1GB, Embest', '3B', '1.3', '1GB', 'Embest'],
  'a02100': ['Model CM3 revision 1.0 1GB, Sony UK', 'CM3', '1.0', '1GB', 'Sony UK'],
  'a03111': ['Model 4B revision 1.1 1GB, Sony UK', '4B', '1.1', '1GB', 'Sony UK'],
  'b03111': ['Model 4B revision 1.1 2GB, Sony UK', '4B', '1.1', '2GB', 'Sony UK'],
  'b03112': ['Model 4B revision 1.2 2GB, Sony UK', '4B', '1.1', '2GB', 'Sony UK'],
  'b03114': ['Model 4B revision 1.4 2GB, Sony UK', '4B', '1.4', '2GB', 'Sony UK'],
  'c03111': ['Model 4B revision 1.1 4GB, Sony UK', '4B', '1.1', '4GB', 'Sony UK'],
  'c03112': ['Model 4B revision 1.2 4GB, Sony UK', '4B', '1.2', '4GB', 'Sony UK'],
  'c03114': ['Model 4B revision 1.4 4GB, Sony UK', '4B', '1.4', '4GB', 'Sony UK'],
  'd03114': ['Model 4B revision 1.4 8GB, Sony UK', '4B', '1.4', '8GB', 'Sony UK'],
  'c03130': ['Model Pi 400 revision 1.0 4GB, Sony UK', 'Pi 400', '1.0', '4GB', 'Sony UK']
};

const sessionStorage = window.sessionStorage;

function processStorage(key, value) {
  let storage = sessionStorage.getItem(key) ? sessionStorage.getItem(key) : '';
  storage = !Array.isArray(storage) ? storage.split(',') : storage;
  storage.push(value);
  if (storage.length >= historyCount)
    storage.shift();
  sessionStorage.setItem(key, storage);
}

function graphStorage(key) {
  let storage = sessionStorage.getItem(key) ? sessionStorage.getItem(key) : '';
  let data = [], i = 0;
  for (const x of storage.split(',')) {
    if (!x) continue;
    data.push([i, x]);
    i += 1;
  }
  return(data);
}

function cpuTemp() {
  let temperature = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp') / 1000;
  return(temperature);
}

function memoryStatistics() {
  var meminfo = _parseProcMeminfo();
  let memory = _memory_statistics(meminfo);
  let swap = _swap_statistics(meminfo);
  return {
    memFree: memory[0],
    memTotal: memory[1],
    memUsedPercent: memory[2],
    swapFree: swap[0],
    swapTotal: swap[1],
    swapUsedPercent: swap[2]
  };
}

function _memory_statistics(meminfo) {
  let memFree = meminfo.memfree;
  let memCached = meminfo.cached;
  let memBuffers = meminfo.buffers;
  let memTotal = meminfo.memtotal;
  
  let memFreeUnits = bytesTo((memFree + memCached + memBuffers) * 1024);
  let memTotalUnits = bytesTo(memTotal * 1024);
  let memUsedPercent = ((memTotal - (memFree + memCached + memBuffers)) / memTotal) * 100;
  
  return([memFreeUnits, memTotalUnits, memUsedPercent]);
}

function _swap_statistics(meminfo) {
  let swapTotal = meminfo.swaptotal;
  let swapFree = meminfo.swapfree;
  let swapCached = meminfo.swapcached;
  
  let swapFreeUnits = bytesTo((swapFree + swapCached) * 1024);
  let swapTotalUnits = bytesTo(swapTotal * 1024);
  let swapUsedPercent = ((swapTotal - (swapFree + swapCached)) / swapTotal) * 100
  
  return([swapFreeUnits, swapTotalUnits, swapUsedPercent]);
}

function _parseProcMeminfo() {
  var meminfo = fs.readFileSync('/proc/meminfo');
  return _formatParsedProcMeminfo(meminfo);
}

function _formatParsedProcMeminfo(meminfo) {
  var lines = meminfo.toString().split('\n');
  lines.pop();
  
  let list = ['memfree', 'cached', 'buffers', 'memtotal', 'swaptotal', 'swapfree', 'swapcached'];
  var data = {};
  lines.forEach(function(line) {
    var row = line.split(':');
    if (list.includes(row[0].toLowerCase()))
      data[row[0].toLowerCase()] = parseInt(row[1].trim().split(' ')[0]);
  });

  return data;
}

function bytesTo(bytes) {
  var GiB = 1073741824;
  bytes /= GiB;
  return(bytes);
}

function corePercent(coreIndex, sampleMs, cb) {
  let timeUsed0 = 0, timeUsed1 = 0, timeIdle0 = 0, timeIdle1 = 0;
  let cpu0 = os.cpus();
  const time = process.hrtime();
  setTimeout(function() {
    let cpu1 = os.cpus();
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

function totalCores() {
  return(os.cpus().length);
}

function hardwareInfo() {
  let cpuinfo = fs.readFileSync('/proc/cpuinfo');
  return(_parseHardwareInfo(cpuinfo));
}

function _parseHardwareInfo(cpuinfo) {
  let lines = cpuinfo.toString().split('\n');
  lines.pop();
  
  let list = ['hardware', 'revision', 'serial', 'model'];
  let data = {};
  lines.forEach(function(line) {
    let row = line.split(':');
    if (list.includes(row[0].trim().toLowerCase()))
      data[row[0].trim().toLowerCase()] = row[1].trim();
  });

  return(data);
}

function uptimeInfo() {
  let uptime = os.uptime();
  return(_readableUptime(uptime));
}

function _readableUptime(value){
  let uptimeString = '';
  const years = Math.floor(value / 31556926);
  let remainder = value % 31556926;
  const days = Math.floor( remainder / 86400);
  remainder = value % 86400;
  const hours = Math.floor(remainder / 3600);
  remainder = value % 3600;
  const minutes = Math.floor(remainder / 60);
  const seconds = Math.floor(remainder % 60);
  if (years != 0) uptimeString += years + " y ";
  uptimeString += days + " d ";
  uptimeString += hours + " h ";
  uptimeString += minutes  + " m ";
  uptimeString += seconds + " s";
  return(uptimeString);
}

function networkInfo() {
  return(_parseProcNetDev());
}

function _parseProcNetDev() {
  const buf = fs.readFileSync('/proc/net/dev');
  const lines = buf.toString().trim().split('\n');
  const sections = lines.shift().split('|');
  const columns = lines.shift().trim().split('|');
  let s, l, c, p = 0, map = {}, keys = [];
  for (let i = 0; i < sections.length; ++i) {
    let s = sections[i].trim();
    let l = sections[i].length;
    let c = columns[i].trim().split(/\s+/g);
    while (c.length) {
      map[keys.length] = s;
      keys.push(c.shift());
    }
    p += s.length + 1;
  }
  let retObj = {};
  lines.forEach(function(l) {
    l = l.trim().split(/\s+/g);
    let o = {}, iface;
    for (let i = 0; i < l.length; ++i) {
      let s = map[i];
      if (s.indexOf('-') === s.length - 1) {
        iface = l[i].substr(0, l[i].length - 1);
      } else {
        if (!o[keys[i]]) {
          o[keys[i].toLowerCase()] = {};
        }
        o[keys[i].toLowerCase()][s.toLowerCase()] = l[i];
      }
    }
    retObj[iface] = o;
  });
  return(retObj);
}

function diskInfo() {
  const output = execSync('export LC_ALL=C; lsblk -bPo NAME,TYPE,SIZE,FSTYPE,MOUNTPOINT,UUID,ROTA,RO,RM,LABEL,MODEL,OWNER,GROUP,FSUSED,PATH 2>/dev/null; unset LC_ALL');
  return(_parseLsBlk(output.toString()));
}

function _parseLsBlk(output) {
  let disks = {};
  let lines = output.split(/\n/g);
  lines.pop();
  lines.forEach(function (line) {
    let disk = {};
    line = line.replace(/"/g, '');
    const attrs = line.split(/\s/g);
    const name = attrs.shift().split(/=/)[1];
    attrs.forEach(function (attr) {
      let data = attr.split(/=/);
      disk[data[0].toLowerCase()] = data[1];
    });
    disks[name] = disk;
  });
  return(disks);
}

function wifiInfo() {
  const output = execSync('export LC_ALL=C; nmcli connection show 2>/dev/null; unset LC_ALL');
  return(_parseNmCli(output.toString()));
}

function _parseNmCli(output) {
  let conn = {};
  let lines = output.split(/\n/g);
  lines.pop(); lines.shift();
  lines.forEach(function (line) {
    let attrs = line.split(/\s{2,}/g);
    if (attrs[2] === 'wifi')
      conn[attrs[0]] = {
        uuid: attrs[1],
        type: attrs[2],
        device: attrs[3]
      };
  });
  return(conn);
}

module.exports = {
  timeOut: timeOut,
  historyCount: historyCount,
  processStorage: processStorage,
  graphStorage: graphStorage,
  gaugeOptions: gaugeOptions,
  revisions: revisions,
  cpuTemp: cpuTemp,
  memoryStatistics: memoryStatistics,
  corePercent: corePercent,
  totalCores: totalCores,
  hardwareInfo: hardwareInfo,
  uptimeInfo: uptimeInfo,
  networkInfo: networkInfo,
  bytesTo: bytesTo,
  diskInfo: diskInfo,
  wifiInfo: wifiInfo
};
