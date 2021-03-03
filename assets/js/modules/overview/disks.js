// disks.js

class Disks {
  
  name = 'disks';
  settings = {
    status: true,
    label: 'Disks Information',
    title: 'Disks',
    timeout: 10000,
    column: 1,
    row: 3
  };
  
  constructor(s = null) {
    if (s !== null) Object.assign(this.settings, s);
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/usb_hdd.png" alt="" /> ' + this.settings.title + '</h2><div id="disks_graphs"></div><hr /></section>');
  }
  
  initialise() {
    this.reinitialise();
  }
  
  reinitialise() {
    const disks = this.#parseLsBlk(execSync('export LC_ALL=C; lsblk -bPo NAME,TYPE,SIZE,FSTYPE,MOUNTPOINT,UUID,ROTA,RO,RM,LABEL,MODEL,OWNER,GROUP,FSUSED,PATH 2>/dev/null; unset LC_ALL').toString());
    $("#disks_graphs").html('');
    for (const x of Object.keys(disks)) {
      if (disks[x].type === 'disk') {
        const total = Math.round(this.#bytesTo(disks[x].size) * 100) / 100;
        const html = '<ul id="disk_' + x + '" class="list-group tiny">' + li('Device', disks[x].path, true) + li('Size', total + 'GiB', true) + li('Owner/Group', disks[x].owner + '/' + disks[x].group, true) + '</ul>';
        $("#disks_graphs").append(html);
      }
    }
    setTimeout(this.reinitialise.bind(this), this.settings.timeout);
  }

  #parseLsBlk(cmdOutput) {
    let disks = {};
    let lines = cmdOutput.split(/\n/g);
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
  
  #bytesTo(bytes) {
    const GiB = 1073741824;
    bytes /= GiB;
    return(bytes);
  }
}

module.exports.piModules.push(Disks);
