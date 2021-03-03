// partitions.js

class Partitions {
  
  name = 'partitions';
  settings = {
    status: true,
    label: 'Partitions Information',
    title: 'Partitions',
    column: 3,
    row: 2
  };
  
  constructor(timeout = 2000) {
    this.settings.timeout = timeout;
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/sd.png" alt="" /> ' + this.settings.title + '</h2><div id="partitions_graphs"></div><hr /></section>');
  }
  
  initialise() {
    this.reinitialise();
  }
  
  reinitialise() {
    const disks = this.#parseLsBlk(execSync('export LC_ALL=C; lsblk -bPo NAME,TYPE,SIZE,FSTYPE,MOUNTPOINT,UUID,ROTA,RO,RM,LABEL,MODEL,OWNER,GROUP,FSUSED,PATH 2>/dev/null; unset LC_ALL').toString());
    $("#partitions_graphs").html('');
    for (const x of Object.keys(disks)) {
      if (disks[x].type === 'part') {
        if (disks[x].mountpoint !== '[SWAP]') {
          const total = Math.round(this.#bytesTo(disks[x].size) * 100) / 100;
          const available = Math.round(this.#bytesTo(disks[x].size - disks[x].fsused) * 100) / 100;
          const used = Math.round(this.#bytesTo(disks[x].fsused) * 100) / 100;
          const percent = Math.ceil(((disks[x].size - disks[x].fsused) / disks[x].size) * 100);
          const part = progress('partitions', x, 'Mount Point', disks[x].mountpoint, used, available, total, percent);
          $("#partitions_graphs").append(part);
        }
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

module.exports.piModules.push(Partitions);
