// memory.js

const fs = require('fs');

class Memory {
  
  name = 'memory';
  settings = {
    status: true,
    label: 'Memory Information',
    title: 'Memory'
  };
  progress = function(s, n, l, c, u, a, t, p) {
    const code = c !== null ? '<strong class="tiny">' + l + ':</strong> <code>' + c + '</code>' : '';
    return('<div id="' + s + '_' + n + '">' + code + '<label id="' + n + '_label" class="tiny"><strong>Used:</strong> ' + u + 'GiB <strong>Available:</strong> ' + a + 'GiB of ' + t + 'GiB</label><div class="progress mb-3" style="height:20px;"><div id="' + n + '_gauge" class="progress-bar progress-bar-striped" role="progressbar" style="width: ' + p + '%;" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100">' + p + '%</div></div></div>');
  };
  
  constructor(timeout = 2000) {
    this.settings.timeout = timeout;
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/memory.png" alt="" /> ' + this.settings.title + '</h2><div id="memory_graphs"></div><hr /></section>');
  }
  
  initialise() {
    this.reinitialise();
  }
  
  reinitialise() {
    const memory = this.#memory_statistics(this.#parseProcMeminfo(fs.readFileSync('/proc/meminfo')));
    const statistics = {memFree: memory[0], memTotal: memory[1], memUsedPercent: memory[2]};
    const percent = Math.ceil(statistics.memUsedPercent);
    const used = Math.round((statistics.memTotal * (statistics.memUsedPercent / 100)) * 100) / 100;
    const free = Math.round(statistics.memFree * 100) / 100;
    const total = Math.round(statistics.memTotal * 100) / 100;
    //piMonitor.processStorage('mem_stats', percent);
    $("#memory_graphs").html(progress('mem', 'mem', null, null, used, free, total, percent));
    setTimeout(this.reinitialise.bind(this), this.settings.timeout);
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
