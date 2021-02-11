// swap.js

const fs = require('fs');

class Swap {
  
  name = 'swap';
  settings = {
    status: true,
    label: 'Swap Information',
    title: 'Swap'
  };
  progress = function(s, n, l, c, u, a, t, p) {
    const code = c !== null ? '<strong class="tiny">' + l + ':</strong> <code>' + c + '</code>' : '';
    return('<div id="' + s + '_' + n + '">' + code + '<label id="' + n + '_label" class="tiny"><strong>Used:</strong> ' + u + 'GiB <strong>Available:</strong> ' + a + 'GiB of ' + t + 'GiB</label><div class="progress mb-3" style="height:20px;"><div id="' + n + '_gauge" class="progress-bar progress-bar-striped" role="progressbar" style="width: ' + p + '%;" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100">' + p + '%</div></div></div>');
  };
  
  constructor(timeout = 2000) {
    this.settings.timeout = timeout;
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/swap.png" alt="" /> ' + this.settings.title + '</h2><div id="swap_graphs"></div><hr /></section>');
  }
  
  initialise() {
    this.reinitialise();
  }
  
  reinitialise() {
    const swap = this.#swap_statistics(this.#parseProcMeminfo(fs.readFileSync('/proc/meminfo')));
    const statistics = {swapFree: swap[0], swapTotal: swap[1], swapUsedPercent: swap[2]};
    const percent = Math.ceil(statistics.swapUsedPercent);
    const used = Math.round((statistics.swapTotal * (statistics.swapUsedPercent / 100)) * 100) / 100;
    const free = Math.round(statistics.swapFree * 100) / 100;
    const total = Math.round(statistics.swapTotal * 100) / 100;
    //piMonitor.processStorage('mem_stats', percent);
    $("#swap_graphs").html(progress('swap', 'swap', null, null, used, free, total, percent));
    setTimeout(this.reinitialise.bind(this), this.settings.timeout);
  }
  
  #swap_statistics(meminfo) {
    const swapTotal = meminfo.swaptotal;
    const swapFree = meminfo.swapfree;
    const swapCached = meminfo.swapcached;
    const swapFreeUnits = this.#bytesTo((swapFree + swapCached) * 1024);
    const swapTotalUnits = this.#bytesTo(swapTotal * 1024);
    const swapUsedPercent = ((swapTotal - (swapFree + swapCached)) / swapTotal) * 100
    return([swapFreeUnits, swapTotalUnits, swapUsedPercent]);
  }
  
  #parseProcMeminfo(meminfo) {
    let lines = meminfo.toString().split('\n');
    lines.pop();
    const list = ['swaptotal', 'swapfree', 'swapcached'];
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

module.exports.piModules.push(Swap);
