const settings = {overview: {version: {label: 'Version Information', title: 'Version', status: true}, cpu: {label: 'CPU Gauges', title: 'CPU', status: true}, harddisks: {label: 'Hard Disk Details', title: 'Hard Disks', status: true}, uptime: {label: 'Uptime Information', title: 'Uptime', status: true}, temperature: {label: 'Temperature Gauge', title: 'Temperature', status: true}, memory: {label: 'Memory Meter', title: 'Memory', status: true}, swap: {label: 'Swap Meter', title: 'Swap', status: true}, wifi: {label: 'Wifi Details', title: 'Wifi', status: true}, network: {label: 'Network Interfaces', title: 'Network', status: true}, partitions: {label: 'Partitions Information', title: 'Partitions', status: true}}, statistics: {cpu: {label: 'CPU Graph', title: 'CPU', status: true}, temperature: {label: 'Temperature Graph', title: 'Temperature', status: true}, memory: {label: 'Memory Graph', title: 'Memory', status: true}}};

function navbar(page) {
  let ul = '';
  for (const x of Object.keys(settings)) {
    const active = x === page ? ' active' : '';
    const sr = x === page ? ' <span class="sr-only">(current)</span>' : '';
    const li = '<li class="nav-item' + active + '"><a class="nav-link" href="./' + x + '.html">' + x.charAt(0).toUpperCase() + x.slice(1) + sr + '</a></li>';
    ul += li;
  }
  return(ul);
}

function navigation(page) {
  let nav = '<nav class="navbar navbar-expand-lg navbar-dark bg-dark rounded"><h1 class="navbar-brand"><a href="./overview.html"><img src="../assets/images/logo.png" width="30" height="30" alt="" loading="lazy" /> RaspberryPi Monitor</a></h1><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navigation"><ul class="navbar-nav">' + navbar(page) + '</ul></div></nav><div id="settings" class="mt-1 text-right"><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#settings-modal"><img src="../assets/images/settings.png" alt="Settings" /></button></div>';
  return(nav);
}

function settingsModal(page) {
  let li = [];
  for (const x of Object.keys(settings[page])) {
    li.push('<li class="list-group-item"><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="settings_' + x + '" checked="checked"><label class="custom-control-label" for="settings_' + x + '">' + settings[page][x].label + '</label></div></li>');
  }
  const modal = '<div class="modal fade" id="settings-modal" tabindex="-1" aria-labelledby="settings-modal-label" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="settings-modal-label">Settings</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><ul class="list-group">' + li.join('') + '</ul></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary">Save changes</button></div></div></div></div>';
  return(modal);
}

$(document).ready(function() {
  $("#content").prepend(navigation(page));
  $('body').append(settingsModal(page));
});
