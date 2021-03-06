// test.js

class Test {
  
  name = 'test';
  settings = {
    status: true,
    label: 'Test Details',
    title: 'Test',
    timeout: 2000,
    column: 2,
    row: 6
  };
  
  constructor(s = null) {
    if (s !== null) Object.assign(this.settings, s);
  }
  
  placeholder() {
    return('<section id="test"><h2><img src="../assets/images/usb_hdd.png" alt="" /> Test</h2><div id="test_info"></div><hr /></section>');
  }
  
  initialise() {
    this.reinitialise(1);
  }
  
  reinitialise(i) {
    const ul = '<ul class="list-group tiny"><li class="list-group-item">test: ' + i + ' timeout: ' + this.settings.timeout + '</li></ul>';
    $("#test_info").html(ul);
    setTimeout(this.reinitialise.bind(this), this.settings.timeout, i + 1);
  }
}

module.exports.piModules.push(Test);
