var fs = require('fs');

module.exports = {
  statistics: allStatistics
};

function allStatistics(units) {
  units = units || 'bytes';
  var meminfo = _parseProcMeminfo();
  let memory = _memory_statistics(meminfo, units);
  let swap = _swap_statistics(meminfo, units);
  return {
    memFree: memory[0],
    memTotal: memory[1],
    memUsedPercent: memory[2],
    swapFree: swap[0],
    swapTotal: swap[1],
    swapUsedPercent: swap[2]
  };
}

function _memory_statistics(meminfo, units) {
  units = units || 'bytes';
  
  let memFree = meminfo.memfree;
  let memCached = meminfo.cached;
  let memBuffers = meminfo.buffers;
  let memTotal = meminfo.memtotal;
  
  let memFreeUnits = _bytesTo((memFree + memCached + memBuffers) * 1024, units);
  let memTotalUnits = _bytesTo(memTotal * 1024, units);
  let memUsedPercent = ((memTotal - (memFree + memCached + memBuffers)) / memTotal) * 100;
  
  return([memFreeUnits, memTotalUnits, memUsedPercent]);
}

function _swap_statistics(meminfo, units) {
  units = units || 'bytes';
  
  let swapTotal = meminfo.swaptotal;
  let swapFree = meminfo.swapfree;
  let swapCached = meminfo.swapcached;
  
  let swapFreeUnits = _bytesTo((swapFree + swapCached) * 1024, units);
  let swapTotalUnits = _bytesTo(swapTotal * 1024, units);
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

function _bytesTo(bytes, units) {
  var KiB = 1024;
  var MiB = 1024 * KiB;
  var GiB = 1024 * MiB;

  switch (units) {
    case 'bytes':
      break;
    case 'KiB':
      bytes /= KiB;
      break;
    case 'MiB':
      bytes /= MiB;
      break;
    case 'GiB':
      bytes /= GiB;
      break;
    default:
      var errMsg =
        '[mem-stats] Error: Unknown units "' + units + '", use one of: ' +
        '"bytes" (default), "KiB", "MiB" or "GiB"';
      console.log(errMsg);
  }

  return bytes;
}
