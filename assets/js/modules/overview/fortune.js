// fortune.js

class Fortune {
  
  name = 'fortune';
  settings = {
    status: true,
    label: 'Fortune Cookie',
    title: 'Fortune',
    timeout: 2000,
    column: 1,
    row: 1
  };
  
  constructor(s = null) {
    if (s !== null) Object.assign(this.settings, s);
  }
  
  placeholder() {
    return('<section id="' + this.name + '"><h2><img src="../assets/images/user.png" alt="" /> ' + this.settings.title + '</h2><div id="fortune_cookie"></div><hr /></section>');
  }
  
  initialise() {
    const cookie = execSync('/usr/games/fortune 2>/dev/null');
    $("#fortune_cookie").html('<ul class="list-group tiny"><li class="list-group-item">' + cookie.toString() + '</li></ul>');
  }
}

module.exports.piModules.push(Fortune);
