// wifi.js

class Wifi {
  
  name = 'wifi';
  settings = {
    status: true,
    label: 'Wifi Information',
    title: 'Wifi',
    timeout: 10000,
    column: 2,
    row: 5
  };
  
  constructor(s = null) {
    if (s !== null) Object.assign(this.settings, s);
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/wifi.png" alt="" /> ' + this.settings.title + '</h2><div id="wifi_graphs"></div><hr /></section>');
  }
  
  initialise() {
    this.reinitialise();
  }
  
  reinitialise() {
    const output = execSync('export LC_ALL=C; nmcli connection show 2>/dev/null; unset LC_ALL');
    const conn = this.#parseNmCli(output.toString());
    const ssid = Object.keys(conn);
    if (ssid.length === 0) {
      $("#wifi_graphs").html('<ul class="list-group tiny"><li class="list-group-item">No wifi connections in progress</li></ul>');
    } else {
      $("#wifi_graphs").html('<ul class="list-group tiny"><li class="list-group-item"><strong>' + conn[ssid[0]].device + ':</strong> <code>' + ssid[0] + '</code></li></ul>');
    }
    setTimeout(this.reinitialise.bind(this), this.settings.timeout);
  }
  
  #parseNmCli(output) {
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
}

module.exports.piModules.push(Wifi);
