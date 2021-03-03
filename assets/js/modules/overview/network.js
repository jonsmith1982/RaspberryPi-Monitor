// network.js

class Network {
  
  name = 'network';
  settings = {
    status: true,
    label: 'Network Information',
    title: 'Network',
    timeout: 2000,
    column: 3,
    row: 1
  };
  
  constructor(s = null) {
    if (s !== null) Object.assign(this.settings, s);
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/network.png" alt="" /> ' + this.settings.title + '</h2><div id="network_info"></div><hr /></section>');
  }
  
  initialise() {
    this.reinitialise();
  }
  
  reinitialise() {
    const netInfo = this.#parseProcNetDev(fs.readFileSync('/proc/net/dev'));
    const iFaces = Object.keys(netInfo);
    for (const x of iFaces) {
      const sent = Math.round(this.#bytesTo(netInfo[x].bytes.transmit) * 100) / 100;
      const received = Math.round(this.#bytesTo(netInfo[x].bytes.transmit) * 100) / 100;
      let iFace = li('Sent', sent + 'GiB') + li('Received', received + 'GiB');
      if ($("#iface_" + x).length) {
        $("#iface_" + x).html(iFace);
      } else {
        iFace = '<code>' + x + '</code><ul id="iface_' + x + '" class="list-group tiny mb-3">' + iFace + '</ul>';
        $("#network_info").append(iFace);
      }
    }
    setTimeout(this.reinitialise.bind(this), this.settings.timeout);
  }
  
  #parseProcNetDev(procnetdev) {
  const lines = procnetdev.toString().trim().split('\n');
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
  
  #bytesTo(bytes) {
    const GiB = 1073741824;
    bytes /= GiB;
    return(bytes);
  }
}

module.exports.piModules.push(Network);
