// version.js

class Version {
  
  name = 'version';
  settings = {
    status: true,
    label: 'Version Information',
    title: 'Version',
    column: 1,
    row: 1
  };
  revisions = {
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
  li = function(l, v, c = false) {
    const label = l !== null ? '<strong>' + l + ':</strong> ' : ''
    const value = c ? '<code>' + v + '</code>' : v;
    return('<li class="list-group-item">' + label +  value + '</li>');
  };
  
  constructor(timeout = 2000) {
    this.settings.timeout = timeout;
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/version.png" alt="" /> ' + this.settings.title + '</h2><ul id="version_info" class="list-group tiny"></ul><hr /></section>');
  }
  
  initialise() {
    const hInfo = this.#parseHardwareInfo(fs.readFileSync('/proc/cpuinfo'));
    $("#version_info").append(this.li('Chipset', hInfo.hardware));
    if (hInfo.revision in this.revisions) {
      const rInfo = this.revisions[hInfo.revision];
      $("#version_info").append(this.li('Manufacturer', rInfo[4]));
      $("#version_info").append(this.li('Model', rInfo[1] + ' (' + rInfo[3] + ')'));
      $("#version_info").append(this.li('Revision', rInfo[2]));
    }
    //$("#version_info").append(this.li('Serial No', hInfo.serial));
    $("#version_info").append(this.li('Serial No', '0000000000000'));
  }
  
  #parseHardwareInfo(cpuinfo) {
    let lines = cpuinfo.toString().split('\n');
    lines.pop();
    const list = ['hardware', 'revision', 'serial', 'model'];
    let data = {};
    lines.forEach(function(line) {
      const row = line.split(':');
      if (list.includes(row[0].trim().toLowerCase()))
        data[row[0].trim().toLowerCase()] = row[1].trim();
    });
    return(data);
  }
}

module.exports.piModules.push(Version);
