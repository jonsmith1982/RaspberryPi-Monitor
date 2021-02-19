const VERSION = 0.01;

const os = require('os');
const fs = require('fs');
const execSync = require('child_process').execSync;

module.exports.piModules = [];

if (page === 'overview') {
  fs.readdirSync("/home/simon/Repositories/RaspberryPi-Monitor/assets/js/modules/").forEach(file => {
    let moduleJS = document.createElement("script");
    moduleJS.setAttribute("src", "../assets/js/modules/" + file);
    document.body.appendChild(moduleJS);
  });
}

for(const jsFile of ['settings', page]) {
  let jsScript = document.createElement("script");
  jsScript.setAttribute("src", "../assets/js/" + jsFile + ".js");
  document.body.appendChild(jsScript);
}

const ls = window.localStorage;
const sessionStorage = window.sessionStorage;

let settings = {overview: {}, statistics: {cpu: {label: 'CPU Graph', title: 'CPU', status: true}, temperature: {label: 'Temperature Graph', title: 'Temperature', status: true}, memory: {label: 'Memory Graph', title: 'Memory', status: true}}};

function checkVersion() {
  const version = ls.getItem('pi_version') ? ls.getItem('pi_version') : VERSION;
  if (VERSION !== version) {
    // perform version update ?
    return(true);
  }
  return(false);
}

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

$(document).ready(function() {
  const upgrade = checkVersion();
  $("#content").prepend(navigation(page));
});
