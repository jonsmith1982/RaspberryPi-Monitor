// swap.js

class Swap {
  
  name = 'swap';
  settings = {
    status: true,
    label: 'Swap Information',
    title: 'Swap',
    timeout: 10000,
    column: 2,
    row: 4
  };
  
  constructor(s = null) {
    if (s !== null) Object.assign(this.settings, s);
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
