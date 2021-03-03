// uptime.js

class Uptime {
  
  name = 'uptime';
  settings = {
    status: true,
    label: 'Uptime Information',
    title: 'Uptime',
    timeout: 60000,
    column: 2,
    row: 1
  };
  
  constructor(s = null) {
    if (s !== null) Object.assign(this.settings, s);
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/uptime.png" alt="" /> ' + this.settings.title + '</h2><ul id="uptime_info" class="list-group tiny"></ul><hr /></section>');
  }
  
  initialise() {
    this.reinitialise();
  }
  
  reinitialise() {
    const uptime = this.#readableUptime(os.uptime());
    $("#uptime_info").html('<li class="list-group-item">' + uptime + '</li>');
    setTimeout(this.reinitialise.bind(this), this.settings.timeout);
  }
  
  #readableUptime(value){
    let uptimeString = '';
    const years = Math.floor(value / 31556926);
    let remainder = value % 31556926;
    const days = Math.floor( remainder / 86400);
    remainder = value % 86400;
    const hours = Math.floor(remainder / 3600);
    remainder = value % 3600;
    const minutes = Math.floor(remainder / 60);
    const seconds = Math.floor(remainder % 60);
    if (years != 0) uptimeString += years + " y ";
    uptimeString += days + " d ";
    uptimeString += hours + " h ";
    uptimeString += minutes  + " m ";
    uptimeString += seconds + " s";
    return(uptimeString);
  }
}

module.exports.piModules.push(Uptime);
