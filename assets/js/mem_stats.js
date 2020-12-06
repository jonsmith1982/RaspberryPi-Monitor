var fs = require('fs');

module.exports = {
  free: free,
  total: total,
  freePercent: freePercent,
  usedPercent: usedPercent,
  allStats: allStats,
  raw: raw,
};

/* PUBLIC */

function free(units) {
  var meminfo = _parseProcMeminfo();
  return _free(meminfo, units);
}

function total(units) {
  var meminfo = _parseProcMeminfo();
  return _total(meminfo, units);
}

function freePercent() {
  var meminfo = _parseProcMeminfo();
  return _freePercent(meminfo);
}

function usedPercent() {
  var meminfo = _parseProcMeminfo();
  return _usedPercent(meminfo);
}

function allStats(units) {
  units = units || 'bytes';
  var meminfo = _parseProcMeminfo();
  return {
    free: _free(meminfo, units),
    total: _total(meminfo, units),
    freePercent: _freePercent(meminfo),
    usedPercent: _usedPercent(meminfo),
  };
}

//raw `/proc/meminfo` as object
function raw(cb) {
  return _parseProcMeminfo(cb);
}

/* PRIVATE */

function _free(meminfo, units) {
  units = units || 'bytes';

  var freeMem = meminfo.memFree;
  var cached = meminfo.cached;
  var buffers = meminfo.buffers;

  var totalFreeMem = freeMem + cached + buffers;
  var totalFreeMemBytes = totalFreeMem * 1024;
  var converted = _bytesTo(totalFreeMemBytes, units);

  return converted;
}

function _total(meminfo, units) {
  units = units || 'bytes';
  var memTotal = meminfo.memTotal;
  var memTotalBytes = memTotal * 1024;
  var converted = _bytesTo(memTotalBytes, units);

  return converted;
}

function _freePercent(meminfo) {
  var freeMem = meminfo.memFree;
  var cached = meminfo.cached;
  var buffers = meminfo.buffers;
  var memTotal = meminfo.memTotal;

  var totalFreeMem = freeMem + cached + buffers;
  var percent = ((totalFreeMem / memTotal) * 100);

  return percent;
}

function _usedPercent(meminfo) {
  var freeMem = meminfo.memFree;
  var cached = meminfo.cached;
  var buffers = meminfo.buffers;
  var memTotal = meminfo.memTotal;

  var totalFreeMem = freeMem + cached + buffers;
  var used = memTotal - totalFreeMem;
  var percent = ((used / memTotal) * 100);

  return percent;
}

//NOTE: docs at `man proc`
function _parseProcMeminfo(cb) {
  if (cb && typeof cb === 'function') {
    return fs.readFile('/proc/meminfo', function(err, meminfo) {
      if (err) {
        return cb(err);
      }
      return cb(null, _formatParsedProcMeminfo(meminfo));
    });
  }

  var meminfo = fs.readFileSync('/proc/meminfo');
  return _formatParsedProcMeminfo(meminfo);
}

function _formatParsedProcMeminfo(meminfo) {
  var lines = meminfo.toString().split('\n');

  //remove last blank line
  lines.pop();

  var data = {};
  lines.forEach(function(line) {
    var row = line.split(':');
    data[_toCamelCase(row[0])] = parseInt(row[1].trim().split(' ')[0]);
  });

  return data;
}

//quick dirty to handle parens and underscores
function _toCamelCase(str) {
  var newString = '';
  var insideParens = false;
  newString += str[0].toLowerCase();
  for (var i = 1; i < str.length; i++) {
    var char = str[i];
    switch (char) {
      case ')':
      case '_':
        break;
      case '(':
        insideParens = true;
        break;
      default:
        if (insideParens) {
          insideParens = false;
          newString += char.toUpperCase();
        } else {
          newString += char;
        }
        break;
    }
  }

  return newString;
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

  //NOTE: the variable named `bytes` may not actually contain a number
  //representing the number of bytes. its done this way to only have to use one
  //variable.
  return bytes;
}
